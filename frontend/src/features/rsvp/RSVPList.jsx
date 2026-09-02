// frontend/src/features/owner/RSVPList.jsx
import { useState, useEffect } from 'react';
import { rsvpAPI } from '../../api/rsvp';

export const RSVPList = ({ eventId }) => {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, attending, maybe, not_attending
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const params = {};
        if (filter !== 'all') params.status = filter;
        if (search) params.search = search;
        
        const response = await rsvpAPI.getByEvent(eventId, params);
        setRsvps(response.data || []);
      } catch (error) {
        console.error('Failed to fetch RSVPs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchRsvps();
    }
  }, [eventId, filter, search]);

  const handleExport = async () => {
    try {
      const blob = await rsvpAPI.exportCSV(eventId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rsvps-${eventId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export RSVPs');
    }
  };

  const handleDelete = async (rsvpId) => {
    if (!confirm('Are you sure you want to delete this RSVP?')) return;
    try {
      await rsvpAPI.delete(eventId, rsvpId);
      // Refresh list
      const response = await rsvpAPI.getByEvent(eventId);
      setRsvps(response.data || []);
    } catch (error) {
      alert('Failed to delete RSVP');
    }
  };

  const statusColors = {
    attending: 'bg-green-100 text-green-700',
    maybe: 'bg-yellow-100 text-yellow-700',
    not_attending: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    attending: '✅ Attending',
    maybe: '🤔 Maybe',
    not_attending: '❌ Not Attending',
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('attending')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'attending' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✅ Attending
          </button>
          <button
            onClick={() => setFilter('maybe')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'maybe' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🤔 Maybe
          </button>
          <button
            onClick={() => setFilter('not_attending')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === 'not_attending' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ❌ Not Attending
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-48 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleExport}
            className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-200 transition-colors text-sm whitespace-nowrap"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* RSVP Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">Loading RSVPs...</div>
        ) : rsvps.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-4xl mb-2">📋</p>
            <p>No RSVPs yet</p>
            <p className="text-sm">Share your invitation to start collecting responses</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{rsvp.name}</p>
                        {rsvp.email && (
                          <p className="text-xs text-gray-500">{rsvp.email}</p>
                        )}
                        {rsvp.phone && (
                          <p className="text-xs text-gray-500">{rsvp.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[rsvp.status]}`}>
                        {statusLabels[rsvp.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{rsvp.numberOfGuests}</span>
                      {rsvp.guestNames && (
                        <p className="text-xs text-gray-500">{rsvp.guestNames}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {rsvp.message ? (
                        <p className="text-sm text-gray-600 max-w-xs truncate">{rsvp.message}</p>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(rsvp.rsvpDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(rsvp.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
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