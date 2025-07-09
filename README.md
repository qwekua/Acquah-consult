# Acquah Consult - Document Application Tracking System

A complete full-stack web application for assisting people in applying for passports and birth certificates in Ghana. This system collects applications and allows users to track their application status.

## 🎯 Purpose

This website is **not for issuing** passports or birth certificates. It is only for **collecting applications** and allowing users to **track** their application status.

## 🚀 Features

### Frontend Features
- **Homepage**: Service overview, pricing, and social media links
- **User Authentication**: Registration and login system
- **Application Forms**: Birth certificate and passport application forms
- **Document Upload**: Support for Ghana Card and birth certificate uploads
- **Application Tracking**: Track applications by ID or email
- **Responsive Design**: Mobile-friendly interface
- **Real-time Status Updates**: Live application status tracking

### Backend Features
- **REST API**: Complete API for all frontend operations
- **JWT Authentication**: Secure user authentication
- **File Upload**: Handle document uploads with validation
- **MongoDB Integration**: Persistent data storage
- **Application Management**: Create and track applications
- **Status History**: Track application progress over time
- **Security Features**: Rate limiting, input validation, CORS protection

## 🛠 Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Axios (HTTP client)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing
- Express Validator for input validation

## 📁 Project Structure

```
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── server.js        # Entry point
│   ├── uploads/             # File uploads directory
│   ├── package.json
│   └── .env.example
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Quick Start

## 🌐 Live Demo

- **Frontend**: https://acquahconsult.netlify.app
- **Backend API**: https://acquah-consult-backend.vercel.app
- **Documentation**: See DEPLOYMENT.md for full setup guide

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Applications
- `POST /api/applications/birth-certificate` - Submit birth certificate application
- `POST /api/applications/passport` - Submit passport application
- `POST /api/applications/both` - Submit both applications
- `GET /api/applications/my-applications` - Get user's applications

### Tracking
- `GET /api/tracking/application/:id` - Track by application ID
- `POST /api/tracking/by-email` - Track by email address

## 🚀 Deployment

### Backend (Render.com)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

### Frontend (Netlify/GitHub Pages)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables for production API URL

## 💰 Pricing

- **Birth Certificate**: GHC 400 (10 working days)
- **Passport**: GHC 1,400 (10 working days)
- **Both Documents**: GHC 1,800 (combined)

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Request rate limiting
- Input validation and sanitization
- CORS protection
- File upload validation
- Helmet security headers

## 📱 Social Media Integration

The application includes placeholder links for:
- Facebook
- Instagram
- WhatsApp
- Twitter/X

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and inquiries, please contact Acquah Consult through the provided social media channels or email.