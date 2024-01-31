const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager");
const productManager = new ProductManager();

router.get("/", (req, res) => {
    res.render("index", { titulo: "Proyecto" });
})



router.get("/home", (req, res) => {
    const products = productManager.getProducts();
    res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { titulo: "Real-Time Products", products: getProductList() });
});


module.exports = router;