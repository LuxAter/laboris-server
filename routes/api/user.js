var express = require('express');
var passport = require('passport');
var crypto = require('crypto');
var localStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var router = express.Router();

passport.use(new localStrategy(
  (email, password, callback) => {
    User.getByEmail(email, (err, user) => {
      if (err) callback(null, null, {
        'success': false,
        'error': err
      });
      else if (!user) callback(null, null, {
        'success': false,
        'error': 'incorrect email or password'
      });
      else {
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) callback(err);
          else if (isMatch) callback(null, user);
          else callback(null, null, {
            'success': false,
            'error': 'incorrect email or password'
          });
        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/register', (req, res) => {
  User.createUser(req.body.email, req.body.password, (err, result) => {
    if (err) return res.json({'success': false, 'error': "email address aleady used"});
    res.json({
      "success": true,
      "email": req.body.email
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({
    "success": true,
    "email": req.user.email
  });
});

router.post('/forgot', (req, res) => {
  res.json({
    "success": false,
    "error": "Password recovery is still a work in progress"
  });
});

router.get('/current', (req, res) => {
  if (req.user) {
    res.json({
      'email': req.user.email
    });
  } else {
    res.json({
      'success': false,
      'error': "No user is logged in"
    });
  }
});

router.get('/tasks', (req, res) => {
  if (req.user) {
    res.json({
      'tasks': req.user.tasks
    });
  } else {
    res.json({
      'success': false,
      'error': "No user is logged in"
    });
  }
});

router.get('/projects', (req, res) => {
  if(req.user){
    res.json({
      'projects': req.user.projects
    });
  }else{
    res.json({
      'success': false,
      'error': "No user is logged in"
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({
    'success': true
  });
});
router.post('/logout', (req, res) => {
  req.logout();
  res.json({
    'success': true
  });
});

module.exports = router;
