const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../model/user');  

module.exports = function setupTelegramBot(app) {
  console.log('process.env.TelegramBot', process.env.TelegramBot);

  const bot = new TelegramBot(process.env.TelegramBot, { polling: true });

  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
  });

  bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
  });
  
  bot.onText(/hi/i, async (msg) => {
    const chatId = msg.chat.id;
  
    try {
      const user = await User.findOne({ chatId, status: 1 }).exec();
  
      if (!user) {
        bot.sendMessage(chatId, 'Hi! Welcome to the bot. What is your name?');
        const nameListener = async (nameMsg) => {
          const username = nameMsg.text;
  
          bot.sendMessage(chatId, `Nice to meet you, ${username}! What city are you from?`);
          const cityListener = async (cityMsg) => {
            const city = cityMsg.text;
  
            bot.sendMessage(chatId, `Cool! Which country is ${city} located in?`);
            const countryListener = async (countryMsg) => {
              const country = countryMsg.text;
              const newUser = new User({
                chatId,
                username,
                city,
                country,
                status:1
              });
  
              await newUser.save();
  
              bot.sendMessage(chatId, 'Great! Your information has been saved.');
            };
  
            bot.once('message', countryListener);
          };
  
          bot.once('message', cityListener);
        };
  
        bot.once('message', nameListener);
      } else {
        bot.sendMessage(chatId, `Welcome back, ${user.username}!`);
      }
    } catch (error) {
      console.error('Error:', error);
      bot.sendMessage(chatId, 'Sorry, there was an error processing your request.');
    }
  });
  
  bot.onText(/.*/, async (msg) => {
    if (msg.text.toLowerCase() !== 'hi') {
      const chatId = msg.chat.id;
      const user = await User.findOne({ chatId, status: 1 }).exec();
      if(user){
        bot.sendMessage(chatId, 'This is just for save the user details.');
      }
    }
  });
};
