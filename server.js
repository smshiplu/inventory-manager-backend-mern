const dotenv = require("dotenv").config();
const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require('path');

const connectDB = require("./config/connectDB");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middlewares/errorMiddleware");
const productRoute = require("./routes/productRoute");
const contactUsRoute = require('./routes/contactUsRoute');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://inventory-manager-mern.vercel.app"],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactUs", contactUsRoute);

// Route default
app.get("/", (req, res) => { 
  res.send("Home Page!");
});

//Error middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

// const startServer = async () =>  {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server started on port: ${PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
// startServer();

