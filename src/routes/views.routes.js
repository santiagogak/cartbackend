//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager.js');
const CartManager = require('../managers/CartManager.js');
const pmanager = new ProductManager();
const cmanager = new CartManager();

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//:::::::::::::: VIEWS ::::::::::::::://

//home
router.get('/', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host');
    const carts = await cmanager.getCarts();
    const cid = carts.length > 0 ? carts[0]._id : null;
    const products = await pmanager.getProducts(req.query, baseUrl);
    res.render('pages/home',{ cartId: cid, products: products.payload, ...products });
});

//realtimeproducts
router.get('/realtimeproducts', async (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host') + '/realtimeproducts';
    const products = await pmanager.getProducts(req.query, baseUrl);
    res.render('pages/realTimeProducts',{ products: products.payload, ...products });
});

//cart
router.get('/carts/:id', async (req, res) => {
    const cart = await cmanager.getCartById(req.params.id);
    res.render('pages/carts',{ cart: cart });
});

module.exports = router;