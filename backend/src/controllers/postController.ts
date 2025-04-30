import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post';
import uploadToCloudinary from '../utils/cloudinaryUpload';
import { AuthRequest } from '../middleware/auth';
import mockDb from '../utils/mockDb';

// Check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, location, currentLocation, contactInfo, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    let imageUrl: string | undefined;
    
    // If there's a file, upload it to Cloudinary
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path);
        imageUrl = result.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        imageUrl = undefined;
      }
    }

    // Create post data object
    const postData = {
      title,
      description,
      location,
      currentLocation,
      contactInfo,
      type,
      imageUrl,
      userId: isMongoConnected() ? new mongoose.Types.ObjectId(userId) : userId
    };

    let post;
    
    if (isMongoConnected()) {
      // Create new post in MongoDB
      post = await Post.create(postData);
    } else {
      // Create new post in mock database
      console.log('Using mock database for post creation');
      post = mockDb.createPost(postData);
    }

    res.status(201).json(post);
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Get all posts with optional filtering
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { type, location, page = 1, limit = 10 } = req.query;
    
    if (isMongoConnected()) {
      const filter: any = {};

      // Add filters if provided
      if (type) filter.type = type;
      if (location) filter.location = { $regex: location, $options: 'i' };

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);
      
      // Get posts with pagination
      const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      // Get total count for pagination
      const totalPosts = await Post.countDocuments(filter);

      res.json({
        posts,
        totalPages: Math.ceil(totalPosts / Number(limit)),
        currentPage: Number(page),
        totalPosts
      });
    } else {
      // Use mock database
      console.log('Using mock database for fetching posts');
      const result = mockDb.getPosts({
        type: type?.toString(),
        page: Number(page),
        limit: Number(limit)
      });
      
      res.json(result);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Get a post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    let post;
    
    if (isMongoConnected()) {
      post = await Post.findById(req.params.id);
    } else {
      console.log('Using mock database for fetching post by ID');
      post = mockDb.getPostById(req.params.id);
    }
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Update a post
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, location, currentLocation, contactInfo, type } = req.body;
    const userId = req.user?.id;
    const postId = req.params.id;

    let post;
    
    if (isMongoConnected()) {
      // Find the post in MongoDB
      post = await Post.findById(postId);
    } else {
      // Find the post in mock database
      console.log('Using mock database for post update');
      post = mockDb.getPostById(postId);
    }

    // Check if post exists
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Convert userId for comparison based on database type
    const postUserId = post.userId.toString();
    
    // Check if user owns the post
    if (postUserId !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post.' });
    }

    let imageUrl = post.imageUrl || post.imageUrl;
    
    // If there's a new file, upload it to Cloudinary
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path);
        imageUrl = result.secure_url;
      } catch (error) {
        console.error('Cloudinary upload error:', error);
      }
    }

    // Update data
    const updateData = {
      title,
      description,
      location,
      currentLocation,
      contactInfo,
      type,
      imageUrl
    };

    let updatedPost;
    
    if (isMongoConnected()) {
      // Update post in MongoDB
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        updateData,
        { new: true }
      );
    } else {
      // Update post in mock database
      updatedPost = mockDb.updatePost(postId, updateData);
    }

    if (!updatedPost) {
      return res.status(404).json({ error: 'Failed to update post.' });
    }

    res.json(updatedPost);
  } catch (error: any) {
    console.error('Update post error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Delete a post
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;

    let post;
    
    if (isMongoConnected()) {
      // Find the post in MongoDB
      post = await Post.findById(postId);
    } else {
      // Find the post in mock database
      console.log('Using mock database for post deletion');
      post = mockDb.getPostById(postId);
    }

    // Check if post exists
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Convert userId for comparison based on database type
    const postUserId = post.userId.toString();
    
    // Check if user owns the post
    if (postUserId !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post.' });
    }

    if (isMongoConnected()) {
      // Delete post from MongoDB
      await Post.findByIdAndDelete(postId);
    } else {
      // Delete post from mock database
      mockDb.deletePost(postId);
    }

    res.json({ message: 'Post deleted successfully.' });
  } catch (error: any) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export default {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
}; 