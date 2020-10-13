var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/lcm', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log("HOME")
});

module.exports = router;
