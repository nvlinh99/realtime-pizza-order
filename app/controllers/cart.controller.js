function cartController() { 
	return {
		index(req, res) {
			res.render('customers/cart');
		}
	}
}

module.exports = cartController;