const apiKey = "c580ebe24bee6122f67d8b903d8454f3";

var cityInput = $("#city");
var submitButton = $(".submit-btn");







function getValue(event) {
    event.preventDefault();
    var city = cityInput.val();
    console.log(city);

    const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetch(queryUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            })
}

submitButton.on("click", getValue);