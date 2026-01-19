import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Calendar from "./Calendar";
import DateFilter from "./DateFilter";
import TodoItem from "./TodoItem";
import Stats from "./Stats";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TodoApp() {
    const { user, logout } = useAuth();
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState("list");
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetchTodos();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [todos, activeFilter, selectedDate]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_URL}/todos`);
            setTodos(response.data);
        } catch (err) {
            console.error("Error fetching todos:", err);
            setError("Failed to load todos. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...todos];

        if (selectedDate) {
            const dateStr = selectedDate.toISOString().split('T')[0];
            filtered = filtered.filter(todo => {
                if (!todo.dueDate) return false;
                const todoDate = new Date(todo.dueDate).toISOString().split('T')[0];
                return todoDate === dateStr;
            });
        } else {
            switch (activeFilter) {
                case 'today':
                    const today = new Date().toISOString().split('T')[0];
                    filtered = filtered.filter(todo => {
                        if (!todo.dueDate) return false;
                        return new Date(todo.dueDate).toISOString().split('T')[0] === today;
                    });
                    break;

                case 'week':
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    weekStart.setHours(0, 0, 0, 0);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    weekEnd.setHours(23, 59, 59, 999);

                    filtered = filtered.filter(todo => {
                        if (!todo.dueDate) return false;
                        const dueDate = new Date(todo.dueDate);
                        return dueDate >= weekStart && dueDate <= weekEnd;
                    });
                    break;

                case 'month':
                    const monthStart = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        1
                    );
                    const monthEnd = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        0,
                        23, 59, 59
                    );

                    filtered = filtered.filter(todo => {
                        if (!todo.dueDate) return false;
                        const dueDate = new Date(todo.dueDate);
                        return dueDate >= monthStart && dueDate <= monthEnd;
                    });
                    break;

                case 'overdue':
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(todo => {
                        if (!todo.dueDate || todo.completed) return false;
                        const dueDate = new Date(todo.dueDate);
                        dueDate.setHours(0, 0, 0, 0);
                        return dueDate < now;
                    });
                    break;
            }
        }

        setFilteredTodos(filtered);
    };

    const addTodo = async (e) => {
        if (e) e.preventDefault();

        if (!title.trim()) {
            setError("Please enter a task");
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const todoData = {
                title,
                dueDate: dueDate || null,
                priority
            };

            const response = await axios.post(`${API_URL}/todos`, todoData);
            setTodos([response.data, ...todos]);
            setTitle("");
            setDueDate("");
            setPriority("medium");
        } catch (err) {
            console.error("Error adding todo:", err);
            const errorMessage = err.response?.data?.error?.message || "Failed to add task";
            setError(errorMessage);
            setTimeout(() => setError(null), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleTodo = async (id) => {
        try {
            const response = await axios.put(`${API_URL}/todos/${id}`);
            setTodos(todos.map(t => (t._id === id ? response.data : t)));
        } catch (err) {
            console.error("Error toggling todo:", err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}/todos/${id}`);
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            console.error("Error deleting todo:", err);
        }
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setActiveFilter('all');
        setViewMode('list');
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setSelectedDate(null);
    };

    const getFilterTitle = () => {
        if (selectedDate) {
            return `Tasks for ${selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })}`;
        }
        switch (activeFilter) {
            case 'today': return "Today's Tasks";
            case 'week': return "This Week's Tasks";
            case 'month': return "This Month's Tasks";
            case 'overdue': return "Overdue Tasks";
            default: return "All Tasks";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 md:p-8">
            <div className="max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                            <span className="text-5xl">🎯</span> Goal Tracker
                        </h1>
                        <p className="text-white/80 mt-1 text-sm font-medium">Welcome back, {user?.name || 'User'}! 👋</p>
                    </div>
                    <div className="flex gap-3 items-center flex-wrap">
                        <div className="flex gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-6 py-2.5 rounded-xl font-semibold transition-all text-sm ${viewMode === 'list'
                                    ? 'bg-white text-indigo-600 shadow-lg scale-105'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                📋 List
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-6 py-2.5 rounded-xl font-semibold transition-all text-sm ${viewMode === 'calendar'
                                    ? 'bg-white text-indigo-600 shadow-lg scale-105'
                                    : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                📅 Calendar
                            </button>
                        </div>
                        <button
                            onClick={logout}
                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 shadow-xl transition-all hover:scale-105"
                            title="Logout"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/95 backdrop-blur-sm text-white px-6 py-4 rounded-2xl mb-6 flex justify-between items-center shadow-2xl border border-red-400 animate-slide-down">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⚠️</span>
                            <p className="font-medium">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-white text-2xl p-1 hover:bg-white/20 rounded-lg transition-all">✕</button>
                    </div>
                )}

                {/* Main Layout */}
                <div className="grid lg:grid-cols-[380px_1fr] gap-6">
                    {/* Sidebar */}
                    <aside className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        <DateFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                        <Stats currentMonth={currentMonth} />
                    </aside>

                    {/* Main Content */}
                    <main className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
                        {viewMode === 'calendar' ? (
                            <Calendar todos={todos} onDateClick={handleDateClick} selectedDate={selectedDate} />
                        ) : (
                            <>
                                {/* Add Todo Form */}
                                <form onSubmit={addTodo} className="mb-8 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
                                    <div className="grid grid-cols-1 gap-4">
                                        <input
                                            type="text"
                                            className="col-span-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-base font-medium placeholder:text-gray-400"
                                            placeholder="✍️ What do you need to do?"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            disabled={submitting}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input
                                                type="date"
                                                className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-base font-medium"
                                                value={dueDate}
                                                onChange={e => setDueDate(e.target.value)}
                                                disabled={submitting}
                                            />

                                            <select
                                                className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all text-base font-medium"
                                                value={priority}
                                                onChange={e => setPriority(e.target.value)}
                                                disabled={submitting}
                                            >
                                                <option value="low">🟢 Low Priority</option>
                                                <option value="medium">🟡 Medium Priority</option>
                                                <option value="high">🔴 High Priority</option>
                                            </select>

                                            <button
                                                type="submit"
                                                disabled={submitting || !title.trim()}
                                                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-base hover:-translate-y-1 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                                            >
                                                {submitting ? "Adding..." : "+ Add Task"}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Todos Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-800">{getFilterTitle()}</h2>
                                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                                            {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}
                                        </span>
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-16">
                                            <div className="w-14 h-14 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-gray-500 font-medium">Loading your tasks...</p>
                                        </div>
                                    ) : filteredTodos.length === 0 ? (
                                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                                            <div className="text-7xl mb-4">
                                                {activeFilter === 'overdue' ? '🎉' : selectedDate ? '📭' : '✨'}
                                            </div>
                                            <p className="text-xl font-semibold text-gray-700 mb-2">
                                                {activeFilter === 'overdue'
                                                    ? "All caught up!"
                                                    : selectedDate
                                                        ? "No tasks for this date"
                                                        : "No tasks yet"
                                                }
                                            </p>
                                            <p className="text-gray-500">
                                                {activeFilter === 'overdue'
                                                    ? "You're on top of everything! 🎊"
                                                    : "Start by adding your first task above"
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filteredTodos.map(todo => (
                                                <TodoItem
                                                    key={todo._id}
                                                    todo={todo}
                                                    onToggle={toggleTodo}
                                                    onDelete={deleteTodo}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
