const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    chatId: {
        type: String
    },
    username: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    status: {
        type: Number
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
