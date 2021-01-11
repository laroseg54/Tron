const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    moto_color: {
        type: String,
        unique: true
    },
    score: {
        type: Number
    }
});

module.exports = mongoose.model('Player', playerSchema);