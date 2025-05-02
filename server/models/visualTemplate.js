import mongoose from 'mongoose';

const visualTemplateSchema = new mongoose.Schema({
  serverId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['slots', 'leaderboard']
  },
  style: {
    type: String,
    required: true
  },
  category: String,
  customization: {
    fontColor: String,
    backgroundColor: String,
    borderColor: String,
    logoUrl: String,
    customText: String
  },
  previewUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for serverId and type to ensure uniqueness
visualTemplateSchema.index({ serverId: 1, type: 1 }, { unique: true });

const VisualTemplate = mongoose.model('VisualTemplate', visualTemplateSchema);

export default VisualTemplate;