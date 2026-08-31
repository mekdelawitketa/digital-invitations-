// frontend/src/types/index.js

// ============================================
// ENUMS (Match Prisma Enums)
// ============================================

/**
 * User roles in the system
 * @readonly
 * @enum {string}
 */
export const Role = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  GUEST: "GUEST"
};

/**
 * Event types supported by the platform
 * @readonly
 * @enum {string}
 */
export const EventTypeKey = {
  WEDDING: "wedding",
  BIRTHDAY: "birthday",
  GRADUATION: "graduation"
};

/**
 * RSVP status options
 * @readonly
 * @enum {string}
 */
export const RSVPStatus = {
  ATTENDING: "attending",
  MAYBE: "maybe",
  NOT_ATTENDING: "not_attending"
};

// ============================================
// USER
// ============================================

/**
 * @typedef {Object} User
 * @property {string} id - Unique user ID
 * @property {string} email - User's email address
 * @property {string} name - User's full name
 * @property {Role} role - User's role (ADMIN, OWNER, GUEST)
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

// ============================================
// EVENT TYPE
// ============================================

/**
 * @typedef {Object} EventTypeConfig
 * @property {boolean} weddingParty - Show wedding party section
 * @property {boolean} guestbook - Show guestbook section
 * @property {boolean} songs - Show song suggestions section
 * @property {boolean} gallery - Show gallery section
 * @property {boolean} schedule - Show schedule section
 * @property {boolean} rsvp - Show RSVP section
 */

/**
 * @typedef {Object} EventType
 * @property {string} id - Unique ID
 * @property {EventTypeKey} key - Event type key (wedding, birthday, graduation)
 * @property {string} name - Display name
 * @property {string} [description] - Optional description
 * @property {EventTypeConfig} config - Feature flags for this event type
 */

// ============================================
// THEME SETTINGS
// ============================================

/**
 * @typedef {Object} ThemeSettings
 * @property {string} primaryColor - Primary color hex code
 * @property {string} secondaryColor - Secondary color hex code
 * @property {string} [backgroundColor] - Background color hex code
 * @property {string} [textColor] - Text color hex code
 * @property {string} fontFamily - Main font family
 * @property {string} [headingFont] - Heading font family
 * @property {string} [borderRadius] - Border radius value
 */

// ============================================
// EVENT
// ============================================

/**
 * @typedef {Object} Event
 * @property {string} id - Unique event ID
 * @property {string} slug - URL-friendly unique identifier
 * @property {string} title - Event title
 * @property {string} [description] - Event description
 * @property {EventTypeKey} typeKey - Event type
 * @property {string} ownerId - ID of the event owner
 * @property {string} startDate - ISO timestamp
 * @property {string} [endDate] - ISO timestamp
 * @property {string} [startTime] - Time string (HH:MM)
 * @property {string} [endTime] - Time string (HH:MM)
 * @property {string} timezone - IANA timezone
 * @property {string} [venueName] - Venue name
 * @property {string} [venueAddress] - Venue address
 * @property {string} [googleMapsUrl] - Google Maps link
 * @property {string} [contactPhone] - Contact phone number
 * @property {string} [contactEmail] - Contact email
 * @property {string} [coverImage] - Cover image URL
 * @property {string} [profileImage] - Profile image URL
 * @property {string} [backgroundImage] - Background image URL
 * @property {string} [backgroundAudio] - Background audio URL
 * @property {boolean} isPublic - Whether event is public
 * @property {boolean} isPublished - Whether event is published
 * @property {ThemeSettings} themeSettings - Theme configuration
 * @property {User} [owner] - Event owner (populated on request)
 * @property {EventType} [eventType] - Event type (populated on request)
 * @property {EventSection[]} [sections] - Enabled sections
 * @property {EventStory[]} [stories] - Event stories
 * @property {GalleryAlbum[]} [albums] - Gallery albums
 * @property {EventVideo[]} [videos] - Event videos
 * @property {ScheduleItem[]} [schedules] - Schedule items
 * @property {WeddingPartyMember[]} [weddingParty] - Wedding party members (wedding only)
 * @property {RSVP[]} [rsvps] - RSVP responses
 * @property {GuestbookMessage[]} [guestbook] - Guestbook messages
 * @property {SongSuggestion[]} [songs] - Song suggestions
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

// ============================================
// EVENT SECTION (Enable/Disable per event)
// ============================================

/**
 * @typedef {Object} EventSection
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} sectionKey - Section identifier (hero, story, gallery, etc.)
 * @property {boolean} enabled - Whether section is enabled
 * @property {number} displayOrder - Order of display
 */

// ============================================
// EVENT STORY
// ============================================

