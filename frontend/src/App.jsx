import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TodoApp from "./components/TodoApp";
import Login from "./components/Login";
import Signup from "./components/Signup";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showLogin ? (
      <Login onToggleForm={() => setShowLogin(false)} />
    ) : (
      <Signup onToggleForm={() => setShowLogin(true)} />
    );
  }

  return <TodoApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
