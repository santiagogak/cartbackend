//Importo express para gestionar mi servidor
const express = require('express');
const app = express();
const routes = require('./routes/index.js');
const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const path = require('path');
const handlebars = require('express-handlebars');

//Connexión a BD MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('No se pudo  conectar a MongoDB Atlas', err));

//Set handlebars
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

//Set static
app.use('/public',express.static(path.join(__dirname, 'public')));

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Views
app.use('/', routes);

//NOT FOUND
app.use((req, res) => {
  res.render('pages/notfound', {})
});

module.exports = app;