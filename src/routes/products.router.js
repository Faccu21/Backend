const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const manager = new ProductManager("./src/models/productos.json");

router.get("/", (req, res) => {

    res.send("Bienvenido");
});


router.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await manager.getProducts();

        if (!isNaN(limit)) {
            res.send(products.slice(0, limit));
        } else {
            res.send(products);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await manager.getProductById(id);

        if (product) {
            res.send(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        await manager.addProduct(newProduct);
        res.status(201).send('Producto agregado exitosamente');
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedProduct = req.body;
        await manager.updateProduct(id, updatedProduct, res);
        res.send('Producto actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await manager.deleteProduct(id, res);
        res.send('Producto eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});


module.exports = router; 