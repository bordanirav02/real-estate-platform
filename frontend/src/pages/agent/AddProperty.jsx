import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import API from '../../services/api';
import './AddProperty.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'House',
    status: 'available',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    features: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      parking: '',
      yearBuilt: '',
      floors: '',
      furnished: false
    },
    amenities: [],
    images: [{ url: '', caption: '' }],
    virtualTourUrl: '',
    isFeatured: false
  });

  const availableAmenities = [
    'Swimming Pool', 'Gym', 'Garden', 'Balcony', 'Air Conditioning',
    'Heating', 'Security System', 'Elevator', 'Pet Friendly',
    'Fireplace', 'Garage', 'Laundry', 'WiFi', 'Solar Panels'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', caption: '' }]
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return formData.title && formData.description && formData.price && formData.propertyType;
      case 2:
        return formData.location.address && formData.location.city && 
               formData.location.state && formData.location.zipCode;
      case 3:
        return formData.features.bedrooms && formData.features.bathrooms && formData.features.area;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Clean up data
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        features: {
          bedrooms: Number(formData.features.bedrooms),
          bathrooms: Number(formData.features.bathrooms),
          area: Number(formData.features.area),
          parking: Number(formData.features.parking) || 0,
          yearBuilt: formData.features.yearBuilt ? Number(formData.features.yearBuilt) : undefined,
          floors: formData.features.floors ? Number(formData.features.floors) : undefined,
          furnished: formData.features.furnished
        },
        images: formData.images.filter(img => img.url)
      };

      await API.post('/properties', propertyData);
      
      alert('Property added successfully! Waiting for admin approval.');
      navigate('/agent/dashboard');
    } catch (error) {
      console.error('Error adding property:', error);
      alert(error.response?.data?.message || 'Failed to add property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-page">
      <Navbar />

      <div className="add-property-container">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <h1>Add New Property</h1>
            <p>Fill in the details to list your property</p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Basic Info</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Location</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Features</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Media</div>
            </div>
          </div>

    <form className="property-form">
  
  {/* Step 1: Basic Information */}
  {currentStep === 1 && (
    <div className="form-step">
      <h2>Basic Information</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Property Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Luxury 4 Bedroom Villa with Ocean View"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your property in detail..."
            rows="5"
            required
          />
        </div>

        <div className="form-group">
          <label>Property Type *</label>
          <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Condo">Condo</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Office">Office</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price (USD) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="1250000"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <span>Mark as Featured</span>
          </label>
        </div>
      </div>
    </div>
  )}

  {/* Step 2: Location */}
  {currentStep === 2 && (
    <div className="form-step">
      <h2>Location Details</h2>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Street Address *</label>
          <input
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="123 Ocean Drive"
            required
          />
        </div>

        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            placeholder="Miami"
            required
          />
        </div>

        <div className="form-group">
          <label>State *</label>
          <input
            type="text"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            placeholder="Florida"
            required
          />
        </div>

        <div className="form-group">
          <label>ZIP Code *</label>
          <input
            type="text"
            name="location.zipCode"
            value={formData.location.zipCode}
            onChange={handleChange}
            placeholder="33139"
            required
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="location.country"
            value={formData.location.country}
            onChange={handleChange}
            placeholder="USA"
          />
        </div>
      </div>
    </div>
  )}

  {/* Step 3: Features */}
  {currentStep === 3 && (
    <div className="form-step">
      <h2>Property Features</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Bedrooms *</label>
          <input
            type="number"
            name="features.bedrooms"
            value={formData.features.bedrooms}
            onChange={handleChange}
            placeholder="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Bathrooms *</label>
          <input
            type="number"
            name="features.bathrooms"
            value={formData.features.bathrooms}
            onChange={handleChange}
            placeholder="3"
            required
          />
        </div>

        <div className="form-group">
          <label>Area (sq ft) *</label>
          <input
            type="number"
            name="features.area"
            value={formData.features.area}
            onChange={handleChange}
            placeholder="3500"
            required
          />
        </div>

        <div className="form-group">
          <label>Parking Spaces</label>
          <input
            type="number"
            name="features.parking"
            value={formData.features.parking}
            onChange={handleChange}
            placeholder="2"
          />
        </div>

        <div className="form-group">
          <label>Year Built</label>
          <input
            type="number"
            name="features.yearBuilt"
            value={formData.features.yearBuilt}
            onChange={handleChange}
            placeholder="2020"
          />
        </div>

        <div className="form-group">
          <label>Floors</label>
          <input
            type="number"
            name="features.floors"
            value={formData.features.floors}
            onChange={handleChange}
            placeholder="2"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="features.furnished"
              checked={formData.features.furnished}
              onChange={handleChange}
            />
            <span>Fully Furnished</span>
          </label>
        </div>
      </div>

      <div className="amenities-section">
        <h3>Amenities</h3>
        <div className="amenities-grid">
          {availableAmenities.map((amenity) => (
            <div
              key={amenity}
              className={`amenity-chip ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
              onClick={() => handleAmenityToggle(amenity)}
            >
              {formData.amenities.includes(amenity) && <span className="check">✓</span>}
              {amenity}
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

  {/* Step 4: Media */}
  {currentStep === 4 && (
    <div className="form-step">
      <h2>Property Images & Media</h2>
      
      <div className="images-section">
        <h3>Property Images</h3>
        <p className="helper-text">Add image URLs from Unsplash, Pexels, or your hosting service</p>
        
        {formData.images.map((image, index) => (
          <div key={index} className="image-input-group">
            <div className="image-fields">
              <input
                type="url"
                placeholder="Image URL (e.g., https://images.unsplash.com/...)"
                value={image.url}
                onChange={(e) => handleImageChange(index, 'url', e.target.value)}
              />
              <input
                type="text"
                placeholder="Caption (optional)"
                value={image.caption}
                onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
              />
            </div>
            {formData.images.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeImageField(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        
        <button type="button" className="btn-add-image" onClick={addImageField}>
          + Add Another Image
        </button>
      </div>

      <div className="form-group">
        <label>Virtual Tour URL (optional)</label>
        <input
          type="url"
          name="virtualTourUrl"
          value={formData.virtualTourUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
      </div>
    </div>
  )}

  {/* Navigation Buttons - FIXED */}
  <div className="form-navigation">
    {currentStep > 1 && (
      <button 
        type="button" 
        className="btn-prev" 
        onClick={prevStep}
      >
        ← Previous
      </button>
    )}
    
    {currentStep < 4 ? (
      <button 
        type="button" 
        className="btn-next" 
        onClick={nextStep}
      >
        Next →
      </button>
    ) : (
      <button 
        type="button" 
        className="btn-submit" 
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Adding Property...' : '✓ Submit Property'}
      </button>
    )}
  </div>
</form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddProperty;