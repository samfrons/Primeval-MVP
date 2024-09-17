import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Weather() {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                    params: {
                        latitude: 52.52,  // Example: Latitude for Berlin
                        longitude: 13.41, // Example: Longitude for Berlin
                        current: 'temperature_2m,wind_speed_10m',
                        hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m'
                    }
                });
                setWeatherData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setWeatherData(null);
            }
        };

        fetchData();
    }, []);

    if (!weatherData) {
        return <div>Loading weather data...</div>;
    }

    return (
        <div>
            <h1>Current Weather</h1>
            <p>Temperature: {weatherData.current.temperature_2m} °C</p>
            <p>Wind Speed: {weatherData.current.wind_speed_10m} km/h</p>
            <h1>Hourly Forecast</h1>
            <ul>
                {weatherData.hourly.time.map((time, index) => (
                    <li key={index}>
                        Time: {time}, Temp: {weatherData.hourly.temperature_2m[index]} °C, Humidity: {weatherData.hourly.relative_humidity_2m[index]}%
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Weather;