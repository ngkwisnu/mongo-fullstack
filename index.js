const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

// Models
const Product = require("./models/product");

mongoose
  .connect("mongodb://127.0.0.1/dbshop")
  .then((result) => {
    console.log("mongodb connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/products", async (req, res) => {
  const { category } = req.query;
  console.log(category);
  if (category) {
    const products = await Product.find({ category: category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find();
    res.render("products/index", { products, category });
  }
});

app.get("/add-products", async (req, res) => {
  res.render("products/add-products");
});

app.get("/edit-products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  res.render("products/edit-products", { product });
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  console.log("Berhasil menyimpan data!");
  res.redirect(`/products/${product.id}`);
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndUpdate(id, req.body, { runValidators: true });
  console.log("Berhasil update data!");
  res.redirect(`/products/${id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  console.log("Berhasil delete data!");
  res.redirect(`/products`);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.render("products/detail", { product });
  } catch (error) {
    console.log(error);
    res.render("products/404page");
  }
});

app.listen(8080, () => {
  console.log("app listen in http://localhost:8080");
});
