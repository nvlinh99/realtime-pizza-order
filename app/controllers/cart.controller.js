function cartController() { 
	return {
		index(req, res) {
			res.render('customers/cart');
		},
		update(req, res) {
			const { _id, price } = req.body;
			// First time creating cart and adding basic object structure
			if(!req.session.cart) {
				req.session.cart = {
					items: {},
					totalQty: 0,
					totalPrice: 0
				}
			}
			let { cart } = req.session;
			if(!cart.items[_id]) {
				cart.items[_id] = {
					item: req.body,
					qty: 1,
				}
				cart.totalQty += 1;
				cart.totalPrice += price;
			}
			else {
				cart.items[_id].qty += 1;
				cart.totalQty +=1;
				cart.totalPrice += price;
			}
			
			return res.json({
				totalQty: cart.totalQty,
			});
		}
	}
}

module.exports = cartController;