const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../user/schema');


const battleSchema = new Schema({
  name: {
    type: String
  },
  status: {
    type: String,
    enum: ['wait', 'in progress', 'start', 'disconnected', 'end'],
    default: 'wait'
  },
  player1: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  player2: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  win: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  loose: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  playersMove: [
    {
      player: {
        type: String,
        enum: ['1', '2'],
        required: true
      },
      move: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },
      at: {
        type: Date,
        default: new Date()
      }
    }
  ]
});


module.exports = mongoose.model('Battle', battleSchema);
