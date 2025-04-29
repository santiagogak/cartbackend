class ProductManager {
    //Constructor de la clase
    constructor() {
        this.products = [];
        this.currentId = 0;
    }

    //Método para agregar un producto
    addProduct(title, description, price, thumbnail, code, stock) {
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
        console.log("Producto agregado:", newProduct);
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
}