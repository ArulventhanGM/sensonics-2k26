'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type SoundType = 'click' | 'hover' | 'success';

interface SoundContextValue {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playSound: (type?: SoundType) => void;
}

const SoundContext = createContext<SoundContextValue>({
  soundEnabled: true,
  setSoundEnabled: () => {},
  playSound: () => {},
});

export function useSensonicsSound() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = useCallback(
    (type: SoundType = 'click') => {
      if (!soundEnabled) return;
      try {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.05);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        } else if (type === 'hover') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.03);
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
          osc.start();
          osc.stop(ctx.currentTime + 0.03);
        } else if (type === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }
      } catch {
        // Audio context fallback — silently ignore
      }
    },
    [soundEnabled]
  );

  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}
