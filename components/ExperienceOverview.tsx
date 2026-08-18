export default function ExperienceOverview() {
  return (
    <section id="experience" className="py-24 px-4 relative max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-accent-cyan font-bold uppercase block mb-2">THE EXPERIENCE</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
          Eight ways to challenge yourself.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technical Experience Card */}
        <div className="glass-card rounded-[32px] p-8 sm:p-10 relative overflow-hidden border border-accent-cyan/20 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl -z-10 group-hover:bg-accent-cyan/20 transition-all duration-500"></div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="px-3 py-1 rounded-full glass-pill text-[10px] font-mono tracking-widest text-accent-cyan uppercase font-bold border border-accent-cyan/30">
                DOMAIN 01
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-text mt-3">TECHNICAL</h3>
            </div>
            <span className="text-6xl font-black font-mono text-accent-cyan/60 tracking-tighter">04</span>
          </div>

          <p className="text-secondary-text text-sm sm:text-base leading-relaxed mb-8">
            Engineered for hardware architects, circuit bug hunters, autonomous robotics coders, and research innovators. Demonstrate physical implementation and high-speed precision.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 font-mono text-xs text-secondary-text font-medium">
            {['Hardware Debugging', 'Sensor Fusion Hack', 'Paper Presentation', 'Autonomous Robotics'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <i className="fa-solid fa-check text-accent-cyan"></i>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Technical Experience Card */}
        <div className="glass-card rounded-[32px] p-8 sm:p-10 relative overflow-hidden border border-accent-violet/20 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 rounded-full blur-3xl -z-10 group-hover:bg-accent-violet/20 transition-all duration-500"></div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="px-3 py-1 rounded-full glass-pill text-[10px] font-mono tracking-widest text-accent-violet uppercase font-bold border border-accent-violet/30">
                DOMAIN 02
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-primary-text mt-3">NON-TECHNICAL</h3>
            </div>
            <span className="text-6xl font-black font-mono text-accent-violet/60 tracking-tighter">04</span>
          </div>

          <p className="text-secondary-text text-sm sm:text-base leading-relaxed mb-8">
            Created for strategic thinkers, spatial UI designers, pitch masters, and tactical gamers. Challenge your adaptability, deduction speed, and competitive spirit.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 font-mono text-xs text-secondary-text font-medium">
            {['Cryptic Campus Quest', 'Glass UI/UX Design', 'Startup Elevator Pitch', 'BGMI Esports Battle'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <i className="fa-solid fa-check text-accent-violet"></i>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
