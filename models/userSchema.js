const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model(LOGS, logSchema);

module.exports = User;