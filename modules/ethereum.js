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
          console.log("下單成功");
          callback(true);
        })
        .on("error", function(error) {
          console.log("下單失敗");
          callback(false);
        });
  });

}

module.exports.cancelOrder = function(id, shop, callback) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .cancel(id)
        .send({
          from : accounts[getShopIndex(shop)],
          gas: 3400000,
        })
        .on("receipt", function(receipt) {
          console.log("棄單成功");
        })
        .on("error", function(error) {
          console.log("棄單失敗");
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
          console.log("接單成功");
          callback(true);
        })
        .on("error", function(error) {
          console.log("接單失敗");
          callback(false);
        });
  });
}

module.exports.getAllBuyerAddrs = function(cbf) {
  web3.eth.getAccounts().then(function(accounts) {
    addrs = accounts.slice(
              database.getAllRestaurants().length + 1);
    cbf(addrs);
  });
}
