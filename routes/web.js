const homeController = require('../app/controllers/home.controller')();
const authController = require('../app/controllers/auth.controller')();
const cartController = require('../app/controllers/cart.controller')();
const guest = require('../app/middlewares/guest');

function initRoutes(app) {
	app.get('/', homeController.index);

	app.get('/login', guest, authController.login);
	app.post('/login', authController.postLogin);

	app.get('/register', guest, authController.register);
	app.post('/register', authController.postRegister);

	app.post('/logout', authController.logout);

	app.get('/cart', cartController.index);
	app.post('/update-cart', cartController.update);
}

module.exports = initRoutes;