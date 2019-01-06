'use strict'

var socket = io.connect();
var map;
var circles = {};
var markers = {};
var shopmap = undefined;
var rankTable = undefined;

var circleColor = {
  '客滿程度': '#FF0000',
  '空位數': '#6bf442',
  '顧客人數': '#f4a142'
}

$(document).ready(function() {
  $("input[type='number']").inputSpinner();
  rankTable = $('#rankTable').DataTable({
    "order": [[ 1, "desc" ]]
  });
});

socket.on('renew people', function(data){
  data = JSON.parse(data);
  var shop = `<i onclick="gotoMap('${data.name}')" class="fas fa-map-marker-alt"></i>　<a class="gotoLink text-center" onclick='gotoOrder("${data.name}")'>${data.name}</a>`
  var newRow = [shop, String(Math.floor(data.number / data.total * 100)) + '%', String(data.avail), String(data.number)];
  rankTable.row($(`td:contains("${data.name}")`)[0].parentElement).data(newRow).draw();

  updateCircles();
});
