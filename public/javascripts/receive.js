// var Webtype define in HTML
const Padding = 'padding';
const Accepted = 'accepted';
const Canceled = 'canceled';
const Customer = 'customer';
const Finished = 'finished';
const Restaurant = 'restaurant';
const History = 'history';

var socket = io.connect();

socket.on('renew order', function(data){
  data = JSON.parse(data);
  console.log(data);

  if(Webtype != History){
    if(data.customer != $('#ordername').text()
      && data.restaurant != $('#ordername').text())
      return; // not relate to the order
  }

  let type = $('#ordertype .active').attr('href').substring(1);

  //if(type != data.type) return; // wait to opt

  if($('#ordername').text() == data.customer
    && data.type == Finished) alert("您的訂單已完成");

  if($('#ordername').text() == data.customer
    && data.type == Accepted) alert("您的訂單已被接受");

  if($('#ordername').text() == data.restaurant
    && data.type == Padding) alert("有新訂單");

  if(Webtype != History &&
    data.type == Canceled && data.who != Webtype)
    alert(`您的訂單已被${data.who == Customer ? '顧客' : '餐廳' }取消`);

  if(Webtype == History){
    alert(`訂單異動: ${data.restaurant} ${data.type}`);
  }

  if($('#ordername').text() == data.restaurant
    || $('#ordername').text() == data.customer
    || $('#ordername').text() == '訂單紀錄'){
    console.log(Webtype, $('#ordername').text(), type);
    updateOrder(Webtype, $('#ordername').text(), type);
  }
});

function cancel(id, shop, buyer){
  if (confirm(`確定要捨棄棄單號 #${id} ?`)) {
    var parent = undefined;
    if($('#order-' + String(id)).children().last().hasClass('show')){
      parent = $('#order-' + String(id)).parent()
    }
    $('#order-' + String(id)).remove();
    if(parent && parent.children().first()){
      parent.children().first().children().last().addClass('show');
    }

    $('#order-' + String(id)).remove();
    $.get('/cancel', {
      id: id,
      name: $('#ordername').text(),
      type: Webtype
    }, function(result){
      socket.emit('new order', JSON.stringify({
        restaurant: shop,
        customer: buyer,
        type: Canceled,
        who: Webtype
      }));
      alert(JSON.stringify(result));
    })
  }
}

function accept(id, shop, buyer){
  if (confirm(`確定要接取單號 #${id} ?`)) {
    var parent = undefined;
    if($('#order-' + String(id)).children().last().hasClass('show')){
      parent = $('#order-' + String(id)).parent()
    }
    $('#order-' + String(id)).remove();
    if(parent && parent.children().first()){
      parent.children().first().children().last().addClass('show');
    }

    $.get('/accept', {
      id: id,
      shop: shop,
    }, function(result){
      socket.emit('new order', JSON.stringify({
        restaurant: shop,
        customer: buyer,
        type: Accepted
      }));
      alert(JSON.stringify(result));
    })
  }
}

function finish(id, shop, buyer){
  if (confirm(`確定要完成單號 #${id} ?`)) {
    var parent = undefined;
    if($('#order-' + String(id)).children().last().hasClass('show')){
      parent = $('#order-' + String(id)).parent()
    }
    $('#order-' + String(id)).remove();
    if(parent && parent.children().first()){
      parent.children().first().children().last().addClass('show');
    }

    $.get('/finish', {
      id: id,
      shop: shop
    }, function(result){
      socket.emit('new order', JSON.stringify({
        restaurant: shop,
        customer: buyer,
        type: Finished
      }));
      alert(JSON.stringify(result));
    })
  }
}

function stuffButton(type, order, status){
  var button = '';
  var accept_b = `<div class="btn-group mr-2 float-md-right" role="group" aria-label="accept order">
                  <button onclick="accept(${order.id}, '${order.restaurant}', '${order.customer}');" type="button" class="btn btn-primary float-md-right">accept</button>
                </div>`
  var finish_b = `<div class="btn-group mr-2 float-md-right" role="group" aria-label="finish order">
                  <button onclick="finish(${order.id}, '${order.restaurant}', '${order.customer}');" type="button" class="btn btn-primary float-md-right">Finish</button>
                </div>`
  var cancel_b = `<div class="btn-group mr-2 float-md-right" role="group" aria-label="cancel order">
                  <button onclick="cancel(${order.id}, '${order.restaurant}', '${order.customer}');" type="button" class="btn btn-primary float-md-right">Cancel</button>
                </div>`

  //status == "padding" ?

  if(type == Customer){
    if(status == Padding) button += cancel_b;
  }
  if(type == Restaurant){
    if(status == Padding) button += accept_b + cancel_b;
    if(status == Accepted) button += finish_b + cancel_b;
  }
  if(button){
    button = `<div class="col float-md-right">
                <div class="btn-toolbar float-md-right" role="toolbar" aria-label="Toolbar with button groups">
                  ${button}
                </div>
              </div>`
  }
  return button;
}

function updateOrder(type, name, status){
  $.get('/order', {
    type: type,
    name: name,
    status: status
  }, function(orders){
    console.log(orders);
    //alert("return");
    $(`#${status}-accordion`).empty();
    for(var i= 0; i < orders.length; i++){
      var tab = ''
      for(var j = 0; j < orders[i].dish.length; j++){
        tab += `<tr>
                  <td>${orders[i].dish[j].id}</td>
                  <td>${orders[i].dish[j].name}</td>
                  <td>${orders[i].dish[j].number}</td>
                </tr>`
      }
      $(`#${status}-accordion`).append(`
<div id="order-${orders[i].id}" class="card">
  <div class="card-header">
    <div class="row">
      <div class="col">
        <a class="card-link" data-toggle="collapse" href="#collapse-${orders[i].id}">
          <h4>${orders[i].restaurant} Order#${orders[i].id}<h4>
        </a>
      </div>
      ${ stuffButton(type, orders[i], status) }
    </div>
  </div>
  <div id="collapse-${orders[i].id}" class="collapse ${i == 0 ? 'show' : ''}" data-parent="#${status}-accordion">
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>number</th>
          </tr>
        </thead>
        <tbody>
          ${tab}
        </tbody>
      </table>
      <div class="row">
        <div class="col float-left">
          <p>總金額: ${orders[i].price}元<p>
        </div>
        <div class="col float-right">
          ${Webtype == Restaurant ? `<p>由 ${orders[i].customer} 下單` : ``}
        </div>
      </div>
    </div>
  </div>
</div>`);
    }
  });
}
