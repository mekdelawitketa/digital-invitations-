// frontend/src/features/owner/EventDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../api/events';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getById(id);
        setEvent(response.data);
      } catch (err) {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventsAPI.delete(id);
      navigate('/my-events');
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
        <p className="text-gray-500">{error}</p>
        <Link to="/my-events" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          ← Back to My Events
        </Link>
      </div>
    );
  }

  const typeEmojis = {
    wedding: '💒',
    birthday: '🎂',
    graduation: '🎓',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <span>{typeEmojis[event.typeKey]}</span>
            <span>{event.typeKey}</span>
            <span>•</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              event.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {event.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            to={`/invitation/${event.slug}`}
            target="_blank"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            👁️ Preview
          </Link>
          <Link
            to={`/my-events/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✏️ Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {event.rsvps?.length || 0}
          </div>
          <div className="text-sm text-gray-500">RSVPs</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {event.albums?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Albums</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {event.schedules?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Schedule Items</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {event.guestbook?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Guestbook Messages</div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ManagementCard
          title="Gallery"
          icon="🖼️"
          description="Manage event photos"
          link={`/my-events/${id}/gallery`}
        />
        <ManagementCard
          title="Videos"
          icon="🎬"
          description="Manage event videos"
          link={`/my-events/${id}/videos`}
        />
        <ManagementCard
          title="Schedule"
          icon="📅"
          description="Manage event timeline"
          link={`/my-events/${id}/schedule`}
        />
        <ManagementCard
          title="RSVP"
          icon="📋"
          description="View and manage RSVPs"
          link={`/my-events/${id}/rsvp`}
        />
        <ManagementCard
          title="Guestbook"
          icon="📝"
          description="Moderate guestbook messages"
          link={`/my-events/${id}/guestbook`}
        />
        <ManagementCard
          title="Song Suggestions"
          icon="🎵"
          description="Manage song requests"
          link={`/my-events/${id}/songs`}
        />
        {event.typeKey === 'wedding' && (
          <ManagementCard
            title="Wedding Party"
            icon="💒"
            description="Manage wedding party members"
            link={`/my-events/${id}/wedding-party`}
          />
        )}
        <ManagementCard
          title="Settings"
          icon="⚙️"
          description="Event settings and sections"
          link={`/my-events/${id}/settings`}
        />
      </div>
    </div>
  );
};

const ManagementCard = ({ title, icon, description, link }) => (
  <Link to={link} className="block">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow hover:border-blue-200">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <span className="ml-auto text-gray-300">→</span>
      </div>
    </div>
  </Link>
);