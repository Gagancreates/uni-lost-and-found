# MongoDB Setup Guide

This guide provides instructions for setting up MongoDB for the Lost and Found application.

## Local Setup (Development)

1. **Install MongoDB Community Edition**:
   - Download and install from [MongoDB website](https://www.mongodb.com/try/download/community)
   - Follow the installation instructions for your operating system

2. **Start MongoDB Service**:
   - Windows: MongoDB should run as a service automatically
   - macOS/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`

3. **Configure Environment Variables**:
   - Create a `.env` file in the backend directory
   - Add the following line:
     ```
     MONGODB_URI=mongodb://localhost:27017/lostAndFound
     ```

4. **Test Connection**:
   - Run `node testAndRunServer.js` to verify the connection

## MongoDB Atlas Setup (Production)

1. **Create MongoDB Atlas Account**:
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a new project

2. **Create a Cluster**:
   - Choose the free tier option
   - Select a cloud provider and region closest to your users

3. **Configure Network Access**:
   - Add your IP address or set to allow access from anywhere for testing
   - In production, limit to your application server's IP

4. **Create Database User**:
   - Create a user with read/write privileges to your database

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string

6. **Configure Environment Variables**:
   - In your production environment, set:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
     ```
   - Replace `<username>`, `<password>`, `<cluster-url>`, and `<dbname>` with your values

## Database Structure

The application uses the following collections:

- **Users**: Stores user information and authentication details
- **Posts**: Stores lost and found item posts
- **Comments**: Stores comments on posts

## Testing the Connection

You can test your MongoDB connection using the utility script:

```bash
npx ts-node src/utils/testDbConnection.ts
```

This will attempt to connect to your MongoDB instance and return connection status. 