const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/Property');
const User = require('./models/User');

dotenv.config();

// Sample properties with multiple images
const getSampleProperties = () => [
  {
    title: "Luxury Oceanfront Villa with Private Beach",
    description: "Stunning oceanfront villa with panoramic views, infinity pool, and direct beach access. Premium finishes throughout.",
    price: 3500000,
    propertyType: "Villa",
    location: { address: "123 Ocean Drive", city: "Miami", state: "Florida", zipCode: "33139", country: "USA" },
    features: { bedrooms: 5, bathrooms: 4, area: 4500, parking: 3, yearBuilt: 2021, furnished: true },
    amenities: ["Swimming Pool", "Gym", "Garden", "Security System", "Garage", "WiFi"],
    images: [
      { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", caption: "Ocean View Exterior" },
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", caption: "Infinity Pool" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Living Room" },
      { url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800", caption: "Master Bedroom" },
      { url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800", caption: "Kitchen" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Modern Downtown Penthouse",
    description: "Sleek penthouse in the heart of downtown with floor-to-ceiling windows and city skyline views.",
    price: 2750000,
    propertyType: "Condo",
    location: { address: "888 Sky Tower", city: "New York", state: "New York", zipCode: "10001", country: "USA" },
    features: { bedrooms: 3, bathrooms: 3, area: 2800, parking: 2, yearBuilt: 2023, furnished: true },
    amenities: ["Gym", "Elevator", "Security System", "WiFi", "Balcony"],
    images: [
      { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", caption: "City Views" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", caption: "Luxurious Interior" },
      { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", caption: "Modern Kitchen" },
      { url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800", caption: "Bathroom" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Charming Suburban Family Home",
    description: "Spacious family home in quiet neighborhood with large backyard and updated kitchen.",
    price: 650000,
    propertyType: "House",
    location: { address: "456 Maple Street", city: "Austin", state: "Texas", zipCode: "78701", country: "USA" },
    features: { bedrooms: 4, bathrooms: 3, area: 3200, parking: 2, yearBuilt: 2018, furnished: false },
    amenities: ["Garden", "Garage", "Laundry", "Air Conditioning"],
    images: [
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", caption: "Front Exterior" },
      { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800", caption: "Backyard" },
      { url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800", caption: "Living Room" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1600566752734-dd4567198300?w=800", caption: "Master Bedroom" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Elegant Townhouse in Historic District",
    description: "Beautifully restored townhouse with original hardwood floors and modern amenities.",
    price: 890000,
    propertyType: "House",
    location: { address: "789 Heritage Lane", city: "Boston", state: "Massachusetts", zipCode: "02108", country: "USA" },
    features: { bedrooms: 3, bathrooms: 2, area: 2400, parking: 1, yearBuilt: 1920, furnished: false },
    amenities: ["Fireplace", "Garden", "Laundry", "Heating"],
    images: [
      { url: "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800", caption: "Historic Facade" },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", caption: "Interior" },
      { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", caption: "Dining Room" },
      { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800", caption: "Garden" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Contemporary Loft in Arts District",
    description: "Industrial-chic loft with exposed brick, high ceilings, and modern finishes.",
    price: 725000,
    propertyType: "Apartment",
    location: { address: "234 Art Street", city: "Los Angeles", state: "California", zipCode: "90013", country: "USA" },
    features: { bedrooms: 2, bathrooms: 2, area: 1800, parking: 1, yearBuilt: 2019, furnished: true },
    amenities: ["Gym", "Elevator", "WiFi", "Pet Friendly"],
    images: [
      { url: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800", caption: "Loft Space" },
      { url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800", caption: "Living Area" },
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", caption: "Bedroom" },
      { url: "https://images.unsplash.com/photo-1600566752734-dd4567198300?w=800", caption: "Bathroom" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Mountain Retreat with Panoramic Views",
    description: "Secluded mountain home offering privacy, stunning views, and luxury outdoor living.",
    price: 1450000,
    propertyType: "House",
    location: { address: "567 Summit Road", city: "Denver", state: "Colorado", zipCode: "80202", country: "USA" },
    features: { bedrooms: 4, bathrooms: 3, area: 3800, parking: 3, yearBuilt: 2020, furnished: true },
    amenities: ["Fireplace", "Balcony", "Heating", "Garage"],
    images: [
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", caption: "Mountain Views" },
      { url: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800", caption: "Exterior" },
      { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800", caption: "Living Room" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800", caption: "Master Suite" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Waterfront Condo with Marina Access",
    description: "Luxurious waterfront living with boat slip, resort amenities, and sunset views.",
    price: 1250000,
    propertyType: "Condo",
    location: { address: "999 Harbor Way", city: "Seattle", state: "Washington", zipCode: "98101", country: "USA" },
    features: { bedrooms: 3, bathrooms: 2, area: 2200, parking: 2, yearBuilt: 2022, furnished: false },
    amenities: ["Swimming Pool", "Gym", "Elevator", "Security System"],
    images: [
      { url: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800", caption: "Waterfront View" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Interior" },
      { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", caption: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800", caption: "Bedroom" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Spanish Colonial Estate",
    description: "Grand Spanish colonial home with courtyard, fountain, and terracotta tile.",
    price: 2100000,
    propertyType: "House",
    location: { address: "321 Hacienda Drive", city: "San Diego", state: "California", zipCode: "92101", country: "USA" },
    features: { bedrooms: 6, bathrooms: 5, area: 5200, parking: 4, yearBuilt: 2015, furnished: false },
    amenities: ["Swimming Pool", "Garden", "Fireplace", "Garage", "Security System"],
    images: [
      { url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800", caption: "Courtyard" },
      { url: "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800", caption: "Facade" },
      { url: "https://images.unsplash.com/photo-1600566752734-dd4567198300?w=800", caption: "Interior" },
      { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800", caption: "Pool" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Modern Smart Home in Tech Hub",
    description: "Fully automated smart home with cutting-edge technology and solar panels.",
    price: 1850000,
    propertyType: "House",
    location: { address: "777 Innovation Blvd", city: "San Francisco", state: "California", zipCode: "94102", country: "USA" },
    features: { bedrooms: 4, bathrooms: 3, area: 3300, parking: 2, yearBuilt: 2023, furnished: true },
    amenities: ["Solar Panels", "Security System", "Garage", "WiFi", "Air Conditioning"],
    images: [
      { url: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800", caption: "Smart Living" },
      { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800", caption: "Exterior" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", caption: "Living Room" },
      { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800", caption: "Bedroom" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Cozy Cottage with Garden Oasis",
    description: "Charming cottage surrounded by lush gardens, perfect for nature lovers.",
    price: 485000,
    propertyType: "House",
    location: { address: "159 Garden Path", city: "Portland", state: "Oregon", zipCode: "97201", country: "USA" },
    features: { bedrooms: 2, bathrooms: 2, area: 1600, parking: 1, yearBuilt: 2010, furnished: false },
    amenities: ["Garden", "Fireplace", "Laundry"],
    images: [
      { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800", caption: "Cottage Exterior" },
      { url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800", caption: "Garden" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Cozy Interior" },
      { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800", caption: "Bedroom" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Lakefront Property with Boat House",
    description: "Serene lakefront home with private dock, boat house, and expansive water views.",
    price: 1650000,
    propertyType: "House",
    location: { address: "246 Lake Shore Drive", city: "Chicago", state: "Illinois", zipCode: "60601", country: "USA" },
    features: { bedrooms: 4, bathrooms: 4, area: 3900, parking: 2, yearBuilt: 2019, furnished: false },
    amenities: ["Balcony", "Fireplace", "Garage", "Heating"],
    images: [
      { url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800", caption: "Lake View" },
      { url: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800", caption: "Exterior" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Living Space" },
      { url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800", caption: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1600566752734-dd4567198300?w=800", caption: "Master Bedroom" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Urban Industrial Loft",
    description: "Converted warehouse loft with exposed beams, brick walls, and 20-foot ceilings.",
    price: 825000,
    propertyType: "Apartment",
    location: { address: "135 Factory Street", city: "Brooklyn", state: "New York", zipCode: "11201", country: "USA" },
    features: { bedrooms: 2, bathrooms: 2, area: 2000, parking: 1, yearBuilt: 2017, furnished: true },
    amenities: ["Elevator", "WiFi", "Pet Friendly", "Laundry"],
    images: [
      { url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800", caption: "Loft Interior" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Open Space" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", caption: "Bedroom" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Golf Course Estate with Club Access",
    description: "Magnificent estate on the 18th fairway with clubhouse privileges.",
    price: 2950000,
    propertyType: "Villa",
    location: { address: "1 Fairway Circle", city: "Scottsdale", state: "Arizona", zipCode: "85251", country: "USA" },
    features: { bedrooms: 5, bathrooms: 5, area: 5000, parking: 4, yearBuilt: 2021, furnished: false },
    amenities: ["Swimming Pool", "Gym", "Garden", "Garage", "Security System"],
    images: [
      { url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800", caption: "Golf View" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Luxury Living" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Kitchen" },
      { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800", caption: "Master Suite" },
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", caption: "Pool" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Tropical Island Bungalow",
    description: "Paradise found! Beachside bungalow with outdoor shower and ocean breezes.",
    price: 950000,
    propertyType: "House",
    location: { address: "88 Beach Road", city: "Honolulu", state: "Hawaii", zipCode: "96801", country: "USA" },
    features: { bedrooms: 3, bathrooms: 2, area: 1900, parking: 2, yearBuilt: 2016, furnished: true },
    amenities: ["Garden", "Balcony", "WiFi", "Pet Friendly"],
    images: [
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", caption: "Beach View" },
      { url: "https://images.unsplash.com/photo-1600566753051-f0486d6a5f2f?w=800", caption: "Bungalow" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Interior" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Kitchen" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Historic Mansion in Garden District",
    description: "Grand Victorian mansion with original details, wraparound porch, and gardens.",
    price: 3250000,
    propertyType: "House",
    location: { address: "567 Garden Avenue", city: "New Orleans", state: "Louisiana", zipCode: "70115", country: "USA" },
    features: { bedrooms: 7, bathrooms: 6, area: 6800, parking: 4, yearBuilt: 1895, furnished: false },
    amenities: ["Garden", "Fireplace", "Balcony", "Security System"],
    images: [
      { url: "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?w=800", caption: "Victorian Beauty" },
      { url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800", caption: "Grand Entrance" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Formal Living" },
      { url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800", caption: "Library" },
      { url: "https://images.unsplash.com/photo-1600566752734-dd4567198300?w=800", caption: "Master Bedroom" }
    ],
    isFeatured: true,
    isApproved: true
  },
  {
    title: "Desert Oasis with Pool & Spa",
    description: "Contemporary desert home with resort-style pool, spa, and mountain views.",
    price: 1175000,
    propertyType: "House",
    location: { address: "444 Desert Vista", city: "Phoenix", state: "Arizona", zipCode: "85001", country: "USA" },
    features: { bedrooms: 4, bathrooms: 3, area: 3100, parking: 3, yearBuilt: 2020, furnished: false },
    amenities: ["Swimming Pool", "Garden", "Air Conditioning", "Solar Panels"],
    images: [
      { url: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800", caption: "Desert Modern" },
      { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", caption: "Pool & Spa" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Open Plan" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Gourmet Kitchen" }
    ],
    isFeatured: false,
    isApproved: true
  },
  {
    title: "Skyline Apartment with Rooftop Terrace",
    description: "Sophisticated apartment featuring private rooftop terrace and modern kitchen.",
    price: 975000,
    propertyType: "Apartment",
    location: { address: "221 High Street", city: "Seattle", state: "Washington", zipCode: "98102", country: "USA" },
    features: { bedrooms: 2, bathrooms: 2, area: 1650, parking: 1, yearBuilt: 2021, furnished: true },
    amenities: ["Balcony", "Gym", "Elevator", "WiFi"],
    images: [
      { url: "https://images.unsplash.com/photo-1600566752734-dd4567198300?w=800", caption: "Rooftop Views" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Living Area" },
      { url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800", caption: "Bedroom" },
      { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", caption: "Kitchen" }
    ],
    isFeatured: false,
    isApproved: true
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find an agent user
    let agent = await User.findOne({ role: 'agent' });
    
    if (!agent) {
      console.log('📝 No agent found, creating default agent...');
      agent = await User.create({
        name: 'System Agent',
        email: 'systemagent@realestate.com',
        password: 'agent123',
        role: 'agent',
        phone: '5555555555'
      });
      console.log('✅ Default agent created\n');
    }

    console.log(`👤 Using agent: ${agent.name} (${agent.email})\n`);

    // CLEAR EXISTING PROPERTIES FIRST (to avoid duplicates)
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing properties\n');

    // Get sample properties
    const sampleProps = getSampleProperties();

    // Insert properties ONE BY ONE to generate unique slugs
    console.log('📦 Adding properties...\n');
    const insertedProperties = [];

    for (let i = 0; i < sampleProps.length; i++) {
      const propData = {
        ...sampleProps[i],
        agent: agent._id
      };
      
      const property = await Property.create(propData);
      insertedProperties.push(property);
      console.log(`   ✅ Added: ${property.title}`);
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    console.log('\n==============================================');
    console.log(`✅ SUCCESS! Added ${insertedProperties.length} properties!`);
    console.log('==============================================\n');
    
    console.log('📊 Summary:');
    console.log(`   Total Properties: ${insertedProperties.length}`);
    console.log(`   Featured: ${insertedProperties.filter(p => p.isFeatured).length}`);
    console.log(`   Approved: ${insertedProperties.filter(p => p.isApproved).length}`);
    console.log(`   Total Value: $${insertedProperties.reduce((sum, p) => sum + p.price, 0).toLocaleString()}`);
    console.log(`   Total Images: ${insertedProperties.reduce((sum, p) => sum + p.images.length, 0)}`);
    
    console.log('\n🎉 Your database is now populated with beautiful properties!');
    console.log('🌐 Go to http://localhost:3000 to see them!\n');

    // Close connection
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();