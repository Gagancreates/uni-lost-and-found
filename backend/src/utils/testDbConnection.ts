import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '../config/config';

dotenv.config();

const MONGODB_URI = config.mongodbUri;

async function testConnection() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas connection successful');
    
    // List all collections
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Collections:');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    } else {
      console.log('Database connection exists but db object is not available');
    }
    
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then(success => {
      console.log(`Connection test ${success ? 'passed' : 'failed'}`);
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('Test failed with error:', err);
      process.exit(1);
    });
}

export default testConnection; 