// frontend/src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * Set authentication data
       */
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
        // Also store in localStorage for interceptors
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      },

      /**
       * Login user
       */
      login: (user, token) => {
        get().setAuth(user, token);
      },

      /**
       * Logout user
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      },

      /**
       * Set loading state
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * Update user data
       */
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
        localStorage.setItem('auth_user', JSON.stringify({ ...currentUser, ...userData }));
      },
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);