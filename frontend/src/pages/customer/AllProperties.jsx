import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import API from '../../services/api';
import './AllProperties.css';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    sort: '-createdAt'
  });

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== '')
      ).toString();
      const response = await API.get(`/properties?${queryParams}`);
      setProperties(response.data.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      sort: '-createdAt'
    });
    setTimeout(() => fetchProperties(), 100);
  };

  return (
    <div className="all-properties-page">
      <Navbar />

      {/* Page Header */}
      <div className="page-hero">
        <div className="container">
          <h1>Browse All Properties</h1>
          <p>Explore our complete collection of {properties.length} premium listings</p>
        </div>
      </div>

      <div className="properties-container">
        <div className="container">
          <div className="content-layout">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>🔍 Filter Properties</h3>
                <button onClick={clearFilters} className="btn-clear">Clear All</button>
              </div>

              <form onSubmit={handleSearch} className="filters-form">
                <div className="filter-group">
                  <label>📍 Location</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city name"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-group">
                  <label>🏠 Property Type</label>
                  <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Condo">Condo</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>🛏️ Bedrooms</label>
                  <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>💵 Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="$0"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-group">
                  <label>💎 Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Any"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="filter-group">
                  <label>📊 Sort By</label>
                  <select name="sort" value={filters.sort} onChange={handleFilterChange}>
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-views">Most Viewed</option>
                  </select>
                </div>

                <button type="submit" className="btn-apply-filters">
                  Apply Filters
                </button>
              </form>
            </aside>

            {/* Properties Grid */}
            <div className="properties-main">
              <div className="results-header">
                <h2>{properties.length} Properties Found</h2>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="loader"></div>
                  <p>Loading properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="no-results">
                  <div className="empty-icon">🏘️</div>
                  <h3>No properties found</h3>
                  <p>Try adjusting your filters</p>
                  <button onClick={clearFilters} className="btn-reset">Reset Filters</button>
                </div>
              ) : (
                <div className="properties-grid">
                  {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllProperties;