import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../services/api';
import './ManageUsers.css';

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const queryParam = filterRole ? `?role=${filterRole}` : '';
        const response = await API.get(`/users${queryParam}`);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error loading users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filterRole]);

  const refreshUsers = async () => {
    try {
      setLoading(true);
      const queryParam = filterRole ? `?role=${filterRole}` : '';
      const response = await API.get(`/users${queryParam}`);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser._id) {
      alert("You cannot delete your own account!");
      return;
    }

    if (window.confirm(`⚠️ Delete user "${userName}"? This cannot be undone!`)) {
      try {
        await API.delete(`/users/${userId}`);
        alert('✅ User deleted successfully');
        refreshUsers();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleChangeRole = async (userId, currentRole, userName) => {
    const newRole = prompt(
      `Change role for ${userName}\n\nCurrent role: ${currentRole}\n\nEnter new role (customer/agent/admin):`,
      currentRole
    );

    if (!newRole) return;

    if (!['customer', 'agent', 'admin'].includes(newRole.toLowerCase())) {
      alert('Invalid role! Must be: customer, agent, or admin');
      return;
    }

    try {
      await API.put(`/users/${userId}/role`, { role: newRole.toLowerCase() });
      alert(`✅ Role updated to ${newRole}`);
      refreshUsers();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-users-page">
      <Navbar />

      {/* Hero Section */}
      <div className="users-hero">
        <div className="users-hero-bg"></div>
        <div className="container">
          <div className="hero-content-users">
            <h1>👥 Manage Users</h1>
            <p>Control and manage all platform users</p>
          </div>
        </div>
      </div>

      <div className="users-content">
        <div className="container">
          
          {/* Controls Bar */}
          <div className="controls-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-users"
              />
            </div>

            <div className="filter-controls">
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className="role-filter"
              >
                <option value="">All Roles</option>
                <option value="customer">Customers Only</option>
                <option value="agent">Agents Only</option>
                <option value="admin">Admins Only</option>
              </select>

              <div className="user-count">
                <span className="count-number">{filteredUsers.length}</span>
                <span className="count-label">Users</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="user-stats-grid">
            <div className="user-stat-card total">
              <div className="stat-icon-user">👥</div>
              <div className="stat-info-user">
                <div className="stat-num">{users.length}</div>
                <div className="stat-lbl">Total Users</div>
              </div>
            </div>
            <div className="user-stat-card customers">
              <div className="stat-icon-user">🛒</div>
              <div className="stat-info-user">
                <div className="stat-num">{users.filter(u => u.role === 'customer').length}</div>
                <div className="stat-lbl">Customers</div>
              </div>
            </div>
            <div className="user-stat-card agents">
              <div className="stat-icon-user">👨‍💼</div>
              <div className="stat-info-user">
                <div className="stat-num">{users.filter(u => u.role === 'agent').length}</div>
                <div className="stat-lbl">Agents</div>
              </div>
            </div>
            <div className="user-stat-card admins">
              <div className="stat-icon-user">👑</div>
              <div className="stat-info-user">
                <div className="stat-num">{users.filter(u => u.role === 'admin').length}</div>
                <div className="stat-lbl">Admins</div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="users-table-section">
            {loading ? (
              <div className="loading-users">
                <div className="loader-users"></div>
                <p>Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="no-users">
                <div className="empty-icon-users">😕</div>
                <h3>No users found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="users-table-container">
                <table className="users-table-manage">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Verified</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, index) => (
                      <tr key={u._id} style={{animationDelay: `${index * 0.05}s`}}>
                        <td>
                          <div className="user-info-cell">
                            <div className="user-avatar-mini">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                              <span className="user-name-text">{u.name}</span>
                              {u._id === currentUser._id && (
                                <span className="you-badge">You</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="email-cell">{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td>
                          <span className={`role-badge-manage ${u.role}`}>
                            {u.role === 'customer' && '🛒'}
                            {u.role === 'agent' && '👨‍💼'}
                            {u.role === 'admin' && '👑'}
                            {' '}
                            {u.role}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`verify-badge ${u.isVerified ? 'verified' : 'unverified'}`}>
                            {u.isVerified ? '✅ Verified' : '⏳ Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns-users">
                            <button
                              className="btn-icon-action edit"
                              onClick={() => handleChangeRole(u._id, u.role, u.name)}
                              title="Change Role"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-icon-action delete"
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              title="Delete User"
                              disabled={u._id === currentUser._id}
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageUsers;