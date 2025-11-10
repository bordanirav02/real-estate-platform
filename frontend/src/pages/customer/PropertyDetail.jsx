import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../services/api';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

useEffect(() => {
  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/properties/${id}`);
      setProperty(response.data.data);
    } catch (error) {
      console.error('Error fetching property:', error);
      alert('Property not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  fetchProperty();
}, [id, navigate]);

  const handleScheduleVisit = () => {
    if (!isAuthenticated) {
      alert('Please login to schedule a visit');
      navigate('/login');
      return;
    }
    alert('Schedule visit feature coming soon!');
  };

  const handleContactAgent = () => {
    if (!isAuthenticated) {
      alert('Please login to contact agent');
      navigate('/login');
      return;
    }
    alert('Contact agent feature coming soon!');
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please login to save favorites');
      navigate('/login');
      return;
    }
    
    try {
      if (isFavorite) {
        await API.delete(`/users/${user._id}/favorites/${id}`);
        setIsFavorite(false);
        alert('Removed from favorites');
      } else {
        await API.post(`/users/${user._id}/favorites/${id}`);
        setIsFavorite(true);
        alert('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="property-detail">
        <Navbar />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail">
        <Navbar />
        <div className="error-container">
          <h2>Property not found</h2>
          <Link to="/" className="btn-back">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : [{ url: 'https://via.placeholder.com/800x600', caption: 'No image' }];

  return (
    <div className="property-detail">
      <Navbar />

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span className="separator">›</span>
          <Link to="/">Properties</Link>
          <span className="separator">›</span>
          <span className="current">{property.title}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-grid">
            <div className="main-image" onClick={() => setShowLightbox(true)}>
              <img src={images[selectedImage].url} alt={property.title} />
              <div className="image-overlay">
                <span className="view-photos">📸 View all {images.length} photos</span>
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="thumbnail-grid">
                {images.slice(0, 4).map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img.url} alt={`View ${index + 1}`} />
                    {index === 3 && images.length > 4 && (
                      <div className="more-photos">
                        +{images.length - 4} more
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Property Info */}
      <section className="property-info-section">
        <div className="container">
          <div className="info-layout">
            {/* Main Info */}
            <div className="main-info">
              <div className="property-header">
                <div>
                  <div className="property-badges">
                    {property.isFeatured && (
                      <span className="badge featured">⭐ Featured</span>
                    )}
                    <span className={`badge status-${property.status}`}>
                      {property.status}
                    </span>
                  </div>
                  <h1 className="property-title">{property.title}</h1>
                  <p className="property-location">
                    📍 {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
                  </p>
                </div>
                <div className="property-price-box">
                  <div className="price">{formatPrice(property.price)}</div>
                  <div className="price-label">Total Price</div>
                </div>
              </div>

              {/* Key Features */}
              <div className="key-features">
                <div className="feature-item">
                  <div className="feature-icon">🛏️</div>
                  <div className="feature-info">
                    <div className="feature-value">{property.features.bedrooms}</div>
                    <div className="feature-label">Bedrooms</div>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚿</div>
                  <div className="feature-info">
                    <div className="feature-value">{property.features.bathrooms}</div>
                    <div className="feature-label">Bathrooms</div>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📏</div>
                  <div className="feature-info">
                    <div className="feature-value">{property.features.area.toLocaleString()}</div>
                    <div className="feature-label">Sq Ft</div>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚗</div>
                  <div className="feature-info">
                    <div className="feature-value">{property.features.parking || 0}</div>
                    <div className="feature-label">Parking</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="description-card">
                <h2>Description</h2>
                <p>{property.description}</p>
              </div>

              {/* Property Details */}
              <div className="details-card">
                <h2>Property Details</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Property Type:</span>
                    <span className="detail-value">{property.propertyType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Year Built:</span>
                    <span className="detail-value">{property.features.yearBuilt || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Floors:</span>
                    <span className="detail-value">{property.features.floors || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Furnished:</span>
                    <span className="detail-value">{property.features.furnished ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{property.status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Views:</span>
                    <span className="detail-value">{property.views || 0}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="amenities-card">
                  <h2>Amenities</h2>
                  <div className="amenities-grid">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="amenity-item">
                        <span className="amenity-icon">✓</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Agent Card */}
              <div className="agent-card">
                <h3>Contact Agent</h3>
                {property.agent && (
                  <>
                    <div className="agent-info">
                      <img 
                        src={property.agent.avatar || 'https://via.placeholder.com/100'} 
                        alt={property.agent.name}
                        className="agent-avatar"
                      />
                      <div>
                        <h4>{property.agent.name}</h4>
                        <p className="agent-role">Licensed Agent</p>
                      </div>
                    </div>
                    <div className="agent-contact">
                      <p>📧 {property.agent.email}</p>
                      <p>📞 {property.agent.phone || 'Not provided'}</p>
                    </div>
                    <button className="btn-contact" onClick={handleContactAgent}>
                      💬 Contact Agent
                    </button>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-card">
                <button className="btn-schedule" onClick={handleScheduleVisit}>
                  📅 Schedule Visit
                </button>
                <button 
                  className={`btn-favorite ${isFavorite ? 'active' : ''}`}
                  onClick={toggleFavorite}
                >
                  {isFavorite ? '❤️ Saved' : '🤍 Save Property'}
                </button>
                <button className="btn-share">
                  🔗 Share Property
                </button>
              </div>

              {/* Calculate Mortgage */}
              <div className="mortgage-card">
                <h3>Calculate Mortgage</h3>
                <p className="mortgage-price">{formatPrice(property.price)}</p>
                <div className="mortgage-info">
                  <p>Estimated monthly payment</p>
                  <p className="monthly-payment">
                    {formatPrice(property.price * 0.004)}/mo
                  </p>
                  <small>*Based on 30-year fixed rate at 6.5% APR</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {showLightbox && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setShowLightbox(false)}>
              ✕
            </button>
            <button 
              className="lightbox-prev"
              onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
            >
              ‹
            </button>
            <img src={images[selectedImage].url} alt="Property" />
            <button 
              className="lightbox-next"
              onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
            >
              ›
            </button>
            <div className="lightbox-counter">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetail;