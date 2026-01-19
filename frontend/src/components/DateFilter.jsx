export default function DateFilter({ activeFilter, onFilterChange }) {
    const filters = [
        { id: 'all', label: 'All Tasks', icon: '📋' },
        { id: 'today', label: 'Today', icon: '📅' },
        { id: 'week', label: 'This Week', icon: '📆' },
        { id: 'month', label: 'This Month', icon: '🗓️' },
        { id: 'overdue', label: 'Overdue', icon: '⚠️' }
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter by Date</h3>
            <div className="flex flex-col gap-2">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex items-center gap-4 p-3 rounded-xl border-2 font-medium text-sm transition-all ${activeFilter === filter.id
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-700 shadow-md'
                                : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100 hover:translate-x-1'
                            }`}
                    >
                        <span className="text-xl">{filter.icon}</span>
                        <span>{filter.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
