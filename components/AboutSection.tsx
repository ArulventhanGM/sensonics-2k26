export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="glass-panel rounded-[40px] p-8 sm:p-14 border border-white/90 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl">
          <span className="text-xs font-mono tracking-widest text-accent-cyan uppercase font-bold block mb-3">BUILT BY</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-primary-text tracking-tight mb-6">
            DEPARTMENT OF ELECTRONICS &amp; INSTRUMENTATION
          </h2>

          <p className="text-secondary-text text-sm sm:text-base leading-relaxed mb-8 font-normal">
            The Department of Electronics and Instrumentation engineering is at the forefront of modern technological innovation—bridging physical sensors, intelligent embedded systems, biomedical signal processing, and robotics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-pill p-4 rounded-2xl border border-slate-200">
              <i className="fa-solid fa-microchip text-accent-cyan text-lg mb-2 block"></i>
              <h4 className="text-xs font-bold text-primary-text mb-1">Embedded Labs</h4>
              <p className="text-[11px] text-secondary-text">ARM Cortex &amp; ESP32 sensor hardware suites.</p>
            </div>
            <div className="glass-pill p-4 rounded-2xl border border-slate-200">
              <i className="fa-solid fa-satellite-dish text-accent-violet text-lg mb-2 block"></i>
              <h4 className="text-xs font-bold text-primary-text mb-1">Signal &amp; MEMS</h4>
              <p className="text-[11px] text-secondary-text">Advanced signal analysis &amp; transducer design.</p>
            </div>
            <div className="glass-pill p-4 rounded-2xl border border-slate-200">
              <i className="fa-solid fa-robot text-accent-cyan text-lg mb-2 block"></i>
              <h4 className="text-xs font-bold text-primary-text mb-1">Robotics &amp; IoT</h4>
              <p className="text-[11px] text-secondary-text">Industrial automation &amp; autonomous systems.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
