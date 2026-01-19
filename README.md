# Todo App

A full-stack Todo application built with React, Node.js, Express, and MongoDB.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Toggle todo completion status
- ✅ Persistent storage with MongoDB
- ✅ Modern React frontend with TailwindCSS
- ✅ RESTful API with validation and error handling
- ✅ Environment-based configuration
- ✅ Development tools (nodemon, Vite HMR)

## Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- express-validator
- dotenv

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Setup

1. **Clone the repository** (if applicable)
   ```bash
   cd todo-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   copy .env.example .env
   # Edit .env and add your MongoDB Atlas connection string
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   copy .env.example .env
   # Edit .env if your backend is not on localhost:5000
   npm run dev
   ```

4. **Open the app**
   Navigate to `http://localhost:5173`

## Environment Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
todo-app/
├── backend/              # Express API server
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── .env             # Backend environment variables
│   └── server.js        # Server entry point
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Root component
│   │   └── main.jsx     # Entry point
│   └── .env             # Frontend environment variables
│
└── README.md            # This file
```

## Development

### Backend
```bash
cd backend
npm run dev  # Runs with nodemon for auto-reload
```

### Frontend
```bash
cd frontend
npm run dev  # Runs with Vite HMR
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Toggle todo completion
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/health` - Health check endpoint

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC
