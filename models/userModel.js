const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"]
    },

    email: {
      type: String,
      required: [true, "Please Enter an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        " Please enter a valid email"
      ]
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: [6, "Password cannot be less than 6 characters"]
    },

    photo: {
      type: String,
      required: [true, "Please chose a photo"],
      default: "https://res.cloudinary.com/dvp51ew3h/image/upload/v1710844240/bookMarker/wkx75c3fzglpsa2bfh4d.jpg"
    },

    phone: {
      type: String,
      default: "+880"
    },

    bio: {
      type: String,
      maxLength: [250, "Bio must not be more than 250 characters"],
      default: "My Bio"
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password before saving into database
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;