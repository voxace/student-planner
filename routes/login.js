var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res){
   res.render('login',{title: 'test'});
});


// POST
router.post('/', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  res.send('You logged in with username' + username + ' and password: ' + password);
});


// 404
router.get('/*', function(req, res){
   res.render('404');
});

module.exports = router;
