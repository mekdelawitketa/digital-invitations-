// frontend/src/features/songs/SongSuggestions.jsx
import { useState } from 'react';

export const SongSuggestions = ({ eventId }) => {
  const [formData, setFormData] = useState({
    songName: '',
    artist: '',
    guestName: '',
    note: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Your API call here
      await songsAPI.submitSuggestion(eventId, formData);
      setSubmitted(true);
      setFormData({ songName: '', artist: '', guestName: '', note: '' });
    } catch (error) {
      console.error('Error submitting song suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
        <p className="text-gray-500">Your song suggestion has been submitted.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Suggestion
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Song Name *
          </label>
          <input
            type="text"
            name="songName"
            value={formData.songName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter song title"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Artist *
          </label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter artist name"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name (optional)"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Note (optional)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special message or reason for this suggestion..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </div>
    </form>
  );
};

// ✅ ADD THIS - Export as default too
export default SongSuggestions;