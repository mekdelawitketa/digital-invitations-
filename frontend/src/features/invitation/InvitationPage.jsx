// frontend/src/features/invitation/InvitationPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventsAPI } from '../../api/events';
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
    if (slug) fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-500">{error || 'This invitation does not exist.'}</p>
        </div>
      </div>
    );
  }

  const showWeddingParty = event.typeKey === 'wedding';

  return (
    <div className="min-h-screen bg-white font-serif">
      {/* Hero Section */}
      <Hero event={event} />
      
      {/* Event Info */}
      <EventInfo event={event} />
      
      {/* Story */}
      {event.stories && event.stories.length > 0 && (
        <StorySection stories={event.stories} />
      )}
      
      {/* Gallery */}
      {event.albums && event.albums.length > 0 && (
        <GallerySection albums={event.albums} />
      )}
      
      {/* Wedding Party */}
      {showWeddingParty && event.weddingParty && event.weddingParty.length > 0 && (
        <WeddingPartySection members={event.weddingParty} />
      )}
      
      {/* Schedule */}
      {event.schedules && event.schedules.length > 0 && (
        <ScheduleSection schedules={event.schedules} />
      )}
      
      {/* Location */}
      {(event.venueName || event.venueAddress) && (
        <LocationSection event={event} />
      )}
      
      {/* RSVP */}
      <RSVPSection eventId={event.id} />
      
      {/* Guestbook */}
      <GuestbookSection eventId={event.id} guestbook={event.guestbook} />
      
      {/* Songs */}
      <SongSection eventId={event.id} songs={event.songs} />

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        <p>© {new Date().getFullYear()} Digital Invitations. All rights reserved.</p>
        <p className="mt-1">Made with ❤️</p>
      </footer>
    </div>
  );
};

