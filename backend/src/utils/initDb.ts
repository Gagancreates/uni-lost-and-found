import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Post from '../models/Post';
import config from '../config/config';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGODB_URI = config.mongodbUri;

const initDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas for initialization');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create a test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@pesu.edu',
      password: 'password123',
      srn: 'PES1UG123456'
    });

    console.log('Created test user:', user.email);

    // Create sample posts
    const samplePosts = [
      {
        title: 'Lost iPhone 13',
        description: 'I lost my iPhone 13 Pro Max in the EC Block. It has a blue case with my ID inside.',
        location: 'EC Block, PESU',
        contactInfo: 'Email: test@pesu.edu or call: 123-456-7890',
        type: 'Lost',
        imageUrl: 'https://res.cloudinary.com/dzldppgax/image/upload/v1716060345/lost-and-found/phone_sample.jpg',
        userId: user._id
      },
      {
        title: 'Found Wallet',
        description: 'Found a black leather wallet near the cafeteria.',
        location: 'Cafeteria, PESU',
        currentLocation: 'I am keeping it at the reception',
        contactInfo: 'Email: test@pesu.edu',
        type: 'Found',
        imageUrl: 'https://res.cloudinary.com/dzldppgax/image/upload/v1716060345/lost-and-found/wallet_sample.jpg',
        userId: user._id
      }
    ];

    const posts = await Post.insertMany(samplePosts);
    console.log(`Created ${posts.length} sample posts`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run initialization
initDb(); 