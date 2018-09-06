var mongoose = require('mongoose');
var uuidv1 = require('uuid/v1')

var util = require('./util');

var taskSchema = mongoose.Schema({
  uuid: String,
  modifiedDate: Date,
  title: String,
  projects: [String],
  tags: [String],
  priority: Number,
  entryDate: Date,
  dueDate: Date,
  doneDate: Date,
  status: {
    type: String,
    enum: ['NONE', 'PENDING', 'DONE']
  },
  times: [String]
});

module.exports.schema = taskSchema;
var Task = module.exports = mongoose.model('Task', taskSchema);

module.exports.createTask = (user, title, projects, tags, priority, due_date, callback) => {
  var task = new Task({
    uuid: uuidv1(),
    modifiedDate: new Date(),
    title: title,
    projects: projects ? (Array.isArray(projects) ? projects : [projects]) : [],
    tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    entryDate: new Date(),
    dueDate: due_date,
    status: 'PENDING'
  });
  user.tasks.push(task);
  user.save((err, user) => {
    callback(err, task);
  })
}

module.exports.deleteTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.tasks, 'uuid', uuid);
  user.tasks.pull({
    _id: mid
  });
  user.save(callback);
}

module.exports.serialiseTask = (task, callback) => {
  callback({
    uuid: task.uuid,
    modifiedDate: task.modifiedDate.getTime() / 1000,
    title: task.title,
    projects: task.projects,
    tags: task.tags,
    priority: task.priority,
    entryDate: task.entryDate ? task.entryDate.getTime() / 1000 : null,
    dueDate: task.dueDate ? task.dueDate.getTime() / 1000 : null,
    doneDate: task.doneDate ? task.doneDate.getTime() / 1000 : null,
    status: task.status,
    times: task.times.map((time) => [parseFloat(time.split(',')[0]),
      time.split(',')[1] !== '' ? parseFloat(time.split(',')[1]) : null
    ])
  });
}

module.exports.serializeTaskLight = (task, callback) => {
  callback({
    uuid: task.uuid,
    modifiedDate: task.modifiedDate.getTime() / 1000,
    title: task.title,
    projects: task.projects,
    tags: task.tags,
    priority: task.priority,
    entryDate: task.entryDate ? task.entryDate.getTime() / 1000 : null,
    dueDate: task.dueDate ? task.dueDate.getTime() / 1000 : null,
    doneDate: task.doneDate ? task.doneDate.getTime() / 1000 : null,
    status: task.status
  });
}

module.exports.deserializeTask = (body, callback) => {
  var task = new Task({
    uuid: 'uuid' in body ? body['uuid'] : uuidv1(),
    modifiedDate: 'modifiedDate' in body ? new Date(body['modifiedDate']) : new Date(),
    title: 'title' in body ? body['title'] : '',
    projects: 'projects' in body ? body['projects'] : [],
    tags: 'tags' in body ? body['tags'] : [],
    priority: 'priority' in body ? body['priority'] : 0,
    entryDate: 'entryDate' in body ? new Date(body['entryDate']) : new Date(),
    dueDate: 'dueDate' in body ? new Date(body['dueDate']) : null,
    doneDate: 'doneDate' in body ? new Date(body['doneDate']) : null,
    status: 'status' in body ? body['status'] : 'PENDING',
    times: 'times' in body ? body['times'].map((time) => time[0].toString() +
      ',' + time[1] ? time[1].toString() : '') : []
  });
}

module.exports.serializeTasks = (tasks, callback) => {
  callback(tasks.map((task) => {
    return {
      uuid: task.uuid,
      modifiedDate: task.modifiedDate.getTime() / 1000,
      title: task.title,
      projects: task.projects,
      tags: task.tags,
      priority: task.priority,
      entryDate: task.entryDate ? task.entryDate.getTime() / 1000 : null,
      dueDate: task.dueDate ? task.dueDate.getTime() / 1000 : null,
      doneDate: task.doneDate ? task.doneDate.getTime() / 1000 : null,
      status: task.status,
      times: task.times.map((time) => [parseFloat(time.split(',')[0]),
        time.split(',')[1] !== '' ? parseFloat(time.split(',')[1]) : null
      ])
    }
  }));
}

