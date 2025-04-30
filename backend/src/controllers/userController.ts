import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import config from '../config/config';
import mockDb from '../utils/mockDb';
import { AuthRequest } from '../middleware/auth';

// Check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Generate JWT token
const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, srn } = req.body;

    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists with this email.' });
      }

      // Create new user in MongoDB
      const user = await User.create({
        name,
        email,
        password,
        srn
      });

      // Generate token and return user info
      const token = generateToken(user);
      
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        srn: user.srn,
        token
      });
    } else {
      // Use mock database when MongoDB is unavailable
      console.log('Using mock database for registration');
      
      // Check if user already exists in mock DB
      const userExists = mockDb.findUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ error: 'User already exists with this email.' });
      }

      // Create new user in mock DB
      const user = mockDb.createUser({
        name,
        email,
        password, // Note: In a real app, we'd still hash this
        srn
      });

      // Generate token and return user info
      const token = generateToken(user);
      
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        srn: user.srn,
        token
      });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if MongoDB is connected
    if (isMongoConnected()) {
      // Find user by email in MongoDB
      const user = await User.findOne({ email });
      
      // Check if user exists and password is correct
      if (user && (await user.comparePassword(password))) {
        // Generate token and return user info
        const token = generateToken(user);
        
        res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          srn: user.srn,
          token
        });
      } else {
        res.status(401).json({ error: 'Invalid email or password.' });
      }
    } else {
      // Use mock database when MongoDB is unavailable
      console.log('Using mock database for login');
      
      // Find user by email in mock DB
      const user = mockDb.findUserByEmail(email);
      
      // Very simple password check for mock DB
      if (user && user.password === password) {
        // Generate token and return user info
        const token = generateToken(user);
        
        res.json({
          id: user._id,
          name: user.name,
          email: user.email,
          srn: user.srn,
          token
        });
      } else {
        res.status(401).json({ error: 'Invalid email or password.' });
      }
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Server error during login' });
  }
};

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in request.' });
    }

    // For simplicity, we're just returning the user info from the token
    // since the mock database doesn't support findById
    res.json({
      id: userId,
      name: req.user?.name,
      email: req.user?.email
    });
  } catch (error: any) {
    console.error('Profile error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

export default {
  register,
  login,
  getProfile
}; 