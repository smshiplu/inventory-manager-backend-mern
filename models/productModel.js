const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User"
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      default: "SKU"
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true
    },
    quantity: {
      type: String,
      require: [true, "Please add a quantity"],
      trim: true
    },
    price: {
      type: String,
      required: [true, "Please add a price"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    image: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model("Product", productSchema);
module.exports = Product;