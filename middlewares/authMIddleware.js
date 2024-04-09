const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const protect = asyncHandler( async (req, res, next) => {
  try {
    //If request has a token
    const token = req.cookies.token;
    if(!token) {
      res.status(401);
      throw new Error("Unauthorized, please login");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get ID from verified token
    const user = await User.findById(verified.id).select("-password");
    
    if(!user) {
      res.status(401);
      throw new Error("User not found");
    }
    req.user = user;
    next();
    
  } catch (error) {
    res.status(401);
    throw new Error("Unauthorized, please login");
  }
});

module.exports = protect;

