// frontend/src/features/songs/SongCard.jsx
import { useState } from 'react';

export const SongCard = ({ song, onDelete, onUpvote, currentUser }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{song.songName}</h3>
          <p className="text-gray-600 text-sm">{song.artist}</p>
          {song.guestName && (
            <p className="text-gray-400 text-xs mt-1">Suggested by: {song.guestName}</p>
          )}
          {song.note && (
            <p className="text-gray-500 text-sm mt-2 italic">"{song.note}"</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpvote?.(song.id)}
            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <span className="text-sm">👍</span>
            <span className="text-xs font-medium">{song.upvotes || 0}</span>
          </button>
          {currentUser?.isAdmin && (
            <button
              onClick={() => setShowDelete(!showDelete)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <span className="text-sm">⋮</span>
            </button>
          )}
        </div>
      </div>
      {showDelete && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={() => onDelete?.(song.id)}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => setShowDelete(false)}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// ✅ ADD THIS - Default export
export default SongCard;