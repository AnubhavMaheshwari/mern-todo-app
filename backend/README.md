# Todo App Backend

Professional REST API for a Todo application built with Node.js, Express, and MongoDB.

## Features

- ✅ RESTful API endpoints for CRUD operations
- ✅ MongoDB database with Mongoose ODM
- ✅ Input validation with express-validator
- ✅ Comprehensive error handling
- ✅ Environment-based configuration
- ✅ CORS enabled for frontend integration
- ✅ Timestamps for todo items

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_atlas_connection_string
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The server will start on the port specified in `.env` (default: 5000)

4. **Start Production Server**
   ```bash
   npm start
   ```

## API Endpoints

### Get All Todos
```
GET /api/todos
```
Returns all todos sorted by creation date (newest first)

### Create Todo
```
POST /api/todos
Content-Type: application/json

{
  "title": "My new todo"
}
```
Creates a new todo item

### Toggle Todo Completion
```
PUT /api/todos/:id
```
Toggles the completion status of a todo

### Delete Todo
```
DELETE /api/todos/:id
```
Deletes a todo item

### Health Check
```
GET /api/health
```
Returns server status and environment information

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | Required |
| `CORS_ORIGIN` | Allowed frontend origin | http://localhost:5173 |

## Error Handling

The API returns consistent error responses:

```json
{
  "error": {
    "message": "Error description",
    "details": "Additional details (if available)"
  }
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Development

- Uses `nodemon` for auto-reload during development
- Run with `npm run dev` for development mode
- Check logs for MongoDB connection status and errors

## Project Structure

```
backend/
├── models/
│   └── Todo.js           # Mongoose schema
├── routes/
│   └── todoRoutes.js     # API routes
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
├── server.js             # Main application file
└── package.json          # Dependencies and scripts
```
