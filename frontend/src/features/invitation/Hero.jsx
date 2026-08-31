// frontend/src/features/invitation/Hero.jsx
import { Countdown } from './Countdown';

export const Hero = ({ event }) => {
  const { title, coverImage, startDate, typeKey } = event;

  const typeLabels = {
    wedding: '💒 Wedding',
    birthday: '🎂 Birthday',
    graduation: '🎓 Graduation',
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${coverImage || '/images/default-cover.jpg'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 py-20 max-w-4xl mx-auto">
        <p className="text-sm md:text-base uppercase tracking-widest mb-4 opacity-90">
          {typeLabels[typeKey] || 'Event'}
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          You Are Invited
        </p>

        <div className="mb-8">
          <Countdown targetDate={startDate} />
        </div>

        <p className="text-lg md:text-xl opacity-90">
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