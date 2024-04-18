const express = require("express");
const { 
  registerUser,
  loginUser, 
  logoutUser, 
  getUser, 
  loginStatus, 
  updateUser, 
  updatePassword, 
  forgetPassword,
  resetpassword} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect ,getUser);
router.get("/loginStatus", loginStatus);
router.patch("/updateUser", protect, updateUser);
router.patch("/updatePassword", protect, updatePassword);
router.post("/forgetPassword", forgetPassword);
router.put("/resetPassword/:resetToken", resetpassword);

module.exports = router;