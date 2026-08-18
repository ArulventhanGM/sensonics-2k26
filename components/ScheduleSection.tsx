const scheduleData = [
  { time: '08:30 AM', title: 'Registration & Welcome Kit', desc: 'Glass counter desk check-in, RFID badge allocation & welcome kit dispatch.' },
  { time: '09:30 AM', title: 'Grand Opening Ceremony', desc: 'Inaugural address by Department Head, Keynote by Chief Guest & Fest Unveiling.' },
  { time: '10:30 AM', title: 'Technical Track - Round 01', desc: 'Circuitrix 3.0 fault hunt, InnovateX Prototyping start, & Roboprix bot trials.' },
  { time: '01:00 PM', title: 'Networking & Gourmet Lunch Break', desc: 'Inter-college interaction, faculty lounge meet, & innovation gallery walkthrough.' },
  { time: '02:00 PM', title: 'Non-Technical Track & Esports', desc: 'Electro Hunt clue quest, Pitch Perfect elevator war, & BGMI Finals.' },
  { time: '05:00 PM', title: 'Valedictory & Prize Distribution', desc: 'Award ceremony, trophy handovers, cash prize certificates & closing address.' },
];

export default function ScheduleSection() {
  return (
    <section id="schedule" className="py-24 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-mono tracking-widest text-accent-cyan uppercase font-bold block mb-2">EVENT CHRONOLOGY</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-primary-text tracking-tight">
          FEST SCHEDULE
        </h2>
      </div>

      {/* Vertical Glass Timeline */}
      <div className="relative border-l border-slate-300 pl-6 sm:pl-10 ml-4 sm:ml-8 space-y-10">
        {scheduleData.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline Node Ring */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full glass-panel border border-accent-cyan flex items-center justify-center bg-white shadow-[0_10px_30px_rgba(13,148,136,0.2)]">
              <div className="w-2 h-2 rounded-full bg-accent-cyan group-hover:scale-125 transition-transform"></div>
            </div>

            {/* Glass Schedule Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/80">
              <span className="text-xs font-mono font-bold text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20 inline-block mb-3">
                {item.time}
              </span>
              <h3 className="text-lg font-bold text-primary-text mb-1">{item.title}</h3>
              <p className="text-xs text-secondary-text leading-relaxed font-normal">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
