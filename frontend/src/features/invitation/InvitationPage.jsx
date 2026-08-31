// frontend/src/features/invitation/InvitationPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI } from '../../api/events';
import { Hero } from './Hero';
import { EventInfo } from './EventInfo';
import { EventStory } from './EventStory';
import { Location } from './Location';
import { Schedule } from './Schedule';
import { Gallery } from './Gallery';
import { WeddingParty } from './WeddingParty';

export const InvitationPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await eventsAPI.getBySlug(slug);
        setEvent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Event not found');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading invitation...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-500">{error || 'This invitation does not exist.'}</p>
        </div>
      </div>
    );
  }

  // Only show wedding party for wedding events
  const showWeddingParty = event.typeKey === 'wedding';

  return (
    <div className="min-h-screen bg-white">
      <Hero event={event} />
      <EventInfo event={event} />
      
      {event.stories && event.stories.length > 0 && (
        <EventStory stories={event.stories} />
      )}
      
      {event.albums && event.albums.length > 0 && (
        <Gallery albums={event.albums} />
      )}
      
      {showWeddingParty && event.weddingParty && event.weddingParty.length > 0 && (
        <WeddingParty members={event.weddingParty} />
      )}
      
      {event.schedules && event.schedules.length > 0 && (
        <Schedule schedules={event.schedules} />
      )}
      
      {(event.venueName || event.venueAddress) && (
        <Location event={event} />
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        <p>© {new Date().getFullYear()} Digital Invitations. All rights reserved.</p>
        <p className="mt-1">Made with ❤️</p>
      </footer>
    </div>
  );
};