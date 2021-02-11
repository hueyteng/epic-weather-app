// CURRENT DATE UPDATE //
function displayDateTime(timestamp) {
  let date = new Date(timestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
   if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hour}:${minutes}`;
}


// LOCATION AND TEMPERATURE UPDATE //
function displaySearchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city");
  let cityDisplay = document.querySelector("#current-city");

  cityDisplay.innerHTML = `${searchInput.value}`.toUpperCase();

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  searchOnLoad(city);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
      <div class="col-2">
      <h4 class="hour">
        ${formatHours(forecast.dt * 1000)}
      </h4>
      <img src="src/images/${forecast.weather[0].icon}.png" 
      class = "forecast-image" />
        <div class="temp-forecast">
        <strong><span class="forecast-max">
          ${Math.round(forecast.main.temp_max)}</span>°
          </strong>
          <span class="forecast-min">
           ${Math.round(forecast.main.temp_min)}</span>°
        </div>
        </div>`;
}
  }

function search(city) {
  let apiKey = "86c2f666f31a39c50f5fcfdde17550ce";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherConditions);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeatherConditions(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let cityElement = document.querySelector("#current-city");
  let dateElement = document.querySelector("#current-date-time");
  let conditionElement = document.querySelector("#current-conditions");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#weather-icon");
  let feelsLikeElement = document.querySelector("#feels-like");

  celsiusTemp = response.data.main.temp;
  celsisusFeelsLike = response.data.main.feels_like;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name.toUpperCase();
  dateElement.innerHTML = displayDateTime(response.data.dt * 1000);
  conditionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `<strong>Humidity:</strong> ${Math.round(response.data.main.humidity)}%`;
  windElement.innerHTML = `<strong>Wind:</strong> ${Math.round(response.data.wind.speed)} mph`;
  iconElement.setAttribute("src", `src/images/${response.data.weather[0].icon}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  feelsLikeElement.innerHTML = `Feels like: <strong>${Math.round(celsisusFeelsLike)}°</strong>`;
}

function getTemp(event) {
  event.preventDefault();
  let city = document.querySelector("#search-city").value;
  search(city);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  celsiusLink.removeEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);
}

function findLocation(position) {
  let apiKey = "86c2f666f31a39c50f5fcfdde17550ce";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(currentWeatherUrl).then(showWeatherConditions);

  forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  celsiusLink.removeEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);
}

function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findLocation);
}

let searchButton = document.querySelector("#search-form");
searchButton.addEventListener("submit", getTemp);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", retrievePosition);


// CELSIUS AND FAHRENHEIT CONVERSION //
function convertToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `Feels like: <strong>${Math.round(celsisusFeelsLike * 9 / 5 + 32)}°</strong>`;

  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

    let forecastMin = document.querySelectorAll(".forecast-min");
    forecastMin.forEach(function (item) {
      let currentTemp = item.innerHTML;
      item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  celsiusLink.addEventListener("click", convertToCelsius);
  fahrenheitLink.removeEventListener("click", convertToFahrenheit);
}

function convertToCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `Feels like: <strong>${Math.round(celsisusFeelsLike)}°</strong>`;
  
  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp - 32) * 5 / 9);
  });

    let forecastMin = document.querySelectorAll(".forecast-min");
    forecastMin.forEach(function (item) {
      let currentTemp = item.innerHTML;
      item.innerHTML = Math.round((currentTemp - 32) * 5 / 9);
  });

  celsiusLink.removeEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);
}

let celsiusTemp = null;

let submitForm = document.querySelector("#search-form");
submitForm.addEventListener("submit", displaySearchCity);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

search("Kuala Lumpur");