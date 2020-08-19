require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash')();
const MongoStore = require('connect-mongo')(session);

const app = express();
app.enable('trust proxy');
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

app.use(flash);
//Assets
app.use(express.static('public'));

require('./routes/web')(app);

//Setup template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, './resources/views'));
app.set('view engine', 'ejs'); 

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
