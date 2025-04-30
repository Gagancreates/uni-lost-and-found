
# uni-lost-and-found
I decided to build a lost and found website for my college, i saw a lot of people losing things and posting it on whatsapp groups, which were inefficient, so yeah that was why I built this out. 

# PESU Lost and Found Platform

A full-stack web application for PESU students to post and find lost or found items. Built with Next.js, Express, MongoDB, and Cloudinary.

## Tech Stack

### Frontend
- **Next.js** - React framework
- **TailwindCSS** - CSS framework
- **TypeScript** - Programming language

### Backend
- **Express** - Node.js web application framework
- **MongoDB Atlas** - Cloud database
- **Cloudinary** - Image storage service
- **JWT** - Authentication

## Directory Structure

- `/backend` - Express.js API with MongoDB integration
- `/frontend` - Next.js client application

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- MongoDB Atlas account (credentials already configured)
- Cloudinary account (credentials already configured)

### Running the Application

#### Quick Start (Windows)
Use the provided batch file to start both servers with a single command:
```bash
start-app.bat
```

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database with sample data:
   ```bash
   npx ts-node src/utils/initDb.ts
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The backend server will start on http://localhost:5000

#### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## Demo Account

You can use the following test account or create your own:
- Email: test@pesu.edu
- Password: password123
- SRN: PES1UG123456

## Features

- User authentication (login/register) with SRN validation
- Create posts for lost or found items
- Upload images to Cloudinary
- Filter posts by type (Lost/Found)
- Pagination for listing posts
- Responsive design
- Fallback mock database when MongoDB is unavailable

## Mock Database Mode

The application now includes a fallback mock database that automatically activates when MongoDB is unavailable. This ensures the app can function for testing and demonstration purposes without requiring a working MongoDB connection.

In mock database mode:
- The app will save data in memory (data will be lost when the server restarts)
- User registration and login will work with simplified authentication
- Post creation, reading, and management will function
- A test user account is pre-configured (see Demo Account details)
- Sample posts are created automatically

To check if you're in mock mode, visit `/health` endpoint which will show the database connection status.

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (requires authentication)

### Posts
- `GET /api/posts` - Get all posts (with optional filtering by type, location, and pagination)
- `GET /api/posts/:id` - Get a specific post by ID
- `POST /api/posts` - Create a new post (requires authentication)
- `PUT /api/posts/:id` - Update a post (requires authentication and ownership)
- `DELETE /api/posts/:id` - Delete a post (requires authentication and ownership)

## Deployment

The application is configured to run locally by default. To deploy to production:

1. Update the MongoDB and Cloudinary credentials for production
2. Update the API URLs in the frontend to point to your production backend
3. Build the frontend for production: `npm run build`
4. Build the backend for production: `npm run build`

## Troubleshooting

### Common Issues

#### "Failed to fetch" or Connection Errors
- Make sure the backend server is running on port 5000
- Check that you're running both the frontend and backend servers
- In Windows PowerShell, use `;` instead of `&&` to chain commands
- Check for firewall or antivirus software blocking the connection

#### MongoDB Connection Issues
- The app will now automatically use a mock database if MongoDB connection fails
- You can test functionality even without a working MongoDB connection
- If you want to use a real database, check your MongoDB Atlas credentials
- For local MongoDB, make sure it's installed and running on port 27017

#### Login/Registration Issues
- Ensure the MongoDB connection is working properly (or the app will use mock mode)
- Check that the SRN follows the format PESxUGxxxxxxx (e.g., PES1UG123456)
- Clear browser cookies and local storage if you're experiencing persistent issues

#### Image Upload Problems
- Verify that Cloudinary credentials are correct
- Ensure image files are less than 10MB
- Make sure the upload directory exists in the backend

### Checking Backend Status
To verify the backend is running properly, visit http://localhost:5000/health in your browser. You should see a response like:
```json
{ 
  "status": "ok",
  "database": "connected" 
}
```

If the database shows as "disconnected", the app is running in mock database mode. 
>>>>>>> 59a2bc5 (Remove node_modules from tracking and update .gitignore)
