const express = require("express"); 
const router = express.Router(); 

const ProductManager = require("../controllers/product-manager.js"); 
const manager = new ProductManager("./src/models/carrito.json"); 

router.post("/", async (req, res) => {
    try {
        const newCart = await manager.addProduct({
            products: []
            
        });
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get("/carts", async (req, res) => {
    try {
        const carts = await manager.getProducts(); 
        res.json(carts)
    } catch (error) {
        console.error("Error al obtener el carrillo", error); 
        res.status(500).send('Error interno del servidor');
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await manager.getProductById(cartId);
        if (cart && productId) {
            await manager.addToCart(cartId, productId);
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