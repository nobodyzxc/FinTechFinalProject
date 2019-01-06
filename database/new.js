var sql = require('sql.js')
var fs = require("fs")

/* create new DB */
var db = new SQL.Database()

function createNewDatabase(){

  l_sqlstr = `CREATE TABLE orders (
                id INTEGER PRIMARY KEY,
                r_name char,
                c_name char,
                price int,
                status char
              );`

  //l_sqlstr += "INSERT INTO orders VALUES (0, '樂山食堂', 260, 'padding');"
  //l_sqlstr += "INSERT INTO orders VALUES (1, '樂山食堂', 240, 'padding');"

  db.run(l_sqlstr);

  l_sqlstr = `CREATE TABLE order_dish (
                id INTEGER PRIMARY KEY,
                order_id int,
                dish_id int,
                amount int
              );`
  //l_sqlstr += "INSERT INTO order_dish(order_id, dish_id, amount) VALUES (0, 2, 2);"
  //l_sqlstr += "INSERT INTO order_dish(order_id, dish_id, amount) VALUES (1, 1, 2);"
  db.run(l_sqlstr);

  l_sqlstr = "CREATE TABLE heat (r_name char, people int, total int);"
  l_sqlstr += "INSERT INTO heat VALUES ('樂山食堂', 25, 60);"
  l_sqlstr += "INSERT INTO heat VALUES ('四五大街', 55, 80);"
  l_sqlstr += "INSERT INTO heat VALUES ('湯饌', 33, 40);"
  l_sqlstr += "INSERT INTO heat VALUES ('永康街左撇子', 25, 40);"
  l_sqlstr += "INSERT INTO heat VALUES ('金鮨日式料理', 15, 30);"
  db.run(l_sqlstr);

  // a:restaurant name , b:longitude , c:latitude
  l_sqlstr = "CREATE TABLE location (r_name char, longitude float, latitude float);"
  l_sqlstr += "INSERT INTO location VALUES ('樂山食堂', 24.988998, 121.573640);"
  l_sqlstr += "INSERT INTO location VALUES ('四五大街', 24.988303, 121.574231);"
  l_sqlstr += "INSERT INTO location VALUES ('湯饌', 24.9876791,121.5751377);"
  l_sqlstr += "INSERT INTO location VALUES ('永康街左撇子', 24.9878874, 121.5766012);"
  l_sqlstr += "INSERT INTO location VALUES ('金鮨日式料理', 24.987119, 121.578585);"

  db.run(l_sqlstr);

  // a:restaurant name , b:dish name , c:price
  m_sqlstr = `CREATE TABLE dish (
                id INTEGER PRIMARY KEY,
                r_name char,
                d_name char,
                price int
              );`
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('樂山食堂', '咖哩豬排', 120);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('樂山食堂', '照燒牛小排', 140);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('樂山食堂', '照燒雞肉', 130);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('四五大街', '叉燒煎蛋飯', 80);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('四五大街', '奶油雞排飯', 85);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('四五大街', '滑蛋雞絲飯', 75);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('永康街左撇子', '牛肉燴飯', 80);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('永康街左撇子', '蝦仁炒飯', 80);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('永康街左撇子', '宮保雞丁飯', 100);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('湯饌', '滑蛋唐揚雞丼飯', 110);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('湯饌', '黑鐵炙燒豚', 95);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('湯饌', '海鮮鍋', 120);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('金鮨日式料理', '親子丼', 90);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('金鮨日式料理', '鮮蝦手捲', 40);"
  m_sqlstr += "INSERT INTO dish(r_name, d_name, price) VALUES ('金鮨日式料理', '政妹蓋飯', 150);"
  db.run(m_sqlstr);
}

createNewDatabase();

/*
 * 將資料庫匯出
 * Export the database to an Uint8Array containing the SQLite database file
 */
var data = db.export();
var buffer = new Buffer.from(data);
fs.writeFileSync("restaurants.sqlite", buffer);
