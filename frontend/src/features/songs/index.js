// frontend/src/features/songs/index.js

// ============================================
// Public Components (for invitation page)
// ============================================

/**
 * SongForm - Public form for guests to submit song suggestions
 * @component
 * @example
 * <SongForm eventId={event.id} />
 */
export { SongForm } from './SongForm';

/**
 * SongSuggestions - Public display of approved songs with voting
 * @component
 * @example
 * <SongSuggestions songs={event.songs} />
 */
export { SongSuggestions } from './SongSuggestions';

/**
 * SongCard - Individual song card for public display
 * @component
 * @example
 * <SongCard song={song} />
 */
export { SongCard } from './SongCard';

// ============================================
// Owner Components (for moderation dashboard)
// ============================================

/**
 * SongManager - Owner moderation interface for song suggestions
 * Features: approve, reject, pin, delete, filter, stats
 * @component
 * @example
 * <SongManager />
 */
export { SongManager } from './SongManager';

// ============================================
// Default Export (for convenience)
// ============================================

/**
 * Default export for easier imports
 * @example
 * import Songs from '../features/songs';
 * // Then use Songs.SongForm, Songs.SongManager, etc.
 */
export default {
  SongForm: () => import('./SongForm').then(m => m.SongForm),
  SongSuggestions: () => import('./SongSuggestions').then(m => m.SongSuggestions),
  SongCard: () => import('./SongCard').then(m => m.SongCard),
  SongManager: () => import('./SongManager').then(m => m.SongManager),
};saz