// frontend/src/features/gallery/GalleryManager.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { galleryAPI } from '../../api/gallery';

export const GalleryManager = () => {
  const { id } = useParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, [id]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getAlbums(id);
      setAlbums(response.data || []);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) {
      alert('Please enter an album name');
      return;
    }

    try {
      await galleryAPI.createAlbum(id, {
        name: newAlbumName,
        description: newAlbumDescription,
      });
      setNewAlbumName('');
      setNewAlbumDescription('');
      setShowCreateAlbum(false);
      fetchAlbums();
    } catch (error) {
      alert('Failed to create album');
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!confirm('Are you sure you want to delete this album?')) return;
    try {
      await galleryAPI.deleteAlbum(id, albumId);
      fetchAlbums();
    } catch (error) {
      alert('Failed to delete album');
    }
  };

  const handleImageUpload = async (albumId, files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      await galleryAPI.uploadImages(id, albumId, files);
      fetchAlbums();
    } catch (error) {
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (albumId, imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await galleryAPI.deleteImage(id, albumId, imageId);
      fetchAlbums();
    } catch (error) {
      alert('Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gallery Manager</h1>
          <p className="text-gray-500 mt-1">Organize your event photos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateAlbum(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Album
          </button>
          <Link
            to={`/my-events/${id}`}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Create Album Modal */}
      {showCreateAlbum && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Album</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Album Name *
                </label>
                <input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Pre-Wedding, Studio Photos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAlbumDescription}
                  onChange={(e) => setNewAlbumDescription(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this album..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreateAlbum}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1"
                >
                  Create Album
                </button>
                <button
                  onClick={() => setShowCreateAlbum(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Album Grid */}
      {albums.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Albums Yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first album to start uploading photos
          </p>
          <button
            onClick={() => setShowCreateAlbum(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onDelete={() => handleDeleteAlbum(album.id)}
              onUpload={(files) => handleImageUpload(album.id, files)}
              onDeleteImage={(imageId) => handleDeleteImage(album.id, imageId)}
              uploading={uploading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Album Card Component
const AlbumCard = ({ album, onDelete, onUpload, onDeleteImage, uploading }) => {
  const [expanded, setExpanded] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Album Cover */}
      <div className="relative h-48 bg-gray-100">
        {album.coverImage ? (
          <img
            src={album.coverImage}
            alt={album.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-blue-50 to-purple-50">
            🖼️
          </div>
        )}
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors text-sm"
        >
          ×
        </button>
      </div>

      {/* Album Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{album.name}</h3>
            {album.description && (
              <p className="text-sm text-gray-500">{album.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {album.images?.length || 0} images
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>

        {/* Upload Button */}
        <div className="mt-3">
          <label className="cursor-pointer">
            <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg text-center transition-colors">
              📤 Upload Images
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploading && (
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          )}
        </div>

        {/* Expanded Image Grid */}
        {expanded && album.images && album.images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {album.images.map((image) => (
              <div key={image.id} className="relative group aspect-square">
                <img
                  src={image.thumbnail || image.url}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => onDeleteImage(image.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {expanded && (!album.images || album.images.length === 0) && (
          <p className="text-sm text-gray-400 mt-4 text-center">
            No images uploaded yet
          </p>
        )}
      </div>
    </div>
  );
};