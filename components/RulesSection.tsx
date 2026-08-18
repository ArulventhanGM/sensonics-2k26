'use client';

import { useState } from 'react';
import { useSensonicsSound } from './SoundProvider';

const rules = [
  {
    q: 'General Eligibility & Entry Requirements',
    a: 'Sensonics 2026 is open to undergraduate and postgraduate students from all recognized engineering, technology, and science institutions. A valid institutional ID card is mandatory at the entry gate.',
  },
  {
    q: 'Participation in Multiple Events',
    a: 'Participants may register for multiple events as long as the event schedules do not overlap. Check the event chronology schedule to ensure smooth attendance.',
  },
  {
    q: 'Hardware Tools & Microcontrollers Guidelines',
    a: 'For technical events, standard equipment like oscilloscopes and multimeters are provided. Participants in hackathons should bring their own laptops with required software IDEs pre-installed.',
  },
  {
    q: 'Certificates & Prize Money Distribution',
    a: 'All registered participants receive official digital certificates of participation. Winners receive official trophies, hardcopy certificates, and direct bank transfer cash prizes on the day of the event.',
  },
];

export default function RulesSection() {
  const [openIdx, setOpenIdx] = useState(0);
  const { playSound } = useSensonicsSound();

  return (
    <section id="rules" className="py-24 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-accent-cyan uppercase font-bold block mb-2">GUIDELINES &amp; PROTOCOL</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
          RULES &amp; INFORMATION
        </h2>
      </div>

      <div className="space-y-4">
        {rules.map((rule, idx) => (
          <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-white/80">
            <button
              onClick={() => { playSound('click'); setOpenIdx(openIdx === idx ? -1 : idx); }}
              className="w-full p-6 text-left flex justify-between items-center gap-4 text-sm font-bold text-primary-text"
            >
              <span>{rule.q}</span>
              <i className={`fa-solid fa-chevron-down text-xs text-accent-cyan transition-transform duration-300 ${
                openIdx === idx ? 'rotate-180' : ''
              }`}></i>
            </button>

            {openIdx === idx && (
              <div className="px-6 pb-6 text-xs text-secondary-text leading-relaxed border-t border-slate-200 pt-4 animate-fade-in font-medium">
                {rule.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
