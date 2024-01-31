const fs = require("fs").promises;
const ProductManager = require("./product-manager.js");
const managerProduct = new ProductManager("./src/models/productos.json");

class CartManager {
    constructor() {
        this.path = "./src/models/carrito.json";
        this.ultId = 0;
    }

    async exist(id) {
        let carts = await this.readCart();
        let found = carts.find(item => item.id === id);
        return found;
    }

    async readCart() {
        try {
            const answer = await fs.readFile(this.path, "utf-8");
            let arrayCarts = JSON.parse(answer);
    
            this.ultId = Math.max(...arrayCarts.map(cart => cart.id), this.ultId);
            if (this.ultId === 0) {
                this.ultId = 1;
            } 
            return arrayCarts;
        } catch (error) {
            console.error("Error al leer o analizar el archivo", error);
            throw error;
        }
    }
    
    async addCart() {
        try {
            let cartArray = await this.readCart();
            const newCart = {
                id: ++this.ultId,
                product: []
            };
            console.log(cartArray);
            console.log(newCart);

            cartArray.push(newCart);
            await this.saveFile(cartArray);
        } catch (error) {
            console.error("Error al agregar un carrito", error);
            throw error;
        }
    }

    async saveFile(arrayCart) {
        try {
            await fs.writeFile(
                this.path,
                JSON.stringify(arrayCart, null, 2)
            );
        } catch (error) {
            console.error("Error al guardar el archivo", error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const found = await this.exist(id);
            if (!found) {
                return "Carrito no encontrado";
            } else {
                return found;
            }
        } catch (error) {
            console.error("Error al obtener un carrito por ID", error);
            throw error;
        }
    }

    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const cartById = await this.exist(cid);
            if (!cartById) {
                return "Carrito no encontrado";
            }

            const productById = await managerProduct.exist(pid);
            if (!productById) {
                return "Producto no encontrado";
            }

            const arrayCart = await this.readCart();
            const productExist = cartById.product.find(p => p.id === pid);

            if (productExist) {
                const findIndex = arrayCart.findIndex(c => c.id === cid);
                if (findIndex !== -1) {
                    productExist.quantity += quantity;
                    arrayCart.splice(findIndex, 1, { id: cid, product: [productExist] });
                    await this.saveFile(arrayCart);
                }
            } else {
                const findIndex = arrayCart.findIndex(c => c.id === cid);
                if (findIndex !== -1) {
                    cartById.product.push({ id: pid, quantity });
                    arrayCart.splice(findIndex, 1, cartById);
                    await this.saveFile(arrayCart);
                }
            }

            return cartById;
        } catch (error) {
            console.error("Error en addProductToCart:", error);
            throw error;
        }
    }
}

module.exports = CartManager;
