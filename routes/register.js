var express = require('express');
var router = express.Router();
const Student = require('../models/student');

// GET
router.get('/', function(req, res){
   res.render('register',{loggedin: false});
});

// POST
router.post('/', function(req, res){
  var username = req.body.username;
  var name = req.body.name;
  var password = req.body.password;
  var grade = req.body.grade;

  Student.findOne({username: username}).then(function(result){
    if(result != null) {
      res.render('register',{error: 'Username ' + username + ' taken'});
    } else {
      var stu = new Student({
        name: name,
        username: username,
        password: password,
        grade: grade,
      });
      stu.save();
      res.render('register',{success: true, username: username});
    }
  });


});


// 404
router.get('/*', function(req, res){
   res.render('404');
});

module.exports = router;
