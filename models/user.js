var mongoose = require('mongoose');

var Task = require('./task.js');

var userSchema = mongoose.Schema({
  name: String,
  pendingTasks: [Task.schema],
  completedTasks: [Task.schema]
});

var User = module.exports = mongoose.model('User', userSchema);

module.exports.findIdOrCreate = (name, callback) => {
  User.findOne({
    name: name
  }, (err, user) => {
    if (err) return callback(err, null);
    if (user) return callback(null, user.id);
    const newUser = new User({
      name: name
    });
    newUser.save((err, user) => {
      if (err) return callback(err, null);
      return callback(null, user.id);
    });
  });
}

module.exports.getModified = (user, mdate, callback) => {
  res = {
    pendingTasks: [],
    completedTasks: []
  };
  for (var i = 0; i < user.pendingTasks.length; ++i) {
    if (user.pendingTasks.id(i).modifiedDate > mdate) {
      res.pendingTasks.push(user.pendingTasks.id(i));
    }
  }
  for (var i = 0; i < user.completedTasks.length; ++i) {
    if (user.completedTasks.id(i).modifiedDate > mdate) {
      res.pendingTasks.push(user.completedTasks.id(i));
    }
  }
  callback(null, res);
}
