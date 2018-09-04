var express = require('express');
var User = require('../../models/user');

var router = express.Router();

router.get('/', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      "error": "Must be logged in"
    });
  } else {
    res.json(req.user.tasks);
  }
});

router.post('/create', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      "error": "Must be logged in to create task"
    });
  }
  User.createTask(req.user, req.body, (err, task) => {
    if (!err) return res.json(task);
    else return res.json({
      'success': false,
      'error': err
    });
  });
});

router.post('/delete', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      "error": "Must be logged in to create task"
    });
  }
  User.deleteTask(req.user, req.body.id, (err, user) => {
    if (!err) return res.json(user);
    else return res.json({
      'success': false,
      'error': err
    });
  });
});

router.post('/complete', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      'error': "Must be logged in"
    });
  }
  User.completeTask(req.user, req.body.id, (err, user) => {
    if (!err) return res.json(user);
    else return res.json({
      'success': false,
      'error': err
    });
  });
});

router.post('/decomplete', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      'error': "Must be logged in"
    });
  }
  User.deCompleteTask(req.user, req.body.id, (err, user) => {
    if (!err) return res.json(user);
    else return res.json({
      'success': false,
      'error': err
    });
  });
});

router.post('/modify/:id', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      'error': "Must be logged in"
    });
  }
  User.updateTask(req.user, req.params.id, req.body, (err, task) => {
    if (!err) return res.json(task);
    res.json({
      'success': false,
      'error': err
    });
  });
});

router.get('/time/:id', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      "error": "Must be logged in"
    });
  }
  User.timeTask(req.user, req.params.id, (err, times) => {
    return res.json(times);
  });
});

router.post('/segment/:id', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      "error": "Must be logged in"
    });
  }
  User.segmentTask(req.user, req.params.id, req.body.start, req.body.end, (err, task) => {
    if (!err) return res.json(task);
    else return res.json({
      'success': false,
      'error': err
    });
  });
});

router.post('/start/:id', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      "error": "Must be logged in"
    });
  }
  User.startTask(req.user, req.params.id, req.body.time, (err, task) => {
    if (!err) return res.json(task);
    else return res.json({
      'success': false,
      'error': err
    });
  });
});

router.post('/stop/:id', (req, res) => {
  if (!req.user) {
    return res.json({
      'success': false,
      "error": "Must be logged in"
    });
  }
  User.endTask(req.user, req.params.id, req.body.time, (err, task) => {
    if (!err) return res.json(task);
    else return res.json({
      'success': false,
      'error': err
    });
  });
});

module.exports = router;
