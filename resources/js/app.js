const axios = require('axios');
const Noty = require('noty');

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
}