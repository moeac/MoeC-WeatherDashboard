const apiKey = "c580ebe24bee6122f67d8b903d8454f3";

const dailyWeather = $('.daily-weather');
const futureWeather = $(".future-weather");
const city = $("#city");
const cityTitle = $(".city-title");
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
        const weatherContainer = $('<div>');
        const weatherInfo = $("<div>");
        
        const date = $('<div>').text(moment().format("dddd, MMMM Do YYYY"))
        const temp = $('<div>').text(`${current.temp} °C`);
        const humidity = $('<div>').text(`Humidity: ${current.humidity} %`);
        const windSpeed = $('<div>').text("Wind Speed: " + (current.wind_speed * 3.6).toFixed(2) + " km/h"); //api call gets wind in m/s so multiply by 3.6 to get km/h
        const uv = $('<div>').text(`UV Index: ${current.uvi}`);
        const icon = $('<img>').attr('src',`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`);
        
        // adds colour depending on temp
        if (current.temp < 20) {
            temp.addClass("text-primary");
        } else if (20 <= current.temp && current.temp < 30) {
            temp.addClass("text-success");
        } else {
            temp.addClass("text-danger");
        }

        // adds colour depending on uvi
        if (current.uvi <= 2) {
            uv.addClass("text-success");
        } else if (2 < current.uvi && current.uvi <= 5) {
            uv.addClass("med");
        } else if (5 < current.uvi && current.uvi <= 7) {
            uv.addClass("text-warning");
        } else if (7 < current.uvi && current.uvi <= 10) {
            uv.addClass("text-danger");
        } else {
            uv.addClass("death");
        }

        // adds classes to each element to fit on screen and colour
        weatherContainer.addClass("row");
        weatherInfo.addClass("col");
        icon.addClass("col");
        cityTitle.addClass("h4 font-weight-bold text-primary p-3");
        humidity.addClass("text-primary");
        windSpeed.addClass("font-italic text-secondary");

        // appends new variables to display
        cityTitle.text(`${cityInput}`.toUpperCase());
        dailyWeather.append(
            weatherContainer.append(
                icon,
                weatherInfo.append(
                    date,
                    temp,
                    humidity,
                    windSpeed,
                    uv
        )));
        
        // runs through the next 5 days of weather stats
        for (let i = 1; i < 6; i++) {

            const futureWeatherContainer = $('<div>');
            const futureWeatherInfo = $('<div>');
            const dateFuture = $('<div>').text(moment().add(i, 'days').format("dddd, MMMM Do YYYY"))
            const tempFuture = $('<div>').text(`${daily[i].temp.day} °C`);
            const humidityFuture = $('<div>').text(`Humidity: ${daily[i].humidity} %`);
            const windSpeedFuture = $('<div>').text("Wind Speed: " + (daily[i].wind_speed * 3.6).toFixed(2) + " km/h"); //api call gets wind in m/s so multiply by 3.6 to get km/h
            const iconFuture = $('<img>').attr('src',`https://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png`);
            
            futureWeatherContainer.addClass("col");
            
            humidityFuture.addClass("text-primary");
            windSpeedFuture.addClass("font-italic text-secondary");

            futureWeather.append(
                futureWeatherContainer.append(
                    iconFuture,
                    futureWeatherInfo.append(   
                        dateFuture,
                        tempFuture,
                        humidityFuture,
                        windSpeedFuture
            )));

            // changes temp colour
            if (daily[i].temp.day < 20) {
                tempFuture.addClass("text-primary");
            } else if (20 <= daily[i].temp.day && daily[i].temp.day < 30) {
                tempFuture.addClass("text-success");
            } else {
                tempFuture.addClass("text-danger");
            }

        }
         
    });
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
    cityTitle.empty();
}

// displays the search history
function displayHistory() {
    historyNav.empty();
    cityTitle.empty();
    historyArray = JSON.parse(localStorage.getItem('cities'));
    // only runs for loop if there is a search to prevent console error
    if (historyArray != null) {
        for (i = 0; i < historyArray.length; i++) {
            const search = $('<button>').text(historyArray[i]);
            search.addClass("search rounded my-2 mx-3 text-primary border-primary bg-light shadow font-weight-bold");
            historyNav.append(search);
        }
    }
}

// adds searches to history and runs displayHistory
function addHistory(event) {
    event.preventDefault();
    let cityInput = city.val();
    // not really sure why this 'if' works tbh but it prevents the error of displayHistory on load so its staying
    if (historyArray == null) {
        historyArray = [];
    }
    if (cityInput) {
    historyArray.push(cityInput);
    localStorage.setItem("cities", JSON.stringify(historyArray));
    displayHistory();
    city.val('');
    }
}

// event listeners
$(window).on('load', displayHistory);
submitButton.on('click', getCity);
submitButton.on('click', addHistory);
historyNav.on('click', '.search', getSearch)
clearButton.on('click', clear);
