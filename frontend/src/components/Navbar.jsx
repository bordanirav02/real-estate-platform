import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'agent':
        return '/agent/dashboard';
      case 'customer':
        return '/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          {/* Logo */}
          <Link to="/" className="logo">
            🏠 Real Estate
          </Link>

          {/* Desktop Menu */}
          <ul className="nav-links desktop-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/">About</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>

          {/* Auth Buttons */}
          <div className="nav-buttons desktop-menu">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="btn btn-secondary">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="mobile-menu">
            <Link to="/" onClick={() => setShowMobileMenu(false)}>Home</Link>
            <Link to="/properties" onClick={() => setShowMobileMenu(false)}>Properties</Link>
            <Link to="/" onClick={() => setShowMobileMenu(false)}>About</Link>
            <Link to="/" onClick={() => setShowMobileMenu(false)}>Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setShowMobileMenu(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="btn btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setShowMobileMenu(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;