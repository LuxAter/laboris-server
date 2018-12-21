var express = require('express');
var router = express.Router();

router.use('/user/', require('./user.js'));
router.use('/task/', require('./task.js'));

module.exports = router;
