const socket = io();

// Enviar nuevo producto
const form = document.getElementById('formProducto');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const code = e.target.code.value;
        const price = e.target.price.value;
        const stock = e.target.stock.value;

        socket.emit('nuevoProducto', {
            title,
            description,
            code,
            stock,
            thumbnail: 'placeholder',
            price
        });

        e.target.reset();
    });
}

// Eliminar producto
const productlist = document.getElementById('listaProductos')
if (productlist) {
    productlist.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const id = e.target.id;
            socket.emit('eliminarProducto', id);
        }
    });
}

// Recibir productos actualizados
socket.on('actualizarProductos', productos => {
    const lista = document.getElementById('listaProductos');
    lista.className = 'product-list';
    lista.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('div');
        li.className = 'product-box';
        li.innerHTML = `
                <h2>${p.title}</h2>
                <p>Description: ${p.description}</p>
                <p>Price: $${p.price}</p>
                <p>Code: ${p.code}</p>
                <p>Stock: ${p.stock}</p>
                <button class="delete-button" id="${p._id}">Delete</button>
                `;
        lista.appendChild(li);
    });
});
