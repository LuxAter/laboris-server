var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  user: mongoose.Schema.Types.ObjectID,
  title: String,
  projects: [mongoose.Schema.Types.ObjectId],
  tags: [String],
  entryDate: Date,
  doneDate: Date,
  priority: Number,
  state: String,
  color: String,
  group: String,
  times: [{
    start: Date,
    end: Date
  }]
});

var Task = module.exports = mongoose.model('Task', taskSchema);

module.exports.getByUser = (user, callback) => {
  Task.find({user: user}, callback);
}

module.exports.getByProject = (project, callback) => {
  Task.find({projects: project}, callback);
}

module.exports.getByTag = (tag, callback) => {
  Task.find({tag: tag}, callback)
}

module.exports.getByTitle = (title, callback) => {
  Task.findOne({title: title}, callback);
}

module.exports.getByGroup = (group, callback) => {
  Task.find({group: group}, callback);
}
