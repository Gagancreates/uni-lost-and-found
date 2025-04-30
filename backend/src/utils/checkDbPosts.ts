import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post';
import config from '../config/config';

dotenv.config();

const MONGODB_URI = config.mongodbUri;

async function checkDbPosts() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas connection successful');
    
    // Count posts
    const postCount = await Post.countDocuments();
    console.log(`Total posts in database: ${postCount}`);
    
    // Check for posts with missing fields
    const postsWithMissingTitle = await Post.countDocuments({ title: { $exists: false } });
    const postsWithMissingDescription = await Post.countDocuments({ description: { $exists: false } });
    const postsWithMissingType = await Post.countDocuments({ type: { $exists: false } });
    const postsWithMissingLocation = await Post.countDocuments({ location: { $exists: false } });
    
    console.log('\nData quality check:');
    console.log(`Posts with missing title: ${postsWithMissingTitle}`);
    console.log(`Posts with missing description: ${postsWithMissingDescription}`);
    console.log(`Posts with missing type: ${postsWithMissingType}`);
    console.log(`Posts with missing location: ${postsWithMissingLocation}`);
    
    // Check for posts without valid user reference
    const postsWithoutUser = await Post.countDocuments({ userId: { $exists: false } });
    console.log(`Posts without user reference: ${postsWithoutUser}`);
    
    // Check post types distribution
    const lostItems = await Post.countDocuments({ type: 'Lost' });
    const foundItems = await Post.countDocuments({ type: 'Found' });
    
    console.log('\nPost types:');
    console.log(`Lost items: ${lostItems}`);
    console.log(`Found items: ${foundItems}`);
    
    return {
      total: postCount,
      missingFields: {
        title: postsWithMissingTitle,
        description: postsWithMissingDescription,
        type: postsWithMissingType,
        location: postsWithMissingLocation
      },
      types: {
        lost: lostItems,
        found: foundItems
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return null;
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  checkDbPosts()
    .then(result => {
      console.log('\nCheck completed');
      if (result && result.total > 0) {
        console.log('Database contains valid posts');
      } else {
        console.log('No posts found or database issue detected');
      }
      process.exit(0);
    })
    .catch(err => {
      console.error('Error during check:', err);
      process.exit(1);
    });
}

export default checkDbPosts; 