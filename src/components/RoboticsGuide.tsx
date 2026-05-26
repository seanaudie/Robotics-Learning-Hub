import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Settings, 
  HelpCircle, 
  Sliders, 
  Zap, 
  Eye, 
  Compass, 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  Info,
  GitCommit,
  Activity,
  CheckCircle2,
  ChevronRight,
  Shield,
  Volume2,
  Bot,
  Cpu,
  Code2,
  Play,
  Pause,
  Flame,
  RefreshCw,
  Layers
} from "lucide-react";

// Structure definition for the custom architect options
interface ComponentOption {
  id: string;
  name: string;
  symbol: string;
  description: string;
  details: string;
}

const SENSOR_OPTIONS: ComponentOption[] = [
  {
    id: "ultrasonic",
    name: "Ultrasonic Distance Sensor",
    symbol: "S-ULS",
    description: "Measures distance by transmitting ultrasound pulses.",
    details: "Perfect for measuring physical distance to front obstacles. Translates time-of-flight bounce rates into centimeter values."
  },
  {
    id: "soil_moisture",
    name: "Soil Moisture Sensor",
    symbol: "S-SMO",
    description: "Measures water content across root substrates.",
    details: "Measures electrical conductivity through moisture. Higher water volumes yield higher conductivity and lower resistance."
  },
  {
    id: "sound_mic",
    name: "Acoustic Decibel Microphone",
    symbol: "S-SND",
    description: "Detects acoustic transient threshold spikes.",
    details: "Converts pressure fluctuations of audio waves into quantized, rapid voltage spikes."
  },
  {
    id: "photo_ldr",
    name: "LDR Photoresistor",
    symbol: "S-LDR",
    description: "Measures visual ambient light lux levels.",
    details: "Light-dependent resistor that reduces its internal resistance as light intensity grows, perfect for dawn/dusk state triggers."
  }
];

const CONTROLLER_OPTIONS: ComponentOption[] = [
  {
    id: "arduino",
    name: "Arduino Uno R3",
    symbol: "C-ARD",
    description: "Robust 8-bit chip, ideal for low-latency loop processing.",
    details: "Runs a continuous bare-metal loop at 16 MHz. Unmatched for low-level direct GPIO timing safety."
  },
  {
    id: "esp32",
    name: "ESP32 Core Module",
    symbol: "C-ESP",
    description: "Dual-core processor with onboard Wi-Fi / Bluetooth.",
    details: "Ideal for smart IoT. Leverages dual processing threads to read complex inputs and post web data in parallel."
  }
];

const ACTUATOR_OPTIONS: ComponentOption[] = [
  {
    id: "servo",
    name: "SG90 Micro Servo",
    symbol: "A-SRV",
    description: "Delivers micro-stepped, high-torque joint control.",
    details: "Takes precise PWM pulses of 50 Hz to sweep an output arm from 0° up to 180° with angular safety locks."
  },
  {
    id: "motor_driver",
    name: "DC Gear Motor Suite",
    symbol: "A-MTR",
    description: "Drives dual tracks to navigate chassis wheels.",
    details: "Needs motor drivers to deliver up to 1.5 Amps to electromagnets, turning gears to propel standard robot platforms."
  },
  {
    id: "piezo_buzzer",
    name: "Acoustic Piezo Buzzer",
    symbol: "A-BUZ",
    description: "Drives mechanical waves to announce alerts.",
    details: "Utilizes rapid electrical oscillations to vibrate a thin quartz plate, generating audible warning tones."
  }
];

// Presets representing the case studies for flowchart tab
interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  sensor: string;
  controller: string;
  actuator: string;
  explanation: string;
  flowSteps: {
    shape: "circle" | "parallelogram" | "rectangle" | "diamond";
    label: string;
    subtext: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  flowArrows: {
    from: number;
    to: number;
    label?: string;
    direction?: "down" | "right" | "left" | "up" | "yes" | "no";
  }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "obstacle_avoidance",
    title: "Obstacle Avoiding Mobile Carrier",
    subtitle: "Navigational collision safeguard logic",
    sensor: "ultrasonic",
    controller: "arduino",
    actuator: "motor_driver",
    explanation: "This autonomous vehicle regularly broadcasts ultrasound loops. If distance is critical, it stops immediately and turns to avoid hitting a barrier.",
    flowSteps: [
      { shape: "circle", label: "START", subtext: "Boot active loop", x: 125, y: 15, width: 90, height: 40 },
      { shape: "parallelogram", label: "READ SENSOR", subtext: "Measure Echo pulse duration", x: 105, y: 80, width: 130, height: 45 },
      { shape: "rectangle", label: "CALCULATE", subtext: "Distance = Time * 0.0343 / 2", x: 110, y: 150, width: 120, height: 45 },
      { shape: "diamond", label: "BARRIER < 15CM?", subtext: "Check if path is blocked", x: 105, y: 220, width: 130, height: 80 },
      { shape: "parallelogram", label: "STEER LEFT", subtext: "Spin motors oppositely", x: 10, y: 325, width: 120, height: 45 },
      { shape: "parallelogram", label: "SPEED FORWARD", subtext: "Apply full standard throttle", x: 210, y: 325, width: 120, height: 45 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, label: "YES", direction: "left" },
      { from: 3, to: 5, label: "NO", direction: "right" }
    ]
  },
  {
    id: "smart_watering",
    title: "Climate-Controlled Smart Planter",
    subtitle: "Automated hydration management system",
    sensor: "soil_moisture",
    controller: "esp32",
    actuator: "motor_driver",
    explanation: "Constructed to check moisture and humidity. If soil resistivity grows past a threshold (dry), a DC pump is triggered for a brief timer before checking again.",
    flowSteps: [
      { shape: "circle", label: "MONITOR", subtext: "Initialize Wi-Fi read", x: 125, y: 15, width: 90, height: 40 },
      { shape: "parallelogram", label: "GET RESISTIVITY", subtext: "Read ADC Analog voltage", x: 105, y: 80, width: 130, height: 45 },
      { shape: "diamond", label: "MOISTURE < 40%?", subtext: "Determine if dry threshold met", x: 105, y: 150, width: 130, height: 80 },
      { shape: "rectangle", label: "ACTIVATE RELAY", subtext: "Engage Water Pump Suite", x: 10, y: 255, width: 120, height: 45 },
      { shape: "rectangle", label: "STANDBY SLEEP", subtext: "Deep sleep ESP for 2 mins", x: 210, y: 255, width: 120, height: 45 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "YES", direction: "left" },
      { from: 2, to: 4, label: "NO", direction: "right" }
    ]
  },
  {
    id: "clapped_alarm",
    title: "Acoustic Sound Triggered Lock Screen",
    subtitle: "Clap dynamic response framework",
    sensor: "sound_mic",
    controller: "arduino",
    actuator: "servo",
    explanation: "Perfect for physical action triggered via audio spikes. Detects sharp transient db peaks to physically rotate a mechanical toggle.",
    flowSteps: [
      { shape: "circle", label: "LISTEN", subtext: "Constant interrupt mode", x: 125, y: 15, width: 90, height: 40 },
      { shape: "parallelogram", label: "COMPARE DB", subtext: "Compare analog signal level", x: 105, y: 80, width: 130, height: 45 },
      { shape: "diamond", label: "DB VALUE > 750?", subtext: "Filter isolated audio spike", x: 105, y: 150, width: 130, height: 80 },
      { shape: "rectangle", label: "SWEEP SERVO RAMP", subtext: "Engage toggle physical flip", x: 10, y: 255, width: 120, height: 45 },
      { shape: "rectangle", label: "DEBOUNCE TIMER", subtext: "Ignore micro-echo buffers", x: 210, y: 255, width: 120, height: 45 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3, label: "YES", direction: "left" },
      { from: 2, to: 4, label: "NO", direction: "right" }
    ]
  }
];

