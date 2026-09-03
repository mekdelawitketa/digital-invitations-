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
import { RSVPForm } from '../rsvp/RSVPForm';
import { GuestbookForm } from '../guestbook/GuestbookForm';
import { SongForm } from '../songs/SongForm';

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

      {/* RSVP Section */}
      <section className="py-16 px-4 bg-gray-50" id="rsvp">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">RSVP</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
            <p className="text-gray-500 mt-4">Please let us know if you can attend</p>
          </div>
          <RSVPForm eventId={event.id} />
        </div>
      </section>

      {/* Guestbook Section */}
      <section className="py-16 px-4 bg-white" id="guestbook">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Guestbook</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
            <p className="text-gray-500 mt-4">Leave your wishes and memories</p>
          </div>
          <GuestbookForm eventId={event.id} />
        </div>
      </section>

      {/* Song Suggestions Section */}
      <section className="py-16 px-4 bg-gray-50" id="songs">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Song Suggestions</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
            <p className="text-gray-500 mt-4">Suggest songs for the celebration playlist</p>
          </div>
          <SongForm eventId={event.id} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        <p>© {new Date().getFullYear()} Digital Invitations. All rights reserved.</p>
        <p className="mt-1">Made with ❤️</p>
      </footer>
    </div>
  );
};

export default InvitationPage;