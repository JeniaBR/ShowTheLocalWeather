function getUserLocation(){
    $.ajax({
    type: 'GET',
    url: 'https://ipinfo.io/json/',
    success: function(data){
        $('#test').text(data.city + ' ' + data.country);
        return data;
    }
  });
}

$(document).ready(function(){
    var data = getUserLocation();
});