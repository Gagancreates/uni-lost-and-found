// Mock in-memory database to use when MongoDB is unavailable
import mongoose from 'mongoose';

class MockDatabase {
  private users: any[] = [];
  private posts: any[] = [];
  private nextUserId = 1;
  private nextPostId = 1;

  // Helper to generate MongoDB-like ObjectId strings
  private generateObjectId() {
    return new mongoose.Types.ObjectId().toString();
  }

  // User methods
  findUserByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }

  createUser(userData: any) {
    const id = this.generateObjectId();
    const newUser = {
      _id: id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Post methods
  getPosts(options: { type?: string, page?: number, limit?: number } = {}) {
    const { type, page = 1, limit = 10 } = options;
    let filteredPosts = this.posts;
    
    if (type) {
      filteredPosts = filteredPosts.filter(post => post.type === type);
    }
    
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      posts: filteredPosts.slice(startIndex, endIndex),
      totalPages,
      currentPage: page,
      totalPosts
    };
  }

  getPostById(id: string | number) {
    return this.posts.find(post => post._id.toString() === id.toString());
  }

  createPost(postData: any) {
    // Generate MongoDB-compatible ObjectId string
    const id = this.generateObjectId();
    const newPost = {
      _id: id,
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.posts.push(newPost);
    return newPost;
  }

  updatePost(id: string | number, postData: any) {
    const index = this.posts.findIndex(post => post._id.toString() === id.toString());
    if (index !== -1) {
      this.posts[index] = {
        ...this.posts[index],
        ...postData,
        updatedAt: new Date()
      };
      return this.posts[index];
    }
    return null;
  }

  deletePost(id: string | number) {
    const index = this.posts.findIndex(post => post._id.toString() === id.toString());
    if (index !== -1) {
      const deleted = this.posts.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  // Initialize with sample data
  initializeWithSampleData() {
    // Create test user
    const testUser = this.createUser({
      name: 'Test User',
      email: 'test@pesu.edu',
      password: 'password123',
      srn: 'PES1UG123456'
    });

    // Create sample posts
    this.createPost({
      title: 'Lost iPhone 13',
      description: 'I lost my iPhone 13 Pro Max in the EC Block. It has a blue case with my ID inside.',
      location: 'EC Block, PESU',
      contactInfo: 'Email: test@pesu.edu or call: 123-456-7890',
      type: 'Lost',
      imageUrl: 'https://res.cloudinary.com/dzldppgax/image/upload/v1716060345/lost-and-found/phone_sample.jpg',
      userId: testUser._id
    });

    this.createPost({
      title: 'Found Wallet',
      description: 'Found a black leather wallet near the cafeteria.',
      location: 'Cafeteria, PESU',
      currentLocation: 'I am keeping it at the reception',
      contactInfo: 'Email: test@pesu.edu',
      type: 'Found',
      imageUrl: 'https://res.cloudinary.com/dzldppgax/image/upload/v1716060345/lost-and-found/wallet_sample.jpg',
      userId: testUser._id
    });
  }
}

export const mockDb = new MockDatabase();
mockDb.initializeWithSampleData();

export default mockDb; 