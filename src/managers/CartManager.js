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
    async addProductToCart(cid, pid, quantity = null) {
        try {
            const cart = await this.getCartById(cid);
            const products = cart.products || [];
            const product = products.find((p) => p._id == pid);
            let updatedCart;
            if (product) {
                const q = quantity || product.quantity + 1;
                updatedCart = await Cart.findByIdAndUpdate(cid, { $set: { 'products.$[elem].quantity': q } }, { arrayFilters: [{ 'elem._id': pid }], new: true });
            } else {
                const q = quantity || 1;
                updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { _id: pid, quantity: q } } }, { new: true });
            }
            console.log(`Producto ${pid} agregado al carrito ${cid}`);
            return updatedCart;
        } catch (error) {
            console.log("Error al agregar el carrito:", error);
            return [];
        }
    }

    //Metodo para agregar varios productos al carrito
    async addProductsToCart(cid, products) {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) {
                console.log(`Carrito con id ${cid} no encontrado`);
                return null;
            }
            const updatedProducts = products.map((product) => {
                const existingProduct = cart.products.find((p) => p._id == product._id);
                if (existingProduct) {
                    return { _id: product._id, quantity: product.quantity || existingProduct.quantity };
                } else {
                    return { _id: product._id, quantity: product.quantity || 1 };
                }
            });
            const updatedCart = await Cart.findByIdAndUpdate(cid, { $set: { products: updatedProducts } }, { new: true });
            console.log(`Productos agregados al carrito ${cid}`);
            return updatedCart;
        }
        catch (error) {
            console.log(`Error al agregar productos al carrito ${cid}:`, error);
            return null;
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

    //Método para eliminar todos los productos del carrito
    async clearProductsFromCart(cid) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
            console.log(`Todos los productos fueron eliminados del carrito ${cid}`);
            return true;
        } catch (error) {
            console.log(`Error al eliminar los productos del carrito ${cid}`, error);
            return false;
        }
    }

    //Método para eliminar un producto del carrito
    async removeProductFromCart(cid, pid) {
        try {
            const cart = await this.getCartById(cid);
            const products = cart.products || [];
            const product = products.find((p) => p._id == pid);
            let updatedCart;
            if (product) {
                updatedCart = await Cart.findByIdAndUpdate(cid, { $pull: { products: { _id: pid } } }, { new: true });
            } else {
                console.log(`Producto ${pid} no encontrado en el carrito ${cid}`);
                return false;
            }
            console.log(`Producto ${pid} eliminado del carrito ${cid}`);
            return true;
        } catch (error) {
            console.log(`Error al eliminar el producto ${pid} del carrito ${cid}`, error);
            return false;
        }
    }
}

module.exports = CartManager;