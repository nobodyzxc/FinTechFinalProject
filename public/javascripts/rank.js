'use strict'

function getShopDataOf(type){

  var data = {};
  var myRows = [];
  var $headers = $("#rankTable th");
  var $rows = $('#rankTable tbody tr').each(function(index) {
    var $cells = $(this).find("td");
    myRows[index] = {};
    $cells.each(function(cellIndex) {
      if(cellIndex > 0 && $($headers[cellIndex]).html() == type){
        //data[$cells.html()][$($headers[cellIndex]).html()] = $(this).html();
        data[$cells.html()] = parseInt($(this).html());
      }
      //else{
      //  data[$cells.html()] = {};
      //}
    });
  });
  return data;
}

//function updatePeopleRank(){
//  $.get('/people', async function (res) {
//    $('#people').empty();
//    for (let r of res) {
//      $('#people').append(`<tr><td>${r.name}</td><td>${r.number}</td><td>${r.avail}</td><td>${Math.floor(r.number / (r.avail + r.number) * 100)}%</td></tr>`);
//    }
//    $('#rankTable').DataTable();
//  });
//}