module.exports.serializeTasksLight = (tasks, callback) => {
  callback(tasks.map((task) => {
    return {
      uuid: task.uuid,
      modifiedDate: task.modifiedDate.getTime() / 1000,
      title: task.title,
      projects: task.projects,
      tags: task.tags,
      priority: task.priority,
      entryDate: task.entryDate ? task.entryDate.getTime() / 1000 : null,
      dueDate: task.dueDate ? task.dueDate.getTime() / 1000 : null,
      doneDate: task.doneDate ? task.doneDate.getTime() / 1000 : null,
      status: task.status
    }
  }));
}

module.exports.findTask = (user, uuid, callback) => {
  uuid = Array.isArray(uuid) ? uuid : [uuid];
  var res = []
  for (var i = 0; i < user.tasks.length; i++) {
    if (uuid.indexOf(user.tasks[i].uuid) > -1) {
      res.push(user.tasks.id(user.tasks[i]._id));
    }
  }
  callback(res);
}

module.exports.getPending = (user, callback) => {
  var res = []
  for (var i = 0; i < user.tasks.length; i++) {
    if (user.tasks[i].status == 'PENDING') {
      res.push(user.tasks.id(user.tasks[i]._id));
    }
  }
  callback(res);
}

module.exports.getDone = (user, callback) => {
  var res = []
  for (var i = 0; i < user.tasks.length; i++) {
    if (user.tasks[i].status == 'DONE') {
      res.push(user.tasks.id(user.tasks[i]._id));
    }
  }
  callback(res);
}

module.exports.comleteTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.tasks, 'uuid', uuid);
  var task = user.tasks.id(mid);
  if (task.times.length > 0 && task.times[task.times.length - 1].split(',')[1] == '') {
    task.times[task.times.length - 1] += Date.now().toString();
  }
  task.status = 'DONE';
  task.modifiedDate = new Date();
  user.save(callback);
}

module.exports.deCompleteTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.tasks, 'uuid', uuid)
  var task = user.tasks.id(mid);
  task.status = 'PENDING';
  task.modifiedDate = new Date();
  user.save(callback);
}

module.exports.modifyTask = (user, uuid, body, callback) => {
  var mid = util.findIdByKey(user.tasks, 'uuid', uuid);
  var task = user.tasks.id(mid);
  if ('title' in body) task.title = body['title'];
  if ('projects' in body) task.projects = Array.isArray(body['projects']) ? body['projects'] : [body['projects']];
  if ('tags' in body) task.tags = Array.isArray(body['tags']) ? body['tags'] : [body['tags']];
  if ('dueDate' in body) task.dueDate = body['dueDate'];
  if ('priority' in body) task.priority = body['priority'];
  task.modifiedDate = new Date();
  user.markModified('tasks');
  user.save((err, user) => {
    callback(err, task);
  });
}

module.exports.startTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.tasks, 'uuid', uuid);
  var task = user.tasks.id(mid);
  if (task.times.length !== 0 && task.times[task.times.length - 1].split(',')[1] === '') {
    callback('task already active');
  } else {
    task.times.push(Date.now().toString() + ',');
    task.modifiedDate = new Date()
    user.markModified('tasks');
    user.save((err, usr) => {
      callback(err, task);
    });
  }
}

module.exports.stopTask = (user, uuid, callback) => {
  var mid = util.findIdByKey(user.tasks, 'uuid', uuid);
  var task = user.tasks.id(mid);
  if (task.times.length !== 0 && task.times[task.times.length - 1].split(',')[1] !== '') {
    callback('task not active');
  } else {
    task.times[task.times.length - 1] += Date.now().toString();
    task.modifiedDate = new Date()
    task.save();
    user.markModified('tasks');
    user.save((err, usr) => {
      callback(err, task);
    });
  }
}
