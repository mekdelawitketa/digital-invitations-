// frontend/src/features/invitation/GalleryAlbum.jsx
import { useState } from 'react';

export const GalleryAlbum = ({ album }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!album || !album.images || album.images.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{album.name}</h3>
      {album.description && (
        <p className="text-gray-500 text-sm mb-4">{album.description}</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {album.images.map((image) => (
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
  );
};

export default GalleryAlbum;