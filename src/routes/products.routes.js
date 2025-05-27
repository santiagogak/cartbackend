//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();
const { getProductsController, getProductByIdController, addProductController, updateProductController, removeProductController } = require('../controllers/products.controller.js');


//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//PRODUCTS ROUTES
router.get('/', getProductsController);
router.get('/:id', getProductByIdController);
router.post('/', addProductController);
router.put('/', updateProductController);
router.delete('/', removeProductController);

module.exports = router;