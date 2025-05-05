//Importo express para gestionar mi servidor
const express = require('express');
const app = express();
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('./managers/ProductManager.js');
const pmanager = new ProductManager();

//Traigo la clase CartManager para gestionar los carritos de compra
const CartManager = require('./managers/CartManager.js');
const cmanager = new CartManager();


//:::::::::::::: PRODUCTS ::::::::::::::://

//GET Products
app.get('/api/product', (req, res) => {
  const products = pmanager.getProducts();
  if (products.length > 0) {
    res.status(200).json({ success: true, message: "Print producto", products: products });
  } else {
    res.status(404).json({success: false, message: "No hay productos"});
  }
});

//GET Products por ID
app.get('/api/product/:id', (req, res) => {
  const product = pmanager.getProductById(parseInt(req.params.id));
  if (product) {
    res.status(200).json({ success: true, message: `Print producto ${req.params.id}`, product: product });
  } else {
    res.status(404).json({success: false, message: `No hay producto con ID ${req.params.id}`});
  }
});

//POST Producto Nuevo
app.post('/api/product', async (req, res) => {
  try {
    const addedProduct = await pmanager.addProduct(req.body);
    if (addedProduct) {
      res.status(201).json({ success: true, product: addedProduct });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo agregar el producto.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
});

// PUT Actualizar producto
app.put('/api/product', async (req, res) => {
  try {
    const { id } = req.query;
    const updatedProduct = await pmanager.updateProduct(id, req.body);
    if (updatedProduct) {
      res.status(201).json({ success: true, product: updatedProduct });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo actualizar el producto.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
});

// DELETE Eliminar producto
app.delete('/api/product', async (req, res) => {
  try {
    const { id } = req.query;
    const removedProduct = await pmanager.removeProduct(id);
    if (removedProduct) {
      res.status(200).json({ success: true, message: `Producto con ID ${id} eliminado` });
    } else {
      res.status(400).json({ success: false, message: `Producto con ID ${id} a eliminar no está en el listado de productos` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
});



//:::::::::::::: CARTS ::::::::::::::://

//GET Carts
app.get('/api/cart', (req, res) => {
  const carts = cmanager.getCarts();
  if (carts.length > 0) {
    res.status(200).json({ success: true, message: "Print Carritos", carts: carts });
  } else {
    res.status(404).json({success: false, message: "No hay carritos"});
  }
});

//GET Carts por ID
app.get('/api/cart/:id', (req, res) => {
  const cart = cmanager.getCartById(parseInt(req.params.id));
  if (cart) {
    res.status(200).json({ success: true, message: `Print carrito ${req.params.id}`, cart: cart });
  } else {
    res.status(404).json({success: false, message: `No hay carrito con ID ${req.params.id}`});
  }
});

//POST Carts Nuevo
app.post('/api/cart', async (req, res) => {
  try {
    const addedCart = await cmanager.addCart(req.body.products || []);
    if (addedCart) {
      res.status(201).json({ success: true, cart: addedCart });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo agregar el carrito.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
});

//POST Producto al cart
app.post('/api/cart/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cmanager.getCartById(parseInt(cid));
    const product = await pmanager.getProductById(parseInt(pid));
    if (cart) {
      if (product) {
        const addedCart = await cmanager.addProductToCart(cid, pid);
        if (addedCart) {
          res.status(201).json({ success: true, cart: addedCart });
        } else {
          res.status(400).json({ success: false, message: 'No se pudo agregar el carrito.' });
        }
      } else {
        res.status(404).json({success: false, message: `No hay producto con ID ${pid}`});
      }
    } else {
      res.status(404).json({success: false, message: `No hay carrito con ID ${cid}`});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
});


//:::::::::::::: NOT FOUND ::::::::::::::://

//NOT FOUND
app.use((req, res) => {
  res.status(404).send("Not Found")
});

module.exports = app;