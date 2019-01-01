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
    {id: 0, name: '白飯', value: 10},
    {id: 1, name: '小菜', value: 30 },
    {id: 2, name: '貢丸湯', value: 30}
  ]);

});

router.post('/order', function(req, res, next) {
  /* { shop: "四五大街",
   *   dish: [
   *     { id: 0, amount: 2 }
   *     { id: 3, amount: 4 }
   *   ],
   *   price: 100
   * }
   * */
  //console.log(req.body)
  res.send({
    status: "success",
    code: 200
  });
});


router.get('/people', function(req, res, next) {
  //console.log(req.query.shop)
  res.send([
    {name: "左撇子", number: 50, avail: 10},
    {name: "四五大街", number: 60, avail: 20},
    {name: "八方雲集", number: 30, avail: 30}
  ]);

});


module.exports = router;
