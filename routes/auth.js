var express = require('express');
var router = express.Router();

var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var nodemailer = require('nodemailer');

var User = require('../models/user.js');

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

passport.use(new localStrategy(
  (username, password, callback) => {
    User.findOne({
      email: username
    }, (err, user) => {
      if (err) return callback(err);
      if (!user) return callback(null, false, {
        message: 'Incorrect email/password.'
      });
      user.comparePassword(password, (err, isMatch) => {
        if (isMatch) return callback(null, user);
        return callback(null, false, {
          message: 'Incorrect email/password.'
        });
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

router.get('/', (req, res, next) => {
  User.getUser(req, (err, user) => {
    if (err) return res.json({
      status: "error",
      message: err
    });
    return res.json({
      status: "success",
      user: user
    });
  });
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/login\033[0m');
  res.json({
    status: "success",
    message: "Logged in as \"" + req.user.email + "\"",
    email: req.user.email
  });
});
router.get('/logout', (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/logout\033[0m');
  req.logout();
  res.json({
    status: "success",
    message: " Logged out"
  });
});

router.post('/token', (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/token\033[0m');
  if (!req.user && req.body.email && req.body.password) {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) return res.json({
        status: "error",
        message: err
      });
      if (!user) return res.json({
        status: "error",
        message: "Incorrect email/password."
      });
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) return res.json({
          status: "error",
          message: "Incorrect email/password."
        });
        user.genToken((err, token) => {
          if (err) return res.json({
            status: "error",
            message: err
          });
          res.json({
            status: "success",
            token: token
          });
        });
      });
    });
  } else if (req.user) {
    req.user.genToken((err, token) => {
      if (err) return res.json({
        status: "error",
        message: err
      });
      res.json({
        status: "success",
        token: token
      });
    });
  } else {
    return res.json({
      status: "error",
      message: "Token generation requires login"
    });
  }

});

router.post('/register', (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/register\033[0m');
  User.findOne({
    email: req.body.email
  }, (err, usr) => {
    if (err) return res.json({
      status: "error",
      message: err
    });
    if (usr) return res.json({
      status: "error",
      message: "Email \"" + req.body.email + "\" is already in use"
    });
    if (!validateEmail(req.body.email)) {
      return res.json({
        status: "error",
        message: "Invalid email address"
      });
    }
    var user = new User({
      email: req.body.email,
      password: req.body.password
    });
    user.genTokenSync()
    user.save((err) => {
      if (err) return res.json({
        status: "error",
        message: err.message
      });
      req.logIn(user, (err) => {
        if (err) return res.json({
          status: "error",
          message: err
        });
        res.json({
          status: "success",
          message: "Created new user",
          user: user
        });
      });
    });
  });
});

router.post('/recover', (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/recover\033[0m');
  async.waterfall([
    (next) => {
      crypto.randomBytes(20, (err, buff) => {
        var token = buff.toString('hex');
        next(err, token);
      });
    },
    (token, next) => {
      User.findOne({email: req.body.email}, (err, user) => {
        if (user) {
          user.resetToken = token;
          user.resetExpires = Date.now() + 3600000;
          user.save((err) => {
            next(err, token, user);
          });
        } else {
          next(err, token, null);
        }
      });
    },
    (token, user, next) => {
      console.log("Send email!");
      var smtpTransport = nodemailer.createTransport('SMTP', {service: 'SendGrid',
        auth: {
          user: "Nedra1998",
          pass: "Tristan11"
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@laboris.com',
        subject: 'Laboris Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      console.log("HI");
      smtpTransport.sendMail(mailOptions, (err) => {
        console.log(err);
        next(err, null);
      });
    },
    (err) => {
      res.json({
        status: "info",
        message: "A recovery URL has been sent to \"" + req.body.email + "\" if it is registered"
      });
    }
  ])
});

router.post('/user', (req, res, next) => {
  console.log('\033[1;35m[router] POST /api/auth/user\033[0m');
  User.getUser(req, (err, user) => {
    if (err) return res.json({
      status: "error",
      message: err
    });
    return res.json({
      status: "success",
      user: user
    });
  });
});

module.exports = router;
