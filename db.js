// var sql = require('sql.js')
// var fs = require("fs")

/* Load DB */
// var restaurants = fs.readFileSync('restaurants.sqlite');
// var db = new SQL.Database(restaurants);

// test loaded db
// var res = db.exec("SELECT * FROM dish");
// console.log(res)

/* create new DB */
var db = new SQL.Database()

// a:restaurant name , b:longitude , c:latitude
l_sqlstr = "CREATE TABLE location (r_name char, longitude float, latitude float);"
l_sqlstr += "INSERT INTO location VALUES ('a', 23.5, 24.5);"
l_sqlstr += "INSERT INTO location VALUES ('b', 25.5, 26.5);"
l_sqlstr += "INSERT INTO location VALUES ('c', 25.5, 26.5);"
db.run(l_sqlstr);

// a:restaurant name , b:dish name , c:price 
m_sqlstr = "CREATE TABLE dish (r_name char, d_name char, price int);"
m_sqlstr += "INSERT INTO dish VALUES ('a', 'aa', 120);"
m_sqlstr += "INSERT INTO dish VALUES ('a', 'bb', 140);"
m_sqlstr += "INSERT INTO dish VALUES ('a', 'cc', 130);"
m_sqlstr += "INSERT INTO dish VALUES ('b', 'dd', 80);"
m_sqlstr += "INSERT INTO dish VALUES ('b', 'ee', 85);"
m_sqlstr += "INSERT INTO dish VALUES ('b', 'ff', 75);"
m_sqlstr += "INSERT INTO dish VALUES ('c', 'gg', 90);"
m_sqlstr += "INSERT INTO dish VALUES ('c', 'hh', 40);"
m_sqlstr += "INSERT INTO dish VALUES ('c', 'ii', 150);"
db.run(m_sqlstr);

/* return all retaurant locations from location table */
function getAllLocations() {
    var locations = db.exec("SELECT * FROM location ")
    console.log(locations[0].values)
    return locations[0].values
}

/* return specific retaurant location */
function getLocation(r_name) {
    let location = db.exec("SELECT * FROM location WHERE r_name = \'" + r_name + "\'")
    console.log(location[0].values)
    return location[0].values
}

/* return all retaurant dishes from dish table */
function getAllDishes() {
    var dishes = db.exec("SELECT * FROM dish ")
    console.log(dishes[0].values)
    return dishes[0].values
}

/* return specific retaurant dishes from dish table */
function getDish(r_name) {
    let dishes = db.exec("SELECT * FROM dish WHERE r_name = \'" + r_name + "\'")
    console.log(dishes[0].values)
    return dishes[0].values
}

/* export DB */
// Export the database to an Uint8Array containing the SQLite database file
// var data = db.export();
// var buffer = new Buffer(data);
// fs.writeFileSync("restaurants.sqlite", buffer);


// // Prepare an sql statement
// var stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

// // Bind values to the parameters and fetch the results of the query
// var result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
// console.log(result); // Will print {a:1, b:'world'}

// // Bind other values
// stmt.bind([0, 'hello']);
// while (stmt.step()) console.log(stmt.get()); // Will print [0, 'hello']

// // You can also use javascript functions inside your SQL code
// // Create the js function you need
// function add(a, b) {return a+b;}
// // Specifies the SQL function's name, the number of it's arguments, and the js function to use
// db.create_function("add_js", add);
// // Run a query in which the function is used
// db.run("INSERT INTO hello VALUES (add_js(7, 3), add_js('Hello ', 'world'));"); // Inserts 10 and 'Hello world'

// // free the memory used by the statement
// stmt.free();
// // You can not use your statement anymore once it has been freed.
// // But not freeing your statements causes memory leaks. You don't want that.


