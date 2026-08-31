// frontend/src/features/invitation/Gallery.jsx
import { useState } from 'react';

export const Gallery = ({ albums }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  if (!albums || albums.length === 0) return null;

  // Get all images from all albums or show selected album
  const allImages = albums.flatMap(album => album.images || []);
  const images = selectedAlbum
    ? (albums.find(a => a.id === selectedAlbum)?.images || [])
    : allImages;

  if (images.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Gallery
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>

        {/* Album selector */}
        {albums.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setSelectedAlbum(null)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedAlbum === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Photos
            </button>
            {albums.map((album) => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedAlbum === album.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {album.name}
              </button>
            ))}
          </div>
        )}

        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.thumbnail || image.url}
                alt={image.altText || image.caption || 'Gallery image'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm truncate">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:scale-110 transition-transform"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </section>
  );
};