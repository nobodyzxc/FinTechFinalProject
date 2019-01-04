var express = require('express');
var database = require('../modules/database');
var router = express.Router();

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  //res.send(req.params.name + "'s order");
  res.render('receive', {
    shop: req.params.name,
    orders: database.getOrders(req.params.name, 'padding'),
    shops: database.getAllRestaurants()
  });
});

router.get('/', function(req, res, next) {
  res.render('users', {
    shops: database.getAllRestaurants()
  });
});

module.exports = router;
