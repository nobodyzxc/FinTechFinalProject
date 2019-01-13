var express = require('express');
var router = express.Router();
var database = require('../modules/database');
var ethereum = require('../modules/ethereum');

const Pending = 'pending';
const Accepted = 'accepted';
const Canceled = 'canceled';
const Finished = 'finished';
const Customer = 'customer';
const Restaurant = 'restaurant';
const History = 'history';

var HTMLDefs = (webtype, reqname) => `
  <script>
    const Pending = '${Pending}';
    const Accepted = '${Accepted}';
    const Canceled = '${Canceled}';
    const Finished = '${Finished}';
    const Customer = '${Customer}';
    const Restaurant = '${Restaurant}';
    const History = '${History}';
    const Webtype = '${webtype}';
    const ReqName = '${reqname}';
  </script>
`

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
  });
});

router.get('/features', function(req, res, next) {
  ethereum.getUserAccounts(function(accounts){
    res.render('features', {
      shops: database.getAllRestaurants(),
      key: process.env.apiKey,
      people_map: people_map(),
      people_rank: people_rank(),
      accounts: accounts
    });
  });
});

router.get(`/${Restaurant}`, function(req, res, next) {
  res.render('select', {
    webtype: Restaurant,
    isRestaurant : true,
    title: '請選擇餐廳',
    select: database.getAllRestaurants()
  });
});

router.get(`/${Restaurant}/:name`, function(req, res, next) {
  res.render(Restaurant, {
    reqname: req.params.name,
    webtype: Restaurant,
    definitions: HTMLDefs(Customer, req.params.name),
    orders: database.getOrdersByRest(req.params.name, Pending),
    shops: database.getAllRestaurants()
  });
});

router.get(`/${Customer}`, function(req, res, next) {
  ethereum.getUserAccounts(function(accounts){
    res.render('select', {
      webtype: Customer,
      title: '請選擇顧客',
      select: accounts
    });
  });
});

router.get(`/${Customer}/:name`, function(req, res, next) {
  ethereum.getUserAccounts(function(accounts){
    res.render(Customer, {
      webtype: Customer,
      reqname: req.params.name,
      definitions: HTMLDefs(Customer, req.params.name),
      orders: database.getOrdersByCust(req.params.name, Pending),
      custs: accounts
    });
  });
});

router.get(`/${History}`, function(req, res, next) {
  res.render(History, {
    webtype: History,
    definitions: HTMLDefs(History, ''),
    typename: History,
  });
});

router.get('/shops', function(req, res, next) {
  /* database here */
  //res.send(["左撇子", "四五大街", "八方雲集"]);
  res.send(database.getAllRestaurants());
});

router.get('/menuOf', function(req, res, next) {

  res.send(database.getDish(req.query.shop).map(function(elt){
    return { id: elt[0], name: elt[1], value: elt[2] }
  }));

});


router.get('/about', function(req, res, next) {
  res.render('about', {
  });
});

router.get('/order', function(req, res, next) {

  if(req.query.type == Restaurant){
    res.send(database.getOrdersByRest(req.query.name, req.query.status));
  }
  else if(req.query.type == Customer){
    res.send(database.getOrdersByCust(req.query.name, req.query.status));
  }
  else{
    res.send(database.getOrders(req.query.status));
  }
});

function seqExecInsertOrderDish(orderId, dishes){
  for(var i = 0; i < dishes.length; i++){
    let dish = dishes[i];
    if(!database.insertOrderDish(orderId, dish.id, dish.amount))
      return false;
  }
  return true;
}


router.post('/post_order', function(req, res, placeOrdernext) {
  /* in:
   * { shop: "四五大街",
   *   buyer: '0x000000001',
   *   dish: [
   *     { id: 0, amount: 2 }
   *     { id: 3, amount: 4 }
   *   ],
   *   price: 100
   * }
   * */

  console.log(req.body);
  /* tricky line to avoid unknown bug */
  req.body = JSON.parse(req.body.order);

  let dishes = req.body.dish;
  let orderId = database.newOrderId();
  let succ = database.exec('BEGIN;') &&
    database.insertOrder(
      orderId,
      req.body.shop,
      req.body.buyer,
      req.body.price) &&
    seqExecInsertOrderDish(orderId, dishes);

  if(succ){
    ethereum.placeOrder(orderId, req.body.shop, req.body.buyer,
      req.body.price, function(succ){
        database.exec(succ ? 'COMMIT;' : 'ROLLBACK;');
        res.send({
          status: succ ? "success" : "failed",
          code: succ ? 200 : 500
        });
      })
  }
  else{
    database.exec('ROLLBACK;');
    res.send({
      status: "failed",
      code: 500
    });
  }
});


