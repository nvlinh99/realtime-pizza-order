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
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
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
				Order.populate(result, { path: 'customerId'}, (err, placedOrder) => {
					req.flash('success', 'Order placed successfully');
					delete req.session.cart;
					const eventEmitter = req.app.get('eventEmitter');
					eventEmitter.emit('orderPlaced', placedOrder);
					return res.redirect('/customer/orders');
				});
			}).catch(err => {
				req.flash('error', 'Something went wrong!');
				return res.redirect('/cart');
			});
		},
		async show(req, res) {
			const { id } = req.params;
			const order = await Order.findById({ _id: id});
			// Authorize customer
			if(req.user._id.toString() === order.customerId.toString()) {
				return res.render('customers/singleOrder', { order });
			}
			else {
				return res.redirect('/');
			}
		}
	}
}

module.exports = orderController;