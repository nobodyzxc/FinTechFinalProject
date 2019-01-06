'use strict'

let web3 = new Web3(
  new Web3.providers.WebsocketProvider("ws://localhost:8545")
);

var socket = io.connect();

var Accounts = undefined;

socket.on('renew order', function(data){
  update();
});

$(document).ready(function(){
  update();
});

function update(){
  updateAccounts(updateEvents);
}

function shorterAddr(addr){
  return `<span title="${addr}">${addr.substring(0, 10)}</span>`;
}

function toEther(price){
  price = String(price);
  return '&nbsp;&nbsp;'.repeat(23 - price.length) +  price.substring(0, price.length - 18) + '.' + price.substring(price.length - 18, price.length - 13);
}

function updateAccounts(callback){
  $('#accounts').empty();
  $.get('/accounts', async function(accounts){

    for(let addr in  accounts){
      let bal = await web3.eth.getBalance(addr);
      let balance = await toEther(bal);

      $('#accounts').append(`
          <tr>
            <td>${shorterAddr(accounts[addr].addr)}</td>
            <td>${balance}</td>
            <td>${shorterAddr(accounts[addr].name)}</td>
          </tr>
        `);
    }
    Accounts = accounts;
    callback();
  });
}

function updateEvents(){
  $('#events').empty();
  $.get('/events', async function(events){
    for(let event of events){
      let tx = await web3.eth.getTransaction(event.transactionHash);
      let from = await tx.from;
      let sender = await Accounts[from].name;
      let price = await toEther(event.returnValues.price);
      $('#events').append(`
          <tr>
            <td>${event.event}</td>
            <td>${event.returnValues.id}</td>
            <td>${price}</td>
            <td>${shorterAddr(event.returnValues.buyer)}</td>
            <td>${Accounts[event.returnValues.shop].name}</td>
            <td>${shorterAddr(sender)}</td>
          </tr>
        `);
    }
  });
}
