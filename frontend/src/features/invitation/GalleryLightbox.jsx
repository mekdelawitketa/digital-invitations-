// // frontend/src/features/invitation/GalleryLightbox.jsx
// import { useEffect } from 'react';

// export const GalleryLightbox = ({ image, onClose }) => {
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', handleEsc);
//     document.body.style.overflow = 'hidden';
//     return () => {
//       document.removeEventListener('keydown', handleEsc);
//       document.body.style.overflow = 'unset';
//     };
//   }, [onClose]);

//   if (!image) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <img
//         src={image}
//         alt="Full size"
//         className="max-w-full max-h-[90vh] object-contain"
//         onClick={(e) => e.stopPropagation()}
//       />
//       <button
//         className="absolute top-4 right-4 text-white text-4xl hover:scale-110 transition-transform"
//         onClick={onClose}
//       >
//         ×
//       </button>
//     </div>
//   );
// };

// export default GalleryLightbox;