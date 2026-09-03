// frontend/src/features/songs/SongManager.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { songsAPI } from '../../api/songs';

export const SongManager = () => {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchSongs();
    fetchStats();
  }, [id, filter]);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'pending') params.approved = false;
      if (filter === 'approved') params.approved = true;
      if (filter === 'rejected') params.rejected = true;
      const response = await songsAPI.getByEvent(id, params);
      setSongs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await songsAPI.getStats(id);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApprove = async (songId) => {
    try {
      await songsAPI.approve(id, songId);
      fetchSongs();
      fetchStats();
    } catch (error) {
      alert('Failed to approve song');
    }
  };

  const handleReject = async (songId) => {
    try {
      await songsAPI.reject(id, songId);
      fetchSongs();
      fetchStats();
    } catch (error) {
      alert('Failed to reject song');
    }
  };

  const handleDelete = async (songId) => {
    if (!confirm('Are you sure you want to delete this song suggestion?')) return;
    try {
      await songsAPI.delete(id, songId);
      fetchSongs();
      fetchStats();
    } catch (error) {
      alert('Failed to delete song');
    }
  };

  const filterCounts = {
    all: songs.length,
    pending: songs.filter(s => !s.approved && !s.rejected).length,
    approved: songs.filter(s => s.approved).length,
    rejected: songs.filter(s => s.rejected).length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Song Suggestions</h1>
          <p className="text-gray-500 mt-1">Manage and moderate song requests</p>
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
          <StatCard label="Total Songs" value={stats.total || 0} icon="🎵" />
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

      {/* Songs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-gray-500">Loading songs...</div>
          </div>
        ) : songs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Songs</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "No song suggestions yet." 
                : `No ${filter} songs found.`}
            </p>
          </div>
        ) : (
          songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onApprove={() => handleApprove(song.id)}
              onReject={() => handleReject(song.id)}
              onDelete={() => handleDelete(song.id)}
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

// Song Card Component
const SongCard = ({ song, onApprove, onReject, onDelete }) => {
  const isPending = !song.approved && !song.rejected;
  const isApproved = song.approved;
  const isRejected = song.rejected;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 ${
      isPending ? 'border-yellow-200 bg-yellow-50/30' :
      isApproved ? 'border-green-200' :
      'border-red-200 bg-red-50/30'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-gray-800">{song.songTitle}</span>
            {song.artist && (
              <span className="text-gray-500 text-sm">by {song.artist}</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isPending ? 'bg-yellow-100 text-yellow-700' :
              isApproved ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {isPending ? '⏳ Pending' :
               isApproved ? '✅ Approved' :
               '❌ Rejected'}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Suggested by: {song.guestName}
          </div>
          {song.message && (
            <p className="mt-2 text-gray-600 text-sm">{song.message}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="text-gray-500">❤️ {song.votes || 0} votes</span>
            <span className="text-gray-400 text-xs">
              {new Date(song.createdAt).toLocaleString()}
            </span>
          </div>
          {/* Links */}
          <div className="mt-2 flex flex-wrap gap-2">
            {song.youtubeUrl && (
              <a
                href={song.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ▶️ YouTube
              </a>
            )}
            {song.spotifyUrl && (
              <a
                href={song.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-sm"
              >
                🎵 Spotify
              </a>
            )}
          </div>
        </div>
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
          <button
            onClick={onReject}
            className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            ❌ Reject
          </button>
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