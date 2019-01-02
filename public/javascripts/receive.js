$(document).ready(function() {
  $.get('/shops', function (shops) {
    for (let shop of shops) {
      $('#shops').append(`<a class="dropdown-item" href="/users/${shop}" >${shop}</a>`)
    }
  })
});
