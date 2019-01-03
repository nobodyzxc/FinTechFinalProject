socket.on('renew people', function(data){
  //if($('#shopname').text() == data){
  //  updateOrder($('#shopname').text(), 'padding');
  //}
  //rankTable
  //      .row( this )
  //      .data( d )
  //      .draw();
  data = JSON.parse(data);
  newRow = [data.name, String(data.number), String(data.avail), String(Math.floor(data.number / data.total * 100)) + '%'];
  rankTable.row($(`td:contains("${data.name}")`)[0].parentElement).data(newRow).draw();
});

$('#people').on( 'hover', 'tr', function () {
    alert( table.row( this ).data() );
} );

//function updatePeopleRank(){
//  $.get('/people', async function (res) {
//    $('#people').empty();
//    for (let r of res) {
//      $('#people').append(`<tr><td>${r.name}</td><td>${r.number}</td><td>${r.avail}</td><td>${Math.floor(r.number / (r.avail + r.number) * 100)}%</td></tr>`);
//    }
//    $('#rankTable').DataTable();
//  });
//}
