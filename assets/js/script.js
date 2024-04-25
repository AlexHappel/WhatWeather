const apiKey = ''; // Replace with your OpenWeatherMap API key

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${8562cecefd2654a9fc7f19eedd1babfc}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
            addSearchHistory(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

function displayCurrentWeather(data) {
    const currentWeather = data.list[0];
    const weatherIcon = currentWeather.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
    const weatherContainer = document.getElementById('current-weather');
    weatherContainer.innerHTML = `
        <h2>${data.city.name}</h2>
        <p>Date: ${new Date(currentWeather.dt * 1000).toLocaleDateString()}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${currentWeather.main.temp}°C</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecast = data.list.filter((item, index) => index % 8 === 0); // Filter to get data for each day
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';
    forecast.forEach(day => {
        const weatherIcon = day.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
        forecastContainer.innerHTML += `
            <div class="forecast-day">
                <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>Temperature: ${day.main.temp}°C</p>
                <p>Humidity: ${day.main.humidity}%</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
            </div>
        `;
    });
}

function addSearchHistory(city) {
    const historyContainer = document.getElementById('search-history');
    const existingItems = historyContainer.getElementsByClassName('history-item');
    let cityExists = false;

    // Check if the city is already in the search history
    for (let i = 0; i < existingItems.length; i++) {
        if (existingItems[i].textContent.toLowerCase() === city.toLowerCase()) {
            cityExists = true;
            break;
        }
    }

    // If the city is not already in the history, add it
    if (!cityExists) {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.textContent = city;
        historyItem.addEventListener('click', function() {
            getWeather(city);
        });
        historyContainer.appendChild(historyItem);
    }
}