const Order = require('../models/order.model')
function orderController() {
	return {
			index(req, res) {
				Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
						 if(req.xhr) {
								 return res.json(orders)
						 } else {
							return res.render('admin/orders')
						 }
				 })
			}
	}
}

module.exports = orderController