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
        data[$cells[0].innerText.trim()] = parseInt($(this).html());
      }
    });
  });
  return data;
}
