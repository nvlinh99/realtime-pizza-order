const Menu = require('../models/menu.model');
function homeController() { 
	return {
		async index(req, res) {
			const pizzas = await Menu.find();
			return res.render('home', { pizzas });
		}
	}
}

module.exports = homeController;