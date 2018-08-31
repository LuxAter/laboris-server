var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var router = express.Router();

passport.use(new localStrategy(
  (username, password, callback) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) callback(null, null, {
        'success': false,
        'error': err
      });
      else if (!user) callback(null, null, {
        'success': false,
        'error': 'incorrect username or password'
      });
      else {
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) callback(err);
          else if (isMatch) callback(null, user);
          else callback(null, null, {
            'success': false,
            'error': 'incorrect username or password'
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
  console.log(req.body);
  User.createUser(req.body.username, req.body.password, req.body.email, (err, result) => {
    if (err) return console.log(err);
    res.json({
      "success": true,
      "username": req.body.username
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({
    "success": true,
    "username": req.user.username
  });
});

router.get('/current', (req, res) => {
  if (req.user) {
    res.json({
      'username': req.user.username,
      'email': req.user.email,
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
})

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
