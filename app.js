function getUserLocation() {
    $.ajax({
        type: 'GET',
        url: 'https://ipinfo.io/json/',
        success: function (data) {
            var coordinates = data.loc.split(',');
            var lat = parseFloat(coordinates[0]);
            var lon = parseFloat(coordinates[1]);
            var city = data.city;
            var region = data.region;
            var countryCode = data.country;

            var apiCall = 'https://api.darksky.net/forecast/0b7e48f992ae427d33c6fe5064c73919/' + lat + ',' + lon;

            displayLocation(city, region, countryCode);
            getWeather(apiCall);
        }
    });

    function displayLocation(city, region, country) {
        $.ajax({
            type: 'GET',
            url: 'https://restcountries.eu/rest/v1/alpha/' + country,
            success: function (data) {
                $('#test').text(city + ', ' + region + ' ' + data.name);
            }
        });
    }

    function getWeather(url){
        $.ajax({
            type:'GET',
            url: url,
            dataType: 'jsonp',
            success: weatherParse
        });

        function weatherParse(data){
            var temp = Math.round(data.currently.temperature);
        }
    }
}


$(document).ready(function () {
    getUserLocation();
});