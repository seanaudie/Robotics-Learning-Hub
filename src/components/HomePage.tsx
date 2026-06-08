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
  Bot
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
      icon: <Layers className="w-5 h-5 text-sky-400" />
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
      icon: <Code2 className="w-5 h-5 text-indigo-400" />
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
      icon: <Zap className="w-5 h-5 text-emerald-400" />
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
      icon: <Sliders className="w-5 h-5 text-amber-400" />
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
      icon: <RoboticArmIcon className="w-5 h-5 text-sky-400" />
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
      icon: <Sparkles className="w-5 h-5 text-purple-400" />
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
      recommendedTime: "Week 12 Recommended",
      techSpecs: [
        { label: "BRANCHES", value: "8 Key Robotics Classes" },
        { label: "EXPERIMENT", value: "Interactive Live Kinematics" },
        { label: "CERTIFY", value: "Progress Alignment Quizzes" }
      ],
      icon: <Bot className="w-5 h-5 text-cyan-400" />
    },
    {
      id: "ph-8",
      phaseNum: "PHASE 08",
      name: "Diagnostics",
      concept: "Deep signal inspection & oscilloscope probes",
      subTitle: "Electronic failure tracking & analysis",
      desc: "Use advanced hardware probes and virtual oscilloscopes. Inspect pin voltages, analyze continuous wave flows, capture signal integrity, and perform deep microchip stress-testing.",
      targetTab: "explorer" as const,
      color: "fuchsia",
      badgeColor: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/25",
      glowColor: "rgba(217, 70, 239, 0.4)",
      shadowColor: "shadow-[0_0_20px_rgba(217,70,239,0.2)]",
      bgColor: "bg-fuchsia-500/5",
      borderColor: "border-fuchsia-500/30",
      btnGlow: "shadow-[0_0_25px_rgba(217, 70, 239, 0.4)] hover:shadow-[0_0_40px_rgba(217, 70, 239, 0.7)] hover:bg-fuchsia-400/20",
      diagnosticCode: "SYS_DIAG_WAV_08",
      recommendedTime: "Week 13+ Recommended",
      techSpecs: [
        { label: "PROBE INDEX", value: "Multi-point Voltage Probe" },
        { label: "OSCILLOSCOPE", value: "Signal Waveform Sandbox" },
        { label: "LANDMARKS", value: "Full Cross-Section Anatomy" }
      ],
      icon: <Compass className="w-5 h-5 text-fuchsia-400" />
    }
  ];

  const currentPhase = activePhaseIndex !== null ? roadmapPhases[activePhaseIndex] : null;

  // Render individual animated visualizer schematics for each Roadmap index
  const renderPhaseVisualizer = (idx: number) => {
    switch (idx) {
      case 0: // Robotics Foundations
        return (
          <div className="w-full h-full flex flex-col justify-between p-3 relative">
            <span className="font-mono text-[7px] text-sky-500 font-extrabold pb-2 uppercase border-b border-sky-950/40 block">FEEDFORWARD SIGNAL CHAIN // CALIBRATING SYSTEM</span>
            <div className="flex-1 flex gap-2 items-center justify-between py-6">
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
          <div className="w-full h-full flex flex-col justify-between p-3 relative">
            <span className="font-mono text-[7px] text-indigo-500 font-extrabold pb-2 uppercase border-b border-slate-900/80 block">LOOP STACK TRANSLATOR // RUNNING EXAMPLES</span>
            <div className="flex-1 grid grid-cols-12 gap-3 py-3 overflow-hidden">
              {/* Code window */}
              <div className="col-span-6 bg-slate-950 rounded-lg p-2.5 font-mono text-[8px] text-slate-400 border border-slate-900/80 overflow-y-auto leading-tight select-all text-left">
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

              {/* Dynamic Flowchart status */}
              <div className="col-span-6 flex flex-col justify-center items-center gap-2 font-mono text-[8px] py-1 select-none">
                
                {/* 1. Terminal (Start) */}
                <div className="flex flex-col items-center">
                  <div className="px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 font-bold uppercase tracking-wider text-[7px] shadow-[0_0_12px_rgba(14,165,233,0.1)]">
                    [Terminal] loop() start
                  </div>
                  <div className="text-slate-650 text-slate-500 text-[7px] mt-0.5">▼</div>
                </div>

                {/* 2. Input Block (Parallelogram) */}
                <div className="flex flex-col items-center">
                  <div className="transform skew-x-6 px-2.5 py-1 border border-teal-500/30 bg-teal-500/10 text-teal-400 font-bold text-[7px]">
                    <div className="transform -skew-x-6">
                      [Input] Read Sensor Pin A0
                    </div>
                  </div>
                  <div className="text-slate-500 text-[7px] mt-0.5">▼</div>
                </div>

                {/* 3. Decision Block (Diamond) */}
                <div className="flex flex-col items-center relative py-1">
                  <div className="w-13 h-13 rotate-45 border border-amber-500/30 bg-amber-500/5 flex items-center justify-center my-0.5 shadow-[0_0_12px_rgba(245,158,11,0.1)]">
                    <div className="-rotate-45 text-center leading-tighter text-amber-300 font-black text-[6.5px] max-w-[40px]">
                      Is Val &gt; 120?
                    </div>
                  </div>
                  
                  {/* Branch Labels */}
                  <div className="absolute top-1/2 -left-8 text-[6.5px] text-indigo-400 font-black tracking-tighter">YES ↙</div>
                  <div className="absolute top-1/2 -right-8 text-[6.5px] text-slate-500 font-black tracking-tighter">↘ NO</div>
                </div>

                {/* 4. Action Blocks / Output (skewed rectangles) */}
                <div className="grid grid-cols-2 gap-3 w-full px-2">
                  <div className="flex flex-col items-center">
                    <div className="transform skew-x-6 px-2 py-1 border border-indigo-500/25 bg-indigo-505 bg-indigo-500/10 text-indigo-300 font-bold text-[6.5px] text-center w-full">
                      <div className="transform -skew-x-6 leading-tight">
                        [Output] D9 HIGH
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="transform skew-x-6 px-2 py-1 border border-slate-700 bg-slate-900/40 text-slate-500 font-bold text-[6.5px] text-center w-full">
                      <div className="transform -skew-x-6 leading-tight">
                        [Output] D9 LOW
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Terminal Block (End) */}
                <div className="flex flex-col items-center mt-1">
                  <div className="text-slate-500 text-[7px] mb-0.5">▼</div>
                  <div className="px-3 py-1 rounded-full border border-rose-500/25 bg-rose-500/15 text-rose-400 font-bold uppercase tracking-wider text-[7px]">
                    [Terminal] delay(35)
                  </div>
                </div>

              </div>
            </div>
            <div className="text-[7.5px] font-mono text-slate-500 mt-2 bg-slate-950 p-1.5 rounded border border-slate-900">
              LOG STATUS: <span className="text-indigo-400 font-semibold uppercase animate-pulse">FLOW_INTERPRETER_COMPILED_OK</span>
            </div>
          </div>
        );
      case 2: // Basic Electronics
        return (
          <div className="w-full h-full flex flex-col justify-between p-3 relative select-none">
            <span className="font-mono text-[7px] text-emerald-400 font-extrabold pb-2 uppercase border-b border-emerald-950/40 block">OHMIC CIRCUIT SCHEMATIC // LIVE STEADY-STATE</span>
            
            <div className="flex-1 flex flex-col justify-center items-center py-2">
              {/* Dynamic circuit values summary bar */}
              <div className="grid grid-cols-3 gap-2 w-full text-center font-mono text-[8px] mb-3">
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
              <div className="w-full h-[95px] bg-slate-950/90 rounded-lg border border-slate-900/80 p-1 relative flex items-center justify-center">
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
          <div className="w-full h-full flex flex-col justify-between p-3 relative select-none">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900/80 mb-1">
              <span className="font-mono text-[7px] text-amber-500 font-extrabold uppercase">
                PID CONTROL SYSTEMS // ACTIVE SCHEMATIC
              </span>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 py-1 items-center">
              {/* Left Column: Closed-Loop Block Diagram (7 cols) */}
              <div className="col-span-12 lg:col-span-7 flex flex-col justify-center gap-1">
                <span className="font-mono text-[6.5px] text-slate-500 uppercase block mb-1">Feedback Block Diagram</span>
                <div 
                  className="bg-slate-950 rounded-lg p-2 border border-slate-900 relative h-[78px] flex items-center justify-center"
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
                <span className="font-mono text-[6.5px] text-slate-500 uppercase block mb-1">State Visualizer</span>
                <div className="w-full bg-[#02050f] rounded-lg border border-slate-900 h-[78px] relative overflow-hidden flex items-end justify-center pb-2 select-none">
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
      case 5: // Robotic AI Systems
        return (
          <div className="w-full h-full flex flex-col justify-between p-3 relative">
            <span className="font-mono text-[7px] text-purple-500 font-extrabold pb-2 uppercase border-b border-slate-900 block font-bold">
              NEURAL NETWORK INFERENCE DECK // MULTI-LAYER PERCEPTRON
            </span>
            <div className="flex-1 flex flex-col justify-center py-1 gap-2.5">
              {/* Neural network graph svg */}
              <div className="h-[90px] relative overflow-hidden bg-slate-950 rounded-lg border border-slate-900 flex justify-center items-center p-1.5">
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
                  <motion.circle cx={[35, 140, 245]} cy={[23, 36, 33]} r="1.5" fill="#f43f5e" transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.circle cx={[35, 140, 245]} cy={[73, 54, 58]} r="1.5" fill="#a855f7" transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
                  <motion.circle cx={[35, 140, 245]} cy={[48, 18, 33]} r="1.5" fill="#38bdf8" transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />

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
      case 6: // Robot Types & Applications (index 6)
        return (
          <div className="w-full h-full flex flex-col justify-between p-3 relative bg-slate-950/45 rounded-xl border border-slate-900 overflow-hidden">
            <span className="font-mono text-[7px] text-cyan-400 font-extrabold pb-2 uppercase border-b border-cyan-950/40 block">ROBOT CLASSIFICATION ENGINE // COMPILED</span>
            
            <div className="flex-1 flex flex-col justify-center items-center py-2 relative">
              <svg viewBox="0 0 300 100" className="w-full h-24">
                {/* Orbit track */}
                <ellipse cx="150" cy="50" rx="90" ry="30" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
                <ellipse cx="150" cy="50" rx="50" ry="16" fill="none" stroke="#22d3ee" strokeWidth="0.5" className="opacity-30" />
                
                {/* Core base node */}
                <circle cx="150" cy="50" r="10" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" />
                <circle cx="150" cy="50" r="4" fill="#06b6d4" className="animate-pulse" />
                
                {/* Rotating category dots */}
                <g>
                  {/* Drone dot at angle 1 */}
                  <circle cx="110" cy="40" r="4" fill="#38bdf8" stroke="#fff" strokeWidth="0.5" />
                  {/* Hexapod dot at angle 2 */}
                  <circle cx="190" cy="60" r="4.5" fill="#a855f7" stroke="#fff" strokeWidth="0.5" />
                </g>
                
                <text x="150" y="24" fill="#22d3ee" className="font-mono text-[6.5px] font-black uppercase text-center" textAnchor="middle">
                  COGNITIVE MORPHOLOGY MESH
                </text>
              </svg>
              
              <div className="flex gap-2 justify-around w-full font-mono text-[6.5px] text-slate-500 uppercase mt-1">
                <span>[01] EDUCATIONAL</span>
                <span>[04] DRONES</span>
                <span>[06] HUMANOID</span>
                <span>[08] SWARM</span>
              </div>
            </div>

            <div className="flex justify-between text-[7px] font-mono text-slate-500 pt-1 border-t border-slate-900 uppercase">
              <span>Taxonomical scale active</span>
              <span className="text-cyan-400 font-extrabold uppercase animate-pulse">8 Core Branches Map</span>
            </div>
          </div>
        );
      case 7: // Diagnostics
        return (
          <div className="w-full h-full flex flex-col justify-between p-3 relative bg-slate-950/45 rounded-xl border border-slate-900">
            <span className="font-mono text-[7px] text-emerald-500 font-extrabold pb-2 uppercase border-b border-emerald-950/40 block">SIGNAL INTEGRITY PROBE // LIVE ANALYSIS</span>
            <div className="flex-1 flex flex-col justify-center items-center py-4">
              <div className="w-full grid grid-cols-2 gap-3 mb-2 font-mono text-[8px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-900 text-left">
                  <span className="text-slate-500 uppercase block text-[6px]">V_PEAK</span>
                  <span className="text-emerald-400 font-bold text-[10px] animate-pulse">4.98 V</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-900 text-left">
                  <span className="text-slate-500 uppercase block text-[6px]">HARMONIC NOISE</span>
                  <span className="text-sky-300 font-bold text-[10px]">0.02% LIMIT</span>
                </div>
              </div>
              <div className="h-10 w-full relative overflow-hidden bg-slate-950 rounded border border-slate-900 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 300 40">
                  <motion.path
                    animate={{ d: [
                      "M 0,20 Q 15,2 30,20 T 60,20 T 90,20 T 120,20 T 150,20 T 180,20 T 210,20 T 240,20 T 270,20 Q 285,38 300,20",
                      "M 0,20 Q 15,38 30,20 T 60,20 T 90,20 T 120,20 T 150,20 T 180,20 T 210,20 T 240,20 T 270,20 Q 285,2 300,20"
                    ]}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1"
                    strokeDasharray="4,2"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-between text-[7.5px] font-mono text-slate-500 pt-1.5 border-t border-slate-900 uppercase">
              <span>Probe Channel: CH A1 active</span>
              <span className="text-emerald-300 font-bold">100% SIGNAL MATCH</span>
            </div>
          </div>
        );
      case 4: // Robotic Manipulators
        return <AnimatedManipulatorDiagnostic />;
      case 8: // AI Advisor Chatbot
        return (
          <div className="w-full h-full flex flex-col justify-between p-3 relative bg-slate-950/45 rounded-xl border border-slate-900">
            <span className="font-mono text-[7px] text-emerald-400 font-extrabold pb-2 uppercase border-b border-emerald-950/40 block">INTELLIGENT ADVISOR CHATBOT CORE // ENGAGED</span>
            
            <div className="flex-1 flex flex-col justify-center py-2 gap-2 text-left">
              {/* Simulated chat preview cards */}
              <div className="space-y-1.5">
                <div className="p-1 px-2 rounded bg-slate-900/80 border border-slate-800 text-[8px] font-sans flex items-start gap-1.5 max-w-[90%]">
                  <span className="font-mono text-emerald-400 font-bold">[USER]:</span>
                  <span className="text-slate-300">How do I compute inverse kinematics for my robotic manipulator?</span>
                </div>
                <div className="p-1.5 px-2 rounded bg-emerald-950/10 border border-emerald-500/20 text-[8px] font-sans flex items-start gap-1.5 ml-auto max-w-[90%]">
                  <span className="font-mono text-cyan-400 font-bold">[AI]:</span>
                  <span className="text-emerald-300 font-medium">Use trigonometric geometric solvers or algebraic matrices. Here is a Python code snippet: theta2 = acos...</span>
                </div>
              </div>

              {/* Glowing active intelligence signal */}
              <div className="flex items-center justify-between text-[7.5px] font-mono text-slate-500 bg-slate-950 p-1.5 rounded border border-slate-900 mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">KNOWLEDGE RETRIEVAL STACK ACTIVE</span>
                </div>
                <span className="text-[6.5px] text-slate-600">GEN_CODES_OK</span>
              </div>
            </div>

            <div className="flex justify-between text-[7.5px] font-mono text-slate-500 pt-1.5 border-t border-slate-900 uppercase">
              <span>REAL-TIME MULTI-AXIS TUTORIAL</span>
              <span className="text-emerald-400 font-black animate-pulse">GEMINI GENERATIVE ACTIVE</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-slate-100 flex flex-col justify-between overflow-x-hidden p-4 md:p-8 select-none font-sans">
      
      {/* Electronic Circuit Grid Overlay */}
      <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />
      
      {/* Futuristic Radial Signal Wave Scan line */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-950/25 via-[#020617] to-transparent pointer-events-none" />
      
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-sky-500/40 to-transparent pointer-events-none" />

      {/* SECTION 1: HERO VIEW + INTERACTIVE FUTURISTIC ROBOTICS ROADMAP */}
      <section className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center py-1 md:py-2">
        
        {/* Animated Main Title Box */}
        <div className="space-y-2 max-w-3xl mx-auto flex flex-col items-center mb-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/40 border border-sky-500/15">
            <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
            <span className="font-mono text-[8.5px] text-sky-400 font-extrabold tracking-widest uppercase">STEERING AUTOMATION SYLLABUS GATE</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1.5 mb-0.5">
            <PremiumLogo className="w-8 h-8 md:w-9 h-9" glow={true} />
            <h1 className="text-xl md:text-[1.8rem] font-sans font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 leading-none uppercase select-none text-center">
              ROBOTICS LEARNING HUB
            </h1>
          </div>
          
          <p className="text-[11px] md:text-[12px] text-slate-400 leading-normal font-sans max-w-xl mx-auto font-medium">
            Learn robotics interactive modules sequentially. Analyze live sensor input signal flows, structure algorithmic codes, trace hardware electrical circuits, and calibrate physical feedback loops.
          </p>
        </div>

        {/* Dynamic Connected Roadmap Unified Dashboard - Combined Curriculum Flow & Companion Robot DEB-09 */}
        <div id="curriculum-roadmap-dashboard" className="w-full bg-[#040c1e]/95 border-2 border-slate-900 rounded-xl p-4 md:p-5 my-2 max-w-7xl mx-auto relative overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(30,58,138,0.15)] select-none animate-fadeIn">
          {/* Luminous high header overlay border */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/35 to-rose-500/5 pointer-events-none" />

          {/* Holographic matrix grids */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.04)_1.5px,transparent_1.5px)] bg-[size:20px_20px] opacity-80 pointer-events-none" />
          
          {/* Tech decorative target brackets on the single containing window */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sky-500/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sky-500/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-500/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500/30" />

          {/* Glowing sweep scanner light sweep beam across the entire window */}
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-500/15 to-transparent pointer-events-none z-10"
          />

          {/* Elegant Consolidated Dashboard Header */}
          <div className="mb-3.5 flex flex-wrap items-center justify-between border-b border-slate-900 pb-2 text-left gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${sensorAlertActive ? "bg-rose-400" : "bg-cyan-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${sensorAlertActive ? "bg-rose-500" : "bg-cyan-500"}`}></span>
              </span>
              <div>
                <span className="font-mono text-[7.5px] text-fuchsia-400 font-black block tracking-widest uppercase drop-shadow-[0_0_6px_rgba(217,70,239,0.5)] animate-pulse">INTEGRATED DIAGNOSTICS CONTROL</span>
                <h3 className="font-sans font-black text-xs md:text-sm text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  STEM CURRICULUM PIPELINE
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 select-none">
              <div className="font-mono text-[8px] bg-[#0c132c] text-sky-400 px-2 py-0.5 rounded border border-sky-500/20 font-bold flex items-center gap-1.5">
                <span>SYSTEM HUB</span>
                <span className="text-slate-700">|</span>
                <span className="animate-pulse font-extrabold text-emerald-400">
                  ONLINE_STABLE
                </span>
              </div>
            </div>
          </div>

          {/* Integrated 12-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch relative z-10 font-sans">
            
            {/* LEFT 7-COLUMNS: The Active STEM Sequence Log */}
            <div id="curriculum-flow-selector-section" className="col-span-12 md:col-span-7 flex flex-col justify-between gap-3 bg-[#030718]/45 border-2 border-slate-900 rounded-xl p-3.5 md:p-4 relative select-none">
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sky-500/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-sky-500/30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-indigo-500/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-indigo-500/30" />

              {/* Header section identical to the Right Panel header for aligned PC user experience */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-950 border border-slate-800">
                    <GraduationCap className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="font-mono text-[7px] px-1 py-0.5 rounded font-extrabold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/25">
                      STAGE CHANNELS
                    </span>
                    <h4 className="font-sans font-black text-xs text-white uppercase tracking-tight mt-0.5">
                      CURRICULUM FLOW SELECTOR
                    </h4>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 justify-between">
                {/* STAGES SEQUENTIAL PATHWAY SELECTOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roadmapPhases.map((phase, idx) => {
                    const isActive = activePhaseIndex === idx;
                    
                    return (
                      <div 
                        key={phase.id} 
                        onClick={() => {
                          setActivePhaseIndex(idx);
                          // Seamless smooth-scroll down to diagnostic readout on mobile screens if needed
                          if (window.innerWidth < 768) {
                            setTimeout(() => {
                              const targetElement = document.getElementById("module-diagnostic-panel");
                              if (targetElement) {
                                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }
                        }}
                        className={`group relative z-10 p-2 sm:p-2.5 rounded-lg border flex flex-col items-center justify-between select-none min-h-[108px] transition-all duration-300 ${
                          isActive 
                            ? "scale-[1.02]" 
                            : "hover:scale-[1.005]"
                        } ${
                          phase.color === "sky"
                            ? isActive 
                              ? "border-sky-400 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.4)] ring-1 ring-sky-450/40" 
                              : "border-sky-500/15 bg-slate-950/50 hover:border-sky-450 hover:bg-sky-500/[0.02] hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                            : phase.color === "indigo"
                            ? isActive 
                              ? "border-indigo-400 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.4)] ring-1 ring-indigo-450/40" 
                              : "border-indigo-500/15 bg-slate-950/50 hover:border-indigo-450 hover:bg-indigo-500/[0.02] hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                            : phase.color === "emerald"
                            ? isActive 
                              ? "border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-emerald-450/40" 
                              : "border-emerald-500/15 bg-slate-950/50 hover:border-emerald-450 hover:bg-emerald-500/[0.02] hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                            : phase.color === "amber"
                            ? isActive 
                              ? "border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-1 ring-amber-450/40" 
                              : "border-amber-500/15 bg-slate-950/50 hover:border-amber-450 hover:bg-amber-500/[0.02] hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                            : phase.color === "purple"
                            ? isActive 
                              ? "border-purple-400 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-purple-450/40" 
                              : "border-purple-500/15 bg-slate-950/50 hover:border-purple-450 hover:bg-purple-500/[0.02] hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                            : phase.color === "fuchsia"
                            ? isActive 
                              ? "border-fuchsia-400 bg-fuchsia-500/10 shadow-[0_0_20px_rgba(217,70,239,0.5)] ring-1 ring-fuchsia-450/40" 
                              : "border-fuchsia-500/15 bg-slate-950/50 hover:border-fuchsia-450 hover:bg-fuchsia-500/[0.02] hover:shadow-[0_0_217,70,239,0.3)] hover:shadow-[0_0_20px_rgba(217,70,239,0.35)]"
                            : isActive 
                              ? "border-sky-400 bg-sky-500/10 ring-1 ring-sky-450/40" 
                              : "border-slate-800 bg-slate-950/50 hover:border-sky-400"
                        }`}
                      >
                        {/* Interactive dynamic background glow effect on hover */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-transparent ${
                          phase.color === "sky" ? "to-sky-500/[0.03]" :
                          phase.color === "indigo" ? "to-indigo-500/[0.03]" :
                          phase.color === "emerald" ? "to-emerald-500/[0.03]" :
                          phase.color === "amber" ? "to-amber-500/[0.03]" :
                          phase.color === "purple" ? "to-purple-500/[0.03]" :
                          phase.color === "fuchsia" ? "to-fuchsia-500/[0.03]" : "to-sky-500/[0.03]"
                        } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                        {/* Top Metadata Row */}
                        <div className="flex items-center justify-between pointer-events-none w-full">
                          <span className={`font-mono text-[6.5px] px-1 py-0.5 rounded font-extrabold tracking-wider ${phase.badgeColor}`}>
                            {phase.phaseNum}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[6px] text-slate-500 uppercase font-black tracking-widest leading-none">
                              {isActive ? "INSPECTING" : "STANDBY"}
                            </span>
                            <div className="relative flex h-1 w-1">
                              {isActive && (
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                  phase.color === "sky" ? "bg-sky-400" :
                                  phase.color === "indigo" ? "bg-indigo-400" :
                                  phase.color === "emerald" ? "bg-emerald-400" :
                                  phase.color === "amber" ? "bg-amber-400" :
                                  phase.color === "purple" ? "bg-purple-400" :
                                  phase.color === "fuchsia" ? "bg-fuchsia-400" : "bg-sky-400"
                                }`} />
                              )}
                              <span className={`relative inline-flex rounded-full h-1 w-1 ${
                                isActive 
                                  ? (phase.color === "sky" ? "bg-sky-400" :
                                     phase.color === "indigo" ? "bg-indigo-400" :
                                     phase.color === "emerald" ? "bg-emerald-400" :
                                     phase.color === "amber" ? "bg-amber-400" :
                                     phase.color === "purple" ? "bg-purple-400" :
                                     phase.color === "fuchsia" ? "bg-fuchsia-400" : "bg-sky-400")
                                  : "bg-slate-800"
                              }`} />
                            </div>
                          </div>
                        </div>

                        {/* Central Content (Icon + Title & Concept Code) - Fully Centered Centric Architecture */}
                        <div className="flex flex-col items-center justify-center text-center mt-1 pointer-events-none flex-1 gap-1.5 w-full">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 shrink-0 [&>svg]:!w-[18px] [&>svg]:!h-[18px] ${
                            phase.color === "sky"
                              ? isActive 
                                ? "border-sky-500 bg-slate-950 text-sky-400 scale-[1.05]" 
                                : "border-sky-950 bg-slate-950 text-sky-455/45 group-hover:border-sky-500/45 group-hover:text-sky-400"
                              : phase.color === "indigo"
                              ? isActive 
                                ? "border-indigo-500 bg-slate-950 text-indigo-400 scale-[1.05]" 
                                : "border-indigo-950 bg-slate-950 text-indigo-455/45 group-hover:border-indigo-500/45 group-hover:text-indigo-400"
                              : phase.color === "emerald"
                              ? isActive 
                                ? "border-emerald-500 bg-slate-950 text-emerald-400 scale-[1.05]" 
                                : "border-emerald-950 bg-slate-950 text-emerald-455/45 group-hover:border-emerald-500/45 group-hover:text-emerald-400"
                              : phase.color === "amber"
                              ? isActive 
                                ? "border-amber-500 bg-slate-950 text-amber-400 scale-[1.05]" 
                                : "border-amber-950 bg-slate-950 text-amber-455/45 group-hover:border-amber-500/45 group-hover:text-amber-400"
                              : phase.color === "purple"
                              ? isActive 
                                ? "border-purple-500 bg-slate-950 text-purple-400 scale-[1.05]" 
                                : "border-purple-950 bg-slate-950 text-purple-455/45 group-hover:border-purple-500/45 group-hover:text-purple-400"
                              : phase.color === "fuchsia"
                              ? isActive 
                                ? "border-fuchsia-500 bg-slate-950 text-fuchsia-400 scale-[1.05]" 
                                : "border-fuchsia-950 bg-slate-950 text-fuchsia-455/45 group-hover:border-fuchsia-500/45 group-hover:text-fuchsia-400"
                              : isActive 
                                ? "border-sky-500 bg-slate-950 text-sky-400 scale-[1.05]" 
                                : "border-slate-905 bg-slate-950 text-slate-500 group-hover:border-slate-700"
                          }`}>
                            {phase.icon}
                          </div>
                          <div className="flex flex-col items-center justify-center w-full">
                            <h5 className={`font-sans font-black text-[11px] sm:text-[11.5px] tracking-tight text-center uppercase leading-tight transition-colors duration-250 ${
                              isActive
                                ? (phase.color === "sky" ? "text-sky-300" :
                                   phase.color === "indigo" ? "text-indigo-300" :
                                   phase.color === "emerald" ? "text-emerald-300" :
                                   phase.color === "amber" ? "text-amber-300" :
                                   phase.color === "purple" ? "text-purple-300" :
                                   phase.color === "fuchsia" ? "text-fuchsia-300" : "text-white")
                                : "text-slate-100 " + (
                                   phase.color === "sky" ? "group-hover:text-sky-400" :
                                   phase.color === "indigo" ? "group-hover:text-indigo-400" :
                                   phase.color === "emerald" ? "group-hover:text-emerald-400" :
                                   phase.color === "amber" ? "group-hover:text-amber-400" :
                                   phase.color === "purple" ? "group-hover:text-purple-400" :
                                   phase.color === "fuchsia" ? "group-hover:text-fuchsia-400" : "group-hover:text-sky-400"
                                 )
                            }`}>
                              {phase.name}
                            </h5>
                            <span className="font-mono text-[7px] text-slate-400 block mt-0.5 font-bold leading-normal tracking-wide uppercase text-center max-w-[95%] font-medium">
                              {phase.concept}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
 
                {/* COMPACT STAGE MONITORING NOTIFICATION AREA */}
                <div className="mt-1.5 p-2 py-2.5 rounded bg-slate-950/80 border border-slate-900 select-none text-left flex items-start gap-2.5 w-full">
                  <span className="relative flex h-1.5 w-1.5 mt-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                  </span>
                  <div>
                    <span className="font-mono text-[7px] text-cyan-400 font-extrabold uppercase tracking-widest block">SYSTEM TELEMETRY LINK ACTIVE</span>
                    <p className="text-[10px] text-slate-350 leading-normal font-sans font-medium mt-0.5">
                      {currentPhase ? (
                        <>
                          Module <span className="text-white font-bold">#{currentPhase.phaseNum} ({currentPhase.name})</span> is aligned. Tap stage to inspect telemetry.
                        </>
                      ) : (
                        "No module currently selected. Use the Sequence Selector cards above to align a learning pipeline module."
                      )}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT 5-COLUMNS: Integrated Module Readout Panel */}
            <div id="module-diagnostic-panel" className="col-span-12 md:col-span-4 lg:col-span-5 flex flex-col justify-between gap-3 bg-[#030718]/45 border-2 border-slate-900 rounded-xl p-3.5 md:p-4 relative select-none">
              
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sky-500/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-sky-500/30" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-indigo-500/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-indigo-500/30" />
              
              {currentPhase === null ? (
                <div className="flex flex-col justify-between h-full flex-1">
                  {/* Holographic Speech header */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-sky-500/10 border border-sky-500/30 text-sky-400 animate-pulse">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div className="text-left font-sans">
                        <span className="font-mono text-[7.5px] px-1.5 py-0.5 rounded font-extrabold tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/25">
                          ASSISTANT DEB-09
                        </span>
                        <h4 className="font-sans font-black text-xs md:text-sm text-slate-200 uppercase tracking-tight mt-0.5">
                          HOLOGRAPHIC COMPANION ACTIVE
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Humanoid Robot Interactive Box */}
                  <div className="flex flex-col items-center justify-center py-2 md:py-3 flex-1 gap-2">
                    {/* Bobbing Humanoid Robot SVG Frame */}
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        scaleY: [1, 0.97, 1.01, 1],
                        scaleX: [1, 1.03, 0.99, 1],
                        rotate: [-1, 1, -1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 relative flex items-center justify-center animate-fadeIn"
                    >
                      {/* Luminous backdrop circle */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/5 to-violet-500/10 blur-lg animate-pulse" />
                      
                      {/* Holographic base stand */}
                      <motion.div 
                        animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-1 w-16 h-1 bg-gradient-to-r from-sky-500/10 via-violet-500/20 to-sky-500/10 rounded-full blur-[1px] border border-sky-400/20" 
                      />
                      
                      {/* High Tech Vector SVG Robot Shape */}
                      <svg className="w-full h-full text-sky-400" viewBox="0 0 120 120" stroke="currentColor" fill="none" strokeWidth="1.5">
                        {/* Antennas */}
                        <line x1="60" y1="35" x2="60" y2="20" strokeWidth="1" strokeDasharray="2,2" />
                        <circle cx="60" cy="18" r="3" className="fill-violet-400 animate-ping animate-pulse" style={{ transformOrigin: "60px 18px", animationDuration: "1.5s" }} />
                        <circle cx="60" cy="18" r="2" className="fill-sky-400" />
                        
                        <line x1="45" y1="38" x2="33" y2="25" strokeWidth="1" />
                        <circle cx="33" cy="25" r="1.5" className="fill-indigo-400" />
 
                        <line x1="75" y1="38" x2="87" y2="25" strokeWidth="1" />
                        <circle cx="87" cy="25" r="1.5" className="fill-indigo-400" />
 
                        {/* Robot Head Frame */}
                        <rect x="36" y="36" width="48" height="34" rx="14" fill="#030712" strokeWidth="1.7" className="stroke-sky-400" />
                        <rect x="42" y="42" width="36" height="22" rx="8" fill="#01030a" strokeWidth="0.8" className="stroke-indigo-500/50" />
                        
                        {/* Cybernetic details inside neck / joint */}
                        <line x1="56" y1="70" x2="56" y2="76" strokeWidth="3" className="stroke-slate-800" />
                        <line x1="64" y1="70" x2="64" y2="76" strokeWidth="3" className="stroke-slate-800" />
                        
                        {/* Interactive speech wave patterns or glowing visor eyes */}
                        <g>
                          {/* Pulsing Visor / Eyes */}
                          <motion.ellipse 
                            cx="50" cy="53" rx="4" ry="4" 
                            className="fill-sky-400" 
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 1 }}
                          />
                          <motion.ellipse 
                            cx="70" cy="53" rx="4" ry="4" 
                            className="fill-sky-400" 
                            animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", repeatDelay: 1 }}
                          />
                          {/* Subtle digital scanning lines across look */}
                          <line x1="44" y1="53" x2="76" y2="53" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.5" />
                        </g>
 
                        {/* Torso Shoulder Line */}
                        <path d="M 32,95 C 40,84 80,84 88,95" fill="#030712" strokeWidth="1.5" className="stroke-sky-400/80" />
                        {/* Glowing chest power reactor core */}
                        <circle cx="60" cy="94" r="5.5" fill="#050a18" className="stroke-purple-500" strokeWidth="1" />
                        <circle cx="60" cy="94" r="3" fill="#a855f7" className="animate-pulse" />
 
                        {/* Left floating arms/thrusters */}
                        <motion.path 
                          d="M 24,65 Q 16,75 22,85" 
                          animate={{ rotate: [-2, 5, -2] }} 
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          style={{ transformOrigin: "24px 65px" }} 
                        />
 
                        {/* Right floating arms/thrusters (Symmetric cute arm) */}
                        <motion.path 
                          d="M 96,65 Q 104,75 98,85" 
                          animate={{ rotate: [2, -5, 2] }} 
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                          style={{ transformOrigin: "96px 65px" }} 
                        />
 
                        {/* Outer tracking design rings */}
                        <circle cx="60" cy="53" r="42" className="stroke-indigo-500/10" strokeDasharray="3,15" />
                        <circle cx="60" cy="53" r="50" className="stroke-sky-500/10" strokeDasharray="4,8" />
                      </svg>
 
                      {/* Dynamic speech lines on the side of the robot */}
                      <div className="absolute left-[-12px] top-1/2 flex flex-col gap-1 items-end opacity-60">
                        <div className="h-[1px] w-3 bg-sky-500" />
                        <div className="h-[1px] w-4.5 bg-indigo-500" />
                      </div>
                      <div className="absolute right-[-12px] top-1/2 flex flex-col gap-1 items-start opacity-60">
                        <div className="h-[1px] w-3 bg-sky-500" />
                        <div className="h-[1px] w-4.5 bg-indigo-500" />
                      </div>
                    </motion.div>
 
                    {/* Holographic Projector Pedestal / Base Platform with projection cone light highlights */}
                    <div className="relative w-48 h-8 flex flex-col items-center justify-center -mt-6 mb-1 select-none pointer-events-none">
                      {/* Projection Cone / Light Beam highlighting the robot from below (Wider and Shorter) */}
                      <div className="absolute bottom-[10px] w-44 h-12 bg-gradient-to-t from-cyan-500/30 via-cyan-500/[0.02] to-transparent blur-md opacity-90 z-20" 
                           style={{ clipPath: 'polygon(0% 0%, 100% 0%, 40% 100%, 60% 100%)' }} />
 
                      {/* Elevated Circular Aperture centered on top of the platform representing the requested source circle */}
                      <div className="absolute bottom-[7px] w-8 h-2 rounded-full bg-[#040e24] border border-cyan-400/90 shadow-[0_0_10px_rgba(6,182,212,0.8)] flex items-center justify-center z-30">
                        {/* Dynamic pulsing inner white-hot light core */}
                        <div className="w-3.5 h-0.5 rounded-full bg-cyan-100 shadow-[0_0_6px_#ffffff] animate-pulse" />
                      </div>
 
                      {/* Emitter Disk Outer Ring (Metallic / Dark slate) */}
                      <div className="w-16 h-3 rounded-full bg-slate-900 border border-slate-800 relative shadow-[0_0_8px_rgba(0,0,0,0.8)] z-10 flex items-center justify-center">
                        {/* Glowing Emitter Core Ring */}
                        <div className="w-11 h-1.5 rounded-full bg-cyan-950 border border-cyan-500/40 shadow-[0_0_6px_rgba(6,182,212,0.4)] flex items-center justify-center overflow-hidden">
                          {/* Laser focal lens */}
                          <div className="w-4 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#22d3ee] animate-pulse" />
                        </div>
                      </div>
                      
                      {/* Holographic Ring Glow Base reflections on the floor */}
                      <div className="absolute bottom-0 w-24 h-1.5 bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent rounded-full blur-[1px] animate-pulse" />
                    </div>
 
                    {/* Futuristic Welcome speech bubble */}
                    <div className="w-full text-center font-sans bg-gradient-to-br from-[#0a0f2d] to-[#04061a] p-3 rounded-xl border border-cyan-500/35 relative shadow-[0_0_15px_rgba(6,182,212,0.12)] hover:border-violet-500/50 transition-all duration-300">
                      
                      {/* Centered clean block typography layout (uniform cyan/theme colors, wrapped body) */}
                      <p className="font-sans leading-relaxed tracking-wide text-center flex flex-col items-center select-none antialiased text-cyan-400 uppercase">
                        <span className="font-black text-[10.5px] tracking-wider mb-1 animate-pulse">
                          Welcome Robotics Engineer!
                        </span>
                        <span className="font-bold text-[9px] tracking-tight max-w-[280px] leading-snug text-center text-cyan-300">
                          Select a learning module on the left to activate feedback and launch simulators
                        </span>
                      </p>
                    </div>
                    
                    {/* Mobile View Interactive Redirect Button */}
                    <button
                      onClick={() => {
                        const target = document.getElementById("curriculum-flow-selector-section");
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="md:hidden w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-[11px] font-black tracking-wider rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(56,189,248,0.4)] border-2 border-sky-300 uppercase"
                    >
                      <ChevronLeft className="w-4 h-4 animate-bounce max-md:rotate-90 text-slate-950" style={{ animationDuration: "1.5s" }} />
                      <span>TAP TO SELECT CURRICULUM MODULE ABOVE</span>
                    </button>
                  </div>

                  {/* Launcher CTA trigger (Disabled or Prompt State) */}
                  <div className="mt-2 pt-3 border-t border-slate-900 font-sans">
                    <button
                      disabled={true}
                      className="w-full relative px-5 py-3 bg-[#02050f]/60 border border-slate-900 text-slate-600 font-bold font-mono text-[10.5px] tracking-wider rounded-xl cursor-not-allowed uppercase flex items-center justify-center gap-3 select-none"
                    >
                      <span>LAUNCHER WAITING FOR SELECTION</span>
                      <ArrowRight className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full flex-1">
                  {/* Header section with active theme color */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-950 border border-slate-800">
                        {currentPhase.icon}
                      </div>
                      <div className="text-left font-sans">
                        <span className={`font-mono text-[7.5px] px-1.5 py-0.5 rounded font-extrabold tracking-wider ${currentPhase.badgeColor}`}>
                          {currentPhase.phaseNum} DIAGNOSTIC RUN
                        </span>
                        <h4 className="font-sans font-black text-xs md:text-sm text-white uppercase tracking-tight mt-0.5">
                          {currentPhase.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Readout contents layout */}
                  <div className="flex flex-col gap-4 flex-1">
                    
                    {/* Concept overview description block */}
                    <div className="text-left font-sans">
                      <span className="font-mono text-[7px] text-sky-400 font-extrabold uppercase tracking-wide block mb-1 opacity-70">
                        CONCEPT OVERVIEW
                      </span>
                      <p className="font-sans text-[11px] text-slate-300 leading-relaxed font-normal p-3 rounded-lg bg-slate-950/40 border border-slate-900">
                        {currentPhase.desc}
                      </p>
                    </div>

                    {/* Embedded Signal Visualizer Graph */}
                    <div className="text-left flex-1 min-h-[160px] flex flex-col justify-between font-sans animate-fadeIn">
                      <span className="font-mono text-[7px] text-indigo-400 font-extrabold uppercase tracking-wide block mb-1 opacity-70">
                        {activePhaseIndex === 3 
                          ? "CLOSED-LOOP FEEDBACK CONTROL DIAGRAM" 
                          : activePhaseIndex === 4 
                          ? "SPATIAL MULTI-AXIS MANIPULATOR GEOMETRY" 
                          : activePhaseIndex === 5 
                          ? "NEURAL NETWORK INFERENCE CORE" 
                          : activePhaseIndex === 7 
                          ? "SIGNAL INTEGRITY SPECTRUM ANALYZER" 
                          : "MODULE SYNAPTIC INTERACTION SIGNALS"}
                      </span>
                      <div className="flex-1 w-full min-h-[150px] rounded-xl bg-slate-950/95 border border-slate-900 p-1.5 relative overflow-hidden flex flex-col justify-between select-none">
                        {renderPhaseVisualizer(activePhaseIndex)}
                      </div>
                    </div>

                  </div>

                  {/* Launcher CTA trigger */}
                  <div className="mt-2 pt-3 border-t border-slate-900 font-sans">
                    <button
                      onClick={() => {
                        onEnter(currentPhase.targetTab);
                      }}
                      className="w-full relative px-6 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black font-mono text-[11.5px] tracking-widest rounded-xl transition-all duration-300 active:scale-95 cursor-pointer uppercase flex items-center justify-center gap-3 group border border-sky-500 shadow-[0_0_25px_rgba(56,189,248,0.25)]"
                    >
                      <span>LAUNCH SIMULATOR // ENGAGE {currentPhase.phaseNum}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 text-slate-950" />
                      
                      {/* Corner brackets */}
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-sky-400/60" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-sky-400/60" />
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-sky-400/60" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-sky-400/60" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>









      {/* SECTION 5: SYSTEM AUTHOR DETAILS */}
      <section className="relative z-10 w-full max-w-7xl mx-auto py-8 border-t border-slate-900 mt-8">
        <div className="mb-4">
          <span className="font-mono text-[9px] text-sky-400 font-extrabold tracking-widest block uppercase mb-1">SYSTEM CONTROLLER LOGS</span>
          <h2 className="font-sans font-extrabold text-lg md:text-xl text-slate-100 uppercase tracking-tight flex items-center gap-2">
            ABOUT THE PLATFORM &amp; CREATOR
          </h2>
        </div>
        <CreatorProfileCard />
      </section>

      {/* Footer Diagnostic Readout status */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-slate-900 pt-5 mt-6 text-[9.5px] font-mono text-slate-500 gap-2">
        <span>Robotics Learning Hub © 2026 — Developed in Dubai, UAE by Sean Buscano</span>
        <div className="flex gap-4 select-none items-center">
          {onOpenCreatorModal && (
            <button 
              onClick={onOpenCreatorModal} 
              className="hover:text-sky-400 transition-colors cursor-pointer text-slate-400 font-bold"
            >
              [ SYSTEM CREATOR MODULE ]
            </button>
          )}
          <span>[ STEM Build v2.0 ]</span>
        </div>
      </footer>
    </div>
  );
}
