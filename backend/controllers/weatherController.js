const axios = require('axios');

// @desc  Get weather by coordinates
// @route GET /api/weather?lat=&lng=
const getWeather = async (req, res) => {
  try {
    const { lat, lng, city } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      // Return mock data if no API key configured
      return res.json({
        success: true,
        mock: true,
        weather: {
          city: city || 'Your Location',
          temperature: 28,
          feelsLike: 31,
          humidity: 75,
          description: 'Partly Cloudy',
          icon: '02d',
          windSpeed: 12,
          visibility: 10,
          pressure: 1012,
        },
      });
    }

    let url;
    if (lat && lng) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else {
      return res.status(400).json({ success: false, message: 'Provide lat/lng or city' });
    }

    const response = await axios.get(url);
    const data = response.data;

    res.json({
      success: true,
      weather: {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000,
        pressure: data.main.pressure,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Weather data unavailable', error: error.message });
  }
};

// @desc  Get 5-day forecast
// @route GET /api/weather/forecast?lat=&lng=
const getForecast = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      return res.json({ success: true, mock: true, forecast: [] });
    }
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&cnt=40`;
    const response = await axios.get(url);
    const forecast = response.data.list.map((item) => ({
      time: item.dt_txt,
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));
    res.json({ success: true, forecast });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Forecast unavailable' });
  }
};

module.exports = { getWeather, getForecast };
