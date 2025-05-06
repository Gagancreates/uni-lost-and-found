import mongoose, { Document, Schema } from 'mongoose';

// Define the Post interface
export interface IPost extends Document {
  title: string;
  description: string;
  location: string;
  currentLocation?: string; // Only for 'Found' items
  contactInfo: string;
  type: 'Lost' | 'Found';
  imageUrl?: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Post schema
const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    currentLocation: {
      type: String,
      trim: true
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: [true, 'Type is required']
    },
    imageUrl: {
      type: String
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    }
  },
  {
    timestamps: true // This will add createdAt and updatedAt fields
  }
);

// Create and export the Post model
export default mongoose.model<IPost>('Post', PostSchema); 