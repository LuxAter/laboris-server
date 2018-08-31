var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  resetPasswordToken: String,
  resetPasswordExpires: String,
  tasks: [mongoose.Schema.ObjectId]
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = (username, password, email, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      console.log(username, hash, email);
      var user = new User({username: username, password: hash, email: email});
      user.save(callback);
    })
  });
}
module.exports.getUserByUsername = (username, callback) => {
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.comparePassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, callback);
}

module.exports.serializeUser = (user, callback) => {
  callback(null, user.id);
}

module.exports.deserializeUser = (id, callback) => {
  User.findById(id, callback);
}


