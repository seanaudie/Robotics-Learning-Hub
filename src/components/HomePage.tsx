import React from 'react';
import { motion } from 'motion/react';
import PremiumLogo from './PremiumLogo';
import { 
  Activity, 
  ArrowRight, 
  Cpu, 
  Radio, 
  Layers, 
  Zap, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Code2,
  Sliders,
  Compass,
  GraduationCap,
  Cog,
  MessageSquare,
  Network,
  Bot,
  ExternalLink
} from 'lucide-react';
import { CreatorProfileCard } from './CreatorProfileCard';
import RoboticArmIcon from './RoboticArmIcon';
import AnimatedManipulatorDiagnostic from './AnimatedManipulatorDiagnostic';

export default function HomePage({ 
  onEnter,
  onOpenCreatorModal
}: { 
  onEnter: (startingTab?: string) => void;
  onOpenCreatorModal?: () => void;
}) {
  // Interactive 3D Cinematic Robotics telemetry adjustments
  const [jointAngle, setJointAngle] = React.useState(48);
  const [gripForce, setGripForce] = React.useState(35);
  const [robotExtension, setRobotExtension] = React.useState(50);
  const [telemetryOverlay, setTelemetryOverlay] = React.useState(true);
  const [simulationSpeed, setSimulationSpeed] = React.useState(1);
  const [sensorAlertActive, setSensorAlertActive] = React.useState(false);

  // Animated continuous organic wave and hover bobbing for the DEB-09 companion robot
  React.useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick += 0.08;
      setJointAngle(48 + Math.sin(tick * 1.5) * 18);
      setGripForce(35 + Math.cos(tick * 2.0) * 10);
      setRobotExtension(50 + Math.sin(tick * 1.0) * 12);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Roadmap phase configurations representing the user's interactive journey
  const [activePhaseIndex, setActivePhaseIndex] = React.useState<number | null>(null);
  const [showCreatorModal, setShowCreatorModal] = React.useState(false);
  const [showReferencesDropdown, setShowReferencesDropdown] = React.useState(false);

  const TOPIC_REFERENCES = [
    { 
      topic: "Phase 1: Sensors, Actuators & Controllers", 
      book: "Robotics: Modelling, Planning and Control",
      author: "Siciliano, Sciavicco, Villani, Oriolo",
      url: "https://openlibrary.org/books/OL22822453M/Robotics" 
    },
    { 
      topic: "Phase 2: C++ Programming", 
      book: "A Tour of C++ (3rd Edition)",
      author: "Bjarne Stroustrup",
      url: "https://openlibrary.org/books/OL25421528M/A_Tour_of_C%2B%2B" 
    },
    { 
      topic: "Phase 3: Electronics & Digital Systems", 
      book: "The Art of Electronics (3rd Edition)",
      author: "Paul Horowitz, Winfield Hill",
      url: "https://openlibrary.org/works/OL15183307W/The_art_of_electronics" 
    },
    { 
      topic: "Phase 4: Control Systems (PID)", 
      book: "Modern Control Engineering (5th Edition)",
      author: "Katsuhiko Ogata",
      url: "https://openlibrary.org/works/OL1966442W/Modern_control_engineering" 
    },
    { 
      topic: "Phase 5: Robotics Manipulators", 
      book: "Introduction to Robotics: Mechanics & Control",
      author: "John J. Craig",
      url: "https://openlibrary.org/works/OL3432049W/Introduction_to_robotics" 
    },
    { 
      topic: "Phase 6: AI Robotics System (Machine Learning)", 
      book: "Probabilistic Robotics",
      author: "Sebastian Thrun, Wolfram Burgard, Dieter Fox",
      url: "https://openlibrary.org/books/OL3419515M/Probabilistic_robotics" 
    },
    { 
      topic: "Phase 7: Types and Applications", 
      book: "Springer Handbook of Robotics",
      author: "Bruno Siciliano, Oussama Khatib",
      url: "https://link.springer.com/book/10.1007/978-3-319-32552-1" 
    }
  ];

  const roadmapPhases = [
    {
      id: "ph-1",
      phaseNum: "PHASE 01",
      name: "Robotics Foundations",
      concept: "Sensory-Processing-Motor Loops",
      subTitle: "Cybernetic Feedback Systems",
      desc: "Explore the core physical-to-computational loop. Learn how robots map environmental inputs via sensors, make logical choices using a microprocessing unit, and command feedback-based actuator movements.",
      targetTab: "foundations" as const,
      color: "sky",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/25",
      glowColor: "rgba(56, 189, 248, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(56,189,248,0.2)]",
      bgColor: "bg-sky-500/5",
      borderColor: "border-sky-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] hover:bg-sky-400/20",
      diagnosticCode: "SYS_INIT_FND_01",
      recommendedTime: "Week 1-2 Recommended",
      techSpecs: [
        { label: "CLOCK CONTROL", value: "Real-time Loop Process" },
        { label: "FEEDBACK BUS", value: "Proportional State Response" },
        { label: "CALIBRATION", value: "Signal Normalizer Active" }
      ],
      icon: <Layers className="w-6 h-6 text-sky-400" />
    },
    {
      id: "ph-2",
      phaseNum: "PHASE 02",
      name: "Robotics Programming",
      concept: "Conditional Logic & Automation",
      subTitle: "Algorithmic Control Flow & Loops",
      desc: "Master coding logic. Structure standard while-loops, define sensor threshold checkpoints, balance variables, and translate complex procedural syntax into interactive, responsive visual logic flowcharts.",
      targetTab: "programming" as const,
      color: "indigo",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-505 border-indigo-500/25",
      glowColor: "rgba(99, 102, 241, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
      bgColor: "bg-indigo-500/5",
      borderColor: "border-indigo-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] hover:bg-indigo-400/20",
      diagnosticCode: "SYS_EXEC_LOG_02",
      recommendedTime: "Week 3-4 Recommended",
      techSpecs: [
        { label: "LOGIC SOLVER", value: "Dynamic Node Graph Interpreter" },
        { label: "VARIABLES", value: "Global / Local Registry" },
        { label: "COMPILING", value: "Zero-Latency ASM Emulation" }
      ],
      icon: <Code2 className="w-6 h-6 text-indigo-400" />
    },
    {
      id: "ph-3",
      phaseNum: "PHASE 03",
      name: "Basic Electronics and Digital System",
      concept: "Circuit Physics & Ohm's Law",
      subTitle: "Electrical Diagnostics & Math",
      desc: "Analyse current flow restrictions. Trace series and parallel circuits, calculate voltage divider limits dynamically, manage resistance formulas in real-time, and compute amperage ceilings safely.",
      targetTab: "electronics" as const,
      color: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      glowColor: "rgba(16, 185, 129, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      bgColor: "bg-emerald-500/5",
      borderColor: "border-emerald-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:bg-emerald-400/20",
      diagnosticCode: "SYS_VOLT_RES_03",
      recommendedTime: "Week 5-6 Recommended",
      techSpecs: [
        { label: "OHM IMPEDANCE", value: "V = I x R Calculator Core" },
        { label: "REGULATION", value: "Short Circuit Checking Fuse" },
        { label: "SIMULATION", value: "High-Fidelity Amperage Probe" }
      ],
      icon: <Zap className="w-6 h-6 text-emerald-400" />
    },
    {
      id: "ph-4",
      phaseNum: "PHASE 04",
      name: "Control Systems",
      concept: "Feedback loops & PID regulation",
      subTitle: "Proportional State Response Regulation",
      desc: "Investigate automated regulation. Tune feedback responsiveness, control loop gains (Kp, Ki, Kd), configure steady-state targets dynamically, and observe real-time corrections.",
      targetTab: "control" as any,
      color: "amber",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
      glowColor: "rgba(245, 158, 11, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] hover:bg-amber-400/20",
      diagnosticCode: "SYS_CTRL_PID_04",
      recommendedTime: "Week 7-8 Recommended",
      techSpecs: [
        { label: "PROPORTIONAL", value: "P Gain Scaling Factor" },
        { label: "INTEGRAL", value: "Steady State Correction" },
        { label: "DERIVATIVE", value: "Damping Rate Limiter" }
      ],
      icon: <Sliders className="w-6 h-6 text-amber-400" />
    },
    {
      id: "ph-5",
      phaseNum: "PHASE 05",
      name: "Robotics Manipulators",
      concept: "Kinematics & Multi-axis Control",
      subTitle: "Planar geometry & pick-and-place",
      desc: "Explore multi-joint manipulation. Tune rotational microsecond PWM vectors, map angular joint states dynamically, and execute step-by-step path automation programs.",
      targetTab: "manipulators" as any,
      color: "sky",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/25",
      glowColor: "rgba(56, 189, 248, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(56,189,248,0.2)]",
      bgColor: "bg-sky-500/5",
      borderColor: "border-sky-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] hover:bg-sky-400/20",
      diagnosticCode: "SYS_MANP_KIN_05",
      recommendedTime: "Week 9 Recommended",
      techSpecs: [
        { label: "COORDINATOR", value: "Forward / Inverse Solver" },
        { label: "SERVO PULSE", value: "Microsecond PWM Mapping" },
        { label: "PATH PLANNING", value: "Discrete State Machine" }
      ],
      icon: <RoboticArmIcon className="w-6 h-6 text-sky-400" />
    },
    {
      id: "ph-6",
      phaseNum: "PHASE 06",
      name: "AI Robotics Systems",
      concept: "Intelligent behavior trees & AI agents",
      subTitle: "Cognitive control & decision matrices",
      desc: "Interact with advanced intelligent decision-making models. Design neural-inspired action graphs, construct robotic rule vectors, and optimize autonomous troubleshooting scripts.",
      targetTab: "ai" as any,
      color: "purple",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/25",
      glowColor: "rgba(168, 85, 247, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] hover:bg-purple-400/20",
      diagnosticCode: "SYS_COGN_AI_06",
      recommendedTime: "Week 10-11 Recommended",
      techSpecs: [
        { label: "COGNITION", value: "Interactive Brain Mesh" },
        { label: "DECISIONS", value: "Dynamic Action Decision Nodes" },
        { label: "TUNING", value: "Real-time Weight Optimization" }
      ],
      icon: <Sparkles className="w-6 h-6 text-purple-400" />
    },
    {
      id: "ph-types",
      phaseNum: "PHASE 07",
      name: "Robot Types & Applications",
      concept: "Beginner to advanced robotics taxonomy",
      subTitle: "Taxonomy, specs, component layouts & simulators",
      desc: "Explore the major branches of robots from basic line counters to drones, walking quadrupeds, humanoids, and mesh swarms. Adjust mechanics, resolve parameters, and pass alignment quizzes.",
      targetTab: "types" as any,
      color: "cyan",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
      glowColor: "rgba(34, 211, 238, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
      bgColor: "bg-cyan-500/5",
      borderColor: "border-cyan-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] hover:bg-cyan-400/20",
      diagnosticCode: "SYS_TAXONOMY_07",
      recommendedTime: "Week 11-12 Recommended",
      techSpecs: [
        { label: "BRANCHES", value: "8 Key Robotics Classes" },
        { label: "EXPERIMENT", value: "Interactive Live Kinematics" },
        { label: "CERTIFY", value: "Progress Alignment Quizzes" }
      ],
      icon: <Bot className="w-6 h-6 text-cyan-400" />
    },
    {
      id: "ph-diagnostics",
      phaseNum: "PHASE 08",
      name: "Component Diagnostics",
      concept: "Live hardware signal trace & schematics",
      subTitle: "Live interactive schematic error inspection",
      desc: "Analyze cybernetic component specifications, inspect active circuitry connections, trace hardware failures, and troubleshoot component pin layout signals.",
      targetTab: "diagnostics" as any,
      color: "emerald",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      glowColor: "rgba(16, 185, 129, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      bgColor: "bg-emerald-500/5",
      borderColor: "border-emerald-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:bg-emerald-400/20",
      diagnosticCode: "SYS_DIAG_08",
      recommendedTime: "Week 13 Recommended",
      techSpecs: [
        { label: "DIAGNOSTICS", value: "Hardware Signal Trace" },
        { label: "SCHEMATICS", value: "Interactive State Inspection" },
        { label: "VOLTAGE STATE", value: "Pin Telemetry Validation" }
      ],
      icon: <Activity className="w-6 h-6 text-emerald-400" />
    }
  ];

  const currentPhase = activePhaseIndex !== null ? roadmapPhases[activePhaseIndex] : null;

  // Arrow key navigation for Phase (stage channel) selection
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in inputs or other text fields
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase();
        if (
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          activeEl.hasAttribute("contenteditable") ||
          activeEl.classList.contains("monaco-editor")
        ) {
          return;
        }
      }

      // Ignore if a modal popup starts on screen
      const hasModalOpen = !!document.querySelector('.fixed.inset-0, [class*="fixed inset-0"], [id*="-modal"]');
      if (hasModalOpen) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActivePhaseIndex((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % roadmapPhases.length;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActivePhaseIndex((prev) => {
          if (prev === null) return roadmapPhases.length - 1;
          return (prev - 1 + roadmapPhases.length) % roadmapPhases.length;
        });
      } else if (e.key === "Enter") {
        if (activePhaseIndex !== null) {
          e.preventDefault();
          const target = roadmapPhases[activePhaseIndex];
          if (target) {
            onEnter(target.targetTab);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhaseIndex, onEnter]);

  // Render individual animated visualizer schematics for each Roadmap index
  const renderPhaseVisualizer = (idx: number) => {
    switch (idx) {
      case 0: // Robotics Foundations
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative">
            <span className="font-mono text-[7px] text-sky-500 font-extrabold pb-2 uppercase border-b border-sky-950/40 block">FEEDFORWARD SIGNAL CHAIN // CALIBRATING SYSTEM</span>
            <div className="flex-1 flex gap-2 items-center justify-between py-2">
              {/* Sensor */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col justify-center items-center text-sky-400 relative">
                  <div className="absolute inset-0 bg-sky-500/5 animate-ping rounded-xl opacity-20" />
                  <Radio className="w-5 h-5" />
                  <span className="font-mono text-[7px] font-bold mt-0.5">SENS_IN</span>
                </div>
                <span className="font-bold text-[9px] text-white">Sensor</span>
              </div>

              {/* Arrow 1 with pulse line */}
              <div className="flex-1 h-[2px] bg-sky-950 relative overflow-hidden">
                <motion.div
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
                />
              </div>

              {/* Processor */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-sky-500/50 flex flex-col justify-center items-center text-indigo-400">
                  <Cpu className="w-5 h-5 animate-pulse" />
                  <span className="font-mono text-[7px] font-bold mt-0.5">MCU_CORE</span>
                </div>
                <span className="font-bold text-[9px] text-white">Processor</span>
              </div>

              {/* Arrow 2 with pulse line */}
              <div className="flex-1 h-[2px] bg-sky-950 relative overflow-hidden">
                <motion.div
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
                  className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                />
              </div>

              {/* Actuator */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-sky-500/30 flex flex-col justify-center items-center text-teal-400 relative overflow-hidden">
                  <div className="flex items-center justify-center gap-0.5 select-none text-emerald-400">
                    <Cog className="w-4 h-4 animate-spin" style={{ animationDuration: "5s" }} />
                    <Cog className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
                  </div>
                  <span className="font-mono text-[7px] font-bold mt-0.5">MOT_ACT</span>
                </div>
                <span className="font-bold text-[9px] text-white">Actuator</span>
              </div>
            </div>
          </div>
        );
      case 1: // Programming
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative select-none">
            <span className="font-mono text-[7px] text-indigo-500 font-extrabold pb-2 uppercase border-b border-slate-900/80 block">LOOP STACK TRANSLATOR // RUNNING EXAMPLES</span>
            <div className="flex-1 grid grid-cols-12 gap-2 py-1 overflow-hidden">
              {/* Code window */}
              <div className="col-span-12 bg-slate-950 rounded-lg p-2.5 font-mono text-[8px] text-slate-400 border border-slate-900/80 overflow-y-auto leading-tight select-all text-left">
                <span className="text-violet-400">void</span> loop() {"{"}
                <div className="pl-2">
                  <span className="text-sky-400">int</span> limit = <span className="text-indigo-400">120</span>;
                  <br />
                  <span className="text-emerald-400">if</span> (readSensor() &gt; limit) {"{"}
                  <div className="pl-2 text-slate-500">
                    digitalWrite(D9, HIGH);
                    <br />
                    delay(35);
                  </div>
                  {"}"} <span className="text-emerald-400">else</span> {"{"}
                  <div className="pl-2 text-slate-500">
                    digitalWrite(D9, LOW);
                  </div>
                  {"}"}
                </div>
                {"}"}
              </div>
            </div>
            <div className="text-[7.5px] font-mono text-slate-500 mt-2 bg-slate-950 p-1.5 rounded border border-slate-900">
              LOG STATUS: <span className="text-indigo-400 font-semibold uppercase animate-pulse">FLOW_INTERPRETER_COMPILED_OK</span>
            </div>
          </div>
        );
      case 2: // Basic Electronics
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative select-none">
            <span className="font-mono text-[7px] text-emerald-400 font-extrabold pb-2 uppercase border-b border-emerald-950/40 block">OHMIC CIRCUIT SCHEMATIC // LIVE STEADY-STATE</span>
            
            <div className="flex-1 flex flex-col justify-center items-center py-1">
              {/* Dynamic circuit values summary bar */}
              <div className="grid grid-cols-3 gap-2 w-full text-center font-mono text-[8px] mb-1.5">
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-sky-500/20 text-sky-400">
                  <span className="text-slate-550 block text-[6px] uppercase">Voltage (V)</span>
                  <strong className="text-sky-400 font-black">5.0 Volts</strong>
                </div>
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-emerald-500/20 text-emerald-400">
                  <span className="text-slate-550 block text-[6px] uppercase">Resistance (R)</span>
                  <strong className="text-emerald-400 font-black">220 Ohms</strong>
                </div>
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-amber-500/20 text-amber-400">
                  <span className="text-slate-550 block text-[6px] uppercase">Current (I)</span>
                  <strong className="text-amber-400 font-black animate-pulse">22.7 mA</strong>
                </div>
              </div>

              {/* Vector circuit diagram */}
              <div className="w-full h-[75px] bg-slate-950/90 rounded-lg border border-slate-900/80 p-0.5 relative flex items-center justify-center">
                <svg className="w-full h-full text-slate-700" viewBox="0 0 280 85" fill="none" stroke="currentColor" strokeWidth="1">
                  
                  {/* Schematic Wire Tracks (Rectangle loop) */}
                  <rect x="40" y="15" width="200" height="50" rx="4" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="1.5" />
                  
                  {/* 1. Voltage Source (Battery representation on Left branch) */}
                  <g className="translate-y-0 text-sky-400">
                    <circle cx="40" cy="40" r="8" fill="#020617" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="40" y1="36" x2="40" y2="44" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="36" y1="40" x2="44" y2="40" stroke="currentColor" strokeWidth="1.2" />
                    <text x="52" y="42.5" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">5.0V DC</text>
                  </g>

                  {/* 2. Resistor component (Top center horizontal branch at y=15) */}
                  <g className="text-emerald-400">
                    <rect x="110" y="10" width="60" height="10" fill="#020617" stroke="none" />
                    <path d="M 110,15 L 115,10 L 122,20 L 129,10 L 136,20 L 143,10 L 150,20 L 157,10 L 164,20 L 170,15" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="140" y="7" fill="#34d399" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">R = 220 Ω</text>
                  </g>

                  {/* 3. Ammeter / Current Readout (Right branch at x=240) */}
                  <g className="text-amber-400">
                    <circle cx="240" cy="40" r="8" fill="#020617" stroke="currentColor" strokeWidth="1.5" />
                    <text x="240" y="43" fill="currentColor" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">A</text>
                    <text x="228" y="41.5" fill="#fbbf24" fontSize="6.5" fontFamily="monospace" textAnchor="end" fontWeight="bold">I = 22.7mA</text>
                  </g>

                  {/* Direction markers / Arrows showing current flow */}
                  <path d="M 190,12 L 195,15 L 190,18" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M 90,12 L 95,15 L 90,18" fill="none" stroke="currentColor" strokeWidth="1" />
                  
                  {/* Plus/minus tags for battery orientation */}
                  <text x="31" y="32" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="bold">+</text>
                  <text x="31" y="55" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">-</text>

                  {/* Sequential Animating Electron Particles inside wires (flowing CW) */}
                  <motion.circle 
                    cx={[40, 40, 140, 240, 240, 40, 40]} 
                    cy={[40, 15, 15, 15, 65, 65, 40]} 
                    r="2.5" 
                    className="fill-amber-400" 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                  />
                  
                  <motion.circle 
                    cx={[40, 40, 140, 240, 240, 40, 40]} 
                    cy={[40, 15, 15, 15, 65, 65, 40]} 
                    r="2.5" 
                    className="fill-amber-400" 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }} 
                  />

                  <motion.circle 
                    cx={[40, 40, 140, 240, 240, 40, 40]} 
                    cy={[40, 15, 15, 15, 65, 65, 40]} 
                    r="2.5" 
                    className="fill-amber-400" 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }} 
                  />
                </svg>
              </div>
            </div>

            <div className="flex justify-between text-[7px] font-mono text-slate-500 pt-1.5 border-t border-slate-900 uppercase select-none">
              <span>Ohm's Law: V = I * R</span>
              <span className="text-emerald-400 font-extrabold animate-pulse">Closed Loop Stable</span>
            </div>
          </div>
        );
      case 3: // Advanced Systems / Control Systems
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative select-none">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-900/80 mb-0.5">
              <span className="font-mono text-[7px] text-amber-500 font-extrabold uppercase">
                PID CONTROL SYSTEMS // ACTIVE SCHEMATIC
              </span>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-2 py-0.5 items-center">
              {/* Left Column: Closed-Loop Block Diagram (7 cols) */}
              <div className="col-span-12 lg:col-span-7 flex flex-col justify-center gap-0.5">
                <span className="font-mono text-[6.5px] text-slate-500 uppercase block mb-0.5">Feedback Block Diagram</span>
                <div 
                  className="bg-slate-950 rounded-lg p-1 border border-slate-900 relative h-[68px] flex items-center justify-center"
                >

                  <svg className="w-full h-[70px]" viewBox="0 0 220 70">
                    {/* Reference Input Line */}
                    <line x1="10" y1="35" x2="30" y2="35" stroke="#f59e0b" strokeWidth="1" />
                    <text x="18" y="28" fill="#f59e0b" fontSize="5.5" fontFamily="monospace" fontWeight="bold">θ_ref</text>
                    
                    {/* Summation Circle */}
                    <circle cx="35" cy="35" r="5" fill="none" stroke="#f59e0b" strokeWidth="1" />
                    <text x="35" y="37" fill="#f59e0b" fontSize="7" textAnchor="middle" fontWeight="bold">+</text>
                    <text x="31" y="47" fill="#f59e0b" fontSize="5" textAnchor="middle">-</text>
                    
                    {/* Line to Controller */}
                    <line x1="40" y1="35" x2="55" y2="35" stroke="#f59e0b" strokeWidth="1" />
                    
                    {/* PID Controller Box */}
                    <rect x="55" y="20" width="40" height="30" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="75" y="38" fill="#f59e0b" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="bold">PID_CTRL</text>

                    {/* Line to Plant */}
                    <line x1="95" y1="35" x2="115" y2="35" stroke="#f59e0b" strokeWidth="1" />
                    <text x="105" y="28" fill="#64748b" fontSize="5.5" fontFamily="monospace">u(t)</text>
                    
                    {/* Plant (Inverted Pendulum) Box */}
                    <rect x="115" y="20" width="45" height="30" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="137.5" y="35" fill="#f59e0b" fontSize="5.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">PEND_SYS</text>
                    <text x="137.5" y="43" fill="#f59e0b" fontSize="4.5" textAnchor="middle" fontFamily="monospace">(PLANT)</text>

                    {/* Line to Output */}
                    <line x1="160" y1="35" x2="185" y2="35" stroke="#f59e0b" strokeWidth="1" />
                    <text x="192" y="37" fill="#f59e0b" fontSize="5.5" fontFamily="monospace" fontWeight="bold">θ(t)</text>
                    
                    {/* Branch point and feedback path */}
                    <circle cx="175" cy="35" r="1.5" fill="#f59e0b" />
                    <line x1="175" y1="35" x2="175" y2="60" stroke="#f59e0b" strokeWidth="1" />
                    <line x1="175" y1="60" x2="35" y2="60" stroke="#f59e0b" strokeWidth="1" />
                    <line x1="35" y1="60" x2="35" y2="40" stroke="#f59e0b" strokeWidth="1" />
                    
                    {/* Signal particles animating along path */}
                    <motion.circle cx={[10, 35, 55, 95, 115, 160, 175]} cy={[35, 35, 35, 35, 35, 35, 35]} r="1.5" fill="#fff" transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                  </svg>
                </div>
              </div>

              {/* Right Column: Inverted Pendulum Live Controller Animation (5 cols) - Properly connected and locked rod */}
              <div className="col-span-12 lg:col-span-5 flex flex-col items-center justify-center">
                <span className="font-mono text-[6.5px] text-slate-500 uppercase block mb-0.5">State Visualizer</span>
                <div className="w-full bg-[#02050f] rounded-lg border border-slate-900 h-[68px] relative overflow-hidden flex items-end justify-center pb-1 select-none">
                  <span className="absolute top-1 right-2.5 font-mono text-[5.5px] text-emerald-400 font-extrabold animate-pulse">ACTIVE BALANCING</span>
                  
                  {/* Balancing Animation */}
                  <div className="w-full h-full relative flex items-end justify-center">
                    <svg className="w-full h-full" viewBox="0 0 150 65">
                      {/* Track path line */}
                      <line x1="10" y1="51" x2="140" y2="51" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Moving assembly group */}
                      <motion.g
                        animate={{ 
                          x: [-35, 35, -15, 25, -30, 20, -35],
                        }}
                        transition={{ 
                          duration: 8, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      >
                        {/* Cart body */}
                        <rect x="60" y="32" width="30" height="13" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
                        
                        {/* Wheels connected properly to the bottom of cart */}
                        <circle cx="67" cy="48" r="3.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                        <circle cx="67" cy="48" r="1.5" fill="#94a3b8" />
                        
                        <circle cx="83" cy="48" r="3.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                        <circle cx="83" cy="48" r="1.5" fill="#94a3b8" />

                        {/* Rotating Pole Group (g), rotating around structural hinge center (75, 32) */}
                        <motion.g
                          animate={{ 
                            rotate: [12, -14, 8, -10, 15, -6, 12],
                          }}
                          transition={{ 
                            duration: 8, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          style={{ transformOrigin: "75px 32px" }}
                        >
                          {/* Pole Rod */}
                          <line x1="75" y1="32" x2="75" y2="4" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
                          
                          {/* Pendulum head weight (Bob) */}
                          <circle cx="75" cy="4" r="3.5" fill="#f43f5e" stroke="#fb7185" strokeWidth="1" />
                          <circle cx="75" cy="4" r="1.5" fill="#fff" />
                        </motion.g>

                        {/* High-contrast physical joint pin centered perfectly at (75, 32) */}
                        <circle cx="75" cy="32" r="2.5" fill="#f8fafc" stroke="#f59e0b" strokeWidth="1.2" />
                        <circle cx="75" cy="32" r="0.8" fill="#0f172a" />
                      </motion.g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[7.5px] font-mono text-slate-500 mt-1 bg-slate-950 p-1.5 rounded border border-slate-900">
              STABILIZATION METRICS: <span className="text-amber-400 font-bold uppercase animate-pulse">Kp=1.82, Ki=0.45, Kd=0.12 // STEADY_STATE_REACHED</span>
            </div>
          </div>
        );
      case 5: { // Robotic AI Systems
        const paths = [
          // Input 1 -> Hidden 1 -> Output 1
          { cx: [35, 140, 245], cy: [23, 18, 33], color: "#c084fc", delay: 0 },
          { cx: [35, 140, 245], cy: [23, 18, 33], color: "#c084fc", delay: 1.2 },
          // Input 1 -> Hidden 2 -> Output 1
          { cx: [35, 140, 245], cy: [23, 36, 33], color: "#a855f7", delay: 0.6 },
          { cx: [35, 140, 245], cy: [23, 36, 33], color: "#a855f7", delay: 1.8 },
          // Input 1 -> Hidden 3 -> Output 2
          { cx: [35, 140, 245], cy: [23, 54, 58], color: "#38bdf8", delay: 0.3 },
          { cx: [35, 140, 245], cy: [23, 54, 58], color: "#38bdf8", delay: 1.5 },

          // Input 2 -> Hidden 1 -> Output 1
          { cx: [35, 140, 245], cy: [48, 18, 33], color: "#a855f7", delay: 0.9 },
          { cx: [35, 140, 245], cy: [48, 18, 33], color: "#a855f7", delay: 2.1 },
          // Input 2 -> Hidden 2 -> Output 2
          { cx: [35, 140, 245], cy: [48, 36, 58], color: "#38bdf8", delay: 0.5 },
          { cx: [35, 140, 245], cy: [48, 36, 58], color: "#38bdf8", delay: 1.7 },
          // Input 2 -> Hidden 3 -> Output 2
          { cx: [35, 140, 245], cy: [48, 54, 58], color: "#c084fc", delay: 1.1 },
          { cx: [35, 140, 245], cy: [48, 54, 58], color: "#c084fc", delay: 2.3 },
          // Input 2 -> Hidden 4 -> Output 2
          { cx: [35, 140, 245], cy: [48, 72, 58], color: "#38bdf8", delay: 0.2 },
          { cx: [35, 140, 245], cy: [48, 72, 58], color: "#38bdf8", delay: 1.4 },

          // Input 3 -> Hidden 2 -> Output 2
          { cx: [35, 140, 245], cy: [73, 36, 58], color: "#a855f7", delay: 0.7 },
          { cx: [35, 140, 245], cy: [73, 36, 58], color: "#a855f7", delay: 1.9 },
          // Input 3 -> Hidden 3 -> Output 2
          { cx: [35, 140, 245], cy: [73, 54, 58], color: "#c084fc", delay: 1.3 },
          { cx: [35, 140, 245], cy: [73, 54, 58], color: "#c084fc", delay: 2.5 },
          // Input 3 -> Hidden 4 -> Output 1
          { cx: [35, 140, 245], cy: [73, 72, 33], color: "#38bdf8", delay: 0.4 },
          { cx: [35, 140, 245], cy: [73, 72, 33], color: "#38bdf8", delay: 1.6 },
        ];

        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative">
            <span className="font-mono text-[7px] text-purple-500 font-extrabold pb-1.5 uppercase border-b border-slate-900 block font-bold">
              NEURAL NETWORK INFERENCE DECK // MULTI-LAYER PERCEPTRON
            </span>
            <div className="flex-1 flex flex-col justify-center py-0.5 gap-1.5">
              {/* Neural network graph svg */}
              <div className="h-[72px] relative overflow-hidden bg-slate-950 rounded-lg border border-slate-900 flex justify-center items-center p-0.5">
                <div className="absolute inset-0 bg-[#0e021a]/15" />
                <svg className="w-full h-full" viewBox="0 0 280 85">
                  {/* Layer text labels */}
                  <text x="35" y="8" fill="#6b7280" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">INPUT LAYER</text>
                  <text x="140" y="8" fill="#9333ea" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">HIDDEN LAYER</text>
                  <text x="245" y="8" fill="#c084fc" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OUTPUT LAYER</text>

                  {/* Connections: Input -> Hidden */}
                  <line x1="35" y1="23" x2="140" y2="18" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.45" />
                  <line x1="35" y1="23" x2="140" y2="36" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.45" />
                  <line x1="35" y1="23" x2="140" y2="54" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2" />
                  <line x1="35" y1="23" x2="140" y2="72" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2" />

                  <line x1="35" y1="48" x2="140" y2="18" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.3" />
                  <line x1="35" y1="48" x2="140" y2="36" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.5" />
                  <line x1="35" y1="48" x2="140" y2="54" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.5" />
                  <line x1="35" y1="48" x2="140" y2="72" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.3" />

                  <line x1="35" y1="73" x2="140" y2="18" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.15" />
                  <line x1="35" y1="73" x2="140" y2="36" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2" />
                  <line x1="35" y1="73" x2="140" y2="54" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.5" />
                  <line x1="35" y1="73" x2="140" y2="72" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.5" />

                  {/* Connections: Hidden -> Output */}
                  <line x1="140" y1="18" x2="245" y2="33" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.5" />
                  <line x1="140" y1="18" x2="245" y2="58" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.25" />
                  
                  <line x1="140" y1="36" x2="245" y2="33" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.6" />
                  <line x1="140" y1="36" x2="245" y2="58" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.4" />

                  <line x1="140" y1="54" x2="245" y2="33" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.4" />
                  <line x1="140" y1="54" x2="245" y2="58" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.6" />

                  <line x1="140" y1="72" x2="245" y2="33" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.25" />
                  <line x1="140" y1="72" x2="245" y2="58" stroke="#d8b4fe" strokeWidth="0.5" strokeOpacity="0.5" />

                  {/* Active synapsis shooting particles (Animating circles on paths) */}
                  {paths.map((p, i) => (
                    <motion.circle
                      key={i}
                      style={{ filter: `drop-shadow(0 0 2px ${p.color})` }}
                      animate={{
                        cx: p.cx,
                        cy: p.cy,
                        r: [1.3, 3.2, 1.3],
                        fill: [p.color, "#fb7185", "#10b981"]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay,
                      }}
                    />
                  ))}

                  {/* Render layer Node circles */}
                  {/* Inputs */}
                  <circle cx="35" cy="23" r="3.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <circle cx="35" cy="48" r="3.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <circle cx="35" cy="73" r="3.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />

                  {/* Hidden */}
                  <circle cx="140" cy="18" r="3.5" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
                  <circle cx="140" cy="36" r="3.5" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
                  <circle cx="140" cy="54" r="3.5" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
                  <circle cx="140" cy="72" r="3.5" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />

                  {/* Outputs */}
                  <circle cx="245" cy="33" r="3.5" fill="#1e293b" stroke="#c084fc" strokeWidth="1" />
                  <circle cx="245" cy="58" r="3.5" fill="#1e293b" stroke="#c084fc" strokeWidth="1" />
                  
                  {/* Text descriptions inside nodes */}
                  <text x="43" y="25" fill="#94a3b8" fontSize="4.5" fontFamily="monospace" textAnchor="left">X1_SENS</text>
                  <text x="43" y="50" fill="#94a3b8" fontSize="4.5" fontFamily="monospace" textAnchor="left">X2_GYRO</text>
                  <text x="43" y="75" fill="#94a3b8" fontSize="4.5" fontFamily="monospace" textAnchor="left">X3_ERR</text>

                  <text x="235" y="35" fill="#d8b4fe" fontSize="4.5" fontFamily="monospace" textAnchor="end">Y1_STEER</text>
                  <text x="235" y="60" fill="#d8b4fe" fontSize="4.5" fontFamily="monospace" textAnchor="end">Y2_SPEED</text>
                </svg>
              </div>

              {/* Cognitive telemetry text readout */}
              <div className="font-mono text-[7.5px] bg-[#02050f] p-2 rounded border border-slate-900 border-purple-950/20 text-left text-slate-400 leading-tight space-y-0.5">
                <div className="text-purple-400 font-bold">&gt;&gt; LAYER MATRIX FEEDFORWARD PASS WEIGHTS: OK</div>
                <div className="text-slate-500">&gt;&gt; BIAS ADJUSTMENT TENSOR: GRADIENT STEEPEST DESCENT</div>
                <div className="text-sky-400 font-semibold">&gt;&gt; MODEL COGNITION STATUS: DEEP LEARNING ACTIVE</div>
              </div>
            </div>
          </div>
        );
      }
      case 6: // Robot Types & Applications (index 6)
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative bg-transparent border-none overflow-hidden text-left">
            <span className="font-mono text-[7px] text-cyan-400 font-extrabold pb-1.5 uppercase border-b border-cyan-950/20 block">ROBOT CLASSIFICATION SCANNER // VISUALIZATION ACTIVE</span>
            
            <div className="flex-1 flex flex-col justify-center items-center py-1 relative">
              <img 
                src="/src/assets/images/robotics_tech_visualizer_1781348337794.jpg" 
                alt="Cybernetic Robotics Morphology" 
                className="w-full h-[100px] object-cover rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex justify-between text-[7px] font-mono text-slate-500 pt-1 border-t border-slate-900 uppercase">
              <span>INTELLIGENT KINEMATICS ACTIVE</span>
              <span className="text-cyan-400 font-extrabold uppercase animate-pulse">ALIGNMENT COMPLIANT</span>
            </div>
          </div>
        );
      case 7: // Component Diagnostics (index 7)
        return (
          <div className="w-full h-full flex flex-col justify-between p-1 relative bg-transparent border-none text-left">
            <span className="font-mono text-[7px] text-emerald-400 font-extrabold pb-1.5 uppercase border-b border-emerald-950/20 block">HARDWARE SIGNAL TRACE ROUTING // ACTIVE</span>
            
            <div className="flex-1 flex flex-col justify-center items-center py-1 relative">
              <svg viewBox="0 0 300 100" className="w-full h-24">
                {/* Microcontroller MCU Box */}
                <rect x="15" y="25" width="54" height="40" rx="3" fill="#02071a" stroke="#10b981" strokeWidth="1" />
                <text x="42" y="47" fill="#34d399" className="font-mono text-[7px] font-bold" textAnchor="middle">MCU CORE</text>
                
                {/* Device Sensor Box */}
                <rect x="231" y="25" width="54" height="40" rx="3" fill="#02071a" stroke="#0ea5e9" strokeWidth="1" />
                <text x="258" y="47" fill="#38bdf8" className="font-mono text-[7px] font-bold" textAnchor="middle">SENSOR</text>
                
                {/* Channels lines */}
                <path d="M 69,37 L 231,37" stroke="#1e293b" strokeWidth="1.5" />
                <path d="M 69,53 L 231,53" stroke="#1e293b" strokeWidth="1.5" />
                
                {/* Animated active state tracers */}
                <motion.circle
                  cx="69"
                  cy="37"
                  r="2.5"
                  fill="#34d399"
                  className="shadow-[0_0_8px_#34d399]"
                  animate={{ cx: [69, 231] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  cx="231"
                  cy="53"
                  r="2.5"
                  fill="#38bdf8"
                  className="shadow-[0_0_8px_#38bdf8]"
                  animate={{ cx: [231, 69] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                
                <text x="150" y="32" fill="#10b981" className="font-mono text-[5.5px]" textAnchor="middle">TX_BUS [GPIO_12]</text>
                <text x="150" y="64" fill="#0ea5e9" className="font-mono text-[5.5px]" textAnchor="middle">RX_BUS [GPIO_13]</text>
              </svg>
              
              <div className="flex gap-4 justify-around w-full font-mono text-[6.5px] text-slate-500 uppercase mt-1">
                <span>VOLTAGE: 3.3V</span>
                <span>BAUD: 115200</span>
                <span>SIGNAL: STABLE</span>
              </div>
            </div>

            <div className="flex justify-between text-[7px] font-mono text-slate-500 pt-1 border-t border-slate-900 uppercase">
              <span>PIN TRACE ANALYZER ACTIVE</span>
              <span className="text-emerald-400 font-extrabold animate-pulse">TELEMETRY COMPLIANT</span>
            </div>
          </div>
        );
      case 4: // Robotic Manipulators
        return <AnimatedManipulatorDiagnostic />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[#030611] text-slate-100 flex flex-col justify-between p-4 lg:p-6 select-none font-sans">
      
      {/* Subtle Digital Grid Overlay */}
      <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(to_right,#0f1c35_1px,transparent_1px),linear-gradient(to_bottom,#0f1c35_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 pointer-events-none" />
      
      {/* Elegant Radial Background Scan Flare */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.12)_0%,_transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent pointer-events-none" />

      {/* COMPACT INTEGRATED HEADER */}
      <header className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between border-b border-slate-900/80 pb-3 mb-2 shrink-0">
        <div className="flex items-center gap-3">
          <PremiumLogo className="w-8 h-8" glow={true} />
          <div className="text-left">
            <h1 className="text-sm md:text-base font-sans font-black tracking-wider text-white uppercase leading-none">
              Robotics Learning Hub
            </h1>
            <span className="font-mono text-[8px] text-sky-400 font-extrabold tracking-widest uppercase block mt-1">
              STEM Cybernetic Curriculum Pipeline
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Secure Operator deck link */}
          <button
            onClick={() => setShowCreatorModal(true)}
            className="font-mono text-[8px] bg-slate-950 text-sky-300 border border-slate-800 hover:border-sky-500/50 hover:text-white px-2.5 py-1 rounded transition-colors uppercase font-bold cursor-pointer"
          >
            Developer profile
          </button>
        </div>
      </header>

      {/* MAIN CONSOLE SYSTEM DECK */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center py-1">
        <div className="w-full bg-[#050b1d]/90 border-2 border-slate-900/80 rounded-2xl p-4 relative lg:overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(15,23,42,0.6)] flex-1 flex flex-col justify-between h-auto max-h-none lg:max-h-[610px]">
          {/* Ambient header divider glow */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
          
          {/* Technical target frames */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sky-500/20" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-sky-500/20" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-indigo-500/20" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-indigo-500/20" />

          {/* Grid Layout: 12-Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch lg:overflow-hidden overflow-visible">
            
            {/* LEFT 7-COLUMNS: The Active STEM Sequence Selector */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-between gap-3 bg-[#030612]/50 border border-slate-900 rounded-xl p-3 relative">
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-950 border border-slate-900 flex items-center justify-center">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-450 text-sky-400" />
                  </div>
                  <h3 className="font-sans font-black text-xs text-white uppercase tracking-tight">
                    Syllabus Modules Pathway
                  </h3>
                </div>
                <span className="font-mono text-[7px] text-slate-500 font-bold uppercase">
                  Select Stage to Calibrate
                </span>
              </div>

              {/* STAGES CONTAINER: Elegant micro bento grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 my-1 overflow-y-auto lg:max-h-none px-1.5 py-1">
                {roadmapPhases.map((phase, idx) => {
                  const isActive = activePhaseIndex === idx;
                  const c = phase.color || "sky";

                  const stylesMap: Record<string, {
                    hoverBorder: string;
                    activeBorder: string;
                    activeBg: string;
                    activeGlow: string;
                    activeLeftAccent: string;
                    activeIconBorderCount: string;
                    activeText: string;
                    activeDot: string;
                  }> = {
                    sky: {
                      hoverBorder: "hover:border-sky-500/50 hover:bg-sky-500/[0.02] hover:shadow-[0_0_12px_rgba(56,189,248,0.15)]",
                      activeBorder: "border-sky-400",
                      activeBg: "bg-sky-500/[0.08]",
                      activeGlow: "shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-sky-500/20",
                      activeLeftAccent: "bg-sky-400 shadow-[0_0_10px_#38bdf8]",
                      activeIconBorderCount: "border-sky-500 text-sky-400",
                      activeText: "text-sky-400",
                      activeDot: "bg-sky-400"
                    },
                    indigo: {
                      hoverBorder: "hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] hover:shadow-[0_0_12px_rgba(99,102,241,0.15)]",
                      activeBorder: "border-indigo-400",
                      activeBg: "bg-indigo-500/[0.08]",
                      activeGlow: "shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/20",
                      activeLeftAccent: "bg-indigo-400 shadow-[0_0_10px_#6366f1]",
                      activeIconBorderCount: "border-indigo-500 text-indigo-400",
                      activeText: "text-indigo-400",
                      activeDot: "bg-indigo-400"
                    },
                    emerald: {
                      hoverBorder: "hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] hover:shadow-[0_0_12px_rgba(16,185,129,0.15)]",
                      activeBorder: "border-emerald-400",
                      activeBg: "bg-emerald-500/[0.08]",
                      activeGlow: "shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20",
                      activeLeftAccent: "bg-emerald-400 shadow-[0_0_10px_#10b981]",
                      activeIconBorderCount: "border-emerald-500 text-emerald-400",
                      activeText: "text-emerald-400",
                      activeDot: "bg-emerald-400"
                    },
                    amber: {
                      hoverBorder: "hover:border-amber-500/50 hover:bg-amber-500/[0.02] hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]",
                      activeBorder: "border-amber-400",
                      activeBg: "bg-amber-500/[0.08]",
                      activeGlow: "shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20",
                      activeLeftAccent: "bg-amber-400 shadow-[0_0_10px_#f59e0b]",
                      activeIconBorderCount: "border-amber-500 text-amber-400",
                      activeText: "text-amber-400",
                      activeDot: "bg-amber-400"
                    },
                    purple: {
                      hoverBorder: "hover:border-purple-500/50 hover:bg-purple-500/[0.02] hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]",
                      activeBorder: "border-purple-400",
                      activeBg: "bg-purple-500/[0.08]",
                      activeGlow: "shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/20",
                      activeLeftAccent: "bg-purple-400 shadow-[0_0_10px_#a855f7]",
                      activeIconBorderCount: "border-purple-500 text-purple-400",
                      activeText: "text-purple-400",
                      activeDot: "bg-purple-400"
                    },
                    cyan: {
                      hoverBorder: "hover:border-cyan-500/50 hover:bg-cyan-500/[0.02] hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]",
                      activeBorder: "border-cyan-400",
                      activeBg: "bg-cyan-500/[0.08]",
                      activeGlow: "shadow-[0_0_15px_rgba(34,211,238,0.25)] ring-1 ring-cyan-500/20",
                      activeLeftAccent: "bg-cyan-400 shadow-[0_0_10px_#22d3ee]",
                      activeIconBorderCount: "border-cyan-500 text-cyan-400",
                      activeText: "text-cyan-400",
                      activeDot: "bg-cyan-400"
                    }
                  };

                  const currentStyle = stylesMap[c] || stylesMap.sky;
                  
                  return (
                    <button 
                      key={phase.id} 
                      onClick={() => {
                        if (isActive) {
                          setActivePhaseIndex(null);
                        } else {
                          setActivePhaseIndex(idx);
                        }
                        // On mobile, scroll to diagnostic layout below
                        if (window.innerWidth < 1024) {
                          setTimeout(() => {
                            const targetElement = document.getElementById("module-diagnostic-panel");
                            if (targetElement) {
                              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                        }
                      }}
                      className={`group relative z-10 p-2.5 rounded-lg border flex items-center justify-between transition-all duration-200 select-none cursor-pointer min-h-[58px] py-1.5 h-auto w-full text-left overflow-hidden ${
                        isActive 
                          ? `${currentStyle.activeBorder} ${currentStyle.activeBg} ${currentStyle.activeGlow}` 
                          : `border-slate-850 border-slate-900 bg-slate-950/45 ${currentStyle.hoverBorder}`
                      }`}
                    >
                      {/* Left holographic active state accent indicator bar */}
                      {isActive && (
                        <div className={`absolute left-0 top-0 bottom-0 w-[3.5px] rounded-l-md z-30 ${currentStyle.activeLeftAccent}`} />
                      )}

                      {/* Ambient hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {/* Dynamic colored icon container */}
                        <div className={`w-8.5 h-8.5 rounded-md flex items-center justify-center border shrink-0 transition-transform duration-350 ${
                          isActive
                            ? `${currentStyle.activeIconBorderCount} bg-slate-950 scale-[1.03]`
                            : "border-slate-900 bg-slate-950 text-slate-500 group-hover:border-slate-800"
                        }`}>
                          {phase.icon}
                        </div>
                        
                        <div className="overflow-hidden leading-tight pl-2">
                          <span className={`font-mono text-[7.5px] block font-extrabold uppercase tracking-widest ${isActive ? currentStyle.activeText : "text-slate-500"}`}>
                            {phase.phaseNum}
                          </span>
                          <h4 className="font-sans font-black text-xs tracking-tight text-white uppercase leading-normal mt-0.5">
                            {phase.name}
                          </h4>
                        </div>
                      </div>

                      {/* Small Active LED State indicator */}
                      <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
                        <div className="relative flex h-1.5 w-1.5">
                          {isActive && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentStyle.activeDot}`} />
                          )}
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                            isActive ? currentStyle.activeDot : "bg-slate-800"
                          }`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* TELEMETRY STATEMENT AREA (Literal human logs) */}
              <div className="p-2 rounded bg-slate-950 border border-slate-900 shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${activePhaseIndex !== null ? "bg-sky-400 animate-pulse" : "bg-slate-800"}`} />
                  <span className="font-sans text-[10px] text-slate-400">
                    {currentPhase ? (
                      <>
                        Aligned stage: <strong className="text-white font-bold">{currentPhase.name}</strong>. Engage simulator to run mechatronic diagnostics.
                      </>
                    ) : (
                      "Launch status: Standard standby mode. Select a curriculum module above to inspect interactive telemetry."
                    )}
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT 5-COLUMNS: Module Description Content Panel */}
            <div id="module-diagnostic-panel" className="col-span-12 lg:col-span-5 flex flex-col justify-between gap-3 bg-[#030612]/50 border border-slate-900 rounded-xl p-3.5 relative">
              
              {currentPhase === null ? (
                <div className="flex flex-col justify-between h-full flex-1">
                  
                  {/* Holographic Header */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 animate-pulse">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-sans font-black text-xs text-slate-200 uppercase tracking-tight">
                        Companion Robot Advisor
                      </h4>
                    </div>
                  </div>

                  {/* Robot Interactive Core */}
                  <div className="flex flex-col items-center justify-center flex-1 py-1 gap-1">
                    
                    {/* Cute DEB-09 Bobbing Robot Frame */}
                    <motion.div
                      animate={{ 
                        y: [36, 26, 36],
                        scaleY: [1, 0.97, 1.02, 1],
                        scaleX: [1, 1.03, 0.98, 1],
                        rotate: [-1.5, 1.5, -1.5]
                      }}
                      transition={{ 
                        duration: 3.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="w-56 h-56 relative flex items-center justify-center select-none pb-4"
                    >
                      {/* Ambient shadow glow */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/15 to-violet-500/15 blur-2xl animate-pulse" />
                      
                      <svg className="w-full h-full text-sky-400 overflow-visible" viewBox="0 0 200 200" stroke="currentColor" fill="none" strokeWidth="1.5" style={{ overflow: "visible" }}>
                        <defs>
                          <linearGradient id="finGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e1b4b" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                          </linearGradient>
                          <linearGradient id="finGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e1b4b" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                          </linearGradient>
                          <linearGradient id="mechBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0b0f19" stopOpacity="0.95" />
                            <stop offset="40%" stopColor="#111827" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#030712" stopOpacity="0.95" />
                          </linearGradient>
                          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#020617" />
                            <stop offset="100%" stopColor="#141a3d" />
                          </linearGradient>
                          <radialGradient id="thrusterGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
                            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.2)" />
                            <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                          </radialGradient>
                        </defs>

                        {/* Background glowing telemetry matrices */}
                        <motion.circle cx="100" cy="95" r="90" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" strokeDasharray="2,6" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
                        <motion.circle cx="100" cy="95" r="78" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="0.75" strokeDasharray="30,15" animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />

                        {/* High-Tech Antenna / Transmitter on top */}
                        <line x1="100" y1="45" x2="100" y2="15" stroke="#c084fc" strokeWidth="2.5" />
                        <line x1="90" y1="30" x2="110" y2="30" stroke="#38bdf8" strokeWidth="1" />
                        <motion.circle 
                          cx="100" cy="11" r="3.5" 
                          fill="#38bdf8" 
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }} 
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} 
                        />
                        {/* Glowing signal rings spreading from the antenna */}
                        <motion.circle 
                          cx="100" cy="11" r="14" 
                          stroke="#38bdf8" 
                          strokeWidth="0.75" 
                          fill="none" 
                          animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} 
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} 
                        />

                        {/* Orbiting cybernetic rings/circles around the robot */}
                        <g transform="translate(100, 92)">
                          {/* Inner Orbit Line */}
                          <ellipse cx="0" cy="0" rx="90" ry="24" fill="none" stroke="#22d3ee" strokeWidth="0.75" strokeDasharray="3 7" opacity="0.4" transform="rotate(-15)" />
                          {/* Outer Orbit Line */}
                          <ellipse cx="0" cy="0" rx="112" ry="30" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 6" opacity="0.35" transform="rotate(20)" />

                          {/* Outer Orbit Sentinel Node 1 */}
                          <motion.g
                            animate={{
                              x: [90 * Math.cos(0), 90 * Math.cos(Math.PI/2), 90 * Math.cos(Math.PI), 90 * Math.cos(3*Math.PI/2), 90 * Math.cos(2*Math.PI)],
                              y: [24 * Math.sin(0), 24 * Math.sin(Math.PI/2), 24 * Math.sin(Math.PI), 24 * Math.sin(3*Math.PI/2), 24 * Math.sin(2*Math.PI)],
                            }}
                            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                            style={{ transform: "rotate(-15deg)" }}
                          >
                            <circle r="3.5" fill="#22d3ee" />
                            <circle r="7.5" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.4" />
                          </motion.g>

                          {/* Outer Orbit Sentinel Node 2 */}
                          <motion.g
                            animate={{
                              x: [-112 * Math.cos(0), -112 * Math.cos(Math.PI/2), -112 * Math.cos(Math.PI), -112 * Math.cos(3*Math.PI/2), -112 * Math.cos(2*Math.PI)],
                              y: [-30 * Math.sin(0), -30 * Math.sin(Math.PI/2), -30 * Math.sin(Math.PI), -30 * Math.sin(3*Math.PI/2), -30 * Math.sin(2*Math.PI)],
                            }}
                            transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
                            style={{ transform: "rotate(20deg)" }}
                          >
                            <circle r="2.5" fill="#a855f7" />
                            <circle r="5" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
                          </motion.g>

                          {/* Close-in Orbit Sentinel Node 3 */}
                          <motion.circle
                            r="2"
                            fill="#10b981"
                            animate={{
                              cx: [0, 60, 0, -60, 0],
                              cy: [16, 0, -16, 0, 16],
                            }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </g>

                        {/* Floating Side Support Nodes with Dynamic Orbits and Scanning Lasers */}
                        <motion.g
                          animate={{ 
                            y: [-8, 8, -8],
                            x: [-5, 5, -5],
                            scale: [0.95, 1.1, 0.95]
                          }}
                          transition={{ 
                            duration: 3.5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                        >
                          <circle cx="18" cy="115" r="7" fill="#020617" stroke="#38bdf8" strokeWidth="1.2" />
                          <circle cx="18" cy="115" r="2.5" fill="#a855f7" className="animate-pulse" />
                          <path d="M 18,115 L 43,90" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
                        </motion.g>
                        <motion.g
                          animate={{ 
                            y: [8, -8, 8],
                            x: [5, -5, 5],
                            scale: [1.1, 0.95, 1.1]
                          }}
                          transition={{ 
                            duration: 3.5, 
                            repeat: Infinity, 
                            ease: "easeInOut", 
                            delay: 0.8 
                          }}
                        >
                          <circle cx="182" cy="115" r="7" fill="#020617" stroke="#38bdf8" strokeWidth="1.2" />
                          <circle cx="182" cy="115" r="2.5" fill="#38bdf8" className="animate-pulse" />
                          <path d="M 182,115 L 157,90" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
                        </motion.g>

                        {/* Humanoid Robot Body Assembly */}
                        <g>
                          {/* Articulated Cyber-Neck Joint */}
                          <rect x="88" y="125" width="24" height="15" rx="4" fill="#090d16" stroke="#38bdf8" strokeWidth="1.2" />
                          <line x1="91" y1="130" x2="109" y2="130" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="91" y1="135" x2="109" y2="135" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />

                          {/* Torso / Chest Armor Shell */}
                          <path 
                            d="M 64,138 L 136,138 Q 142,138 138,146 L 122,166 Q 118,170 110,170 L 90,170 Q 82,170 78,166 L 62,146 Q 58,138 64,138 Z" 
                            fill="url(#mechBodyGrad)" 
                            stroke="#38bdf8" 
                            strokeWidth="2" 
                          />

                          {/* Futuristic Glowing Chest Arc-Reactor Core */}
                          <g transform="translate(100, 154)">
                            <circle cx="0" cy="0" r="11" fill="#070a13" stroke="#a855f7" strokeWidth="1.2" />
                            <circle cx="0" cy="0" r="7" fill="rgba(34, 211, 238, 0.15)" />
                            {/* Rotating Inner Core Ring */}
                            <motion.circle 
                              cx="0" cy="0" r="7" 
                              stroke="#22d3ee" 
                              strokeWidth="0.8" 
                              strokeDasharray="4,2" 
                              fill="none" 
                              animate={{ rotate: 360 }} 
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
                            />
                            <motion.circle 
                              cx="0" cy="0" r="3.5" 
                              fill="#22d3ee" 
                              animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.7, 1, 0.7] }} 
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                            />
                          </g>

                          {/* Tech Collarbone Bars & Plate Detailing */}
                          <line x1="68" y1="144" x2="84" y2="144" stroke="#818cf8" strokeWidth="1.2" opacity="0.7" />
                          <line x1="116" y1="144" x2="132" y2="144" stroke="#818cf8" strokeWidth="1.2" opacity="0.7" />
                          
                           <path d="M 68,148 L 78,162" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />
                          <path d="M 132,148 L 122,162" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.5" />

                          {/* Left Supporting/Resting Robotic Arm */}
                          <g>
                            {/* Solid stationary Shoulder Mount socket casing anchored to torso */}
                            <path d="M 75,138 Q 66,134 57,143 L 67,150 Z" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
                            <circle cx="64" cy="144" r="5.5" fill="#0b0f19" stroke="#1e293b" strokeWidth="1" />
                            
                            {/* Tech bracket line showing connected mechanics to body */}
                            <line x1="74" y1="144" x2="64" y2="144" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="1 1" opacity="0.8" />

                            {/* Stationary joint cap with mounting core (visually locked inside the casing) */}
                            <circle cx="64" cy="144" r="5" fill="#090d16" stroke="#c084fc" strokeWidth="1.2" />
                            <circle cx="64" cy="144" r="2.2" fill="#22d3ee" />
                            
                            {/* Arm structure gently breathing */}
                            <motion.g
                              style={{ transformOrigin: "64px 144px" }}
                              animate={{ rotate: [4, -4, 4] }}
                              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              {/* Upper Arm Bone */}
                              <path d="M 64,144 Q 48,142 44,152" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
                              <path d="M 64,144 Q 48,142 44,152" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
                              
                              {/* Elbow */}
                              <circle cx="44" cy="152" r="4" fill="#090d16" stroke="#c084fc" strokeWidth="1" />
                              
                              {/* Forearm */}
                              <path d="M 44,152 L 32,168" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                              
                              {/* Wrist & Mechanical Dual-Jaw Gripper Claw */}
                              <circle cx="32" cy="168" r="3" fill="#0b0f19" stroke="#c084fc" strokeWidth="1.2" />
                              <path d="M 31,168 C 22,172 23,184 30,186" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                              <path d="M 33,168 C 42,174 41,184 34,186" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                              <circle cx="32" cy="168" r="1.2" fill="#38bdf8" />
                            </motion.g>
                          </g>
                        </g>

                        {/* Main Chassis Head */}
                        <rect x="46" y="45" width="108" height="85" rx="36" fill="url(#mechBodyGrad)" stroke="#38bdf8" strokeWidth="2.2" />
                        
                        {/* Metallic lateral plate attachments */}
                        <rect x="40" y="68" width="6" height="44" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="0.75" />
                        <rect x="154" y="68" width="6" height="44" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="0.75" />

                        {/* Digital Screen Visor */}
                        <rect x="56" y="55" width="88" height="66" rx="22" fill="url(#screenGrad)" stroke="#1e293b" strokeWidth="1.5" />
                        
                        {/* High-tech matrix grid lines */}
                        <line x1="56" y1="74" x2="144" y2="74" stroke="#10b981" strokeWidth="0.3" strokeOpacity="0.12" />
                        <line x1="56" y1="88" x2="144" y2="88" stroke="#10b981" strokeWidth="0.3" strokeOpacity="0.12" />
                        <line x1="56" y1="102" x2="144" y2="102" stroke="#10b981" strokeWidth="0.3" strokeOpacity="0.12" />

                        {/* Beating Tiny Digital Heart in Center of Screen */}
                        <motion.g
                          transform="translate(100, 68)"
                          animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <path 
                            d="M 0,-1.5 C -1,-3 -2.5,-3 -2.5,-1.5 C -2.5,0.3 0,2 0,2 C 0,2 2.5,0.3 2.5,-1.5 C 2.5,-3 1,-3 0,-1.5 Z" 
                            fill="none" 
                            stroke="none"
                            strokeWidth="0.4"
                          />
                        </motion.g>

                        {/* Intelligent Dynamic Ocular Lenses */}
                        <g>
                          {/* Left Eye HUD & Lens */}
                          <g transform="translate(76, 83)">
                            <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.08)" />
                            <motion.circle 
                              cx="0" cy="0" r="9.5" 
                              stroke="#38bdf8" 
                              strokeWidth="0.8" 
                              strokeDasharray="3,3" 
                              fill="none"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Shiny round anime eye iris */}
                            <circle cx="0" cy="0" r="7.5" fill="#030712" stroke="#38bdf8" strokeWidth="1.2" />
                            <motion.circle 
                              cx="0" cy="0" r="4.5" 
                              fill="#22d3ee"
                              animate={{ 
                                scaleY: [1, 1, 0.08, 1, 1],
                              }} 
                              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", repeatDelay: 1.8 }}
                            />
                            {/* Double Star Sparkle Reflection Highlights */}
                            <circle cx="-1.8" cy="-1.8" r="1.6" fill="#ffffff" />
                            <circle cx="1.6" cy="1.6" r="0.7" fill="#ffffff" />
                          </g>
 
                          {/* Right Eye HUD & Lens */}
                          <g transform="translate(124, 83)">
                            <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.08)" />
                            <motion.circle 
                              cx="0" cy="0" r="9.5" 
                              stroke="#38bdf8" 
                              strokeWidth="0.8" 
                              strokeDasharray="3,3" 
                              fill="none"
                              animate={{ rotate: -360 }}
                              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Shiny round anime eye iris */}
                            <circle cx="0" cy="0" r="7.5" fill="#030712" stroke="#38bdf8" strokeWidth="1.2" />
                            <motion.circle 
                              cx="0" cy="0" r="4.5" 
                              fill="#22d3ee"
                              animate={{ 
                                scaleY: [1, 1, 0.08, 1, 1],
                              }} 
                              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", repeatDelay: 1.8 }}
                            />
                            {/* Double Star Sparkle Reflection Highlights */}
                            <circle cx="-1.8" cy="-1.8" r="1.6" fill="#ffffff" />
                            <circle cx="1.6" cy="1.6" r="0.7" fill="#ffffff" />
                          </g>
                        </g>

                        {/* Sleek Cyan Digital Smiling Mouth */}
                        <motion.path 
                          d="M 88,104 Q 100,112 112,104" 
                          stroke="#22d3ee" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          fill="none"
                          animate={{ 
                            d: [
                              "M 88,104 Q 100,112 112,104",
                              "M 88,104 Q 100,116 112,104",
                              "M 88,104 Q 100,108 112,104",
                              "M 88,104 Q 100,112 112,104"
                            ]
                          }}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Levitation propulsion engine rings representing body-attached lower thruster */}
                        <g transform="translate(100, 172)">
                          <motion.ellipse 
                            cx="0" cy="0" rx="36" ry="8" 
                            fill="url(#thrusterGlow)" 
                            animate={{ rx: [30, 42, 30], ry: [6, 11, 6], opacity: [0.75, 0.95, 0.75] }} 
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                          />
                          <ellipse cx="0" cy="-4" rx="20" ry="4.5" fill="#0d0e21" stroke="#38bdf8" strokeWidth="1.5" />
                          <ellipse cx="0" cy="1" rx="12" ry="2.5" fill="#050511" stroke="#a855f7" strokeWidth="1" />
                          
                          {/* Animated particle streams */}
                          <motion.line 
                            x1="-11" y1="4" x2="-13" y2="24" 
                            stroke="#c084fc" 
                            strokeWidth="1" 
                            animate={{ y1: [4, 18], y2: [14, 28], opacity: [1, 0] }} 
                            transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }} 
                          />
                          <motion.line 
                            x1="0" y1="4" x2="0" y2="28" 
                            stroke="#38bdf8" 
                            strokeWidth="1.5" 
                            animate={{ y1: [4, 20], y2: [15, 32], opacity: [1, 0] }} 
                            transition={{ duration: 1.0, repeat: Infinity, ease: "easeOut", delay: 0.2 }} 
                          />
                          <motion.line 
                            x1="11" y1="4" x2="13" y2="24" 
                            stroke="#c084fc" 
                            strokeWidth="1" 
                            animate={{ y1: [4, 18], y2: [14, 28], opacity: [1, 0] }} 
                            transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut", delay: 0.15 }} 
                          />
                        </g>

                        {/* Right Animated Resting Robotic Arm (Symmetrically anchored to the shoulder, pointing down) */}
                        <g id="robotic-waving-arm-foreground">
                          {/* Solid stationary Shoulder Mount socket casing anchored to torso */}
                          <path d="M 125,138 Q 134,134 143,143 L 133,150 Z" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
                          <circle cx="136" cy="144" r="5.5" fill="#0b0f19" stroke="#1e293b" strokeWidth="1" />
                          
                          {/* Tech bracket line showing connected mechanics to body */}
                          <line x1="126" y1="144" x2="136" y2="144" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="1 1" opacity="0.8" />

                          {/* Stationary joint cap with mounting core (visually locked inside the casing) */}
                          <circle cx="136" cy="144" r="5" fill="#090d16" stroke="#c084fc" strokeWidth="1.2" />
                          <circle cx="136" cy="144" r="2.2" fill="#22d3ee" />

                          {/* Arm structure gently breathing, symmetrically mirrored to left arm */}
                          <motion.g
                            style={{ transformOrigin: "136px 144px" }}
                            animate={{ rotate: [-4, 4, -4] }}
                            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            {/* Upper Arm Segment (oriented downwards/outwards) */}
                            <path d="M 136,144 Q 152,142 156,152" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" fill="none" />
                            <path d="M 136,144 Q 152,142 156,152" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
                            
                            {/* Elbow Joint base ring */}
                            <circle cx="156" cy="152" r="4" fill="#090d16" stroke="#c084fc" strokeWidth="1" />
                            
                            {/* Forearm, Wrist, & Gripper Assembly pointing down */}
                            <path d="M 156,152 L 168,168" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            <path d="M 156,152 L 168,168" stroke="#818cf8" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
                            
                            {/* Wrist joint */}
                            <circle cx="168" cy="168" r="3" fill="#0b0f19" stroke="#c084fc" strokeWidth="1.2" />
                            
                            {/* Dual-Jaw Gripper Claw / Pincers closed/resting downwards */}
                            <path d="M 169,168 C 178,172 177,184 170,186" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                            <path d="M 167,168 C 158,174 159,184 166,186" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                            
                            {/* Connector Pin */}
                            <circle cx="168" cy="168" r="1.2" fill="#38bdf8" />
                          </motion.g>
                        </g>

                      </svg>
                    </motion.div>

                    {/* Holographic Projection Platform & Light Cone */}
                    <div className="relative w-64 h-16 flex flex-col items-center justify-center -mt-6 mb-3 select-none pointer-events-none">
                      {/* Upward Hologram Light Cone (matching platform edge and flaring wide as it approaches the robot) */}
                      <div 
                        className="absolute bottom-[16px] w-[220px] h-32 bg-gradient-to-t from-cyan-500/25 via-cyan-500/8 to-transparent blur-xs opacity-85" 
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)' }} 
                      />
                      
                      {/* Secondary scanning active light rays */}
                      <motion.div 
                        className="absolute bottom-[16px] w-44 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-xs"
                        animate={{ y: [-75, 0, -75] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />

                      {/* Holographic Oblong Platform Base (The Hologram Projector Pad) */}
                      <svg className="w-56 h-12 absolute bottom-0 text-cyan-400 overflow-visible" viewBox="0 0 200 40">
                        <defs>
                          <radialGradient id="padInnerGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.45)" />
                            <stop offset="70%" stopColor="rgba(168, 85, 247, 0.08)" />
                            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                          </radialGradient>
                          <linearGradient id="padRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="50%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>

                        {/* Oblong Projection Glow Area representing active pad surface */}
                        <ellipse cx="100" cy="20" rx="72" ry="12" fill="url(#padInnerGlow)" />

                        {/* Outer Rim Ring (Aesthetic Oblong Platform Deck) */}
                        <ellipse cx="100" cy="20" rx="75" ry="14" stroke="url(#padRimGrad)" strokeWidth="1.2" opacity="0.3" fill="none" />
                        
                        {/* Shimmering Segmented Active Ring */}
                        <motion.ellipse 
                          cx="100" cy="20" rx="71" ry="11.5" 
                          stroke="#22d3ee" 
                          strokeWidth="1.8" 
                          strokeDasharray="16 25 8 12" 
                          opacity="0.8" 
                          fill="none"
                          animate={{ strokeDashoffset: [0, 100] }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Deep Internal Core Emitter Base */}
                        <ellipse cx="100" cy="20" rx="35" ry="6" stroke="#c084fc" strokeWidth="1" fill="none" opacity="0.6" />
                        <ellipse cx="100" cy="20" rx="14" ry="2.5" fill="#030712" stroke="#22d3ee" strokeWidth="1.5" />
                        
                        {/* Super High-Glow Core Pulse */}
                        <motion.ellipse 
                          cx="100" cy="20" rx="8" ry="1.5" 
                          fill="#22d3ee"
                          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.25, 0.9] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Projector Pad Corners/Brackets (Oblong Platform Accents) */}
                        <path d="M 18,20 C 18,24 28,30 45,32" stroke="#22d3ee" strokeWidth="0.75" fill="none" opacity="0.4" />
                        <path d="M 182,20 C 182,24 172,30 155,32" stroke="#22d3ee" strokeWidth="0.75" fill="none" opacity="0.4" />

                        <path d="M 18,20 C 18,16 28,10 45,8" stroke="#22d3ee" strokeWidth="0.75" fill="none" opacity="0.4" />
                        <path d="M 182,20 C 182,16 172,10 155,8" stroke="#22d3ee" strokeWidth="0.75" fill="none" opacity="0.4" />

                        {/* Floating holographic calibration dots */}
                        <motion.circle cx="28" cy="18" r="1.5" fill="#c084fc" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }} />
                        <motion.circle cx="172" cy="18" r="1.5" fill="#c084fc" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }} />
                        <motion.circle cx="100" cy="31" r="1.2" fill="#22d3ee" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }} />
                        <motion.circle cx="100" cy="9" r="1.2" fill="#22d3ee" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }} />
                      </svg>
                    </div>

                    {/* Welcome Speech Bubble */}
                    <div className="w-full text-center bg-gradient-to-br from-[#080d26] to-[#030514] p-3 rounded-lg border border-cyan-500/20 shadow-lg">
                      <span className="font-sans font-black text-[10px] text-cyan-400 uppercase tracking-wide block mb-1">
                        Systems Ready
                      </span>
                      <p className="font-sans text-[10px] text-cyan-200 font-medium leading-normal max-w-[260px] mx-auto">
                        <span className="hidden lg:inline">
                          Welcome to the Robotics deck! Select a mechatronic curriculum module on the left navigation panel to align diagnostics.
                        </span>
                        <span className="inline lg:hidden">
                          Welcome to the Robotics deck! Select a mechatronic curriculum module above to align diagnostics.
                        </span>
                      </p>
                    </div>

                  </div>

                  {/* Empty Command Footer state */}
                  <div className="mt-2 shrink-0">
                    <button
                      disabled={true}
                      className="w-full px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-650 border border-slate-900 text-slate-500 font-bold font-mono text-[9px] tracking-wider rounded-lg cursor-not-allowed uppercase flex items-center justify-center gap-2"
                    >
                      <span>Launcher Idle — Waiting for Module</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col justify-between h-full flex-1 overflow-hidden">
                  
                  {/* Phase Headline */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8.5 h-8.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                        {currentPhase.icon}
                      </div>
                      <div className="text-left leading-tight">
                        <span className={`font-mono text-[7px] px-1 rounded font-extrabold tracking-wider ${currentPhase.badgeColor}`}>
                          {currentPhase.phaseNum} Overview
                        </span>
                        <h4 className="font-sans font-bold text-xs text-white uppercase mt-0.5">
                          {currentPhase.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Readout Body */}
                  <div className="flex flex-col gap-2.5 py-2 overflow-y-auto flex-1 h-full pr-1">
                    
                    {/* Concept desc label */}
                    <div className="text-left leading-normal">
                      <span className="font-mono text-[6.5px] text-sky-400 font-extrabold uppercase tracking-widest block mb-0.5">
                        Learning Bounds
                      </span>
                      <p className="font-sans text-[10px] text-slate-350 leading-relaxed bg-slate-950/50 p-2.5 rounded-md border border-slate-900 font-normal">
                        {currentPhase.desc}
                      </p>
                    </div>

                    {/* Integrated Interactive Simulator Screen */}
                    <div className="text-left flex flex-col gap-1">
                      <span className="font-mono text-[6.5px] text-indigo-400 font-extrabold uppercase tracking-widest block">
                        Calibration Telemetry Visualizer
                      </span>
                      <div className="w-full h-[155px] rounded-lg bg-slate-950 border border-slate-900 p-1.5 relative overflow-hidden flex flex-col justify-between">
                        {renderPhaseVisualizer(activePhaseIndex)}
                      </div>
                    </div>

                  </div>

                  {/* Large Tactical Engage Trigger button */}
                  <div className="pt-2 border-t border-slate-900 shrink-0">
                    <button
                      onClick={() => {
                        onEnter(currentPhase.targetTab);
                      }}
                      className="w-full relative px-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black font-mono text-[10px] tracking-widest rounded-xl transition-all duration-150 active:scale-98 cursor-pointer uppercase flex items-center justify-center gap-1.5 group border border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                    >
                      <span>Engage Module Simulation</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200 text-slate-950" />
                      
                      {/* Professional corners */}
                      <div className="absolute -top-[1.5px] -left-[1.5px] w-2 h-2 border-t-2 border-l-2 border-white/60" />
                      <div className="absolute -top-[1.5px] -right-[1.5px] w-2 h-2 border-t-2 border-r-2 border-white/60" />
                      <div className="absolute -bottom-[1.5px] -left-[1.5px] w-2 h-2 border-b-2 border-l-2 border-white/60" />
                      <div className="absolute -bottom-[1.5px] -right-[1.5px] w-2 h-2 border-b-2 border-r-2 border-white/60" />
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </main>

      {/* FOOTER AREA */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 pt-3 mt-1.5 text-[8.5px] font-mono text-slate-500 gap-2 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span>Robotics Learning Hub © 2026 — Dubai, UAE by Sean Buscano</span>
          <span className="text-slate-800">|</span>
          <div className="relative">
            <button 
              onClick={() => setShowReferencesDropdown(!showReferencesDropdown)}
              className="hover:text-cyan-400 text-[#22d3ee] transition-colors cursor-pointer font-bold uppercase flex items-center gap-1 active:scale-95 transition-transform"
            >
              [ Topic References ▾ ]
            </button>
            {showReferencesDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowReferencesDropdown(false)} 
                />
                <div className="fixed sm:absolute bottom-16 sm:bottom-6 left-4 right-4 sm:left-0 sm:right-auto z-50 sm:w-[350px] max-w-[calc(100vw-32px)] sm:max-w-[360px] bg-[#020617]/95 border border-slate-900 rounded-lg p-3 shadow-2xl space-y-1.5 text-left animate-fadeIn backdrop-blur-md">
                  <div className="border-b border-slate-900 pb-1.5 mb-1.5 flex items-center justify-between">
                    <span className="font-sans font-black text-white text-[9px] tracking-tight uppercase">Topic Literature References</span>
                    <span className="text-[6.5px] text-[#22d3ee] font-black uppercase font-mono">Academic Textbooks</span>
                  </div>
                  {TOPIC_REFERENCES.map((ref, idx) => (
                    <div
                      key={idx}
                      className="block p-2 rounded bg-slate-950/40 border border-slate-900 text-left"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[8px] font-black text-[#22d3ee] font-mono uppercase tracking-wide">{ref.topic}</span>
                      </div>
                      <div className="text-[9px] font-sans font-bold text-slate-200 line-clamp-1 leading-snug">
                        {ref.book}
                      </div>
                      <div className="text-[7.5px] font-mono text-slate-500">
                        by {ref.author}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-4 select-none items-center">
          <button 
            onClick={() => setShowCreatorModal(true)} 
            className="hover:text-sky-400 transition-colors cursor-pointer text-slate-400 font-bold uppercase"
          >
            [ Creator Module ]
          </button>
          <span>[ STEM Build v2.5 ]</span>
        </div>
      </footer>

      {/* Holographic Operator Deck Modal Overlay */}
      {showCreatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-[#04081c] border-2 border-slate-900 rounded-2xl max-w-lg w-full p-5 shadow-2xl overflow-hidden select-none">
            
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
            
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-400 animate-pulse" />
                <span className="font-mono text-[9px] font-black text-sky-400 uppercase tracking-widest">Developer credentials deck</span>
              </div>
              <button 
                onClick={() => setShowCreatorModal(false)}
                className="p-1 rounded bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="my-2 max-h-[60vh] overflow-y-auto pr-1">
              <CreatorProfileCard />
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end font-mono text-[10px]">
              <button 
                onClick={() => setShowCreatorModal(false)}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer uppercase"
              >
                Dismiss Deck
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
