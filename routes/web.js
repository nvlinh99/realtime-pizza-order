const homeController = require('../app/controllers/home.controller')();
const authController = require('../app/controllers/auth.controller')();
const cartController = require('../app/controllers/cart.controller')();
const orderController = require('../app/controllers/order.controller')();
const adminOrderController = require('../app/controllers/admin.controller')();
const statusController = require('../app/controllers/status.controller')();

// Middlewares
const guest = require('../app/middlewares/guest');
const auth = require('../app/middlewares/auth');
const admin = require('../app/middlewares/admin');

function initRoutes(app) {
	app.get('/', homeController.index);

	app.get('/login', guest, authController.login);
	app.post('/login', authController.postLogin);

	app.get('/register', guest, authController.register);
	app.post('/register', authController.postRegister);

	app.post('/logout', authController.logout);

	app.get('/cart', cartController.index);
	app.post('/update-cart', cartController.update);

	// Customer routes
	app.post('/orders', auth, orderController.store);
	app.get('/customer/orders', auth, orderController.index);
	app.get('/customer/orders/:id', auth, orderController.show);

	// Admin routes
	app.get('/admin/orders', admin, adminOrderController.index);
	app.post('/admin/order/status', admin, statusController.update);

}

module.exports = initRoutes;