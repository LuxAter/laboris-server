var express = require('express');
// var User = require('../../models/user');
var Task = require('../../models/task');

var router = express.Router();

router.get('/', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.getPending(req.user, (tasks) => {
    Task.serializeTasks(tasks, (tasks) => {
      res.json(tasks);
    });
  });
});

router.get('/pending', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.getPending(req.user, (tasks) => {
    Task.serializeTasks(tasks, (tasks) => {
      res.json(tasks);
    });
  });
});

router.get('/completed', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.getDone(req.user, (tasks) => {
    Task.serializeTasks(tasks, (tasks) => {
      res.json(tasks);
    });
  });
});

router.get('/all', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.serializeTasks(req.user.tasks, (tasks) => {
    res.json(tasks);
  });
});

router.get('/min', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.getPending(req.user, (tasks) => {
    Task.serializeTasksLight(tasks, (tasks) => {
      res.json(tasks);
    });
  });
});
router.get('/min/pending', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.getPending(req.user, (tasks) => {
    Task.serializeTasksLight(tasks, (tasks) => {
      res.json(tasks);
    });
  });
});
router.get('/min/completed', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.getDone(req.user, (tasks) => {
    Task.serializeTasksLight(tasks, (tasks) => {
      res.json(tasks);
    });
  });
});
router.get('/min/all', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.serializeTasksLight(req.user.tasks, (tasks) => {
    res.json(tasks);
  });
});

router.post('/create', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.createTask(req.user, req.body.title, req.body.projects, req.body.tags, req.body.priority, req.body.dueDate, (err, task) => {
    if(err) return res.json({'error': err});
    return res.json(task);
  });
});

router.get('/:uuid', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.findTask(req.user, req.params.uuid, (task) => {
    Task.serializeTasks(task, (task) => {
      res.json(task);
    });
  });
});

router.post('/:uuid/delete', (req, res) => {
  if (!req.user) return res.json({'error': "must be logged in"});
  Task.deleteTask(req.user, req.params.uuid, (err, user) => {
    if(err) return res.json({'error': err});
    return res.json(user);
  });
});

router.post('/:uuid/modify', (req,res) => {
  if(!req.user) return res.json({'error': 'must be logged in'});
  Task.modifyTask(req.user, req.params.uuid, req.body, (err, task) => {
    if(err) return res.json({'error': err});
    return res.json(task);
  });
});

router.post('/:uuid/start', (req, res) => {
  if(!req.user) return res.json({'error': 'must be logged in'});
  Task.startTask(req.user, req.params.uuid, (err, task) => {
    if(err) return res.json({'error': err});
    return res.json(task);
  });
});

router.post('/:uuid/stop', (req, res) => {
  if(!req.user) return res.json({'error': 'must be logged in'});
  Task.stopTask(req.user, req.params.uuid, (err, task) => {
    if(err) return res.json({'error': err});
    return res.json(task);
  });
});

// router.get('/', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in"
//     });
//   } else {
//     User.serializeTasks(req.user.tasks, (err, data) => {
//       if (err) return res.json({
//         'error': err
//       });
//       else return res.json(data);
//     });
//   }
// });
//
// router.get('/compleated', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'error': "Must be logged in"
//     });
//   } else {
//     User.compleatedTasks(req.user, (err, tasks) => {
//       if (err) return res.json({
//         'error': err
//       });
//       User.serializeTasks(tasks, (err, data) => {
//         if (err) return res.json({
//           'error': err
//         });
//         else return res.json(data);
//       });
//     });
//   }
// });
//
// router.get('/pending', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'error': "Must be logged in"
//     });
//   } else {
//     User.pendingTasks(req.user, (err, tasks) => {
//       if (err) return res.json({
//         'error': err
//       });
//       User.serializeTasks(tasks, (err, data) => {
//         if (err) return res.json({
//           'error': err
//         });
//         else return res.json(data);
//       });
//     });
//   }
// });
//
// router.get('/:id', (req, res) => {
//   if (!req.user) {
//     return res.json({});
//   } else {
//     User.findTask(req.user, req.params.id, (err, task) => {
//       if (err) return res.json({
//         'error': err
//       });
//       User.serializeTask(task, (err, data) => {
//         if (err) return res.json({
//           'error': err
//         });
//         else return res.json(data);
//       });
//     });
//   }
// });
//
// router.post('/create', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in to create task"
//     });
//   }
//   User.createTask(req.user, req.body.title, req.body.projects, req.body.tags, req.body.priority, req.body.dueDate, (err, task) => {
//     if (!err) return res.json(task);
//     else return res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.post('/delete', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in to create task"
//     });
//   }
//   User.deleteTask(req.user, req.body.id, (err, user) => {
//     if (!err) return res.json(user);
//     else return res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.post('/complete', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       'error': "Must be logged in"
//     });
//   }
//   User.completeTask(req.user, req.body.id, (err, user) => {
//     if (!err) return res.json(user);
//     else return res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.post('/decomplete', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       'error': "Must be logged in"
//     });
//   }
//   User.deCompleteTask(req.user, req.body.id, (err, user) => {
//     if (!err) return res.json(user);
//     else return res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.post('/modify/:id', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       'error': "Must be logged in"
//     });
//   }
//   User.modifyTask(req.user, req.params.id, req.body, (err, task) => {
//     if (!err) return res.json(task);
//     res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.get('/time/:id', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in"
//     });
//   }
//   User.timeTask(req.user, req.params.id, (err, times) => {
//     return res.json(times);
//   });
// });
//
// router.post('/segment/:id', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in"
//     });
//   }
//   User.segmentTask(req.user, req.params.id, req.body.start, req.body.end, (err, task) => {
//     if (!err) return res.json(task);
//     else return res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.post('/start/:id', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in"
//     });
//   }
//   User.startTask(req.user, req.params.id, req.body.time, (err, task) => {
//     if (!err) return res.json(task);
//     else return res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.post('/stop/:id', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in"
//     });
//   }
//   User.endTask(req.user, req.params.id, req.body.time, (err, task) => {
//     if (!err) return res.json(task);
//     else return res.json({
//       'success': false,
//       'error': err
//     });
//   });
// });
//
// router.post('/sync', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'success': false,
//       "error": "Must be logged in"
//     });
//   }
//   User.sync(req.user, req.body.tasks, (err, user) => {
//     if (!err) return res.json(user);
//     else return res.json({
//       'error': err
//     });
//   });
// });
//
// router.post('/upload', (req, res) => {
//   if (!req.user) {
//     return res.json({
//       'error': "Must be logged in"
//     });
//   }
//   User.upload(req.user, req.body.task, (err, task) => {
//     if (!err) return res.json(task);
//     else return res.json({
//       'error': err
//     });
//   });
// });

module.exports = router;
