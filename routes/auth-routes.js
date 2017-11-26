const router = require('express').Router();
const passport = require('passport');
const Student = require('../models/student');

// Auth login
// If already logged in, redirect to home page
router.get('/login', (req, res) => {
  if(!req.user === null) {
    res.redirect('../../');
  } else {
    res.render('login', {user: req.user});
  }
});

// Auth register
router.get('/register', (req, res) => {
  res.render('register', {user: req.user});
});

// Auth second phase register
router.get('/register2', (req, res) => {
  res.render('register2', {user: req.user});
});

// Auth logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('../../');
});

// Auth with Google
router.get('/google/login', passport.authenticate('google-login', { scope: ['profile'] }));
router.get('/google/register', passport.authenticate('google-register', { scope: ['profile'] }));

// Auth with Facebook
router.get('/facebook/login', passport.authenticate('facebook-login', { scope: ['email'] }));
router.get('/facebook/register', passport.authenticate('facebook-register', { scope: ['email'] }));

// Auth with Twitter
router.get('/twitter/login', passport.authenticate('twitter-login'));
router.get('/twitter/register', passport.authenticate('twitter-register'));

// Callback route for google to redirect to
router.get('/google/login/callback', passport.authenticate('google-login'), (req, res) => {
  res.redirect('/');
});
router.get('/google/register/callback', passport.authenticate('google-register', { failureRedirect:'/auth/login', failureFlash: true} ), (req, res) => {
  res.redirect('/auth/register2');
});

// Callback route for facebook to redirect to
router.get('/facebook/login/callback', passport.authenticate('facebook-login'), (req, res) => {
  res.redirect('/');
});
router.get('/facebook/register/callback', passport.authenticate('facebook-register', { failureRedirect:'/auth/login', failureFlash: true} ), (req, res) => {
  res.redirect('/auth/register2');
});

// Callback route for twitter to redirect to
router.get('/twitter/login/callback', passport.authenticate('twitter-login'), (req, res) => {
  res.redirect('/');
});
router.get('/twitter/register/callback', passport.authenticate('twitter-register', { failureRedirect:'/auth/login', failureFlash: true} ), (req, res) => {
  res.redirect('/auth/register2');
});

// Login user
router.post('/login',
  passport.authenticate('local-login', {successRedirect:'/', failureRedirect:'/auth/login', failureFlash: true})
);

// Register User (not handled by passport)
router.post('/register', function(req, res){
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
  var values = [name, username, password];

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors,
      values:values
		});
	} else {
    Student.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }
      if(user) {
        req.flash('error_msg', 'A user with that email address already exists.');
    		res.redirect('/auth/register');
      } else {
        new Student({
          name: name,
    			username: username,
    			password: password
        }).save().then((newUser) => {
          console.log('New user created: ' + newUser);
          req.flash('success_msg', 'You are registered and can now login');
      		res.redirect('/auth/login');
        });
      }
    });
	}
});

// Register User
router.post('/register2', function(req, res){
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
  var values = [name, username, password];

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Email is not valid').isEmail();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	var errors = req.validationErrors();

	if(errors){
		res.render('register2',{
			errors:errors,
      values:values
		});
	} else {
    // update details
    if(req.user.twitterId) {
      Student.findOne({ twitterId: req.user.twitterId }).then(function(student){
        if(name) { student.name = name; }
        if(username) { student.username = username; }
        if(password) { student.password = password; }
        student.save().then(function() {
          console.log("Student saved: " + student);
        });
        req.flash('success_msg', 'Successfully registered!');
        res.redirect('/');
      });
    } else if (req.user.googleId) {
      Student.findOne({ googleId: req.user.googleId }).then(function(student){
        if(name) { student.name = name; }
        if(username) { student.username = username; }
        if(password) { student.password = password; }
        student.save().then(function() {
          console.log("Student saved: " + student);
        });
        req.flash('success_msg', 'Successfully registered!');
        res.redirect('/');
      });
    } else if (req.user.facebookId) {
      Student.findOne({ facebookId: req.user.facebookId }).then(function(student){
        if(name) { student.name = name; }
        if(username) { student.username = username; }
        if(password) { student.password = password; }
        student.save().then(function() {
          console.log("Student saved: " + student);
        });
        req.flash('success_msg', 'Successfully registered!');
        res.redirect('/');
      });
    }

	}
});

module.exports = router;
