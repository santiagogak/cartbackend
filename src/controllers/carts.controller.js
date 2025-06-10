//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('../managers/ProductManager.js');
const pmanager = new ProductManager();

//Traigo la clase CartManager para gestionar los carritos de compra
const CartManager = require('../managers/CartManager.js');
const cmanager = new CartManager();


//GET Carts
const getCartsController = async (req, res) => {
  try {
    const carts = await cmanager.getCarts();
    if (carts) {
      res.status(200).json({ success: true, message: "Print Carritos", carts: carts });
    } else {
      res.status(404).json({ success: false, message: "No hay carritos" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

//GET Carts por ID
const getCartByIdController = async (req, res) => {
  try {
    const cart = await cmanager.getCartById(req.params.id);
    if (cart) {
      res.status(200).json({ success: true, message: `Print carrito ${req.params.id}`, cart: cart });
    } else {
      res.status(404).json({ success: false, message: `No hay carrito con ID ${req.params.id}` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

//POST Carts Nuevo
const addCartController = async (req, res) => {
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
};

//POST Y PUT Producto al cart
const addProductToCartController = async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body?.quantity;
  try {
    const cart = await cmanager.getCartById(cid);
    const product = await pmanager.getProductById(pid);
    if (cart) {
      if (product) {
        const addedCart = await cmanager.addProductToCart(cid, pid, quantity);
        if (addedCart) {
          res.status(201).json({ success: true, cart: addedCart });
        } else {
          res.status(400).json({ success: false, message: 'No se pudo agregar el carrito.' });
        }
      } else {
        res.status(404).json({ success: false, message: `No hay producto con ID ${pid}` });
      }
    } else {
      res.status(404).json({ success: false, message: `No hay carrito con ID ${cid}` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

//PUT Varios productos al cart
const addProductsToCartController = async (req, res) => {
  const { cid } = req.params;
  const productsBody = req.body.products || [];
  
  //Validamos que los productos que vienen en el body estén en la base de datos
  const products = await Promise.all(productsBody.map( async (p) => {
    try {
      const checked = await pmanager.getProductById(p._id);
      return checked ? p : null;
    } catch (error) {
      return null;
    }
  }));
  const validProducts = products.filter(p=> p !== null && p !== undefined);

  try {
    const cart = await cmanager.getCartById(cid);
    if (cart) {
      const updatedCart = await cmanager.addProductsToCart(cid, validProducts);
      if (updatedCart) {
        res.status(201).json({ success: true, cart: updatedCart });
      } else {
        res.status(400).json({ success: false, message: 'No se pudo agregar los productos al carrito.' });
      }
    } else {
      res.status(404).json({ success: false, message: `No hay carrito con ID ${cid}` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};


//DELETE Todos los productos del cart
const clearCartController = async (req, res) => {
  try {
    const cart = await cmanager.clearProductsFromCart(req.params.id);
    if (cart) {
      res.status(200).json({ success: true, message: "Carrito sin productos"});
    } else {
      res.status(404).json({ success: false, message: "No hay carrito con id " + req.params.id });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
}

//DELETE Producto del cart
const removeProductFromCartController = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cmanager.getCartById(cid);
    if (cart) {
      const removedProduct = await cmanager.removeProductFromCart(cid, pid);
      if (removedProduct) {
        res.status(201).json({ success: true, cart: removedProduct });
      } else {
        res.status(400).json({ success: false, message: 'No se pudo eliminar el producto del carrito.' });
      }
    } else {
      res.status(404).json({ success: false, message: `No hay carrito con ID ${cid}` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
}

module.exports = {
  getCartsController,
  getCartByIdController,
  addCartController,
  addProductToCartController,
  addProductsToCartController,
  removeProductFromCartController,
  clearCartController
};