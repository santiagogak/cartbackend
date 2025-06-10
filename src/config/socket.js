const { Server } = require('socket.io');

//Traigo la clase ProductManager para gestionar la lista de productos
const ProductManager = require('../managers/ProductManager.js');
const pmanager = new ProductManager();

let io;
const configureSockets = ( server ) => {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log(`Usuario conectado con ID: ${socket.id}`);


        //Crear un nuevo producto por socket
        socket.on('nuevoProducto', async (data) => {
            const addedProduct = await pmanager.addProduct(data);
            const products = await pmanager.getProducts();
            io.emit('actualizarProductos', products.payload);
        });

        //Eliminar un producto por socket
        socket.on('eliminarProducto', async (id) => {
            const deletedProduct = await pmanager.removeProduct(id);
            const products = await pmanager.getProducts();
            io.emit('actualizarProductos', products.payload);
        });

        socket.on('disconnect', (data) => {
            console.log(`Usuario desconectado con ID: ${socket.id}`);
        });
    })
}

// Traigo el socket.io para poder usarlo en otros archivos
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io no inicializado');
    }
    return io;
}

module.exports = { configureSockets, getIO };