const express = require("express");
const router  = express.Router();
const productsRouter = require("./products.routes")
const cartsRouter = require("./carts.routes")

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/product",productsRouter);
router.use("/cart",cartsRouter);

module.exports = router; 