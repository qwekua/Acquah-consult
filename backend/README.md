# Acquah Consult Backend API

This is the backend API for the Acquah Consult application tracking system.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the environment variables with your actual values

3. **Database Setup**
   - Make sure MongoDB is running locally or provide a MongoDB Atlas connection string
   - The application will automatically create the database and collections

4. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Applications
- `POST /api/applications/birth-certificate` - Submit birth certificate application
- `POST /api/applications/passport` - Submit passport application
- `POST /api/applications/both` - Submit both applications
- `GET /api/applications/my-applications` - Get user's applications

### Tracking
- `GET /api/tracking/application/:applicationId` - Track by application ID
- `POST /api/tracking/by-email` - Track by email address

### Health Check
- `GET /api/health` - API health status

## Deployment

### Render.com Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy!

## File Upload

Files are stored in the `uploads/` directory. In production, consider using cloud storage like AWS S3 or Cloudinary.

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Request rate limiting
- Input validation
- CORS protection
- Helmet security headers