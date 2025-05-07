# SwadExpress

A modern food delivery application built with React, TypeScript, and Node.js.

## Features

- User authentication and authorization
- Restaurant listings and search
- Menu management
- Order tracking
- Real-time updates
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Mongoose for ODM

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Dhamodran16/SwadExpress.git
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables
- Create `.env` file in backend directory
- Create `.env` file in frontend directory

4. Run the development servers
```bash
# Run both frontend and backend
npm run dev

# Or run separately
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

## Deployment

The application is configured for deployment on Vercel:
- Frontend: Static site deployment
- Backend: Serverless functions

## License

MIT
