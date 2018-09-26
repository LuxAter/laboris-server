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
        'error': err
      });
      else if (!user) callback(null, null, {
        'error': 'Incorrect email or password'
      });
      else {
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) callback(err);
          else if (isMatch) callback(null, user);
          else callback(null, null, {
            'error': 'Incorrect email or password'
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
    if (err) {
      console.log(err);
      return res.json({ 'error': "Email address aleady used" });}
    res.json({ "email": req.body.email });
  });
});

router.post('/delete', (req, res) => {
  if (!req.user) return res.json({
    'error': 'must be loggedin'
  });
  User.deleteOne({
    id: req.user.id
  }, (err) => {
    if (err) return res.json({
      'error': err
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({
    "email": req.user.email
  });
});

router.post('/logout', (req, res) => {
  req.logout();
  req.session = null;
  res.json({});
});

router.post('/forgot', (req, res) => {
  res.json({
    "error": "Password recovery is still a work in progress"
  });
});

router.get('/current', (req, res) => {
  if (req.user) res.json({
    'email': req.user.email
  });
  else res.json({
    'error': "No user is logged in"
  });
});

module.exports = router;
