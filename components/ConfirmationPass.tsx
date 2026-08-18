'use client';

import { useSensonicsSound } from './SoundProvider';
import { type RegistrationTicket } from './RegistrationForm';

interface ConfirmationPassProps {
  ticket: RegistrationTicket | null;
  onReset: () => void;
}

export default function ConfirmationPass({ ticket, onReset }: ConfirmationPassProps) {
  const { playSound } = useSensonicsSound();

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel bg-white/95 w-full max-w-md rounded-[36px] p-8 border border-white shadow-2xl relative text-center">
        {/* Success Badge */}
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 text-teal-600 shadow-[0_10px_30px_rgba(13,148,136,0.2)]">
          <i className="fa-solid fa-check text-2xl"></i>
        </div>

        <span className="text-[10px] font-mono tracking-widest text-accent-cyan uppercase font-bold block mb-1">
          TRANSACTION CONFIRMED
        </span>
        <h2 className="text-2xl font-black text-primary-text mb-6">REGISTRATION CONFIRMED</h2>

        {/* Digital Glass Entry Pass Ticket */}
        <div className="glass-card bg-white/80 rounded-2xl p-6 border border-slate-200 text-left mb-6 relative overflow-hidden shadow-md">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <span className="text-[9px] font-mono text-secondary-text uppercase block font-bold">PASS ID</span>
              <span className="text-sm font-mono font-bold text-accent-cyan">{ticket.registrationId}</span>
            </div>
            <span className="text-[10px] font-mono bg-teal-500/10 text-teal-700 font-bold px-2.5 py-1 rounded-full border border-teal-500/20">
              VALID ACCESS
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-secondary-text text-[10px] uppercase block font-mono font-bold">EVENT</span>
              <span className="font-bold text-primary-text">{ticket.selectedEvent}</span>
            </div>

            <div className="flex justify-between">
              <div>
                <span className="text-secondary-text text-[10px] uppercase block font-mono font-bold">PARTICIPANT</span>
                <span className="font-semibold text-primary-text">{ticket.fullName}</span>
              </div>
              <div className="text-right">
                <span className="text-secondary-text text-[10px] uppercase block font-mono font-bold">YEAR</span>
                <span className="font-semibold text-primary-text">{ticket.year}</span>
              </div>
            </div>

            <div>
              <span className="text-secondary-text text-[10px] uppercase block font-mono font-bold">INSTITUTION</span>
              <span className="font-semibold text-secondary-text truncate block">{ticket.institution}</span>
            </div>
          </div>

          {/* Barcode Graphic */}
          <div className="mt-5 pt-3 border-t border-dashed border-slate-300 flex flex-col items-center">
            <div className="h-8 w-full bg-slate-100 rounded flex items-center justify-around px-2 py-1 opacity-90 border border-slate-200">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className={`h-full bg-slate-800 ${i % 3 === 0 ? 'w-1' : 'w-0.5'}`}></div>
              ))}
            </div>
            <span className="text-[8px] font-mono text-secondary-text mt-1 font-semibold">SENSONICS-E&amp;I-2026-DIGITAL-PASS</span>
          </div>
        </div>

        <p className="text-xs text-secondary-text mb-6 font-medium">
          A confirmation copy has been queued to <span className="text-primary-text font-mono font-bold">{ticket.email}</span>.
        </p>

        <button
          onClick={() => { playSound('click'); onReset(); }}
          className="w-full glass-btn-primary py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase"
        >
          BACK TO SENSONICS
        </button>
      </div>
    </div>
  );
}
