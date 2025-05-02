import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-discord';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import connectDB from './db.js';
import { User, Server, Scrim, VisualTemplate } from './models/index.js';
import mongoose from 'mongoose';

// Configure environment variables
dotenv.config();

// ES Module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());

// Configure session with MongoDB store
const MongoStore = (await import('connect-mongo')).default;
app.use(session({
  secret: process.env.SESSION_SECRET || 'draftbot-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/draftbot',
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Discord OAuth Strategy
passport.use(new Strategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/discord/callback',
  scope: ['identify', 'guilds']
}, async (accessToken, refreshToken, profile, done) => {
  // Store user data in database and session
  try {
    // Find or create user in database
    let user = await User.findOne({ discordId: profile.id });
    
    if (!user) {
      user = new User({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        accessToken: accessToken,
        refreshToken: refreshToken,
        guilds: profile.guilds
      });
    } else {
      // Update existing user
      user.username = profile.username;
      user.discriminator = profile.discriminator;
      user.avatar = profile.avatar;
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.guilds = profile.guilds;
    }
    
    await user.save();
    
    const userData = {
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
      accessToken: accessToken,
      refreshToken: refreshToken,
      guilds: profile.guilds
    };
    
    return done(null, userData);
  } catch (error) {
    console.error('Error saving user data:', error);
    return done(error);
  }
}));

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// API Routes
const apiRouter = express.Router();

// Auth routes
apiRouter.get('/auth/discord', passport.authenticate('discord'));

apiRouter.get('/auth/discord/callback', 
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  }
);

apiRouter.post('/auth/discord', async (req, res) => {
  try {
    // Exchange the authorization code for an access token
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    // If user is already authenticated, return their profile
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    
    // Exchange code for token using Discord OAuth API
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5000/api/auth/discord/callback',
        scope: 'identify guilds',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('Token exchange error:', error);
      return res.status(401).json({ message: 'Failed to exchange code for token', error });
    }

    const tokens = await tokenResponse.json();
    
    // Fetch user data from Discord API
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokens.token_type} ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const error = await userResponse.json();
      console.error('User data fetch error:', error);
      return res.status(401).json({ message: 'Failed to fetch user data', error });
    }

    const userData = await userResponse.json();
    
    // Fetch user's guilds
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        authorization: `${tokens.token_type} ${tokens.access_token}`,
      },
    });

    if (!guildsResponse.ok) {
      const error = await guildsResponse.json();
      console.error('Guilds fetch error:', error);
      return res.status(401).json({ message: 'Failed to fetch guilds', error });
    }

    const guilds = await guildsResponse.json();
    
    // Save user to database
    try {
      let user = await User.findOne({ discordId: userData.id });
      
      if (!user) {
        user = new User({
          discordId: userData.id,
          username: userData.username,
          discriminator: userData.discriminator,
          avatar: userData.avatar,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          guilds: guilds
        });
      } else {
        // Update existing user
        user.username = userData.username;
        user.discriminator = userData.discriminator;
        user.avatar = userData.avatar;
        user.accessToken = tokens.access_token;
        user.refreshToken = tokens.refresh_token;
        user.guilds = guilds;
      }
      
      await user.save();
      
      // Log the user in
      req.login({
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        guilds: guilds
      }, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ message: 'Login failed', error: err.message });
        }
        
        return res.json(req.user);
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ message: 'Failed to save user data', error: dbError.message });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

apiRouter.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

apiRouter.get('/auth/profile', isAuthenticated, (req, res) => {
  res.json(req.user);
});

