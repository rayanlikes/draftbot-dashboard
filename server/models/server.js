import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  serverId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  icon: String,
  configuration: {
    adminRole: String,
    modRole: String,
    logChannel: String,
    welcomeChannel: String,
    registrationChannel: String,
    resultsChannel: String,
    notificationChannel: String,
    banChannel: String
  },
  visualTemplates: {
    slots: {
      style: String,
      category: String,
      customization: {
        fontColor: String,
        backgroundColor: String,
        borderColor: String,
        logoUrl: String,
        customText: String
      }
    },
    leaderboard: {
      style: String,
      category: String,
      customization: {
        fontColor: String,
        backgroundColor: String,
        borderColor: String,
        logoUrl: String,
        customText: String
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Server = mongoose.model('Server', serverSchema);

export default Server;