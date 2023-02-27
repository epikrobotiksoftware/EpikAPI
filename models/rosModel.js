const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');

////Position Marker

const positionMarker = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Position must have a Name'],
    unique: true,
  },
  x: {
    type: Decimal128,
    required: [true, 'Position must have an X coordinate'],
  },
  y: {
    type: Decimal128,
    required: [true, 'Position must have a Y coordinate'],
  },
  rotation: {
    type: Decimal128,
    required: [true, 'Position must have a Rotation'],
  },
  type: {
    type: String,
    default: 'normal',
    required: [false, ' Optional'],
  },
});

const action = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Action must have a Name'],
      unique: true,
    },
    type: {
      type: String,
      // default: 'normal',
      enum: ['load', 'unload', 'charge', 'removeCharge', 'goto'],
      required: [true, ' Action must have a type'],
    },
  },
  { collection: 'actions' }
);

const mission = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Action must have a Name'],
      unique: true,
    },
    mission: mongoose.Schema.Types.Mixed,
  },
  { collection: 'missions' }
);
const Position = mongoose.model('Position', positionMarker);
const Action = mongoose.model('Action', action);
const Mission = mongoose.model('Mission', mission);

module.exports = { Position, Action, Mission };
