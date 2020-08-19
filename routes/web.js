const homeController = require('../app/controllers/home.controller')();
const authController = require('../app/controllers/auth.controller')();
const cartController = require('../app/controllers/cart.controller')();

function initRoutes(app) {
	app.get('/', homeController.index);
	app.get('/cart', cartController.index);
	app.get('/login', authController.login);
	app.get('/register', authController.register);
}

module.exports = initRoutes;