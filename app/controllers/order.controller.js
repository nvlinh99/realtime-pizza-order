const Order = require('../models/order.model');
const moment = require('moment');

function orderController(){
	return {
		async index(req, res) {
			const orders = await Order.find({ 
				customerId: req.user._id }, 
				null, 
				{
					sort: {
						'createdAt': -1,
				}
			});
			res.render('customers/orders', { orders, moment })
		},
		store(req, res) {
			// Validate request
			const { phone, address } = req.body;
			if(!phone || !address) {
				req.flash('error', 'All fields are required.');
				return res.redirect('/cart')
			}

			const order = new Order({
				customerId: req.user._id,
				items: req.session.cart.items,
				phone,
				address
			})

			order.save().then(result => {
				req.flash('success', 'Order placed successfully');
				delete req.session.cart;
				res.redirect('/customers/orders');
			}).catch(err => {
				req.flash('error', 'Something went wrong!');
				return res.redirect('/cart');
			});
		}
	}
}

module.exports = orderController;