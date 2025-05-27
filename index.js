const app = require('./src/app.js');
const http = require('http');
const { configureSockets } = require('./src/config/socket.js');
const PORT = 8080

//Se crea el servidor http
const server = http.createServer(app);

configureSockets(server);

server.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})