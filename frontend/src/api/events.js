// frontend/src/api/events.js
import { apiClient } from './client';

export const eventsAPI = {
  /**
   * Get all events (public)
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/events', { params });
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

  /**
   * Get event sections
   */
  getSections: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/sections`);
    return response.data;
  },

  /**
   * Update event sections
   */
  updateSections: async (eventId, sections) => {
    const response = await apiClient.put(`/events/${eventId}/sections`, sections);
    return response.data;
  },

  /**
   * Get RSVPs for an event
   */
  getRSVPs: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/rsvps`);
    return response.data;
  },

  /**
   * Submit RSVP
   */
  submitRSVP: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/rsvp`, data);
    return response.data;
  },

  /**
   * Get guestbook messages
   */
  getGuestbook: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/guestbook`);
    return response.data;
  },

  /**
   * Submit guestbook message
   */
  submitGuestbook: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/guestbook`, data);
    return response.data;
  },

  /**
   * Get song suggestions
   */
  getSongs: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}/songs`);
    return response.data;
  },

  /**
   * Submit song suggestion
   */
  submitSong: async (eventId, data) => {
    const response = await apiClient.post(`/events/${eventId}/songs`, data);
    return response.data;
  },

  /**
   * Vote on a song
   */
  voteSong: async (songId) => {
    const response = await apiClient.post(`/songs/${songId}/vote`);
    return response.data;
  },
};