import { useState, useEffect } from 'react'

import './App.css'
import UserStats from "./components/UserStats";
import AdRewards from "./components/AdRewards";
import DailyReward from "./components/DailyReward";
import Leaderboard from "./components/Leaderboard";
import ProfileView from './components/ProfileView';
import ProfileEditor from './components/ProfileEditor';
import ProfileStore from './components/ProfileStore';
import AdminDashboard from './components/AdminDashboard';
import VisualEditor from './components/VisualEditor';
import CanvasVisualEditor from './components/CanvasVisualEditor';
import ScrimManager from './components/ScrimManager';
import RoleChannelConfig from './components/RoleChannelConfig';
import { authService } from './services/api';

function App() {
  const [userProfile, setUserProfile] = useState({
    username: "User123",
    avatar: "https://via.placeholder.com/100x100.png?text=Avatar",
    banner: "https://via.placeholder.com/728x90.png?text=Banner",
    info: "This is a sample user profile."
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [servers, setServers] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authService.getProfile();
        setUserProfile({
          username: userData.username,
          avatar: userData.avatar || "https://via.placeholder.com/100x100.png?text=Avatar",
          banner: userData.banner || "https://via.placeholder.com/728x90.png?text=Banner",
          info: userData.info || "No information provided."
        });
        setIsLoggedIn(true);
        
        // Fetch user's servers
        const serversData = await authService.getServers();
        setServers(serversData);
        
        // Set first server as selected if available
        if (serversData && serversData.length > 0) {
          setSelectedServer(serversData[0]);
          setIsAdmin(serversData[0].isAdmin);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle login from Discord OAuth

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUserProfile({
        username: "User123",
        avatar: "https://via.placeholder.com/100x100.png?text=Avatar",
        banner: "https://via.placeholder.com/728x90.png?text=Banner",
        info: "This is a sample user profile."
      });
      setIsLoggedIn(false);
      setServers([]);
      setSelectedServer(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleServerSelect = (server) => {
    setSelectedServer(server);
    setIsAdmin(server.isAdmin);
  };

  const handleProfileSave = async (updatedProfile) => {
    setUserProfile(updatedProfile);
    // In a real implementation, this would save to the backend
    alert("Profile updated successfully!");
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  const renderContent = () => {
    if (!selectedServer && isLoggedIn) {
      return (
        <div className="no-server-selected">
          <h2>No Server Selected</h2>
          <p>Please select a server from the list to manage it.</p>
          {servers.length === 0 && (
            <div className="server-warning">
              <h3>No Servers Available</h3>
              <p>You don't have any servers with the bot installed.</p>
              <p>Please add the bot to your Discord server first.</p>
              <a href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands" 
                 className="add-bot-button" target="_blank" rel="noopener noreferrer">
                Add Bot to Server
              </a>
            </div>
          )}
        </div>
      );
    }

    switch (activeSection) {
      case 'profile':
        return (
          <div className="section-container">
            <ProfileView profile={userProfile} />
            <ProfileEditor profile={userProfile} onSave={handleProfileSave} />
          </div>
        );
      case 'store':
        return <ProfileStore userId={userProfile.username} />; // Using username as ID until proper user ID is implemented
      case 'stats':
        return <UserStats serverId={selectedServer?.id} />;
      case 'rewards':
        return (
          <div className="section-container">
            <DailyReward />
            <AdRewards />
          </div>
        );
      case 'leaderboard':
        return <Leaderboard serverId={selectedServer?.id} />;
      case 'admin':
        if (!isAdmin) {
          // Redirect to profile section if not admin
          setActiveSection('profile');
          return null;
        }
        return (
          <AdminDashboard>
            <div className="admin-tabs">
              <button 
                className={activeSection === 'admin-scrims' ? 'active' : ''}
                onClick={() => setActiveSection('admin-scrims')}
              >
                Scrim Manager
              </button>
              <button 
                className={activeSection === 'admin-visual-slots' ? 'active' : ''}
                onClick={() => setActiveSection('admin-visual-slots')}
              >
                Slots Editor
              </button>
              <button 
                className={activeSection === 'admin-visual-leaderboard' ? 'active' : ''}
                onClick={() => setActiveSection('admin-visual-leaderboard')}
              >
                Leaderboard Editor
              </button>
              <button 
                className={activeSection === 'admin-config' ? 'active' : ''}
                onClick={() => setActiveSection('admin-config')}
              >
                Server Config
              </button>
            </div>
          </AdminDashboard>
        );
      case 'admin-scrims':
        return <ScrimManager serverId={selectedServer?.id} />;
      case 'admin-visual-slots':
        return <CanvasVisualEditor type="slots" serverId={selectedServer?.id} />;
      case 'admin-visual-leaderboard':
        return <CanvasVisualEditor type="leaderboard" serverId={selectedServer?.id} />;
      case 'admin-config':
        return <RoleChannelConfig serverId={selectedServer?.id} />;
      default:
        return <ProfileView profile={userProfile} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {/* Navigation Menu */}
        <nav className="main-nav">
          <ul>
            <li><a href="#profile" onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>Profile</a></li>
            <li><a href="#store" onClick={() => setActiveSection('store')} className={activeSection === 'store' ? 'active' : ''}>Store</a></li>
            <li><a href="#stats" onClick={() => setActiveSection('stats')} className={activeSection === 'stats' ? 'active' : ''}>Stats</a></li>
            <li><a href="#rewards" onClick={() => setActiveSection('rewards')} className={activeSection === 'rewards' ? 'active' : ''}>Rewards</a></li>
            <li><a href="#leaderboard" onClick={() => setActiveSection('leaderboard')} className={activeSection === 'leaderboard' ? 'active' : ''}>Leaderboard</a></li>
            {isAdmin && <li><a href="#admin" onClick={() => setActiveSection('admin')} className={activeSection.startsWith('admin') ? 'active' : ''}>Admin Panel</a></li>}
          </ul>
          <div className="auth-section">
            {!isLoggedIn ? (
              <button className="discord-login" onClick={() => window.location.href = '/api/auth/discord'}>
                <img src="https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@main/icons/discord.svg" alt="Discord" style={{width:20,verticalAlign:'middle',marginRight:8}} />
                Login with Discord
              </button>
            ) : (
              <>
                <span>Welcome, {userProfile.username}!</span>
                <button onClick={handleLogout} style={{marginLeft:8}}>Logout</button>
              </>
            )}
          </div>
        </nav>

        <h1>DraftBot Dashboard</h1>

        {/* Server List after login */}
        {isLoggedIn && (
          <section className="server-list">
            <h3>Your Servers</h3>
            <ul>
              {servers.map(server => (
                <li key={server.id} style={{fontWeight: server.isAdmin ? 'bold' : 'normal'}}>
                  <button
                    style={{background: selectedServer && selectedServer.id === server.id ? '#7289da' : '#eee', color: server.isAdmin ? '#222' : '#444', border: 'none', padding: '6px 12px', margin: '2px', borderRadius: '4px', cursor: 'pointer'}}
                    onClick={() => handleServerSelect(server)}
                  >
                    {server.name} {server.isAdmin && <span style={{color:'#7289da'}}>(Admin)</span>}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Main Content Area */}
        <main className="main-content">
          {renderContent()}
        </main>

        <style jsx>{`
          .loading-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 1.5rem;
            color: #7289da;
          }
          
          .no-server-selected {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 80vh;
            text-align: center;
            padding: 0 20px;
          }
          
          .server-warning {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            max-width: 500px;
          }
          
          .add-bot-button {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #7289da;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            transition: background-color 0.2s;
          }
          
          .add-bot-button:hover {
            background-color: #5e77d4;
          }
          
          .main-content {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-top: 20px;
          }
          
          .section-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .admin-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          
          .admin-tabs button {
            padding: 8px 16px;
            background-color: #f5f5f5;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .admin-tabs button.active {
            background-color: #7289da;
            color: white;
          }
          
          .main-nav ul li a.active {
            font-weight: bold;
            color: #7289da;
          }
        `}</style>
      </div>
    </ErrorBoundary>
  );
}

export default App


// ErrorBoundary component to catch errors in child components
import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#b71c1c', background: '#fff3f3' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
