import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Stats({ currentMonth }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [currentMonth]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const monthStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
            const response = await axios.get(`${API_URL}/todos/stats/${monthStr}`);
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span>📊</span> Monthly Overview
                </h3>
                <div className="text-center text-gray-400 py-8">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    // Only show stats if there are todos
    if (stats.totalTodos === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span>📊</span> Monthly Overview
                </h3>
                <div className="text-center py-8">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-gray-500 text-sm">No tasks this month yet</p>
                </div>
            </div>
        );
    }

    const getProgressColor = () => {
        if (stats.completionRate >= 80) return 'progress-excellent';
        if (stats.completionRate >= 60) return 'progress-good';
        if (stats.completionRate >= 40) return 'progress-average';
        return 'progress-low';
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <span>📊</span> Monthly Overview
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl text-center border border-indigo-200">
                    <div className="text-3xl mb-1">📝</div>
                    <div className="text-2xl font-bold text-indigo-900">{stats.totalTodos}</div>
                    <div className="text-xs text-indigo-700 uppercase tracking-wide font-semibold mt-1">Total</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200">
                    <div className="text-3xl mb-1">✅</div>
                    <div className="text-2xl font-bold text-green-900">{stats.completedTodos}</div>
                    <div className="text-xs text-green-700 uppercase tracking-wide font-semibold mt-1">Done</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl text-center border border-amber-200">
                    <div className="text-3xl mb-1">⏳</div>
                    <div className="text-2xl font-bold text-amber-900">{stats.pendingTodos}</div>
                    <div className="text-xs text-amber-700 uppercase tracking-wide font-semibold mt-1">Pending</div>
                </div>

                {stats.overdueTodos > 0 ? (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center border border-red-200">
                        <div className="text-3xl mb-1">⚠️</div>
                        <div className="text-2xl font-bold text-red-900">{stats.overdueTodos}</div>
                        <div className="text-xs text-red-700 uppercase tracking-wide font-semibold mt-1">Overdue</div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center border border-gray-200">
                        <div className="text-3xl mb-1">🎉</div>
                        <div className="text-2xl font-bold text-gray-900">0</div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold mt-1">Overdue</div>
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-700 text-sm">Completion Rate</span>
                    <span className="text-xl font-bold text-indigo-600">{stats.completionRate}%</span>
                </div>
                <div className="h-2.5 bg-white rounded-full overflow-hidden border border-gray-200">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor()}`}
                        style={{ width: `${stats.completionRate}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