/**
 * @typedef {Object} EventStory
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} title - Story title
 * @property {string} [subtitle] - Story subtitle
 * @property {string} [content] - Story content
 * @property {string} [image] - Image URL
 * @property {string} [video] - Video URL
 * @property {number} displayOrder - Order of display
 */

// ============================================
// GALLERY
// ============================================

/**
 * @typedef {Object} GalleryImage
 * @property {string} id - Unique ID
 * @property {string} albumId - Associated album ID
 * @property {string} url - Image URL
 * @property {string} [thumbnail] - Thumbnail URL
 * @property {string} [caption] - Image caption
 * @property {string} [altText] - Alt text for accessibility
 * @property {number} displayOrder - Order of display
 */

/**
 * @typedef {Object} GalleryAlbum
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} name - Album name
 * @property {string} [description] - Album description
 * @property {string} [coverImage] - Cover image URL
 * @property {number} displayOrder - Order of display
 * @property {GalleryImage[]} images - Images in this album
 */

// ============================================
// VIDEOS
// ============================================

/**
 * @typedef {Object} EventVideo
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} title - Video title
 * @property {string} [description] - Video description
 * @property {string} [thumbnail] - Thumbnail URL
 * @property {string} videoUrl - Video URL (YouTube, Vimeo, or direct)
 * @property {boolean} isFeatured - Whether video is featured
 * @property {number} displayOrder - Order of display
 */

// ============================================
// SCHEDULE
// ============================================

/**
 * @typedef {Object} ScheduleItem
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} title - Schedule item title
 * @property {string} [description] - Schedule item description
 * @property {string} [date] - Date string
 * @property {string} [startTime] - Start time (HH:MM)
 * @property {string} [endTime] - End time (HH:MM)
 * @property {string} [location] - Location name
 * @property {string} [googleMapsUrl] - Google Maps link
 * @property {string} [image] - Image URL
 * @property {number} displayOrder - Order of display
 */

// ============================================
// WEDDING PARTY
// ============================================

/**
 * @typedef {Object} SocialLinks
 * @property {string} [instagram] - Instagram URL
 * @property {string} [facebook] - Facebook URL
 * @property {string} [twitter] - Twitter URL
 * @property {string} [linkedin] - LinkedIn URL
 */

/**
 * @typedef {Object} WeddingPartyMember
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} name - Member's name
 * @property {string} role - Role (Bride, Groom, Bridesmaid, Best Man, etc.)
 * @property {string} [profileImage] - Profile image URL
 * @property {string} [bio] - Member's bio
 * @property {SocialLinks} [socialLinks] - Social media links
 * @property {number} displayOrder - Order of display
 */

// ============================================
// RSVP
// ============================================

/**
 * @typedef {Object} RSVP
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} [guestId] - Guest user ID (if registered)
 * @property {string} name - Guest name
 * @property {string} [email] - Guest email
 * @property {string} [phone] - Guest phone
 * @property {RSVPStatus} status - Attendance status
 * @property {number} numberOfGuests - Number of guests attending
 * @property {string} [guestNames] - Names of additional guests
 * @property {string} [message] - Guest message
 * @property {string} [dietaryRequirements] - Dietary requirements
 * @property {string} [specialRequests] - Special requests
 * @property {string} rsvpDate - ISO timestamp
 */

// ============================================
// GUESTBOOK
// ============================================

/**
 * @typedef {Object} GuestbookMessage
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} name - Guest name
 * @property {string} message - Message content
 * @property {string} [photo] - Photo URL
 * @property {boolean} approved - Whether message is approved
 * @property {boolean} pinned - Whether message is pinned
 * @property {string} createdAt - ISO timestamp
 */

// ============================================
// SONG SUGGESTIONS
// ============================================

/**
 * @typedef {Object} SongSuggestion
 * @property {string} id - Unique ID
 * @property {string} eventId - Associated event ID
 * @property {string} guestName - Guest name
 * @property {string} songTitle - Song title
 * @property {string} [artist] - Artist name
 * @property {string} [youtubeUrl] - YouTube URL
 * @property {string} [spotifyUrl] - Spotify URL
 * @property {string} [message] - Optional message
 * @property {boolean} approved - Whether suggestion is approved
 * @property {number} votes - Number of votes
 * @property {string} createdAt - ISO timestamp
 */

// ============================================
// MEDIA
// ============================================

/**
 * @typedef {Object} MediaMetadata
 * @property {number} [width] - Image width
 * @property {number} [height] - Image height
 * @property {number} [duration] - Video duration in seconds
 */

