const axios = require('axios');
const Noty = require('noty');
const moment = require('moment');

const initAdmin = require('./admin');

let addToCart = document.querySelectorAll('.add-to-card');
let cartCounter = document.querySelector('#cart-counter');

const updateCart = (pizza) => {
	axios.post('/update-cart', pizza)
			 .then(res => {
					cartCounter.innerText = res.data.totalQty;
					new Noty({
						type: 'success',
						layout: 'topRight',
						timeout: 1000,
						theme: 'relax',
						text: 'Item added to cart',
						progressBar: false,
					}).show();
			 })
			 .catch(err => {
					new Noty({
							type: 'error',
							layout: 'topRight',
							timeout: 1000,
							theme: 'relax',
							text: 'Something went wrong',
							progressBar: false,
						}).show();
			 })
};

addToCart.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		let pizza = JSON.parse(btn.dataset.pizza);
		updateCart(pizza)
	});
});

// Remove alert message

const alertMessage = document.querySelector('#success-alert');
if(alertMessage) {
	setTimeout(() => {
		alertMessage.remove();
	}, 2000);
};



// Update status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
	statuses.forEach((status) => {
		status.classList.remove('step-completed');
		status.classList.remove('current');
	});
	let stepCompleted = true;
	statuses.forEach((status) => {
		let dataProp = status.dataset.status;
		if(stepCompleted) {
			status.classList.add('step-completed');
		}
		if(dataProp === order.status) {
			stepCompleted = false;
			time.innerText = moment(order.updatedAt).format('hh:mm A');
			status.appendChild(time);	
			if(status.nextElementSibling) {
				status.nextElementSibling.classList.add('current');
			}
		}
	});
}

updateStatus(order);

// Socket
let socket = io();
initAdmin(socket);
// Join
if(order) {
	socket.emit('join', `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')) {
	socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
	const updatedOrder = { ...order };
	updatedOrder.updatedAt = moment().format();
	updatedOrder.status = data.status;
	updateStatus(updatedOrder);
	new Noty({
		type: 'success',
		layout: 'topRight',
		timeout: 1000,
		theme: 'relax',
		text: 'Order updated',
		progressBar: false,
	}).show();
});