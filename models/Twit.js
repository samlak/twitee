const mongoose = require('mongoose');
const _ = require('lodash');

const TwitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    twit: {
        type: String,
        required: true,
        trim: true
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
});

const Twit = mongoose.model('Twit', TwitSchema);

module.exports = {Twit};