var sql = require('sql.js')
var fs = require("fs")

var restaurants = fs.readFileSync('database/restaurants.sqlite');
var db = new SQL.Database(restaurants);

/* return specific retaurant location */
module.exports.getLocation = function (r_name) {
  let location = db.exec("SELECT * FROM location WHERE r_name = \'" + r_name + "\'")
  return location[0].values
}

/* return all retaurant dishes from dish table */
module.exports.getAllDishes = function () {
  var dishes = db.exec("SELECT * FROM dish ")
  return dishes[0].values
}

module.exports.getAllDisheMap = function () {
  var dishes = db.exec("SELECT id, d_name FROM dish ")[0].values;
  var mapping = {}
  for(var i = 0; i < dishes.length; i++){
    mapping[dishes[i][0]] = dishes[i][1];
  }
  return mapping;
}

/* return specific retaurant dishes from dish table */
module.exports.getDish = function (r_name) {
  let dishes = db.exec("SELECT id, d_name, price FROM dish WHERE r_name = \'" + r_name + "\'")
  return dishes[0].values
}

/* return all retaurant locations from location table */
module.exports.getAllLocations = function () {
  var locations = db.exec("SELECT * FROM location ")
  return locations[0].values
}

module.exports.getAllRestaurants = function (){
  var locations = db.exec("SELECT r_name FROM location ")
  return locations[0].values.map(elt=>elt[0])
}

module.exports.getHeat = function (){
  var locations = db.exec("SELECT * FROM heat")
  return locations[0].values
}

module.exports.updateHeat = function(name, value){
  try{
    db.exec(`UPDATE heat SET people = ${value} WHERE r_name = '${name}';`);
  }
  catch(err){
    console.log(err);
    return false;
  }
  return true;
}

module.exports.newOrderId = function(){
  var counts = db.exec("SELECT COUNT(*) from orders")
  return counts[0].values[0][0];
}

module.exports.getOrdersByCust = function(c_name, type){
  try{
    let orders = db.exec(`SELECT id, price, r_name, c_name FROM orders WHERE c_name = '${c_name}' and status = '${type}'`);
    if(orders.length == 0) return [];
    orders = orders[0].values;

    let mapping = module.exports.getAllDisheMap();

    var ret = []
    for(var i = 0; i < orders.length; i++){
      ret.push({
        id: orders[i][0],
        dish: getOrderDishes(orders[i][0]),
        price: orders[i][1],
        restaurant: orders[i][2],
        customer: orders[i][3]
      });
    }

    for(var i = 0; i < ret.length; i++){
      for(var j = 0; j < ret[i].dish.length; j++){
        ret[i].dish[j].name = mapping[ret[i].dish[j].id];
      }
    }

    return ret;
  }
  catch(err){
    // empty Order
    return [];
  }

}

module.exports.getOrdersByRest = function(r_name, type){

  try{
    let orders = db.exec(`SELECT id, price, r_name, c_name FROM orders WHERE r_name = '${r_name}' and status = '${type}'`);
    if(orders.length == 0) return [];
    orders = orders[0].values;

    let mapping = module.exports.getAllDisheMap();

    console.log(orders);

    var ret = []
    for(var i = 0; i < orders.length; i++){
      ret.push({
        id: orders[i][0],
        dish: getOrderDishes(orders[i][0]),
        price: orders[i][1],
        restaurant: orders[i][2],
        customer: orders[i][3]
      });
    }

    for(var i = 0; i < ret.length; i++){
      for(var j = 0; j < ret[i].dish.length; j++){
        ret[i].dish[j].name = mapping[ret[i].dish[j].id];
      }
    }
    console.log(ret);
    return ret;
  }
  catch(err){
    // empty Order
    return [];
  }
}

module.exports.getOrders = function(type){

  try{
    let orders = db.exec(`SELECT id, price, r_name, c_name FROM orders where status = '${type}'`);
    if(orders.length == 0) return [];
    orders = orders[0].values;

    let mapping = module.exports.getAllDisheMap();

    var ret = []
    for(var i = 0; i < orders.length; i++){
      ret.push({
        id: orders[i][0],
        dish: getOrderDishes(orders[i][0]),
        price: orders[i][1],
        restaurant: orders[i][2],
        customer: orders[i][3]
      });
    }

    for(var i = 0; i < ret.length; i++){
      for(var j = 0; j < ret[i].dish.length; j++){
        ret[i].dish[j].name = mapping[ret[i].dish[j].id];
      }
    }
    return ret;
  }
  catch(err){
    // empty Order
    console.log(err);
    return [];
  }
}

function getOrderDishes(id){
  let dishes = db.exec(`SELECT dish_id, amount FROM order_dish WHERE order_id = '${id}'`)[0].values;
  return dishes.map(function(elt){
    return {id: elt[0], number: elt[1]};
  });
}

module.exports.changeOrderState = function(id, status){
  try{
    db.exec(`UPDATE orders SET status = '${status}' WHERE id = ${id};`);
  }
  catch(err){
    console.log(err);
    return false;
  }
  return true;
}

module.exports.insertOrder = function(oid, rname, cname, price){
  try{
 db.exec(`INSERT INTO orders(id, r_name, c_name, price, status) VALUES (${oid}, '${rname}', '${cname}', ${price}, 'padding');`);
  }
  catch(err){
    console.log(err);
    return false;
  }
  return true;
}

module.exports.insertOrderDish = function(oid, did, amt){
  try{
    db.exec(`INSERT INTO order_dish(order_id, dish_id, amount) VALUES (${oid}, ${did}, ${amt});`);
  }
  catch(err){
    console.log(err);
    return false;
  }
  return true;
}

module.exports.exec = function(cmd){
  try{
    db.exec(cmd);
  }
  catch(err){
    console.log(err);
    return false;
  }
  return true;
}

module.exports.dump = function(){
  var data = db.export();
  var buffer = new Buffer.from(data);
  fs.writeFileSync("dump.sqlite", buffer);
  return 'done';
}
