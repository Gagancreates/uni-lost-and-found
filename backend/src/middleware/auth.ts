import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import config from '../config/config';

// Extend the Express Request interface
export interface AuthRequest extends Request {
  user?: { id: string; name: string; email: string; } | jwt.JwtPayload;
}

// Check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Authentication middleware
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    // Verify token
    const secret = config.jwtSecret;
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    
    // Ensure the user ID is a valid ObjectId if MongoDB is connected
    if (isMongoConnected() && decoded.id && typeof decoded.id === 'string') {
      try {
        // Validate that the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
          return res.status(401).json({ error: 'Invalid user ID in token.' });
        }
      } catch (err) {
        console.error('Error validating ObjectId:', err);
        return res.status(401).json({ error: 'Invalid user ID format.' });
      }
    }
    
    // Add user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Export default for easier imports
export default auth; 