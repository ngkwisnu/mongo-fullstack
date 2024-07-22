const mongoose = require("mongoose");

const Product = require("./models/product");

mongoose
  .connect("mongodb://127.0.0.1/dbshop")
  .then((result) => {
    console.log("connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const seedProduct = [
  {
    name: "Chips",
    description: "Crispy potato chips with a hint of salt.",
    stock: 150,
    avilabble: true,
    category: "snack",
    image: [
      "https://example.com/images/chips1.jpg",
      "https://example.com/images/chips2.jpg",
    ],
    date: "2024-07-21T00:00:00.000Z",
  },
  {
    name: "Cola",
    description: "Refreshing carbonated soft drink.",
    stock: 200,
    avilabble: true,
    category: "drink",
    image: [
      "https://example.com/images/cola1.jpg",
      "https://example.com/images/cola2.jpg",
    ],
    date: "2024-07-21T00:00:00.000Z",
  },
  {
    name: "Peanuts",
    description: "Roasted peanuts with a sprinkle of sea salt.",
    stock: 120,
    avilabble: false,
    category: "snack",
    image: [
      "https://example.com/images/peanuts1.jpg",
      "https://example.com/images/peanuts2.jpg",
    ],
    date: "2024-07-21T00:00:00.000Z",
  },
];

Product.insertMany(seedProduct)
  .then((result) => {
    console.log("Insert data success!");
  })
  .catch((err) => {
    console.log(err);
  });
