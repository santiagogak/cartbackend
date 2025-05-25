//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();

const { getIO } = require('../sockets/socket.js');

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('../controllers/ProductManager.js');
const pmanager = new ProductManager();

//:::::::::::::: PRODUCTS ::::::::::::::://

//GET Products
router.get('/', (req, res) => {
  const products = pmanager.getProducts();
  if (products.length > 0) {
    res.status(200).json({ success: true, message: "Print producto", products: products });
  } else {
    res.status(404).json({success: false, message: "No hay productos"});
  }
});

//GET Products por ID
router.get('/:id', (req, res) => {
  const product = pmanager.getProductById(parseInt(req.params.id));
  if (product) {
    res.status(200).json({ success: true, message: `Print producto ${req.params.id}`, product: product });
  } else {
    res.status(404).json({success: false, message: `No hay producto con ID ${req.params.id}`});
  }
});

//POST Producto Nuevo
router.post('/', async (req, res) => {
  try {
    const addedProduct = await pmanager.addProduct(req.body);
    if (addedProduct) {
      const io = getIO();
      io.emit('actualizarProductos', pmanager.getProducts());
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
router.put('/', async (req, res) => {
  try {
    const { id } = req.query;
    const updatedProduct = await pmanager.updateProduct(id, req.body);
    if (updatedProduct) {
      const io = getIO();
      io.emit('actualizarProductos', pmanager.getProducts());
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
router.delete('/', async (req, res) => {
  try {
    const { id } = req.query;
    const removedProduct = await pmanager.removeProduct(id);
    if (removedProduct) {
      const io = getIO();
      io.emit('actualizarProductos', pmanager.getProducts());
      res.status(200).json({ success: true, message: `Producto con ID ${id} eliminado` });
    } else {
      res.status(400).json({ success: false, message: `Producto con ID ${id} a eliminar no está en el listado de productos` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
});

module.exports = router;