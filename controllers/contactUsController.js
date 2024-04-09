const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler( async (req, res) => {
  const { subject, message } = req.body;
  if(!subject || !message) {
    res.status(400);
    throw new Error("Subject or Message cannot be empty");
  }

  const send_from = process.env.EMAIL_USER
  const send_to = process.env.EMAIL_USER
  const reply_to = req.user.email;
  
  try {
    await sendEmail(subject, message, send_from, send_to, reply_to);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(400);
    throw new Error("Email cannot be send. try again.")
  }

});

module.exports = {
  contactUs
}