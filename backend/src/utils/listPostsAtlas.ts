import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post';
import User from '../models/User';
import config from '../config/config';

dotenv.config();

const MONGODB_URI = config.mongodbUri;

async function listPostsAtlas() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas connection successful');
    
    // Find all posts (without populate)
    const posts = await Post.find({});
    
    console.log(`Found ${posts.length} posts:`);
    
    // Process posts
    for (const post of posts) {
      console.log(`\n--- Post ---`);
      console.log(`ID: ${post._id}`);
      console.log(`Title: ${post.title}`);
      console.log(`Type: ${post.type}`);
      console.log(`Location: ${post.location}`);
      console.log(`Created: ${post.createdAt}`);
      
      // Look up user separately if needed
      if (post.userId) {
        try {
          const user = await User.findById(post.userId);
          console.log(`User ID: ${post.userId}`);
          console.log(`User Name: ${user ? user.name : 'Unknown'}`);
          console.log(`User Email: ${user ? user.email : 'Unknown'}`);
        } catch (err) {
          console.log(`User ID: ${post.userId} (User details unavailable)`);
        }
      } else {
        console.log(`User: None`);
      }
      
      console.log(`Image URL: ${post.imageUrl || 'None'}`);
    }
    
    return posts;
  } catch (error) {
    console.error('Error:', error);
    return [];
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  listPostsAtlas()
    .then(() => {
      console.log('Finished listing posts');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

export default listPostsAtlas; 