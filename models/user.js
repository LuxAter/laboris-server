var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

function roundDate(timeStamp) {
  timeStamp -= timeStamp % (24 * 60 * 60 * 1000); //subtract amount of time since midnight
  timeStamp += new Date().getTimezoneOffset() * 60 * 1000; //add on the timezone offset
  return new Date(timeStamp);
}

var projectSchema = mongoose.Schema({
  title: String,
  color: String,
  tasks: [mongoose.Schema.Types.ObjectId]
});

var taskSchema = mongoose.Schema({
  title: String,
  projects: [mongoose.Schema.Types.ObjectId],
  tags: [String],
  entryDate: Date,
  dueDate: Date,
  doneDate: Date,
  state: String,
  priority: Number,
  times: [{
    start: Date,
    end: Date
  }]
});

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: String,
  projects: [projectSchema],
  tasks: [taskSchema],
  doneTasks: [taskSchema],
  hiddenTasks: [taskSchema]
});

var User = module.exports = mongoose.model('User', userSchema);
var Project = mongoose.model('Project', projectSchema);
var Task = mongoose.model('Task', taskSchema);

module.exports.createUser = (email, password, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      var user = new User({
        password: hash,
        email: email
      });
      user.save(callback);
    })
  });
}

module.exports.getByEmail = (email, callback) => {
  User.findOne({
    email: email
  }, callback);
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

module.exports.serialize = (user, callback) => {
  var userData = {
    email: user.email,
    projects: user.projects,
    tasks: user.tasks
  }
  callback(null, userData);
}

module.exports.createTask = (user, task, callback) => {
  var tsk = new Task(task);
  tsk.entryDate = Date.now();
  user.tasks.push(tsk);
  user.save((err, usr) => {
    callback(err, tsk);
  });
}

module.exports.deleteTask = (user, id, callback) => {
  user.tasks.pull({
    _id: id
  });
  user.save(callback);
}

module.exports.completeTask = (user, id, callback) => {
  var task = user.tasks.pull({_id: id});
  user.doneTasks.push(task);
  user.save(callback);
}

module.exports.deCompleteTask = (user, id, callback) => {
  var task = user.doneTasks.pull({_id: id});
  user.tasks.push(task);
  user.save(callback);
}

module.exports.updateTask = (user, id, body, callback) => {
  var task = user.tasks.id(id);
  for (var key in task){
    if (key in body){
      task[key] = body[key];
    }
  }
  user.save();
  callback(null, task);
}

module.exports.segmentTask = (user, id, start, end, callback) => {
  var task = user.tasks.id(id);
  if (task.times.length !== 0 && task.times[task.times.length - 1].end === null) {
    callback('task is already active');
  } else {
    tasks.times.push({start: start, end: end});
    user.save();
    callback(null, task);
  }
}

module.exports.startTask = (user, id, time, callback) => {
  var task = user.tasks.id(id);
  if (task.times.length !== 0 && task.times[task.times.length - 1].end === null) {
    callback('task is already active');
  } else {
    task.times.push({
      start: time ? new Date(time) : Date.now(),
      end: null
    });
    user.save();
    callback(null, task);
  }
}

module.exports.endTask = (user, id, time, callback) => {
  var task = user.tasks.id(id);
  if (task.times.length === 0 || task.times[task.times.length - 1].end !== null) {
    callback('task has not been started');
  } else {
    task.times[task.times.length - 1].end = time ? new Date(time) : Date.now();
    user.save();
    callback(null, task);
  }
}

module.exports.timeTask = (user, id, callback) => {
  var task = user.tasks.id(id);
  var obj = {
    'total': 0.0
  }
  task.times.forEach((segment) => {
    if (segment.end !== null) {
      var diff = Math.abs(segment.start.getTime() - segment.end.getTime());
      if (roundDate(segment.start) in obj) {
        obj[roundDate(segment.start)] += diff;
      } else {
        obj[roundDate(segment.start)] = diff;
      }
      obj.total += diff;
    }
  });
  callback(null, obj);
};

module.exports.createProject = (user, title, color, callback) => {
  var project = new Project({
    title: title,
    color: color
  });
  user.projects.push(project);
  user.save((err, usr) => {
    callback(err, project);
  });
}
