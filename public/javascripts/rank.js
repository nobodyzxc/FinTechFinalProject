$(document).ready(function() {
  updatePeopleRank();
  $('#example').DataTable();
} );

function updatePeopleRank(){
  $.get('/people', async function (res) {
    $('#people').empty();
    for (let r of res) {
      $('#people').append(`<tr><td>${r.name}</td><td>${r.number}</td><td>${r.avail}</td><td>${Math.floor(r.number / (r.avail + r.number) * 100)}%</td></tr>`)
    }
    $('#rankTable').DataTable();
  });
}
