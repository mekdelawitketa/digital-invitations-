// frontend/src/api/admin.js
import { apiClient } from './client';

export const adminAPI = {
  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  /**
   * Get all users (with pagination)
   */
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Get all events (admin view)
   */
  getEvents: async (params = {}) => {
    const response = await apiClient.get('/admin/events', { params });
    return response.data;
  },

  /**
   * Get all event types
   */
  getEventTypes: async () => {
    const response = await apiClient.get('/admin/event-types');
    return response.data;
  },

  /**
   * Update event type
   */
  updateEventType: async (id, data) => {
    const response = await apiClient.put(`/admin/event-types/${id}`, data);
    return response.data;
  },

  /**
   * Get all themes
   */
  getThemes: async () => {
    const response = await apiClient.get('/admin/themes');
    return response.data;
  },

  /**
   * Create a new theme
   */
  createTheme: async (data) => {
    const response = await apiClient.post('/admin/themes', data);
    return response.data;
  },

  /**
   * Update a theme
   */
  updateTheme: async (id, data) => {
    const response = await apiClient.put(`/admin/themes/${id}`, data);
    return response.data;
  },

  /**
   * Delete a theme
   */
  deleteTheme: async (id) => {
    const response = await apiClient.delete(`/admin/themes/${id}`);
    return response.data;
  },

  /**
   * Get all media
   */
  getMedia: async (params = {}) => {
    const response = await apiClient.get('/admin/media', { params });
    return response.data;
  },

  /**
   * Delete media
   */
  deleteMedia: async (id) => {
    const response = await apiClient.delete(`/admin/media/${id}`);
    return response.data;
  },

  /**
   * Update user role
   */
  updateUserRole: async (userId, role) => {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Toggle event publish status
   */
  toggleEventPublish: async (eventId) => {
    const response = await apiClient.put(`/admin/events/${eventId}/toggle-publish`);
    return response.data;
  },

  /**
   * Delete event (admin)
   */
  deleteEvent: async (eventId) => {
    const response = await apiClient.delete(`/admin/events/${eventId}`);
    return response.data;
  },

  /**
   * Get reported content
   */
  getReportedContent: async () => {
    const response = await apiClient.get('/admin/reports');
    return response.data;
  },

  /**
   * Resolve a report
   */
  resolveReport: async (reportId) => {
    const response = await apiClient.put(`/admin/reports/${reportId}/resolve`);
    return response.data;
  },
};