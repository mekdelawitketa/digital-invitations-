// frontend/src/api/events.js
import { apiClient } from './client';

export const eventsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await apiClient.get(`/events/${slug}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },
};