// ==================== HERO SECTION ====================
const Hero = ({ event }) => {
  const { title, coverImage, startDate, typeKey } = event;
  
  const typeLabels = {
    wedding: '💒 Wedding',
    birthday: '🎂 Birthday',
    graduation: '🎓 Graduation',
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url(${coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 py-20 max-w-4xl mx-auto">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 opacity-80">
          {typeLabels[typeKey] || 'Event'}
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-6 font-light tracking-wider">
          You Are Invited
        </p>
        <div className="w-24 h-0.5 bg-white/50 mx-auto mb-8" />
        
        {/* Countdown */}
        <Countdown targetDate={startDate} />
        
        <p className="text-lg md:text-xl mt-8 opacity-80 font-light">
          {new Date(startDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </section>
  );
};

// ==================== COUNTDOWN ====================
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[60px] md:min-w-[80px] border border-white/20">
            <div className="text-2xl md:text-4xl font-bold text-white">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] md:text-xs uppercase text-white/70 mt-1 tracking-wider">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== EVENT INFO ====================
const EventInfo = ({ event }) => {
  const { venueName, venueAddress, startDate, description } = event;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Event Details
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold text-gray-700 mb-2">Date & Time</h3>
            <p className="text-gray-600">
              {new Date(startDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-semibold text-gray-700 mb-2">Venue</h3>
            <p className="text-gray-600">{venueName}</p>
            {venueAddress && <p className="text-gray-500 text-sm mt-1">{venueAddress}</p>}
          </div>
        </div>
        {description && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-600 italic">{description}</p>
          </div>
        )}
      </div>
    </section>
  );
};

// ==================== STORY SECTION ====================
const StorySection = ({ stories }) => (
  <section className="py-16 px-4 bg-gray-50">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
      </div>
      <div className="space-y-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-2xl shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow">
            {story.title && <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{story.title}</h3>}
            {story.subtitle && <p className="text-gray-500 text-sm mb-4">{story.subtitle}</p>}
            {story.content && <p className="text-gray-600 leading-relaxed">{story.content}</p>}
            {story.image && (
              <img src={story.image} alt={story.title} className="mt-4 rounded-xl w-full max-h-96 object-cover" loading="lazy" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ==================== GALLERY SECTION ====================
const GallerySection = ({ albums }) => {
  const allImages = albums.flatMap(a => a.images || []);
  if (allImages.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Gallery</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allImages.slice(0, 8).map((img) => (
            <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img src={img.thumbnail || img.url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== WEDDING PARTY SECTION ====================
const WeddingPartySection = ({ members }) => {
  if (!members || members.length === 0) return null;
  
  const grouped = members.reduce((acc, m) => {
    if (!acc[m.role]) acc[m.role] = [];
    acc[m.role].push(m);
    return acc;
  }, {});

  const roleOrder = ['Bride', 'Groom', 'Maid of Honor', 'Best Man', 'Bridesmaid', 'Groomsman'];
  const sortedRoles = Object.keys(grouped).sort((a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b));

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Wedding Party</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>
        {sortedRoles.map((role) => (
          <div key={role} className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">{role}s</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {grouped[role].map((m) => (
                <div key={m.id} className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow">
                  {m.profileImage ? (
                    <img src={m.profileImage} alt={m.name} className="w-20 h-20 rounded-full mx-auto object-cover mb-3" />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center text-3xl text-white mb-3">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <p className="font-medium text-gray-800">{m.name}</p>
                  {m.bio && <p className="text-sm text-gray-500">{m.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ==================== SCHEDULE SECTION ====================
const ScheduleSection = ({ schedules }) => {
  if (!schedules || schedules.length === 0) return null;
  const sorted = [...schedules].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Event Schedule</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        </div>
        <div className="space-y-4">
          {sorted.map((item, idx) => (
            <div key={item.id} className="bg-gray-50 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="md:w-48 flex-shrink-0">
                <div className="text-sm font-medium text-pink-600">
                  {item.date && new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-sm text-gray-500">
                  {item.startTime} {item.endTime && `- ${item.endTime}`}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                {item.location && <p className="text-gray-500 text-sm mt-1">📍 {item.location}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== LOCATION SECTION ====================
const LocationSection = ({ event }) => (
  <section className="py-16 px-4 bg-gray-50">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Location</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
      </div>
      <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-md">
        <div className="text-5xl mb-4">📍</div>
        {event.venueName && <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.venueName}</h3>}
        {event.venueAddress && <p className="text-gray-600 mb-4">{event.venueAddress}</p>}
        {event.googleMapsUrl && (
          <a href={event.googleMapsUrl} target="_blank" rel="noopener" 
             className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Open in Google Maps
          </a>
        )}
      </div>
    </div>
  </section>
);

// ==================== RSVP SECTION ====================
const RSVPSection = ({ eventId }) => (
  <section className="py-16 px-4 bg-white" id="rsvp">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">RSVP</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        <p className="text-gray-500 mt-4">Please let us know if you can attend</p>
      </div>
      <RSVPForm eventId={eventId} />
    </div>
  </section>
);

// ==================== GUESTBOOK SECTION ====================
const GuestbookSection = ({ eventId, guestbook }) => (
  <section className="py-16 px-4 bg-gray-50" id="guestbook">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Guestbook</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        <p className="text-gray-500 mt-4">Leave your wishes and memories</p>
      </div>
      <GuestbookForm eventId={eventId} />
      {guestbook && guestbook.filter(m => m.approved).length > 0 && (
        <div className="mt-8 space-y-4">
          {guestbook.filter(m => m.approved).map((msg) => (
            <div key={msg.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{msg.name}</span>
                <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600 mt-1">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

// ==================== SONG SECTION ====================
const SongSection = ({ eventId, songs }) => (
  <section className="py-16 px-4 bg-white" id="songs">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Song Suggestions</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
        <p className="text-gray-500 mt-4">Suggest songs for the celebration</p>
      </div>
      <SongForm eventId={eventId} />
      {songs && songs.filter(s => s.approved).length > 0 && (
        <div className="mt-8 space-y-3">
          {songs.filter(s => s.approved).map((song) => (
            <div key={song.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{song.songTitle}</p>
                <p className="text-sm text-gray-500">by {song.artist} • Suggested by {song.guestName}</p>
              </div>
              <span className="text-sm text-gray-500">❤️ {song.votes || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

// ==================== IMPORTS ====================
// Place these imports at the top of the file
// import { RSVPForm } from '../rsvp/RSVPForm';
// import { GuestbookForm } from '../guestbook/GuestbookForm';
// import { SongForm } from '../songs/SongForm';