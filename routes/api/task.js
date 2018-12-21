var express = require('express');
var router = express.Router();

var User = require('../../models/user.js');
var Task = require('../../models/task.js');

router.post('/create', (req, res) => {
  console.log('\033[1;35m[router] POST \'/api/task/create\'\033[0m');
  if  (req.user){

  }
  return res.json({
    success: false,
    error: 'No currently authenticated user'
  });
});

module.exports = router;