apiRouter.get('/auth/servers', isAuthenticated, async (req, res) => {
  try {
    // If user has guilds in their profile, use those
    if (req.user && req.user.guilds) {
      // Get list of servers where the bot is installed
      const botServers = await Server.find({}, 'serverId').lean();
      const botServerIds = botServers.map(server => server.serverId);
      
      const servers = req.user.guilds
        .filter(guild => {
          // Check if user has admin permissions or the bot is installed
          const isAdmin = (guild.permissions & 0x8) === 0x8; // ADMINISTRATOR permission
          const botInstalled = botServerIds.includes(guild.id);
          return isAdmin || botInstalled;
        })
        .map(guild => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
          isAdmin: (guild.permissions & 0x8) === 0x8 // Check if user has ADMINISTRATOR permission
        }));
      
      return res.json(servers);
    }
    
    // Fallback to mock data if no guilds found
    res.json([
      { id: '1', name: 'Fun Server', icon: null, isAdmin: false },
      { id: '2', name: 'Admin Guild', icon: null, isAdmin: true },
      { id: '3', name: 'Gaming Hub', icon: null, isAdmin: false },
    ]);
  } catch (error) {
    console.error('Error fetching servers:', error);
    res.status(500).json({ message: 'Failed to fetch servers', error: error.message });
  }
});

// Scrim management routes
apiRouter.get('/scrims/:serverId', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    
    // Get scrims from database
    const scrims = await Scrim.find({ serverId }).sort({ time: 1 });
    
    // If no scrims found, return empty array
    if (!scrims || scrims.length === 0) {
      // Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        return res.json([
          { 
            id: '1', 
            name: 'Daily Scrim', 
            time: new Date().toISOString(), 
            description: 'Daily practice scrim',
            lobby_size: 20,
            vip_size: 2,
            start_slot: 1,
            enabled: true
          },
          { 
            id: '2', 
            name: 'Pro Scrim', 
            time: new Date(Date.now() + 86400000).toISOString(), 
            description: 'Professional players only',
            lobby_size: 16,
            vip_size: 4,
            start_slot: 1,
            enabled: true
          },
        ]);
      }
      return res.json([]);
    }
    
    res.json(scrims);
  } catch (error) {
    console.error('Error fetching scrims:', error);
    res.status(500).json({ message: 'Failed to fetch scrims', error: error.message });
  }
});

apiRouter.post('/scrims/:serverId', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    
    // Create a new scrim
    const newScrim = new Scrim({
      serverId,
      ...req.body,
      enabled: true
    });
    
    // Save to database
    await newScrim.save();
    
    res.status(201).json(newScrim);
  } catch (error) {
    console.error('Error creating scrim:', error);
    res.status(500).json({ message: 'Failed to create scrim', error: error.message });
  }
});

apiRouter.put('/scrims/:serverId/:scrimId', isAuthenticated, async (req, res) => {
  try {
    const { serverId, scrimId } = req.params;
    
    // Find and update the scrim
    const updatedScrim = await Scrim.findByIdAndUpdate(
      scrimId,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedScrim) {
      return res.status(404).json({ message: 'Scrim not found' });
    }
    
    res.json(updatedScrim);
  } catch (error) {
    console.error('Error updating scrim:', error);
    res.status(500).json({ message: 'Failed to update scrim', error: error.message });
  }
});

apiRouter.delete('/scrims/:serverId/:scrimId', isAuthenticated, async (req, res) => {
  try {
    const { serverId, scrimId } = req.params;
    
    // Find and delete the scrim
    const deletedScrim = await Scrim.findByIdAndDelete(scrimId);
    
    if (!deletedScrim) {
      return res.status(404).json({ message: 'Scrim not found' });
    }
    
    res.json({ message: 'Scrim deleted successfully' });
  } catch (error) {
    console.error('Error deleting scrim:', error);
    res.status(500).json({ message: 'Failed to delete scrim', error: error.message });
  }
});

