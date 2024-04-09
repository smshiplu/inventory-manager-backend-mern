const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const sendEmail = require("../utils/sendEmail");

// Generate Token  
const generateToken = (id) => {
  const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
  return token;
}

// Register user
const registerUser = asyncHandler( async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Please enter password minimum 6 characters");
  }

  //If user already exists
  const userExists  = await User.findOne({email});
  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Encrypt password before saving into database 
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  //Create new user
  const user = await User.create({
    name,
    email,
    // password: hashedPassword
    password
  });

  //Generate token
  const token = generateToken(user._id);

  // Send HTTP-Only Cookie
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true
  })

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id, name, email, photo, phone, bio, token
    })
  } else {
    res.status(400);
    throw new Error("User cannot be created");
  }

});

// Login user
const loginUser = asyncHandler( async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    res.status(400);
    throw new Error("Please add Email and Password");
  }

  // Check if user already exists
  const user = await User.findOne({email});
  if(!user) {
    res.status(400);
    throw new Error("User not found. Please signup");
  }

  // User exists now check password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // Generate token
  const token = generateToken(user._id);

  // Send HTTP-Only Cookie
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true
  })

  if(user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id, name, email, photo, phone, bio, token
    })
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout user
const logoutUser =  asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    expires: new Date(0),
    sameSite: "none",
    secure: true
  });
  return res.status(200).json({ message: "User logout successfully" });
});

// Get user data
const getUser = asyncHandler (async (req, res) => {
  const user = await User.findById(req.user.id);
  if(user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id, name, email, photo, phone, bio
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// Get logged in status
const loginStatus = asyncHandler( async (req, res) => { 
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if(verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Update user profile
const updateUser = asyncHandler( async (req, res) => {

  const user = await User.findOne(req.user._id);
  if(user) {
    const { name, email, phone, bio, photo } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id, 
      name: updatedUser.name, 
      email: updatedUser.email, 
      phone: updatedUser.phone, 
      bio: updatedUser.bio, 
      photo: updatedUser.photo
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// Update user password
const updatePassword = asyncHandler( async (req, res) => {
  const user = await User.findOne(req.user._id);

  if(user) {
    const { oldPassword, password } = req.body;

    if(!oldPassword || !password) {
      res.status(400);
      throw new Error("Please add old ane new password")
    }

    if(password.length < 6) {
      throw new Error("Please enter password minimum 6 characters");
    }

    // Check OldPassword is matched with the password in DB
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if(isPasswordMatched) {
      user.password = password;
      await user.save();
      res.status(200).send("Password updated successfully");
    } else {
      res.status(400);
      throw new Error("Old password is incorrect");
    }

  } else {
    res.status(400);
    throw new Error("User not found");
  }
}); 

// Forget password
const forgetPassword = asyncHandler( async (req, res) => {
  const {email} = req.body;

  const user = await User.findOne({email});
  if(!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // Delete any previous token exists in BD
  const previousToken = await Token.findOne({userID: user._id});
  if(previousToken) {
    await Token.deleteOne(previousToken);
  }

  // Create password reset Token
  const resetToken = crypto
  .randomBytes(32)
  .toString("hex") + user._id;
  // console.log(resetToken);
  
  // Hash Token before saving to DB
  const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (1000 * 60)
  }).save();

  // Construct reset url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Construct Message
  const message = `
    <h1>Hello ${user.name}</h1>
    <p>Please use url below to reset your password.</p>
    <p>This link is valid only for 30 minutes.</p>
    <a href=${resetUrl} clicktracking="off" target="_blank">${resetUrl}</a>
    <p>Regards...</p>
    <p>Nasir Uddin</p>
  `;

  const subject = "Reset Password Response";
  const send_to = email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_from, send_to);
    res.status(200).json({ success: true, message: "Email send successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

// Reset the password
const resetpassword =  asyncHandler( async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  // Make token hashed 
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
  // Compare hashed token with the token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: {$gt: Date.now()}
  });

  if(!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token")
  }

  // Find user with the userToken
  const user = await User.findOne(userToken.userId);
  user.password = password;
  await user.save();

  if(!user) {
    res.status(400);
    throw new Error("Invalid or expired token")
  }
  res.status(200).json({message: "Password reset successful, please login"});
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  updatePassword,
  forgetPassword,
  resetpassword
}