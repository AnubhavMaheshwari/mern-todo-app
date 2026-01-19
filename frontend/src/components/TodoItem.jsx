export default function TodoItem({ todo, onToggle, onDelete }) {
    const getDateStatus = () => {
        if (!todo.dueDate) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (todo.completed) return 'completed';
        if (dueDate < today) return 'overdue';
        if (dueDate.getTime() === today.getTime()) return 'today';
        return 'upcoming';
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    };

    const formatCompletedTime = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityClasses = () => {
        switch (todo.priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-blue-100 text-blue-700';
            default: return '';
        }
    };

    const getBorderClasses = () => {
        const status = getDateStatus();
        if (status === 'overdue' && !todo.completed)
            return 'border-l-4 border-red-600 bg-gradient-to-r from-red-50 to-white';
        if (status === 'today' && !todo.completed)
            return 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white';
        if (status === 'upcoming' && !todo.completed)
            return 'border-l-4 border-green-500';
        return '';
    };

    const dateStatus = getDateStatus();

    return (
        <div className={`flex justify-between items-start p-4 md:p-6 border-2 border-gray-200 rounded-xl transition-all hover:border-indigo-300 hover:shadow-md hover:translate-x-1 ${todo.completed ? 'bg-gray-50' : 'bg-white'
            } ${getBorderClasses()}`}>
            <div className="flex gap-4 flex-1">
                {/* Checkbox */}
                <div className="cursor-pointer p-1" onClick={() => onToggle(todo._id)}>
                    <div className={`checkbox ${todo.completed ? 'checked' : ''}`}>
                        {todo.completed && <span className="text-white text-lg font-bold">✓</span>}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                            {todo.title}
                        </span>
                        {todo.priority && (
                            <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide ${getPriorityClasses()}`}>
                                {todo.priority}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {todo.dueDate && (
                            <span className={`flex items-center gap-1 font-medium ${dateStatus === 'overdue' ? 'text-red-600' :
                                    dateStatus === 'today' ? 'text-yellow-600' :
                                        dateStatus === 'upcoming' ? 'text-green-600' : ''
                                }`}>
                                {dateStatus === 'overdue' && '🔴 '}
                                {dateStatus === 'today' && '🟡 '}
                                {dateStatus === 'upcoming' && '🟢 '}
                                {formatDate(todo.dueDate)}
                            </span>
                        )}
                        {todo.completed && todo.completedAt && (
                            <span className="text-green-600">
                                ✓ Completed {formatCompletedTime(todo.completedAt)}
                            </span>
                        )}
                        {todo.category && (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                🏷️ {todo.category}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Button */}
            <button
                onClick={() => onDelete(todo._id)}
                className="text-gray-400 text-xl p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all"
                aria-label="Delete todo"
            >
                ✕
            </button>
        </div>
    );
}
