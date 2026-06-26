const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/weather', async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ error: "City name is required" });
    }

    try {
        // WeatherAPI.com endpoint query
        const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
        const response = await axios.get(weatherUrl);
        const data = response.data;

        // OpenWeatherMap ke response ki tarah layout transform kar rahe hain taaki frontend crash na ho
        const formattedData = {
            name: data.location.name,
            weather: [{ description: data.current.condition.text }],
            main: {
                temp: data.current.temp_c,
                humidity: data.current.humidity
            },
            wind: {
                speed: parseFloat((data.current.wind_kph / 3.6).toFixed(1)) // kph ko m/s me convert kiya
            }
        };

        res.json(formattedData);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data for the specified city" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});