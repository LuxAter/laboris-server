var express = require('express');
var router = express.Router();

var async = require('async');
var passport= require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user.js');

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

passport.use(new localStrategy(
  (username, password, callback) => {
    User.findOne({email: username}, (err, user) => {
      if(err) return callback(err);
      if(!user) return callback(null, false, {message: 'Incorrect email/password.'});
      user.comparePassword(password,(err, isMatch) => {
        if(isMatch) return callback(null, user);
        return callback(null, false, {message: 'Incorrect email/password.'});
      });
    });
  }
));

passport.serializeUser((user, callback) => {
  callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id, callback);
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/login\033[0m');
  res.json({status: "success", message: "Logged in as \"" + req.user.email+ "\""});
});
router.post('/logout', (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/logout\033[0m');
  req.logout();
  res.json({status: "success", message:" Logged out"});
});

router.post('/token', (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/token\033[0m');
  if(!req.user && req.body.email && req.body.password){
    User.findOne({email: req.body.email}, (err, user) => {
      if(err) return res.json({status: "error", message: err});
      if(!user) return res.json({status: "error", message: "Incorrect email/password."});
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) return res.json({status: "error", message: "Incorrect email/password."});
        user.genToken((err, token) => {
          if(err) return res.json({status: "error", message: err});
          res.json({status: "success", token: token});
        });
      });
    });
  }else if(req.user){
    req.user.genToken((err, token) => {
      if(err) return res.json({status: "error", message: err});
      res.json({status: "success", token: token});
    });
  }else{
    return res.json({status: "error", message:"Token generation requires login"});
  }

});

router.post('/register', (req, res, next)=> {
  console.log('\033[1;35m[router] POST /api/auth/register\033[0m');
  User.findOne({email: req.body.email}, (err, usr) => {
    if(err) return res.json({status: "error", message: err});
    if(usr) return res.json({status: "error", message: "Email \"" + req.body.email + "\" is already in use"});
    if(!validateEmail(req.body.email)){
      return res.json({status: "error", message: "Invalid email address"});
    }
    var user = new User({
      email: req.body.email,
      password: req.body.password
    });
    user.genTokenSync()
    user.save((err) => {
      if(err) return res.json({status: "error", message: err.message});
      req.logIn(user, (err) => {
        if(err) return res.json({status: "error", message: err});
        res.json({status: "success", message: "Created new user", user: user});
      });
    });
  });
});

router.post('/user', (req, res, next) => {
  User.getUser(req, (err, user) => {
    console.log(">>", err, user);
    if(err) return res.json({status: "error", message: err});
    return res.json({status: "success", user: user});
  });
});

module.exports = router;
