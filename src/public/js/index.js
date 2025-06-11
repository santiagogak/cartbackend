const socket = io();

// Enviar nuevo producto
const form = document.getElementById('formProducto');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const category = e.target.category.value;
        const code = e.target.code.value;
        const price = e.target.price.value;
        const stock = e.target.stock.value;

        socket.emit('nuevoProducto', {
            title,
            description,
            category,
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

// Agregar o eliminar producto del carrito
const productlistHome = document.getElementById('listaProductosHome');
const cartId = document.getElementsByClassName('cart-link')[0]?.id || null;
if (productlistHome) {
    productlistHome.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON' && cartId) {
            const cid = cartId;
            const pid = e.target.name;
            const type = e.target.className;
            if (type === 'add-prod') {
                // Enviar solicitud para agregar producto al carrito
                const response = fetch(`http://localhost:8080/api/cart/${cid}/product/${pid}`, {
                        method: "POST"
                    });
            }
            if (type === 'rem-prod') {
                // Enviar solicitud para eliminar producto del carrito
                const response = fetch(`http://localhost:8080/api/cart/${cid}/product/${pid}`, {
                        method: "DELETE"
                    });
            }
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
                <p>Category: $${p.category}</p>
                <p>Price: $${p.price}</p>
                <p>Code: ${p.code}</p>
                <p>Stock: ${p.stock}</p>
                <button class="delete-button" id="${p._id}">Delete</button>
                `;
        lista.appendChild(li);
    });
});
