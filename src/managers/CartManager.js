const { readCarts, writeCarts } = require('../utils/fileHandler.js');

class CartManager {

    //Constructor de la clase
    constructor() {
        this.carts = [];
        this.currentId = 0;
        this.getCartsFromDB();
    }

    //Método para agregar un carrito
    async addCart(products = []) {
        const newCart = {
            id: this.currentId++,
            products: products
        };
        this.carts.push(newCart);
        try {
            await writeCarts(this.carts);
            console.log("Carrito agregado:", newCart);
        } catch (error) {
            this.carts.pop();
            this.currentId--;
            console.log("Error al agregar el carrito:", error);
        }
        return newCart;
    }

    //Método para agregar un producto al carrito
    async addProductToCart(cid, pid) {
        const cartIdx = this.carts.findIndex((c) => c.id == cid);
        if (cartIdx == -1) {
            console.log(`Carrito con id ${cid} no encontrado`);
            return;
        }
        const productIndex = this.carts[cartIdx].products.findIndex((p) => p.id == pid);
        if (productIndex == -1) {
            this.carts[cartIdx].products.push({ id: parseInt(pid), quantity: 1 });
        } else {
            this.carts[cartIdx].products[productIndex].quantity++;
        }
        try {
            await writeCarts(this.carts);
            console.log(`Producto ${pid} agregado al carrito ${cid}`);
        } catch (error) {
            if (productIndex == -1) {
                this.carts[cartIdx].products.pop();
            } else {
                this.carts[cartIdx].products[productIndex].quantity--;
            }
            console.log("Error al agregar el carrito:", error);
        }
        return this.carts[cartIdx];
    }

    //Método para obtener todos los carritos
    getCarts() {
        return this.carts;
    }

    //Método para obtener un carrito por su ID
    getCartById(id) {
        const cart = this.carts.find((c) => c.id === id);
        if (!cart) {
            console.log(`Carrito con id ${id} no encontrado`);
            return;
        }
        return cart;
    }

    //Guardo los carritos de mi DB en el manager
    async getCartsFromDB() {
        try {
            const data = await readCarts();
            if (data.length > 0) {
                data.forEach(element => {
                    this.carts.push(element);
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

module.exports = CartManager;