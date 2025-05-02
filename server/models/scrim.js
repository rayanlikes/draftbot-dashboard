import mongoose from 'mongoose';

const scrimSchema = new mongoose.Schema({
  serverId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  time: {
    type: Date,
    required: true
  },
  lobby_size: {
    type: Number,
    default: 20
  },
  vip_size: {
    type: Number,
    default: 2
  },
  start_slot: {
    type: Number,
    default: 1
  },
  enabled: {
    type: Boolean,
    default: true
  },
  recurring: {
    type: Boolean,
    default: false
  },
  recurringDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Scrim = mongoose.model('Scrim', scrimSchema);

export default Scrim;