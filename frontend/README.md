# Acquah Consult Frontend

This is the frontend application for the Acquah Consult document application tracking system.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the API URL to match your backend server

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment

### GitHub Pages / Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Make sure to configure the API URL environment variable

### GitHub Pages (using gh-pages)
```bash
npm run deploy
```

## Features

- User registration and authentication
- Birth certificate application form
- Passport application form
- Application tracking system
- Responsive design
- Real-time status updates

## Tech Stack

- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Axios (HTTP client)
- Vite (build tool)

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```