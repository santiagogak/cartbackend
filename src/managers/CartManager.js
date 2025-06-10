const Cart = require('../models/carts.model.js');
const mongoose = require('mongoose');

class CartManager {

    //Constructor de la clase
    constructor() {
        this.getCarts();
    }

    //Método para agregar un carrito
    async addCart(products = []) {
        const newCart = {
            products: products
        };
        try {
            const cart = new Cart({ products: products });
            await cart.save();
            console.log("Carrito agregado:", cart);
            return cart;
        } catch (error) {
            console.log("Error al agregar el carrito:", error);
            return null;
        }
    }

    //Método para agregar un producto al carrito
    async addProductToCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            const products = cart.products || [];
            const product = products.find((p) => p._id == pid);
            let updatedCart;
            if (product) {
                updatedCart = await Cart.findByIdAndUpdate(cid, { $set: { 'products.$[elem].quantity': product.quantity + 1 } }, { arrayFilters: [{ 'elem._id': pid }], new: true });
            } else {
                updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { _id: pid, quantity: 1 } } }, { new: true });
            }
            console.log(`Producto ${pid} agregado al carrito ${cid}`);
            return updatedCart;
        } catch (error) {
            console.log("Error al agregar el carrito:", error);
            return [];
        }
    }

    //Método para obtener todos los carritos
    async getCarts() {
        try {
            const data = await Cart.find({}, "products").lean();
            if (data.length > 0) {
                return data;
            } else {
                return null;
            }
        } catch (error) {
            console.log("Error leyendo archivo de DB:", error);
            return null;
        }
    }

    //Método para obtener un carrito por su ID
    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).lean();
            if (!cart) {
                console.log(`Carrito con id ${id} no encontrado`);
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error al obtener el carrito:", error);
            return null;
        }
    }
}

module.exports = CartManager;