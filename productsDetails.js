const mongoose = require("mongoose");

const ProductDetailsSchema = new mongoose.Schema(
  {
    image: String,
    time: Number,
    title: String,
    subtitle: String,
    logo: String,
    name: String,
    namesecond: String,
    date:String,
    intro: String,
    product: [
      {
        productid: Number,
        producttitle: String,
        productimage: String,
        description: String,
        linkdescription: String,
        price: Number,
        productlink: String,
      },
    ],
  },
  {
    collection: "ProductInfo",
  }
);

module.exports = mongoose.model("ProductInfo", ProductDetailsSchema);
