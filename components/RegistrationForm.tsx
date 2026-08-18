'use client';

import { useState, useEffect } from 'react';
import { EVENTS_DATA } from '@/data/events';
import { useSensonicsSound } from './SoundProvider';

export interface RegistrationTicket {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  year: string;
  selectedEvent: string;
  teamName: string;
  teamMembers: string;
  registrationId: string;
  timestamp: string;
}

interface RegistrationFormProps {
  prefilledEvent: string;
  onRegistrationComplete: (ticket: RegistrationTicket) => void;
}

export default function RegistrationForm({ prefilledEvent, onRegistrationComplete }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    department: '',
    year: '3rd Year',
    selectedEvent: prefilledEvent || 'CIRCUITRIX 3.0',
    teamName: '',
    teamMembers: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState('');
  const [error, setError] = useState('');
  const { playSound } = useSensonicsSound();

  useEffect(() => {
    if (prefilledEvent) {
      setFormData((prev) => ({ ...prev, selectedEvent: prefilledEvent }));
    }
  }, [prefilledEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    setIsSubmitting(true);
    setError('');
    setSubmitStep('Verifying participant telemetry...');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSubmitStep('Allocating event registration key...');
      await new Promise((r) => setTimeout(r, 600));

      setSubmitStep('Generating glass entry pass...');
      await new Promise((r) => setTimeout(r, 600));

      playSound('success');
      onRegistrationComplete({
        ...formData,
        registrationId: data.registrationId,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
      setSubmitStep('');
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="register" className="py-24 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-accent-cyan uppercase font-bold block mb-2">PORTAL REGISTRATION</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-primary-text tracking-tight mb-3">
          READY TO ENTER?
        </h2>
        <p className="text-xs sm:text-sm text-secondary-text max-w-lg mx-auto font-medium">
          Choose your event. Bring your skills. Make your mark at SENSONICS &apos;26.
        </p>
      </div>

      <div className="glass-panel rounded-[36px] p-6 sm:p-10 border border-white/90 shadow-2xl relative">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium animate-fade-in">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                FULL NAME *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="alex.mercer@college.edu"
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                COLLEGE / INSTITUTION *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => updateField('institution', e.target.value)}
                placeholder="e.g. National Institute of Tech"
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                DEPARTMENT *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => updateField('department', e.target.value)}
                placeholder="e.g. E&I / ECE / CSE"
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                ACADEMIC YEAR *
              </label>
              <select
                value={formData.year}
                onChange={(e) => updateField('year', e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs text-primary-text bg-white font-semibold"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year / PG</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                SELECT EVENT *
              </label>
              <select
                value={formData.selectedEvent}
                onChange={(e) => updateField('selectedEvent', e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs text-primary-text bg-white font-semibold"
              >
                {EVENTS_DATA.map((evt) => (
                  <option key={evt.id} value={evt.name}>
                    [{evt.category}] {evt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                TEAM NAME (IF APPLICABLE)
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => updateField('teamName', e.target.value)}
                placeholder="e.g. Quantum Innovators"
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-secondary-text uppercase tracking-wider mb-2 font-bold">
                ADDITIONAL TEAM MEMBERS
              </label>
              <input
                type="text"
                value={formData.teamMembers}
                onChange={(e) => updateField('teamMembers', e.target.value)}
                placeholder="Names separated by comma"
                className="glass-input w-full px-4 py-3 rounded-2xl text-xs font-semibold"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full glass-btn-primary py-4 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(13,148,136,0.2)]"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span>{submitStep}</span>
                </>
              ) : (
                <>
                  <span>CONFIRM &amp; REGISTER NOW</span>
                  <i className="fa-solid fa-bolt text-white"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
