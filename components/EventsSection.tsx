'use client';

import { useState } from 'react';
import { EVENTS_DATA, type SensonicsEvent } from '@/data/events';
import { useSensonicsSound } from './SoundProvider';

interface EventsSectionProps {
  onSelectEvent: (event: SensonicsEvent) => void;
}

export default function EventsSection({ onSelectEvent }: EventsSectionProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'TECHNICAL' | 'NON-TECHNICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { playSound } = useSensonicsSound();

  const filteredEvents = EVENTS_DATA.filter((event) => {
    const matchesTab = activeTab === 'ALL' || event.category === activeTab;
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section id="events" className="py-24 px-4 max-w-7xl mx-auto">
      {/* Header Title & Category Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-mono tracking-widest text-accent-cyan uppercase font-bold block mb-2">EVENT SHOWCASE</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
            EXPLORE THE EVENTS
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="glass-input text-xs px-4 py-2.5 rounded-full pl-9 w-full sm:w-48 text-primary-text placeholder-secondary-text font-medium"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-secondary-text"></i>
          </div>

          {/* Glass Filter Tabs */}
          <div className="glass-pill p-1 rounded-full flex items-center justify-between border border-white/80">
            {(['ALL', 'TECHNICAL', 'NON-TECHNICAL'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { playSound('click'); setActiveTab(tab); }}
                className={`px-4 py-2 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white text-accent-cyan border border-slate-200 font-bold shadow-sm'
                    : 'text-secondary-text hover:text-primary-text font-medium'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => { playSound('click'); onSelectEvent(event); }}
            onMouseEnter={() => playSound('hover')}
            className="glass-card rounded-[28px] p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
          >
            {/* Top gloss edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"></div>

            <div>
              {/* Header Row */}
              <div className="flex justify-between items-center mb-5">
                <span className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border ${
                  event.category === 'TECHNICAL'
                    ? 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30'
                    : 'text-accent-violet bg-accent-violet/10 border-accent-violet/30'
                }`}>
                  {event.category}
                </span>
                <span className="font-mono text-xl font-bold text-slate-300 group-hover:text-primary-text transition-colors">
                  {event.number}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-primary-text group-hover:text-accent-cyan transition-colors mb-1">
                {event.name}
              </h3>
              <p className="text-[11px] font-mono text-secondary-text mb-4 line-clamp-1 font-semibold">
                {event.tagline}
              </p>

              <p className="text-xs text-secondary-text leading-relaxed mb-6 line-clamp-3">
                {event.shortDesc}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-secondary-text pt-4 border-t border-slate-200 mb-4 font-semibold">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-users text-xs text-accent-cyan"></i>
                  {event.teamSize}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-clock text-xs text-accent-violet"></i>
                  {event.duration}
                </span>
              </div>

              <button className="w-full glass-pill py-2.5 rounded-2xl text-xs font-bold text-primary-text group-hover:border-accent-cyan/40 group-hover:bg-white flex items-center justify-center gap-2 transition-all">
                <span>View Details</span>
                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-white/80">
          <i className="fa-solid fa-ghost text-4xl text-secondary-text mb-4"></i>
          <h3 className="text-lg font-bold text-primary-text mb-2">No events found</h3>
          <p className="text-xs text-secondary-text">Try clearing your search query or selecting another filter category.</p>
        </div>
      )}
    </section>
  );
}
