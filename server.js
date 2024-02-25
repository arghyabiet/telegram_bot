const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const User = require('./model/user');
const axios = require('axios');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const telegramBot = require('./src/telegramBot');
telegramBot(app);

const adminroute = require('./route/adminroute')
app.use(adminroute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



const scheduleWeatherUpdate = () => {
setInterval(() => {
    sendDailyWeatherUpdate();
}, 24 * 60 * 60 * 1000);
};

const fetchWeatherInfo = async (city, country) => {
    const apiKey = '83cdfefd1d5b8c5df836e22bad146225';
   
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;
    console.log(apiUrl)
    
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather information:', error.message);
      throw error;
    }
  };

  const sendDailyWeatherUpdate = async () => {
    try {
      const users = await User.find({ status: 1 }).exec();
  
      for (const user of users) {
        const { chatId, city, country } = user;
  
        try {
          const weatherInfo = await fetchWeatherInfo(city, country);
          const temperature = weatherInfo.main.temp;
          const description = weatherInfo.weather[0].description;
          bot.sendMessage(chatId, `Good morning! Here's the weather update for ${city}, ${country}:\nTemperature: ${temperature}°C\nDescription: ${description}`);
        } catch (error) {
          console.error('Error sending weather update:', error.message);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };
  sendDailyWeatherUpdate();
