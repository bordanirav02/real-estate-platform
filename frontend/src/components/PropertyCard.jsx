import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="property-card">
      <div className="property-image">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0].url} alt={property.title} />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
        {property.isFeatured && (
          <span className="featured-badge">Featured</span>
        )}
      </div>

      <div className="property-content">
        <div className="property-price">{formatPrice(property.price)}</div>
        <h3 className="property-title">{property.title}</h3>
        
        <div className="property-location">
          📍 {property.location.city}, {property.location.state}
        </div>

        <div className="property-features">
          <div className="feature">
            🛏️ {property.features.bedrooms} Beds
          </div>
          <div className="feature">
            🚿 {property.features.bathrooms} Baths
          </div>
          <div className="feature">
            📏 {property.features.area} sqft
          </div>
        </div>

        <div className="property-actions">
          <Link to={`/property/${property._id}`} className="btn-view">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;