const passport = require('passport');

const User = require('../models/user.model');
const passwordValidator = require('../utils/passwordValidator');

function authController(){
	const _getRedirectUrl = (req) => {
		return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
	}
	return {
		login(req, res) {
			res.render('auth/login');
		},
		postLogin(req, res, next) {
			const { email, password } = req.body;
			if(!email || !password) {
				req.flash('error', 'All fields are required!');
				req.flash('email', email);
				return res.redirect('/login');
			}
			passport.authenticate('local', (err, user, info) => {
				if(err) {
					req.flash('error', info.message);
					return next(err);
				}
				if(!user) { 
					req.flash('error', info.message);
					return res.redirect('/login');
				}
				req.logIn(user, (err) => {
					if(err) {
						req.flash('error', info.message);
						return next(err);
					}
					return res.redirect(_getRedirectUrl(req))
				}) 
			})(req, res, next);
		},
		register(req, res) {
			res.render('auth/register');
		},
		async postRegister(req, res) {
			const { name, email, password } = req.body;
			const passwordRegex = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/gm;
			const validPassword = passwordRegex.exec(password);
			// Validate request
			if(!name || !email || !password) {
				req.flash('error', 'All fields are required!');
				req.flash('name', name);
				req.flash('email', email);
				return res.redirect('/register');
			}

			// Check email exist
			User.exists({ email }, (err, result) => {
				if(result) {
					req.flash('error', 'Email already exists!');
					req.flash('name', name);
					req.flash('email', email);
					return res.redirect('/register');
				}
			});

			// Valid password
			if(!validPassword){
				req.flash('error', 'Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.');
				req.flash('name', name);
				req.flash('email', email);
				return res.redirect('/register');
			}

			// Create user
			const user = new User({
				name, 
				email, 
				password: await passwordValidator.createHashedPassword(password),
			});

			user.save()
			.then((user) => {
				return res.redirect('/');
			}).catch(err => {
				req.flash('error', 'Something went wrong');
				return res.redirect('/register');
			});
		},
		logout(req, res) {
			req.logout();
			return res.redirect('/');
		}
	}
}

module.exports = authController;