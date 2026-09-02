// frontend/src/features/invitation/SongForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { songSchema } from '../../utils/validators';
import { songsAPI } from '../../api/songs';

export const SongForm = ({ eventId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(songSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      await songsAPI.submit(eventId, data);
      setSuccess(true);
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit song suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">🎵</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-600">
          Your song suggestion has been submitted. It will appear once approved by the host.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Suggest a Song</h3>
      <p className="text-sm text-gray-500 mb-4">
        Help build the playlist for the celebration
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            {...register('guestName')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
          {errors.guestName && (
            <p className="text-sm text-red-600 mt-1">{errors.guestName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Song Title *
            </label>
            <input
              type="text"
              {...register('songTitle')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter song title"
            />
            {errors.songTitle && (
              <p className="text-sm text-red-600 mt-1">{errors.songTitle.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Artist *
            </label>
            <input
              type="text"
              {...register('artist')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter artist name"
            />
            {errors.artist && (
              <p className="text-sm text-red-600 mt-1">{errors.artist.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL
            </label>
            <input
              type="url"
              {...register('youtubeUrl')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/watch?v=..."
            />
            {errors.youtubeUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.youtubeUrl.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spotify URL
            </label>
            <input
              type="url"
              {...register('spotifyUrl')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://open.spotify.com/track/..."
            />
            {errors.spotifyUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.spotifyUrl.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            {...register('message')}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Why do you suggest this song?"
          />
          {errors.message && (
            <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Suggest Song'}
        </button>
      </form>
    </div>
  );
};