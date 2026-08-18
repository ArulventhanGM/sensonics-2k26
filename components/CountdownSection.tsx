'use client';

import { useState, useEffect } from 'react';

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const eventDate = new Date('October 24, 2026 09:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d < 10 ? `0${d}` : `${d}`,
          hours: h < 10 ? `0${h}` : `${h}`,
          minutes: m < 10 ? `0${m}` : `${m}`,
          seconds: s < 10 ? `0${s}` : `${s}`,
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto my-12">
      <div className="glass-panel rounded-[36px] p-8 sm:p-12 text-center border border-accent-cyan/30 relative overflow-hidden shadow-xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="text-xs font-mono tracking-widest text-accent-cyan uppercase font-bold block mb-3">LAUNCH TIME</span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-primary-text tracking-tight mb-8">
          THE COUNTDOWN BEGINS
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {items.map((item, idx) => (
            <div key={idx} className="glass-card bg-white/70 rounded-2xl p-4 sm:p-6 border border-white/90 flex flex-col items-center">
              <span className="text-3xl sm:text-5xl font-black font-mono text-gradient-cyan tracking-tight mb-1">
                {item.value}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-secondary-text uppercase font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs font-mono text-secondary-text font-semibold flex items-center justify-center gap-2">
          <i className="fa-solid fa-calendar-days text-accent-cyan"></i>
          <span>OCTOBER 24, 2026 • 09:00 AM IST</span>
        </div>
      </div>
    </section>
  );
}
