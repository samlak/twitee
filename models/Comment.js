const mongoose = require('mongoose');
const _ = require('lodash');

const CommentSchema = new mongoose.Schema({
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  twit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Twit'
  },
  comment: {
      type: String,
      trim: true
  },
  date_created: {
      type: Date,
      default: Date.now,
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {Comment};