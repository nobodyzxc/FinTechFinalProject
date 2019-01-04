const fs = require('fs')
const Web3 = require('web3')
let web3 = new Web3('http://localhost:8545')

const abi = JSON.parse(
  fs.readFileSync('contract/Restaurant.abi').toString())
const bytecode = '0x' +
  fs.readFileSync('contract/Restaurant.bin').toString()

var order = undefined;

const database = require('./database');

function getShopIndex(shop){
  return database.getAllRestaurants().indexOf(shop) + 1;
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
        // console.log(JSON.stringify(receipt, null, 4));
        order = new web3.eth.Contract(
                      abi,
                      receipt["contractAddress"])
      })
      .on("error", function(error) {
        console.log("deploy failed");
      });
  });
}

module.exports.placeOrder = function(id, shop, buyer, price) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .place(id, getShopIndex(shop))
        .send({
          from : buyer,
          gas: 3400000,
        })
        .on("receipt", function(receipt) {
          console.log(JSON.stringify(receipt, null, 4));
          console.log("下單成功");
        })
        .on("error", function(error) {
          console.log(JSON.stringify(error, null, 4));
          console.log("下單失敗");
        });
  });
}

module.exports.cancelOrder = function(id, shop) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .cancel(id)
        .send({
          from : getShopIndex(shop),
          gas: 3400000,
        })
        .on("receipt", function(receipt) {
          console.log(JSON.stringify(receipt, null, 4));
          console.log("棄單成功");
        })
        .on("error", function(error) {
          console.log(JSON.stringify(error, null, 4));
          console.log("棄單失敗");
        });
  });
}

module.exports.finishOrder = function(id, shop) {
  web3.eth.getAccounts().then(function(accounts) {
    order.methods
      .finish(id)
        .send({
          from : getShopIndex(shop),
          gas: 3400000,
        })
        .on("receipt", function(receipt) {
          console.log(JSON.stringify(receipt, null, 4));
          console.log("接單成功");
        })
        .on("error", function(error) {
          console.log(JSON.stringify(error, null, 4));
          console.log("接單失敗");
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

module.exports.deploy();
