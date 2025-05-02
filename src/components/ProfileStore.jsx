import React, { useState, useEffect } from 'react';
import { userProfileService } from '../services/api';

const ProfileStore = ({ userId }) => {
  const [storeItems, setStoreItems] = useState({
    banners: [
      { id: 'banner1', name: 'Premium Banner', price: 500, imageUrl: 'https://via.placeholder.com/728x90.png?text=Premium+Banner', description: 'A sleek premium banner for your profile' },
      { id: 'banner2', name: 'Gold Banner', price: 1000, imageUrl: 'https://via.placeholder.com/728x90.png?text=Gold+Banner', description: 'Show off your status with this gold banner' },
      { id: 'banner3', name: 'Diamond Banner', price: 2000, imageUrl: 'https://via.placeholder.com/728x90.png?text=Diamond+Banner', description: 'The ultimate banner for true champions' }
    ],
    tags: [
      { id: 'tag1', name: 'Pro Player', price: 300, color: '#ff5722', description: 'Mark yourself as a professional player' },
      { id: 'tag2', name: 'Team Captain', price: 500, color: '#2196f3', description: 'Show that you lead your team to victory' },
      { id: 'tag3', name: 'Tournament Winner', price: 800, color: '#ffc107', description: 'Display your tournament achievements' }
    ]
  });
  
  const [userProfile, setUserProfile] = useState({
    coins: 1000,
    inventory: [],
    activeBanner: null,
    activeTags: []
  });
  
  const [activeTab, setActiveTab] = useState('banners');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile data and store items
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile
        const profileData = await userProfileService.getProfile();
        if (profileData.success) {
          // Initialize with default values if properties don't exist
          setUserProfile({
            coins: profileData.profile.coins || 1000,
            inventory: profileData.profile.inventory || [],
            activeBanner: profileData.profile.activeBanner || null,
            activeTags: profileData.profile.activeTags || []
          });
        } else {
          throw new Error(profileData.error || 'Failed to load profile');
        }
        
        // Fetch store items
        const storeData = await userProfileService.getStoreItems();
        if (storeData.success && storeData.items) {
          setStoreItems(storeData.items);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Purchase an item
  const handlePurchase = async (item, type) => {
    if (userProfile.coins < item.price) {
      setError('Not enough coins to purchase this item');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const purchaseData = {
        itemId: item.id,
        itemType: type,
        price: item.price
      };
      
      // Call the API service to purchase the item
      const response = await userProfileService.purchaseItem(purchaseData);
      
      if (response.success) {
        // Update local state with the response data
        const newInventory = [...userProfile.inventory, { ...item, type }];
        const newCoins = response.newCoins || (userProfile.coins - item.price);
        
        setUserProfile({
          ...userProfile,
          coins: newCoins,
          inventory: newInventory
        });
        
        setSuccessMessage(`Successfully purchased ${item.name}!`);
      } else {
        throw new Error(response.error || 'Failed to purchase item');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to purchase item:', err);
      setError(`Purchase failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Activate an item
  const handleActivate = async (item, type) => {
    setLoading(true);
    setError(null);
    try {
      // Determine if we're activating or deactivating
      const isCurrentlyActive = isItemActive(item.id, type);
      
      // Prepare data for API call
      const activateData = {
        itemId: item.id,
        itemType: type,
        active: !isCurrentlyActive // Toggle the active state
      };
      
      // Call the API service to activate/deactivate the item
      const response = await userProfileService.activateItem(activateData);
      
      if (response.success) {
        // Update local state based on the response
        if (type === 'banner') {
          setUserProfile({
            ...userProfile,
            activeBanner: isCurrentlyActive ? null : item.id // Toggle banner
          });
        } else if (type === 'tag') {
          // Allow multiple tags
          const newActiveTags = isCurrentlyActive
            ? userProfile.activeTags.filter(id => id !== item.id) // Remove if already active
            : [...userProfile.activeTags, item.id]; // Add if not active
          
          setUserProfile({
            ...userProfile,
            activeTags: newActiveTags
          });
        }
        
        setSuccessMessage(`Successfully ${isCurrentlyActive ? 'deactivated' : 'activated'} ${item.name}!`);
      } else {
        throw new Error(response.error || 'Failed to update item status');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to activate item:', err);
      setError(`Activation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if user owns an item
  const ownsItem = (itemId) => {
    return userProfile.inventory.some(item => item.id === itemId);
  };

  // Check if an item is active
  const isItemActive = (itemId, type) => {
    if (type === 'banner') {
      return userProfile.activeBanner === itemId;
    } else if (type === 'tag') {
      return userProfile.activeTags.includes(itemId);
    }
    return false;
  };

  return (
    <section className="profile-store">
      <h2>Profile Store</h2>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="store-header">
        <div className="user-coins">
          <span className="coin-icon">🪙</span>
          <span className="coin-amount">{userProfile.coins}</span>
        </div>
        
        <div className="store-tabs">
          <button 
            className={`tab-button ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            Banners
          </button>
          <button 
            className={`tab-button ${activeTab === 'tags' ? 'active' : ''}`}
            onClick={() => setActiveTab('tags')}
          >
            Tags
          </button>
          <button 
            className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            My Items
          </button>
        </div>
      </div>
      
      <div className="store-content">
        {activeTab === 'banners' && (
          <div className="item-grid">
            {storeItems.banners.map(banner => (
              <div key={banner.id} className="store-item">
                <img src={banner.imageUrl} alt={banner.name} className="item-image" />
                <h3>{banner.name}</h3>
                <p>{banner.description}</p>
                <div className="item-price">
                  <span className="coin-icon">🪙</span>
                  <span>{banner.price}</span>
                </div>
                {ownsItem(banner.id) ? (
                  <button 
                    className={`activate-button ${isItemActive(banner.id, 'banner') ? 'active' : ''}`}
                    onClick={() => handleActivate(banner, 'banner')}
                    disabled={loading}
                  >
                    {isItemActive(banner.id, 'banner') ? 'Active' : 'Activate'}
                  </button>
                ) : (
                  <button 
                    className="purchase-button"
                    onClick={() => handlePurchase(banner, 'banner')}
                    disabled={loading || userProfile.coins < banner.price}
                  >
                    Purchase
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'tags' && (
          <div className="item-grid">
            {storeItems.tags.map(tag => (
              <div key={tag.id} className="store-item">
                <div 
                  className="tag-preview"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </div>
                <h3>{tag.name}</h3>
                <p>{tag.description}</p>
                <div className="item-price">
                  <span className="coin-icon">🪙</span>
                  <span>{tag.price}</span>
                </div>
                {ownsItem(tag.id) ? (
                  <button 
                    className={`activate-button ${isItemActive(tag.id, 'tag') ? 'active' : ''}`}
                    onClick={() => handleActivate(tag, 'tag')}
                    disabled={loading}
                  >
                    {isItemActive(tag.id, 'tag') ? 'Active' : 'Activate'}
                  </button>
                ) : (
                  <button 
                    className="purchase-button"
                    onClick={() => handlePurchase(tag, 'tag')}
                    disabled={loading || userProfile.coins < tag.price}
                  >
                    Purchase
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div className="inventory-section">
            {userProfile.inventory.length === 0 ? (
              <p className="empty-inventory">You don't have any items yet. Purchase some from the store!</p>
            ) : (
              <div className="item-grid">
                {userProfile.inventory.map(item => (
                  <div key={item.id} className="inventory-item">
                    {item.type === 'banner' ? (
                      <img src={item.imageUrl} alt={item.name} className="item-image" />
                    ) : (
                      <div 
                        className="tag-preview"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.name}
                      </div>
                    )}
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <button 
                      className={`activate-button ${isItemActive(item.id, item.type) ? 'active' : ''}`}
                      onClick={() => handleActivate(item, item.type)}
                      disabled={loading}
                    >
                      {isItemActive(item.id, item.type) ? 'Active' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .profile-store {
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .store-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .user-coins {
          display: flex;
          align-items: center;
          font-size: 1.2rem;
          font-weight: bold;
          background-color: #fff;
          padding: 8px 15px;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .coin-icon {
          margin-right: 5px;
        }
        
        .store-tabs {
          display: flex;
          gap: 10px;
        }
        
        .tab-button {
          padding: 8px 15px;
          border: none;
          border-radius: 20px;
          background-color: #e0e0e0;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }
        
        .tab-button.active {
          background-color: #7289da;
          color: white;
        }
        
        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .store-item, .inventory-item {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        
        .item-image {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .tag-preview {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .item-price {
          display: flex;
          align-items: center;
          margin: 10px 0;
          font-weight: bold;
        }
        
        .purchase-button, .activate-button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-top: auto;
          transition: all 0.2s;
        }
        
        .purchase-button {
          background-color: #7289da;
          color: white;
        }
        
        .purchase-button:disabled {
          background-color: #a5b1e3;
          cursor: not-allowed;
        }
        
        .activate-button {
          background-color: #e0e0e0;
          color: #333;
        }
        
        .activate-button.active {
          background-color: #4caf50;
          color: white;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .empty-inventory {
          text-align: center;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
};

export default ProfileStore;