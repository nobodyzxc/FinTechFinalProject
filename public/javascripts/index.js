'use strict'

$(document).ready(function() {
  $.get('/shops', function (shops) {
    for (let shop of shops) {
      $('#shops').append(`<a class="dropdown-item" href="#" onclick='menuOf("${shop}")'>${shop}</a>`)
      $('#upload-shops').append(`<a class="dropdown-item" href="#" onclick='uploadTo("${shop}")'>${shop}</a>`)
    }
  })
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
