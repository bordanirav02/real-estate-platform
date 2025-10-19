const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Property description is required']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required']
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['House', 'Apartment', 'Villa', 'Condo', 'Commercial', 'Land', 'Office']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending'],
    default: 'available'
  },
  // Location details
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'USA'
    },
    // For map integration
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  // Property features
  features: {
    bedrooms: {
      type: Number,
      required: true
    },
    bathrooms: {
      type: Number,
      required: true
    },
    area: {
      type: Number, // in square feet
      required: true
    },
    parking: {
      type: Number,
      default: 0
    },
    yearBuilt: Number,
    floors: Number,
    furnished: {
      type: Boolean,
      default: false
    }
  },
  // Additional amenities
  amenities: [{
    type: String,
    enum: [
      'Swimming Pool',
      'Gym',
      'Garden',
      'Balcony',
      'Air Conditioning',
      'Heating',
      'Security System',
      'Elevator',
      'Pet Friendly',
      'Fireplace',
      'Garage',
      'Laundry',
      'WiFi',
      'Solar Panels'
    ]
  }],
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String, // For Cloudinary
    caption: String
  }],
  // Virtual tour
  virtualTourUrl: String,
  // Videos
  videoUrl: String,
  // Agent who listed this property
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Featured property (show on homepage)
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Property approval status (for admin)
  isApproved: {
    type: Boolean,
    default: false
  },
  // Views count
  views: {
    type: Number,
    default: 0
  },
  // For SEO
  slug: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from title before saving
propertySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

// Index for search optimization
propertySchema.index({ 
  title: 'text', 
  description: 'text',
  'location.city': 'text',
  'location.state': 'text'
});

module.exports = mongoose.model('Property', propertySchema);