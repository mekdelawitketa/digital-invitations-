// frontend/src/api/songs.js
import { apiClient } from './client';

export const songsAPI = {
  /**
   * Get all song suggestions for an event
   */
  getByEvent: async (eventId, params = {}) => {
    const response = await apiClient.get(`/events/${eventId}/songs`, { params });
    return response.data;
  },

  /**
   * Submit a song suggestion (public)
   */
  submit: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/songs`, data);
    return response.data;
  },

  /**
   * Approve a song suggestion (owner)
   */
  approve: async (eventId, songId) => {
    const response = await apiClient.put(`/events/${eventId}/songs/${songId}/approve`);
    return response.data;
  },

  /**
   * Reject a song suggestion (owner)
   */
  reject: async (eventId, songId) => {
    const response = await apiClient.put(`/events/${eventId}/songs/${songId}/reject`);
    return response.data;
  },

  /**
   * Vote on a song (public)
   */
  vote: async (songId) => {
    const response = await apiClient.post(`/songs/${songId}/vote`);
    return response.data;
  },

  /**
   * Unvote on a song (public)
   */
  unvote: async (songId) => {
    const response = await apiClient.delete(`/songs/${songId}/vote`);
    return response.data;
  },

  /**
   * Delete a song suggestion (owner)
   */
  delete: async (eventId, songId) => {
    const response = await apiClient.delete(`/events/${eventId}/songs/${songId}`);
    return response.data;
  },

  /**
   * Get song statistics
   */
  getStats: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/songs/stats`);
    return response.data;
  },

  /**
   * Pin a song to the top (owner)
   */
  pin: async (eventId, songId) => {
    const response = await apiClient.put(`/events/${eventId}/songs/${songId}/pin`);
    return response.data;
  },

  /**
   * Unpin a song (owner)
   */
  unpin: async (eventId, songId) => {
    const response = await apiClient.put(`/events/${eventId}/songs/${songId}/unpin`);
    return response.data;
  },
};