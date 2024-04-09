const express = require('express');

const { 
  createProduct, 
  getAllProducts, 
  getSingleProduct, 
  deleteSingleProduct, 
  updateSingleProduct} = require('../controllers/productController');
const protect = require('../middlewares/authMIddleware');
const { upload } = require('../utils/fileUpload');

const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);
router.patch("/:id", protect, upload.single("image"), updateSingleProduct);
router.get("/", protect, getAllProducts);
router.get("/:id", protect, getSingleProduct);
router.delete("/:id", protect, deleteSingleProduct);

module.exports = router;