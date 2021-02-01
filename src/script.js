// CURRENT DATE UPDATE //

function displayDateTime(date) {
  let currentDateTime = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[currentDateTime.getDay()];

  let hour = currentDateTime.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = currentDateTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let currentDate = document.querySelector("#current-date-time");
  currentDate.innerHTML = `${day} ${hour}:${minutes}`;
}

displayDateTime();

// LOCATION AND TEMPERATURE UPDATE //
function displaySearchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city");
  let cityDisplay = document.querySelector("#current-city");

  cityDisplay.innerHTML = `${searchInput.value}`.toUpperCase();
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = 91;
}

function convertToCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = 33;
}

let submitForm = document.querySelector("#search-form");
submitForm.addEventListener("submit", displaySearchCity);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

function search(city) {
  let apiKey = "86c2f666f31a39c50f5fcfdde17550ce";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherConditions);
}

function showWeatherConditions(response) {
  document.querySelector("#current-city").innerHTML = response.data.name.toUpperCase();
  document.querySelector("#current-temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#wind").innerHTML = `<strong>Wind:</strong> ${Math.round(response.data.wind.speed)} mph`;
  document.querySelector("#humidity").innerHTML = `<strong>Humidity:</strong> ${Math.round(response.data.main.humidity)}%`;
  document.querySelector("#current-conditions").innerHTML = response.data.weather[0].main;
}

function getTemp(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city").value;
  search(city);
}

function findLocation(position) {
  let apiKey = "86c2f666f31a39c50f5fcfdde17550ce";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherConditions);
}

function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findLocation);
}

let searchButton = document.querySelector("#search-form");
searchButton.addEventListener("submit", getTemp);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", retrievePosition);

search("Kuala Lumpur");