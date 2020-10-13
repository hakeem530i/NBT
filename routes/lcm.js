var express = require('express');
var router = express.Router();

/* GET home page. */
// router.post('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.post('/lcm', function(req,res){
    console.log(req.body);
  })

module.exports = router;