export default function RoboticsGuide() {
  const [activeGuideTab, setActiveGuideTab] = useState<"coding" | "flowchart" | "electronics">("coding");
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [selectedShape, setSelectedShape] = useState<string | null>("diamond");

  // Coding interactive sandbox state
  const [activeCodingSubTab, setActiveCodingSubTab] = useState<"variables" | "conditions" | "loops">("variables");
  const [userDistance, setUserDistance] = useState<number>(45); // 0-100cm slider
  const [isMotionTriggered, setIsMotionTriggered] = useState<boolean>(false);
  const [lightRawADC, setLightRawADC] = useState<number>(650); // 0-1023 slider
  const [loopFrequencySelected, setLoopFrequencySelected] = useState<number>(1); // 0=Slow, 1=Med, 2=Fast
  const [loopPlayCycle, setLoopPlayCycle] = useState<number>(0);

  // Electronics interactive state
  const [activeElectSubTab, setActiveElectSubTab] = useState<"ohms" | "circuits">("ohms");
  const [ohmsVoltage, setOhmsVoltage] = useState<number>(5.0); // 0-12V
  const [ohmsResistance, setOhmsResistance] = useState<number>(220); // 100-1000 ohms
  const [isSeriesCut, setIsSeriesCut] = useState<boolean>(false);
  const [isParallel1Cut, setIsParallel1Cut] = useState<boolean>(false);
  const [isParallel2Cut, setIsParallel2Cut] = useState<boolean>(false);

  // Flowchart animation state
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);

  const activeCase = CASE_STUDIES[selectedCaseIdx];

  // 1. Code execution loops cycles simulation loop
  useEffect(() => {
    if (activeGuideTab !== "coding" || activeCodingSubTab !== "loops") return;
    const rateHz = [2800, 1000, 180]; // ms delays
    const interval = setInterval(() => {
      setLoopPlayCycle(prev => (prev + 1) % 4);
    }, rateHz[loopFrequencySelected]);
    return () => clearInterval(interval);
  }, [activeGuideTab, activeCodingSubTab, loopFrequencySelected]);

  // 2. SVG Flowchart automated tracking simulation
  useEffect(() => {
    if (activeGuideTab !== "flowchart") return;
    const interval = setInterval(() => {
      setActiveFlowStep((prev) => {
        const nextArrows = activeCase.flowArrows.filter(a => a.from === prev);
        if (nextArrows.length === 0) return 0; // wrap back to START
        if (nextArrows.length > 1) {
          // If a decision block splits, simulate alternate outcomes over time
          return nextArrows[Math.random() > 0.5 ? 0 : 1].to;
        }
        return nextArrows[0].to;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [activeGuideTab, selectedCaseIdx, activeCase]);

  // Compute Current for Ohm's Law
  const currentAmps = ohmsVoltage / ohmsResistance;
  const currentMilliamps = currentAmps * 1000;
  const isPinBlown = currentMilliamps > 40.0; // Arduino Uno pin maximum continuous specs: 40mA

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full px-1" id="robotics-edu-suite">
      {/* Header banner explaining STEM systems */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8" id="edu-hero-intro">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-505/10 to-sky-505/0 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#6366f1] bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              STEM Robotics Academy
            </span>
            <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              ROBOTICS & CODING GUIDE
            </h2>
            <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
              Robots interact with the real world using a basic loop: they read physical sensors, make logical decisions, and control mechanical motors or indicators. Discover these core concepts clearly below!
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 backdrop-blur-sm w-full">
            <span className="font-mono text-[9px] text-[#818cf8] font-extrabold tracking-widest uppercase pl-1.5 mb-1 block">
              CHOOSE A STATION
            </span>
            {([
              { id: "coding", label: "1. Code & Commands", sub: "Learn Variables, Loop timers & Condition checks", icon: Code2, num: "01" },
              { id: "flowchart", label: "2. Logic & Flowcharts", sub: "Interactive decision flowcharts & C++ loops", icon: Activity, num: "02" },
              { id: "electronics", label: "3. Basic Circuits", sub: "Ohm's Law & Circuit schematic simulations", icon: Zap, num: "03" }
            ] as const).map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeGuideTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveGuideTab(tab.id)}
                  className={`group relative flex items-center justify-between p-2 rounded-lg border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                    isActive
                      ? "border-sky-500 bg-sky-500/[0.08] text-white font-bold shadow-md shadow-sky-500/10"
                      : "border-slate-800 bg-slate-950/30 text-slate-400 hover:text-slate-100 hover:border-slate-700 hover:bg-slate-950/70"
                  }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-sky-450 transition-transform duration-200 ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`} />
                  <div className="flex items-center gap-2.5 relative z-10 pl-1.5">
                    <div className={`p-1 rounded-md border transition-all ${isActive ? "bg-sky-500/10 border-sky-400 text-sky-400" : "bg-slate-950 border-slate-800 text-slate-500 group-hover:text-slate-300"}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-xs">{tab.label}</h4>
                      <p className="font-mono text-[9px] text-slate-500 group-hover:text-slate-400 truncate max-w-[270px]">{tab.sub}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-700 font-extrabold pr-2">{tab.num}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Redesigned interactive "Coding" tab */}
      {activeGuideTab === "coding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="coding-edu-tab">
          {/* Sub tabs on left */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-805 bg-slate-950 p-5 space-y-4">
              <span className="font-mono text-[8px] uppercase tracking-wider text-sky-400 font-extrabold">Lab Session 01</span>
              <div>
                <h3 className="font-sans font-extrabold text-slate-205 text-md uppercase tracking-tight">Code Learning Sandbox</h3>
                <p className="font-sans text-xs text-slate-400 leading-normal mt-1">
                  Robots need code instructions to function. Choose a concept below to test how it controls a physical chip:
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-900">
                {([
                  { id: "variables", label: "Variables & Storage", desc: "How programs save sensor values in memory", flagColor: "border-indigo-500" },
                  { id: "conditions", label: "If / Else Decisions", desc: "Choose what the robot does based on sensor readings", flagColor: "border-sky-500" },
                  { id: "loops", label: "The Continuous Loop", desc: "How robots read inputs and update outputs over and over again", flagColor: "border-emerald-500" }
                ] as const).map((sub) => {
                  const isCur = activeCodingSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveCodingSubTab(sub.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCur 
                          ? "border-sky-550 bg-sky-500/[0.04] ring-1 ring-sky-500/20" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/45"
                      }`}
                    >
                      <h4 className="font-sans font-extrabold text-slate-200 text-xs">{sub.label}</h4>
                      <p className="font-sans text-[10px] text-slate-500 mt-0.5 leading-tight">{sub.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Microcontroller Memory Chest visualization */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/40 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-mono text-[9.5px] font-bold text-slate-405 uppercase tracking-wider">RAM Memory Bank Status</span>
              </div>
              <p className="font-sans text-[11px] text-slate-400 leading-normal">
                See how the processor stores your sandbox values in raw storage registers:
              </p>
              <div className="space-y-2 pt-2.5 font-mono text-[10px]">
                <div className="p-2 bg-slate-900/40 border border-slate-850 rounded-lg flex items-center justify-between">
                  <span className="text-indigo-400">register_0x08 [int distance]</span>
                  <span className="text-white font-bold bg-[#030712] border border-slate-8a px-2 py-0.5 rounded shadow-inner">
                    {userDistance} cm
                  </span>
                </div>
                <div className="p-2 bg-slate-900/40 border border-slate-850 rounded-lg flex items-center justify-between">
                  <span className="text-sky-400">register_0x09 [bool obstacle]</span>
                  <span className={`px-2 py-0.5 rounded font-bold border transition-colors ${userDistance < 20 ? "text-rose-400 bg-rose-955/20 border-rose-900" : "text-emerald-400 bg-emerald-950/20 border-emerald-900"}`}>
                    {userDistance < 20 ? "TRUE" : "FALSE"}
                  </span>
                </div>
                <div className="p-2 bg-slate-905/40 border border-slate-855 rounded-lg flex items-center justify-between">
                  <span className="text-emerald-400">register_0x1A [bool isMotionOccurring]</span>
                  <span className={`px-2 py-0.5 rounded font-bold border transition-colors ${isMotionTriggered ? "text-emerald-400 bg-emerald-950/20 border-emerald-950" : "text-slate-500 bg-slate-950 border-slate-850"}`}>
                    {isMotionTriggered ? "TRUE" : "FALSE"}
                  </span>
                </div>
                <div className="p-2 bg-slate-905/40 border border-slate-855 rounded-lg flex items-center justify-between">
                  <span className="text-amber-500 font-bold">register_0x1B [int photoResistor]</span>
                  <span className="text-white font-bold bg-[#030712] border border-slate-8a px-2 py-0.5 rounded shadow-inner">
                    {lightRawADC} / 1023
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive display and simulation deck on right */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 flex-1">
              
              {/* Sandbox Tab Content */}
              <AnimatePresence mode="wait">
                {activeCodingSubTab === "variables" && (
                  <motion.div
                    key="variables"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          1️⃣ Variable Declarations
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Variables serve as physical memory folders. Drag controls to watch cache registers scale:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-indigo-505/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded font-extrabold uppercase">
                        RAM STACK LOGIC
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Interactive Simulators */}
                      <div className="space-y-4 bg-slate-900/20 p-4 rounded-xl border border-slate-900">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Physical Variable Knobs:</span>
                        
                        {/* 1. Distance sensor analog slider */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-305 font-sans font-bold">A. Adjust Ultrasonic Probe:</span>
                            <span className="font-mono text-[#38bdf8] font-black">{userDistance} cm</span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            value={userDistance}
                            onChange={(e) => setUserDistance(parseInt(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer"
                          />
                          <p className="font-sans text-[10px] text-slate-550">Compiles directly into: <code className="text-[#38bdf8] font-mono">int distance = {userDistance};</code></p>
                        </div>

                        {/* 2. Motion sensor toggle Switch */}
                        <div className="space-y-2 pt-3 border-t border-slate-900/60">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-305 font-sans font-bold">B. Trigger Passive Infrared (PIR):</span>
                            <button
                              onClick={() => setIsMotionTriggered(!isMotionTriggered)}
                              className={`px-3 py-1 rounded-md font-mono font-bold text-[10px] border cursor-pointer select-none transition-all ${
                                isMotionTriggered 
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" 
                                  : "bg-slate-950 text-slate-500 border-slate-800"
                              }`}
                            >
                              {isMotionTriggered ? "SIGNAL HIGH (1)" : "SIGNAL LOW (0)"}
                            </button>
                          </div>
                          <p className="font-sans text-[10px] text-slate-550">Compiles directly into: <code className="text-emerald-400 font-mono">bool isMotion = {isMotionTriggered ? "true" : "false"};</code></p>
                        </div>
                      </div>

                      {/* Right: Live code output highlighted */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Firmware Code Output:</span>
                        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-900 font-mono text-[10.5px] leading-relaxed relative min-h-[160px] flex flex-col justify-between">
                          <div className="space-y-1 text-slate-400">
                            <span className="text-slate-600 block">// Pre-allocates memory slots for active nodes</span>
                            <p><span className="text-[#f43f5e]">int</span> ultrasonicPin = <span className="text-indigo-400">3</span>;</p>
                            <p><span className="text-[#f43f5e]">int</span> speedLimit = <span className="text-indigo-400">80</span>;</p>
                            <p className="text-indigo-305 transition-colors duration-150 relative bg-indigo-500/5 px-1 rounded">
                              <span className="text-[#f43f5e]">int</span> distance = <span className="text-sky-400 font-extrabold">{userDistance}</span>; <span className="text-slate-655 text-[9.5px]">// updated in RAM</span>
                            </p>
                            <p className="text-emerald-305 transition-colors duration-150 relative bg-emerald-500/5 px-1 rounded mt-1">
                              <span className="text-[#f43f5e]">bool</span> isMotion = <span className="text-emerald-400 font-extrabold">{isMotionTriggered ? "true" : "false"}</span>;
                            </p>
                          </div>
                          <div className="border-t border-slate-900/60 pt-2 flex items-center gap-1.5 text-[9.5px] text-indigo-400 font-mono">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>Integers cache complete numbers. Booleans store single bit states (0 / 1).</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCodingSubTab === "conditions" && (
                  <motion.div
                    key="conditions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          2️⃣ Conditional logic branches (if / else)
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Checks physical thresholds and triggers separate execution paths:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-sky-505/10 text-sky-400 border border-sky-505/25 px-2 py-0.5 rounded font-extrabold uppercase">
                        LOGIC BRANCHING
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left side: Interactive ambient light sensor */}
                      <div className="space-y-3 bg-slate-900/20 p-4 rounded-xl border border-slate-900">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Sensed LUX conditions slider:</span>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-305 font-sans font-bold">Photoresistor Ambient Light:</span>
                            <span className="font-mono font-extrabold text-[#38bdf8]">{lightRawADC} Lux (ADC)</span>
                          </div>
                          <input 
                            type="range" 
                            min="100" 
                            max="950" 
                            value={lightRawADC}
                            onChange={(e) => setLightRawADC(parseInt(e.target.value))}
                            className="w-full accent-indigo-550 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>0 Lux (TROPIC DARK)</span>
                            <span>1000 Lux (BRIGHT LIGHT)</span>
                          </div>
                        </div>

                        {/* Interactive tube graphic showing chosen path direction */}
                        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-900 text-center space-y-2">
                          <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase">Logical Signal Splitter Routing:</span>
                          <div className="flex items-center justify-around gap-2 text-[10.5px]">
                            <div className={`p-2 rounded-lg border transition-all ${lightRawADC < 400 ? "bg-amber-950/20 border-amber-500 text-amber-400 scale-105 shadow-[0_0_8px_rgba(245,158,11,0.2)]" : "border-slate-850 opacity-30 text-slate-600"}`}>
                              <div>DARKNESS BRANCH</div>
                              <span className="font-mono text-[9px] px-1 bg-amber-500/10 rounded font-bold block mt-1">LIGHT HIGH</span>
                            </div>
                            <div className="text-slate-700 font-extrabold font-mono">&lt; 400 ?</div>
                            <div className={`p-2 rounded-lg border transition-all ${lightRawADC >= 400 ? "bg-slate-900 border-indigo-400 text-indigo-400 scale-105" : "border-slate-850 opacity-30 text-slate-600"}`}>
                              <div>DAYTIME STANDBY</div>
                              <span className="font-mono text-[9px] px-1 bg-slate-800 rounded font-bold block mt-1">LIGHT LOW</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Highlighted C++ Code based on slider */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Highlighting running loop branches:</span>
                        <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 font-mono text-[10.5px] leading-relaxed">
                          <div className="space-y-0.5">
                            <p className="text-slate-555">// Runs threshold checks to set output relays</p>
                            <p className="text-slate-200">
                              <span className="text-[#f43f5e] font-bold">if</span> (ambientLight &lt; <span className="text-indigo-400 font-bold">400</span>) &#123;
                            </p>
                            <p className={`pl-4 py-0.5 transition-all rounded ${lightRawADC < 400 ? "bg-amber-500/15 text-amber-300 font-bold shadow-[inset_2px_0_0_#f59e0b]" : "text-slate-600 opacity-40"}`}>
                              digitalWrite(streetlampLED, HIGH); <span className="text-[9px] font-sans italic">// lamp ON</span>
                            </p>
                            <p className="text-slate-200">&#125; <span className="text-[#f43f5e] font-bold">else</span> &#123;</p>
                            <p className={`pl-4 py-0.5 transition-all rounded ${lightRawADC >= 400 ? "bg-indigo-500/15 text-indigo-300 font-bold shadow-[inset_2px_0_0_#6366f1]" : "text-slate-600 opacity-40"}`}>
                              digitalWrite(streetlampLED, LOW); <span className="text-[9px] font-sans italic">// lamp STANDBY</span>
                            </p>
                            <p className="text-slate-200">&#125;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCodingSubTab === "loops" && (
                  <motion.div
                    key="loops"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          3️⃣ The Infinite execution void loop()
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Fires continuous scans to update hardware positions. Change CPU clock frequencies below:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-emerald-505/10 text-emerald-450 border border-emerald-505/25 px-2 py-0.5 rounded font-extrabold uppercase">
                        REAL-TIME COMPILING
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Interactive loop orb speed selector */}
                      <div className="space-y-3 bg-slate-900/10 p-4 rounded-xl border border-slate-900">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Execution Loop speed dials:</span>
                        
                        <div className="flex gap-1.5">
                          {["Slow (0.3 Hz)", "Moderate (1.0 Hz)", "Fast (5.5 Hz)"].map((label, idx) => (
                            <button
                              key={idx}
                              onClick={() => setLoopFrequencySelected(idx)}
                              className={`flex-1 font-mono text-[9.5px] py-1.5 px-2.5 rounded-md border transition-all cursor-pointer select-none text-center font-bold ${
                                loopFrequencySelected === idx
                                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                                  : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Interactive Neon Looping Track Graphic */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-[#1e293b] flex flex-col items-center justify-center space-y-3 relative min-h-[170px]">
                          <span className="font-mono text-[8px] text-slate-500 tracking-widest block uppercase">CPU instruction cycle orbital:</span>
                          
                          {/* Circular Orbit Ring with rotating light point */}
                          <div className="relative w-24 h-24 rounded-full border border-slate-800 flex items-center justify-center">
                            <div className="absolute inset-2 rounded-full border border-slate-900 bg-slate-950 flex flex-col items-center justify-center p-1 text-center">
                              <span className="font-mono text-[9px] text-[#10b981] uppercase font-black tracking-widest animate-pulse">
                                STEP {loopPlayCycle + 1}
                              </span>
                            </div>

                            {/* Orbiting particle */}
                            <motion.div
                              className="absolute w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: [3, 1, 0.18][loopFrequencySelected],
                                ease: "linear"
                              }}
                              style={{
                                transformOrigin: "center center",
                                left: "calc(50% - 6px)",
                                top: "0px",
                                marginTop: "-6px"
                              }}
                            />
                          </div>

                          <span className="text-[10px] font-sans text-slate-400 text-center italic leading-tight">
                            {([
                              "1. Sensor pins triggered to read inputs",
                              "2. Internal variables computed & calculated",
                              "3. Compare limits to take path branches",
                              "4. Pulse continuous high/low output pins"
                            ])[loopPlayCycle]}
                          </span>
                        </div>
                      </div>

                      {/* Right: Loop C++ code template */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Infinite sequence loop blocks:</span>
                        <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 font-mono text-[10.5px] leading-relaxed relative">
                          <div className="space-y-0.5">
                            <p className="text-[#a855f7]"><span className="text-[#f43f5e] font-bold">void</span> <span className="text-white font-bold">loop</span>() &#123;</p>
                            <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 0 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                              <span className="text-[#f43f5e]">int</span> r = analogRead(A0); <span className="text-[9.5px] font-sans opacity-60">// STEP 1</span>
                            </p>
                            <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 1 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                              <span className="text-[#f43f5e]">float</span> val = r * <span className="text-indigo-400">0.12</span>; <span className="text-[9.5px] font-sans opacity-60">// STEP 2</span>
                            </p>
                            <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 2 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                              checkThresholdFlags(val); <span className="text-[9.5px] font-sans opacity-60">// STEP 3</span>
                            </p>
                            <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 3 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                              digitalWrite(motor, HIGH); <span className="text-[9.5px] font-sans opacity-60">// STEP 4</span>
                            </p>
                            <p className="pl-4 text-slate-600">delay(<span className="text-indigo-400 font-bold">{[2800, 1000, 180][loopFrequencySelected]}</span>); <span className="text-[9.5px] font-sans opacity-60">// Scan clock interval</span></p>
                            <p className="text-[#a855f7]">&#125;</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      )}

      {/* Guide Flowchart Section */}
      {activeGuideTab === "flowchart" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="flowchart-guide-section">
          {/* Legend and Flowchart Symbols Description */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <h3 className="font-sans font-extrabold text-[#f1f5f9] text-[13.5px] uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" /> Flowchart Glossary
              </h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                Before writing firmware lines, logic engineers sketch an execution sequence. Click on any symbol below to reveal how it coordinates with your robotics script:
              </p>

              <div className="space-y-2">
                {([
                  { 
                    id: "circle", 
                    name: "Start / End Shape", 
                    shape: "Circle (Rounded)", 
                    indicator: <div className="w-4 h-4 rounded-full border border-amber-500 bg-amber-505/10 shrink-0 animate-pulse" />, 
                    desc: "Specifies initialization of program memory boot cycle or structural cessation.",
                    code: "Called only once at system bootup.\nvoid setup() {\n  initSensors();\n}"
                  },
                  { 
                    id: "parallelogram", 
                    name: "Input / Output Shape", 
                    shape: "Parallelogram", 
                    indicator: <div className="w-4 h-3.5 border border-pink-550 bg-pink-500/10 -skew-x-12 shrink-0 animate-pulse" />, 
                    desc: "Reads digital/analog inputs from physical pins or writes commands directly to active components.",
                    code: "digitalRead(triggerPin);\nanalogWrite(motorPin, 180);"
                  },
                  { 
                    id: "rectangle", 
                    name: "Process Shape", 
                    shape: "Rectangle", 
                    desc: "Calculates metric math, coordinates variables updates, scales levels, or triggers timers.",
                    indicator: <div className="w-4 h-3 border border-purple-500 bg-purple-500/10 rounded shrink-0 animate-pulse" />,
                    code: "float distanceCm = pulseDuration * 0.034 / 2.0;\ndelay(1000);"
                  },
                  { 
                    id: "diamond", 
                    name: "Decision Fork Shape", 
                    shape: "Diamond", 
                    indicator: <div className="w-3.5 h-3.5 border border-yellow-500 bg-yellow-500/10 rotate-45 shrink-0 animate-pulse" />,
                    desc: "Checks boolean comparisons. Splits flow of direction based on True / False outputs.",
                    code: "if (sensorVal < threshold) {\n  triggerAlarm();\n} else {\n  standbyState();\n}"
                  },
                  { 
                    id: "arrow", 
                    name: "Direction Pathway", 
                    shape: "Direction Arrow", 
                    indicator: <div className="w-4 h-4 flex items-center justify-center shrink-0"><ArrowRight className="w-3.5 h-3.5 text-sky-400 animate-ping" /></div>, 
                    desc: "Instructs program register sequence tracking. Determines the exact chronological direction of execution.",
                    code: "Proceed sequentially downward to next logic clock pointer."
                  }
                ]).map((block) => {
                  const isFocused = selectedShape === block.id;
                  return (
                    <button
                      key={block.id}
                      onClick={() => setSelectedShape(block.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isFocused 
                          ? "border-sky-505 bg-sky-550/[0.04] ring-1 ring-sky-500/40" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {block.indicator}
                        <div>
                          <h4 className="font-sans font-bold text-slate-205 text-xs">{block.name}</h4>
                          <span className="font-mono text-[9px] text-[#38bdf8] uppercase">{block.shape}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isFocused ? "rotate-90 text-sky-400" : ""}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Glossary active information display card */}
            <AnimatePresence mode="wait">
              {selectedShape && (
                <motion.div
                  key={selectedShape}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-sky-900/30 bg-slate-950 p-5 space-y-3"
                >
                  {selectedShape === "circle" && (
                    <>
                      <h4 className="font-sans font-extrabold text-sm text-sky-450 uppercase tracking-wider">Start/End logic guide</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Every system flow requires a clear initiator block. In standard robotics code, the **Start** correlates with starting the power rails, loading peripheral registers, and specifying input/output pin modes.
                      </p>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="font-mono text-[9px] text-slate-555 uppercase font-bold block mb-1">C++ Firmware Equivalent</span>
                        <pre className="font-mono text-[10px] text-emerald-450 leading-normal overflow-x-auto whitespace-pre">
{`void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}`}
                        </pre>
                      </div>
                    </>
                  )}

                  {selectedShape === "parallelogram" && (
                    <>
                      <h4 className="font-sans font-extrabold text-sm text-pink-405 uppercase tracking-wider">Input / Output logic guide</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Denotes data interactions. An **Input** reads raw parameters from physical pins (such as distance or pressure intensity). An **Output** changes component states by writing logical High/Low signals.
                      </p>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="font-mono text-[9px] text-slate-555 uppercase font-bold block mb-1">C++ Firmware Equivalent</span>
                        <pre className="font-mono text-[10px] text-pink-305 leading-normal overflow-x-auto whitespace-pre">
{`// INPUT
int dryRaw = analogRead(A0);

// OUTPUT
digitalWrite(pistonPin, HIGH);`}
                        </pre>
                      </div>
                    </>
                  )}

                  {selectedShape === "rectangle" && (
                    <>
                      <h4 className="font-sans font-extrabold text-sm text-purple-400 uppercase tracking-wider">Computation process guide</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Processes represent raw operational work. Use them to write arithmetic equations, calculate speed loops, scale sensor voltages, or wait for time delays.
                      </p>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="font-mono text-[9px] text-slate-500 uppercase font-bold block mb-1">C++ Firmware Equivalent</span>
                        <pre className="font-mono text-[10px] text-purple-305 leading-normal overflow-x-auto whitespace-pre">
{`float dist = (pulseMs * 0.0343) / 2.0;
delay(250); // Pause execution`}
                        </pre>
                      </div>
                    </>
                  )}

                  {selectedShape === "diamond" && (
                    <>
                      <h4 className="font-sans font-extrabold text-sm text-yellow-505 uppercase tracking-wider">Decision forks guide</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Splits flowchart into parallel executions. Compares values against conditional limits. Branching pathways must always be clearly labeled **YES (True)** or **NO (False)**.
                      </p>
                      <div className="rounded-lg bg-slate-905 p-2.5 border border-slate-800">
                        <span className="font-mono text-[9px] text-slate-500 uppercase font-bold block mb-1">C++ Firmware Equivalent</span>
                        <pre className="font-mono text-[10px] text-yellow-305 leading-normal overflow-x-auto whitespace-pre">
{`if (distance <= 15.0) {
  // Take YES branch
  turnChassisMotors();
} else {
  // Take NO branch
  driveSmoothForward();
}`}
                        </pre>
                      </div>
                    </>
                  )}

                  {selectedShape === "arrow" && (
                    <>
                      <h4 className="font-sans font-extrabold text-sm text-[#38bdf8] uppercase tracking-wider">Flow Arrows Direction</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Arrows establish structural causality. They link execution nodes to guarantee that execution steps proceed. Always keep arrows pointing in clear directions with no intersection overlapping.
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Flowchart Case Study Showcase Viewer */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div>
                  <h3 className="font-sans font-extrabold text-slate-200 text-sm uppercase tracking-wide">
                    Flowchart Interactive Pathing Guide
                  </h3>
                  <p className="font-sans text-[11px] text-slate-505">Pick an engineering system. An active signal pulse particle will walk the steps:</p>
                </div>
                {/* Cases toggle */}
                <div className="flex flex-wrap gap-1">
                  {CASE_STUDIES.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCaseIdx(i); setActiveFlowStep(0); }}
                      className={`font-mono text-[9.5px] px-2.5 py-1 rounded-md transition-all cursor-pointer border ${
                        selectedCaseIdx === i
                          ? "bg-slate-900 border-indigo-500 text-indigo-400 font-extrabold"
                          : "border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Case Study {i + 1}: {c.id === "obstacle_avoidance" ? "Rover Avoid" : c.id === "smart_watering" ? "Irrigator" : "Sound Lock"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail section */}
              <div className="bg-[#030712] p-4 rounded-xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1 max-w-lg">
                  <h4 className="font-sans text-sm font-extrabold text-indigo-400 uppercase tracking-wide">{activeCase.title}</h4>
                  <span className="font-mono text-[9px] text-slate-500 block uppercase font-bold">{activeCase.subtitle}</span>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed pt-1">{activeCase.explanation}</p>
                </div>
                {/* Block badges linked for verification */}
                <div className="flex flex-col gap-1 pr-1 border-l border-slate-900/60 pl-3 shrink-0 text-left">
                  <span className="font-mono text-[9px] uppercase text-indigo-400/90 font-extrabold tracking-wider">SYSTEM REGISTRY MAP:</span>
                  <span className="text-[10.5px] font-sans text-slate-300">[IN] Sensor: <strong className="font-bold text-sky-400">{SENSOR_OPTIONS.find(s => s.id === activeCase.sensor)?.name || "Soil Resistivity"}</strong></span>
                  <span className="text-[10.5px] font-sans text-slate-300">[CPU] Brain: <strong className="font-bold text-indigo-400">{CONTROLLER_OPTIONS.find(c => c.id === activeCase.controller)?.name || "ESP32 Core"}</strong></span>
                  <span className="text-[10.5px] font-sans text-slate-300">[OUT] Actuator: <strong className="font-bold text-emerald-400">{ACTUATOR_OPTIONS.find(a => a.id === activeCase.actuator)?.name || "Servo joint"}</strong></span>
                </div>
              </div>

              {/* Render Flowchart SVG with LIVE ANIMATED HIGHLIGHTS and walking pointer */}
              <div className="bg-[#020617] p-4 rounded-xl border border-slate-900 flex justify-center items-center overflow-x-auto min-h-[420px]" id="interactive-svg-flowchart">
                <svg viewBox="0 0 340 400" className="w-full max-w-lg h-auto select-none font-mono text-[9.5px]">
                  {/* Arrow Marker Definitions */}
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6366f1" />
                    </marker>
                    {/* Glowing highlight filters for current active step */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Flow Lines */}
                  {activeCase.flowArrows.map((arrow, idx) => {
                    const fromNode = activeCase.flowSteps[arrow.from];
                    const toNode = activeCase.flowSteps[arrow.to];
                    
                    let startX = fromNode.x + fromNode.width / 2;
                    let startY = fromNode.y + fromNode.height;
                    let endX = toNode.x + toNode.width / 2;
                    let endY = toNode.y;

                    if (arrow.direction === "left") {
                      startX = fromNode.x;
                      startY = fromNode.y + fromNode.height / 2;
                      endX = toNode.x + toNode.width / 2;
                      endY = toNode.y;
                    } else if (arrow.direction === "right") {
                      startX = fromNode.x + fromNode.width;
                      startY = fromNode.y + fromNode.height / 2;
                      endX = toNode.x + toNode.width / 2;
                      endY = toNode.y;
                    }

                    // Draw line paths
                    let dPath = `M ${startX} ${startY} L ${endX} ${endY}`;
                    if (arrow.direction === "left" || arrow.direction === "right") {
                      dPath = `M ${startX} ${startY} H ${endX} V ${endY}`;
                    }

                    const isLineActiveConnection = activeFlowStep === arrow.to;

                    return (
                      <g key={idx}>
                        <path
                          d={dPath}
                          fill="none"
                          stroke={isLineActiveConnection ? "#38bdf8" : "#334155"}
                          strokeWidth={isLineActiveConnection ? "2.5" : "1.5"}
                          strokeDasharray={isLineActiveConnection ? "none" : "3 2"}
                          markerEnd="url(#arrow)"
                          className="transition-all duration-500"
                        />
                        {arrow.label && (
                          <text
                            x={arrow.direction === "left" ? startX - 22 : startX + 22}
                            y={startY + 15}
                            textAnchor="middle"
                            className={`font-extrabold text-[8.5px] font-mono ${arrow.label === "YES" ? "fill-emerald-400" : "fill-rose-400"}`}
                          >
                            {arrow.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Flow Shapes rendering */}
                  {activeCase.flowSteps.map((step, idx) => {
                    const isStepCurrentlyWalkingActive = activeFlowStep === idx;
                    let shapeNode = null;

                    const activeBorderColorClass = isStepCurrentlyWalkingActive
                      ? "stroke-sky-400 fill-[#0c1e3d]"
                      : "stroke-slate-700 fill-[#030712]";

                    if (step.shape === "circle") {
                      shapeNode = (
                        <rect
                          x={step.x}
                          y={step.y}
                          width={step.width}
                          height={step.height}
                          rx={step.height / 2}
                          className={`${isStepCurrentlyWalkingActive ? "stroke-amber-400 fill-amber-950/20 shadow-lg" : "stroke-slate-700 fill-[#030712]"} transition-all duration-350`}
                          strokeWidth={isStepCurrentlyWalkingActive ? "3.5" : "1.5"}
                          filter={isStepCurrentlyWalkingActive ? "url(#glow)" : ""}
                        />
                      );
                    } else if (step.shape === "parallelogram") {
                      const offset = 12;
                      const points = `
                        ${step.x + offset},${step.y} 
                        ${step.x + step.width},${step.y} 
                        ${step.x + step.width - offset},${step.y + step.height} 
                        ${step.x},${step.y + step.height}
                      `;
                      shapeNode = (
                        <polygon
                          points={points}
                          className={`${isStepCurrentlyWalkingActive ? "stroke-pink-400 fill-pink-950/20 shadow-lg" : "stroke-slate-700 fill-[#030712]"} transition-all duration-350`}
                          strokeWidth={isStepCurrentlyWalkingActive ? "3.5" : "1.5"}
                          filter={isStepCurrentlyWalkingActive ? "url(#glow)" : ""}
                        />
                      );
                    } else if (step.shape === "rectangle") {
                      shapeNode = (
                        <rect
                          x={step.x}
                          y={step.y}
                          width={step.width}
                          height={step.height}
                          rx="6"
                          className={`${isStepCurrentlyWalkingActive ? "stroke-purple-400 fill-purple-950/20 shadow-lg" : "stroke-slate-700 fill-[#030712]"} transition-all duration-350`}
                          strokeWidth={isStepCurrentlyWalkingActive ? "3.5" : "1.5"}
                          filter={isStepCurrentlyWalkingActive ? "url(#glow)" : ""}
                        />
                      );
                    } else if (step.shape === "diamond") {
                      const points = `
                        ${step.x + step.width / 2},${step.y} 
                        ${step.x + step.width},${step.y + step.height / 2} 
                        ${step.x + step.width / 2},${step.y + step.height} 
                        ${step.x},${step.y + step.height / 2}
                      `;
                      shapeNode = (
                        <polygon
                          points={points}
                          className={`${isStepCurrentlyWalkingActive ? "stroke-yellow-400 fill-yellow-950/20 shadow-lg" : "stroke-slate-700 fill-[#030712]"} transition-all duration-350`}
                          strokeWidth={isStepCurrentlyWalkingActive ? "3.5" : "1.5"}
                          filter={isStepCurrentlyWalkingActive ? "url(#glow)" : ""}
                        />
                      );
                    }

                    return (
                      <g key={idx}>
                        {shapeNode}
                        <text
                          x={step.x + step.width / 2}
                          y={step.y + step.height / 2 + 2}
                          textAnchor="middle"
                          className={`font-mono text-[9px] font-bold tracking-tight uppercase transition-all ${isStepCurrentlyWalkingActive ? "fill-white text-shadow" : "fill-slate-400"}`}
                        >
                          {step.label}
                        </text>
                        <text
                          x={step.x + step.width / 2}
                          y={step.y + step.height / 2 + 11}
                          textAnchor="middle"
                          className={`font-sans text-[8px] opacity-75 transition-all ${isStepCurrentlyWalkingActive ? "fill-sky-305 font-bold" : "fill-slate-500"}`}
                        >
                          {step.subtext}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Instructions on how to parse flowchart */}
              <div className="p-3.5 bg-[#030712] border border-slate-900 rounded-xl flex items-center gap-3.5">
                <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-sky-400" />
                </div>
                <p className="font-sans text-xs text-slate-400 leading-normal">
                  <strong className="text-white">Active Signal Walk-through Guide:</strong> The highlight cycles automatically through execution pathways. Notice how Decision check results split instructions between different input-output actions!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Electronics Section */}
      {activeGuideTab === "electronics" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="electronics-guide-section">
          {/* Menu controllers on left */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <span className="font-mono text-[8px] uppercase tracking-wider text-emerald-400 font-extrabold font-black">Lab Session 03</span>
              <div>
                <h3 className="font-sans font-extrabold text-slate-100 text-md uppercase tracking-tight">Vitals & Schematics</h3>
                <p className="font-sans text-xs text-slate-400 leading-normal mt-1">
                  Physical robots require solid electricity loops. Select an electronic engineering workshop station below:
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-900">
                {([
                  { id: "ohms", label: "Ohm's Law (V = I * R)", desc: "Interact with Voltage, Resistance, and Amperage limits", icon: Sliders },
                  { id: "circuits", label: "Circuits (Series vs Parallel)", desc: "Build connections and break wire routes to see behaviors", icon: Layers }
                ] as const).map((sub) => {
                  const isCur = activeElectSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveElectSubTab(sub.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-center ${
                        isCur 
                          ? "border-emerald-500 bg-emerald-500/[0.04] ring-1 ring-emerald-500/20" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/40"
                      }`}
                    >
                      <sub.icon className={`w-4 h-4 shrink-0 ${isCur ? "text-emerald-400" : "text-slate-500"}`} />
                      <div>
                        <h4 className="font-sans font-extrabold text-slate-200 text-xs">{sub.label}</h4>
                        <p className="font-sans text-[10px] text-slate-550 leading-tight">{sub.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick specifications display helper */}
            <div className="p-4 bg-slate-950 border border-slate-805 rounded-2xl space-y-2 text-xs">
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Physical Hardware Safety limits:</span>
              <ul className="space-y-1.5 font-sans text-slate-400 text-[11px]">
                <li>• <strong className="text-white">Arduino continuous pin ceiling:</strong> 40.0 mA</li>
                <li>• <strong className="text-white">ESP32 pin continuous ceiling:</strong> 12.0 mA</li>
                <li>• <strong className="text-white">Absolute short circuit margin:</strong> 250+ mA (causes instant processor restart or permanent fuse damage!)</li>
              </ul>
            </div>
          </div>

          {/* Core interactive animations panel on right */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 flex-1">
              
              <AnimatePresence mode="wait">
                {activeElectSubTab === "ohms" && (
                  <motion.div
                    key="ohms"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          📈 Ohm's Law interactive workshop
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Vary Voltage (push strength) and Resistance (friction) to control current electron flow rates:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-emerald-505/10 text-emerald-400 border border-emerald-505/25 px-2 py-0.5 rounded font-extrabold uppercase">
                        V = I * R
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left sliders */}
                      <div className="space-y-4 bg-slate-900/10 p-4 rounded-xl border border-slate-900">
                        {/* 1. Voltage slider */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-sans">
                            <span className="text-slate-300 font-bold">1. Input Voltage (Volts):</span>
                            <span className="font-mono text-indigo-400 font-extrabold">{ohmsVoltage.toFixed(1)} V</span>
                          </div>
                          <input 
                            type="range" 
                            min="1.0" 
                            max="12.0" 
                            step="0.5"
                            value={ohmsVoltage}
                            onChange={(e) => setOhmsVoltage(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer"
                          />
                        </div>

                        {/* 2. Resistance slider */}
                        <div className="space-y-1.5 pt-3 border-t border-slate-900/60">
                          <div className="flex justify-between text-xs font-sans">
                            <span className="text-slate-300 font-bold">2. Pathway Resistance (Ohms):</span>
                            <span className="font-mono text-emerald-450 font-extrabold">{ohmsResistance} Ω</span>
                          </div>
                          <input 
                            type="range" 
                            min="100" 
                            max="1000" 
                            step="20"
                            value={ohmsResistance}
                            onChange={(e) => setOhmsResistance(parseInt(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                        </div>

                        {/* Output visual calculations results */}
                        <div className="p-3 rounded-lg bg-[#030712] border border-slate-90ad flex justify-between items-center text-xs">
                          <div className="space-y-0.5 pl-1.5">
                            <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase">Current formulation:</span>
                            <div className="text-slate-100 font-sans">
                              I = {ohmsVoltage}V / {ohmsResistance}Ω
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase">Resultant Current:</span>
                            <span className={`font-mono text-sm font-black transition-all ${isPinBlown ? "text-rose-400" : "text-[#10b981]"}`}>
                              {currentMilliamps.toFixed(1)} mA
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Electron loop flow path animation */}
                      <div className="space-y-2 flex flex-col justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Flowing Electron Particles Simulation:</span>
                        
                        {/* Dynamic Wire Animation Container */}
                        <div className="rounded-xl border border-slate-900 bg-[#030712] p-4 flex flex-col items-center justify-center space-y-3 min-h-[160px] relative overflow-hidden">
                             {/* Animated particle wire line loop */}
                          <svg viewBox="0 0 220 120" className="w-full h-28 overflow-visible">
                            <rect 
                              x="10" 
                              y="10" 
                              width="200" 
                              height="80" 
                              rx="10" 
                              fill="none" 
                              stroke={isPinBlown ? "#f43f5e" : "#334155"} 
                              strokeWidth={isPinBlown ? "3.5" : "2.5"} 
                              className={`transition-colors duration-200 ${isPinBlown ? "animate-pulse" : ""}`}
                            />

                            {/* Floating electron particles sliding on the wire path */}
                            {/* The animation speed is proportional to resistance values and voltage */}
                            {/* Higher current = faster slide. High resistance slow down flow */}
                            <path
                              id="wire-loop"
                              d="M 20 10 H 200 A 10 10 0 0 1 210 20 V 80 A 10 10 0 0 1 200 90 H 20 A 10 10 0 0 1 10 80 V 20 A 10 10 0 0 1 20 10 Z"
                              fill="none"
                              stroke="transparent"
                            />

                            {/* Dashed animated electrons */}
                            <path
                              d="M 20 10 H 200 A 10 10 0 0 1 210 20 V 80 A 10 10 0 0 1 200 90 H 20 A 10 10 0 0 1 10 80 V 20 A 10 10 0 0 1 20 10 Z"
                              fill="none"
                              stroke={isPinBlown ? "#e11d48" : "#22c55e"}
                              strokeWidth="3.5"
                              strokeDasharray="8 15"
                              style={{
                                animation: "dash 1s linear infinite",
                                // Compute dynamic speed based on current Amps (faster current = shorter slide duration)
                                animationDuration: `${Math.max(0.12, 1.8 / Math.max(0.12, currentAmps * 35))}s`
                              }}
                            />

                            {/* Battery representation on left wire centered at y=50 */}
                            <g>
                              {/* Battery positive cap */}
                              <rect x="7" y="31" width="6" height="3" fill="#f97316" rx="0.5" />
                              {/* Battery cell casing */}
                              <rect x="3" y="34" width="14" height="32" rx="3" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" />
                              {/* Dynamic highlight segment for positive indicator */}
                              <rect x="3.5" y="34.5" width="13" height="12" fill="#ef4444" rx="1.5" />
                              <text x="10" y="43" textAnchor="middle" className="fill-white font-sans text-[8px] font-black">+</text>
                              <text x="10" y="60" textAnchor="middle" className="fill-slate-400 font-sans text-[9px] font-black">-</text>
                              {/* Text description nestled inside circuit loop */}
                              <text x="24" y="52" textAnchor="start" className="fill-indigo-400 font-mono text-[8px] font-extrabold">{ohmsVoltage.toFixed(1)}V Battery</text>
                            </g>

                            {/* Resistor on bottom side centered at x=110, y=90 */}
                            <g>
                              {/* Ceramic resistor body */}
                              <rect x="92" y="82" width="36" height="16" rx="4" fill="#deb887" stroke="#ac783e" strokeWidth="1" />
                              {/* Color bands representing resistance value */}
                              <rect x="98.5" y="82.5" width="3.5" height="15" fill="#78350f" /> {/* Band 1: Brown (1) */}
                              <rect x="107" y="82.5" width="3.5" height="15" fill="#000000" /> {/* Band 2: Black (0) */}
                              <rect x="115.5" y="82.5" width="3.5" height="15" fill={ohmsResistance >= 500 ? "#ea580c" : "#dc2626"} /> {/* Band 3: Multiplier */}
                              <rect x="123.5" y="82.5" width="2" height="15" fill="#f59e0b" /> {/* Band 4: Gold tolerance */}
                              {/* Text label underneath */}
                              <text x="110" y="114" textAnchor="middle" className="fill-emerald-400 font-mono text-[8.5px] font-extrabold">{ohmsResistance}Ω Resistor</text>
                            </g>
                          </svg>

                          <style>{`
                            @keyframes dash {
                              to {
                                stroke-dashoffset: -46;
                              }
                            }
                          `}</style>

                          <div className="text-center font-mono text-[9px]">
                            {isPinBlown ? (
                              <div className="text-rose-400 font-extrabold animate-bounce bg-rose-955/20 border border-rose-900/50 p-1.5 rounded-lg">
                                🚨 BURNOUT WARNING! Continuous pin margin exceeded (40.0 mA). Add path resistance!
                              </div>
                            ) : (
                              <div className="text-slate-400">
                                Electron flow index: <span className="text-[#10b981] font-bold">Stable & Operational ✔</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeElectSubTab === "circuits" && (
                  <motion.div
                    key="circuits"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="border-b border-slate-905 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          🔌 Series vs Parallel Connections loops
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Click on the switch nodes to cut (break) the cables and compare current behaviors:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-sky-505/10 text-sky-400 border border-sky-505/25 px-2 py-0.5 rounded font-extrabold uppercase">
                        CIRCUIT TOPOLOGY
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Side: Series Circuit */}
                      <div className="rounded-xl border border-slate-900 bg-[#030712] p-4 flex flex-col justify-between space-y-3 relative">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-[#6366f1] font-extrabold tracking-widest uppercase">CONNECTION A: SERIES</span>
                          <span className="text-[10px] bg-slate-905 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">SINGLE PATH</span>
                        </div>
                        <p className="font-sans text-xs text-slate-405 leading-relaxed">
                          In a Series circuit, current flows step-by-step through each LED. If you break (cut) any switch node, the current becomes 0 and <strong className="text-slate-201">EVERY light goes dark instantly!</strong>
                        </p>

                        {/* Interactive Visual Wire with bulbs */}
                        <div className="py-4 px-2 bg-slate-950 rounded-xl border border-slate-900 flex flex-col items-center justify-center space-y-3 relative">
                          
                          {/* Rich Interactive SVG Series Circuit */}
                          <svg viewBox="0 0 220 110" className="w-full h-28 overflow-visible mt-2 select-none">
                            {/* main loop path wire outline */}
                            <path
                              d={isSeriesCut 
                                ? "M 15 55 V 15 H 90 M 115 15 H 205 V 85 H 15 V 55"
                                : "M 15 55 V 15 H 205 V 85 H 15 V 55"
                              }
                              fill="none"
                              stroke={isSeriesCut ? "#f43f5e" : "#334155"}
                              strokeWidth="2.5"
                              className="transition-all duration-300"
                            />

                            {/* Flowing electrons when closed */}
                            {!isSeriesCut && (
                              <rect
                                x="15"
                                y="15"
                                width="190"
                                height="70"
                                rx="3"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeDasharray="6 12"
                                style={{ animation: "dash 1.2s linear infinite" }}
                              />
                            )}

                            {/* 5V Source Battery at x=15 (Centered vertically at y=55) */}
                            <g>
                              {/* Battery cap */}
                              <rect x="12" y="44" width="6" height="2" fill="#f97316" rx="0.5" />
                              {/* Battery body */}
                              <rect x="8" y="46" width="14" height="20" rx="1.5" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" />
                              <text x="15" y="55" textAnchor="middle" className="fill-white font-sans text-[7px] font-black">+</text>
                              <text x="15" y="64" textAnchor="middle" className="fill-slate-450 font-sans text-[7px] font-black">-</text>
                              <text x="26" y="58" textAnchor="start" className="fill-indigo-400 font-mono text-[7px] font-extrabold">5V Source</text>
                            </g>

                            {/* Interactive Swivel Switch at x=90 to 115 */}
                            <g className="cursor-pointer" onClick={() => setIsSeriesCut(!isSeriesCut)}>
                              <circle cx="90" cy="15" r="2.5" fill="#94a3b8" />
                              <circle cx="115" cy="15" r="2.5" fill="#94a3b8" />
                              {isSeriesCut ? (
                                <line x1="90" y1="15" x2="108" y2="4" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                              ) : (
                                <line x1="90" y1="15" x2="115" y2="15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                              )}
                              <text x="102" y="30" textAnchor="middle" className={`font-mono text-[6.5px] font-bold ${isSeriesCut ? "fill-rose-450" : "fill-emerald-450"}`}>
                                {isSeriesCut ? "OPEN" : "CLOSED"}
                              </text>
                            </g>

                            {/* LED-01 at x=65, y=85 */}
                            <g>
                              {!isSeriesCut && (
                                <circle cx="65" cy="85" r="11" fill="rgba(245, 158, 11, 0.2)" className="animate-pulse" />
                              )}
                              <circle cx="65" cy="85" r="6.5" fill={!isSeriesCut ? "#fbbf24" : "#1e293b"} stroke={!isSeriesCut ? "#f59e0b" : "#475569"} strokeWidth="1" />
                              <text x="65" y="87" textAnchor="middle" className="font-sans text-[6.5px]">💡</text>
                              <text x="65" y="101" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">LED-1</text>
                            </g>

                            {/* LED-02 at x=145, y=85 */}
                            <g>
                              {!isSeriesCut && (
                                <circle cx="145" cy="85" r="11" fill="rgba(245, 158, 11, 0.2)" className="animate-pulse" />
                              )}
                              <circle cx="145" cy="85" r="6.5" fill={!isSeriesCut ? "#fbbf24" : "#1e293b"} stroke={!isSeriesCut ? "#f59e0b" : "#475569"} strokeWidth="1" />
                              <text x="145" y="87" textAnchor="middle" className="font-sans text-[6.5px]">💡</text>
                              <text x="145" y="101" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">LED-2</text>
                            </g>
                          </svg>

                          <div className="flex justify-around items-center w-full min-h-[40px] pt-1">
                            {/* Interconnector Wire Switch Toggle Button */}
                            <button
                              onClick={() => setIsSeriesCut(!isSeriesCut)}
                              className={`px-3 py-1 rounded-md font-mono text-[8.5px] font-bold border cursor-pointer select-none transition-all ${
                                isSeriesCut 
                                  ? "bg-slate-900 border-rose-900 text-rose-400" 
                                  : "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                              }`}
                            >
                              {isSeriesCut ? "🔓 ATTACH WIRE LINK" : "🔒 DISCONNECT WIRE"}
                            </button>
                          </div>

                          <div className="font-mono text-[9px] text-center">
                            Voltage Loop State: <span className={isSeriesCut ? "text-rose-400 font-extrabold" : "text-emerald-400 font-bold"}>{isSeriesCut ? "BROKEN CIRCUIT (0.0 V)" : "ACTIVE LOOP (5.0 V)"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Parallel Circuit */}
                      <div className="rounded-xl border border-slate-900 bg-[#030712] p-4 flex flex-col justify-between space-y-3 relative">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-[#10b981] font-extrabold tracking-widest uppercase">CONNECTION B: PARALLEL</span>
                          <span className="text-[10px] bg-slate-905 text-emerald-450 px-2 py-0.5 rounded font-mono font-bold">BRANCHED PATHS</span>
                        </div>
                        <p className="font-sans text-xs text-slate-455 leading-relaxed">
                          Parallel nodes divide the current stream across independent branches. If you break or cut Switch 1, <strong className="text-slate-100">branch 2 keeps flowing and LED-02 continues glowing!</strong>
                        </p>

                        {/* Interactive parallel schematic */}
                        <div className="py-4 px-2 bg-slate-950 rounded-xl border border-slate-900 flex flex-col items-center justify-center space-y-3 relative">
                          
                          {/* Rich Interactive SVG Parallel Circuit */}
                          <svg viewBox="0 0 220 115" className="w-full h-28 overflow-visible mt-2 select-none">
                            {/* Main background wires topology */}
                            {/* Left vertical link (x=20) with battery. Top route horizontal (y=15), bottom route (y=95) */}
                            <path
                              d="M 20 15 H 180 M 20 95 H 180 M 20 15 V 95"
                              fill="none"
                              stroke="#334155"
                              strokeWidth="2.5"
                            />

                            {/* Individual Branch Vertical Wires */}
                            <line x1="100" y1="15" x2="100" y2="95" stroke="#334155" strokeWidth="2" />
                            <line x1="170" y1="15" x2="170" y2="95" stroke="#334155" strokeWidth="2" />

                            {/* Feed electrons animation on Main Feed (if any branch is running) */}
                            {(!isParallel1Cut || !isParallel2Cut) && (
                              <g>
                                <path
                                  d={`M 20 55 V 15 H ${!isParallel2Cut ? "170" : "100"}`}
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2.5"
                                  strokeDasharray="4 8"
                                  style={{ animation: "dash 1.2s linear infinite" }}
                                />
                                <path
                                  d={`M 20 55 V 95 H ${!isParallel2Cut ? "170" : "100"}`}
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2.5"
                                  strokeDasharray="4 8"
                                  style={{ animation: "dash 1.2s linear infinite", animationDirection: "reverse" }}
                                />
                              </g>
                            )}

                            {/* Branch 1 flowing electrons animation if closed */}
                            {!isParallel1Cut && (
                              <line
                                x1="100"
                                y1="15"
                                x2="100"
                                y2="95"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeDasharray="4 8"
                                style={{ animation: "dash 1s linear infinite" }}
                              />
                            )}

                            {/* Branch 2 flowing electrons animation if closed */}
                            {!isParallel2Cut && (
                              <line
                                x1="170"
                                y1="15"
                                x2="170"
                                y2="95"
                                stroke="#10b981"
                                strokeWidth="2.5"
                                strokeDasharray="4 8"
                                style={{ animation: "dash 1s linear infinite" }}
                              />
                            )}

                            {/* 5V Source Battery at x=20 (Centered vertically at y=55) */}
                            <g>
                              {/* battery positive cap */}
                              <rect x="17" y="44" width="6" height="2" fill="#34d399" rx="0.5" />
                              <rect x="13" y="46" width="14" height="20" rx="1.5" fill="#042f1a" stroke="#10b981" strokeWidth="1" />
                              <text x="20" y="55" textAnchor="middle" className="fill-white font-sans text-[7px] font-bold">+</text>
                              <text x="20" y="64" textAnchor="middle" className="fill-slate-400 font-sans text-[7px] font-bold">-</text>
                            </g>

                            {/* Switch A on Branch 1 at x=100 (y=25 to 40) */}
                            <g className="cursor-pointer" onClick={() => setIsParallel1Cut(!isParallel1Cut)}>
                              <circle cx="100" cy="22" r="2.5" fill="#94a3b8" />
                              <circle cx="100" cy="40" r="2.5" fill="#94a3b8" />
                              {isParallel1Cut ? (
                                <line x1="100" y1="40" x2="114" y2="28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                              ) : (
                                <line x1="100" y1="22" x2="100" y2="40" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                              )}
                            </g>

                            {/* Switch B on Branch 2 at x=170 (y=25 to 40) */}
                            <g className="cursor-pointer" onClick={() => setIsParallel2Cut(!isParallel2Cut)}>
                              <circle cx="170" cy="22" r="2.5" fill="#94a3b8" />
                              <circle cx="170" cy="40" r="2.5" fill="#94a3b8" />
                              {isParallel2Cut ? (
                                <line x1="170" y1="40" x2="184" y2="28" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                              ) : (
                                <line x1="170" y1="22" x2="170" y2="40" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                              )}
                            </g>

                            {/* LED-A on Branch 1 at x=100, y=70 */}
                            <g>
                              {!isParallel1Cut && (
                                <circle cx="100" cy="70" r="11" fill="rgba(16, 185, 129, 0.2)" className="animate-pulse" />
                              )}
                              <circle cx="100" cy="70" r="6.5" fill={!isParallel1Cut ? "#34d399" : "#1e293b"} stroke={!isParallel1Cut ? "#10b981" : "#475569"} strokeWidth="1" />
                              <text x="100" y="72" textAnchor="middle" className="font-sans text-[6.5px]">💡</text>
                              <text x="108" y="72" textAnchor="start" className="fill-slate-500 font-mono text-[6px]">LED-A</text>
                            </g>

                            {/* LED-B on Branch 2 at x=170, y=70 */}
                            <g>
                              {!isParallel2Cut && (
                                <circle cx="170" cy="70" r="11" fill="rgba(16, 185, 129, 0.2)" className="animate-pulse" />
                              )}
                              <circle cx="170" cy="70" r="6.5" fill={!isParallel2Cut ? "#34d399" : "#1e293b"} stroke={!isParallel2Cut ? "#10b981" : "#475569"} strokeWidth="1" />
                              <text x="170" y="72" textAnchor="middle" className="font-sans text-[6.5px]">💡</text>
                              <text x="178" y="72" textAnchor="start" className="fill-slate-500 font-mono text-[6px]">LED-B</text>
                            </g>
                          </svg>

                          <div className="flex flex-col gap-2 w-full pt-1">
                            {/* Branch 1 toggle button */}
                            <div className="flex justify-between items-center bg-[#070b13] p-1.5 rounded-lg border border-slate-900">
                              <span className="font-mono text-[8px] text-slate-400 pl-1.5">LED-A BRANCH SOURCE:</span>
                              <button
                                onClick={() => setIsParallel1Cut(!isParallel1Cut)}
                                className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold border cursor-pointer transition-all ${
                                  isParallel1Cut 
                                    ? "bg-slate-900 border-rose-900 text-rose-400" 
                                    : "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                                }`}
                              >
                                {isParallel1Cut ? "DISCONNECTED (OPEN)" : "CONNECTED (CLOSED)"}
                              </button>
                            </div>

                            {/* Branch 2 toggle button */}
                            <div className="flex justify-between items-center bg-[#070b13] p-1.5 rounded-lg border border-slate-900">
                              <span className="font-mono text-[8px] text-slate-400 pl-1.5">LED-B BRANCH SOURCE:</span>
                              <button
                                onClick={() => setIsParallel2Cut(!isParallel2Cut)}
                                className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold border cursor-pointer transition-all ${
                                  isParallel2Cut 
                                    ? "bg-slate-900 border-rose-900 text-rose-400" 
                                    : "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                                }`}
                              >
                                {isParallel2Cut ? "DISCONNECTED (OPEN)" : "CONNECTED (CLOSED)"}
                              </button>
                            </div>
                          </div>

                          <div className="font-mono text-[8.5px] text-slate-505 text-center leading-tight pt-0.5">
                            Status: <span className="text-slate-300">Independent electricity flow branching verified.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
