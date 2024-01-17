
const fs = require("fs").promises;

class ProductManager{
    static ultId = 0;

    constructor(path){
        
        this.path = path;
        this.products = [];
        if (path) {
          this.readFolder()
            .then(data => {
              this.products = data;
            })
            .catch(error => {
              console.error("Error al leer el archivo:", error);
            });
        }
      }

    async addProduct(newObject){
        let { title, description, price, img, code, stock} = newObject;

        if(!title || !description || !price || !img || !code || !stock) 
        {
           console.log("Completar todos los campos");
           return; 
        }
        if(this.products.some(item => item.code === code)){
            console. log("El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }
    
        this.products.push(newProduct);

        await this.saveFile(this.products);
    }

    getProducts(){

        console.log(this.products);
        
        return this.products;
        
        }
        

    async getProductById(id){

        try {
            const arrayProducts = await this.readFolder();
            const wanted = arrayProducts.find(item => item.id === id);
            if(!wanted){
                console.log("Producto no encontrado");
            } else {  
                console.log("Producto encontrado");
                return wanted;
            }
        } catch (error) {
            console.log("ERROR al leer archivo", error);
            
        }

       
    }

    async readFolder () {
        try {
            const answer = await fs.readFile(this.path,"utf-8");
            const arrayProducts = JSON.parse(answer);
            return arrayProducts;

        } catch (error) {
            console.log("error al leer un archivo", error);
        }
    }

    async saveFile(arrayProducts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2) );

        } catch (error) {
            console.log("ERROR al guardar el archivo", error);
        }
        
    }

    async updateProduct(id, refreshProduct ){
        try {
            const arrayProducts = await this.readFolder();
            const index = arrayProducts.findIndex(item => item.id === id);

            if(index !== -1){
                arrayProductos.splice(index, 1, refreshProduct);
                await this.saveFile(arrayProducts);
            } else {
                console.log("no se encontró el producto");
            }


        } catch (error) {
            console.log("Error al actualizar", error);
        }

    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.readFolder();
            const newArray = arrayProducts.filter(item => item.id !== id);
            await this.saveFile(newArray);
        

        } catch (error) {
            console.log("Error al eliminar el producto", error);
        }
    }

}





module.exports = ProductManager;