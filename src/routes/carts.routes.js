//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();
const { getCartsController, getCartByIdController, addCartController, addProductToCartController } = require('../controllers/carts.controller.js');

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//GET Carts
router.get('/', getCartsController);
router.get('/:id', getCartByIdController);
router.post('/', addCartController);
router.post('/:cid/product/:pid', addProductToCartController);

module.exports = router;