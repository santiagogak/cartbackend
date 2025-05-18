//Importo express para gestionar mi servidor
const express = require('express');
const app = express();
const routes = require('./routes/index.js');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Main page" });
});

app.use('/api', routes);

//NOT FOUND
app.use((req, res) => {
  res.status(404).send("Not Found")
});

module.exports = app;