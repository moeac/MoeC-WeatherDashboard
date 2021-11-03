const apiKey = "c580ebe24bee6122f67d8b903d8454f3";

const dailyWeather = $('.daily-weather');
const futureWeather = $(".future-weather");
const city = $("#city");
const submitButton = $(".submit-btn");
const clearButton = $(".clear-btn");
const historyNav = $(".history");
var historyArray = [];


// fetches weather to get lon and lat values
function fetchWeather(cityInput) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`)
    .then(response => {
        if (!response.ok) {
            alert("Please check your spelling and input a city");
        }
        else {
            return response.json();
        }
    })
}

// fetches weather data using lon and lat values
function fetchFuture(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${apiKey}`)
    .then(response => {
        if (!response.ok) {
            alert("Please check your spelling and input a city");
        }
        else {
            return response.json();
        }
    })
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
    // clears weather display before loading new search
    dailyWeather.empty();
    futureWeather.empty();
    currentWeather(cityInput)
    .then(function(data) {

        // destructures data to get current and daily weather details
        const { current, daily } = data;

        // creates tags and fills text content for each variable
        const cityTitle = $('<li>').text(`${cityInput}`.toUpperCase());
        const date = $('<li>').text(moment().format("dddd, MMMM Do YYYY"))
        const temp = $('<li>').text(`${current.temp} °C`);
        const humidity = $('<li>').text(`Humidity: ${current.humidity} %`);
        const windSpeed = $('<li>').text("Wind Speed: " + (current.wind_speed * 3.6).toFixed(2) + " km/h"); //api call gets wind in m/s so multiply by 3.6 to get km/h
        const uv = $('<li>').text(`UV Index: ${current.uvi}`);
        const icon = $('<img>').attr('src',`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);

        // decides what class to apply depending on uvi
        if (current.uvi <= 2) {
            uv.addClass("low");
        } else if (2 < current.uvi && current.uvi <= 5) {
            uv.addClass("med");
        } else if (5 < current.uvi && current.uvi <= 7) {
            uv.addClass("high");
        } else if (7 < current.uvi && current.uvi <= 10) {
            uv.addClass("v-high");
        } else {
            uv.addClass("death");
        }

        // appends new variables to display
        dailyWeather.append(
            cityTitle,
            date,
            temp,
            humidity,
            windSpeed,
            uv,
            icon,
            );
        
        // runs through the next 5 days of weather stats
        for (let i = 1; i < 6; i++) {

        const dateFuture = $('<li>').text(moment().add(i, 'days').format("dddd, MMMM Do YYYY"))
        const tempFuture = $('<li>').text(`${daily[i].temp.day} °C`);
        const humidityFuture = $('<li>').text(`Humidity: ${daily[i].humidity} %`);
        const windSpeedFuture = $('<li>').text("Wind Speed: " + (daily[i].wind_speed * 3.6).toFixed(2) + " km/h"); //api call gets wind in m/s so multiply by 3.6 to get km/h
        const iconFuture = $('<img>').attr('src',`https://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png`);
        
        futureWeather.append(
            dateFuture,
            tempFuture,
            humidityFuture,
            windSpeedFuture,
            iconFuture,
            );
        }
         
    })
}

// gets value of city input by user
function getCity(event) {
    event.preventDefault();
    var cityInput = city.val();
    displayWeather(cityInput);

}

// gets value of clicked previous search
function getSearch(event) {
    event.preventDefault();
    let cityInput = $(event.target).text();
    displayWeather(cityInput);
}

// clears everything
function clear() {
    historyArray = [];
    localStorage.clear();
    dailyWeather.empty();
    futureWeather.empty();
    historyNav.empty();

}

// displays the search history
function displayHistory() {

    historyNav.empty();
    historyArray = JSON.parse(localStorage.getItem('cities'));
    for (i = 0; i < historyArray.length; i++) {
        const search = $('<li>').text(historyArray[i]);
        search.addClass("search");
        historyNav.append(search);
        
    }
}

// adds searches to history and runs displayHistory
function addHistory(event) {
    event.preventDefault();
    cityInput = city.val();
    historyArray.push(cityInput);
    localStorage.setItem("cities", JSON.stringify(historyArray));
    displayHistory();
}

// event listeners
$(window).on('load', displayHistory);
submitButton.on('click', getCity);
submitButton.on('click', addHistory);
historyNav.on('click', '.search', getSearch)
clearButton.on('click', clear);
