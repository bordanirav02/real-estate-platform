import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import API from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/users/${user._id}/favorites`);
        setFavorites(response.data.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await API.delete(`/users/${user._id}/favorites/${propertyId}`);
      setFavorites(favorites.filter(fav => fav._id !== propertyId));
      alert('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  return (
    <div className="dashboard-page-new">
      <Navbar />
      
      <div className="dashboard-hero">
        <div className="container">
          <div className="hero-content-dash">
            <div className="user-welcome">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1>Welcome back, {user?.name}! 👋</h1>
                <p>Manage your properties and preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {/* Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              ❤️ Favorites ({favorites.length})
            </button>
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-grid">
                <div className="info-card">
                  <div className="card-icon">👤</div>
                  <h3>Profile Information</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="label">Name:</span>
                      <span className="value">{user?.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email:</span>
                      <span className="value">{user?.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{user?.phone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Role:</span>
                      <span className="role-badge">{user?.role}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-icon">📊</div>
                  <h3>Your Activity</h3>
                  <div className="stats-mini">
                    <div className="stat-mini">
                      <div className="stat-mini-number">{favorites.length}</div>
                      <div className="stat-mini-label">Saved Properties</div>
                    </div>
                    <div className="stat-mini">
                      <div className="stat-mini-number">0</div>
                      <div className="stat-mini-label">Scheduled Visits</div>
                    </div>
                    <div className="stat-mini">
                      <div className="stat-mini-number">0</div>
                      <div className="stat-mini-label">Messages</div>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-icon">⚡</div>
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    <Link to="/properties" className="action-btn">
                      <span>🔍</span> Browse Properties
                    </Link>
                    <Link to="/properties" className="action-btn">
                      <span>📅</span> Schedule Visit
                    </Link>
                    <button className="action-btn">
                      <span>💬</span> Contact Agent
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="favorites-content">
                <div className="favorites-header">
                  <h2>Your Saved Properties</h2>
                  <p>Properties you've marked as favorites</p>
                </div>

                {loading ? (
                  <div className="loading">
                    <div className="loader"></div>
                    <p>Loading your favorites...</p>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="empty-favorites">
                    <div className="empty-icon">💔</div>
                    <h3>No Favorites Yet</h3>
                    <p>Start exploring and save properties you love!</p>
                    <Link to="/properties" className="btn-browse">
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  <div className="favorites-grid">
                    {favorites.map((property) => (
                      <div key={property._id} className="favorite-item">
                        <PropertyCard property={property} />
                        <button 
                          className="btn-remove-favorite"
                          onClick={() => handleRemoveFavorite(property._id)}
                        >
                          Remove from Favorites
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="profile-content">
                <div className="profile-card">
                  <h2>Profile Settings</h2>
                  <div className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" value={user?.name} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" value={user?.email} readOnly />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" value={user?.phone || 'Not provided'} readOnly />
                    </div>
                    <div className="coming-soon-badge">
                      Profile editing coming soon! 🚀
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;