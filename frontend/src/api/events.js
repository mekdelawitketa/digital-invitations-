// frontend/src/api/events.js
import { apiClient } from './client';

export const eventsAPI = {
  /**
   * Get all events (public)
   */
  getAll: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },

  /**
   * Get single event by slug (public)
   */
  getBySlug: async (slug) => {
    const response = await apiClient.get(`/events/${slug}`);
    return response.data;
  },

  /**
   * Get single event by ID (owner/admin)
   */
  getById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  /**
   * Create a new event
   */
  create: async (data) => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },

  /**
   * Update an event
   */
  update: async (id, data) => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },

  /**
   * Delete an event
   */
  delete: async (id) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },
};