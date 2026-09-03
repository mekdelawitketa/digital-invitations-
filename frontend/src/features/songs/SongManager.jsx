// frontend/src/features/songs/SongManager.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { songsAPI } from '../../api/songs';

export const SongManager = () => {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [songsRes, statsRes] = await Promise.all([
          songsAPI.getByEvent(id),
          songsAPI.getStats(id)
        ]);
        setSongs(songsRes.data || []);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, filter]);

  const handleApprove = async (songId) => {
    try {
      await songsAPI.approve(id, songId);
      const response = await songsAPI.getByEvent(id);
      setSongs(response.data || []);
    } catch (error) {
      alert('Failed to approve song');
    }
  };

  const handleReject = async (songId) => {
    try {
      await songsAPI.reject(id, songId);
      const response = await songsAPI.getByEvent(id);
      setSongs(response.data || []);
    } catch (error) {
      alert('Failed to reject song');
    }
  };

  const handleDelete = async (songId) => {
    if (!confirm('Delete this song suggestion?')) return;
    try {
      await songsAPI.delete(id, songId);
      const response = await songsAPI.getByEvent(id);
      setSongs(response.data || []);
    } catch (error) {
      alert('Failed to delete song');
    }
  };

  const filteredSongs = songs.filter(song => {
    if (filter === 'pending') return !song.approved && !song.rejected;
    if (filter === 'approved') return song.approved;
    if (filter === 'rejected') return song.rejected;
    return true;
  });

  const counts = {
    all: songs.length,
    pending: songs.filter(s => !s.approved && !s.rejected).length,
    approved: songs.filter(s => s.approved).length,
    rejected: songs.filter(s => s.rejected).length,
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🎵 Song Suggestions</h1>
          <p className="text-gray-500">Manage and moderate song requests</p>
        </div>
        <Link to={`/my-events/${id}`} className="text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl">🎵</div>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl">✅</div>
            <div className="text-2xl font-bold text-green-600">{stats.approved || 0}</div>
            <div className="text-xs text-gray-500">Approved</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl">❌</div>
            <div className="text-2xl font-bold text-red-600">{stats.rejected || 0}</div>
            <div className="text-xs text-gray-500">Rejected</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filteredSongs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-gray-500">No songs found</p>
        </div>
      ) : (
        filteredSongs.map((song) => (
          <div key={song.id} className="bg-white rounded-xl shadow border p-4 mb-4">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg">{song.songTitle}</span>
                  {song.artist && <span className="text-gray-500">by {song.artist}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    song.approved ? 'bg-green-100 text-green-700' :
                    song.rejected ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {song.approved ? '✅ Approved' : song.rejected ? '❌ Rejected' : '⏳ Pending'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">Suggested by: {song.guestName}</div>
                {song.message && <p className="text-gray-600 mt-1">{song.message}</p>}
                <div className="flex gap-4 mt-1 text-sm text-gray-500">
                  <span>❤️ {song.votes || 0} votes</span>
                  <span>{new Date(song.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {!song.approved && !song.rejected && (
                <>
                  <button onClick={() => handleApprove(song.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    ✅ Approve
                  </button>
                  <button onClick={() => handleReject(song.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    ❌ Reject
                  </button>
                </>
              )}
              {song.approved && (
                <button onClick={() => handleReject(song.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                  ❌ Reject
                </button>
              )}
              {song.rejected && (
                <button onClick={() => handleApprove(song.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                  ✅ Approve
                </button>
              )}
              <button onClick={() => handleDelete(song.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};