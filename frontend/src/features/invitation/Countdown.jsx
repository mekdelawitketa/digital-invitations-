// frontend/src/features/invitation/Countdown.jsx
import { useState, useEffect } from 'react';

export const Countdown = ({ targetDate, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={`flex gap-4 justify-center ${className}`}>
      {timeUnits.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[70px]">
            <div className="text-3xl md:text-4xl font-bold text-gray-800">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="text-xs uppercase text-gray-500 mt-1">
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};