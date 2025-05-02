# DraftBot Dashboard

A web dashboard for managing Discord bot scrims and tournaments. This dashboard provides an interface for users to manage their Discord servers, configure scrim settings, and customize visual elements.

## Features

- Discord OAuth2 integration for secure login
- Server management for administrators
- Scrim configuration and scheduling
- Visual editor for customizing slots and leaderboards
- Role and channel configuration
- User profile management
- MongoDB integration for persistent data storage

## Project Structure

- `src/` - Frontend React application
- `server/` - Backend Express API
  - `models/` - MongoDB database models
  - `db.js` - Database connection module
- `public/` - Static assets

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Discord application with OAuth2 credentials

### Environment Configuration

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Set up OAuth2 with the following redirect URL: `http://localhost:5000/api/auth/discord/callback`
3. Configure the `.env` file in the project root with your Discord credentials and MongoDB connection:

```
# Server Configuration
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-session-secret
MONGODB_URI=mongodb://localhost:27017/draftbot

# Discord OAuth Configuration
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_CALLBACK_URL=http://localhost:5000/api/auth/discord/callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

4. Configure the frontend environment in `.env.local`:

5. For production deployment, update the `.env.production` file with your production values.

```
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
# Start the frontend
npm run dev

# Start the backend (in a separate terminal)
node server/index.js
```

3. Access the dashboard at http://localhost:5173

## Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Build the application:

```bash
npm run build
```

3. Deploy the backend:

```bash
node server/index.js
```

### Frontend Deployment

1. Update the `.env.production` file with your production API URL:

```
VITE_API_URL=https://your-api-domain.com/api
```

2. Build the frontend:

```bash
npm run build
```

3. Deploy the `dist` directory to your hosting service (Netlify, Vercel, GitHub Pages, etc.)

## GitHub Pages Deployment

To deploy to GitHub Pages:

1. Ensure your `vite.config.js` has the correct base path:

```js
export default {
  base: '/draftbot-dashboard/',
}
```

2. Update `.env.production` with your production API URL:

```
VITE_API_URL=https://your-production-api-url.com/api
```

3. Add a deployment script to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

4. Install the gh-pages package:

```bash
npm install --save-dev gh-pages
```

5. Run the deployment:

```bash
npm run deploy
```

Your site will be available at `https://your-github-username.github.io/draftbot-dashboard/`.

For backend deployment, use a service like Heroku, Vercel, or another cloud provider, as GitHub Pages only supports static sites.

## Connecting to the Discord Bot

This dashboard is designed to work with a Discord bot that manages scrims and tournaments. To connect your bot:

1. Ensure your bot has the necessary permissions in the Discord servers
2. Configure the bot to use the same database as the dashboard
3. Update the API endpoints in the bot code to match the dashboard API

## License

MIT
