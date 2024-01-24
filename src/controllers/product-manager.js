const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.ultId = 0;

    if (path) {
      this.readFolder()
        .then(data => {
          this.products = data;
          this.ultId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : this.ultId;
        })
        .catch(error => {
          console.error("Error al leer el archivo:", error);
        });
    }
  }

  async addProduct(newObject) {
    let { title, description, price, code, stock, category, status } = newObject;

    if (!title || !description || !price || !code || !stock || !category || status === undefined) {
      return res.status(400).json({ error: "Completa todos los campos" });
    }
    if (this.products.some(item => item.code === code)) {
      return res.status(400).json({ error: "El código está repetido" });
    }

    const newProduct = {
      id: ++this.ultId,
      title,
      description,
      price,
      code,
      stock,
      category,
      status
    };

    this.products.push(newProduct);

    await this.saveFile(this.products);

    res.json({ message: "Producto agregado correctamente" });
  }


  getProducts() {
    if (this.products.length === 0) {
        const errorMessage = "No hay productos disponibles";
        console.error(errorMessage);
        return res.status(404).json({ error: errorMessage });
    }

    console.log(this.products);
    return this.products;
}

async getProductById(id) {
  try {
      const arrayProducts = await this.readFolder();
      const wanted = arrayProducts.find(item => item.id === id);
      if (!wanted) {
          const errorMessage = "Producto no encontrado";
          console.error(errorMessage);
          return res.status(404).json({ error: errorMessage });
      } else {
          console.log("Producto encontrado");
          return wanted;
      }
  } catch (error) {
      const errorMessage = "Error al leer archivo";
      console.error(errorMessage, error);
      return res.status(500).json({ error: errorMessage });
  }
}

  async readFolder() {
    try {
      const answer = await fs.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(answer);
      return arrayProducts;
    } catch (error) {
      console.log("error al leer un archivo", error);
    }
  }

  async saveFile(arrayProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    } catch (error) {
      console.log("ERROR al guardar el archivo", error);
    }
  }


  async updateProduct(id, refreshProduct, res) {
    try {
        const arrayProducts = await this.readFolder();
        const index = arrayProducts.findIndex(item => item.id === id);

        if (index !== -1) {
            const updatedProduct = { id, ...refreshProduct };

            const requiredFields = ["title", "description", "price", "code", "stock", "category", "status"];
            const hasMissingFields = requiredFields.some(field => updatedProduct[field] === undefined);

            if (hasMissingFields) {
                const errorMessage = "Error: Campos obligatorios faltantes al actualizar el producto";
                console.error(errorMessage);
                return res.status(400).json({ error: errorMessage });
            }

            arrayProducts.splice(index, 1, { id, ...refreshProduct }); 
            await this.saveFile(arrayProducts);

            res.json({ message: "Producto actualizado correctamente" });
        } else {
            console.log("No se encontró el producto");
            res.status(404).json({ error: "No se encontró el producto" });
        }
    } catch (error) {
        console.log("Error al actualizar", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
  }


  async deleteProduct(id, res) {
    try {
        const arrayProducts = await this.readFolder();
        const newArray = arrayProducts.filter(item => item.id !== id);

        if (newArray.length < arrayProducts.length) {
            await this.saveFile(newArray);
            res.json({ message: "Producto eliminado correctamente" });
        } else {
            console.log("No se encontró el producto");
            res.status(404).json({ error: "No se encontró el producto" });
        }
    } catch (error) {
        console.log("Error al eliminar el producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}


}





module.exports = ProductManager;