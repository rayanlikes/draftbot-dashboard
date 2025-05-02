import React, { useState, useEffect } from 'react';
import { configService } from '../services/api';

const RoleChannelConfig = ({ serverId }) => {
  const [config, setConfig] = useState({
    adminRole: '',
    modRole: '',
    logChannel: '',
    welcomeChannel: '',
    registrationChannel: '',
    resultsChannel: '',
    notificationChannel: '',
    banChannel: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch configuration when component mounts or serverId changes
  useEffect(() => {
    if (!serverId) return;
    
    const fetchConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await configService.getConfig(serverId);
        setConfig(data);
      } catch (err) {
        console.error('Failed to fetch configuration:', err);
        setError(`Failed to load configuration: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [serverId]);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
    // Clear success message when user makes changes
    if (success) setSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!serverId) {
      alert('Please select a server first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await configService.saveConfig(serverId, config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000); // Clear success message after 5 seconds
    } catch (err) {
      console.error('Failed to save configuration:', err);
      setError(`Failed to save configuration: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="role-channel-config">
      <h3>Role & Channel Configuration</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Configuration saved successfully!</div>}
      
      <form onSubmit={handleSave}>
        <div className="config-grid">
          <div className="config-section">
            <h4>Role Configuration</h4>
            <div className="form-group">
              <label htmlFor="adminRole">Admin Role ID:</label>
              <input
                id="adminRole"
                type="text"
                name="adminRole"
                value={config.adminRole}
                onChange={handleChange}
                placeholder="Enter Role ID"
                disabled={loading}
              />
              <small>Users with this role can access all admin features</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="modRole">Moderator Role ID:</label>
              <input
                id="modRole"
                type="text"
                name="modRole"
                value={config.modRole}
                onChange={handleChange}
                placeholder="Enter Role ID"
                disabled={loading}
              />
              <small>Users with this role can moderate but have limited admin access</small>
            </div>
          </div>
          
          <div className="config-section">
            <h4>Channel Configuration</h4>
            <div className="form-group">
              <label htmlFor="logChannel">Log Channel ID:</label>
              <input
                id="logChannel"
                type="text"
                name="logChannel"
                value={config.logChannel}
                onChange={handleChange}
                placeholder="Enter Channel ID"
                disabled={loading}
              />
              <small>Channel where bot logs will be sent</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="welcomeChannel">Welcome Channel ID:</label>
              <input
                id="welcomeChannel"
                type="text"
                name="welcomeChannel"
                value={config.welcomeChannel}
                onChange={handleChange}
                placeholder="Enter Channel ID"
                disabled={loading}
              />
              <small>Channel for welcome messages</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="registrationChannel">Registration Channel ID:</label>
              <input
                id="registrationChannel"
                type="text"
                name="registrationChannel"
                value={config.registrationChannel}
                onChange={handleChange}
                placeholder="Enter Channel ID"
                disabled={loading}
              />
              <small>Default channel for scrim registrations</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="resultsChannel">Results Channel ID:</label>
              <input
                id="resultsChannel"
                type="text"
                name="resultsChannel"
                value={config.resultsChannel}
                onChange={handleChange}
                placeholder="Enter Channel ID"
                disabled={loading}
              />
              <small>Channel where scrim results will be posted</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="notificationChannel">Notification Channel ID:</label>
              <input
                id="notificationChannel"
                type="text"
                name="notificationChannel"
                value={config.notificationChannel}
                onChange={handleChange}
                placeholder="Enter Channel ID"
                disabled={loading}
              />
              <small>Channel for scrim notifications</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="banChannel">Ban Channel ID:</label>
              <input
                id="banChannel"
                type="text"
                name="banChannel"
                value={config.banChannel}
                onChange={handleChange}
                placeholder="Enter Channel ID"
                disabled={loading}
              />
              <small>Channel for ban notifications</small>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={loading} className="save-button">
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
      
      <style jsx>{`
        .role-channel-config {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .error-message {
          color: #f04747;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
        
        .success-message {
          color: #43b581;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #e6ffec;
          border: 1px solid #b4e6c4;
          border-radius: 4px;
        }
        
        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .config-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .config-section {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #7289da;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        
        small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }
        
        .form-actions {
          margin-top: 20px;
          text-align: right;
        }
        
        .save-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }
        
        .save-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default RoleChannelConfig;