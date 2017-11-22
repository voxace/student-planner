const router = require('express').Router();
const passport = require('passport');

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
router.get('/logout', (req, res) => {
  // handle with passport
  req.logout();
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

module.exports = router;
