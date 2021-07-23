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
























