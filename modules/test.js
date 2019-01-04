const fs = require('fs')
const Web3 = require('web3')
let web3 = new Web3('http://localhost:8545')

//const abi = JSON.parse(
//  fs.readFileSync('contract/Restaurant.abi').toString())
//const bytecode = '0x' + fs.readFileSync('contract/Restaurant.bin').toString()

const abi = JSON.parse(fs.readFileSync('./contract/Bank.abi').toString())
const bytecode = '0x' + fs.readFileSync('./contract/Bank.bin').toString()

let order = new web3.eth.Contract(abi);

//console.log(bytecode);
//process.exit(0);

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

