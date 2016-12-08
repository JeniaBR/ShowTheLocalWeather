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
                $('#city-region').text(city + ', ' + region);
                $('#country').text(data.name);
            }
        });
    }

    function getWeather(url) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            success: weatherParse
        });

        function weatherParse(data) {
            var temp = toCel(data.currently.temperature);
            var condition = data.currently.icon.split('-').join(' ');
            var icon = data.currently.icon;
            var minTemp = toCel(data.daily.data[0].temperatureMin);
            var maxTemp = toCel(data.daily.data[0].temperatureMax);

            $('#forecast-main').text(temp + '\xB0');
            setWeatherIcon(icon, "icon-temp");
            $('#condition-temp').text(condition.toUpperCase());
            $('#high-temp').text(maxTemp + '\xB0');
            $('#low-temp').text(minTemp + '\xB0');

            for (var i = 1; i < 2; i++) {
                var day = moment.unix(data.daily.data[i].time).format('dddd');
                var dayCond = data.daily.data[i].icon.split('-').join(' ');
                var dayIcon = data.daily.data[i].icon;
                var dayMinTemp = toCel(data.daily.data[i].temperatureMin);
                var dayMaxTemp = toCel(data.daily.data[i].temperatureMax);
            }

        }
    }
}

function setWeatherIcon(icon, id) {
    var skycons = new Skycons({
        "color": "pink"
    });
    skycons.add(id, icon);
    skycons.play();
}

function toCel(f) {
    return Math.round((f - 32) * 5 / 9);
}

$(document).ready(function () {
    getUserLocation();
});