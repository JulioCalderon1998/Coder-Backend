const { Console } = require('console');
const fs = require('fs')

class ProductManager {

    static id = 0

    constructor() {
        this.path = "./productos.txt";
        this.products = []; 
    }


    addProduct = async (title, description, price, thumbnail, code, stock) => {


        if(this.products.find((producto) => producto.code === code)) {
            console.log(`Error! El codigo ${code} ya existe`);
            return;
        } 
        

        let newProduct = {
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock,
            id: ProductManager.id
        }


        if(!Object.values(newProduct).includes(undefined)){
            ProductManager.id++
            this.products.push(newProduct)
            
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                console.log('Producto agregado y archivo actualizado exitosamente.');
              } catch (error) {
                console.error('Error al escribir en el archivo:', error);
              }

        } else{
            console.log("Error! Todos los campos son requeridos");
            return;
        }

        
    }

    

    getProducts = async() => {
        let resultado = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(resultado)
    }

    
    getProductById = async(id) => {
        try {
            let resultado = await fs.promises.readFile(this.path, "utf-8")
            const products = JSON.parse(resultado); 

            const product = products.find((product) => product.id === id);

            if(!product) {
                console.log("No se encontró el producto")
            } else {            
                return product
            }
        } catch (error) {
            console.log("Error al leer el archivo!");
        }       
    } 

    
    updateProduct = async({id, ...producto}) => {
        try {
            let resultado = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(resultado); 

            const product = products.find((product) => product.id === id);

            if(!product) {
                console.log("No se encontró el producto");
                return;
            }

            await this.deleteProduct(id);  

            const previousProducts = JSON.parse(await fs.promises.readFile(this.path, "utf-8")); 

            let newProducts = [{id, ...producto}, ...previousProducts];

            await fs.promises.writeFile(this.path, JSON.stringify(newProducts))
            
            console.log(`Se actualizó el producto id ${id}`)

        } catch (error) {
            console.log("Error en el manejo de archivos!");
        }
    }


    deleteProduct = async(id) => {
        let resultado = await fs.promises.readFile(this.path, "utf-8")
        const products = JSON.parse(resultado); 

        if (!products.find((product) => product.id === id)) {
            console.log("No se encontró el producto");
            return;
        }

        let newProducts = products.filter((product) => product.id !== id);

        await fs.promises.writeFile(this.path, JSON.stringify(newProducts))

        console.log("Operación Exitosa!")
    }

}


module.exports = ProductManager;
