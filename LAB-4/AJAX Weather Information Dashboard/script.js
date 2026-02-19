const apiKey = "API_KEY";
const searchBtn = document.getElementById("searchBtn");

let cachedCity = null;
let cachedData = null;

searchBtn.addEventListener("click", getWeather);

function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const message = document.getElementById("message");
    const weatherInfo = document.getElementById("weatherInfo");
    const spinner = document.getElementById("spinner");

    if (!city) {
        message.textContent = "Please enter a city name.";
        message.className = "error";
        return;
    }

    // Check Cache
    if (city.toLowerCase() === cachedCity) {
        displayWeather(cachedData);
        return;
    }

    spinner.style.display = "block";
    message.textContent = "";
    weatherInfo.innerHTML = "";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {

            if (response.status === 404) {
                throw new Error("City not found (404)");
            }

            if (!response.ok) {
                throw new Error("Server error (500)");
            }

            return response.json();
        })
        .then(data => {

            // Cache the result
            cachedCity = city.toLowerCase();
            cachedData = data;

            displayWeather(data);
        })
        .catch(error => {
            message.textContent = error.message;
            message.className = "error";
        })
        .finally(() => {
            spinner.style.display = "none";
        });
}

function displayWeather(data) {

    const weatherInfo = document.getElementById("weatherInfo");

    weatherInfo.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
    `;
}
