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

            drawCurrentWeather(temp, condition, icon, minTemp, maxTemp);

            for (var i = 1; i < 6; i++) {
                var day = moment.unix(data.daily.data[i].time).format('dddd');
                var dayCond = data.daily.data[i].icon.split('-').join(' ');
                var dayIcon = data.daily.data[i].icon;
                var dayMinTemp = toCel(data.daily.data[i].temperatureMin);
                var dayMaxTemp = toCel(data.daily.data[i].temperatureMax);
                drawFutureWeather(day, dayCond, dayIcon, dayMinTemp, dayMaxTemp, daysArr[i]);
                if (i < 5) {
                    $('#forecast-five-days').append('<hr>');
                }

            }
        }
    }
}

function drawCurrentWeather(temperature, condition, icon, minTemp, maxTemp) {
    $('#forecast-main').text(temperature + '\xB0');
    setWeatherIcon(icon, "icon-temp");
    $('#condition-temp').text(condition.toUpperCase());
    $('#high-temp').text(maxTemp + '\xB0');
    $('#low-temp').text(minTemp + '\xB0');
}

function drawFutureWeather(day, dayCondition, dayIcon, dayMinTemp, dayMaxTemp, idx) {
    var list = '<div class="col-xs-3"><div class="list-day">' + day.toUpperCase() + ' ' + '</div></div>';
    list += '<div class="col-xs-3"><div class="list-icon"><canvas width="64" height="64" id="' + idx + '"></canvas></div></div>';
    list += '<div class="col-xs-3"><div class="list-condition">' + dayCondition.toUpperCase() + '</div></div>';
    list += '<div class="col-xs-3" id="list-temp"><span class="list-minTemp"><i class="fa fa-arrow-up" aria-hidden="true"></i>' + dayMaxTemp + '\xB0' + '</span>';
    list += '<span class="list-maxTemp"><i class="fa fa-arrow-down" aria-hidden="true"></i>' + dayMinTemp + '\xB0' + '</span></div>';


    $('#forecast-five-days').append('<li><div class="row">' + list + '</li></div>');
    setWeatherIcon(dayIcon, idx);
}

function setWeatherIcon(icon, id) {
    var skycons = new Skycons({
        "color": "black"
    });
    skycons.add(id, icon);
    skycons.play();
}

function toCel(f) {
    return Math.round((f - 32) * 5 / 9);
}

var daysArr = ['dummy', 'first', 'second', 'third', 'fourth', 'fifth'];

$(document).ready(function () {
    getUserLocation();
});