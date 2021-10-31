const apiKey = "c580ebe24bee6122f67d8b903d8454f3";

var dailyWeather = $('.daily-weather');
var city = $("#city");
const submitButton = $(".submit-btn");

// fetches weather to get lon and lat values
function fetchWeather(cityInput) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`)
    .then(response => response.json());
}

// fetches weather data using lon and lat values
function fetchFuture(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`)
    .then(response => response.json());
}

// function to get the data from both API's
function currentWeather(cityInput) {
    return fetchWeather(cityInput)
    .then(function(data) {
        const { coord } = data;
        return fetchFuture(coord.lat, coord.lon);
    })

}

// displays the weather
function displayWeather(cityInput) {
    currentWeather(cityInput)
    .then(function(data) {
        console.log(data);
        const { current } = data;
        
        const cityTitle = $('<li>').text(`${cityInput}`.toUpperCase());
        const date = $('<li>').text(moment().format("dddd, MMMM Do YYYY"))
        const temp = $('<li>').text(`${current.temp} °C`);
        const humidity = $('<li>').text(`${current.humidity} %`);
        const windSpeed = $('<li>').text((current.wind_speed * 3.6).toFixed(2) + " km/h"); //api call gets wind in m/s so multiply by 3.6 to get km/h
        const uv = $('<li>').text(`UV Index: ${current.uvi}`);
        const icon = $('<img>').attr('src',`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);
        
        dailyWeather.append(
            cityTitle,
            date,
            temp,
            humidity,
            windSpeed,
            uv,
            icon,
            );
         
    })
}

// gets value of city input by user
function getCity(event) {
    event.preventDefault();
    var cityInput = city.val();
    console.log(cityInput);
    displayWeather(cityInput);

}

submitButton.on('click', getCity);

