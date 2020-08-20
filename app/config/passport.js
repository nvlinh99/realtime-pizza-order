const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.model');
const passwordValidator = require('../utils/passwordValidator');

function init(passport) {
	passport.use(new LocalStrategy(
		{	usernameField: 'email'}, async (email, password, done) => {
			// Check email exists
			const user = await User.findOne({ email: email });
			if(!user) { return done(null, false, { message:'No user with this email'})}
			passwordValidator.verifyHashedPassword(password, user.password)
			.then(match => {
				if(match) {
					return done(null, user, { message:'Logged in successfully'});
				}
				return done(null, false, {message: 'Wrong email or password'});
			})
			.catch(err => {
				return done(null, false, {message: 'Something went wrong'});
			});
		}));
	passport.serializeUser((user, done) => {
		done(null, user._id);
	})
	passport.deserializeUser((id, done) => {
		 User.findById(id, (err, user) => {
			 done(err, user);
		 });
	})
}

module.exports = init;