/**
 * @typedef {Object} Media
 * @property {string} id - Unique ID
 * @property {string} userId - Uploader user ID
 * @property {string} url - Media URL
 * @property {string} type - Media type (image, video)
 * @property {string} [mimeType] - MIME type
 * @property {number} [size] - File size in bytes
 * @property {MediaMetadata} [metadata] - Media metadata
 * @property {string} createdAt - ISO timestamp
 */

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T} [data] - Response data
 * @property {string} [error] - Error message
 * @property {string} [message] - Success message
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} data - Array of items
 * @property {number} total - Total number of items
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} totalPages - Total number of pages
 */

// ============================================
// FORM TYPES
// ============================================

/**
 * @typedef {Object} CreateEventFormData
 * @property {string} title - Event title
 * @property {EventTypeKey} type - Event type
 * @property {string} [description] - Event description
 * @property {string} startDate - Start date
 * @property {string} timezone - Timezone
 * @property {string} [venueName] - Venue name
 * @property {string} [venueAddress] - Venue address
 * @property {boolean} isPublic - Whether event is public
 * @property {ThemeSettings} themeSettings - Theme settings
 */

/**
 * @typedef {Object} RSVPFormData
 * @property {string} name - Guest name
 * @property {string} [email] - Guest email
 * @property {string} [phone] - Guest phone
 * @property {RSVPStatus} status - Attendance status
 * @property {number} numberOfGuests - Number of guests
 * @property {string} [guestNames] - Names of additional guests
 * @property {string} [message] - Guest message
 * @property {string} [dietaryRequirements] - Dietary requirements
 * @property {string} [specialRequests] - Special requests
 */

/**
 * @typedef {Object} GuestbookFormData
 * @property {string} name - Guest name
 * @property {string} message - Message content
 * @property {File} [photo] - Photo file
 */

/**
 * @typedef {Object} SongSuggestionFormData
 * @property {string} guestName - Guest name
 * @property {string} songTitle - Song title
 * @property {string} [artist] - Artist name
 * @property {string} [youtubeUrl] - YouTube URL
 * @property {string} [spotifyUrl] - Spotify URL
 * @property {string} [message] - Optional message
 */

// ============================================
// EVENT TYPE CONFIGURATION (Feature Flags)
// ============================================

/**
 * Configuration for each event type
 * @type {Record<EventTypeKey, EventTypeConfig>}
 */
export const EVENT_TYPE_CONFIGS = {
  [EventTypeKey.WEDDING]: {
    weddingParty: true,
    guestbook: true,
    songs: true,
    gallery: true,
    schedule: true,
    rsvp: true
  },
  [EventTypeKey.BIRTHDAY]: {
    weddingParty: false,
    guestbook: true,
    songs: true,
    gallery: true,
    schedule: true,
    rsvp: true
  },
  [EventTypeKey.GRADUATION]: {
    weddingParty: false,
    guestbook: true,
    songs: true,
    gallery: true,
    schedule: true,
    rsvp: true
  }
};

// ============================================
// THEME PRESETS
// ============================================

/**
 * Predefined theme settings for different event types
 * @type {Record<string, ThemeSettings>}
 */
export const THEME_PRESETS = {
  wedding: {
    primaryColor: '#D4AF37',
    secondaryColor: '#F5F5DC',
    backgroundColor: '#FFFFFF',
    textColor: '#2D2D2D',
    fontFamily: 'Playfair Display',
    headingFont: 'Playfair Display',
    borderRadius: '8px'
  },
  birthday: {
    primaryColor: '#FF6B6B',
    secondaryColor: '#FFE66D',
    backgroundColor: '#FFFFFF',
    textColor: '#2D2D2D',
    fontFamily: 'Nunito',
    headingFont: 'Nunito',
    borderRadius: '16px'
  },
  graduation: {
    primaryColor: '#2C3E50',
    secondaryColor: '#F1C40F',
    backgroundColor: '#FFFFFF',
    textColor: '#2D2D2D',
    fontFamily: 'Lora',
    headingFont: 'Lora',
    borderRadius: '8px'
  }
};

// ============================================
// EXPORT ALL TYPES (for JSDoc intellisense)
// ============================================

// This export ensures all types are available for JSDoc comments
// in your JavaScript files. You can import this file
// to get type hints in VS Code.

/**
 * @typedef {Object} Types
 * @property {typeof Role} Role
 * @property {typeof EventTypeKey} EventTypeKey
 * @property {typeof RSVPStatus} RSVPStatus
 * @property {typeof EVENT_TYPE_CONFIGS} EVENT_TYPE_CONFIGS
 * @property {typeof THEME_PRESETS} THEME_PRESETS
 */

// Export a default object for convenience
export default {
  Role,
  EventTypeKey,
  RSVPStatus,
  EVENT_TYPE_CONFIGS,
  THEME_PRESETS
};