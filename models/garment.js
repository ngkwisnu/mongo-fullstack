const mongoose = require("mongoose");
const Product = require("./product");

mongoose
  .connect("mongodb://127.0.0.1/dbshop")
  .then((result) => {
    console.log("Koneksi Berhasil!");
  })
  .catch((err) => {
    console.log(err);
  });

const garmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama tidak boleh kosong!"],
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Kontak tidak boleh kosong!"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

garmentSchema.post("findOneAndDelete", async function (garment) {
  if (garment.products.length) {
    const res = await Product.deleteMany({ _id: { $in: garment.products } });
    console.log(res);
  }
});

const Garment = mongoose.model("Garment", garmentSchema);

module.exports = Garment;
