import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AgentChatPanel from '../../components/AgentChatPanel';
import API from '../../services/api';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetchMyProperties();
    }
  }, [user]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/properties/agent/${user._id}`);
      const myProperties = response.data.data;
      
      setProperties(myProperties);
      
      // Calculate stats
      const totalViews = myProperties.reduce((sum, prop) => sum + (prop.views || 0), 0);
      setStats({
        total: myProperties.length,
        approved: myProperties.filter(p => p.isApproved).length,
        pending: myProperties.filter(p => !p.isApproved).length,
        views: totalViews
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await API.delete(`/properties/${id}`);
        alert('Property deleted successfully!');
        fetchMyProperties();
      } catch (error) {
        alert('Error deleting property: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="agent-dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1>Agent Dashboard</h1>
              <p>Welcome back, {user?.name}! 👋</p>
            </div>
            <Link to="/agent/add-property" className="btn-add-property">
              <span className="btn-icon">➕</span>
              <span>Add New Property</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-info">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Properties</div>
              </div>
            </div>

            <div className="stat-card approved">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-number">{stats.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending Approval</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-info">
                <div className="stat-number">{stats.views}</div>
                <div className="stat-label">Total Views</div>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="properties-section">
            <h2>Your Properties</h2>
            
            {loading ? (
              <div className="loading">
                <div className="loader"></div>
                <p>Loading your properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Properties Yet</h3>
                <p>Start by adding your first property listing</p>
                <Link to="/agent/add-property" className="btn-add-first">
                  <span>➕ Add Your First Property</span>
                </Link>
              </div>
            ) : (
              <div className="properties-table-container">
                <table className="properties-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property._id}>
                        <td>
                          <div className="property-info">
                            <strong>{property.title}</strong>
                            <span className="property-type">{property.propertyType}</span>
                          </div>
                        </td>
                        <td>{property.location.city}, {property.location.state}</td>
                        <td className="price">${property.price.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${property.isApproved ? 'approved' : 'pending'}`}>
                            {property.isApproved ? '✅ Approved' : '⏳ Pending'}
                          </span>
                        </td>
                        <td>{property.views || 0}</td>
                        <td>
                          <div className="action-buttons">
                            <Link 
                              to={`/property/${property._id}`} 
                              className="btn-icon view"
                              title="View"
                            >
                              👁️
                            </Link>
                            <button 
                              onClick={() => handleDelete(property._id)}
                              className="btn-icon delete"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Chat Panel Section */}
          <div className="chat-section-agent">
            <div className="section-header-chat">
              <h2>💬 Customer Messages</h2>
              <p>Respond to customer inquiries in real-time</p>
            </div>
            <AgentChatPanel />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AgentDashboard;