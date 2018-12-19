var express = require('express');
var router = express.Router();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../../models/user.js');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/api/user/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, callback) => {
  User.findIdOrCreate(user.displayName, (err, uid) => {
    if (err) callback(err, null);
    else callback(null, {
      id: user.id,
      uid: uid,
      name: user.displayName
    });
  });
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
})

router.get('/', (req, res) => {
  console.log('\033[1;34m[router] GET \'/api/user\'\033[0m');
  if (req.user) return res.json({
    success: true,
    user: req.user
  });
  return res.json({
    success: false,
    error: 'No currently authenticated user'
  });
});

router.get('/login', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login']
}));
router.get('/callback', passport.authenticate('google', {
  failureRedirect: process.env.FRONTEND + '/'
}), (req, res) => {
  res.redirect(process.env.FRONTEND + '/');
});
router.get('/logout', (req, res) => {
  console.log('\033[1;34m[router] GET \'/api/user/logout\'\033[0m');
  req.session = null;
  if (req.user) res.json({
    success: true
  });
  else res.json({
    success: false,
    error: 'No currently authenticated user'
  });
})

module.exports = router;
