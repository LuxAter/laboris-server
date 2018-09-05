var express = require('express')
var router = express.Router();

var userRouter = require('./user.js');
var taskRouter = require('./task.js');

var User = require('../../models/user'); 

router.use('/user/', userRouter);
router.use('/task/', taskRouter);
router.get('/', (req, res) => {
  if(!req.user){
    return res.json({});
  }
  User.serializeUser(req.user, (err, user) => {
    if(err) res.json({'error': err});
    else res.json(user);
  });
});

module.exports = router;
