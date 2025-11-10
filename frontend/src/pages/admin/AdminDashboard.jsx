import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingProperties: 0,
    totalAgents: 0,
    approvedProperties: 0,
    totalCustomers: 0
  });
  const [pendingProperties, setPendingProperties] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    // Fetch all users
    const usersRes = await API.get('/users');
    const users = usersRes.data.data;
    
    // Fetch ALL properties (including unapproved) - ADD showAll=true
    const allPropsRes = await API.get('/properties?showAll=true');
    const allProperties = allPropsRes.data.data;
    
    // Get recent users (last 5)
    const recent = users.slice(0, 5);
    setRecentUsers(recent);
    
    // Calculate stats
    const pending = allProperties.filter(p => !p.isApproved);
    const approved = allProperties.filter(p => p.isApproved);
    
    setStats({
      totalUsers: users.length,
      totalProperties: allProperties.length,
      pendingProperties: pending.length,
      approvedProperties: approved.length,
      totalAgents: users.filter(u => u.role === 'agent').length,
      totalCustomers: users.filter(u => u.role === 'customer').length
    });
    
    // Set pending properties for approval
    setPendingProperties(pending);
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};

  const handleApprove = async (propertyId) => {
    if (window.confirm('Approve this property for public listing?')) {
      try {
        await API.put(`/properties/${propertyId}/approve`);
        alert('✅ Property approved successfully!');
        fetchDashboardData();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleReject = async (propertyId) => {
    if (window.confirm('⚠️ Delete this property? This cannot be undone!')) {
      try {
        await API.delete(`/properties/${propertyId}`);
        alert('Property rejected and deleted');
        fetchDashboardData();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('⚠️ Delete this user? This cannot be undone!')) {
      try {
        await API.delete(`/users/${userId}`);
        alert('User deleted successfully');
        fetchDashboardData();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="admin-dashboard-new">
      <Navbar />
      
      {/* Admin Hero */}
      <div className="admin-hero">
        <div className="admin-hero-bg"></div>
        <div className="container">
          <div className="hero-content-admin">
            <div className="admin-badge">
              <span className="crown-icon">👑</span>
              Administrator
            </div>
            <h1>Admin Control Center</h1>
            <p>Welcome, {user?.name}! You have full platform control</p>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          
          {/* Mega Stats Grid */}
          <div className="mega-stats-grid">
            <div className="mega-stat-card users">
              <div className="stat-icon-mega">👥</div>
              <div className="stat-content-mega">
                <div className="stat-number-mega">{stats.totalUsers}</div>
                <div className="stat-label-mega">Total Users</div>
                <div className="stat-change">+12% this month</div>
              </div>
              <div className="stat-sparkline"></div>
            </div>

            <div className="mega-stat-card properties">
              <div className="stat-icon-mega">🏠</div>
              <div className="stat-content-mega">
                <div className="stat-number-mega">{stats.totalProperties}</div>
                <div className="stat-label-mega">Total Properties</div>
                <div className="stat-change positive">+{stats.approvedProperties} approved</div>
              </div>
              <div className="stat-sparkline"></div>
            </div>

            <div className="mega-stat-card pending">
              <div className="stat-icon-mega">⏳</div>
              <div className="stat-content-mega">
                <div className="stat-number-mega">{stats.pendingProperties}</div>
                <div className="stat-label-mega">Pending Approval</div>
                <div className="stat-change warning">Needs attention</div>
              </div>
              <div className="stat-sparkline"></div>
            </div>

            <div className="mega-stat-card agents">
              <div className="stat-icon-mega">👨‍💼</div>
              <div className="stat-content-mega">
                <div className="stat-number-mega">{stats.totalAgents}</div>
                <div className="stat-label-mega">Active Agents</div>
                <div className="stat-change">{stats.totalCustomers} customers</div>
              </div>
              <div className="stat-sparkline"></div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button 
              className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              ⏳ Pending Approval ({stats.pendingProperties})
            </button>
            <button 
              className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Recent Users
            </button>
          </div>

          {/* Tab Content */}
          <div className="admin-tab-content">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-section">
                <div className="welcome-card">
                  <h2>🎉 Everything Under Control!</h2>
                  <p>Your platform is running smoothly. Here's a quick overview:</p>
                  
                  <div className="quick-stats">
                    <div className="quick-stat">
                      <span className="qs-label">Properties Listed</span>
                      <span className="qs-value">{stats.totalProperties}</span>
                    </div>
                    <div className="quick-stat">
                      <span className="qs-label">Awaiting Review</span>
                      <span className="qs-value highlight">{stats.pendingProperties}</span>
                    </div>
                    <div className="quick-stat">
                      <span className="qs-label">Active Users</span>
                      <span className="qs-value">{stats.totalUsers}</span>
                    </div>
                  </div>

                  <div className="quick-actions-admin">
                    <Link to="/admin/users" className="qa-btn">
                      <span>👥</span> Manage All Users
                    </Link>
                    <button className="qa-btn" onClick={() => setActiveTab('pending')}>
                      <span>✅</span> Review Properties
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Properties Tab */}
            {activeTab === 'pending' && (
              <div className="pending-section-new">
                <div className="section-header-admin">
                  <h2>Properties Awaiting Approval</h2>
                  <p>Review and approve properties submitted by agents</p>
                </div>

                {loading ? (
                  <div className="loading-admin">
                    <div className="loader-admin"></div>
                    <p>Loading pending properties...</p>
                  </div>
                ) : pendingProperties.length === 0 ? (
                  <div className="empty-state-admin">
                    <div className="empty-icon-admin">✅</div>
                    <h3>All Caught Up!</h3>
                    <p>No properties awaiting approval</p>
                  </div>
                ) : (
                  <div className="pending-grid">
                    {pendingProperties.map((property, index) => (
                      <div key={property._id} className="pending-card" style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="pending-image">
                          {property.images && property.images.length > 0 ? (
                            <img src={property.images[0].url} alt={property.title} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                          <div className="pending-badge">⏳ Pending</div>
                        </div>
                        
                        <div className="pending-details">
                          <h3>{property.title}</h3>
                          <p className="location">📍 {property.location.city}, {property.location.state}</p>
                          <p className="price">{formatPrice(property.price)}</p>
                          
                          <div className="features-mini">
                            <span>🛏️ {property.features.bedrooms}</span>
                            <span>🚿 {property.features.bathrooms}</span>
                            <span>📏 {property.features.area} sqft</span>
                          </div>

                          <div className="agent-mini">
                            <p>👨‍💼 Agent: {property.agent?.name || 'Unknown'}</p>
                            <p>📧 {property.agent?.email}</p>
                          </div>

                          <div className="approval-buttons">
                            <Link 
                              to={`/property/${property._id}`}
                              className="btn-view-full"
                              target="_blank"
                            >
                              👁️ View Full Details
                            </Link>
                            <div className="action-btns">
                              <button 
                                onClick={() => handleApprove(property._id)}
                                className="btn-approve-new"
                              >
                                ✅ Approve
                              </button>
                              <button 
                                onClick={() => handleReject(property._id)}
                                className="btn-reject-new"
                              >
                                ❌ Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Users Tab */}
            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header-admin">
                  <h2>Recent Users</h2>
                  <Link to="/admin/users" className="btn-view-all">
                    View All Users →
                  </Link>
                </div>

                <div className="users-table-card">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="user-name">{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role-badge-table ${u.role}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn-delete-user"
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default AdminDashboard;