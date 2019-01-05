var socket = io.connect();

socket.on('renew order', function(data){
  if($('#shopname').text() == data){
    updateOrder($('#shopname').text(), 'padding');
  }
});

function drop(id){
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
    $.get('/drop', {
      id: id,
      shop: $('#shopname').text()
    }, function(result){
      alert(JSON.stringify(result));
    })
  }
}

function finish(id){
  if (confirm(`確定要接取單號 #${id} ?`)) {
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
      shop: $('#shopname').text()
    }, function(result){
      alert(JSON.stringify(result));
    })
  }
}

function updateOrder(r_name, status){
  $.get('/order', {
    shop: r_name,
    status: status
  }, function(orders){
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
          <h4>Order #${orders[i].id}<h4>
        </a>
      </div>
      ${ status == "padding" ?
          `<div class="col float-md-right">

        <div class="btn-toolbar float-md-right" role="toolbar" aria-label="Toolbar with button groups">
          <div class="btn-group mr-2 float-md-right" role="group" aria-label="First group">
            <button onclick="finish(${orders[i].id});" type="button" class="btn btn-primary float-md-right">Finish</button>
          </div>
          <div class="btn-group mr-2 float-md-right" role="group" aria-label="Second group">
            <button onclick="drop(${orders[i].id});" type="button" class="btn btn-primary float-md-right">Cancel</button>
          </div>
        </div>
      </div>` : ""
      }
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
      <p>總金額: ${orders[i].price}元<p>
    </div>
  </div>
</div>`);
    }
  });
}
