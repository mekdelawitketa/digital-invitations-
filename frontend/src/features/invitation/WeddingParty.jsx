// frontend/src/features/invitation/Schedule.jsx

export const Schedule = ({ schedules }) => {
  if (!schedules || schedules.length === 0) return null;

  const sortedSchedules = [...schedules].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Event Schedule
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="space-y-4">
          {sortedSchedules.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="md:w-48 flex-shrink-0">
                <div className="text-sm font-medium text-blue-600">
                  {item.date && new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {item.startTime} {item.endTime && `- ${item.endTime}`}
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                {item.description && (
                  <p className="text-gray-600 text-sm">{item.description}</p>
                )}
                {item.location && (
                  <p className="text-gray-500 text-sm mt-1">📍 {item.location}</p>
                )}
              </div>

              <div className="text-2xl text-gray-300 hidden md:block">
                {index < sortedSchedules.length - 1 ? '↓' : '🎯'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};