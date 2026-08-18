'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventsSection from '@/components/EventsSection';
import EventDetailModal from '@/components/EventDetailModal';
import RegistrationForm from '@/components/RegistrationForm';
import ConfirmationPass from '@/components/ConfirmationPass';
import CountdownSection from '@/components/CountdownSection';
import ScheduleSection from '@/components/ScheduleSection';
import AboutSection from '@/components/AboutSection';
import ExperienceOverview from '@/components/ExperienceOverview';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import RulesSection from '@/components/RulesSection';

import { EVENTS_DATA, type SensonicsEvent } from '@/data/events';

export default function Home() {
  const [modalEvent, setModalEvent] = useState<SensonicsEvent | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [prefilledEvent, setPrefilledEvent] = useState<string>('');
  const [confirmationTicket, setConfirmationTicket] = useState<any>(null);

  const handleOpenRegister = () => {
    setShowRegister(true);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
    setPrefilledEvent('');
  };

  const handleSelectEvent = (event: SensonicsEvent) => {
    setModalEvent(event);
  };

  const handleRegisterForEvent = (eventName: string) => {
    setModalEvent(null);
    setPrefilledEvent(eventName);
    setShowRegister(true);
  };

  const handleRegistrationComplete = (ticket: any) => {
    setShowRegister(false);
    setConfirmationTicket(ticket);
  };

  const handleResetAfterConfirm = () => {
    setConfirmationTicket(null);
  };

  return (
    <div className="relative overflow-x-hidden">
      <BackgroundCanvas />

      <Navbar onOpenRegister={handleOpenRegister} />

      <main className="pt-28">
        <Hero onExplore={() => window.scrollTo({ top: document.getElementById('events')?.offsetTop || 800, behavior: 'smooth' })} onRegister={handleOpenRegister} />

        <ExperienceOverview />

        <section id="experience">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <EventsSection onSelectEvent={handleSelectEvent} />
              </div>
              <div className="space-y-8">
                <CountdownSection />
                <ScheduleSection />
              </div>
            </div>
          </div>
        </section>

        <RulesSection />

        <AboutSection />

        {showRegister && (
          <div>
            <RegistrationForm prefilledEvent={prefilledEvent} onRegistrationComplete={handleRegistrationComplete} />
          </div>
        )}

        {modalEvent && (
          <EventDetailModal
            event={modalEvent}
            onClose={() => setModalEvent(null)}
            onRegisterForEvent={handleRegisterForEvent}
          />
        )}

        {confirmationTicket && <ConfirmationPass ticket={confirmationTicket} onReset={handleResetAfterConfirm} />}

        <footer className="py-12 text-center text-xs text-secondary-text">
          © 2026 SENSONICS • Department of Electronics & Instrumentation
        </footer>
      </main>
    </div>
  );
}
