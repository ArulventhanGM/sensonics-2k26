'use client';

import { useState, useEffect } from 'react';
import { useSensonicsSound } from './SoundProvider';

interface NavbarProps {
  onOpenRegister: () => void;
}

const navLinks = [
  { name: 'Home', href: '#hero', icon: 'fa-house' },
  { name: 'Experience', href: '#experience', icon: 'fa-compass' },
  { name: 'Events', href: '#events', icon: 'fa-calendar-days' },
  { name: 'Schedule', href: '#schedule', icon: 'fa-clock' },
  { name: 'Rules', href: '#rules', icon: 'fa-shield-halved' },
  { name: 'About', href: '#about', icon: 'fa-circle-info' },
];

export default function Navbar({ onOpenRegister }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const { soundEnabled, setSoundEnabled, playSound } = useSensonicsSound();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveNav(navLinks[i].name);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Floating Liquid Glass Bottom Navigation Dock */}
      <header className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl transition-all duration-300">
        <div className="glass-liquid-dock rounded-full px-3 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-2 shadow-2xl relative">

          {/* Brand Logo & Pill */}
          <a
            href="#hero"
            onClick={() => { playSound('click'); setActiveNav('Home'); }}
            className="flex items-center gap-2.5 group pl-1.5 pr-3 py-1.5 rounded-full hover:bg-white/60 transition-all duration-300 shrink-0"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-blue flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-wave-square text-xs"></i>
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="font-extrabold tracking-wider text-sm text-primary-text font-mono leading-none">SENSONICS</span>
              <span className="text-[8px] tracking-widest text-accent-cyan uppercase font-mono font-bold mt-0.5">DEPT. OF E&I</span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/5 p-1 rounded-full border border-white/60">
            {navLinks.map((link) => {
              const isActive = activeNav === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => { playSound('click'); setActiveNav(link.name); }}
                  onMouseEnter={() => playSound('hover')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-full transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-accent-cyan shadow-md border border-slate-200/80 font-bold scale-105'
                      : 'text-secondary-text hover:text-primary-text hover:bg-white/50'
                  }`}
                >
                  <i className={`fa-solid ${link.icon} text-xs ${isActive ? 'text-accent-cyan' : 'text-slate-400'}`}></i>
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Mobile Dock Quick Nav */}
          <nav className="flex md:hidden items-center gap-1 bg-slate-900/5 p-1 rounded-full border border-white/60">
            {navLinks.slice(0, 4).map((link) => {
              const isActive = activeNav === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => { playSound('click'); setActiveNav(link.name); }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs transition-all ${
                    isActive
                      ? 'bg-white text-accent-cyan shadow-sm border border-slate-200 font-bold scale-105'
                      : 'text-secondary-text hover:text-primary-text'
                  }`}
                  title={link.name}
                >
                  <i className={`fa-solid ${link.icon}`}></i>
                </a>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sound Toggle */}
            <button
              onClick={() => { setSoundEnabled(!soundEnabled); playSound('click'); }}
              className={`w-9 h-9 rounded-full glass-pill flex items-center justify-center border transition-all ${
                soundEnabled ? 'text-accent-cyan border-accent-cyan/40 bg-white/80' : 'text-secondary-text border-slate-200'
              }`}
              title="Toggle Audio Feedback"
            >
              <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'} text-xs`}></i>
            </button>

            {/* Register CTA Button */}
            <button
              onClick={() => { playSound('click'); onOpenRegister(); }}
              className="glass-btn-primary px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-[0_10px_30px_rgba(13,148,136,0.2)] group"
            >
              <span className="hidden sm:inline">REGISTER NOW</span>
              <span className="sm:hidden">REGISTER</span>
              <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => { setMobileMenuOpen(!mobileMenuOpen); playSound('click'); }}
              className="md:hidden w-9 h-9 rounded-full glass-pill flex items-center justify-center text-primary-text border border-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-ellipsis-vertical'} text-xs`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Bottom Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 bottom-24 glass-panel bg-white/95 rounded-[32px] p-6 border border-white/90 shadow-2xl flex flex-col gap-4 z-50 animate-fade-in">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent-cyan/10 text-accent-cyan flex items-center justify-center text-xs">
                <i className="fa-solid fa-compass"></i>
              </div>
              <span className="text-xs font-mono font-bold text-primary-text">NAVIGATION MENU</span>
            </div>
            <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20 font-bold">SENSONICS &apos;26</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => { playSound('click'); setActiveNav(link.name); setMobileMenuOpen(false); }}
                className="px-4 py-3 rounded-2xl hover:bg-slate-100 text-xs font-bold text-primary-text flex items-center gap-3 border border-slate-100"
              >
                <i className={`fa-solid ${link.icon} text-accent-cyan text-sm`}></i>
                <span>{link.name}</span>
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => { playSound('click'); setMobileMenuOpen(false); onOpenRegister(); }}
              className="w-full glass-btn-primary py-3.5 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <span>REGISTER FOR EVENTS</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
