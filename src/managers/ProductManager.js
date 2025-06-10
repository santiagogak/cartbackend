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
    async getProducts({ limit = 10, page = 1, sort, query } = {}, baseUrl = '') {
        try {

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort == 'asc'? 1 : -1} : {_id: 1},
                lean: true
            }
            
            const results = await Product.paginate({}, options);

            const sortString = sort ? `sort=${sort}` : '';
            const queryString = query ? `query=${query}` : '';
            let fullUrl = baseUrl+'/?';
            fullUrl += queryString ? `${queryString}` : '';
            fullUrl += sortString ? `${queryString ? '&' : ''}${sortString}&` : '';

            return {
                payload: results.docs,
                totalDocs: results.totalDocs,
                totalPages: results.totalPages,
                page: results.page,
                limit: results.limit,
                hasPrevPage: results.hasPrevPage,
                hasNextPage: results.hasNextPage,
                prevPage: results.prevPage,
                nextPage: results.nextPage,
                prevLink: results.hasPrevPage ? `${fullUrl}limit=${results.limit}&page=${results.prevPage}` : null,
                nextLink: results.hasNextPage ? `${fullUrl}limit=${results.limit}&page=${results.nextPage}` : null
            };

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