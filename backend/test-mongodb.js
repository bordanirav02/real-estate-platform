// ================================================
// TEST MONGODB CONNECTION
// File: backend/test-mongodb.js
// Purpose: Verify MongoDB local installation works
// ================================================

const mongoose = require('mongoose');
require('dotenv').config();

console.log('==============================================');
console.log('🔍 Testing MongoDB Local Connection...');
console.log('==============================================\n');

console.log('📝 Configuration:');
console.log('   Connection String:', process.env.MONGODB_URI);
console.log('   Node Environment:', process.env.NODE_ENV || 'Not set');
console.log('\n⏳ Attempting to connect...\n');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('==============================================');
    console.log('✅ SUCCESS! MongoDB Connected Successfully!');
    console.log('==============================================\n');
    
    console.log('📦 Database Details:');
    console.log('   Database Name:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);
    console.log('   Ready State:', mongoose.connection.readyState, '(1 = connected)');
    
    console.log('\n🎉 Your local MongoDB is working perfectly!');
    console.log('🚀 You can now start building your application!\n');
    console.log('==============================================');
    
    // Close connection
    mongoose.connection.close();
    console.log('\n✅ Connection closed gracefully.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.log('==============================================');
    console.error('❌ ERROR: Could not connect to MongoDB');
    console.log('==============================================\n');
    
    console.error('💥 Error Details:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code || 'N/A');
    
    console.log('\n💡 Troubleshooting Steps:');
    console.log('   1. Make sure MongoDB is installed on your computer');
    console.log('   2. Check if MongoDB service is running:');
    console.log('      Windows: net start | findstr MongoDB');
    console.log('      Mac: brew services list');
    console.log('      Linux: sudo systemctl status mongod');
    console.log('   3. Verify your .env file has: MONGODB_URI=mongodb://localhost:27017/realestate');
    console.log('   4. Try restarting MongoDB service');
    console.log('   5. Check if port 27017 is not blocked by firewall\n');
    
    console.log('==============================================\n');
    process.exit(1);
  });