var express = require('express')
var router = express.Router();

var userRouter = require('./user.js');
var taskRouter = require('./task.js');

router.use('/user/', userRouter);
router.use('/task/', taskRouter);

module.exports = router;
