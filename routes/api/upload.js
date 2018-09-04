var express = require('express');
var router = express.Router();

router.post('/upload', (req, res) => {
  if (!req.user){
    return res.json({'success': false, 'error': "Must be logged in"});
  }
  var data = JSON.parse(req.body.data);
  for (var task in data){

  }
});

module.exports = router;
