# Todo App Frontend

Modern React-based frontend for a Todo application built with Vite and TailwindCSS.

## Features

- ✅ React 19 with modern hooks
- ✅ Vite for fast development and building
- ✅ TailwindCSS for styling
- ✅ Axios for API requests
- ✅ Environment-based configuration
- ✅ Loading states and error handling
- ✅ Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running

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
   
   Update the `.env` file with your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:5173`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Features

### User Interface
- Add new todos with Enter key or Add button
- Click on todo text to toggle completion status
- Delete todos with the × button
- Visual feedback with loading states
- Error messages for failed operations
- Empty state when no todos exist

### Error Handling
- Connection errors display user-friendly messages
- Validation errors from the backend are shown
- Dismissible error notifications

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | http://localhost:5000/api |

## Development

- Hot module replacement (HMR) enabled
- ESLint configured for code quality
- TailwindCSS for utility-first styling

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── TodoApp.jsx    # Main todo component
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

1. Ensure the backend server is running
2. Start the development server
3. Navigate to `http://localhost:5173`
4. Start adding todos!
