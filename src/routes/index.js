const express = require("express");
const router  = express.Router();
const productsRouter = require("./products.routes");
const cartsRouter = require("./carts.routes");
const viewsRouter = require("./views.routes");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use("/api/product",productsRouter);
router.use("/api/cart",cartsRouter);

//Views
router.use("/",viewsRouter);

module.exports = router; 