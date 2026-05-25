import React from 'react';
import { motion } from 'motion/react';
import PremiumLogo from './PremiumLogo';
import { 
  Compass, 
  Activity, 
  MessageSquare, 
  ArrowRight, 
  Terminal, 
  Sliders, 
  Cpu, 
  Radio, 
  Network, 
  Layers, 
  Wrench, 
  Workflow, 
  Zap, 
  Sparkles,
  GitBranch,
  Settings,
  BookOpen
} from 'lucide-react';

export default function HomePage({ onEnter }: { onEnter: (startingTab?: "explorer" | "guides" | "chat") => void }) {
  const [hoveredModule, setHoveredModule] = React.useState<string | null>(null);

  // Navigation Module Cards details
  const modules = [
    {
      id: "01",
      title: "COMPONENT DIAGNOSTICS",
      tag: "DIAGNOSTICS & SPECS",
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      desc: "Anatomize digital microcontrollers, motor drivers, actuators & sensors. Hover or click custom hardware landmarks to read dynamic real-time electrical telemetry.",
      actionKey: "TAP LANDMARKS",
      badge: "IO ACTIVE",
      waveColor: "bg-sky-450/15 text-sky-400 border border-sky-400/20",
    },
    {
      id: "02",
      title: "LOGIC & SYSTEM GUIDES",
      tag: "ROBOTICS SYSTEM BUILDER",
      icon: <BookOpen className="w-5 h-5 text-amber-500" />,
      desc: "Master combining input sensors, microcontrollers & output actuators. Learn algorithmic flowchart modeling and design loops with standard program shapes like decisions.",
      actionKey: "EXPLORE LOGIC",
      badge: "STEM LEARNING",
      waveColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    {
      id: "03",
      title: "COGNITIVE AI TUTOR",
      tag: "INTELLIGENT AGENT",
      icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
      desc: "Interact with an advanced robotics engineering model. Query math, diagnostic codes, logic trees, and seek automated debugging feedback on hardware design failures.",
      actionKey: "NATURAL LOGIC",
      badge: "AI ONLINE",
      waveColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    }
  ];

  // How It Works Steps
  const steps = [
    {
      num: "01",
      title: "Select Hardware Elements",
      subtitle: "COMPONENT REGISTRY",
      desc: "Load microcontrollers (Arduino/ESP32) or sensor platforms directly into active RAM, verifying specifications, baseline voltage tolerances, and microsecond latencies."
    },
    {
      num: "02",
      title: "Capture Physical Signals",
      subtitle: "WAVEFORM TRANSLATION",
      desc: "Analyse real-time oscilloscope waveforms. Trace pulse-width modulations (PWM), discrete high/low digital squares, state timers, or absolute I2C binary trains."
    },
    {
      num: "03",
      title: "Deploy Active Diagnostics",
      subtitle: "DEBUGGING HARNESS",
      desc: "Query the cognitive AI system to inspect electrical wiring faults, isolate current overloads (>40mA pin ceilings), or test simulated hardware control code."
    }
  ];

  // Upcoming Features
  const previewFeatures = [
    {
      title: "Logic Flow Chart Generator",
      tag: "FLOW ENGINE",
      icon: <Workflow className="w-5 h-5 text-indigo-400" />,
      desc: "Graphically sequence robotic instructions. Convert complex loops, conditional branches, and sensory interrupts into clean Visual Nodes linked seamlessly to execution cycles."
    },
    {
      title: "Dynamic Wire Schematics Layouts",
      tag: "SCHEMATIC DESIGNER",
      icon: <Layers className="w-5 h-5 text-pink-400" />,
      desc: "Render detailed electrical breadboard schematics. Detect pins connection mismatches, generate automated pinout diagrams, and route physical hardware signals safely without short-circuits."
    }
  ];

  // Dynamic board specifications determined by hover state
  const getBoardSpec = () => {
    if (hoveredModule === "01") {
      return {
        telemetry: "SENSOR INTEGRITY: I2C_MPU6050 [0x68] // UNO_A4_A5",
        detail: "Dynamic accelerometer / gyro stream feeding Arduino Analog pins A4 [SDA] & A5 [SCL].",
        efficiency: "98.2% SNR",
        highlightLeft: true,
        highlightCenter: false,
        highlightRight: false,
        pulseSpeed: 1.5,
        subColor: "text-indigo-400",
        activePath: "M 0,30 Q 25,12 50,30 T 100,30 T 150,30 T 200,30",
        activeWave: "sine"
      };
    }
    if (hoveredModule === "02") {
      return {
        telemetry: "ACTUATOR COMMAND: PWM_GEN_D9_D10 // 490Hz_ACTIVE",
        detail: "Synthesizing modulated analog pulses directly to L298N high-current H-bridge rails.",
        efficiency: "94.5% EFF",
        highlightLeft: false,
        highlightCenter: false,
        highlightRight: true,
        pulseSpeed: 1.2,
        subColor: "text-amber-400",
        activePath: "M 0,45 L 20,45 L 20,15 L 60,15 L 60,45 L 100,45 L 100,15 L 140,15 L 140,45 L 200,45",
        activeWave: "pwm"
      };
    }
    if (hoveredModule === "03") {
      return {
        telemetry: "COGNITIVE DIALOGUE BUS: UNO_UART_RXD // 115200bps",
        detail: "Direct instruction transmission between ATmega328P core and cognitive tutor matrix.",
        efficiency: "99.9% CRC",
        highlightLeft: false,
        highlightCenter: true,
        highlightRight: false,
        pulseSpeed: 0.8,
        subColor: "text-emerald-400",
        activePath: "M 0,45 L 10,45 L 10,15 L 15,15 L 15,45 L 35,45 L 35,15 L 40,15 L 40,45 L 75,45 L 75,15 L 80,15 L 80,45 L 115,45 L 115,15 L 120,15 L 120,45 L 155,45 L 155,15 L 160,15 L 160,45 L 200,45",
        activeWave: "serial"
      };
    }
    return {
      telemetry: "MCU STATE REFERENCE: ARDUINO_UNO_R3 // READY",
      detail: "Steady voltage grid running operational system standby routines.",
      efficiency: "99.5% EFF",
      highlightLeft: false,
      highlightCenter: false,
      highlightRight: false,
      pulseSpeed: 4.5,
      subColor: "text-sky-400",
      activePath: "M 0,30 Q 25,20 50,30 T 100,30 T 150,30 T 200,30",
      activeWave: "sine"
    };
  };

  const boardSpec = getBoardSpec();

  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-slate-100 flex flex-col justify-between overflow-x-hidden p-4 md:p-8 select-none font-sans">
      
      {/* Electronic Circuit Grid Overlay */}
      <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
      
      {/* Futuristic Radial Signal Wave Scan line */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-950/25 via-[#020617] to-transparent pointer-events-none" />
      
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent pointer-events-none" />
      
      {/* Top Header Row with status indicators */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-b border-sky-950/60 pb-4 mb-4 text-[11px] font-mono text-slate-500 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400 tracking-wider font-extrabold">ROBOTICS LOGIC DECK // CORE MAINBOARD</span>
        </div>
        <div className="flex items-center gap-5 text-[10px] hidden sm:flex">
          <span>LATENCY: <strong className="text-sky-400 font-mono">1.2ms</strong></span>
          <span>SYSTEM CLOCK: <strong className="text-emerald-400 font-mono">25.0 MHz</strong></span>
          <span>IO STATUS: <strong className="text-slate-350 font-mono">STANDBY_CONNECTED</strong></span>
        </div>
      </header>

      {/* SECTION 1: HERO VIEW + CENTERED ARDUINO BOARD SCHEMATIC ANIMATION */}
      <section className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-10 lg:py-16 text-center">
        
        {/* Animated Main Title Box */}
        <div className="space-y-5 max-w-3xl mx-auto flex flex-col items-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-sky-950/45 border border-sky-500/20">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="font-mono text-[9px] text-sky-400 font-extrabold tracking-widest uppercase">PHYSICAL SIGNAL SIMULATION DECK</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <PremiumLogo className="w-16 h-16 md:w-20 md:h-20" glow={true} />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 leading-none uppercase select-none text-center">
              ROBOTICS LEARNING HUB
            </h1>
          </div>
          
          <p className="text-sm md:text-base text-slate-400 leading-relaxed font-sans max-w-2xl mx-auto font-medium">
            Your comprehensive interactive guide and playground for mastering modern robotics systems. Learn to map microcontroller pins, trace hardware signal pathways, test actuator drivers, and jumpstart your engineering journey.
          </p>
        </div>

        {/* Dynamic Connected Circuit/Schematics Showcase Panel (Centered, Non-tilted, Floating) */}
        <div className="w-full flex justify-center items-center relative py-6 max-w-4xl mx-auto">
          
          {/* Subtle Ambient glow circles */}
          <div className="absolute w-[360px] h-[360px] bg-sky-500/10 rounded-full blur-[90px] -z-10 animate-pulse pointer-events-none" />
          <div className="absolute w-[240px] h-[240px] bg-indigo-500/5 rounded-full blur-[70px] -z-10 pointer-events-none" />

          {/* Centered Board Wrapper (No perspective tilt, smooth floating translate oscillation) */}
          <div className="w-full max-w-[640px] h-auto relative px-2 md:px-4 flex flex-col items-center justify-center animate-fadeIn">
            <motion.div
              animate={{
                y: [-6, 6, -6]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full bg-[#03091c]/95 border border-sky-500/30 hover:border-sky-400/50 rounded-2xl p-5 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.85)] backdrop-blur-md relative flex flex-col justify-between transition-all overflow-hidden group"
            >
              {/* Tech Spec lines overlay on the board */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a/30_1px,transparent_1px)] bg-[size:16px_16px] opacity-75" />
              <div className="absolute top-0 right-0 w-[55%] h-[1px] bg-gradient-to-l from-sky-400/40 to-transparent" />
              <div className="absolute bottom-0 left-0 w-[55%] h-[1px] bg-gradient-to-r from-emerald-400/40 to-transparent" />

              {/* Board Header Spec Bar */}
              <div className="flex items-start justify-between relative z-10 border-b border-sky-950/80 pb-2 mb-3">
                <div className="space-y-0.5 text-left">
                  <span className="font-mono text-[8px] text-sky-400 font-extrabold tracking-widest block uppercase">SIMULATED ELECTRICAL SCHEMA</span>
                  <h4 className="font-sans font-extrabold text-[12px] text-white tracking-tight uppercase flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} /> ARDUINO_UNO_R3_DECK
                  </h4>
                </div>
                <div className="text-right font-mono text-[8px] text-slate-500">
                  <div className="text-emerald-400 font-bold animate-pulse">● SIGNAL_FLOW_ACTIVE</div>
                  <div>DEVICE_PORT: COM4</div>
                </div>
              </div>

              {/* EPIC ARDUINO INTEGRATIVE CONNECTIVITY CIRCUIT */}
              <div className="relative flex-1 my-3 flex items-center justify-center">
                <svg viewBox="0 0 540 220" className="w-full h-auto select-none">
                  {/* Glowing Signal traces on bottom/top */}
                  
                  {/* Trace lines from SENSOR to ARDUINO Analog Pins */}
                  <path
                    d="M 85,110 L 160,110 L 160,165 L 245,160"
                    fill="none"
                    stroke={boardSpec.highlightLeft ? "#818cf8" : "rgba(129, 140, 248, 0.2)"}
                    strokeWidth={boardSpec.highlightLeft ? "3.5" : "1.5"}
                    className="transition-all duration-300"
                  />
                  
                  {/* Trace lines from ARDUINO Digital Pins to ACTUATOR */}
                  <path
                    d="M 330,60 L 370,60 L 370,110 L 455,110"
                    fill="none"
                    stroke={boardSpec.highlightRight ? "#fbbf24" : "rgba(245, 158, 11, 0.2)"}
                    strokeWidth={boardSpec.highlightRight ? "3.5" : "1.5"}
                    className="transition-all duration-300"
                  />

                  {/* Pulsing Signal Electrons */}
                  <motion.circle
                    r="4.5"
                    fill="#818cf8"
                    animate={{
                      pathLength: [0, 1]
                    }}
                    className="transition-all"
                    strokeDasharray="1, 1"
                  >
                    <animateMotion
                      path="M 85,110 L 160,110 L 160,165 L 245,160"
                      dur={`${boardSpec.pulseSpeed}s`}
                      repeatCount="indefinite"
                    />
                  </motion.circle>

                  <motion.circle
                    r="4.5"
                    fill="#fbbf24"
                    animate={{
                      pathLength: [0, 1]
                    }}
                    className="transition-all"
                  >
                    <animateMotion
                      path="M 330,60 L 370,60 L 370,110 L 455,110"
                      dur={`${boardSpec.pulseSpeed * 0.9}s`}
                      repeatCount="indefinite"
                    />
                  </motion.circle>

                  {/* ======================================= */}
                  {/* COMPONENT 1: SENSOR MODULE (Left side)   */}
                  {/* ======================================= */}
                  <g className="transition-all duration-350 cursor-help" style={{ opacity: boardSpec.highlightLeft ? 1 : 0.65 }}>
                    {/* Module container plate */}
                    <rect x="15" y="65" width="70" height="90" rx="4" fill="#010614" stroke={boardSpec.highlightLeft ? "#818cf8" : "rgba(100,116,139,0.4)"} strokeWidth="2" />
                    {boardSpec.highlightLeft && (
                      <rect x="12" y="62" width="76" height="96" rx="6" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="3,3" className="animate-pulse" />
                    )}

                    {/* Sensor Ports */}
                    <rect x="80" y="80" width="6" height="5" fill="#f8fafc" />
                    <rect x="80" y="95" width="6" height="5" fill="#f8fafc" />
                    <rect x="80" y="110" width="6" height="5" fill="#f8fafc" />
                    <rect x="80" y="125" width="6" height="5" fill="#f8fafc" />

                    <text x="50" y="85" fill="#ffffff" textAnchor="middle" fontSize="7" fontWeight="bold" fontFamily="monospace">GYRO_ACC</text>
                    <text x="50" y="97" fill="#818cf8" textAnchor="middle" fontSize="8" fontWeight="black" fontFamily="sans-serif">MPU6050</text>
                    <text x="50" y="112" fill="#475569" textAnchor="middle" fontSize="5.5" fontFamily="monospace">ADDR: 0x68</text>
                    <text x="50" y="122" fill="#475569" textAnchor="middle" fontSize="5.5" fontFamily="monospace">SDA/SCL</text>
                    
                    {/* Miniature circuit visual */}
                    <circle cx="35" cy="138" r="4.5" fill="none" stroke="#475569" strokeWidth="1" />
                    <circle cx="65" cy="138" r="4.5" fill="none" stroke="#475569" strokeWidth="1" />
                  </g>

                  {/* ======================================= */}
                  {/* COMPONENT 2: ARDUINO UNO R3 MCU BOARD   */}
                  {/* ======================================= */}
                  <g className="transition-all duration-350 cursor-pointer" style={{ opacity: boardSpec.highlightCenter ? 1 : 0.85 }}>
                    
                    {/* The Blue Arduino Form Factor Body */}
                    <rect x="175" y="30" width="168" height="155" rx="10" fill="#0c2240" stroke={boardSpec.highlightCenter ? "#10b981" : "#1e40af"} strokeWidth="2.5" className="shadow-2xl" />
                    
                    {/* Distinctive Screen Print line-art on Arduino PCB */}
                    <path d="M 235,35 Q 260,35 260,55" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                    <path d="M 180,105 L 340,110" fill="none" stroke="rgba(255,180,0,0.06)" strokeWidth="1.5" />
                    <circle cx="290" cy="140" r="15" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                    {/* Labeled pins headings */}
                    <text x="260" y="44" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="monospace" fontWeight="bold">◀ DIGITAL PINOUT HEADER ◀</text>
                    <text x="260" y="174" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="monospace" fontWeight="bold">◀ PWR & ANALOG IN ◀</text>

                    {/* TOP Digital Female Header Bar (Pins D0-D13) */}
                    <rect x="187" y="46" width="144" height="10" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                    {/* Metal sockets in Header */}
                    {Array.from({ length: 14 }).map((_, pi) => (
                      <g key={pi}>
                        <rect x={191 + pi * 10} y="49" width="5.5" height="4" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
                        <text x={194 + pi * 10} y="43" fill="#64748b" fontSize="4.5" textAnchor="middle" fontFamily="monospace">{pi}</text>
                      </g>
                    ))}

                    {/* BOTTOM Power & Analog Input Female Header Bar */}
                    <rect x="187" y="152" width="144" height="10" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                    {/* Power Sockets pin text labels helper */}
                    {["5V", "3.3V", "GND", "GND", "A0", "A1", "A2", "A3", "A4", "A5", "SDA", "SCL"].map((label, li) => (
                      <g key={li}>
                        <rect x={191 + li * 11.5} y="155" width="5.5" height="4" fill="#0f172a" stroke="#64748b" strokeWidth="0.5" />
                        <text x={194 + li * 11.5} y="167" fill="#64748b" fontSize="4" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{label}</text>
                      </g>
                    ))}

                    {/* ATMEGA328P Longitudinal DIP Integrated Circuit */}
                    <g style={{ transform: "translate(0px, 0px)" }}>
                      {/* Black casing */}
                      <rect x="235" y="80" width="85" height="24" rx="2" fill="#111827" stroke="#4b5563" strokeWidth="1.5" />
                      {/* ATmega label */}
                      <text x="277.5" y="93" fill="#f3f4f6" textAnchor="middle" fontSize="6.5" fontWeight="bold" fontFamily="monospace">ATMEGA328P-PU</text>
                      <text x="277.5" y="100" fill="#9ca3af" textAnchor="middle" fontSize="4.5" fontFamily="monospace">UNO_CORE_MCU</text>
                      
                      {/* Dual-inline Silver pins legs (top and bottom pin sets) */}
                      {Array.from({ length: 12 }).map((_, lIdx) => (
                        <g key={lIdx}>
                          {/* Top row pins */}
                          <line x1={240 + lIdx * 7} y1="79" x2={240 + lIdx * 7} y2="76" stroke="#9ca3af" strokeWidth="1.5" />
                          {/* Bottom row pins */}
                          <line x1={240 + lIdx * 7} y1="105" x2={240 + lIdx * 7} y2="108" stroke="#9ca3af" strokeWidth="1.5" />
                        </g>
                      ))}
                    </g>

                    {/* USB Port (Hardware interface) */}
                    <rect x="171" y="60" width="22" height="30" rx="3" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1.5" />
                    <rect x="165" y="66" width="6" height="18" fill="#e2e8f0" />
                    <text x="182" y="77" fill="#334155" fontSize="5" fontWeight="black" fontFamily="monospace" transform="rotate(90, 182, 77)">USB_UNO</text>

                    {/* DC Barrel Jack input port */}
                    <rect x="170" y="112" width="28" height="20" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                    <circle cx="170" cy="122" r="6" fill="#1e293b" />
                    <circle cx="170" cy="122" r="3.5" fill="#f59e0b" />

                    {/* High-Contrast Silkscreen Logo */}
                    <text x="250" y="125" fill="rgba(255,255,255,0.09)" fontSize="9" fontWeight="black" fontFamily="monospace">ARDUINO</text>
                    <text x="250" y="132" fill="rgba(255,255,255,0.06)" fontSize="5.5" fontWeight="black" fontFamily="monospace">UNO DEV PROTO</text>

                    {/* LED Lights (Status RX, TX, L) */}
                    {/* RX LED */}
                    <circle cx="218" cy="68" r="2.5" fill="#15803d" stroke="#22c55e" strokeWidth="0.5" />
                    <text x="218" y="75" fill="#86efac" fontSize="4.5" textAnchor="middle" fontFamily="monospace">RX</text>
                    
                    {/* TX LED */}
                    <circle cx="228" cy="68" r="2.5" fill="#15803d" stroke="#22c55e" strokeWidth="0.5" />
                    <text x="228" y="75" fill="#86efac" fontSize="4.5" textAnchor="middle" fontFamily="monospace">TX</text>

                    {/* pin 13 L LED */}
                    <circle cx="220" cy="98" r="2.5" fill={boardSpec.highlightCenter ? "#10b981" : "#047857"} stroke={boardSpec.highlightCenter ? "#34d399" : "#059669"} strokeWidth="1" className={boardSpec.highlightCenter ? "animate-pulse" : ""} />
                    <text x="210" y="100" fill="#a7f3d0" fontSize="5" fontWeight="bold" fontFamily="monospace">L13</text>
                  </g>

                  {/* ======================================= */}
                  {/* COMPONENT 3: MOTOR DRIVER (Right side)  */}
                  {/* ======================================= */}
                  <g className="transition-all duration-350 cursor-help" style={{ opacity: boardSpec.highlightRight ? 1 : 0.65 }}>
                    {/* L298N Module Carrier plate */}
                    <rect x="455" y="65" width="70" height="90" rx="4" fill="#010614" stroke={boardSpec.highlightRight ? "#fbbf24" : "rgba(148,163,184,0.4)"} strokeWidth="2" />
                    {boardSpec.highlightRight && (
                      <rect x="452" y="62" width="76" height="96" rx="6" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" className="animate-pulse" />
                    )}

                    {/* Input ports */}
                    <rect x="450" y="80" width="6" height="5" fill="#3b82f6" />
                    <rect x="450" y="95" width="6" height="5" fill="#3b82f6" />
                    <rect x="450" y="110" width="6" height="5" fill="#10b981" />
                    <rect x="450" y="125" width="6" height="5" fill="#10b981" />

                    <text x="490" y="82" fill="#ffffff" textAnchor="middle" fontSize="7.5" fontWeight="bold" fontFamily="monospace">L298N</text>
                    <text x="490" y="95" fill="#fbbf24" textAnchor="middle" fontSize="7" fontWeight="black" fontFamily="sans-serif">H-BRIDGE</text>
                    
                    {/* Metal heatsink element */}
                    <rect x="475" y="108" width="30" height="20" rx="1" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
                    <line x1="481" y1="108" x2="481" y2="128" stroke="#1e293b" />
                    <line x1="487" y1="108" x2="487" y2="128" stroke="#1e293b" />
                    <line x1="493" y1="108" x2="493" y2="128" stroke="#1e293b" />
                    <line x1="499" y1="108" x2="499" y2="128" stroke="#1e293b" />

                    <text x="490" y="142" fill="#64748b" textAnchor="middle" fontSize="6" fontFamily="monospace">OUT1 / OUT2</text>
                  </g>
                </svg>
              </div>

              {/* Bottom Telemetry diagnostics strip - DYNAMICALLY UPDATING AT RUNTIME */}
              <div className="flex justify-between items-center bg-[#010614] border border-slate-900 rounded-lg p-3 relative z-10 transition-colors duration-300">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span className="font-mono text-[8px] text-slate-500 uppercase shrink-0">DIAG_STREAM //</span>
                  <span className="font-mono text-[8px] text-slate-200 font-bold truncate">
                    {boardSpec.telemetry}
                  </span>
                </div>
                <div className={`font-mono text-[8.5px] ${boardSpec.subColor} font-bold bg-[#020d20] px-2 py-0.5 rounded border border-slate-800 transition-colors shrink-0 font-extrabold`}>
                  {boardSpec.efficiency}
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Start Button Container right below the Interactive Schematic */}
        <div className="mt-4">
          {/* Main Action trigger button */}
          <button
            onClick={() => onEnter("explorer")}
            className="group relative px-12 py-5 bg-sky-600 hover:bg-sky-550 text-slate-950 font-bold text-xs font-mono tracking-widest rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(14,165,233,0.35)] hover:shadow-[0_0_40px_rgba(14,165,233,0.55)] active:scale-98 duration-200 uppercase cursor-pointer"
          >
            <span className="flex items-center gap-2">
              INITIATE SYSTEM LINK
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
            </span>
            {/* Outer high-tech terminal corners styling */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-sky-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-sky-400" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-sky-400" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-sky-450" />
          </button>
        </div>
      </section>

      {/* SECTION BORDER DIVIDER: HERO TO MANUAL */}
      <div className="relative w-full max-w-7xl mx-auto my-8 flex items-center justify-between pointer-events-none select-none">
        <div className="h-[1px] bg-slate-900 flex-1 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sky-500/30 rounded-full" />
        </div>
        <div className="font-mono text-[8.5px] text-slate-500 tracking-widest px-4 uppercase whitespace-nowrap bg-[#020617] py-1.5 rounded border border-slate-900/60 font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500/50 animate-pulse" />
          SYSTEM_DECK_FRAMEWORKS // INSTANT_FLOW_INTERFACES
        </div>
        <div className="h-[1px] bg-slate-900 flex-1 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sky-500/30 rounded-full" />
        </div>
      </div>

      {/* SECTION 2: HOW IT WORKS GUIDE */}
      <section className="relative z-10 w-full max-w-7xl mx-auto py-8">
        <div className="mb-6 text-center lg:text-left">
          <span className="font-mono text-[9px] text-sky-400 font-extrabold tracking-widest block uppercase mb-1">SYSTEM CYCLE PROCESS</span>
          <h2 className="font-sans font-extrabold text-lg md:text-xl text-slate-100 uppercase tracking-tight">HOW IT WORKS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st, idx) => (
            <div 
              key={st.num} 
              className="bg-[#030a1c]/40 border border-slate-900 rounded-xl p-5 hover:border-slate-800 transition-colors flex flex-col justify-between relative group/step overflow-hidden"
            >
              {/* Corner accent glow indicator */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-sky-500/5 blur-[15px] pointer-events-none group-hover/step:bg-sky-500/10 transition-colors" />
              <div>
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-3">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    {st.subtitle}
                  </span>
                  <span className="font-mono text-xs text-sky-450/70 font-extrabold bg-sky-950/40 border border-sky-950 px-2 py-0.5 rounded">
                    STAGE {st.num}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-sm text-slate-200 uppercase tracking-tight mb-2 group-hover/step:text-sky-300 transition-colors">
                  {st.title}
                </h3>
                <p className="font-sans text-[11.5px] text-slate-400 leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION BORDER DIVIDER: MANUAL TO UTILITIES */}
      <div className="relative w-full max-w-7xl mx-auto my-8 flex items-center justify-between pointer-events-none select-none">
        <div className="h-[1px] bg-slate-900 flex-1 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500/30 rounded-full" />
        </div>
        <div className="font-mono text-[8.5px] text-slate-500 tracking-widest px-4 uppercase whitespace-nowrap bg-[#020617] py-1.5 rounded border border-slate-900/60 font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-pulse" />
          SYSTEM_DECK_FRAMEWORKS // ACTIVE_STATION_UTILITIES
        </div>
        <div className="h-[1px] bg-slate-900 flex-1 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500/30 rounded-full" />
        </div>
      </div>

      {/* SECTION 3: SERVICES OFFERED & TOOLS DIAGRAMS */}
      <section className="relative z-10 w-full max-w-7xl mx-auto py-8">
        <div className="mb-4 text-center lg:text-left">
          <span className="font-mono text-[9px] text-amber-500 font-extrabold tracking-widest block uppercase mb-1">COMPREHENSIVE UTILITIES</span>
          <h2 className="font-sans font-extrabold text-lg md:text-xl text-slate-100 uppercase tracking-tight">SERVICES & INTEGRATIVE TOOLS</h2>
        </div>

        {/* Catalog features grid wrapper with reactive mouse listeners triggers */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 pt-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              onMouseEnter={() => setHoveredModule(mod.id)}
              onMouseLeave={() => setHoveredModule(null)}
              onClick={() => {
                const map: { [key: string]: "explorer" | "guides" | "chat" } = {
                  "01": "explorer",
                  "02": "guides",
                  "03": "chat"
                };
                onEnter(map[mod.id]);
              }}
              className="group relative bg-[#040d21]/60 border border-slate-900 hover:border-sky-500/30 rounded-xl p-5 backdrop-blur-md hover:bg-[#06112c]/85 transition-all duration-350 flex flex-col justify-between min-h-[210px] cursor-pointer hover:shadow-[0_4px_20px_rgba(14,165,233,0.04)] active:scale-[0.99] duration-150"
            >
              <div className="absolute top-2.5 right-3.5 font-mono text-[8px] text-slate-600 font-semibold uppercase group-hover:text-indigo-400/50">
                HOVER TO SIMULATE TRACE_P{mod.id}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 group-hover:border-sky-500/30 group-hover:bg-[#020617] transition-all">
                    {mod.icon}
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-slate-500 uppercase block tracking-wider leading-none">{mod.tag}</span>
                    <h3 className="font-sans font-bold text-xs text-white uppercase tracking-tight group-hover:text-sky-300 transition-colors mt-0.5">{mod.title}</h3>
                  </div>
                </div>

                <p className="font-sans text-[11.5px] text-slate-400 leading-relaxed font-normal">
                  {mod.desc}
                </p>
              </div>

              {/* Status footer bar */}
              <div className="mt-4 pt-3.5 border-t border-slate-950 flex items-center justify-between text-[8px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded ${mod.waveColor} font-bold tracking-wider`}>
                    {mod.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1 select-none">
                  <span className="text-slate-600">PATH_KEY:</span>
                  <span className="text-slate-400 font-extrabold group-hover:text-sky-400 transition-colors font-mono">{mod.actionKey}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION BORDER DIVIDER: UTILITIES TO FUTURE BLUEPRINTS */}
      <div className="relative w-full max-w-7xl mx-auto my-8 flex items-center justify-between pointer-events-none select-none">
        <div className="h-[1px] bg-slate-900 flex-1 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500/30 rounded-full" />
        </div>
        <div className="font-mono text-[8.5px] text-slate-500 tracking-widest px-4 uppercase whitespace-nowrap bg-[#020617] py-1.5 rounded border border-slate-900/60 font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
          SYSTEM_DECK_FRAMEWORKS // DEVELOPMENTAL_SCHEMATICS_V4
        </div>
        <div className="h-[1px] bg-slate-900 flex-1 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500/30 rounded-full" />
        </div>
      </div>

      {/* SECTION 4: INTEGRATION BLUEPRINTS PREVIEW (Upcoming development layout requested by user) */}
      <section className="relative z-10 w-full max-w-7xl mx-auto py-8">
        <div className="mb-4 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-2">
          <div>
            <span className="font-mono text-[9px] text-emerald-400 font-extrabold tracking-widest block uppercase mb-1">PROSPECTIVE UPCOMING MODULES</span>
            <h2 className="font-sans font-extrabold text-lg md:text-xl text-slate-100 uppercase tracking-tight flex items-center justify-center lg:justify-start gap-2">
              <Network className="w-4 h-4 text-emerald-400" /> INTEGRATION BLUEPRINTS
            </h2>
          </div>
          <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 rounded-md font-extrabold uppercase animate-pulse inline-block mx-auto lg:mx-0">
            ENGINEERING ROADMAP V4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {previewFeatures.map((feat) => (
            <div 
              key={feat.title}
              className="bg-[#040c1d]/90 border border-slate-900 rounded-xl p-5 relative overflow-hidden group/feat"
            >
              {/* Solder joints line art overlay */}
              <div className="absolute top-0 right-0 w-[80px] h-[80px] border-r-2 border-t-2 border-slate-800/40 rounded-tr-xl pointer-events-none group-hover/feat:border-indigo-500/20 transition-colors" />

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg group-hover/feat:border-indigo-500/30 transition-all text-slate-400 shrink-0">
                  {feat.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] bg-slate-950 border border-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-extrabold tracking-wider uppercase">
                      {feat.tag}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-indigo-400/80 animate-pulse uppercase">
                      [ DEVELOPMENT PHASE ]
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-[13px] text-slate-200 uppercase tracking-tight group-hover/feat:text-indigo-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-[11px] text-slate-400 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Diagnostic Readout status */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-slate-950 pt-5 mt-6 text-[9px] font-mono text-slate-600 gap-2">
        <span>© ELECTRICAL PHYSICS SIMULATION CORE. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-4 select-none">
          <span>[ STAGE: PROTOTYPING ]</span>
          <span>[ LINK_BUS: ENGAGED ]</span>
        </div>
      </footer>
    </div>
  );
}
