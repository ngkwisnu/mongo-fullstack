const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1/dbshop")
  .then((result) => {
    console.log("mongodb connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 100,
  },
  avilabble: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    enum: ["snack", "drink"],
  },
  image: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
