// frontend/src/features/invitation/EventInfo.jsx

export const EventInfo = ({ event }) => {
  const { venueName, venueAddress, startDate, description } = event;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Event Details
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-semibold text-gray-700 mb-2">Date & Time</h3>
            <p className="text-gray-600">
              {new Date(startDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-semibold text-gray-700 mb-2">Venue</h3>
            <p className="text-gray-600">{venueName}</p>
            {venueAddress && (
              <p className="text-gray-500 text-sm mt-1">{venueAddress}</p>
            )}
          </div>
        </div>

        {description && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 italic">{description}</p>
          </div>
        )}
      </div>
    </section>
  );
};