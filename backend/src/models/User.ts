import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  srn?: string; // SRN (Student Registration Number) for PESU students
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// Create the User schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    srn: {
      type: String,
      trim: true,
      match: [/^PES\dUG\d{6}$/, 'SRN must be in the format PESxUGxxxxxxx (e.g., PES1UG123456)']
    }
  },
  {
    timestamps: true // This will add createdAt and updatedAt fields
  }
);

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
export default mongoose.model<IUser>('User', UserSchema); 