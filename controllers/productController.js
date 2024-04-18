const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { formatBytes } = require('../utils/fileUpload');
const cloudinary = require('cloudinary').v2;

// Create Product
const createProduct = asyncHandler( async (req, res) => { 
  const { name, sku, category, quantity, price, description } = req.body;

  if( !name || !category || !quantity || !price || !description ) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  // Handle file upload
  let fileData = {};
  if(req.file) {

    // Save image to Cloudinary
    if(process.env.NODE_ENV === "production") {
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Pinvent App", resource_type: "image" });
  
      } catch (error) {
        res.status(500);
        throw new Error("Image couldn't be uploaded");
      }
    }
    
    fileData = {
      fileName: req.file.originalname,
      // filePath: req.file.path,
      filePath: process.env.NODE_ENV === "production" ? uploadedFile.secure_url : req.file.path,
      fileType: req.file.mimetype,
      fileSize: formatBytes(req.file.size, 2)
    }
  }

  // Create product
  const createProduct = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData
  });

  if (!createProduct) {
    res.status(400);
    throw new Error("Product cannot be created. try again");
  } 
  res.status(201).json(createProduct);
});

// Get all products
const getAllProducts = asyncHandler( async (req, res) => {
  const productList = await Product.find({user: req.user._id}).sort("-createdAt");
  if(!productList) {
    res.status(500);
    throw new Error("No product found");
  }
  res.status(200).json(productList);
});

// Get single product
const getSingleProduct = asyncHandler( async (req, res) => {
  const {id} = req.params;
  const product = await Product.findById(id);

  // Check if product exists
  if(!product) {
    res.status(404);
    throw new Error("No product found");
  }

  // Match products to it's user
  if(product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json(product);
});

// Delete single product
const deleteSingleProduct = asyncHandler( async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if(!product) {
    res.status(404);
    throw new Error("No product found");
  }

  // Match product to it's user
  if(product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Product.findByIdAndDelete(id);
  res.status(200).json({ message: "Product deleted" });
});

// Update Single Product
const updateSingleProduct = asyncHandler( async (req, res) => { 
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);
  // Check if product exists
  if(!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  
  // Match product to it's user
  if(product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Handle file upload
  let fileData = {};

  if(req.file) {
    // Save image to Cloudinary
    let uploadedFile;
    if(process.env.NODE_ENV !== "development") {
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Pinvent App", resource_type: "image" });
  
      } catch (error) {
        res.status(500);
        throw new Error("Image couldn't be uploaded");
      }
    }


    fileData = {
      fileName: req.file.originalname,
      // filePath: req.file.path,
      filePath: process.env.NODE_ENV !== "development" ?  uploadedFile.secure_url : req.file.path,
      fileType: req.file.mimetype,
      fileSize: formatBytes(req.file.size, 2)
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    {_id: id}, 
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedProduct) {
    res.status(400);
    throw new Error("Product cannot be created. try again");
  } 
  res.status(201).json(updatedProduct);
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteSingleProduct,
  updateSingleProduct
}