var mongoose = require('mongoose');
var uuidv1 = require('uuid/v1');

var util = require('./util.js');

var taskSchema = mongoose.Schema({
  uuid: String,
  title: String,
  projects: [String],
  tags: [String],
  entryDate: Number,
  dueDate: Number,
  doneDate: Number,
  modifiedDate: Number,
  priority: Number,
  status: {
    type: String,
    enum: ['NONE', 'PENDING', 'COMPLETED']
  },
  times: [String]
});

var Task = module.exports = mongoose.model('Task', taskSchema);
module.exports.schema = taskSchema;

module.exports.createTask = (user, title, projects, tags, priority, dueDate, callback) => {
  var task = new Task({
    uuid: uuidv1(),
    title: title,
    projects: projects ? (Array.isArray(projects) ? projects : [projects]) : [],
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    entryDate: Math.floor(Date.now() / 1000),
    dueDate: dueDate,
    modifiedDate: Math.floor(Date.now() / 1000),
    priority: priority ? priority : 0,
    status: 'PENDING'
  });
  user.pendingTasks.push(task);
  user.save((err, user) => {
    callback(err, task);
  });
}

module.exports.deleteTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.pendingTasks, 'uuid', uuid);
  if (mid) {
    user.tasks.pull({
      _id: mid
    });
    user.save(callback);
  } else {
    mid = util.findIdByKey(user.completedTasks, 'uuid', uuid);
    if (mid) {
      user.tasks.pull({
        _id: mid
      });
      user.save(callback);
    } else {
      callback('uuid not found');
    }
  }
}

module.exports.findTask = (user, uuid, callback, all = false) => {
  uuid = Array.isArray(uuid) ? uuid : [uuid];
  var res = []
  for (var i = 0; i < user.pendingTasks.length; i++) {
    if (uuid.indexOf(user.pendingTasks[i].uuid) > -1) {
      res.push(user.pendingTasks.id(user.task[i]._id));
    }
  }
  if (res.length != 0 && all == false) {
    return callback(res);
  }
  for (var i = 0; i < user.completedTasks.length; i++) {
    if (uuid.indexOf(user.completedTasks[i].uuid) > -1) {
      res.push(user.completedTasks.id(user.task[i]._id));
    }
  }
  return callback(res)
}

module.exports.completeTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.pendingTasks, 'uuid', uuid);
  if (mid === null) {
    return callback('uuid not found in pending tasks');
  }
  var task = user.pendingTasks.id(mid);
  user.pendingTasks.pull({
    _id: mid
  });
  if (task.times.length > 0 && task.times[task.times.length - 1].split(',')[1] == '') {
    task.times[task.times.length - 1] += Math.floor(Date.now() / 1000)
  }
  task.status = 'COMPLETED';
  task.modifiedDate = Math.floor(Date.now() / 1000);
  user.completeTask.push(task);
  user.save(callback);
}

module.exports.deCompleteTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.completedTasks, 'uuid', uuid);
  if (mid === null) {
    return callback('uuid not found in completed tasks');
  }
  var task = user.completedTasks.id(mid);
  user.completedTasks.pull({
    _id: mid
  });
  task.status = 'PENDING';
  task.modifiedDate = Math.floor(Date.now() / 1000);
  user.pendingTasks.push(task);
  user.save(callback);
}

module.exports.startTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.pendingTasks, 'uuid', uuid);
  if (mid === null) {
    return callback('uuid not found in pendingTasks');
  }
  var task = user.tasks.id(mid);
  if (task.times.length !== 0 && task.times[task.times.length - 1].split(',')[1] === '') {
    callback('task is already active');
  } else {
    task.times.push(Math.floor(Date.now() / 1000).toString() + ',');
    task.modifiedDate = Math.floor(Date.now() / 1000);
    task.save();
    user.markModified('pendingTasks');
    user.save((err, usr) => {
      callback(err, task);
    });
  }
}

module.exports.stopTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.pendingTasks, 'uuid', uuid);
  if (mid === null) {
    return callback('uuid not found in pendingTasks');
  }
  var task = user.tasks.id(mid);
  if (task.times.length === 0 || task.times[task.times.length - 1].split(',')[1] !== '') {
    callback('task is not active');
  } else {
    task.times[task.time.length - 1] += Math.floor(Date.now() / 1000).toString();
    task.modifiedDate = Math.floor(Date.now() / 1000);
    task.save();
    user.markModified('pendingTasks');
    user.save((err, usr) => {
      callback(err, task);
    });
  }
}
