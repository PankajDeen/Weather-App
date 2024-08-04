const apiKey = 'bc61aa95b57651ac8d4a59a943399f06'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Function to get weather data by location name
async function getWeatherByLocation(location, units = 'metric') {
    const url = `${apiUrl}?q=${location}&units=${units}&appid=${apiKey}`;
    return fetchWeatherData(url);
}

// Function to get weather data by geolocation
async function getWeatherByGeolocation(lat, lon, units = 'metric') {
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    return fetchWeatherData(url);
}

// Fetch weather data from API and update the UI
async function fetchWeatherData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();

        // Determine temperature unit label
        const unitSymbol = url.includes('units=imperial') ? '°F' : '°C';

        // Update UI with weather data
        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp.toFixed(1)}${unitSymbol}`;
        document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
        document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed.toFixed(1)} m/s`;
        document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        document.getElementById('weather-info').style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Failed to fetch weather data. Please check the location and try again.');
        document.getElementById('weather-info').style.display = 'none';
    }
}

// Function to handle user input and fetch weather data
async function getWeather() {
    const location = document.getElementById('location').value.trim();
    const units = document.getElementById('unit-toggle').checked ? 'imperial' : 'metric';

    if (location) {
        await getWeatherByLocation(location, units);
    } else {
        // Get user geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => getWeatherByGeolocation(position.coords.latitude, position.coords.longitude, units),
                error => {
                    console.error(error);
                    alert('Unable to retrieve your location.');
                    document.getElementById('weather-info').style.display = 'none';
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
            document.getElementById('weather-info').style.display = 'none';
        }
    }
}

// Event listener for enter key press
document.getElementById('location').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Event listener for unit toggle change
document.getElementById('unit-toggle').addEventListener('change', function () {
    getWeather();
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('weather-info').style.display = 'none';
});
