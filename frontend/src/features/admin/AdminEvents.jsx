// frontend/src/features/admin/AdminEvents.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/admin';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, wedding, birthday, graduation
  const [publishFilter, setPublishFilter] = useState('all'); // all, published, draft

  useEffect(() => {
    fetchEvents();
  }, [filter, publishFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.type = filter;
      if (publishFilter === 'published') params.isPublished = true;
      if (publishFilter === 'draft') params.isPublished = false;
      
      const response = await adminAPI.getEvents(params);
      setEvents(response.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (eventId) => {
    try {
      await adminAPI.toggleEventPublish(eventId);
      fetchEvents();
    } catch (error) {
      alert('Failed to toggle publish status');
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await adminAPI.deleteEvent(eventId);
      fetchEvents();
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const typeEmojis = {
    wedding: '💒',
    birthday: '🎂',
    graduation: '🎓',
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-500 mt-1">Manage all events on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('wedding')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'wedding' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          💒 Wedding
        </button>
        <button
          onClick={() => setFilter('birthday')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'birthday' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🎂 Birthday
        </button>
        <button
          onClick={() => setFilter('graduation')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'graduation' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🎓 Graduation
        </button>
        <span className="w-px bg-gray-300 mx-2" />
        <button
          onClick={() => setPublishFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            publishFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Status
        </button>
        <button
          onClick={() => setPublishFilter('published')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            publishFilter === 'published' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✅ Published
        </button>
        <button
          onClick={() => setPublishFilter('draft')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            publishFilter === 'draft' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📝 Draft
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">No events found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVPs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-2xl">{typeEmojis[event.typeKey]}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.owner?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(event.id)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          event.isPublished
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {event.isPublished ? '✅ Published' : '📝 Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event._count?.rsvps || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/invitation/${event.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};