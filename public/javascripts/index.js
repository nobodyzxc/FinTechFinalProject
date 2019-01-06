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
  var newRow = [data.name, String(Math.floor(data.number / data.total * 100)) + '%', String(data.avail), String(data.number)];
  rankTable.row($(`td:contains("${data.name}")`)[0].parentElement).data(newRow).draw();

  updateCircles();
});

//function sortOnKeys(dict) {
//
//    var sorted = [];
//    for(var key in dict) {
//        sorted[sorted.length] = key;
//    }
//    sorted.sort();
//
//    var tempDict = {};
//    for(var i = 0; i < sorted.length; i++) {
//        tempDict[sorted[i]] = dict[sorted[i]];
//    }
//
//    return tempDict;
//}
//
//dict = sortOnKeys(dict);
