var express = require('express');
var router = express.Router();

var User = require('../../models/user.js');
var Task = require('../../models/task.js');

router.post('/create', (req, res) => {
  console.log('\033[1;35m[router] POST \'/api/task/create\'\033[0m');
  if  (req.user){
    User.findById(req.user.uid, (err, user) => {
      if (err) return res.json({success: false, error: 'Failed to find user'});
      Task.createTask(user, req.body.title, req.body.projects, req.body.tags, req.body.priority, req.body.dueDate, (err, task) => {
        if (err) return res.json({success: 'false', error: err});
        return res.json({
          success: true,
          task: task
        });
      });
    });
  }else{
    return res.json({
      success: false,
      error: 'No currently authenticated user'
    });
  }
});

router.get('/pending', (req, res) => {
  console.log('\033[1;34m[router] GET \'/api/task/pending\'\033[0m');
  if (req.user) {
    User.findById(req.user.uid, (err, user) => {
      if (err) return res.json({success: false, error: 'Failed to find user'});
      return res.json({success: true, pending: user.pendingTasks});
    });
  }else{
    return res.json({
      success: false,
      error: 'No currently authenticated user'
    });
  }
});

module.exports = router;
