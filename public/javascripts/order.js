'use strict'

function menuOf(shop){
  $('#shopname').text(shop);
  $.get('/menuOf',{
    shop: shop
  }, function (menu) {
    $('#menu').empty();
    $('#cart').empty();
    calculatePrice();
    for (let dish of menu) {
      $('#menu').append(`<tr><td>${dish.name}</td><td>${dish.value}</td><td><button type="button" class="btn btn-primary" onclick='addDish(${JSON.stringify(dish)});'>+</button></td></tr>`)
    }
  });
}

function delDish(del_button){
  $(del_button).parent().parent().remove();
  calculatePrice();
}

function totalPrice(){
  var total = 0;
  var arr = [...document.getElementsByClassName('form-item')];
  for(let i = 0; i < arr.length; i++){
    total += arr[i].nextSibling.value * arr[i].nextSibling.nextSibling.value;
  }
  return total;
}

function calculatePrice(){
  var total = totalPrice();
  $('#totalVal').text('總金額: ' + String(total) + ' 元');
}

function submitMenu(){


  var arr = [...document.getElementsByClassName('form-item')];

  var form = {
    shop: $('#shopname').text(),
    dish: arr.map(function(elt){
      return { id: elt.value, amount: elt.nextSibling.value };
    }),
    price: totalPrice()
  };

  //for(let i = 0; i < arr.length; i++){
  //  form.dish.push({
  //    id: arr[i].value,                   // dish id
  //    amount: arr[i].nextSibling.value,   // dish amount
  //  });
  //  //arr[i].nextSibling.nextSibling.value;  // dish price
  //}

  //alert("form submited\n" + JSON.stringify(form));
  //
  $.post('/post_order', {order: JSON.stringify(form)}, function(result) {
    socket.emit('new order', $('#shopname').text());
    alert(JSON.stringify(result));
    $('#cart').empty();
    calculatePrice();
  });
}

function addDish(dish){

  if($('.cart-item') && [...document.getElementsByClassName('cart-item')].map(elt=>elt.textContent).indexOf(dish.name) >= 0){
    return;
  }
  $('#cart').append(`<tr><td class='cart-item'>${dish.name}</td><td><input class='form-item' type="hidden" value="${dish.id}"><input type="number" value="${$('#defaultVal').val()}" min="1" step="1" onchange='calculatePrice();'/><input type="hidden" value="${dish.value}"></td><td><button type="button" class="btn btn-primary" onclick='delDish(this);'>X</button></td></tr>`)
  calculatePrice();
}

