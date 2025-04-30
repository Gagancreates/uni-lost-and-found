// Configuration settings
export default {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://gagan:Trust%3Dgod100%40@cluster0.7ucwa41.mongodb.net/lost-and-found?retryWrites=true&w=majority&appName=Cluster0',

  jwtSecret: process.env.JWT_SECRET || 'pesu_lost_and_found_secret_key_2024',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dzldppgax',
    apiKey: process.env.CLOUDINARY_API_KEY || '952951658641325',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '1QI487fazkYIK5-xM5xYKkxtlzs'
  }
}; 