//Importo fs y path para manejar archivos y guardo el path para el json de productos
const fs = require('fs').promises;
const path = require('path');
const PRODUCTS_FILE = path.join(__dirname, "db/products.json");
//Importo express para gestionar mi servidor
const express = require('express');
const app = express();
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Funcion para leer el archivo de productos
const readProducts = async () => {
  try {
    const fileResponse = await fs.readFile(PRODUCTS_FILE,'utf8');
    return JSON.parse(fileResponse);
  } catch (error) {
    console.log(error);
    return [];
  }
}

//Funcion para escribir el archivo de productos
const writeProducts = async (products) => {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
  } catch (error) {
    console.log(error);
  }
}

//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('./managers/ProductManager.js');
const pmanager = new ProductManager();

//Guardo los productos en el manager
const getProductsFromDB = async () => {
  try {
    const productsdb = await readProducts();
    if (productsdb.length > 0) {
      productsdb.forEach(element => {
        pmanager.addProduct(element);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

getProductsFromDB();

//GET Products
app.get('/api/product', (req, res) => {
    const products = pmanager.getProducts();
    if (products.length > 0) {
      res.status(200).json({ success: true, message: "Print producto", products: products});
    } else {
      res.status(404).send("No hay productos");
    }
});

//GET Products por ID
app.get('/api/product/:id', (req, res) => {
  const product = pmanager.getProductById(parseInt(req.params.id));
  if (product.id) { 
    res.status(200).json({ success: true, message: `Print producto ${req.params.id}`, product: product });
  } else {
    res.status(404).send(`No hay producto con ID ${req.params.id}`);
  }
});

//GET Cart
app.get('/api/cart', (req, res) => {
  res.status(200).json({ success: true, message: "Print carrito"});
});

//POST
app.post('/api/product', async (req, res) => {
  try {
    const addedProduct = pmanager.addProduct(req.body);
    if (addedProduct) {
      const newProductsList = pmanager.getProducts();
      await writeProducts(newProductsList);
      res.status(200).json({ success: true, product: addedProduct});
    }
  } catch (error) {
    console.log(error);
  }
});

//NOT FOUND
app.use((req, res) => {
  res.status(404).send("Not Found")
});
module.exports = app;