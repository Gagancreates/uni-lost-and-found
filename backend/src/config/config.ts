import dotenv from 'dotenv';

// Only load .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Configuration settings
export default {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lost-and-found',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_for_development',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  }
};

// // Make sure you've installed dotenv: npm install dotenv
// import dotenv from 'dotenv';
// import path from 'path';

// // Load environment variables from .env file located in the backend root
// dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// export default {
//   port: process.env.PORT || 5000,
//   mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lost-and-found',

//   jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_for_development',
//   cloudinary: {
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
//     apiKey: process.env.CLOUDINARY_API_KEY || '',
//     apiSecret: process.env.CLOUDINARY_API_SECRET || ''
//   }
// };



// Make sure you've installed dotenv: npm install dotenv
// import dotenv from 'dotenv';
// import path from 'path';

// // Load environment variables from .env file located in the backend root
// dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// export default {
//   port: process.env.PORT || 5000,
//   mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lost-and-found',

//   jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_for_development',
//   cloudinary: {
//     cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
//     apiKey: process.env.CLOUDINARY_API_KEY || '',
//     apiSecret: process.env.CLOUDINARY_API_SECRET || ''
//   }
// };