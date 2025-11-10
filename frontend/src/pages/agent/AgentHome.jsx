import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../services/api';
import './AgentHome.css';

const AgentHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myProperties: 0,
    pendingApproval: 0,
    totalViews: 0,
    activeChats: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchAgentStats();
    }
  }, [user]);

  const fetchAgentStats = async () => {
    try {
      setLoading(true);
      
      // Fetch agent's properties
      const propertiesRes = await API.get(`/properties/agent/${user._id}`);
      const myProps = propertiesRes.data.data;
      
      // Fetch conversations
      const chatsRes = await API.get('/chat/conversations');
      
      setRecentProperties(myProps.slice(0, 3));
      setStats({
        myProperties: myProps.length,
        pendingApproval: myProps.filter(p => !p.isApproved).length,
        totalViews: myProps.reduce((sum, p) => sum + (p.views || 0), 0),
        activeChats: chatsRes.data.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-home-page">
      <Navbar />

      {/* Agent Hero */}
      <section className="agent-hero">
        <div className="agent-hero-bg"></div>
        <div className="container">
          <div className="agent-hero-content">
            <div className="agent-welcome">
              <h1>Welcome, {user?.name}! 👨‍💼</h1>
              <p>Your Agent Portal - Manage properties and connect with customers</p>
            </div>
            <Link to="/agent/add-property" className="btn-add-property-hero">
              ➕ Add New Property
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="agent-quick-stats">
        <div className="container">
          <div className="quick-stats-grid">
            <Link to="/agent/dashboard" className="quick-stat-card">
              <div className="qsc-icon">🏠</div>
              <div className="qsc-number">{stats.myProperties}</div>
              <div className="qsc-label">My Properties</div>
            </Link>

            <Link to="/agent/dashboard" className="quick-stat-card pending">
              <div className="qsc-icon">⏳</div>
              <div className="qsc-number">{stats.pendingApproval}</div>
              <div className="qsc-label">Pending Approval</div>
            </Link>

            <div className="quick-stat-card">
              <div className="qsc-icon">👁️</div>
              <div className="qsc-number">{stats.totalViews}</div>
              <div className="qsc-label">Total Views</div>
            </div>

            <Link to="/agent/dashboard" className="quick-stat-card messages">
              <div className="qsc-icon">💬</div>
              <div className="qsc-number">{stats.activeChats}</div>
              <div className="qsc-label">Active Chats</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="agent-actions-section">
        <div className="container">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/agent/add-property" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add Property</h3>
              <p>List a new property for sale or rent</p>
            </Link>

            <Link to="/agent/dashboard" className="action-card">
              <div className="action-icon">📊</div>
              <h3>View Dashboard</h3>
              <p>Manage all your properties</p>
            </Link>

            <Link to="/agent/dashboard" className="action-card">
              <div className="action-icon">💬</div>
              <h3>Customer Messages</h3>
              <p>Reply to customer inquiries</p>
            </Link>

            <Link to="/properties" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Browse Properties</h3>
              <p>View all platform listings</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      {recentProperties.length > 0 && (
        <section className="agent-recent-properties">
          <div className="container">
            <h2>Your Recent Properties</h2>
            <div className="recent-props-grid">
              {recentProperties.map(property => (
                <div key={property._id} className="recent-prop-card">
                  <div className="recent-prop-image">
                    {property.images && property.images.length > 0 ? (
                      <img src={property.images[0].url} alt={property.title} />
                    ) : (
                      <div className="no-img">No Image</div>
                    )}
                    <span className={`status-badge-mini ${property.isApproved ? 'approved' : 'pending'}`}>
                      {property.isApproved ? '✅' : '⏳'}
                    </span>
                  </div>
                  <div className="recent-prop-info">
                    <h3>{property.title}</h3>
                    <p className="prop-price">${property.price.toLocaleString()}</p>
                    <p className="prop-location">📍 {property.location.city}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/agent/dashboard" className="btn-view-all-props">
              View All My Properties →
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default AgentHome;