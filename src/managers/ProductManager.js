const Product = require('../models/products.model.js');
const mongoose = require('mongoose');

class ProductManager {

    //Constructor de la clase
    constructor() {
        this.getProducts();
    }

    //Método para agregar un producto
    async addProduct(newProduct) {
        
        const { title, description, price, thumbnail, code, stock } = newProduct;

        //Validar que estén todos los campos necesarios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return null;
        }

        try {
            const prod = new Product(newProduct);
            await prod.save();
            console.log("Producto agregado:", newProduct);
            return newProduct;
        } catch (error) {
            console.log("Error al agregar el producto:", error);
            return null;
        }
    }

    //Método para obtener todos los productos
    async getProducts() {
        try {
            const data = await Product.find({}, "title description price thumbnail code stock").lean();
            if (data.length > 0) {
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.log("Error leyendo archivo de DB:", error);
            return [];
        }
    }

    //Método para obtener un producto por su ID
    async getProductById(pid) {
        try {
            const product = await Product.findById(pid).lean();
            if (!product) {
                console.log(`Producto con id ${pid} no encontrado`);
                return null;
            }
            return product;
        } catch (error) {
            console.log("Error al obtener el producto:", error);
            return null;
        }
    }

    //Actualizar producto
    async updateProduct(pid, productData) {

        const { title, description, price, thumbnail, code, stock } = productData;

        //Validar que esté alguno de los campos necesarios
        if (!title && !description && !price && !thumbnail && !code && !stock) {
            console.log("La variable que deseas modificar no está en el listado de productos");
            return null;
        }

        try {
            const updatedProduct = await Product.findByIdAndUpdate(pid, productData, { new: true })
            console.log("Producto actualizado:", updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.log("Error al actualizar el producto:", error);
            return null;
        }
    }

    //Método para borrar un producto
    async removeProduct(pid) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(pid);
            if (!deletedProduct) {
                console.log(`Producto con ID ${pid} no encontrado`);
                return false;
            }
            console.log(`Producto con ID ${pid} eliminado`);
            return true;
        } catch (error) {
            console.log("Error al eliminar el producto:", error);
            return false;
        }
    }
}

module.exports = ProductManager;