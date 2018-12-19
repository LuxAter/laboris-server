var express = require('express');
var router = express.Router();

router.use('/api/', require('./api/index.js'));

module.exports = router;
