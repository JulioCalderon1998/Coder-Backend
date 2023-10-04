const express = require('express');

const ProductManager = require('./ProductManager.js');

const app = express();

const productos = new ProductManager("/productos.txt");

const PORT = 8080;

const Products = productos.getProducts();

app.get("/products", async (req,res) => {
    let limit = parseInt(req.query.limit);

    if(!limit) return res.send(await Products);
    
    let products = await Products
    let productLimit = products.slice(0, limit)
    res.send(productLimit);
})

app.get("/products/:id", async (req,res) => {
    let id = parseInt(req.params.id);

    const ProductById = await productos.getProductById(id);
    
    res.send(ProductById);
})

app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})