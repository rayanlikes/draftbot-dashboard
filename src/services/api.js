// API service for backend communication

// Use environment variables in production, fallback for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// MongoDB connection status
let isConnected = false;

/**
 * Check database connection status
 * @returns {Promise<boolean>} Connection status
 */
export const checkDatabaseConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      credentials: 'include',
    });
    const data = await response.json();
    isConnected = data.database === 'connected';
    return isConnected;
  } catch (error) {
    console.error('Database connection check failed:', error);
    isConnected = false;
    return false;
  }
};

/**
 * Get current database connection status without making a new request
 * @returns {boolean} Current connection status
 */
export const getDatabaseStatus = () => {
  return isConnected;
};

/**
 * Helper function for handling API responses
 * @param {Response} response - Fetch API response object
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} If response is not OK
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

/**
 * Generic error handler for API requests
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 * @returns {Object} Standardized error object
 */
const handleApiError = (error, context) => {
  console.error(`API Error (${context}):`, error);
  return {
    success: false,
    error: error.message || 'Unknown error occurred',
    context
  };
};

// Auth services
export const authService = {
  login: async (code) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/discord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'auth.login');
    }
  },
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'auth.logout');
    }
  },
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'auth.getProfile');
    }
  },
  getServers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/servers`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'auth.getServers');
    }
  },
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'auth.updateProfile');
    }
  },
  updatePreferences: async (preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'auth.updatePreferences');
    }
  }
};

// Visual template services - Defined here first
export const visualService = {
  getSlotTemplates: async (serverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/visual/${serverId}/slots`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'visual.getSlotTemplates');
    }
  },
  saveSlotTemplate: async (serverId, templateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/visual/${serverId}/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'visual.saveSlotTemplate');
    }
  },
  getLeaderboardTemplates: async (serverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/visual/${serverId}/leaderboard`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'visual.getLeaderboardTemplates');
    }
  },
  saveLeaderboardTemplate: async (serverId, templateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/visual/${serverId}/leaderboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'visual.saveLeaderboardTemplate');
    }
  }
}; // Added missing closing brace here

// Server configuration services
export const configService = {
  getConfig: async (serverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/config/${serverId}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'config.getConfig');
    }
  },
  saveConfig: async (serverId, configData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/config/${serverId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'config.saveConfig');
    }
  }
};

// Scrim management services
export const scrimService = {
  getScrims: async (serverId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scrims/${serverId}`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'scrim.getScrims');
    }
  },
  createScrim: async (serverId, scrimData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scrims/${serverId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scrimData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'scrim.createScrim');
    }
  },
  updateScrim: async (serverId, scrimId, scrimData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scrims/${serverId}/${scrimId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scrimData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'scrim.updateScrim');
    }
  },
  deleteScrim: async (serverId, scrimId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/scrims/${serverId}/${scrimId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'scrim.deleteScrim');
    }
  }
};

// User profile services
export const userProfileService = {
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.getProfile');
    }
  },
  updateProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.updateProfile');
    }
  },
  updateAvatar: async (avatarData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/avatar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avatarData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.updateAvatar');
    }
  },
  getSettings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/settings`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.getSettings');
    }
  },
  updateSettings: async (settingsData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.updateSettings');
    }
  },
  // Profile Store Services
  getStoreItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/store/items`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.getStoreItems');
    }
  },
  purchaseItem: async (purchaseData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/store/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.purchaseItem');
    }
  },
  activateItem: async (activateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/store/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activateData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.activateItem');
    }
  },
  getUserInventory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/inventory`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'userProfile.getUserInventory');
    }
  }
};

// Additional visual template services methods
Object.assign(visualService, {
  // Canvas-based visual editor endpoints
  saveCanvasTemplate: async (serverId, type, templateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/visual/${serverId}/${type}/canvas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'visual.saveCanvasTemplate');
    }
  },
  getCanvasTemplate: async (serverId, type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/visual/${serverId}/${type}/canvas`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error, 'visual.getCanvasTemplate');
    }
  }
});