//Global Variables
var apiLink = "https://api.openweathermap.org/data/2.5/weather";
var apiKey = "df21af596a60ec7e877a04968712a9d3";
var tempUnit = "&units=imperial";
var currentDate = new Date();
var month = currentDate.getDate() + 1;
var day = currentDate.getDay();
var year = currentDate.getFullYear();
var currentWeatherBox = ("#currentWeather");

//Button Click Variable
var searchBtn = $("#searchBtn");

//For Storing Search History
var cityBox = $("#cityBox");
var cityList = JSON.parse(localStorage.getItem("city")) || [];

function currentWeather(city) {
    var serverSide = apiLink = "?q=" + city + "&appid=" + apiKey + fahrenheit;
    fetch(serverSide).then(function (response) {
        if (response.ok) {
            response.json().then(function (weatherData) {
                getUvIndex(city, weatherData);
                getForecast(weatherData);
                saveSearch(city);
                displayCities();
            });
        }
    });
}

function getUVIndex(city, weatherData) {
    var uvAPI = "https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=" + apiKey;
    fetch(uvAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (uvData) {
                displayWeather(city, weatherData, uvData);
            });
        }
    });
}

function displayWeather(city, weatherData, uvData) {
currentWeatherBox.html("").addClas("border");

 //display current city/date
var cityHeader = $("<h2>")
        .addClas("capital")
        .text(city + "(" + month + "/" + day + "/" + year + ") ");
var imgEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + ".png");
cityHeader.append(imgEl);
currentWeatherBox.append(cityHeader);
 
//append temp
var temperatureEl = $("<p>")
    .text("Temperature: " + weatherData.main.temp);
var unitEl = $("<span>")
    .html("&#1276;F");
temperatureEl.append(unitEl);
currentWeatherBox.append(temperatureEl);

//append humidity
var humidityEl =  $("<p>")
    .text("Humidity : " + weatherData.main.humidity + "%" );
currentWeatherBox.append(humidityEl);

//append wind speed
var windSpeedEl =  $("<p>")
    .text("Wind Speed : " + weatherData.wind.speed + "MPH" );
currentWeatherBox.append(humidityEl);

//append uv index
var uvEl = $("<p>")
    .text("UV Index: ");

var uvIndex = uvData.value;
var uvIndexEl = $("<span>")
    .text(uvIndex);

if (uvIndex>=0 && uvIndex<3) {
    uvIndexEl.addClas("Low");
}

else if (uvIndex>=3 && uvIndex<6) {
    uvIndexEl.addClas("Moderate");
}

else if (uvIndex>=6 && uvIndex<8) {
    uvIndexEl.addClas("High");
}

else {
    uvIndexEl.addClas("Very High")
}
uvEl.append(uvIndexEl);
currentWeatherBox.append(uvEl);

}























