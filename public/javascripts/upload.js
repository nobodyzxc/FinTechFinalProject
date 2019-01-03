'use strict'

$("#progressbarTWInput").change(function(){

  readURL(this);

});

function readURL(input){

  if(input.files && input.files[0]){

    var reader = new FileReader();

    reader.onload = function (e) {

      $("#preview_progressbarTW_img").attr('src', e.target.result);

    }

    reader.readAsDataURL(input.files[0]);

  }

}

function getId(href){
  return href.substring(href.indexOf('#'));
}

function uploadTo(shop){
  var id = getId(shop.href);
  var cur = $(id + '-cur').val();
  var tot = $(id + '-tot').val();
  var per = String(Math.floor(cur / tot * 100));
  $('#upload-shopname').text(shop.textContent);
  $('#uploadInput').attr('class', '');

  $('#peopleSpinner').next('div').remove();

  $('#peopleSpinner').val(cur);
  $('#peopleSpinner').attr('value', cur);
  $('#peopleSpinner').attr('max', tot);

  $('#peopleSpinner').inputSpinner();

  $('#peopleBar').attr('style', `width:${per}%`);
  $('#peopleBar').text(`${per}%`);
}

function updateProgress(input){
  var cur = input.value;
  var tot = input.max;
  var per = String(Math.floor(cur / tot * 100))
  $('#peopleSpinner').attr('value', cur);
  $('#peopleBar').attr('style', `width:${per}%`);
  $('#peopleBar').text(`${per}%`);
}

function uploadPeople(){
  $.get('/uploadPeople', {
    name: $('#upload-shopname').text(),
    value: $('#peopleSpinner').attr('value')
  }, function(result){
    socket.emit('new people',
      `{
        "name": "${$('#upload-shopname').text()}",
        "number": ${$('#peopleSpinner').attr('value')},
        "avail": ${$('#peopleSpinner').attr('max') - $('#peopleSpinner').attr('value')},
        "total": ${$('#peopleSpinner').attr('max')}
       }`);
    alert(JSON.stringify(result));
  });
}
