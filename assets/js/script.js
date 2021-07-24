//Global Variables
var apiLink = "https://api.openweathermap.org/data/2.5/weather";
var apiKey = "df21af596a60ec7e877a04968712a9d3";
var tempUnit = "&units=imperial";
var currentDate = new Date();
var month = currentDate.getMonth()+1;
var day = currentDate.getDate();
var year = currentDate.getFullYear();
var currentWeatherBox = $("#currentWeather");

//Button Click Variable
var searchBtn = $("#searchBtn");

//For Storing Search History
var cityBox = $("#cityBox");
var cityList = JSON.parse(localStorage.getItem("city")) || [];


function currentWeather(city) {
    var serverSide = apiLink + "?q=" + city + "&appid=" + apiKey + tempUnit;
    fetch(serverSide).then(function (response) {
        if (response.ok) {
            response.json().then(function (weatherData) {
                getUVIndex(city, weatherData);
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
//clear current results
currentWeatherBox.html("").addClass("border border-secondary");
 //display current city/date
var cityHeader = $("<h2>")
        .addClass("capitalize")
        .text(city + "(" + month + "/" + day + "/" + year + ") ");
var imgEl = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + ".png");
cityHeader.append(imgEl);
currentWeatherBox.append (cityHeader);
 
//append temp
var temperatureEl = $("<p>")
    .text("Temperature: " + weatherData.main.temp);
var unitEl = $("<span>")
    .html("&#176;F");
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
    uvIndexEl.addClass("Low");
}

else if (uvIndex>=3 && uvIndex<6) {
    uvIndexEl.addClass("Moderate");
}

else if (uvIndex>=6 && uvIndex<8) {
    uvIndexEl.addClass("High");
}

else {
    uvIndexEl.addClass("VeryHigh")
}
uvEl.append(uvIndexEl);
currentWeatherBox.append(uvEl);

}

//5 day forecast

var forecastApi = "https://api.openweathermap.org/data/2.5/onecall";
var forecastBoxEl = $("#daysBox");

function getForecast(weatherData) {
    var forecastServer = forecastApi + "?lat=" + weatherData.coord.lat + "&lon=" + weatherData.coord.lat + "&appid=" + apiKey + tempUnit + "&exclude=current,hourly";
    fetch(forecastServer).then(function(response){
        if (response.ok){
            response.json().then(function(forecastData){
                displayForecast(forecastData);
            });
        }
    });
}

function displayForecast(forecastData){
    var headerEl = $("#forecastHead").attr("hidden", false);
    forecastBoxEl.html("");

    for (var i=0; i<5; i++){
        var divEl = $("<div>")
            .addClass("col-2 bg-dark text-white mx-auto p-2");
        
    //append date
    var date = addDays(currentDate, i+1);
    var month = date.getMonth()+1;
    var pEl = $("<p>")
        .addClass("font-weight-bold")
        .text(month + "/" + date.getDate() + "/" + date.getFullYear());
    divEl.append(pEl);

    //append weather icon
    iconImgEl = $("<img>")
        .attr("src", "http://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + ".png");
    divEl.append(iconImgEl);

    //append temperature
    var tempEl = $("<p>")
        .text("Temp: " + forecastData.daily[i].temp.day);
    var unitEl = $("<span>")
        .html("&#176;F");
    tempEl.append(unitEl);
    divEl.append(tempEl);

    //append humidity
    var humidityEl =  $("<p>")
    .text("Humidity : " + forecastData.daily[i].humidity);
    divEl.append(humidityEl);

    forecastBoxEl.append(divEl);
    }
}
function addDays (date, days){
    var result = new Date (date);
    result.setDate(result.getDate()+days);
    return result;
}

function buttonClick(event){
    event.preventDefault();

    var city = $("#cityName");
    if(city.val()){
        currentWeather(city.val());
        city.val("");
    }
}

function saveSearch(city){
    var searched = cityList.indexOf(city);
    if (searched>-1){
        cityList.splice(searched, 1);
    }
    cityList.push(city);
    if(cityList.length>10){
        cityList.shift();
    }
    localStorage.setItem("city", JSON.stringify(cityList));
}

function displayCities (){
    cityBox.html("");
    for (var i=1; i<=cityList.length; i++){
        var buttonEl = $("<button>")
            .attr("city-name", cityList[cityList.length-i])
            .addClass("capitalize btn-info bg-secondary m-1 w-75")
            .text(cityList[cityList.length-i]);

    cityBox.append(buttonEl);
    }
}

function cityClick(event){
    var city = event.target.getAttribute("city-name");
    if (city){
        currentWeather(city);
    }
}


searchBtn.on("click", buttonClick);
cityBox.on("click", cityClick);
displayCities();


