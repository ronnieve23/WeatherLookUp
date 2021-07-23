//Global Variables
var apiLink = "https://api.openweathermap.org/data/2.5/forecast";
var apiKey = "df21af596a60ec7e877a04968712a9d3";
var tempUnit = "&units=imperial";
var currentDate = new Date();
var month = currentDate.getDate()+1;
var day = currentDate.getDay();
var year = currentDate.getFullYear();
var currentWeatherBox = ("#currentWeather");

//Button Click Variable
var searchBtn = $("#searchBtn");

//For Storing Search History
var cityBox = $("#cityBox");
var cityList = JSON.parse(localStorage.getItem("city")) || [];

function currentWeather (city){
    var serverSide = apiLink = "?q=" + city + "&appid=" + apiKey + fahrenheit;
    fetch(serverSide).then(function(response) {
        if(response.ok){
            response.json().then (function(weatherData){
                getUvIndex(city, weatherData);
                getForecast(weatherData);
                saveSearch(city);
                displayCities();
            });
        }
    });  
}

function getUVIndex(city,weatherData) {
    var uvAPI = "https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lon + "&appid=" + apiKey;
    fetch(uvAPI).then(function(response){
        if(response.ok){
            response.json().then(function(uvData){
                displayWeather(city, weatherData, uvData);
            });
        }
    });
}

function displayWeather (city, weatherData, uvData){


    //display current city/date
    var cityHeader = $("<h2>")
        .addClas("capital")
        .text(city + "(" + month + "/" + day + "/" + year + ") ");
    var imgEl = $("<img>").attr("src","http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + ".png" );
    cityHeader.append(imgEl);
    currentWeatherBox.append(cityHeader);

    
}























