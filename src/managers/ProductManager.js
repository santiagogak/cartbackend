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
    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const matchStage = query
            ? {
                $match: {
                    $or: [
                        { title: { $regex: query, $options: "i" } },
                        { description: { $regex: query, $options: "i" } },
                        { code: { $regex: query, $options: "i" } },
                    ],
                },
            }
            : { $match: {} };
            
            const sortStage = sort === "asc"
            ? { $sort: { price: 1 } }
            : sort === "desc"
            ? { $sort: { price: -1 } }
            : { $sort: { _id: 1 } };
            
            const skipStage = { $skip: (Number(page) - 1) * Number(limit) };
            const limitStage = { $limit: Number(limit) };
            
            const projectionStage = {
                $project: {
                    title: 1,
                    description: 1,
                    price: 1,
                    thumbnail: 1,
                    code: 1,
                    stock: 1,
                },
            };
            const pipeline = [
                matchStage,
                sortStage,
                skipStage,
                limitStage,
                projectionStage,
            ];
            
            const products = await Product.aggregate(pipeline);
            // Obtener total de documentos que coinciden con el filtro
            const totalDocs = await Product.aggregate([
                matchStage,
                { $count: "total" },
            ]);
            
            const totalCount = totalDocs[0]?.total || 0;
            const totalPages = Math.ceil(totalCount / limit);

            return {
                payload: products,
                totalDocs: totalCount,
                totalPages,
                page: Number(page),
                limit: Number(limit),
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
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