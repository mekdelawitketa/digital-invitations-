// frontend/src/api/guestbook.js
import { apiClient } from './client';

export const guestbookAPI = {
  /**
   * Get all guestbook messages for an event
   */
  getByEvent: async (eventId, params = {}) => {
    const response = await apiClient.get(`/events/${eventId}/guestbook`, { params });
    return response.data;
  },

  /**
   * Submit a guestbook message (public)
   */
  submit: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/guestbook`, data);
    return response.data;
  },

  /**
   * Approve a guestbook message (owner)
   */
  approve: async (eventId, messageId) => {
    const response = await apiClient.put(`/events/${eventId}/guestbook/${messageId}/approve`);
    return response.data;
  },

  /**
   * Reject a guestbook message (owner)
   */
  reject: async (eventId, messageId) => {
    const response = await apiClient.put(`/events/${eventId}/guestbook/${messageId}/reject`);
    return response.data;
  },

  /**
   * Pin a guestbook message (owner)
   */
  pin: async (eventId, messageId) => {
    const response = await apiClient.put(`/events/${eventId}/guestbook/${messageId}/pin`);
    return response.data;
  },

  /**
   * Unpin a guestbook message (owner)
   */
  unpin: async (eventId, messageId) => {
    const response = await apiClient.put(`/events/${eventId}/guestbook/${messageId}/unpin`);
    return response.data;
  },

  /**
   * Delete a guestbook message (owner)
   */
  delete: async (eventId, messageId) => {
    const response = await apiClient.delete(`/events/${eventId}/guestbook/${messageId}`);
    return response.data;
  },

  /**
   * Get message statistics
   */
  getStats: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/guestbook/stats`);
    return response.data;
  },
};