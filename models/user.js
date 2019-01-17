var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

var userSchema = mongoose.Schema({
  email: { type: String, required: true, index: true },
  password: {type: String, required: true},
  authToken: String,
  resetToken: String,
  resetExpires: Date
});

userSchema.pre('save', function(next){
  var user = this;
  var SALT_FACTOR = 10;

  if(!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if(err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) return next(err);
      user.password = hash;
      next()
    });
  });
});

userSchema.methods.comparePassword = function(pswd, callback){
  bcrypt.compare(pswd, this.password, callback);
}

userSchema.methods.genToken = function(callback){
  crypto.randomBytes(32, (err, buffer) => {
    this.authToken = buffer.toString('hex');
    this.save();
    callback(null, this.authToken);
  });
}
userSchema.methods.genTokenSync = function(callback){
  this.authToken = crypto.randomBytes(32).toString('hex');
}

var User = module.exports = mongoose.model('User', userSchema);

module.exports.getUser = (req, callback) => {
  if(req.user) return callback(null, req.user);
  else if(req.body.token){
    User.findOne({authToken: req.body.token}, (err, usr) => {
      if(err) return callback(err);
      if(!usr) return callback("No matching user");
      return callback(null, usr);
    });
  } else if(req.query.token) {
    User.findOne({authToken: req.query.token}, (err, usr) => {
      if(err) return callback(null, err);
      if(!usr) return callback("No matching user");
      return callback(null, usr);
    });
  }else {
    console.log(req);
    callback("No user authenticated", null)
  };
};
