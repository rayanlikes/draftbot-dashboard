import React, { useState, useEffect } from 'react';
import { scrimService } from '../services/api';

const ScrimManager = ({ serverId }) => {
  const [scrims, setScrims] = useState([]);
  const [newScrim, setNewScrim] = useState({ 
    name: '', 
    time: '', 
    description: '',
    lobby_size: 20,
    vip_size: 2,
    start_slot: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingScrim, setEditingScrim] = useState(null);
  const [activeTab, setActiveTab] = useState('general'); // general, roles, channels, schedule, messages

  // Fetch scrims when component mounts or serverId changes
  useEffect(() => {
    if (!serverId) return;
    
    const fetchScrims = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await scrimService.getScrims(serverId);
        setScrims(data);
      } catch (err) {
        console.error('Failed to fetch scrims:', err);
        setError(`Failed to load scrims: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchScrims();
  }, [serverId]);

  const handleCreateScrim = async (e) => {
    e.preventDefault();
    if (!serverId) {
      alert('Please select a server first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const createdScrim = await scrimService.createScrim(serverId, newScrim);
      setScrims([...scrims, createdScrim]);
      setNewScrim({ 
        name: '', 
        time: '', 
        description: '',
        lobby_size: 20,
        vip_size: 2,
        start_slot: 1
      });
      alert('Scrim created successfully!');
    } catch (err) {
      console.error('Failed to create scrim:', err);
      setError(`Failed to create scrim: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScrim = async (e) => {
    e.preventDefault();
    if (!serverId || !editingScrim) return;

    setLoading(true);
    setError(null);
    try {
      const updatedScrim = await scrimService.updateScrim(serverId, editingScrim.id, editingScrim);
      setScrims(scrims.map(scrim => scrim.id === updatedScrim.id ? updatedScrim : scrim));
      setEditingScrim(null);
      alert('Scrim updated successfully!');
    } catch (err) {
      console.error('Failed to update scrim:', err);
      setError(`Failed to update scrim: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScrim = async (id) => {
    if (!serverId) return;
    if (!confirm('Are you sure you want to delete this scrim?')) return;

    setLoading(true);
    setError(null);
    try {
      await scrimService.deleteScrim(serverId, id);
      setScrims(scrims.filter(scrim => scrim.id !== id));
      alert('Scrim deleted successfully!');
    } catch (err) {
      console.error('Failed to delete scrim:', err);
      setError(`Failed to delete scrim: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditScrim = (scrim) => {
    setEditingScrim({...scrim});
  };

  const handleCancelEdit = () => {
    setEditingScrim(null);
  };

  const renderGeneralSettings = () => (
    <div className="scrim-settings-panel">
      <h4>General Settings</h4>
      <div className="settings-form">
        <div className="form-group">
          <label>Scrim Name:</label>
          <input 
            type="text" 
            value={editingScrim.name} 
            onChange={(e) => setEditingScrim({...editingScrim, name: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Lobby Size:</label>
          <input 
            type="number" 
            value={editingScrim.lobby_size} 
            onChange={(e) => setEditingScrim({...editingScrim, lobby_size: parseInt(e.target.value)})}
            min="1"
            max="100"
          />
        </div>
        <div className="form-group">
          <label>VIP Size:</label>
          <input 
            type="number" 
            value={editingScrim.vip_size} 
            onChange={(e) => setEditingScrim({...editingScrim, vip_size: parseInt(e.target.value)})}
            min="0"
            max="20"
          />
        </div>
        <div className="form-group">
          <label>Start Slot:</label>
          <input 
            type="number" 
            value={editingScrim.start_slot} 
            onChange={(e) => setEditingScrim({...editingScrim, start_slot: parseInt(e.target.value)})}
            min="1"
            max="100"
          />
        </div>
      </div>
    </div>
  );

  const renderRolesSettings = () => (
    <div className="scrim-settings-panel">
      <h4>Roles Configuration</h4>
      <div className="settings-form">
        <div className="form-group">
          <label>Registration Role ID:</label>
          <input 
            type="text" 
            value={editingScrim.roles?.registration || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              roles: {...(editingScrim.roles || {}), registration: e.target.value}
            })}
            placeholder="Discord Role ID"
          />
        </div>
        <div className="form-group">
          <label>Waitlist Role ID:</label>
          <input 
            type="text" 
            value={editingScrim.roles?.waitlist || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              roles: {...(editingScrim.roles || {}), waitlist: e.target.value}
            })}
            placeholder="Discord Role ID"
          />
        </div>
        <div className="form-group">
          <label>Code Role ID:</label>
          <input 
            type="text" 
            value={editingScrim.roles?.code || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              roles: {...(editingScrim.roles || {}), code: e.target.value}
            })}
            placeholder="Discord Role ID"
          />
        </div>
        <div className="form-group">
          <label>Ban Role ID:</label>
          <input 
            type="text" 
            value={editingScrim.roles?.ban || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              roles: {...(editingScrim.roles || {}), ban: e.target.value}
            })}
            placeholder="Discord Role ID"
          />
        </div>
      </div>
    </div>
  );

  const renderChannelsSettings = () => (
    <div className="scrim-settings-panel">
      <h4>Channels Configuration</h4>
      <div className="settings-form">
        <div className="form-group">
          <label>Notification Channel ID:</label>
          <input 
            type="text" 
            value={editingScrim.channels?.notification || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              channels: {...(editingScrim.channels || {}), notification: e.target.value}
            })}
            placeholder="Discord Channel ID"
          />
        </div>
        <div className="form-group">
          <label>Registration Channel ID:</label>
          <input 
            type="text" 
            value={editingScrim.channels?.registration || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              channels: {...(editingScrim.channels || {}), registration: e.target.value}
            })}
            placeholder="Discord Channel ID"
          />
        </div>
        <div className="form-group">
          <label>Slots Channel ID:</label>
          <input 
            type="text" 
            value={editingScrim.channels?.slots || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              channels: {...(editingScrim.channels || {}), slots: e.target.value}
            })}
            placeholder="Discord Channel ID"
          />
        </div>
        <div className="form-group">
          <label>Waitlist Channel ID:</label>
          <input 
            type="text" 
            value={editingScrim.channels?.waitlist || ''} 
            onChange={(e) => setEditingScrim({
              ...editingScrim, 
              channels: {...(editingScrim.channels || {}), waitlist: e.target.value}
            })}
            placeholder="Discord Channel ID"
          />
        </div>
      </div>
    </div>
  );

  return (
    <section className="scrim-manager">
      <h3>Scrim Management</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      {!editingScrim ? (
        <>
          <form onSubmit={handleCreateScrim} className="create-scrim-form">
            <h4>Create New Scrim</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newScrim.name}
                  onChange={(e) => setNewScrim({ ...newScrim, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input
                  type="datetime-local"
                  value={newScrim.time}
                  onChange={(e) => setNewScrim({ ...newScrim, time: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Lobby Size:</label>
                <input
                  type="number"
                  value={newScrim.lobby_size}
                  onChange={(e) => setNewScrim({ ...newScrim, lobby_size: parseInt(e.target.value) })}
                  min="1"
                  max="100"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>VIP Size:</label>
                <input
                  type="number"
                  value={newScrim.vip_size}
                  onChange={(e) => setNewScrim({ ...newScrim, vip_size: parseInt(e.target.value) })}
                  min="0"
                  max="20"
                  disabled={loading}
                />
              </div>
              <div className="form-group full-width">
                <label>Description:</label>
                <textarea
                  value={newScrim.description}
                  onChange={(e) => setNewScrim({ ...newScrim, description: e.target.value })}
                  disabled={loading}
                  rows="3"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? 'Creating...' : 'Create Scrim'}
            </button>
          </form>

          <div className="scrims-list">
            <h4>Existing Scrims</h4>
            {loading && <p>Loading scrims...</p>}
            {!loading && scrims.length === 0 ? (
              <p>No scrims configured. Create your first scrim above.</p>
            ) : (
              <div className="scrim-cards">
                {scrims.map((scrim) => (
                  <div key={scrim.id} className="scrim-card">
                    <div className="scrim-card-header">
                      <h5>{scrim.name}</h5>
                      <span className={`status-badge ${scrim.enabled ? 'enabled' : 'disabled'}`}>
                        {scrim.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="scrim-card-body">
                      <p><strong>Lobby Size:</strong> {scrim.lobby_size}</p>
                      <p><strong>VIP Slots:</strong> {scrim.vip_size}</p>
                      {scrim.time && <p><strong>Time:</strong> {new Date(scrim.time).toLocaleString()}</p>}
                      {scrim.description && <p><strong>Description:</strong> {scrim.description}</p>}
                    </div>
                    <div className="scrim-card-actions">
                      <button onClick={() => handleEditScrim(scrim)} className="edit-button">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteScrim(scrim.id)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="edit-scrim-panel">
          <div className="panel-header">
            <h4>Edit Scrim: {editingScrim.name}</h4>
            <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
          </div>
          
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button 
              className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => setActiveTab('roles')}
            >
              Roles
            </button>
            <button 
              className={`tab-button ${activeTab === 'channels' ? 'active' : ''}`}
              onClick={() => setActiveTab('channels')}
            >
              Channels
            </button>
          </div>
          
          <form onSubmit={handleUpdateScrim}>
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'roles' && renderRolesSettings()}
            {activeTab === 'channels' && renderChannelsSettings()}
            
            <div className="form-actions">
              <button type="submit" disabled={loading} className="primary-button">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <style jsx>{`
        .scrim-manager {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .error-message {
          color: red;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #ffeeee;
          border: 1px solid #ffcccc;
          border-radius: 4px;
        }
        
        .create-scrim-form {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-group {
          margin-bottom: 10px;
        }
        
        .full-width {
          grid-column: span 2;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .primary-button {
          background-color: #7289da;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .primary-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .scrim-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        
        .scrim-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .scrim-card-header {
          background-color: #2c2f33;
          color: white;
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .scrim-card-header h5 {
          margin: 0;
          font-size: 16px;
        }
        
        .status-badge {
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 12px;
        }
        
        .status-badge.enabled {
          background-color: #43b581;
        }
        
        .status-badge.disabled {
          background-color: #f04747;
        }
        
        .scrim-card-body {
          padding: 15px;
        }
        
        .scrim-card-body p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .scrim-card-actions {
          display: flex;
          border-top: 1px solid #eee;
        }
        
        .scrim-card-actions button {
          flex: 1;
          padding: 10px;
          border: none;
          background-color: #f5f5f5;
          cursor: pointer;
        }
        
        .edit-button:hover {
          background-color: #7289da;
          color: white;
        }
        
        .delete-button:hover {
          background-color: #f04747;
          color: white;
        }
        
        .edit-scrim-panel {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .cancel-button {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }
        
        .tab-button {
          padding: 10px 15px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          margin-right: 10px;
        }
        
        .tab-button.active {
          border-bottom-color: #7289da;
          font-weight: bold;
        }
        
        .scrim-settings-panel {
          margin-bottom: 20px;
        }
        
        .settings-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .form-actions {
          margin-top: 20px;
          text-align: right;
        }
      `}</style>
    </section>
  );
};

export default ScrimManager;