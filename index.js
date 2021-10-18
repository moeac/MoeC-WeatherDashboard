const apiKey = "c580ebe24bee6122f67d8b903d8454f3";

const city = $("#city");
const submitButton = $(".submit-btn");

function cityWeather(cityInput) {
    const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
    fetch(cityUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            const { coord, main, name, sys, weather } = data;
            console.log(coord.lat, coord.lon, main.temp, name, sys.country, weather);
            const lat = coord.lat;
            const lon = coord.lon;
            cityStats(lat, lon);
        })
}

function cityStats(lat, lon) {
    const coordUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`;
    fetch(coordUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            const { current, daily} = data;
            console.log(current.humidity, current.uvi, current.wind_speed)
})
}



function getValue(event) {
    event.preventDefault();
    const cityInput = city.val();
    // console.log(city);

    if (cityInput) {
        cityWeather(cityInput);
    }

}

submitButton.on("click", getValue);