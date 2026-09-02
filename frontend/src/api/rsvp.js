// frontend/src/api/rsvp.js
import { apiClient } from './client';

export const rsvpAPI = {
  /**
   * Get all RSVPs for an event
   */
  getByEvent: async (eventId, params = {}) => {
    const response = await apiClient.get(`/events/${eventId}/rsvps`, { params });
    return response.data;
  },

  /**
   * Get RSVP statistics for an event
   */
  getStats: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/rsvps/stats`);
    return response.data;
  },

  /**
   * Submit RSVP (public)
   */
  submit: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/rsvp`, data);
    return response.data;
  },

  /**
   * Update RSVP (owner)
   */
  update: async (eventId, rsvpId, data) => {
    const response = await apiClient.put(`/events/${eventId}/rsvps/${rsvpId}`, data);
    return response.data;
  },

  /**
   * Delete RSVP (owner)
   */
  delete: async (eventId, rsvpId) => {
    const response = await apiClient.delete(`/events/${eventId}/rsvps/${rsvpId}`);
    return response.data;
  },

  /**
   * Export RSVPs to CSV
   */
  exportCSV: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/rsvps/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
};