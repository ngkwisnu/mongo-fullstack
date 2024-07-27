const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ErrorHandler = require("./ErrorHandler");

// Models
const Product = require("./models/product");
const Garment = require("./models/garment");

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

const wrapAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get(
  "/garments",
  wrapAsync(async (req, res) => {
    const garments = await Garment.find();
    res.render("garments/index", { garments });
  })
);

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

app.get("/garments/:garment_id/products/add-products", async (req, res) => {
  const { garment_id } = req.params;
  console.log(garment_id);
  res.render("products/add-products", { garment_id });
});

app.get(
  "/add-garment",
  wrapAsync(async (req, res) => {
    res.render("garments/create");
  })
);

app.post(
  "/garments",
  wrapAsync(async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    res.redirect("/garments");
  })
);

app.get(
  "/garment/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const garment = await Garment.findById(id).populate("products");
    res.render("garments/show", { garment });
  })
);

app.get(
  "/edit-garment/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const garment = await Garment.findById(id);
    res.render("garments/edit", { garment });
  })
);

app.put(
  "/garments/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const garment = await Garment.findByIdAndUpdate(id, req.body);
    await garment.save();
    res.redirect(`/garment/${id}`);
  })
);

app.delete(
  "/garments/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Garment.findOneAndDelete({ _id: id });
    res.redirect("/garments");
  })
);

app.get(
  "/edit-products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render("products/edit-products", { product });
  })
);

app.post(
  "/garments/:garment_id/products",
  wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    const garment = await Garment.findById(garment_id);
    const product = new Product(req.body);
    product.garment.push(garment);
    garment.products.push(product);
    console.log(garment);
    console.log(product);
    await product.save();
    await garment.save();
    console.log("Berhasil menyimpan data!");
    res.redirect(`/garment/${garment_id}`);
  })
);

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
    const product = await Product.findById(id).populate("garment");
    const [garment] = product.garment;
    const { products } = await Garment.findById(garment.id).populate(
      "products"
    );
    console.log(products);
    res.render("products/detail", { product, products });
  } catch (error) {
    console.log(error);
    res.render("products/404page");
  }
});

const validatorHandler = (err) => {
  err.status = 400;
  err.message = Object.values(err.errors).map((item) => item.message);
  return new ErrorHandler(err.status, err.message);
};

app.use((err, req, res, next) => {
  console.dir(err);
  console.log(err.name);
  if (err.name == "ValidationError") err = validatorHandler(err);
  if (err.name == "CastError") {
    err.status = 404;
    err.message = "Product not found!";
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Somethings wrong!" } = err;
  res.status(status).send(message);
});

app.use((req, res) => {
  res.status(404).send("Page not found!");
});

app.listen(8080, () => {
  console.log("app listen in http://localhost:8080");
});