// Visual editor routes
apiRouter.get('/visual/:serverId/slots', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    
    // Get slot template from database
    let template = await VisualTemplate.findOne({ serverId, type: 'slots' });
    
    // Default templates
    const templates = [
      { id: 'style_a', name: 'Style A' },
      { id: 'style_b', name: 'Style B' },
    ];
    
    // If no template found, return default
    if (!template) {
      return res.json({
        templates,
        savedTemplate: {
          style: 'style_a',
          category: 'scrim',
          customization: {
            fontColor: '#ffffff',
            backgroundColor: '#121212',
            borderColor: '#7289da',
            logoUrl: '',
            customText: 'Scrim Slots',
          }
        },
        previewUrl: 'https://via.placeholder.com/500x300.png?text=Slot+Preview'
      });
    }
    
    res.json({
      templates,
      savedTemplate: {
        style: template.style,
        category: template.category,
        customization: template.customization
      },
      previewUrl: template.previewUrl || 'https://via.placeholder.com/500x300.png?text=Slot+Preview'
    });
  } catch (error) {
    console.error('Error fetching slot template:', error);
    res.status(500).json({ message: 'Failed to fetch slot template', error: error.message });
  }
});

apiRouter.post('/visual/:serverId/slots', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    const { style, category, customization, previewUrl } = req.body;
    
    // Find existing template or create new one
    let template = await VisualTemplate.findOne({ serverId, type: 'slots' });
    
    if (template) {
      // Update existing template
      template.style = style;
      template.category = category;
      template.customization = customization;
      if (previewUrl) template.previewUrl = previewUrl;
    } else {
      // Create new template
      template = new VisualTemplate({
        serverId,
        type: 'slots',
        style,
        category,
        customization,
        previewUrl: previewUrl || 'https://via.placeholder.com/500x300.png?text=Slot+Preview'
      });
    }
    
    // Save to database
    await template.save();
    
    res.json({
      message: 'Slot template saved successfully',
      previewUrl: template.previewUrl
    });
  } catch (error) {
    console.error('Error saving slot template:', error);
    res.status(500).json({ message: 'Failed to save slot template', error: error.message });
  }
});

apiRouter.get('/visual/:serverId/leaderboard', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    
    // Get leaderboard template from database
    let template = await VisualTemplate.findOne({ serverId, type: 'leaderboard' });
    
    // Default templates
    const templates = [
      { id: 'style_a', name: 'Style A' },
      { id: 'style_b', name: 'Style B' },
    ];
    
    // If no template found, return default
    if (!template) {
      return res.json({
        templates,
        savedTemplate: {
          style: 'style_b',
          category: 'top_10',
          customization: {
            fontColor: '#ffffff',
            backgroundColor: '#121212',
            borderColor: '#7289da',
            logoUrl: '',
            customText: 'Leaderboard',
          }
        },
        previewUrl: 'https://via.placeholder.com/500x300.png?text=Leaderboard+Preview'
      });
    }
    
    res.json({
      templates,
      savedTemplate: {
        style: template.style,
        category: template.category,
        customization: template.customization
      },
      previewUrl: template.previewUrl || 'https://via.placeholder.com/500x300.png?text=Leaderboard+Preview'
    });
  } catch (error) {
    console.error('Error fetching leaderboard template:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard template', error: error.message });
  }
});

apiRouter.post('/visual/:serverId/leaderboard', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    const { style, category, customization, previewUrl } = req.body;
    
    // Find existing template or create new one
    let template = await VisualTemplate.findOne({ serverId, type: 'leaderboard' });
    
    if (template) {
      // Update existing template
      template.style = style;
      template.category = category;
      template.customization = customization;
      if (previewUrl) template.previewUrl = previewUrl;
    } else {
      // Create new template
      template = new VisualTemplate({
        serverId,
        type: 'leaderboard',
        style,
        category,
        customization,
        previewUrl: previewUrl || 'https://via.placeholder.com/500x300.png?text=Leaderboard+Preview'
      });
    }
    
    // Save to database
    await template.save();
    
    res.json({
      message: 'Leaderboard template saved successfully',
      previewUrl: template.previewUrl
    });
  } catch (error) {
    console.error('Error saving leaderboard template:', error);
    res.status(500).json({ message: 'Failed to save leaderboard template', error: error.message });
  }
});

