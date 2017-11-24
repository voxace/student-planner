const router = require('express').Router();
const passport = require('passport');
const Student = require('../models/student');

// Auth login
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

// Auth logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('../../');
});

// Auth with Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// Auth with Facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

// Auth with Twitter
router.get('/twitter', passport.authenticate('twitter'));

// Callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
  //res.send(req.user);
});

// Callback route for google to redirect to
router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
});

// Callback route for twitter to redirect to
router.get('/twitter/callback', passport.authenticate('twitter'), (req, res) => {
  res.redirect('/');
});

// Login user
router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/auth/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

  var values = [name, username, password];

  console.log("Registering: " + username);

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
  console.log(errors);

	if(errors){
		res.render('register',{
			errors:errors,
      values:values
		});
	} else {
    new Student({
      name: name,
			username: username,
			password: password
    }).save().then((newUser) => {
      console.log('New user created: ' + newUser);
    });

		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/auth/login');
	}
});


module.exports = router;
