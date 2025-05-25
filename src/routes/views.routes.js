//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/ProductManager.js');
const pmanager = new ProductManager();

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//:::::::::::::: VIEWS ::::::::::::::://

//home
router.get('/', (req, res) => {
    const products = pmanager.getProducts();
    res.render('pages/home',{ products: products });
});

//realtimeproducts
router.get('/realtimeproducts', (req, res) => {
    const products = pmanager.getProducts();
    res.render('pages/realTimeProducts',{ products: products });
});

module.exports = router;