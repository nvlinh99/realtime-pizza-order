require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');

const app = express();
app.enable('trust proxy');

const passportInit = require('./app/config/passport');

const PORT = process.env.PORT || 3000;

// Db connection
mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const connection = mongoose.connection;
connection
	.once('open', () => console.log('DB Connected!'))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
	});

// Event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// Session store
let mongoStore = new MongoStore({
	mongooseConnection: connection,
	collection: 'sessions'
});

// Session config
app.use(session({
	secret: process.env.COOKIE_SECRET,
	resave: false,
	saveUninitialized: false,
	store: mongoStore,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

//Passport config
passportInit(passport);
app.use(passport.initialize()); 
app.use(passport.session()); 

app.use(flash());
//Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global middleware
app.use((req, res, next) => {
	res.locals.session = req.session;
	res.locals.user = req.user;
	next();
})

require('./routes/web')(app);

//Setup template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, './resources/views'));
app.set('view engine', 'ejs'); 

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Socket
const io = require('socket.io')(server);
io.on('connection', (socket) => {
	socket.on('join', (orderId) => {
		socket.join(orderId);
	});
});

eventEmitter.on('orderUpdated', (data) => {
	io.to(`order_${data.id}`).emit('orderUpdated', data)
});

eventEmitter.on('orderPlaced', (data) => {
	io.to('adminRoom').emit('orderPlaced', data);	
})

