// Datos de prueba compartidos. Las credenciales viven en test-data.json
// para no duplicarlas; aqui se agrega la configuracion de URLs del proyecto.
const datos = require('./test-data.json');

module.exports = {
  ...datos,
  urls: {
    base: 'https://www.saucedemo.com',
    inventory: '/inventory.html',
    cart: '/cart.html',
  },
};
