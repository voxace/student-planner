const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
mongoose.Promise = global.Promise;
var upload = multer();
var app = express();

// App settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.set('view engine', 'pug');
app.set('views', './views');

// Set up cookies
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [keys.session.cookieKey]
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static('./public'));

// Connect to mongodb
mongoose.connect(keys.mongodb.dbURI, { useMongoClient: true });

// Check if connection made to DB
mongoose.connection.once('open',function() {
  console.log("Mongodb Connection made");
}).on('error', function() {
  console.log('Connection error',error);
});

// Set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Check if logged in
const authCheck = (req, res, next) => {
  if(!req.user) {
    res.redirect('/auth/login');
  } else {
    next();
  }
}

// Render home page if logged in
app.get('/', authCheck, (req, res) => {
  res.render('home', {user: req.user});
});

// Listen on port 3000
app.listen(3000);