// Role and channel configuration routes
apiRouter.get('/config/:serverId', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    
    // Get server configuration from database
    let server = await Server.findOne({ serverId });
    
    // If no server found, return default configuration
    if (!server) {
      return res.json({
        adminRole: '',
        modRole: '',
        logChannel: '',
        welcomeChannel: '',
        registrationChannel: '',
        resultsChannel: '',
        notificationChannel: '',
        banChannel: ''
      });
    }
    
    res.json(server.configuration);
  } catch (error) {
    console.error('Error fetching server configuration:', error);
    res.status(500).json({ message: 'Failed to fetch server configuration', error: error.message });
  }
});

apiRouter.post('/config/:serverId', isAuthenticated, async (req, res) => {
  try {
    const { serverId } = req.params;
    const configuration = req.body;
    
    // Find existing server or create new one
    let server = await Server.findOne({ serverId });
    
    if (server) {
      // Update existing server configuration
      server.configuration = configuration;
    } else {
      // Create new server
      server = new Server({
        serverId,
        name: configuration.serverName || 'Discord Server',
        icon: configuration.serverIcon || '',
        configuration
      });
    }
    
    // Save to database
    await server.save();
    
    res.json({
      message: 'Server configuration saved successfully',
      ...configuration
    });
  } catch (error) {
    console.error('Error saving server configuration:', error);
    res.status(500).json({ message: 'Failed to save server configuration', error: error.message });
  }
});

// User profile routes
apiRouter.get('/user/profile', isAuthenticated, async (req, res) => {
  try {
    // Get user profile from database
    const user = await User.findOne({ discordId: req.user.id });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user profile data
    res.json({
      id: user.discordId,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      profile: user.profile || {
        banner: '',
        info: '',
        customization: {}
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
});

apiRouter.put('/user/profile', isAuthenticated, async (req, res) => {
  try {
    const profileData = req.body;
    
    // Find and update user profile
    const user = await User.findOne({ discordId: req.user.id });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update profile data
    user.profile = {
      ...user.profile,
      info: profileData.info || user.profile?.info || '',
      customization: profileData.customization || user.profile?.customization || {}
    };
    
    // Save to database
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
});

apiRouter.put('/user/avatar', isAuthenticated, async (req, res) => {
  try {
    const { avatarData } = req.body;
    
    // Find and update user avatar
    const user = await User.findOne({ discordId: req.user.id });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update avatar
    user.avatar = avatarData;
    
    // Save to database
    await user.save();
    
    res.json({
      message: 'Avatar updated successfully',
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Error updating user avatar:', error);
    res.status(500).json({ message: 'Failed to update user avatar', error: error.message });
  }
});

apiRouter.get('/user/settings', isAuthenticated, async (req, res) => {
  try {
    // Get user settings from database
    const user = await User.findOne({ discordId: req.user.id });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user settings or default settings
    res.json(user.profile?.customization || {
      theme: 'dark',
      notifications: true,
      language: 'en'
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Failed to fetch user settings', error: error.message });
  }
});

apiRouter.put('/user/settings', isAuthenticated, async (req, res) => {
  try {
    const settingsData = req.body;
    
    // Find and update user settings
    const user = await User.findOne({ discordId: req.user.id });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {
        banner: '',
        info: '',
        customization: {}
      };
    }
    
    // Update settings
    user.profile.customization = {
      ...user.profile.customization,
      ...settingsData
    };
    
    // Save to database
    await user.save();
    
    res.json({
      message: 'Settings updated successfully',
      settings: user.profile.customization
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ message: 'Failed to update user settings', error: error.message });
  }
});

// Health check endpoint
apiRouter.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const isConnected = mongoose.connection.readyState === 1;
    
    res.json({
      status: 'ok',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      database: 'unknown',
      error: error.message
    });
  }
});

// Mount API router
app.use('/api', apiRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});