export interface SensonicsEvent {
  id: string;
  number: string;
  category: 'TECHNICAL' | 'NON-TECHNICAL';
  name: string;
  tagline: string;
  shortDesc: string;
  fullDesc: string;
  teamSize: string;
  duration: string;
  venue: string;
  eligibility: string;
  prizePool: string;
  rules: string[];
}

export const EVENTS_DATA: SensonicsEvent[] = [
  // ─── TECHNICAL EVENTS (4) ───
  {
    id: 'tech-01',
    number: '01',
    category: 'TECHNICAL',
    name: 'CIRCUITRIX 3.0',
    tagline: 'Precision Debugging & Fault Isolation',
    shortDesc: 'Diagnose breadboard anomalies, rectify analog/digital circuit flaws, and calibrate sensor signals under time pressure.',
    fullDesc: 'Circuitrix 3.0 tests your fundamental electronics diagnosis skills. Participants are provided with intentionally flawed hardware breadboard circuits and digital simulation schematics. Isolate faults using multimeters and oscilloscopes, re-engineer logic flow, and restore clean signal pathways.',
    teamSize: '2 Members',
    duration: '2.5 Hours',
    venue: 'Instrumentation & Signal Processing Lab',
    eligibility: 'Open to all Engineering & Tech Undergraduates',
    prizePool: '₹15,000',
    rules: [
      'Oscilloscopes, function generators, and multimeters will be provided on site.',
      'Round 1: Speed debugging paper/simulation quiz.',
      'Round 2: Hands-on fault location and real-time physical breadboard repair.',
      'No external microcontroller development boards are permitted in Round 1.',
      'Decisions of the faculty jury are final.',
    ],
  },
  {
    id: 'tech-02',
    number: '02',
    category: 'TECHNICAL',
    name: 'INNOVATEX HARDWARE HACK',
    tagline: 'Sensor Fusion & Embedded Systems Prototype',
    shortDesc: 'Fuse MEMS, optical, and pressure sensors with microcontrollers to solve real-world industrial automation challenges.',
    fullDesc: 'A high-intensity hardware prototyping challenge! Teams receive a mystery kit containing sensors (pressure, temperature, optical, ultrasonic) and ESP32 microcontrollers. Build a functional smart prototype addressing industrial safety, biomedical telemetry, or energy efficiency.',
    teamSize: '2 - 3 Members',
    duration: '4.0 Hours',
    venue: 'Embedded Systems Innovation Center',
    eligibility: 'All Engineering students',
    prizePool: '₹20,000',
    rules: [
      'Hardware mystery kits provided at the start of the challenge.',
      'Participants must bring their own laptops with Arduino IDE / PlatformIO installed.',
      'Final evaluation based on code efficiency, sensor integration, circuit neatness, and live demonstration.',
      'Internet access allowed for documentation research.',
    ],
  },
  {
    id: 'tech-03',
    number: '03',
    category: 'TECHNICAL',
    name: 'PAPERX PRECISION',
    tagline: 'Research & Innovation Symposium',
    shortDesc: 'Present groundbreaking research in AI in Instrumentation, Smart MEMS, Quantum Sensing, and Biomedical Systems.',
    fullDesc: 'PaperX Precision provides an elite stage for student researchers to present original research papers and novel technical concepts before a panel of industry leaders and senior IEEE academicians.',
    teamSize: '1 - 3 Members',
    duration: '3.0 Hours',
    venue: 'Glass Gallery Seminar Hall Alpha',
    eligibility: 'UG / PG Tech Students',
    prizePool: '₹12,000',
    rules: [
      'Abstracts must be submitted prior to the event during registration.',
      'Presentation duration: 8 minutes presentation + 4 minutes Q&A.',
      'Standard IEEE double-column format recommended for paper slides.',
      'Judged on innovation, clarity of methodology, and responses during Q&A.',
    ],
  },
  {
    id: 'tech-04',
    number: '04',
    category: 'TECHNICAL',
    name: 'ROBOPRIX METAVERSE',
    tagline: 'Autonomous Grid & Obstacle Navigation',
    shortDesc: 'Deploy autonomous bots through dynamic optical lines, dark corridors, and ultrasonic obstacle mazes.',
    fullDesc: 'Construct or program an autonomous bot capable of traversing precision optical line paths, elevated bridges, and dynamic obstacle arenas with millisecond accuracy and zero human intervention.',
    teamSize: '2 - 4 Members',
    duration: '3.0 Hours',
    venue: 'Robotics Arena - Central Quad',
    eligibility: 'Open to all enrolled students',
    prizePool: '₹18,000',
    rules: [
      'Maximum bot dimensions: 25cm x 25cm x 25cm. Max weight: 3kg.',
      'Maximum power supply: 12V DC.',
      'Bot must operate completely autonomously during the arena run.',
      'Penalties applied for touching maze walls or track deviation.',
    ],
  },

  // ─── NON-TECHNICAL EVENTS (4) ───
  {
    id: 'nontech-01',
    number: '05',
    category: 'NON-TECHNICAL',
    name: 'ELECTRO HUNT',
    tagline: 'Cryptic Frequency & Campus Quest',
    shortDesc: 'Decode encrypted light signals, frequency ciphers, and QR matrix checkpoints hidden across the campus.',
    fullDesc: 'An exhilarating campus-wide physical and mental treasure hunt. Solve frequency ciphers, decode optical pulse signals, and follow logic riddles to locate concealed hardware keys across campus grounds.',
    teamSize: '2 - 3 Members',
    duration: '2.0 Hours',
    venue: 'Campus Grounds (Starts at Main Dome)',
    eligibility: 'Open to all participants',
    prizePool: '₹10,000',
    rules: [
      'Smartphones allowed for QR scanning and clue decryption.',
      'Splitting up or receiving external assistance results in disqualification.',
      'Time-based event: First team to solve all 7 checkpoints wins.',
      'Respect campus property at all times.',
    ],
  },
  {
    id: 'nontech-02',
    number: '06',
    category: 'NON-TECHNICAL',
    name: 'PIXELCRAFT UI/UX',
    tagline: 'Spatial Glass Interface Design',
    shortDesc: 'Craft futuristic glassmorphic user interfaces and HUDs for smart autonomous vehicles or medical devices.',
    fullDesc: 'Unleash your visual design prowess! Create liquid glass, glassmorphic UI dashboards for futuristic smart environments, biomedical telemetry systems, or spatial devices.',
    teamSize: '1 - 2 Members',
    duration: '2.5 Hours',
    venue: 'Digital Media Lab',
    eligibility: 'Design enthusiasts and coders',
    prizePool: '₹10,000',
    rules: [
      'Designs can be executed in Figma, Adobe XD, or interactive HTML/CSS.',
      'Design prompt and visual constraints revealed at start time.',
      'Judged on typography, visual hierarchy, glass depth, and usability.',
    ],
  },
  {
    id: 'nontech-03',
    number: '07',
    category: 'NON-TECHNICAL',
    name: 'PITCH PERFECT',
    tagline: 'Tech Startup Pitch & Elevator War',
    shortDesc: 'Formulate business models around futuristic gadgets and convince venture capitalists to fund your venture.',
    fullDesc: 'Step into the futuristic Shark Tank! Formulate a rapid go-to-market strategy for an emerging futuristic instrumentation technology and pitch it under high-pressure surprise market constraints.',
    teamSize: '1 - 3 Members',
    duration: '2.0 Hours',
    venue: 'Audium Glass Lounge',
    eligibility: 'Open to all aspiring entrepreneurs',
    prizePool: '₹12,000',
    rules: [
      '3-minute elevator pitch + 2-minute visual slide presentation.',
      'Judges will throw a "Surprise Market Crisis" card halfway through your pitch!',
      'Evaluation based on viability, presentation charisma, and financial logic.',
    ],
  },
  {
    id: 'nontech-04',
    number: '08',
    category: 'NON-TECHNICAL',
    name: 'BGMI SHOWDOWN',
    tagline: 'Esports Tactical Arena Tournament',
    shortDesc: 'Clutch under high-pressure custom room matches and take home the Sensonics Esports Trophy.',
    fullDesc: 'The ultimate tactical gaming arena! Battle squad against squad in custom room matches on classic battlegrounds. Coordinate strategy, clutch intense shootouts, and conquer the leaderboard.',
    teamSize: '4 Members (Squad)',
    duration: '3.5 Hours',
    venue: 'Esports Glass Lounge',
    eligibility: 'Open to all registered gamers',
    prizePool: '₹15,000',
    rules: [
      'Squad format (4 players per team). Mobile devices only.',
      'Emulators, triggers, or third-party hacks lead to immediate permanent ban.',
      'Point system based on placement points + elimination points.',
      'Stable campus Wi-Fi provided on site.',
    ],
  },
];
