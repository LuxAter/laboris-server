var express = require('express')
var router = express.Router();

var userRouter = require('./user.js');
// var projectRouter = require('./project.js');
var taskRouter = require('./task.js');

var User = require('../../models/user'); 

router.use('/user/', userRouter);
// router.use('/project/', projectRouter);
router.use('/task/', taskRouter);

module.exports = router;
