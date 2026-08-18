'use client';

import { type SensonicsEvent } from '@/data/events';
import { useSensonicsSound } from './SoundProvider';

interface EventDetailModalProps {
  event: SensonicsEvent | null;
  onClose: () => void;
  onRegisterForEvent: (eventName: string) => void;
}

export default function EventDetailModal({ event, onClose, onRegisterForEvent }: EventDetailModalProps) {
  const { playSound } = useSensonicsSound();

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel bg-white/90 w-full max-w-2xl rounded-[32px] p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative border border-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => { playSound('click'); onClose(); }}
          className="absolute top-6 right-6 glass-pill w-10 h-10 rounded-full flex items-center justify-center text-secondary-text hover:text-primary-text border border-slate-200"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        {/* Event Badge & Title */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className={`text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full border ${
            event.category === 'TECHNICAL'
              ? 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30'
              : 'text-accent-violet bg-accent-violet/10 border-accent-violet/30'
          }`}>
            {event.category} • #{event.number}
          </span>
          <span className="text-xs font-mono font-bold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            PRIZE POOL: {event.prizePool}
          </span>
        </div>

        <h2 className="text-3xl font-extrabold text-primary-text mb-1">{event.name}</h2>
        <p className="text-xs font-mono font-bold text-accent-cyan mb-6">{event.tagline}</p>

        {/* Key Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="glass-pill p-3 rounded-2xl text-center border border-slate-200">
            <span className="text-[10px] font-mono text-secondary-text uppercase block font-bold">TEAM SIZE</span>
            <span className="text-xs font-bold text-primary-text mt-0.5 block">{event.teamSize}</span>
          </div>
          <div className="glass-pill p-3 rounded-2xl text-center border border-slate-200">
            <span className="text-[10px] font-mono text-secondary-text uppercase block font-bold">DURATION</span>
            <span className="text-xs font-bold text-primary-text mt-0.5 block">{event.duration}</span>
          </div>
          <div className="glass-pill p-3 rounded-2xl text-center border border-slate-200 col-span-2 sm:col-span-2">
            <span className="text-[10px] font-mono text-secondary-text uppercase block font-bold">VENUE</span>
            <span className="text-xs font-bold text-accent-cyan mt-0.5 block truncate">{event.venue}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-xs font-mono text-secondary-text uppercase tracking-widest mb-2 font-bold">ABOUT THE EVENT</h3>
          <p className="text-sm text-primary-text leading-relaxed font-normal">{event.fullDesc}</p>
        </div>

        {/* Rules & Guidelines */}
        <div className="mb-8">
          <h3 className="text-xs font-mono text-secondary-text uppercase tracking-widest mb-3 font-bold">RULES &amp; GUIDELINES</h3>
          <ul className="space-y-2">
            {event.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-secondary-text font-medium">
                <i className="fa-solid fa-angle-right text-accent-cyan mt-0.5"></i>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Bottom CTA */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-[11px] font-mono text-secondary-text font-medium">
            ELIGIBILITY: <span className="text-primary-text font-bold">{event.eligibility}</span>
          </div>
          <button
            onClick={() => { playSound('click'); onRegisterForEvent(event.name); }}
            className="w-full sm:w-auto glass-btn-primary px-6 py-3 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2"
          >
            <span>REGISTER FOR THIS EVENT</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
