// frontend/src/api/weddingParty.js
import { apiClient } from './client';

export const weddingPartyAPI = {
  /**
   * Get all wedding party members for an event
   */
  getByEvent: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/wedding-party`);
    return response.data;
  },

  /**
   * Create a new wedding party member
   */
  create: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/wedding-party`, data);
    return response.data;
  },

  /**
   * Update a wedding party member
   */
  update: async (eventId, memberId, data) => {
    const response = await apiClient.put(`/events/${eventId}/wedding-party/${memberId}`, data);
    return response.data;
  },

  /**
   * Delete a wedding party member
   */
  delete: async (eventId, memberId) => {
    const response = await apiClient.delete(`/events/${eventId}/wedding-party/${memberId}`);
    return response.data;
  },

  /**
   * Reorder wedding party members
   */
  reorder: async (eventId, memberOrder) => {
    const response = await apiClient.put(`/events/${eventId}/wedding-party/reorder`, { memberOrder });
    return response.data;
  },
};