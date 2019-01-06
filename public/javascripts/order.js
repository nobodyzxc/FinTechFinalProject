'use strict'

function emptyCart(){
  $('#cart').empty();
  $('#cart').append(`
    <tr>
      <td id='totalVal' class="text-center">
        總計：0
      </td>
      <td colspan="2" align="center" >
        <button onclick="checkBill();" type="button" class="btn btn-primary">送出</button>
      </td>
    </tr>`);
}

function menuOf(shop){
  $('#shopname').text(shop);
  $.get('/menuOf',{
    shop: shop
  }, function (menu) {
    $('#menu').empty();
    emptyCart();
    calculatePrice();
    for (let dish of menu) {
      $('#menu').append(`
        <tr>
          <td>${dish.name}</td>
          <td>${dish.value}</td>
          <td>
            <button type="button" class="btn btn-primary" onclick='addDish(${JSON.stringify(dish)});'>+</button>
          </td>
        </tr>`)
    }
  });
}

function delDish(del_button){
  $(del_button).parent().parent().remove();
  calculatePrice();
}

function totalDishes(){
  return [...document.getElementsByClassName('form-item')].map(function(e){
    return {
      name:   e.parentElement.previousElementSibling.textContent,
      amount: e.nextElementSibling.value,
      price:  e.nextElementSibling.nextElementSibling.value
    };
  });
}

function totalPrice(){
  return totalDishes().reduce((acc, d) => acc + d.amount * d.price, 0);
}

function checkBill(){
  if(totalPrice() <= 0){
    alert("下單金額不足");
  }
  else{
    $('#bill').empty();
    for(var d of totalDishes()){
      $('#bill').append(`
        <tr>
          <td class="text-center">${d.name}</td>
          <td class="text-center">${d.price}</td>
          <td class="text-center">${d.amount}</td>
        </tr>
      `);
    }
    $('#bill').append(`
      <tr>
        <td colspan="4" align="right">總金額: ${totalPrice()}</td>
      </tr>
    `);
    $('#myModal').modal('show');
  }
}

function calculatePrice(){
  var total = totalPrice();
  $('#totalVal').text('總計: ' + String(total));
}

function submitMenu(){

  var arr = [...document.getElementsByClassName('form-item')];

  var e = document.getElementById("accounts");
  var buyer = e.options[e.selectedIndex].text;

  var form = {
    shop: $('#shopname').text(),
    buyer: buyer,
    dish: arr.map(function(elt){
      return { id: elt.value, amount: elt.nextElementSibling.value };
    }),
    price: totalPrice()
  };

  $.post('/post_order', {order: JSON.stringify(form)}, function(result) {
    socket.emit('new order', JSON.stringify({
      restaurant: $('#shopname').text(),
      customer: buyer,
      type: 'padding'
    }));
    alert(JSON.stringify(result));
    emptyCart();
    calculatePrice();
  });
}

function addDish(dish){

  if($('.cart-item') && [...document.getElementsByClassName('cart-item')].map(elt=>elt.textContent).indexOf(dish.name) >= 0){
    return;
  }
  $('#cart').prepend(`
    <tr>
      <td class='cart-item'>${dish.name}</td>
      <td>
        <input class='form-item' type="hidden" value="${dish.id}">
        <input class="text-center" type="number" value="${$('#defaultVal').val()}" min="1" step="1" onchange='calculatePrice();'/>
        <input type="hidden" value="${dish.value}">
      </td>
      <td>
        <button type="button" class="btn btn-primary" onclick='delDish(this);'>×</button>
      </td>
    </tr>`)
  calculatePrice();
}

function gotoOrder(shop){
  if(confirm(`前往 ${ shop } 下單?`)){
    $('#order-food').click();
    menuOf(shop);
  }
}
