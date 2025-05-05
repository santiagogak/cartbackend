const { readProducts, writeProducts } = require('../utils/fileHandler.js');

class ProductManager {
    
    //Constructor de la clase
    constructor() {
        this.products = [];
        this.currentId = 0;
        this.getProductsFromDB();
    }

    //Método para agregar un producto
    async addProduct({ title, description, price, thumbnail, code, stock }) {
        //Validar que estén todos los campos necesarios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }
        //Validar que el código sea único
        if (this.products.find((p) => p.code === code)) {
            console.log("El código ya existe");
            return;
        }

        const newProduct = {
            id: this.currentId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        try {
            await writeProducts(this.products);
            console.log("Producto agregado:", newProduct);
        } catch (error) {
            this.products.pop();
            this.currentId--;
            console.log("Error al agregar el producto:", error);
        }
        return newProduct;
    }

    //Método para obtener todos los productos
    getProducts() {
        return this.products;
    }

    //Método para obtener un producto por su ID
    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.log(`Producto con id ${id} no encontrado`);
            return;
        }
        return product;
    }

    //Actualizar producto
    async updateProduct(id, { title, description, price, thumbnail, code, stock }) {
        //Validar que esté alguno de los campos necesarios
        if (!title && !description && !price && !thumbnail && !code && !stock) {
            console.log("La variable que deseas modificar no está en el listado de productos");
            return;
        }

        let updatedProduct;
        //Validar que el código sea único
        const newList = this.products.map((p) => {
            if (p.id == id) {
                p.title = title || p.title;
                p.description = description || p.description;
                p.price = price || p.price;
                p.thumbnail = thumbnail || p.thumbnail;
                p.code = code || p.code;
                p.stock = stock || p.stock;
                updatedProduct = p;
                return p;
            } else {
                return p;
            }
        });
        if (updatedProduct) {
            try {
                await writeProducts(newList);
                this.products = newList;
                console.log("Producto actualizado:", updatedProduct);
            } catch (error) {
                console.log("Error al actualizar el producto:", error);
            }
        }
        return updatedProduct;
    }
    
    //Método para borrar un producto
    async removeProduct(id) {
        //Hacer nueva lista de producto sin el producto con id
        let isID = false;
        const result = this.products.filter((p) => {
            if (p.id == id) {
                isID = true;
            } else {
                return p;
            }
        });
        
        if (isID) {
            try {
                await writeProducts(result);
                this.products = result;
                console.log(`Producto con ID ${id} eliminado`);
            } catch (error) {
                console.log("Error al eliminar el producto:", error);
            }
        }
        return isID;
    }

    //Guardo los productos de mi DB en el manager
    async getProductsFromDB() {
        try {
            const data = await readProducts();
            if (data.length > 0) {
                data.forEach(element => {
                    this.products.push(element);
                    if (element.id >= this.currentId) {
                        this.currentId = element.id + 1;
                    }
                });
            }
        } catch (error) {
            console.log("Error leyendo archivo de DB:", error);
        }
    }

}

module.exports = ProductManager;