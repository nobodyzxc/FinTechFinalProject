var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.render('index')
});

router.get('/shops', function(req, res, next) {
  /* database here */
  res.send(["左撇子", "四五大街", "八方雲集"]);
});

router.get('/menuOf', function(req, res, next) {
  //console.log(req.query.shop)
  res.send([
    {name: '白飯', value: 10},
    {name: '小菜', value: 30 },
    {name: '貢丸湯', value: 30}
  ]);

});

module.exports = router;
