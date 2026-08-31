// frontend/src/features/invitation/Location.jsx

export const Location = ({ event }) => {
  const { venueName, venueAddress, googleMapsUrl } = event;

  if (!venueName && !venueAddress) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Location
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>

        <div className="bg-gray-50 rounded-xl p-6 md:p-8 text-center">
          <div className="text-4xl mb-4">📍</div>
          {venueName && (
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {venueName}
            </h3>
          )}
          {venueAddress && (
            <p className="text-gray-600 mb-4">{venueAddress}</p>
          )}
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </section>
  );
};