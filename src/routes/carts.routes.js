//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();
//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('../managers/ProductManager.js');
const pmanager = new ProductManager();

//Traigo la clase CartManager para gestionar los carritos de compra
const CartManager = require('../managers/CartManager.js');
const cmanager = new CartManager();



//:::::::::::::: CARTS ::::::::::::::://

//GET Carts
router.get('/', (req, res) => {
  const carts = cmanager.getCarts();
  if (carts.length > 0) {
    res.status(200).json({ success: true, message: "Print Carritos", carts: carts });
  } else {
    res.status(404).json({success: false, message: "No hay carritos"});
  }
});

//GET Carts por ID
router.get('/:id', (req, res) => {
  const cart = cmanager.getCartById(parseInt(req.params.id));
  if (cart) {
    res.status(200).json({ success: true, message: `Print carrito ${req.params.id}`, cart: cart });
  } else {
    res.status(404).json({success: false, message: `No hay carrito con ID ${req.params.id}`});
  }
});

//POST Carts Nuevo
router.post('/', async (req, res) => {
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
router.post('/:cid/product/:pid', async (req, res) => {
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

module.exports = router;