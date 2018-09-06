var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var uuidv1 = require('uuid/v1');

mongoose.set('useCreateIndex', true);

function roundDate(timeStamp) {
  timeStamp -= timeStamp % (24 * 60 * 60 * 1000); //subtract amount of time since midnight
  timeStamp += new Date().getTimezoneOffset() * 60 * 1000; //add on the timezone offset
  return new Date(timeStamp);
}

function glist(list) {
  if (Array.isArray(list)) {
    return list
  } else {
    return [list]
  }
}

function gdate(date) {
  if (date === null) {
    return date
  } else if (date instanceof Date) {
    return date;
  } else if (date instanceof Number) {
    return new Date(date * 1000);
  } else {
    return new Date(parseFloat(date) * 1000);
  }
}

function findIdByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    console.log(array[i][key], value);
    if (key in array[i] && array[i][key] === value) {
      return array[i]._id;
    }
  }
  return null
}

function findIndexByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    console.log(array[i][key], value);
    if (key in array[i] && array[i][key] === value) {
      return i;
    }
  }
  return array.length
}

function findByKey(array, key, value) {
  return array.id(findIdByKey(array, key, value));
}

var taskSchema = mongoose.Schema({
  title: String,
  projects: [String],
  tags: [String],
  uuid: String,
  priority: Number,
  modifiedDate: Date,
  entryDate: Date,
  dueDate: Date,
  doneDate: Date,
  status: {
    type: String,
    enum: ['NONE', 'PENDING', 'DONE']
  },
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
  tasks: [taskSchema],
  doneTasks: [taskSchema],
});

var User = module.exports = mongoose.model('User', userSchema);
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

module.exports.serialize = (user, callback) => {
  callback(null, user.id);
}

module.exports.deserialize = (id, callback) => {
  User.findById(id, callback);
}

module.exports.serializeUser = (user, callback) => {
  var obj = {
    email: user.email,
    tasks: user.tasks.map((task) => {
      return {
        title: task.title,
        projects: task.projects,
        tags: task.tags,
        uuid: task.uuid,
        priority: task.priority,
        modifiedDate: task.modifiedDate.getTime() / 1000,
        entryDate: task.entryDate.getTime() / 1000,
        dueDate: task.dueDate ? task.dueDate.getTime() / 1000 : null,
        doneDate: task.doneDate ? task.doneDate.getTime() / 1000 : null,
        status: task.status,
        times: task.times.map((time) => {
          return {
            start: time.start.getTime() / 1000,
            end: time.end ? time.end.getTime() / 1000 : null
          }
        })
      };
    })
  };
  callback(null, obj);
}

module.exports.serializeTask = (task, callback) => {
  var obj = {
    title: task.title,
    projects: task.projects,
    tags: task.tags,
    uuid: task.uuid,
    priority: task.priority,
    modifiedDate: task.modifiedDate.getTime() / 1000,
    entryDate: task.entryDate.getTime() / 1000,
    dueDate: task.dueDate ? task.dueDate.getTime() / 1000 : null,
    doneDate: task.doneDate ? task.doneDate.getTime() / 1000 : null,
    status: task.status,
    times: task.times.map((time) => {
      return {
        start: time.start.getTime() / 1000,
        end: time.end ? time.end.getTime() / 1000 : null
      }
    })
  }
  callback(null, obj);
}

module.exports.serializeTasks = (tasks, callback) => {
  var obj = tasks.map((task) => {
    return {
      title: task.title,
      projects: task.projects,
      tags: task.tags,
      uuid: task.uuid,
      priority: task.priority,
      modifiedDate: task.modifiedDate.getTime() / 1000,
      entryDate: task.entryDate.getTime() / 1000,
      dueDate: task.dueDate ? task.dueDate.getTime() / 1000 : null,
      doneDate: task.doneDate ? task.doneDate.getTime() / 1000 : null,
      status: task.status,
      times: task.times.map((time) => {
        return {
          start: time.start.getTime() / 1000,
          end: time.end ? time.end.getTime() / 1000 : null
        }
      })
    };
  });
  callback(null, obj);
}

module.exports.sync = (user, body, callback) => {
  var tasks = JSON.parse(body);
  for (var task in tasks) {
    var mid = findIdByKey(user.tasks, 'uuid', task.uuid);
    if (mid !== null) {
      var mTask = user.tasks.id(mid);
      if (new Date(task.modifiedDate) > mTask.modifiedDate) {
        mtask = task
      }
    } else {
      var tsk = new Task(task);
      user.tasks.push(tsk);
    }
  }
  user.save(callback);
}

