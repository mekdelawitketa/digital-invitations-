// frontend/src/features/owner/RSVPStats.jsx
import { useState, useEffect } from 'react';
import { rsvpAPI } from '../../api/rsvp';

export const RSVPStats = ({ eventId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await rsvpAPI.getStats(eventId);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch RSVP stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchStats();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">Loading statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">No RSVP data available</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Attending', 
      value: stats.attending || 0, 
      icon: '✅', 
      color: 'bg-green-100 text-green-700'
    },
    { 
      label: 'Maybe', 
      value: stats.maybe || 0, 
      icon: '🤔', 
      color: 'bg-yellow-100 text-yellow-700'
    },
    { 
      label: 'Not Attending', 
      value: stats.notAttending || 0, 
      icon: '❌', 
      color: 'bg-red-100 text-red-700'
    },
    { 
      label: 'No Response', 
      value: stats.noResponse || 0, 
      icon: '⏳', 
      color: 'bg-gray-100 text-gray-700'
    },
    { 
      label: 'Total Guests', 
      value: stats.totalGuests || 0, 
      icon: '👥', 
      color: 'bg-blue-100 text-blue-700'
    },
    { 
      label: 'Total RSVPs', 
      value: stats.totalRSVPs || 0, 
      icon: '📋', 
      color: 'bg-purple-100 text-purple-700'
    },
  ];

  // Calculate percentages for chart
  const total = stats.attending + stats.maybe + stats.notAttending;
  const attendingPercent = total > 0 ? (stats.attending / total) * 100 : 0;
  const maybePercent = total > 0 ? (stats.maybe / total) * 100 : 0;
  const notAttendingPercent = total > 0 ? (stats.notAttending / total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Response Breakdown</h3>
        <div className="flex h-6 rounded-lg overflow-hidden">
          {total > 0 ? (
            <>
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${attendingPercent}%` }}
                title={`Attending: ${stats.attending}`}
              />
              <div
                className="bg-yellow-500 transition-all duration-500"
                style={{ width: `${maybePercent}%` }}
                title={`Maybe: ${stats.maybe}`}
              />
              <div
                className="bg-red-500 transition-all duration-500"
                style={{ width: `${notAttendingPercent}%` }}
                title={`Not Attending: ${stats.notAttending}`}
              />
            </>
          ) : (
            <div className="w-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              No responses yet
            </div>
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>✅ Attending: {stats.attending}</span>
          <span>🤔 Maybe: {stats.maybe}</span>
          <span>❌ Not Attending: {stats.notAttending}</span>
        </div>
      </div>
    </div>
  );
};