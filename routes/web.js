const homeController = require('../app/controllers/home.controller')();
const authController = require('../app/controllers/auth.controller')();
const cartController = require('../app/controllers/cart.controller')();
const orderController = require('../app/controllers/order.controller')();
const AdminOrderController = require('../app/controllers/admin.controller')();
const guest = require('../app/middlewares/guest');
const auth = require('../app/middlewares/auth');

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

	// Admin routes
	app.get('/admin/orders', auth, AdminOrderController.index)

}

module.exports = initRoutes;