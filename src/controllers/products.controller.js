const { getIO } = require('../config/socket.js');

//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('../managers/ProductManager.js');
const pmanager = new ProductManager();

//:::::::::::::: PRODUCTS ::::::::::::::://

//GET Products
const getProductsController = async (req, res) => {
  try {
    const products = await pmanager.getProducts(req.query);
    if (products && products.totalDocs > 0) {
      res.status(200).json({ success: true, message: "Print producto", ...products });
    } else {
      res.status(404).json({ success: false, message: "No hay productos" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

//GET Products por ID
const getProductByIdController = async (req, res) => {
  try {
    const product = await pmanager.getProductById(req.params.id);
    if (product) {
      res.status(200).json({ success: true, message: `Print producto ${req.params.id}`, product: product });
    } else {
      res.status(404).json({ success: false, message: `No hay producto con ID ${req.params.id}` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

//POST Producto Nuevo
const addProductController = async (req, res) => {
  try {
    const addedProduct = await pmanager.addProduct(req.body);
    const products = await pmanager.getProducts();
    if (addedProduct) {
      const io = getIO();
      io.emit('actualizarProductos', products.payload);
      res.status(201).json({ success: true, product: addedProduct });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo agregar el producto.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

// PUT Actualizar producto
const updateProductController = async (req, res) => {
  try {
    const { id } = req.query;
    const updatedProduct = await pmanager.updateProduct(id, req.body);
    const products = await pmanager.getProducts();
    if (updatedProduct) {
      const io = getIO();
      io.emit('actualizarProductos', products.payload);
      res.status(201).json({ success: true, product: updatedProduct });
    } else {
      res.status(400).json({ success: false, message: 'No se pudo actualizar el producto.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

// DELETE Eliminar producto
const removeProductController = async (req, res) => {
  try {
    const { id } = req.query;
    const removedProduct = await pmanager.removeProduct(id);
    const products = await pmanager.getProducts();
    if (removedProduct) {
      const io = getIO();
      io.emit('actualizarProductos', products.payload);
      res.status(200).json({ success: true, message: `Producto con ID ${id} eliminado` });
    } else {
      res.status(400).json({ success: false, message: `Producto con ID ${id} a eliminar no está en el listado de productos` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

module.exports = {
  getProductsController,
  getProductByIdController,
  addProductController,
  updateProductController,
  removeProductController
};