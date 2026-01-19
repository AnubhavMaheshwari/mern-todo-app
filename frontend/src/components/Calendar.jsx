import { useState } from "react";

export default function Calendar({ todos, onDateClick, selectedDate }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const getTodosForDate = (day) => {
        const dateStr = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        ).toISOString().split('T')[0];

        return todos.filter(todo => {
            if (!todo.dueDate) return false;
            const todoDate = new Date(todo.dueDate).toISOString().split('T')[0];
            return todoDate === dateStr;
        });
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day) => {
        if (!selectedDate) return false;
        const selected = new Date(selectedDate);
        return (
            day === selected.getDate() &&
            currentMonth.getMonth() === selected.getMonth() &&
            currentMonth.getFullYear() === selected.getFullYear()
        );
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className=""></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayTodos = getTodosForDate(day);
        const completed = dayTodos.filter(t => t.completed).length;
        const pending = dayTodos.filter(t => !t.completed).length;
        const todayClass = isToday(day);
        const selectedClass = isSelected(day);

        days.push(
            <div
                key={day}
                onClick={() => {
                    const clickedDate = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                    );
                    onDateClick(clickedDate);
                }}
                className={`aspect-square p-2 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-1 ${selectedClass
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-700'
                        : todayClass
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-600'
                            : 'border-gray-200 bg-white hover:border-indigo-500 hover:shadow-md hover:scale-105'
                    }`}
            >
                <span className={`text-lg font-semibold ${selectedClass ? 'text-white' : 'text-gray-800'}`}>
                    {day}
                </span>
                {dayTodos.length > 0 && (
                    <div className="flex gap-1">
                        {completed > 0 && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" title={`${completed} completed`}></span>}
                        {pending > 0 && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" title={`${pending} pending`}></span>}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={goToPreviousMonth}
                    className="w-10 h-10 border-2 border-gray-300 bg-white rounded-xl text-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center"
                >
                    ←
                </button>

                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-indigo-200 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-600 hover:text-white transition-all"
                    >
                        Today
                    </button>
                </div>

                <button
                    onClick={goToNextMonth}
                    className="w-10 h-10 border-2 border-gray-300 bg-white rounded-xl text-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center"
                >
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center py-3 font-semibold text-gray-600 text-sm uppercase tracking-wide">
                        {day}
                    </div>
                ))}
                {days}
            </div>
        </div>
    );
}
