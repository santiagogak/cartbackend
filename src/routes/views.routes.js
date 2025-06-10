//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager.js');
const pmanager = new ProductManager();

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//:::::::::::::: VIEWS ::::::::::::::://

//home
router.get('/', async (req, res) => {
    const products = await pmanager.getProducts();
    res.render('pages/home',{ products: products });
});

//realtimeproducts
router.get('/realtimeproducts', async (req, res) => {
    const products = await pmanager.getProducts();
    res.render('pages/realTimeProducts',{ products: products });
});

module.exports = router;