'use strict'

$(document).ready(function() {
  $.get('/shops', function (shops) {
    for (let shop of shops) {
      $('#shops').append(`<a class="dropdown-item" href="#" onclick='menuOf("${shop}")'>${shop}</a>`)
    }
  })
});

function menuOf(shop){
  $.get('/menuOf',{
    shop: shop
  }, function (menu) {
    $('#menu').empty();
    for (let dish of menu) {
      $('#menu').append(`<tr><td>${dish.name}</td><td>${dish.value}</td><td><button type="button" class="btn btn-primary" onclick='addDish(${JSON.stringify(dish)});'>+</button></td><tr>`)
    }
  });
}

function addDish(dish){
  let config = {
    decrementButton: "<strong>-</strong>", // button text
    incrementButton: "<strong>+</strong>", // ..
    groupClass: "", // css class of the input-group (sizing with input-group-sm or input-group-lg)
    buttonsClass: "btn-outline-secondary",
    buttonsWidth: "4px",
    textAlign: "center",
    autoDelay: 500, // ms holding before auto value change
    autoInterval: 100, // speed of auto value change
    boostThreshold: 10, // boost after these steps
    boostMultiplier: "auto", // you can also set a constant number as multiplier
    locale: null // the locale for number rendering; if null, the browsers language is used
  }
  let dishes = $('.dishes')
  if(dishes){
    alert(dishes.map(elt => elt.children().first().val()))
  }
  $('#cart').append(`<tr><td>${dish.name}</td><td><input type="number" value="1" min="1" step="1"/></td><td><button type="button" class="btn btn-primary">X</button></td></tr>`)
  $("input[type='number']").inputSpinner(config);
}

