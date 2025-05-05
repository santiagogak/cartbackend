//Importo express para gestionar mi servidor
const express = require('express');
const app = express();
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('./managers/ProductManager.js');
const pmanager = new ProductManager();


//PRODUCTS

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

//POST Producto Nuevo
app.post('/api/product', async (req, res) => {
  try {
    const addedProduct = await pmanager.addProduct(req.body);
    if (addedProduct) {
      res.status(201).json({ success: true, product: addedProduct});
    } else {
      res.status(400).json({ success: false, message: 'No se pudo agregar el producto.'});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error});
  }
});

// PUT Actualizar producto
app.put('/api/product', async (req, res) => {
  try {
    const { id } = req.query;
    const updatedProduct = await pmanager.updateProduct(id,req.body);
    if (updatedProduct) {
      res.status(201).json({ success: true, product: updatedProduct});
    } else {
      res.status(400).json({ success: false, message: 'No se pudo actualizar el producto.'});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error});
  }
});

// DELETE Eliminar producto
app.delete('/api/product', async (req, res) => {
  try {
    const { id } = req.query;
    const removedProduct = await pmanager.removeProduct(id);
    if (removedProduct) {
      res.status(200).json({ success: true, message: `Producto con ID ${id} eliminado`});
    } else {
      res.status(400).json({ success: false, message: `Producto con ID ${id} a eliminar no está en el listado de productos`});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error});
  }
});




//GET Cart
app.get('/api/cart', (req, res) => {
  res.status(200).json({ success: true, message: "Print carrito"});
});

//NOT FOUND
app.use((req, res) => {
  res.status(404).send("Not Found")
});
module.exports = app;