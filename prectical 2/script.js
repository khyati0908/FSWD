// Hardcoded weather data
const weatherData = {
  "new york": "22°C, Sunny",
  "london": "15°C, Cloudy",
  "paris": "18°C, Rainy",
  "tokyo": "27°C, Clear Skies",
  "delhi": "35°C, Hot",
};

// Handle button click
document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const cityInput = document.getElementById("cityInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("weatherResult");

  if (weatherData[cityInput]) {
    resultDiv.textContent = `Weather in ${cityInput[0].toUpperCase() + cityInput.slice(1)}: ${weatherData[cityInput]}`;
  } else {
    resultDiv.textContent = "Weather data not found for this city.";
  }
});
