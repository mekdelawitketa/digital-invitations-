// frontend/src/features/owner/OwnerDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { eventsAPI } from '../../api/events';

export const OwnerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalEvents: 0,
    published: 0,
    drafts: 0,
    totalRSVPs: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await eventsAPI.getAll({ ownerId: user.id });
        const events = response.data || [];
        
        setRecentEvents(events.slice(0, 5));
        setStats({
          totalEvents: events.length,
          published: events.filter(e => e.isPublished).length,
          drafts: events.filter(e => !e.isPublished).length,
          totalRSVPs: events.reduce((sum, e) => sum + (e.rsvps?.length || 0), 0),
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Events', value: stats.totalEvents, icon: '📋', color: 'bg-blue-500' },
    { label: 'Published', value: stats.published, icon: '✅', color: 'bg-green-500' },
    { label: 'Drafts', value: stats.drafts, icon: '📝', color: 'bg-yellow-500' },
    { label: 'Total RSVPs', value: stats.totalRSVPs, icon: '📊', color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <Link
          to="/my-events/create"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Events</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentEvents.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p className="mb-4">You haven't created any events yet.</p>
              <Link
                to="/my-events/create"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first event →
              </Link>
            </div>
          ) : (
            recentEvents.map((event) => (
              <div key={event.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📋
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {event.typeKey} • {new Date(event.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <Link
                    to={`/my-events/${event.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Manage →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};