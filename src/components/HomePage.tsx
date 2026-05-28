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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Code2
} from 'lucide-react';

export default function HomePage({ onEnter }: { onEnter: (startingTab?: "foundations" | "explorer" | "programming" | "electronics" | "chat") => void }) {
  const [hoveredModule, setHoveredModule] = React.useState<string | null>(null);

  // Onboarding On-Click Guide states
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState(false);
  const [onboardingStep, setOnboardingStep] = React.useState(0);
  const [onboardingTarget, setOnboardingTarget] = React.useState<"foundations" | "explorer" | "programming" | "electronics" | "chat">("foundations");
  const [onboardingLedOn, setOnboardingLedOn] = React.useState(true);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [onboardingStep]);

  const touchStartXRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    
    // swipe left -> next, swipe right -> prev
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNextOnboarding();
      } else {
        handlePrevOnboarding();
      }
    }
  };

  const handleCloseOrSkip = () => {
    setIsOnboardingOpen(false);
    onEnter("foundations");
  };

  const handleNextOnboarding = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(prev => prev + 1);
    } else {
      setIsOnboardingOpen(false);
      onEnter(onboardingTarget);
    }
  };

  const handlePrevOnboarding = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(prev => prev - 1);
    }
  };

  const handleInitiate = (targetTab: "foundations" | "explorer" | "programming" | "electronics" | "chat", startIndex: number) => {
    setOnboardingTarget(targetTab);
    setOnboardingStep(startIndex);
    setIsOnboardingOpen(true);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOnboardingOpen) return;
      if (e.key === "ArrowRight") {
        handleNextOnboarding();
      } else if (e.key === "ArrowLeft") {
        handlePrevOnboarding();
      } else if (e.key === "Escape") {
        handleCloseOrSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOnboardingOpen, onboardingStep, onboardingTarget]);

  // Navigation Module Cards details
  const modules = [
    {
      id: "00",
      title: "CORE FOUNDATIONS",
      tag: "3-STEP SYSTEMS FLOW",
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      desc: "An interactive, multi-age simulator tracing live signal data loops traveling from physical environment sensors, to the cybernetic brain, to mechanical motor actuators.",
      actionKey: "TRIP THE DATA LOOP",
      badge: "KID-TO-CADET",
      waveColor: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    },
    {
      id: "02",
      title: "LEARN PROGRAMMING",
      tag: "SOFTWARE & LOGIC",
      icon: <Code2 className="w-5 h-5 text-[#6366f1]" />,
      desc: "Master algorithmic logic, continuous loops, conditional state timers, and design interactive flowcharts using standard program shapes like decisions.",
      actionKey: "EXPLORE CODE",
      badge: "CODE LAB",
      waveColor: "bg-indigo-505/10 text-[#a5b4fc] border border-indigo-500/20",
    },
    {
      id: "04",
      title: "BASIC ELECTRONICS",
      tag: "CIRCUITS & PHYSICS",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      desc: "Learn foundational hardware physics, trace live series or parallel circuit current drops, study and compute Ohm's Law formulas in real-time.",
      actionKey: "EXPLORE PHYSICS",
      badge: "ELECTRONICS LAB",
      waveColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    {
      id: "01",
      title: "COMPONENT DIAGNOSTICS",
      tag: "DIAGNOSTICS & SPECS",
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      desc: "Anatomize digital microcontrollers, motor drivers, actuators & sensors. Hover or click custom hardware landmarks to read dynamic real-time electrical telemetry.",
      actionKey: "TAP LANDMARKS",
      badge: "IO ACTIVE",
      waveColor: "bg-sky-505/15 text-sky-400 border border-sky-400/20",
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
    if (hoveredModule === "00") {
      return {
        telemetry: "SYSTEM DATA LOOP INTENDED: FULL SPECTRUM CALIBRATION FLUXACTIVE",
        detail: "Tracing environment sensory signals to computing core to action actuators.",
        efficiency: "100% CADET",
        highlightLeft: true,
        highlightCenter: true,
        highlightRight: true,
        pulseSpeed: 0.7,
        subColor: "text-indigo-400",
        activePath: "M 0,30 Q 25,12 50,30 T 100,30 T 150,30 T 200,30",
        activeWave: "sine"
      };
    }
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
      
      {/* SECTION 1: HERO VIEW + CENTERED ARDUINO BOARD SCHEMATIC ANIMATION */}
      <section className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-2 md:py-4 text-center">
        
        {/* Animated Main Title Box */}
        <div className="space-y-3 max-w-2xl mx-auto flex flex-col items-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/40 border border-sky-500/15">
            <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
            <span className="font-mono text-[8.5px] text-sky-400 font-extrabold tracking-widest uppercase">PHYSICAL SIGNAL SIMULATION DECK</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mb-1">
            <PremiumLogo className="w-10 h-10 md:w-12 h-12" glow={true} />
            <h1 className="text-2xl md:text-[2.2rem] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 leading-none uppercase select-none text-center">
              ROBOTICS LEARNING HUB
            </h1>
          </div>
          
          <p className="text-xs md:text-[13px] text-slate-400 leading-normal font-sans max-w-xl mx-auto font-medium">
            An interactive, hands-on STEM deck for mastering physics and electronics. Flip wires, probe chips, slide voltages, and solve schemas seamlessly with a friendly AI.
          </p>
        </div>

        {/* Dynamic Connected Circuit/Schematics Showcase Panel (Centered, Non-tilted, Floating) */}
        <div className="w-full flex justify-center items-center relative py-2 max-w-2xl mx-auto">
          
          {/* Subtle Ambient glow circles */}
          <div className="absolute w-[240px] h-[240px] bg-sky-500/10 rounded-full blur-[80px] -z-10 animate-pulse pointer-events-none" />
          <div className="absolute w-[180px] h-[180px] bg-indigo-500/5 rounded-full blur-[60px] -z-10 pointer-events-none" />

          {/* Centered Board Wrapper (No perspective tilt, smooth floating translate oscillation) */}
          <div className="w-full max-w-[440px] h-auto relative px-2 md:px-3 flex flex-col items-center justify-center animate-fadeIn">
            <motion.div
              animate={{
                y: [-4, 4, -4]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full bg-[#03091c]/95 border border-sky-500/30 hover:border-sky-400/50 rounded-2xl p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] backdrop-blur-md relative flex flex-col justify-between transition-all overflow-hidden group"
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
        <div className="mt-4 flex flex-col items-center relative z-20">
          {/* Pulsing Backlight Halo to draw user's eye */}
          <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full scale-110 animate-pulse pointer-events-none" />
          
          {/* Main Action trigger button */}
          <button
            onClick={() => handleInitiate("foundations", 0)}
            className="group relative px-14 py-4 bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs md:text-[13px] font-mono tracking-widest rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_50px_rgba(56,189,248,0.75)] active:scale-95 cursor-pointer hover:scale-105 hover:-translate-y-0.5 uppercase flex items-center justify-center animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <span className="flex items-center gap-3">
              INITIALIZE LEARNING
              <ArrowRight className="w-4.5 h-4.5 text-slate-950 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            {/* Outer high-tech terminal corners styling */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-sky-300" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-sky-300" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-sky-300" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-sky-300" />
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
                  <span className="font-mono text-xs text-sky-400/70 font-extrabold bg-sky-950/40 border border-sky-950 px-2 py-0.5 rounded">
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              onMouseEnter={() => setHoveredModule(mod.id)}
              onMouseLeave={() => setHoveredModule(null)}
              onClick={() => {
                const map: { [key: string]: "foundations" | "explorer" | "programming" | "electronics" | "chat" } = {
                  "00": "foundations",
                  "01": "explorer",
                  "02": "programming",
                  "04": "electronics",
                  "03": "chat"
                };
                const stepIdxMap: { [key: string]: number } = {
                  "00": 0,
                  "02": 1,
                  "04": 2,
                  "01": 3,
                  "03": 4
                };
                handleInitiate(map[mod.id], stepIdxMap[mod.id]);
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

      {/* Onboarding Wizard Modal */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop (Backdrop click now correctly triggers the automatic Explorer redirect) */}
          <div 
            className="absolute inset-0 bg-[#020512]/92 backdrop-blur-md cursor-pointer transition-opacity animate-fadeIn" 
            onClick={handleCloseOrSkip}
          />
          
          {/* Modal Card content wrapper */}
          <div 
            className="relative w-full max-w-4xl bg-[#030718] border border-sky-950/80 rounded-2xl shadow-[0_0_80px_rgba(8,17,44,0.7)] flex flex-col md:flex-row max-h-[95vh] md:max-h-[550px] z-10 select-none animate-fadeIn overflow-y-auto md:overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Elegant close button in the absolute upper-right of the card */}
            <button
              onClick={handleCloseOrSkip}
              className="absolute top-4 right-4 p-2 bg-slate-950/90 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all hover:bg-slate-900 shadow-xl cursor-pointer z-30"
              title="Close Tour"
              aria-label="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Left Side: Miniature Visual Blueprint Preview Panel (positioned at top on mobile) */}
            <div className="w-full md:w-5/12 bg-gradient-to-br from-[#020f26] to-[#010614] border-b md:border-b-0 md:border-r border-slate-900/80 p-4 md:p-5 flex flex-col justify-between relative overflow-hidden shrink-0">
              {/* Decorative circuit grids background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a162b_1px,transparent_1px),linear-gradient(to_bottom,#0a162b_1px,transparent_1px)] bg-[size:16px_16px] opacity-25" />
              
              <div className="relative z-10 select-none">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="font-mono text-[8px] text-sky-400 font-extrabold tracking-widest uppercase">HOW TO NAVIGATE // VISUAL GUIDE</span>
                </div>
                
                <div className="space-y-0.5 mb-1.5 select-none">
                  <span className="font-mono text-[9px] text-slate-505 text-slate-500 uppercase tracking-wider font-extrabold">NAVIGATION MANUAL 0{onboardingStep + 1} / 05</span>
                  <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight leading-none">
                    {onboardingStep === 0 && "Core Foundations"}
                    {onboardingStep === 1 && "Robotics Guides"}
                    {onboardingStep === 2 && "Basic Electronics"}
                    {onboardingStep === 3 && "Component Diagnostics"}
                    {onboardingStep === 4 && "AI Advisor"}
                  </h2>
                  <p className="font-mono text-[8.5px] text-indigo-400/80 font-bold uppercase tracking-wide">
                    {onboardingStep === 0 && "Simplified Systems Loop"}
                    {onboardingStep === 1 && "Logic and Circuit Breakers"}
                    {onboardingStep === 2 && "Ohms Law & Resistor Currents"}
                    {onboardingStep === 3 && "Under the Microscope"}
                    {onboardingStep === 4 && "AI Conversation helper"}
                  </p>
                </div>
              </div>

              {/* DYNAMIC HIGH-INTELLIGIBILITY VISUAL MINIATURE MINI-MOCKS FOR ANY AGE */}
              <div className="relative z-10 border border-slate-900/80 bg-slate-950/60 p-2 md:p-3 rounded-xl flex items-center justify-center my-1 select-none h-32 md:h-48">
                <div className="absolute top-1.5 left-2 font-mono text-[7px] text-sky-400 font-bold uppercase tracking-wider">Interface miniature</div>
                
                {onboardingStep === 0 && (
                  /* SVG Miniature of foundations loop: Sensor -> Brain -> Engine - zero animated currents */
                  <svg viewBox="0 0 200 130" className="w-full h-full">
                    {/* Simplified static loop connections with block arrow heads */}
                    <line x1="57" y1="65" x2="79" y2="65" stroke="#475569" strokeWidth="1.5" />
                    <polygon points="79,65 74,62 74,68" fill="#475569" />
                    
                    <line x1="121" y1="65" x2="143" y2="65" stroke="#475569" strokeWidth="1.5" />
                    <polygon points="143,65 138,62 138,68" fill="#475569" />

                    <path d="M 164,85 V 105 H 36 V 85" fill="none" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
                    
                    {/* Simple block elements with clear labels */}
                    <g>
                      <rect x="15" y="45" width="42" height="40" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                      <text x="36" y="60" textAnchor="middle" fontSize="6.5" fill="#a5b4fc" fontWeight="extrabold">INPUT</text>
                      <text x="36" y="72" textAnchor="middle" fontSize="5" fill="#ffffff" fontFamily="monospace">TEMP SENSOR</text>
                    </g>

                    <g>
                      <rect x="79" y="45" width="42" height="40" rx="6" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
                      <text x="100" y="60" textAnchor="middle" fontSize="6.5" fill="#34d399" fontWeight="extrabold">BRAIN</text>
                      <text x="100" y="72" textAnchor="middle" fontSize="5" fill="#ffffff" fontFamily="monospace">MCU CHIP</text>
                    </g>

                    <g>
                      <rect x="143" y="45" width="42" height="40" rx="6" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="164" y="60" textAnchor="middle" fontSize="6.5" fill="#f59e0b" fontWeight="extrabold">OUTPUT</text>
                      <text x="164" y="72" textAnchor="middle" fontSize="5" fill="#ffffff" fontFamily="monospace">DRIVE MOTOR</text>
                    </g>

                    <text x="100" y="116" textAnchor="middle" fontSize="5.5px" fill="#cbd5e1" fontWeight="bold" fontFamily="monospace">SYSTEM ARCHITECTURE (NO CURRENT MODE)</text>
                  </svg>
                )}

                {onboardingStep === 1 && (
                  /* SVG Miniature of lab workbenches showing flowchart (technical shapes), circuit (closed) and code clearly separated */
                  <svg viewBox="0 0 200 130" className="w-full h-full">
                    {/* Background frame */}
                    <rect x="5" y="8" width="190" height="114" rx="6" fill="#010515" stroke="#1e293b" strokeWidth="1" />
                    
                    {/* Panel 1: Flowchart with fully technical Shapes */}
                    <g>
                      <rect x="10" y="14" width="56" height="102" rx="4" fill="#020d1c/40" stroke="#1e293b" strokeWidth="0.75" />
                      {/* Header */}
                      <rect x="10" y="14" width="56" height="11" rx="1.5" fill="#1e1b4b" />
                      <text x="38" y="21.5" textAnchor="middle" fontSize="4.2" fill="#818cf8" fontFamily="monospace" fontWeight="bold">FLOW CHART</text>
                      
                      {/* Technical Capsule: Start */}
                      <rect x="23" y="27" width="30" height="9" rx="4.5" fill="#1e1b4b" stroke="#818cf8" strokeWidth="0.5" />
                      <text x="38" y="33" textAnchor="middle" fontSize="3.2" fill="#a5b4fc" fontFamily="monospace">START</text>
                      
                      {/* Arrow Down */}
                      <path d="M 38,36 L 38,43" fill="none" stroke="#4b5563" strokeWidth="0.6" />
                      
                      {/* Technical Diamond: Decision */}
                      <polygon points="38,43 58,51 38,59 18,51" fill="#022c22" stroke="#10b981" strokeWidth="0.5" />
                      <text x="38" y="53" textAnchor="middle" fontSize="2.8" fill="#a7f3d0" fontFamily="monospace">TEMP &gt; 30°?</text>
                      
                      {/* Flow arrow line */}
                      <path d="M 38,59 L 38,69" fill="none" stroke="#4b5563" strokeWidth="0.6" />
                      <text x="43" y="65" fontSize="2.8" fill="#10b981" fontFamily="monospace" fontWeight="bold">YES</text>
                      
                      {/* Technical Rectangle: Action Box 1 */}
                      <rect x="16" y="69" width="44" height="11" rx="1" fill="#5b21b6/80" stroke="#a78bfa" strokeWidth="0.5" />
                      <text x="38" y="76" textAnchor="middle" fontSize="2.8" fill="#ede9fe" fontFamily="monospace">LED_ON = TRUE</text>

                      {/* Flow arrow line 2 */}
                      <path d="M 38,80 L 38,89" fill="none" stroke="#4b5563" strokeWidth="0.6" />

                      {/* Technical Capsule: End */}
                      <rect x="23" y="89" width="30" height="9" rx="4.5" fill="#1c1917" stroke="#78716c" strokeWidth="0.5" />
                      <text x="38" y="95" textAnchor="middle" fontSize="3.2" fill="#94a3b8" fontFamily="monospace">END</text>
                    </g>

                    {/* Panel 2: Closed Loop Circuit without moving pulses */}
                    <g>
                      <rect x="72" y="14" width="56" height="102" rx="4" fill="#020d1c/40" stroke="#1e293b" strokeWidth="0.75" />
                      {/* Header */}
                      <rect x="72" y="14" width="56" height="11" rx="1.5" fill="#064e3b" />
                      <text x="100" y="21.5" textAnchor="middle" fontSize="4.2" fill="#34d399" fontFamily="monospace" fontWeight="bold">SIM CIRCUIT</text>
                      
                      {/* Battery Graphic (5V) */}
                      <rect x="78" y="34" width="15" height="11" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
                      <text x="85.5" y="41" textAnchor="middle" fontSize="4.2" fill="#94a3b8" fontFamily="monospace" fontWeight="bold">5V</text>
                      
                      {/* Closed-loop wire pathways (fixed open circuit bug) */}
                      {/* Pos wire from battery (93, 39.5) to LED anode (115, 63) */}
                      <path d="M 93,39.5 H 115 V 63" fill="none" stroke="#ef4444" strokeWidth="1" />
                      {/* Neg/Gnd wire from LED cathode (115, 73) down to (115, 85) to resistor right-side (106, 85) */}
                      <path d="M 115,73 V 85 H 106" fill="none" stroke="#3b82f6" strokeWidth="1" />
                      {/* Wire ground return from resistor left-side (94, 85) to battery ground (78, 39.5) */}
                      <path d="M 94,85 H 75 V 39.5 H 78" fill="none" stroke="#3b82f6" strokeWidth="1" />

                      {/* Yellow Glowing LED bulb output */}
                      <g transform="translate(115, 68)">
                        <circle cx="0" cy="0" r="5" fill="#fbbf24" fillOpacity="0.25" className="animate-pulse" />
                        <circle cx="0" cy="0" r="3" fill="#fbbf24" stroke="#ffffff" strokeWidth="0.5" />
                        <text x="8" y="2.5" fontSize="3.5" fill="#fbbf24" fontFamily="monospace">LED</text>
                      </g>
                      
                      {/* Resistor Component in path */}
                      <rect x="94" y="83" width="12" height="4" rx="0.5" fill="#78350f" stroke="#d97706" strokeWidth="0.5" />
                      <text x="100" y="93" textAnchor="middle" fontSize="3" fill="#94a3b8" fontFamily="monospace">220Ω</text>
                    </g>

                    {/* Panel 3: Code Editor */}
                    <g>
                      <rect x="134" y="14" width="56" height="102" rx="4" fill="#020d1c/40" stroke="#1e293b" strokeWidth="0.75" />
                      {/* Header */}
                      <rect x="134" y="14" width="56" height="11" rx="1.5" fill="#1c1917" />
                      <text x="162" y="21.5" textAnchor="middle" fontSize="4.2" fill="#38bdf8" fontFamily="monospace" fontWeight="bold">C++ SOURCE</text>
                      
                      {/* IDE editor micro frame */}
                      <rect x="137" y="29" width="50" height="72" rx="2" fill="#030712" stroke="#1e293b" strokeWidth="0.5" />
                      
                      {/* Miniature Arduino lines representing turning on LED */}
                      <g transform="translate(140, 34)" fontFamily="monospace" fontSize="3.4">
                        <text y="4" fill="#475569">// Turn LED On</text>
                        <text y="10" fill="#f43f5e">void <tspan fill="#38bdf8">loop</tspan>() &#123;</text>
                        
                        <rect x="-1" y="12.5" width="46" height="6.5" fill="rgba(16, 185, 129, 0.15)" rx="0.5" />
                        <text y="17.5" fill="#10b981" fontWeight="extrabold">  write(13,H);</text>
                        
                        <text y="25" fill="#78716c">  delay(1000);</text>
                        <text y="32.5" fill="#f43f5e">  write(13,L);</text>
                        <text y="40" fill="#78716c">  delay(1000);</text>
                        <text y="47.5" fill="#f43f5e">&#125;</text>
                      </g>

                      {/* Small compile banner */}
                      <rect x="140" y="105" width="44" height="7.5" rx="1" fill="#064e3b" stroke="#10b981" strokeWidth="0.5" />
                      <text x="162" y="110" textAnchor="middle" fontSize="3" fill="#34d399" fontFamily="monospace" fontWeight="bold">COMPILED OK</text>
                    </g>
                  </svg>
                )}

                {onboardingStep === 2 && (
                  /* SVG Miniature of basic electronics showcasing a simple circuit for turning on an LED */
                  <svg viewBox="0 0 200 130" className="w-full h-full cursor-pointer select-none" onClick={() => setOnboardingLedOn(!onboardingLedOn)}>
                    {/* Background frame */}
                    <rect x="5" y="8" width="190" height="114" rx="6" fill="#020813" stroke="#22d3ee" strokeWidth="1" />
                    
                    {/* Battery DC Source */}
                    <g transform="translate(18, 30)">
                      <rect x="0" y="0" width="24" height="38" rx="2" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
                      <rect x="6" y="-4" width="12" height="4" rx="1" fill="#4338ca" />
                      <text x="12" y="16" textAnchor="middle" fontSize="6" fill="#818cf8" fontWeight="bold" fontFamily="monospace">9V</text>
                      <text x="12" y="28" textAnchor="middle" fontSize="5" fill="#a5b4fc" fontFamily="monospace">CELL</text>
                    </g>
                    
                    {/* Switch / Button */}
                    <g transform="translate(75, 40)">
                      <rect x="0" y="0" width="20" height="20" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                      <circle cx="10" cy="10" r="6" fill={onboardingLedOn ? "#ef4444" : "#b91c1c"} className="transition-all" />
                      <text x="10" y="-4" textAnchor="middle" fontSize="4.5" fill="#94a3b8" fontFamily="monospace">SWITCH</text>
                    </g>
                    
                    {/* Resistor */}
                    <g transform="translate(135, 45)">
                      <rect x="0" y="3" width="24" height="6" rx="1" fill="#78350f" stroke="#d97706" strokeWidth="0.5" />
                      {/* Stripes */}
                      <rect x="4" y="3" width="2" height="6" fill="#ef4444" />
                      <rect x="8" y="3" width="2" height="6" fill="#ef4444" />
                      <rect x="12" y="3" width="2" height="6" fill="#9a3412" />
                      <text x="12" y="16" textAnchor="middle" fontSize="4.5" fill="#a1a1aa" fontFamily="monospace">220Ω</text>
                    </g>

                    {/* Highly stylized LED bulb */}
                    <g transform="translate(145, 85)">
                      <circle cx="0" cy="0" r="14" fill="#10b981" fillOpacity={onboardingLedOn ? "0.2" : "0.0"} className="transition-all duration-300" />
                      <circle cx="0" cy="0" r="8" fill={onboardingLedOn ? "#10b981" : "#1f2937"} stroke="#34d399" strokeWidth="0.75" className="transition-all duration-300" />
                      {/* Filament */}
                      <path d="M -3,2 L -1,-2 H 1 L 3,2" fill="none" stroke={onboardingLedOn ? "#ffffff" : "#6b7280"} strokeWidth="0.5" />
                      <text x="0" y="-12" textAnchor="middle" fontSize="5" fill={onboardingLedOn ? "#34d399" : "#94a3b8"} fontFamily="monospace" fontWeight="bold">LED: {onboardingLedOn ? "ON" : "OFF"}</text>
                    </g>
                    
                    {/* Electrical wire connections */}
                    {/* Pos wire from battery to button */}
                    <path d="M 30,30 V 20 H 85 V 40" fill="none" stroke="#ef4444" strokeWidth="1" />
                    {/* From button to resistor */}
                    <path d="M 95,50 H 135" fill="none" stroke="#fb923c" strokeWidth="1" />
                    {/* From resistor to LED cathode */}
                    <path d="M 147,51 V 77" fill="none" stroke="#fbbf24" strokeWidth="1" />
                    {/* Return GND wire from LED anode to battery negative */}
                    <path d="M 145,93 V 110 H 30 V 68" fill="none" stroke="#3b82f6" strokeWidth="1" />
                    
                    <text x="100" y="122" textAnchor="middle" fontSize="5.5" fill="#22d3ee" fontWeight="bold" fontFamily="monospace">TAP TO TOGGLE CIRCUIT LED STATE</text>
                  </svg>
                )}

                {onboardingStep === 3 && (
                  /* SVG Miniature of diagnostics microscope pinouts & Arduino UNO view alongside specs (no moving ping animations) */
                  <svg viewBox="0 0 200 130" className="w-full h-full">
                    {/* Background frame */}
                    <rect x="5" y="8" width="190" height="114" rx="6" fill="#020617" stroke="#334155" strokeWidth="1" />
                    
                    {/* Oscilloscope Grid in the background of the scope window */}
                    <g opacity="0.1" stroke="#38bdf8" strokeWidth="0.5">
                      <line x1="5" y1="36.5" x2="195" y2="36.5" />
                      <line x1="5" y1="65" x2="195" y2="65" />
                      <line x1="5" y1="93.5" x2="195" y2="93.5" />
                      <line x1="100" y1="8" x2="100" y2="122" />
                      <line x1="50" y1="8" x2="50" y2="122" />
                      <line x1="150" y1="8" x2="150" y2="122" />
                    </g>

                    {/* LEFT HALF: Arduino UNO PCBA representation */}
                    <g transform="translate(14, 28)">
                      {/* Teal blue/green board background */}
                      <rect x="0" y="0" width="85" height="66" rx="4" fill="#007a87" stroke="#009fac" strokeWidth="1.2" />
                      
                      {/* Silver USB Interface */}
                      <rect x="-8" y="8" width="16" height="14" rx="1.5" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />
                      <line x1="-8" y1="12" x2="8" y2="12" stroke="#475569" strokeWidth="0.5" />
                      <line x1="-8" y1="18" x2="8" y2="18" stroke="#475569" strokeWidth="0.5" />

                      {/* Black Power DC Jack */}
                      <rect x="-6" y="38" width="14" height="18" rx="1" fill="#1e293b" stroke="#0f172a" strokeWidth="0.75" />
                      
                      {/* ATMega328 Processor DIP IC Chip */}
                      <rect x="34" y="24" width="38" height="12" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.75" />
                      {/* Pins */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <g key={i}>
                          <rect x={37 + i * 4} y="21.5" width="1.2" height="2.5" fill="#cbd5e1" />
                          <rect x={37 + i * 4} y="36" width="1.2" height="2.5" fill="#cbd5e1" />
                        </g>
                      ))}
                      <text x="53" y="31.5" textAnchor="middle" fontSize="3.8" fill="#ffffff" fontWeight="bold" fontFamily="monospace">ATMEGA328P</text>

                      {/* GPIO Header Strip (Top Edge) */}
                      <rect x="14" y="4" width="60" height="5" rx="0.5" fill="#111827" />
                      {Array.from({ length: 14 }).map((_, i) => (
                        <circle key={i} cx={17 + i * 4.2} cy="6.5" r="0.75" fill="#fbbf24" />
                      ))}
                      <text x="44" y="1.5" textAnchor="middle" fontSize="2.8" fill="#94a3b8" fontFamily="monospace">DIGITAL I/O</text>

                      {/* Power / Analog Header Strip (Bottom Edge) */}
                      <rect x="24" y="57" width="48" height="5" rx="0.5" fill="#111827" />
                      {Array.from({ length: 10 }).map((_, i) => (
                        <circle key={i} cx={27 + i * 4.4} cy="59.5" r="0.75" fill="#38bdf8" />
                      ))}
                      <text x="48" y="65.5" textAnchor="middle" fontSize="2.8" fill="#94a3b8" fontFamily="monospace">ANALOG / PWR</text>

                      {/* Power TX/RX Small Led indicators */}
                      <circle cx="24" cy="16" r="1.2" fill="#22c55e" />
                      <circle cx="24" cy="20" r="1.2" fill="#ef4444" />
                      <text x="18" y="18" fontSize="2.5" fill="#cbd5e1" fontFamily="monospace">PWR</text>
                      
                      {/* Highlighted active pin probe - static design element with no ping animations */}
                      <circle cx="67.4" cy="6.5" r="1.2" fill="#f43f5e" />
                    </g>

                    {/* Laser trace lines mapping pin voltage output to datasheet panel */}
                    <path d="M 81.4,34.5 H 112 V 58" fill="none" stroke="#f43f5e" strokeWidth="0.75" strokeDasharray="1,1" />

                    {/* RIGHT HALF: Technical Data Specs Card */}
                    <g transform="translate(112, 14)">
                      {/* Outer Card block */}
                      <rect x="0" y="0" width="74" height="102" rx="4" fill="#030c1e" stroke="#009fac" strokeWidth="0.75" />
                      
                      {/* Top ribbon banner */}
                      <rect x="0" y="0" width="74" height="13" rx="1.5" fill="#004d40" />
                      <text x="37" y="8.5" textAnchor="middle" fontSize="4.5" fill="#34d399" fontFamily="monospace" fontWeight="black" tracking="wider">ARDUINO UNO</text>

                      {/* Specs List */}
                      <g transform="translate(6, 22)" fontFamily="monospace" fontSize="4" fill="#94a3b8">
                        <text y="4" fill="#ffffff" fontWeight="bold">PROCESSOR:</text>
                        <text y="10" fill="#22d3ee">ATmega328P 8B</text>
                        
                        <text y="19" fill="#ffffff" fontWeight="bold">CLOCK RATE:</text>
                        <text y="25" fill="#10b981" fontWeight="bold">16 MHz Crystal</text>
                        
                        <text y="34" fill="#ffffff" fontWeight="bold">FLASH / EEPROM:</text>
                        <text y="40" fill="#e2e8f0">32KB / 1KB EE</text>
                        
                        <text y="49" fill="#ffffff" fontWeight="bold">I/O INTERFACES:</text>
                        <text y="55" fill="#ffedd5">14 Dig / 6 Anlg</text>

                        <text y="65" fill="#ffffff" fontWeight="bold">OPERATING VOLT:</text>
                        <text y="71" fill="#38bdf8">5V / (7-12V In)</text>
                      </g>
                    </g>
                  </svg>
                )}

                {onboardingStep === 4 && (
                  /* SVG Miniature of AI student-robot split chat companion */
                  <svg viewBox="0 0 200 130" className="w-full h-full">
                    <rect x="20" y="15" width="160" height="100" rx="8" fill="#020817" stroke="#10b981" strokeWidth="1.5" />
                    
                    {/* Chat Bubble 1: Student query */}
                    <rect x="30" y="27" width="90" height="20" rx="4" fill="#1d4ed8" />
                    <text x="35" y="39" fontSize="5.5" fill="#ffffff" fontWeight="semibold">How is raw circuit wired?</text>
                    
                    {/* Chat Bubble 2: Robotic Tutor answer */}
                    <rect x="80" y="55" width="90" height="24" rx="4" fill="#064e3b" />
                    <text x="85" y="67" fontSize="5.5" fill="#10b981" fontWeight="extrabold">Plus goes to Red!</text>
                    <text x="85" y="74" fontSize="4.5" fill="#a7f3d0" fontFamily="monospace">Ground always connects to Black.</text>
                    
                    <text x="100" y="104" textAnchor="middle" fontSize="6px" fill="#34d399" fontWeight="bold" className="animate-pulse">CHAT LIVE FOR CODE AND DIAGRAMS</text>
                  </svg>
                )}
              </div>

              <div className="relative z-10 text-[8.5px] font-mono text-slate-500 uppercase tracking-widest hidden md:block">
                SWIPE CARDS TO CYCLE MODULES
              </div>
            </div>

            {/* Right Side: Tab Details & Highlights Navigation */}
            <div 
              ref={scrollContainerRef}
              className="w-full md:w-7/12 bg-[#020612]/95 p-5 flex flex-col justify-between overflow-y-auto"
            >
              {/* Top Row: Clean and simple tab categories */}
              <div className="flex items-center pb-3 border-b border-slate-900/60 mb-3 select-none pr-10 md:pr-12">
                <div className="flex gap-1.5 overflow-x-auto py-1">
                  {([
                    { id: "foundations", labName: "Foundations", color: "#6366f1" },
                    { id: "programming", labName: "Learn Programming", color: "#818cf8" },
                    { id: "electronics", labName: "Basic Electronics", color: "#f59e0b" },
                    { id: "explorer", labName: "Diagnostics", color: "#38bdf8" },
                    { id: "chat", labName: "AI Advisor", color: "#10b981" }
                  ]).map((slide, slideIdx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setOnboardingStep(slideIdx)}
                      className={`px-2.5 py-1 font-mono text-[8.5px] rounded border tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                        onboardingStep === slideIdx
                          ? "border-sky-500 bg-slate-900 text-slate-100 font-extrabold shadow-sm shadow-sky-500/10"
                          : "border-slate-950 bg-slate-950/20 text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: onboardingStep === slideIdx ? slide.color : '#475569' }} />
                      {slide.labName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Explanatory Panel of Active Step Slide */}
              <div className="flex-1 space-y-3.5 pr-1 text-left">
                <div className="space-y-1 select-none">
                  <h3 className="text-base font-extrabold text-slate-100 mt-0.5 uppercase tracking-tight">
                    {onboardingStep === 0 && "How to Navigate Core Foundations"}
                    {onboardingStep === 1 && "How to Learn Programming"}
                    {onboardingStep === 2 && "How to Navigate Basic Electronics"}
                    {onboardingStep === 3 && "How to Navigate Component Diagnostics"}
                    {onboardingStep === 4 && "How to Navigate AI Advisor"}
                  </h3>
                </div>

                {/* Highly readable, toddler-and-parent simplified Bullet Highlights */}
                <div className="space-y-1.5 border-t border-slate-900/60 pt-2.5 select-none">
                  <span className="font-mono text-[7.5px] text-slate-500 uppercase tracking-wider block font-bold">Navigation Instructions:</span>
                  <ul className="space-y-2">
                    {onboardingStep === 0 && (
                      <>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Select <strong className="text-white">"Core Foundations"</strong> from the left sidebar to open this system stage.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Click <strong className="text-white font-bold">Input Sensors</strong>, <strong className="text-white font-bold">Controller Brain</strong>, or <strong className="text-white font-bold">Output Actuators</strong> to display their dedicated hardware registers and details.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Toggle <strong className="text-white font-bold">Current Flow Lines</strong> to animate dynamic feedback signals passing across components.
                          </p>
                        </li>
                      </>
                    )}
                    {onboardingStep === 1 && (
                      <>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Select <strong className="text-white">"Learn Programming"</strong> from the left sidebar or click the module card to open the software sandbox.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Choose between stations: <strong className="text-white font-bold">Logic and Flow Chart</strong> or <strong className="text-white font-bold">Code and Commands</strong>.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Click any flow diagram shapes to show definitions, or drag variables and conditionals sliders to dynamically compile and test Arduino C++ templates.
                          </p>
                        </li>
                      </>
                    )}
                    {onboardingStep === 2 && (
                      <>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Select <strong className="text-white">"Basic Electronics"</strong> from the sidebar to open the circuits laboratory workbench.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Interact with the <strong className="text-white font-bold">Ohm's Law Equation Wheel</strong> to compute Voltage, Current, and Resistance drops dynamically.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Pull virtual breakers and circuit fuses on the breadboard simulation, observing live series or parallel resistor currents in real-time.
                          </p>
                        </li>
                      </>
                    )}
                    {onboardingStep === 3 && (
                      <>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Select <strong className="text-white">"Component Diagnostics"</strong> from the left sidebar to open the component catalog.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-450 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Click any hardware device in the left-hand <strong className="text-white font-bold font-sans">Board Catalog List</strong> to display its high-fidelity blueprint.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Hover or tap the colored pin sockets on the board illustration to register live electrical waveforms on the simulated oscilloscope below.
                          </p>
                        </li>
                      </>
                    )}
                    {onboardingStep === 4 && (
                      <>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Select <strong className="text-white">"AI Advisor"</strong> from the left sidebar to interact with your personal cybernetic robotics engineering tutor.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Click any quick pre-crafted engineering query chips to execute automated lessons about Ohm's Law or hardware pin tolerances.
                          </p>
                        </li>
                        <li className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                          <p className="font-sans text-slate-300">
                            Type custom equations or microcontroller C++ snippets into the text field to seek dynamic help and immediate automated compiler debugging.
                          </p>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Navigation controls down at bottom of onboarding window */}
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-900/70 select-none mt-2 shrink-0">
                {/* Previous button */}
                <button
                  type="button"
                  onClick={handlePrevOnboarding}
                  disabled={onboardingStep === 0}
                  className={`flex items-center gap-1 px-3 py-1.5 font-mono text-[8.5px] font-bold rounded border transition-all cursor-pointer uppercase ${
                    onboardingStep === 0
                      ? "border-slate-950 bg-slate-950/20 text-slate-700 pointer-events-none opacity-40"
                      : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800 text-slate-300 shadow-sm"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> BACK
                </button>

                {/* Dot bullet indices */}
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setOnboardingStep(idx)}
                      className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                        onboardingStep === idx 
                          ? "bg-sky-400 scale-125 shadow-[0_0_6px_#0ea5e9]" 
                          : "bg-slate-800 hover:bg-slate-700"
                      }`}
                      title={`Go to tab ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Next module option */}
                <button
                  type="button"
                  onClick={handleNextOnboarding}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-slate-950 font-mono text-[8.5px] font-bold rounded transition-all cursor-pointer shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 active:scale-98 uppercase font-black"
                >
                  {onboardingStep === 4 ? "LAUNCH LAB DECK" : "NEXT"} <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
