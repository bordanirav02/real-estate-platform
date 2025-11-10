import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import API from '../../services/api';
import './Home.css';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await API.get(`/properties?${queryParams}`);
      const allProps = response.data.data;
      setProperties(allProps);
      setFeaturedProperties(allProps.filter(p => p.isFeatured).slice(0, 6));
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanFilters = {};
    if (searchFilters.city) cleanFilters.city = searchFilters.city;
    if (searchFilters.propertyType) cleanFilters.propertyType = searchFilters.propertyType;
    if (searchFilters.minPrice) cleanFilters.minPrice = searchFilters.minPrice;
    if (searchFilters.maxPrice) cleanFilters.maxPrice = searchFilters.maxPrice;
    
    fetchProperties(cleanFilters);
    
    const propertiesSection = document.querySelector('.properties-section');
    if (propertiesSection) {
      window.scrollTo({
        top: propertiesSection.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const handleFilterChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="home-redesign">
      <Navbar />

      {/* Ultra Modern Hero - NO PARALLAX */}
      <section className="hero-ultra">
        <div className="hero-particles"></div>
        <div className="hero-gradient-orb orb-1"></div>
        <div className="hero-gradient-orb orb-2"></div>
        
        <div className="container">
          <div className="hero-content-ultra">
            <div className="hero-badge-modern">
              <span className="badge-dot"></span>
              Premium Real Estate Platform
            </div>
            
            <h1 className="hero-title-ultra">
              Find Your
              <span className="gradient-text-animated"> Dream Home</span>
              <br />
              In Paradise
            </h1>
            
            <p className="hero-subtitle-modern">
              Discover luxury properties in the world's most desirable locations
            </p>

            {/* Modern Search Box */}
            <div className="search-box-modern">
              <form className="search-form-modern" onSubmit={handleSearch}>
                <div className="search-grid-modern">
                  <div className="search-field">
                    <label className="field-label">Location</label>
                    <div className="input-wrapper">
                      <span className="input-icon-modern">📍</span>
                      <input
                        type="text"
                        name="city"
                        placeholder="City or State"
                        value={searchFilters.city}
                        onChange={handleFilterChange}
                        className="input-modern"
                      />
                    </div>
                  </div>

                  <div className="search-field">
                    <label className="field-label">Property Type</label>
                    <div className="input-wrapper">
                      <span className="input-icon-modern">🏠</span>
                      <select
                        name="propertyType"
                        value={searchFilters.propertyType}
                        onChange={handleFilterChange}
                        className="input-modern"
                      >
                        <option value="">All Types</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Condo">Condo</option>
                      </select>
                    </div>
                  </div>

                  <div className="search-field">
                    <label className="field-label">Price Range</label>
                    <div className="price-inputs">
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={searchFilters.minPrice}
                        onChange={handleFilterChange}
                        className="input-modern price-input"
                      />
                      <span className="price-separator">—</span>
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={searchFilters.maxPrice}
                        onChange={handleFilterChange}
                        className="input-modern price-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-search-ultra">
                    <span className="btn-text">Search Now</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-section-modern properties-section">
        <div className="container">
          <div className="section-header-modern">
            <div className="header-top">
              <span className="section-tag">Featured Collection</span>
              <Link to="/properties" className="view-all-link">
                View All <span className="arrow-icon">→</span>
              </Link>
            </div>
            <h2 className="section-title-modern">
              Exclusive Properties
            </h2>
            <p className="section-desc-modern">
              Handpicked luxury homes in prime locations
            </p>
          </div>

          {loading ? (
            <div className="loading-modern">
              <div className="spinner-modern"></div>
              <p>Loading exclusive properties...</p>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="no-properties-modern">
              <p>No featured properties at the moment</p>
              <Link to="/properties" className="btn-browse-all">Browse All Properties</Link>
            </div>
          ) : (
            <div className="properties-grid-modern">
              {featuredProperties.map((property, index) => (
                <div 
                  key={property._id}
                  className="property-wrapper-modern"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}

          <div className="cta-banner-modern">
            <div className="cta-content-modern">
              <h3>Can't find what you're looking for?</h3>
              <p>Browse our complete collection of premium properties</p>
            </div>
            <Link to="/properties" className="btn-cta-modern">
              <span>Explore All Properties</span>
              <span className="cta-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - NO PARALLAX */}
      <section className="stats-modern">
        <div className="stats-bg-pattern"></div>
        <div className="container">
          <div className="stats-grid-modern">
            <div className="stat-item-modern">
              <div className="stat-icon-modern">🏆</div>
              <div className="stat-number-modern">500+</div>
              <div className="stat-label-modern">Properties Listed</div>
            </div>
            <div className="stat-item-modern">
              <div className="stat-icon-modern">😊</div>
              <div className="stat-number-modern">200+</div>
              <div className="stat-label-modern">Happy Clients</div>
            </div>
            <div className="stat-item-modern">
              <div className="stat-icon-modern">👨‍💼</div>
              <div className="stat-number-modern">50+</div>
              <div className="stat-label-modern">Expert Agents</div>
            </div>
            <div className="stat-item-modern">
              <div className="stat-icon-modern">⭐</div>
              <div className="stat-number-modern">15+</div>
              <div className="stat-label-modern">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-modern">
        <div className="container">
          <div className="section-header-modern">
            <span className="section-tag">Our Services</span>
            <h2 className="section-title-modern">
              Why Choose Us
            </h2>
            <p className="section-desc-modern">
              Premium services designed for your success
            </p>
          </div>

          <div className="services-grid-modern">
            <div className="service-card-modern">
              <div className="service-icon-box">
                <span className="service-icon">🔍</span>
              </div>
              <h3>Smart Search</h3>
              <p>AI-powered property search with advanced filters and recommendations</p>
              <div className="service-arrow">→</div>
            </div>

            <div className="service-card-modern">
              <div className="service-icon-box">
                <span className="service-icon">🏆</span>
              </div>
              <h3>Premium Listings</h3>
              <p>Verified luxury properties from trusted agents worldwide</p>
              <div className="service-arrow">→</div>
            </div>

            <div className="service-card-modern">
              <div className="service-icon-box">
                <span className="service-icon">💼</span>
              </div>
              <h3>Expert Guidance</h3>
              <p>Professional consultation from experienced real estate experts</p>
              <div className="service-arrow">→</div>
            </div>

            <div className="service-card-modern">
              <div className="service-icon-box">
                <span className="service-icon">🔒</span>
              </div>
              <h3>Secure Transactions</h3>
              <p>Safe and transparent process from start to finish</p>
              <div className="service-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final-modern">
        <div className="cta-bg-animated"></div>
        <div className="container">
          <div className="cta-box-modern">
            <h2>Ready to Find Your Perfect Home?</h2>
            <p>Join thousands of satisfied homeowners who found their dream property</p>
            <div className="cta-buttons-modern">
              <Link to="/register" className="btn-get-started">
                <span>Get Started Free</span>
                <span className="btn-sparkle">✨</span>
              </Link>
              <Link to="/properties" className="btn-browse">
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;