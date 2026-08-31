// frontend/src/utils/validators.js
import { z } from 'zod';

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Register validation schema
 */
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

/**
 * Event validation schema
 */
export const eventSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title is too long'),
  type: z.enum(['wedding', 'birthday', 'graduation'], {
    required_error: 'Please select an event type',
  }),
  description: z.string()
    .max(1000, 'Description is too long')
    .optional(),
  startDate: z.string()
    .min(1, 'Start date is required'),
  timezone: z.string()
    .min(1, 'Timezone is required'),
  venueName: z.string()
    .max(200, 'Venue name is too long')
    .optional(),
  venueAddress: z.string()
    .max(500, 'Address is too long')
    .optional(),
  isPublic: z.boolean().default(true),
});

/**
 * RSVP validation schema
 */
export const rsvpSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['attending', 'maybe', 'not_attending'], {
    required_error: 'Please select an attendance status',
  }),
  numberOfGuests: z.number()
    .min(1, 'Must be at least 1 guest')
    .max(20, 'Maximum 20 guests allowed'),
  guestNames: z.string().optional(),
  message: z.string()
    .max(500, 'Message is too long')
    .optional(),
  dietaryRequirements: z.string()
    .max(500, 'Dietary requirements too long')
    .optional(),
  specialRequests: z.string()
    .max(500, 'Special requests too long')
    .optional(),
});

/**
 * Guestbook validation schema
 */
export const guestbookSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
});

/**
 * Song suggestion validation schema
 */
export const songSchema = z.object({
  guestName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  songTitle: z.string()
    .min(2, 'Song title is required')
    .max(200, 'Song title is too long'),
  artist: z.string()
    .min(2, 'Artist name is required')
    .max(200, 'Artist name is too long'),
  youtubeUrl: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  spotifyUrl: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  message: z.string()
    .max(500, 'Message is too long')
    .optional(),
});