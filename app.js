const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.json({ limit: "5mb" }));
const dotenv = require('dotenv')
dotenv.config()

const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET

const mongoUrl = process.env.MONGO_URL  
const PORT = process.env.PORT || 5000;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
const User = mongoose.model("UserInfo");
app.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const encryptedPassword = await bycrypt.hash(password, 15);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.send({ error: "User Exists" });
    }
    await User.create({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bycrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

require("./productsDetails");
const Products = mongoose.model("ProductInfo");

app.post("/products", async (req, res) => {
  // console.log(req.body);
  const products = new Products(req.body);
  try {
    await products.save();
    res.status(201).json({ products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/product", async (req, res) => {
  try {
    const products = await Products.find();
    res.json({ products: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/product/:id", async (req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query,
  });
  try {
    const {id: productId} = req.params;
    console.log(productId);
    const product = await Products.findById(productId);
    console.log(results);
    if (!product) {
      res.status(404).json({ error: "product not found" });
    }
    res.json({ product });
  } catch (e) {
    res.status(500).json({ error: "something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
