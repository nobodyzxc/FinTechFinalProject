var express = require('express');
var database = require('./database');
var router = express.Router();

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  //res.send(req.params.name + "'s order");
  res.render('receive', {
    shop: req.params.name,
    orders: database.getOrders(req.params.name, 'padding'),
    shops: database.getAllRestaruants()
  });
});

router.get('/', function(req, res, next) {
  res.render('users', {
    shops: database.getAllRestaruants()
  });
});

module.exports = router;
