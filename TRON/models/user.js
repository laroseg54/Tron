const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    highestScore: {
        type: Number
    },
    nb_win: {
        type: Number
    },
    nb_lost: {
        type: Number
    }
});

module.exports = mongoose.model('User', userSchema);