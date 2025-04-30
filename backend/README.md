# Lost and Found Backend

This is the backend API for the Lost and Found platform, built with Node.js, Express, TypeScript, MongoDB, and Cloudinary.

## Features

- User authentication (register, login)
- Post management (create, read, update, delete)
- Image uploads via Cloudinary
- Pagination and filtering for posts
- JWT-based authentication

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

## Setup and Installation

1. Clone the repository
2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost-and-found
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the development server:
```
npm run dev
```

5. Build for production:
```
npm run build
```

6. Start production server:
```
npm start
```

## Database Initialization

To initialize the database with a test user and sample posts:

```
npx ts-node src/utils/initDb.ts
```

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB (with Mongoose)
- JWT for authentication
- Multer for file uploads
- Cloudinary for image storage 