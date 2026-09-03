// frontend/src/api/gallery.js
import { apiClient } from './client';

export const galleryAPI = {
  /**
   * Get all albums for an event
   */
  getAlbums: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/albums`);
    return response.data;
  },

  /**
   * Get a single album with images
   */
  getAlbum: async (eventId, albumId) => {
    const response = await apiClient.get(`/events/${eventId}/albums/${albumId}`);
    return response.data;
  },

  /**
   * Create a new album
   */
  createAlbum: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/albums`, data);
    return response.data;
  },

  /**
   * Update an album
   */
  updateAlbum: async (eventId, albumId, data) => {
    const response = await apiClient.put(`/events/${eventId}/albums/${albumId}`, data);
    return response.data;
  },

  /**
   * Delete an album
   */
  deleteAlbum: async (eventId, albumId) => {
    const response = await apiClient.delete(`/events/${eventId}/albums/${albumId}`);
    return response.data;
  },

  /**
   * Upload images to an album
   */
  uploadImages: async (eventId, albumId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.post(
      `/events/${eventId}/albums/${albumId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete an image from an album
   */
  deleteImage: async (eventId, albumId, imageId) => {
    const response = await apiClient.delete(
      `/events/${eventId}/albums/${albumId}/images/${imageId}`
    );
    return response.data;
  },

  /**
   * Reorder images in an album
   */
  reorderImages: async (eventId, albumId, imageOrder) => {
    const response = await apiClient.put(
      `/events/${eventId}/albums/${albumId}/reorder`,
      { imageOrder }
    );
    return response.data;
  },

  /**
   * Set album cover image
   */
  setCoverImage: async (eventId, albumId, imageId) => {
    const response = await apiClient.put(
      `/events/${eventId}/albums/${albumId}/cover`,
      { imageId }
    );
    return response.data;
  },
};