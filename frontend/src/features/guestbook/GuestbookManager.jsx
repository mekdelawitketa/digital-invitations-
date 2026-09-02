// frontend/src/features/guestbook/GuestbookManager.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guestbookAPI } from '../../api/guestbook';

export const GuestbookManager = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [id, filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'pending') params.approved = false;
      if (filter === 'approved') params.approved = true;
      if (filter === 'rejected') params.rejected = true;
      const response = await guestbookAPI.getByEvent(id, params);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await guestbookAPI.getStats(id);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApprove = async (messageId) => {
    try {
      await guestbookAPI.approve(id, messageId);
      fetchMessages();
      fetchStats();
    } catch (error) {
      alert('Failed to approve message');
    }
  };

  const handleReject = async (messageId) => {
    try {
      await guestbookAPI.reject(id, messageId);
      fetchMessages();
      fetchStats();
    } catch (error) {
      alert('Failed to reject message');
    }
  };

  const handlePin = async (messageId) => {
    try {
      await guestbookAPI.pin(id, messageId);
      fetchMessages();
    } catch (error) {
      alert('Failed to pin message');
    }
  };

  const handleUnpin = async (messageId) => {
    try {
      await guestbookAPI.unpin(id, messageId);
      fetchMessages();
    } catch (error) {
      alert('Failed to unpin message');
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await guestbookAPI.delete(id, messageId);
      fetchMessages();
      fetchStats();
    } catch (error) {
      alert('Failed to delete message');
    }
  };

  const filterCounts = {
    all: messages.length,
    pending: messages.filter(m => !m.approved && !m.rejected).length,
    approved: messages.filter(m => m.approved).length,
    rejected: messages.filter(m => m.rejected).length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Guestbook Moderation</h1>
          <p className="text-gray-500 mt-1">Manage and moderate guest messages</p>
        </div>
        <Link
          to={`/my-events/${id}`}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Event
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Messages" value={stats.total || 0} icon="📝" />
          <StatCard label="Pending" value={stats.pending || 0} icon="⏳" color="text-yellow-600" />
          <StatCard label="Approved" value={stats.approved || 0} icon="✅" color="text-green-600" />
          <StatCard label="Rejected" value={stats.rejected || 0} icon="❌" color="text-red-600" />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({filterCounts.all})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ⏳ Pending ({filterCounts.pending})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✅ Approved ({filterCounts.approved})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ❌ Rejected ({filterCounts.rejected})
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "No guestbook messages yet." 
                : `No ${filter} messages found.`}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onApprove={() => handleApprove(message.id)}
              onReject={() => handleReject(message.id)}
              onPin={() => handlePin(message.id)}
              onUnpin={() => handleUnpin(message.id)}
              onDelete={() => handleDelete(message.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon, color = 'text-gray-600' }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
    <div className="text-2xl mb-1">{icon}</div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

// Message Card Component
const MessageCard = ({ message, onApprove, onReject, onPin, onUnpin, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const isPending = !message.approved && !message.rejected;
  const isApproved = message.approved;
  const isRejected = message.rejected;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 ${
      isPending ? 'border-yellow-200 bg-yellow-50/30' :
      isApproved ? 'border-green-200' :
      'border-red-200 bg-red-50/30'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-gray-800">{message.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isPending ? 'bg-yellow-100 text-yellow-700' :
              isApproved ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {isPending ? '⏳ Pending' :
               isApproved ? '✅ Approved' :
               '❌ Rejected'}
            </span>
            {message.pinned && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                📌 Pinned
              </span>
            )}
            <span className="text-xs text-gray-400">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>
          <p className={`mt-2 text-gray-600 ${!expanded ? 'line-clamp-2' : ''}`}>
            {message.message}
          </p>
          {message.photo && (
            <div className="mt-2">
              <img
                src={message.photo}
                alt="Guest photo"
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
        {isPending && (
          <>
            <button
              onClick={onApprove}
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              ✅ Approve
            </button>
            <button
              onClick={onReject}
              className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              ❌ Reject
            </button>
          </>
        )}
        {isApproved && (
          <>
            {message.pinned ? (
              <button
                onClick={onUnpin}
                className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                📌 Unpin
              </button>
            ) : (
              <button
                onClick={onPin}
                className="bg-gray-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                📌 Pin
              </button>
            )}
            <button
              onClick={onReject}
              className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              ❌ Reject
            </button>
          </>
        )}
        {isRejected && (
          <button
            onClick={onApprove}
            className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            ✅ Approve
          </button>
        )}
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};