var express = require('express');
var router = express.Router();
var database = require('./database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    shops: database.getAllRestaruants(),
    key: process.env.apiKey
  })
});

router.get('/shops', function(req, res, next) {
  /* database here */
  //res.send(["左撇子", "四五大街", "八方雲集"]);
  res.send(database.getAllRestaruants());
});

router.get('/menuOf', function(req, res, next) {

  res.send(database.getDish(req.query.shop).map(function(elt){
    return { id: elt[0], name: elt[1], value: elt[2] }
  }));

});

router.get('/order', function(req, res, next) {

  res.send(database.getOrders(req.query.shop, req.query.status));

});

function seqExecInsertOrderDish(orderId, dishes){
  for(var i = 0; i < dishes.length; i++){
    let dish = dishes[i];
    if(!database.insertOrderDish(orderId, dish.id, dish.amount))
      return false;
  }
  return true;
}


router.post('/post_order', function(req, res, next) {
  /* in:
   * { shop: "四五大街",
   *   dish: [
   *     { id: 0, amount: 2 }
   *     { id: 3, amount: 4 }
   *   ],
   *   price: 100
   * }
   * */

  console.log(req.body);
  req.body = JSON.parse(req.body.order);

  let dishes = req.body.dish;
  let orderId = database.newOrderId();
  let succ = database.exec('BEGIN;') &&
    database.insertOrder(
      orderId,
      req.body.shop,
      req.body.price) &&
    seqExecInsertOrderDish(orderId, dishes);

  database.exec(succ ? 'COMMIT;' : 'ROLLBACK;');
  res.send({
    status: succ ? "success" : "failed",
    code: succ ? 200 : 500
  });

});


router.get('/people', function(req, res, next) {
  //console.log(req.query.shop)
  res.send(database.getHeat().map(function(elt){
    return {
      name: elt[0],
      number: elt[1],
      avail: elt[2] - elt[1]
    }
  }));
});

router.get('/people_map', function(req, res, next) {
  var rtn = {};
  var locs = database.getAllLocations();
  var heats = database.getHeat();
  for(var i = 0; i < locs.length; i++){
    rtn[locs[i][0]] = {
      center: {lat: locs[i][1], lng: locs[i][2]}
    };
  }

  for(var i = 0; i < heats.length; i++){
    rtn[heats[i][0]].population = heats[i][1];
  }

  res.send(rtn);
});

router.get('/drop', function(req, res, next) {
  // drop order
  //console.log(req.query.id)
  let succ = database.changeOrderState(req.query.id, 'dropped');

  res.send({
    status: succ ? "success" : "failed",
    code: succ ? 200 : 500
  });
});

router.get('/finish', function(req, res, next) {
  // finish order
  //console.log(req.query.id)
  let succ = database.changeOrderState(req.query.id, 'finished');
  res.send({
    status: succ ? "success" : "failed",
    code: succ ? 200 : 500
  });
});

router.get('/getMapApiKey', function(req, res, next) {
  console.log('api key is ' + process.env.apiKey);
  res.send({
    key: process.env.apiKey
  });
});

router.get('/test', function(req, res, next) {
  res.send(database.getOrders('樂山', 'padding'));
  //res.send(database.getAllDishes());
  //console.log(database.newOrderId());
});

module.exports = router;
