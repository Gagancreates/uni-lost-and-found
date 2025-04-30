import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from '../models/Post';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lostAndFound';

async function listPosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection successful');
    
    // Find all posts
    const posts = await Post.find({}).populate('user', 'username email');
    
    console.log(`Found ${posts.length} posts:`);
    
    posts.forEach((post, index) => {
      console.log(`\n--- Post ${index + 1} ---`);
      console.log(`ID: ${post._id}`);
      console.log(`Title: ${post.title}`);
      console.log(`Type: ${post.type}`);
      console.log(`Category: ${post.category}`);
      console.log(`Location: ${post.location}`);
      console.log(`Created: ${post.createdAt}`);
      console.log(`User: ${post.user ? post.user.username : 'Unknown'}`);
      console.log(`Image URL: ${post.imageUrl || 'None'}`);
    });
    
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
  listPosts()
    .then(() => {
      console.log('Finished listing posts');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

export default listPosts; 