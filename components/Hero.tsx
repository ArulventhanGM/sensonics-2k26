'use client';

import { useSensonicsSound } from './SoundProvider';

interface HeroProps {
  onExplore: () => void;
  onRegister: () => void;
}

export default function Hero({ onExplore, onRegister }: HeroProps) {
  const { playSound } = useSensonicsSound();

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center items-center px-4 overflow-hidden">
      {/* Ambient Pastel Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-accent-violet/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Eyebrow Label Pill */}
        <div className="glass-pill px-4 py-1.5 rounded-full mb-8 inline-flex items-center gap-2.5 border border-white/80 animate-float">
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping"></span>
          <span className="text-[11px] font-mono tracking-widest text-secondary-text uppercase font-bold">
            DEPARTMENT OF ELECTRONICS &amp; INSTRUMENTATION
          </span>
        </div>

        {/* Liquid Glass Hero Heading */}
        <div className="relative mb-4">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-liquid-hero uppercase font-sans select-none leading-none">
            SENSONICS
          </h1>
          <div className="absolute -inset-4 bg-accent-cyan/10 blur-3xl -z-10 rounded-full"></div>
        </div>

        {/* Subheading */}
        <h2 className="text-xl sm:text-3xl md:text-4xl font-light tracking-tight text-primary-text mb-4 max-w-3xl">
          WHERE ELECTRONICS <span className="text-gradient-cyan font-bold">MEETS EXPERIENCE.</span>
        </h2>

        <p className="text-sm sm:text-base text-secondary-text max-w-xl font-normal leading-relaxed mb-8">
          A celebration of technology, creativity, competition and innovation. Discover 8 precision engineering and strategic challenges.
        </p>

        {/* Event Badge Highlights */}
        <div className="glass-pill px-6 py-2.5 rounded-2xl mb-10 inline-flex flex-wrap items-center justify-center gap-4 border border-white/80">
          <span className="text-xs font-mono text-accent-cyan font-bold flex items-center gap-2">
            <i className="fa-solid fa-microchip"></i> 4 Technical Events
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-mono text-accent-violet font-bold flex items-center gap-2">
            <i className="fa-solid fa-gamepad"></i> 4 Non-Technical Events
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-mono text-primary-text font-bold flex items-center gap-2">
            <i className="fa-solid fa-trophy text-amber-500"></i> ₹1,00,000+ Prize Pool
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={() => { playSound('click'); onExplore(); }}
            className="w-full sm:w-auto glass-btn-primary px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 group shadow-[0_10px_30px_rgba(13,148,136,0.2)]"
          >
            <span>EXPLORE EVENTS</span>
            <i className="fa-solid fa-compass group-hover:rotate-45 transition-transform duration-300"></i>
          </button>

          <button
            onClick={() => { playSound('click'); onRegister(); }}
            className="w-full sm:w-auto glass-btn-secondary px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 group"
          >
            <span>REGISTER NOW</span>
            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>

        {/* HUD Sensor Panel Visual */}
        <div className="mt-16 relative w-full max-w-2xl h-56 glass-panel rounded-3xl p-6 overflow-hidden flex items-center justify-around border border-white/90 shadow-xl">
          <div className="absolute top-4 left-6 flex items-center gap-2 font-mono text-[10px] text-accent-cyan font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping"></span>
            <span>SYSTEM SIGNAL: ACTIVE 100%</span>
          </div>

          <div className="absolute top-4 right-6 font-mono text-[10px] text-secondary-text">
            FREQ: 433.92 MHz // LIGHT REF 0.95
          </div>

          <div className="w-1/3 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl glass-pill flex items-center justify-center text-accent-cyan mb-3 shadow-inner">
              <i className="fa-solid fa-wave-square text-2xl animate-pulse"></i>
            </div>
            <span className="text-[11px] font-mono font-semibold text-secondary-text">SIGNAL DIAGNOSTICS</span>
          </div>

          <div className="w-24 h-24 rounded-full glass-panel border border-accent-cyan/40 flex items-center justify-center shadow-[0_10px_30px_rgba(13,148,136,0.2)] relative animate-float">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent-cyan/20 to-accent-violet/20 backdrop-blur-md flex items-center justify-center">
              <i className="fa-solid fa-bolt text-xl text-accent-cyan"></i>
            </div>
          </div>

          <div className="w-1/3 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl glass-pill flex items-center justify-center text-accent-violet mb-3 shadow-inner">
              <i className="fa-solid fa-network-wired text-2xl"></i>
            </div>
            <span className="text-[11px] font-mono font-semibold text-secondary-text">SENSOR MATRIX</span>
          </div>
        </div>
      </div>
    </section>
  );
}