router.get('/uploadPeople', function(req, res, next) {
  let succ = database.updateHeat(req.query.name, req.query.value);
  res.send({
    status: succ ? "success" : "failed",
    code: succ ? 200 : 500
  });
});

function people_rank(){
  return database.getHeat().map(function(elt){
    return {
      name: elt[0],
      number: elt[1],
      avail: elt[2] - elt[1],
      total: elt[2]
    };
  });
}

router.get('/people_rank', function(req, res, next) {
  res.send(people_rank());
});


function people_map(){
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
  return rtn;
}

router.get('/people_map', function(req, res, next) {
  res.send(people_map());
});

router.get('/chaininfo', function(req, res, next) {
  res.render('chaininfo', {});
});

router.get('/accounts', function(req, res, next) {
  //res.send([]);
  try{
    ethereum.getAccounts(
      ['系統管理者',...database.getAllRestaurants()], function(accounts){
        res.send(accounts);
      });
  }
  catch(err){
    console.log(err);
  }
});

router.get('/events', function(req, res, next) {
  ethereum.getAllEvents(function(events){
    res.send(events);
  });
});

router.get('/cancel', function(req, res, next) {
  // cancel order
  //console.log(req.query.id)
  let succ = database.exec('BEGIN;') &&
    database.changeOrderState(req.query.id, Canceled);

  if(succ){
    if(req.query.type == Customer){
      ethereum.cancelOrderByCust(req.query.id, req.query.name,
        function(succ){
          database.exec(succ ? 'COMMIT;' : 'ROLLBACK;');
          res.send({
            status: succ ? "success" : "failed",
            code: succ ? 200 : 500
          });
        });
    }
    if(req.query.type == Restaurant){
      ethereum.cancelOrderByRest(req.query.id, req.query.name,
        function(succ){
          database.exec(succ ? 'COMMIT;' : 'ROLLBACK;');
          res.send({
            status: succ ? "success" : "failed",
            code: succ ? 200 : 500
          });
        });
    }
  }
  else{
    database.exec('ROLLBACK;');
    res.send({
      status: "failed",
      code: 500
    });
  }
});

router.get('/finish', function(req, res, next) {
  // finish order
  //console.log(req.query.id)
  let succ = database.exec('BEGIN;') &&
    database.changeOrderState(req.query.id, Finished);

  if(succ){
    ethereum.finishOrder(req.query.id, req.query.shop,
      function(succ){
        database.exec(succ ? 'COMMIT;' : 'ROLLBACK;');
        res.send({
          status: succ ? "success" : "failed",
          code: succ ? 200 : 500
        });
      });
  }
  else{
    database.exec('ROLLBACK;');
    res.send({
      status: "failed",
      code: 500
    });
  }
});

router.get('/accept', function(req, res, next) {
  // accept order
  //console.log(req.query.id)
  let succ = database.exec('BEGIN;') &&
    database.changeOrderState(req.query.id, Accepted);

  if(succ){
    ethereum.acceptOrder(req.query.id, req.query.shop,
      function(succ){
        database.exec(succ ? 'COMMIT;' : 'ROLLBACK;');
        res.send({
          status: succ ? "success" : "failed",
          code: succ ? 200 : 500
        });
      });
  }
  else{
    database.exec('ROLLBACK;');
    res.send({
      status: "failed",
      code: 500
    });
  }
});

router.get('/getMapApiKey', function(req, res, next) {
  console.log('api key is ' + process.env.apiKey);
  res.send({
    key: process.env.apiKey
  });
});

router.get('/dump', function(req, res, next) {
  res.send({status: database.dump()});
});

module.exports = router;
