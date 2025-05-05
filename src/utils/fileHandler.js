//Importo fs y path para manejar archivos y guardo el path para el json de productos
const fs = require('fs').promises;
const path = require('path');
const PRODUCTS_FILE = path.join(__dirname, "../db/products.json");

//Funcion para leer el archivo de productos
const readProducts = async () => {
    try {
      const fileResponse = await fs.readFile(PRODUCTS_FILE,'utf8');
      return JSON.parse(fileResponse);
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  
  //Funcion para escribir el archivo de productos
  const writeProducts = async (products) => {
    try {
      await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
    } catch (error) {
      console.log(error);
    }
  }

  module.exports = { readProducts, writeProducts };
