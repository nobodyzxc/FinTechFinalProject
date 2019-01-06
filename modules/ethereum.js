const fs = require('fs');
const Web3 = require('web3');
let web3 = new Web3('http://localhost:8545');

const abi = JSON.parse(
  fs.readFileSync('contract/Restaurant.abi').toString());
const bytecode = '0x' +
  fs.readFileSync('contract/Restaurant.bin').toString().trim();

var order = undefined;

const database = require('./database');

function getShopIndex(shop){
  return database.getAllRestaurants().indexOf(shop) + 1;
}

module.exports.getAccounts = function(shops, callback){
  try{
    web3.eth.getAccounts().then(function (addrs) {
      var accounts = {};
      let profiles = addrs.map(function(addr){
          return {
            addr: addr,
            name: addr
          };
      });
      for(let i = 0; i < shops.length; i++){
        profiles[i].name = shops[i];
      }
      for(let i = 0; i < profiles.length; i++){
        accounts[profiles[i].addr] = profiles[i];
      }
      return callback(accounts);
    });
  }
  catch(err){
    console.log(err);
  }
}

module.exports.getUserAccounts = function(callback){
  web3.eth.getAccounts().then(function (accounts) {
    callback(accounts.slice(database.getAllRestaurants().length + 1));
  });
}

module.exports.deploy = function() {
  order = new web3.eth.Contract(abi);
  web3.eth.getAccounts().then(function (accounts) {
    order
      .deploy({
        data: bytecode
      })
      .send({
        from: accounts[0],
        gas: 3400000
      })
      .on("receipt", function(receipt) {
        console.log("contract deployed @" +
          receipt["contractAddress"]);
        order = new web3.eth.Contract(
          abi,
          receipt["contractAddress"])
      })
      .on("error", function(error) {
        console.log("deploy failed");
      });
  });
}

module.exports.placeOrder = function(id, shop, buyer,
  price, callback) {
  console.log(typeof(price));
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .place(id, accounts[getShopIndex(shop)])
      .send({
        from : buyer,
        gas: 3400000,
        value: web3.utils.toWei(String(price), "ether")
      })
      .on("receipt", function(receipt) {
        console.log("智能合約下單成功");
        callback(true);
      })
      .on("error", function(error) {
        console.log("智能合約下單失敗");
        console.log(error);
        callback(false);
      });
  });

}

module.exports.cancelOrderByCust = function(id, addr, callback) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .cancel(id)
      .send({
        from : addr,
        gas: 3400000,
      })
      .on("receipt", function(receipt) {
        console.log("智能合約客戶棄單成功");
        callback(true);
      })
      .on("error", function(error) {
        console.log("智能合約客戶棄單失敗");
        console.log(error);
        callback(false);
      });
  });
}

module.exports.cancelOrderByRest = function(id, shop, callback) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .cancel(id)
      .send({
        from : accounts[getShopIndex(shop)],
        gas: 3400000,
      })
      .on("receipt", function(receipt) {
        console.log("智能合約餐廳棄單成功");
        callback(true);
      })
      .on("error", function(error) {
        console.log("智能合約餐廳棄單失敗");
        console.log(error);
        callback(false);
      });
  });
}

module.exports.acceptOrder = function(id, shop, callback) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .accept(id)
      .send({
        from : accounts[getShopIndex(shop)],
        gas: 3400000,
      })
      .on("receipt", function(receipt) {
        console.log("智能合約接單成功");
        callback(true);
      })
      .on("error", function(error) {
        console.log("智能合約接單失敗");
        console.log(error);
        callback(false);
      });
  });
}

module.exports.finishOrder = function(id, shop, callback) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .finish(id)
      .send({
        from : accounts[getShopIndex(shop)],
        gas: 3400000,
      })
      .on("receipt", function(receipt) {
        console.log("智能合約結單成功");
        callback(true);
      })
      .on("error", function(error) {
        console.log("智能合約結單失敗");
        console.log(error);
        callback(false);
      });
  });
}

module.exports.getAllBuyerAddrs = function(callback) {
  web3.eth.getAccounts().then(function(accounts) {
    addrs = accounts.slice(
      database.getAllRestaurants().length + 1);
    callback(addrs);
  });
}

module.exports.getAllEvents = function(callback) {
  order.getPastEvents("allEvents", {
    fromBlock: 0
  }, function(...e){ callback(e[1]); })
}
