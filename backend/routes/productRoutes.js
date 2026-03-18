const express = require("express");
const router = express.Router();

const Product = require("../models/Product");


// ===============================
// ✅ TEST ROUTE
// ===============================
router.get("/test", (req, res) => {
  res.send("Products API Working ✅");
});


// ===============================
// ✅ GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ===============================
// ✅ POST ADD PRODUCT
// ===============================
router.post("/add", async (req, res) => {
  try {
    const newProduct = new Product(req.body);

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product Added Successfully ✅",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ DELETE ALL PRODUCTS (Simple Reset)
router.delete("/deleteAll", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "All products deleted successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// ===============================
// ✅ EXPORT ROUTER (Always at END)
// ===============================
module.exports = router;


