//Importo express para gestionar mi servidor
const express = require('express');
const router = express.Router();
const { getCartsController, getCartByIdController, addCartController, addProductToCartController, removeProductFromCartController, clearCartController, addProductsToCartController } = require('../controllers/carts.controller.js');

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//GET Carts
router.get('/', getCartsController);
router.get('/:id', getCartByIdController);
router.post('/', addCartController);
router.post('/:cid/product/:pid', addProductToCartController);
router.put('/:cid/product/:pid', addProductToCartController);
router.put('/:cid', addProductsToCartController);
router.delete('/:cid/product/:pid', removeProductFromCartController);
router.delete('/:id', clearCartController);

module.exports = router;