// frontend/src/api/schedule.js
import { apiClient } from './client';

export const scheduleAPI = {
  /**
   * Get all schedule items for an event
   */
  getByEvent: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/schedule`);
    return response.data;
  },

  /**
   * Create a new schedule item
   */
  create: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/schedule`, data);
    return response.data;
  },

  /**
   * Update a schedule item
   */
  update: async (eventId, itemId, data) => {
    const response = await apiClient.put(`/events/${eventId}/schedule/${itemId}`, data);
    return response.data;
  },

  /**
   * Delete a schedule item
   */
  delete: async (eventId, itemId) => {
    const response = await apiClient.delete(`/events/${eventId}/schedule/${itemId}`);
    return response.data;
  },

  /**
   * Reorder schedule items
   */
  reorder: async (eventId, itemOrder) => {
    const response = await apiClient.put(`/events/${eventId}/schedule/reorder`, { itemOrder });
    return response.data;
  },
};