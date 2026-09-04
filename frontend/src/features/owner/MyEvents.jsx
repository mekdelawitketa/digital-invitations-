// frontend/src/features/owner/MyEvents.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../api/events';
import { useAuthStore } from '../../store/authStore';

export const MyEvents = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventsAPI.getAll();
        // Filter events by owner
        const userEvents = response.data.filter(e => e.ownerId === user.id);
        setEvents(userEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user.id, refresh]);

  const filteredEvents = events.filter((event) => {
    if (filter === 'published') return event.isPublished;
    if (filter === 'draft') return !event.isPublished;
    return true;
  });

  const handleRefresh = () => {
    setRefresh(prev => !prev);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
          <p className="text-gray-500 mt-1">Manage all your digital invitations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            🔄 Refresh
          </button>
          <Link
            to="/my-events/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Create New Event
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['all', 'published', 'draft'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {events.filter(e => tab === 'all' || (tab === 'published' ? e.isPublished : !e.isPublished)).length}
            </span>
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? "You haven't created any events yet." 
              : `You don't have any ${filter} events.`}
          </p>
          <Link
            to="/my-events/create"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first event →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }) => {
  const typeEmojis = {
    wedding: '💒',
    birthday: '🎂',
    graduation: '🎓',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-blue-50 to-purple-50">
            {typeEmojis[event.typeKey] || '📋'}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            event.isPublished
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {event.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <span>{typeEmojis[event.typeKey]}</span>
          <span>{event.typeKey}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          📅 {new Date(event.startDate).toLocaleDateString()}
        </p>
        {event.venueName && (
          <p className="text-sm text-gray-500 truncate">📍 {event.venueName}</p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/my-events/${event.id}`}
            className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Manage
          </Link>
          <Link
            to={`/invitation/${event.slug}`}
            target="_blank"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            👁️ View
          </Link>
        </div>
      </div>
    </div>
  );
};