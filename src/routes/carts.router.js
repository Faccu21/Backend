const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cart-manager.js");
const manager = new CartManager();

router.post("/", async (req, res) => {
    try {
        await manager.addCart();
        res.send('Carrito creado correctamente');
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get("/carts", async (req, res) => {
    try {
        const carts = await manager.readCart();
        res.json(carts);
    } catch (error) {
        console.error("Error al obtener los carritos", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const cart = await manager.getCartById(cartId);
        const product = await manager.exist(productId);

        if (cart && product) {
            await manager.addProductToCart(cartId, productId);
            res.send('Producto agregado al carrito');
        } else {
            res.status(404).send('Carrito o producto no encontrado');
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