module.exports.upload = (user, body, callback) => {
  var task = JSON.parse(body);
  var mid = findIdByKey(user.tasks, 'uuid', task.uuid);
  if (mid !== null) {
    var mTask = user.tasks.id(mid);
    if (new Date(task.modifiedDate) > mTask.modifiedDate) {
      mTask = task;
    }
  } else {
    var newTask = new Task(task);
    user.tasks.push(newTask);
  }
  user.save((err, user) => {
    callback(err, newTask);
  });
}

module.exports.compleatedTasks = (user, callback) => {
  var task = []
  for (var i = 0; i < user.tasks.length; i++) {
    if ('status' in user.tasks[i] && user.tasks[i]['status'] == 'DONE') {
      task.push(user.tasks[i]);
    }
  }
  callback(null, task);
}

module.exports.pendingTasks = (user, callback) => {
  var task = []
  for (var i = 0; i < user.tasks.length; i++) {
    if ('status' in user.tasks[i] && user.tasks[i]['status'] == 'PENDING') {
      task.push(user.tasks[i]);
    }
  }
  callback(null, task);
}

module.exports.createTask = (user, title, projects, tags, priority, due_date, callback) => {
  var task = new Task({
    title: title,
    projects: glist(projects),
    tags: glist(tags),
    uuid: uuidv1(),
    priority: priority,
    dueDate: gdate(due_date),
    entryDate: Date.now(),
    modifiedDate: Date.now(),
    status: 'PENDING'
  });
  user.tasks.push(task);
  user.save((err, usr) => {
    callback(err, task);
  });
}

module.exports.deleteTask = (user, id, callback) => {
  user.tasks.pull({
    _id: findIdByKey(user.tasks, 'uuid', id)
  });
  user.save(callback);
}

module.exports.findTask = (user, id, callback) => {
  callback(null, findByKey(user.tasks, 'uuid', id));
}

module.exports.completeTask = (user, id, callback) => {
  var mid = findIdByKey(user.tasks, 'uuid', id);
  var task = user.tasks.id(mid);
  task.status = 'DONE';
  task.modifiedDate = Date.now();
  user.save(callback);
}

module.exports.deCompleteTask = (user, id, callback) => {
  var mid = findIdByKey(user.tasks, 'uuid', id);
  var task = user.tasks.id(mid);
  task.status = 'PENDING';
  task.modifiedDate = Date.now();
  user.save(callback);
}

module.exports.modifyTask = (user, id, body, callback) => {
  var mid = findIdByKey(user.tasks, 'uuid', id);
  var task = user.tasks.id(mid);
  for (var key in task) {
    if (key in body) {
      task[key] = body[key];
    }
  }
  task.modifiedDate = Date.now();
  user.save();
  callback(null, task);
}

module.exports.segmentTask = (user, id, start, end, callback) => {
  var mid = findIdByKey(user.tasks, 'uuid', id);
  var task = user.tasks.id(mid);
  if (task.times.length !== 0 && task.times[task.times.length - 1].end === null) {
    callback('task is already active');
  } else {
    tasks.times.push({
      start: start,
      end: end
    });
    task.modifiedDate = Date.now();
    user.save();
    callback(null, task);
  }
}

module.exports.startTask = (user, id, time, callback) => {
  var mid = findIdByKey(user.tasks, 'uuid', id);
  var task = user.tasks.id(mid);
  if (task.times.length !== 0 && task.times[task.times.length - 1].end === null) {
    callback('task is already active');
  } else {
    task.times.push({
      start: time ? new Date(time) : Date.now(),
      end: null
    });
    task.modifiedDate = Date.now();
    user.save();
    callback(null, task);
  }
}

module.exports.endTask = (user, id, time, callback) => {
  var mid = findIdByKey(user.tasks, 'uuid', id);
  var task = user.tasks.id(mid);
  if (task.times.length === 0 || task.times[task.times.length - 1].end !== null) {
    callback('task has not been started');
  } else {
    // task.times[task.times.length - 1][0] = 'Hello!'
    task.times[task.times.length - 1].end = time ? new Date(time) : Date.now();
    task.modifiedDate = Date.now();
    user.save((err, usr) => {
      console.log("USR:", usr);
    });
    callback(null, task);
  }
}

module.exports.timeTask = (user, id, callback) => {
  var task = user.tasks.id(id);
  var obj = {
    'total': 0.0
  }
  task.times.forEach((segment) => {
    if (segment[1] !== null) {
      var diff = Math.abs(segment[0].getTime() - segment[1].getTime());
      if (roundDate(segment[0]) in obj) {
        obj[roundDate(segment[0])] += diff;
      } else {
        obj[roundDate(segment[0])] = diff;
      }
      obj.total += diff;
    }
  });
  callback(null, obj);
};
