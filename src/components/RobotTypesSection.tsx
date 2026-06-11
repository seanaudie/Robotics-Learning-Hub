import React, { useState, useEffect } from "react";
import { 
  Bot, Cpu, Zap, Activity, Eye, Compass, ShieldAlert, Wrench, Truck, 
  Sparkles, Radio, HelpCircle, RefreshCw, Play, Pause, ArrowRight, 
  Binary, Compass as NavigationIcon, ChevronRight, Check, Award,
  Layers, Hammer, Eye as Scanner, Waves, RotateCw, Plane, Anchor, Orbit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
export interface RobotCategory {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  color: string;
  badgeColor: string;
  borderColor: string;
  themeColor: string;
  icon: React.ReactNode;
  desc: string;
  concept: string;
  applications: string[];
  components: { name: string; category: "actuator" | "sensor" | "controller" | "chassis"; desc: string }[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

const ROBOT_CATEGORIES: RobotCategory[] = [
  {
    id: "educational",
    name: "Educational Robots",
    level: "Beginner",
    color: "sky",
    badgeColor: "bg-sky-500/10 text-sky-455 text-sky-400 border border-sky-500/20",
    borderColor: "border-sky-500/30",
    themeColor: "#38bdf8",
    icon: <Bot className="w-5 h-5 text-sky-400" />,
    desc: "Entry-point robotics demonstrating fundamental physical-to-digital loops like line tracking, basic obstacle avoidance, and simple logic states.",
    concept: "Closed-loop feedback via infrared threshold sensors and basic proportional steering.",
    applications: [
      "STEM Classrooms and hands-on laboratory setups",
      "Introductory programming and algorithmic logic tutoring",
      "Robofest & SUMO student kit competitions"
    ],
    components: [
      { name: "Dual IR Line Tracker", category: "sensor", desc: "Measures reflective infrared values to sense boundary path contrasts." },
      { name: "Microcontroller (8-bit)", category: "controller", desc: "Low-cost starter logic controller (e.g. Arduino ATmega328P)." },
      { name: "DC Geared Toy Motors", category: "actuator", desc: "Provides high-torque baseline traction for wheeled steering." },
      { name: "2WD Acrylic Platform", category: "chassis", desc: "Lightweight, easy-to-assemble structural support base." }
    ],
    quiz: {
      question: "If the right IR sensor of a line-following robot detects a dark line while the left is on white, how should the motors respond?",
      options: [
        "Steer left by shutting off the left motor and spinning the right motor forward.",
        "Steer right by shutting off the right motor and spinning the left motor forward.",
        "Spin both motors backward to run an error search routine.",
        "Stop completely and signal an emergency singular limit state."
      ],
      correct: 1,
      explanation: "To follow the path, the robot must pivot toward the segment currently detecting the line. If the right sensor is on dark, the robot steers right to re-align, done by driving the left wheel relative to the right."
    }
  },
  {
    id: "mobile",
    name: "Mobile Robots",
    level: "Beginner",
    color: "cyan",
    badgeColor: "bg-cyan-500/10 text-cyan-405 text-cyan-400 border border-cyan-500/20",
    borderColor: "border-cyan-500/30",
    themeColor: "#22d3ee",
    icon: <Truck className="w-5 h-5 text-cyan-400" />,
    desc: "Unbound autonomous wheel or tread-driven rovers deployed for spatial movement, path planning, and localization tasks.",
    concept: "Differential steering kinematics, LiDAR/Ultrasonic range mapping, and path mapping integrations.",
    applications: [
      "Last-mile urban food and post shipment delivery buggies",
      "Smart domestic floor vacuum cleaners (e.g. LiDAR Roomba)",
      "Planetary exploration rovers (e.g. Mars Curiosity Rover)"
    ],
    components: [
      { name: "Ultrasonic / LiDAR Sensor", category: "sensor", desc: "Emits sound clicks or laser sweeps to calculate distances to targets." },
      { name: "Optical Wheel Encoders", category: "sensor", desc: "Tracks wheel revolutions to estimate odometer coordinates." },
      { name: "Dual H-Bridge Driver", category: "controller", desc: "Amplifies tiny controller voltage signals into motor drive currents." },
      { name: "Heavy Crawler Treads", category: "chassis", desc: "Maximizes contact area and friction traction over loose debris." }
    ],
    quiz: {
      question: "What is the primary purpose of 'odometry' inside mobile wheeled robotics?",
      options: [
        "To calculate exact battery depletion curves over rough terrains.",
        "To estimate the robot's relative path position over time by counting physical wheel rotations.",
        "To measure ambient thermal limits and throttle motor driver peaks.",
        "To broadcast high-speed digital handshakes to remote server links."
      ],
      correct: 1,
      explanation: "Odometry uses rotary sensors on wheels to measure distances traveled, helping calculate estimated X, Y coordinates, although it is prone to slip error accumulations."
    }
  },
  {
    id: "manipulator",
    name: "Industrial Manipulators",
    level: "Intermediate",
    color: "blue",
    badgeColor: "bg-blue-500/10 text-blue-455 text-blue-450 border border-blue-500/20",
    borderColor: "border-blue-500/30",
    themeColor: "#3b82f6",
    icon: <Wrench className="w-5 h-5 text-blue-400" />,
    desc: "Stationary articulated arm mechanisms with multi-axis rotational joints designed to execute pick, place, welding, and high-precision assembly.",
    concept: "Forward and inverse kinematic geometry, joint speed damping, and workspace payload calculations.",
    applications: [
      "Automotive chassis welding & stamping assembly lines",
      "Semi-conductor pick-and-place microchip placement",
      "Pharmaceutical precision packaging and sorting"
    ],
    components: [
      { name: "Planetary Gear Servos", category: "actuator", desc: "High-torque core joint drives with high precision positional feedback." },
      { name: "Pneumatic End Effector", category: "actuator", desc: "Suction or clamping tool mounted to the end of the mechanical wrist." },
      { name: "Absolute Joint Encoders", category: "sensor", desc: "Gives instantaneous angular values of every segment axis." },
      { name: "Reinforced Alloy Jigs", category: "chassis", desc: "Rigid heavy structural links designed to offset payload deflections." }
    ],
    quiz: {
      question: "What does are the joint calculations of 'Inverse Kinematics' specifically solve?",
      options: [
        "Computing the workspace weight limits when joint links are fully collapsed.",
        "Converting desired target coordinates (X, Y, Z) into required joint angles (θ1, θ2...)",
        "Calculating current flowing into joint coils given thermal resistance states.",
        "Reversing direction gears in planetary assemblies to avoid slip."
      ],
      correct: 1,
      explanation: "While Forward Kinematics takes joint angles to find where the hand of the arm is in space, Inverse Kinematics does the inverse—calculates the exact angle settings needed to reach a targeted coordinate."
    }
  },
  {
    id: "aerial",
    name: "Aerial Robots (Drones)",
    level: "Intermediate",
    color: "indigo",
    badgeColor: "bg-indigo-505/10 text-indigo-405 text-indigo-400 border border-indigo-500/20",
    borderColor: "border-indigo-505/30",
    themeColor: "#6366f1",
    icon: <Plane className="w-5 h-5 text-indigo-400" />,
    desc: "Unmanned multi-rotor flying machines hovering in three dimensions utilizing fast propulsion thrust balance.",
    concept: "Gyroscopic IMU stabilization, thrust vectoring, speed adjustment mixers, and PID flight control loops.",
    applications: [
      "Topographic environmental mapping and agricultural surveillance",
      "Cinematic aerial video and photogrammetry modeling",
      "High-speed parcel transport and delivery grids"
    ],
    components: [
      { name: "Outrunner Brushless Motors", category: "actuator", desc: "Extremely fast, high-efficiency traction elements powering the propellers." },
      { name: "Electronic Speed Controls (ESCs)", category: "controller", desc: "Generates high frequency phase pulses to rotate brushless coils." },
      { name: "6-Axis Inertial Measurement Unit (IMU)", category: "sensor", desc: "Measures 3-axis accelerometer tilt and high speed gyro pitch yaw velocities." },
      { name: "Carbon Fiber Frame Assembly", category: "chassis", desc: "High strength, lightweight layout that survives impact stress." }
    ],
    quiz: {
      question: "How does a standard quadcopter drone produce a pure 'Yaw' (rotational twist) maneuver around its center axis?",
      options: [
        "By tilting all propellers inward toward the IMU casing.",
        "By accelerating two opposing counter-rotating props while decelerating the other two counter-rotating props.",
        "By shifting digital battery weight coordinates internally.",
        "By shutting off two motors completely and falling slightly."
      ],
      correct: 1,
      explanation: "By speeding up clockwise motors and slowing down counter-clockwise motors (or vice versa), the vertical heights/thrust remains steady, but the torque reaction forces become imbalanced, turning the drone."
    }
  },
  {
    id: "walking",
    name: "Walking Robots (Legged)",
    level: "Advanced",
    color: "pink",
    badgeColor: "bg-pink-505/10 text-pink-405 text-pink-400 border border-pink-500/20",
    borderColor: "border-pink-505/30",
    themeColor: "#ec4899",
    icon: <Layers className="w-5 h-5 text-pink-400" />,
    desc: "Quadruped (4-legged) or Hexapod (6-legged) machines designed to step over hazardous obstacles, uneven rocks, or walk inside stairs.",
    concept: "Dynamic center of pressure (CoP), gait sequence planning, foot-ground strike sensors, and structural balance.",
    applications: [
      "Industrial electrical facility inspections and remote thermal scans",
      "Search-and-rescue disaster site obstacle navigation",
      "Military supply carriage over unpaved forest trails"
    ],
    components: [
      { name: "Coreless Digital Joint Servos", category: "actuator", desc: "Supplies high peak response angular movements to shift weight." },
      { name: "Dynamic Ground Contact Sensors", category: "sensor", desc: "Micro-switches or load cells on feet showing active ground collisions." },
      { name: "3-Axis Hall Position Encoders", category: "sensor", desc: "Tracks relative leg flexion alignments continuously." },
      { name: "Spring-Damped Leg Hinges", category: "chassis", desc: "Absorbs landing impacts to extend gearbox life limits." }
    ],
    quiz: {
      question: "What is the primary operational advantage of a Hexapod (6-legged) over a Quadruped (4-legged) robot?",
      options: [
        "It uses substantially cheaper electronic microchips.",
        "It can maintain static stability during walk cycles by keeping 3 legs on the ground at all times (tripod gait).",
        "It operates at speeds exceeding 60 miles per hour.",
        "It doesn't require complex trigonometry solvers to step forward."
      ],
      correct: 1,
      explanation: "Hexapods can utilize the 'Tripod Gate' where 3 feet form a steady stable polygon support on the ground while the other 3 swing forward. Quadrupeds must often balance dynamically during transitions."
    }
  },
  {
    id: "humanoid",
    name: "Humanoid Robots",
    level: "Advanced",
    color: "purple",
    badgeColor: "bg-purple-500/10 text-purple-405 text-purple-400 border border-purple-500/25",
    borderColor: "border-purple-500/30",
    themeColor: "#a855f7",
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    desc: "Bipedal (2-legged) systems matching human morphology, designed to walk on foot, grip standard household tools, and function inside workspaces designed for humans.",
    concept: "Zero Moment Point (ZMP) stability control, inverse pendulums, center-of-mass (CoM) trajectory calculations, and multi-DOF dynamics.",
    applications: [
      "Intuitve humanoid elder-care assistance and physical rehabilitation support",
      "Operating standard tools inside harsh biological workspaces",
      "Smart manufacturing warehouses walking hand-in-hand with human staff"
    ],
    components: [
      { name: "Harmonic Drive Actuators", category: "actuator", desc: "Provides high-reduction, zero-backlash torque loops in human scales." },
      { name: "Ankle/Foot Force Torque Plates", category: "sensor", desc: "Reads ground reaction pressure maps to calculate active body lean." },
      { name: "Stereo Depth AI Camera", category: "sensor", desc: "Outputs live high fidelity 3D point cloud maps of close obstacles." },
      { name: "Bipedal Balance Core", category: "controller", desc: "Computes complex physics balances in real-time." }
    ],
    quiz: {
      question: "What is the 'Zero Moment Point' (ZMP) in the context of humanoid bipedal walking?",
      options: [
        "The joint angle state where actuator electricity usage drops to zero.",
        "The coordinate on the ground where vertical force balances all gravity and rotational moments, ensuring the robot doesn't stumble.",
        "A safety state threshold indicating complete battery depletion.",
        "The top neck joint where camera alignment pitch is locked."
      ],
      correct: 1,
      explanation: "The ZMP is a safety balance criteria. If the calculated ZMP point sits comfortably inside the contact zone of the robot's physical feet on the floor, the robot stays dynamically stable and does not tip."
    }
  }
];

export default function RobotTypesSection() {
  const [activeCategory, setActiveCategory] = useState<RobotCategory>(ROBOT_CATEGORIES[0]);
  const [viewMode, setViewMode] = useState<"visual" | "interactive">("visual");
  
  // Interactive Simulator States
  // 1. Educational (Line Tracker) states
  const [lineTrackingSpeed, setLineTrackingSpeed] = useState<number>(4);
  const [linePosition, setLinePosition] = useState<number>(0); // -100 (left) to 100 (right)
  const [isLineAutoMoving, setIsLineAutoMoving] = useState<boolean>(true);
  
  // 2. Mobile states
  const [obstacleDistance, setObstacleDistance] = useState<number>(120); // 10 to 250 mm
  const [roverScanning, setRoverScanning] = useState<boolean>(true);
  const [sonarAngle, setSonarAngle] = useState<number>(0);
  
  // 3. Manipulators states
  const [armAngleJoint1, setArmAngleJoint1] = useState<number>(45); // θ1
  const [armAngleJoint2, setArmAngleJoint2] = useState<number>(-30); // θ2
  const [gripperClosed, setGripperClosed] = useState<boolean>(false);
  const [pickSequenceStep, setPickSequenceStep] = useState<string>("Standby");

  // 4. Aerial states
  const [aerialThrottle, setAerialThrottle] = useState<number>(60); // 0 to 120 %
  const [isHoverArmed, setIsHoverArmed] = useState<boolean>(false);
  const [propAngle, setPropAngle] = useState<number>(0);
  const [targetAlt, setTargetAlt] = useState<number>(150);
  const [currentAlt, setCurrentAlt] = useState<number>(0);
  
  // 5. Walking states
  const [walkingSpeed, setWalkingSpeed] = useState<number>(3);
  const [gaitPhase, setGaitPhase] = useState<number>(0);
  const [isWalking, setIsWalking] = useState<boolean>(true);
  const [selectedWalkGait, setSelectedWalkGait] = useState<"Tripod" | "Trot" | "Crawl">("Trot");

  // 6. Humanoid states
  const [platformTilt, setPlatformTilt] = useState<number>(12); // -35 to 35 deg
  const [humanoidActiveBalance, setHumanoidActiveBalance] = useState<boolean>(true);
  const [humanoidWaveHand, setHumanoidWaveHand] = useState<boolean>(false);
  const [humanoidTime, setHumanoidTime] = useState<number>(0);

  // 7. AI-Powered states
  const [aiDetectedCore, setAiDetectedCore] = useState<{ label: string; confidence: number; color_hex: string } | null>(null);
  const [aiScanCycles, setAiScanCycles] = useState<number>(0);
  const [aiModelWeightSelect, setAiModelWeightSelect] = useState<"SpatialDense" | "VisionConvNT" | "RLPolicy">("VisionConvNT");
  const [conveyorBlockX, setConveyorBlockX] = useState<number>(10);
  const [activeSortingTask, setActiveSortingTask] = useState<boolean>(false);

  // 8. Advanced States
  const [swarmSize, setSwarmSize] = useState<number>(5);
  const [swarmBeaconMode, setSwarmBeaconMode] = useState<"Orbit" | "Search" | "Align">("Orbit");
  const [advancedTime, setAdvancedTime] = useState<number>(0);

  // Micro-Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  // Reset quiz when category changes
  useEffect(() => {
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizSuccess(null);
  }, [activeCategory]);

  // Handle various interval timers for simulations
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const tick = () => {
      // 1. Educational Line Tracking Auto oscillation
      if (activeCategory.id === "educational" && isLineAutoMoving) {
        setLinePosition(prev => {
          const osc = Math.sin(Date.now() / 800) * 80;
          return Math.round(osc);
        });
      }

      // 2. Mobile Scanner sweep
      if (activeCategory.id === "mobile" && roverScanning) {
        setSonarAngle(prev => (prev + 4) % 360);
      }

      // 4. Aerial Drone lift / propellers spin
      if (activeCategory.id === "aerial") {
        setPropAngle(prev => (prev + (aerialThrottle * 0.4)) % 360);
        
        // Flight height mechanics model
        setCurrentAlt(prev => {
          const armPercent = isHoverArmed ? 1 : 0;
          const target = armPercent * (aerialThrottle * 2);
          const diff = target - prev;
          return Math.round(prev + diff * 0.1);
        });
      }

      // 5. Legged gait transitions
      if (activeCategory.id === "walking" && isWalking) {
        setGaitPhase(prev => (prev + (walkingSpeed * 0.05)) % (Math.PI * 2));
      }

      // 6. Humanoid time increments
      if (activeCategory.id === "humanoid") {
        setHumanoidTime(p => p + 0.05);
      }

      // 7. Conveyor AI systems
      if (activeCategory.id === "ai-powered" && activeSortingTask) {
        setConveyorBlockX(prev => {
          if (prev >= 260) {
            // Block completed, restart and classify next
            setAiScanCycles(c => c + 1);
            classifyConveyorBlock();
            return 10;
          }
          return prev + 2.5;
        });
      }

      // 8. Swarm orbit movements
      if (activeCategory.id === "advanced") {
        setAdvancedTime(t => t + 0.05);
      }
    };

    timer = setInterval(tick, 30);
    return () => clearInterval(timer);
  }, [activeCategory, isLineAutoMoving, roverScanning, aerialThrottle, isHoverArmed, walkingSpeed, isWalking, activeSortingTask]);

  // AI Sorting classifier helper
  const classifyConveyorBlock = () => {
    const classes = [
      { label: "Precision Gear", confidence: 0.98, color_hex: "#38bdf8" },
      { label: "Solder Joint Error", confidence: 0.94, color_hex: "#f43f5e" },
      { label: "Battery Unit Casing", confidence: 0.99, color_hex: "#10b981" },
      { label: "Capacitor Module", confidence: 0.89, color_hex: "#f59e0b" }
    ];
    const rand = classes[Math.floor(Math.random() * classes.length)];
    setAiDetectedCore(rand);
  };

  // Trigger conveyor AI sorting task
  const toggleConveyorSorting = () => {
    if (!activeSortingTask) {
      classifyConveyorBlock();
      setConveyorBlockX(10);
      setActiveSortingTask(true);
    } else {
      setActiveSortingTask(false);
      setAiDetectedCore(null);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === activeCategory.quiz.correct;
    setQuizSuccess(isCorrect);
  };

  // Dynamic calculations for motor speeds depending on steering logic of educational tracking
  const getLineSteeringPower = () => {
    const error = linePosition; // -100 to 100
    // If error is left (< 0), right motor speeds up, left motor slows down to correct
    const leftMotor = Math.max(10, Math.min(100, Math.round(50 + (error * 0.5))));
    const rightMotor = Math.max(10, Math.min(100, Math.round(50 - (error * 0.5))));
    return { leftMotor, rightMotor };
  };

  const { leftMotor, rightMotor } = getLineSteeringPower();

  return (
    <div className="bg-[#050C1C]/90 rounded-2xl border border-slate-800/80 p-5 md:p-6 shadow-2xl relative overflow-hidden select-none animate-fadeIn text-left">
      {/* HUD Scanline bar */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-[9px] text-cyan-400 font-extrabold tracking-widest uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">CURRICULUM MODULE</span>
          </div>
          <h2 className="font-sans font-black text-lg md:text-xl text-white uppercase tracking-tight flex items-center gap-2.5">
            <Bot className="w-5.5 h-5.5 text-cyan-400" /> Robot Types &amp; Applications Roadmap
          </h2>
          <p className="text-[11.5px] text-slate-400 max-w-2xl font-sans leading-relaxed">
            Follow the robotics learning ladder. From basic wheeled buggies to bipedal self-balancing humanoids, aerospace vehicles, and distributed meshes, explore real engineering models inside a high-fidelity visual simulator.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-900 shrink-0 self-start sm:self-center">
          <span className="text-slate-500 uppercase">Progression Scale:</span>
          <span className="text-cyan-400 font-bold uppercase tracking-wider">Beginner → Expert</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Progression Sidebar Navigation */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1">
          <span className="font-mono text-[8.5px] text-slate-500 font-extrabold tracking-wider uppercase pl-1 block mb-1">
            Learning progression roadmap (Select to explore)
          </span>
          <div className="space-y-1.5">
            {ROBOT_CATEGORIES.map((cat, idx) => {
              const isSelected = activeCategory.id === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat);
                    setViewMode("visual");
                    setTimeout(() => {
                      const displayEl = document.getElementById("robot-view-display");
                      if (displayEl) {
                        displayEl.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 50);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden group select-none ${
                    isSelected
                      ? `bg-slate-950/80 border-slate-700 ring-1 ring-sky-500/20`
                      : "bg-[#030815]/50 border-slate-800/60 hover:bg-slate-950/40 hover:border-slate-800"
                  }`}
                  id={`robot-type-nav-btn-${cat.id}`}
                >
                  {/* Selected left glowing accent bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyan-400 shadow-[1px_0_10px_rgba(34,211,238,0.8)]" />
                  )}
                  
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected 
                          ? "bg-cyan-500/10 border border-cyan-500/30" 
                          : "bg-slate-950 border border-slate-900 group-hover:border-slate-800"
                      }`}>
                        {cat.icon}
                      </div>
                      <div className="truncate">
                        <span className="font-mono text-[8px] text-slate-500 block">PHASE 0{idx + 1}</span>
                        <h4 className={`font-sans font-black text-xs uppercase tracking-tight truncate ${
                          isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-205"
                        }`}>
                          {cat.name}
                        </h4>
                      </div>
                    </div>
                    
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      cat.level === "Beginner" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      cat.level === "Intermediate" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      cat.level === "Advanced" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                      "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {cat.level}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-1 truncate select-none pl-0.5">
                    {cat.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Core progression achievement tag */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 mt-auto">
            <Award className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h5 className="font-sans font-black text-[11px] text-slate-200 uppercase tracking-tight">Curriculum Reference Dashboard</h5>
              <p className="font-mono text-[9px] text-slate-500 leading-tight">Explore the details of each robotics category to expand your foundational engineering knowledge.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Static Reference Visualizer and Specifications */}
        <div id="robot-view-display" className="lg:col-span-8 flex flex-col gap-5 scroll-mt-20">
          {/* Main Visualizer Panel */}
          <div className="bg-[#030815]/95 rounded-xl border border-slate-800/80 p-4 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            {/* Visualizer Header */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4 flex-wrap gap-2 select-none">
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20`}>
                  {activeCategory.icon}
                </span>
                <div>
                  <h3 className="font-sans font-extrabold text-[13px] text-white uppercase tracking-wide">
                    {activeCategory.name} Overview
                  </h3>
                  <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block">
                    HIGH-FIDELITY ROBOTIC STRUCTURE ILLUSTRATION
                  </span>
                </div>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800/60 gap-1 shrink-0">
                <button
                  onClick={() => setViewMode("visual")}
                  className={`px-2.5 py-1 rounded font-mono text-[9px] uppercase tracking-wide font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "visual"
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Visual Reference
                </button>
                <button
                  onClick={() => setViewMode("interactive")}
                  className={`px-2.5 py-1 rounded font-mono text-[9px] uppercase tracking-wide font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "interactive"
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Interactive Simulator
                </button>
              </div>
            </div>

            {/* DYNAMIC ILLUSTRATION IMAGE VIEWPORT */}
            <div className={`flex-1 flex flex-col justify-center items-center py-2 relative min-h-[220px] ${viewMode === "visual" ? "" : "hidden"}`}>
              <div className="w-full rounded-lg border border-slate-800/80 overflow-hidden relative group">
                <img
                  src={activeCategory.id === "educational" ? "/src/assets/images/ev3_lego_educational_1780908973187.png" :
                       activeCategory.id === "mobile" ? "/src/assets/images/delivery_mobile_1780908987232.png" :
                       activeCategory.id === "manipulator" ? "/src/assets/images/industrial_manipulator_1780909002493.png" :
                       activeCategory.id === "aerial" ? "/src/assets/images/quadcopter_drone_1780909026044.png" :
                       activeCategory.id === "walking" ? "/src/assets/images/quadruped_spot_1780909040336.png" :
                       "/src/assets/images/humanoid_optimus_1780909055734.png"}
                  alt={activeCategory.name}
                  className="w-full h-[240px] md:h-[300px] object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
                {/* Elegant dark overlay gradient at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent pointer-events-none" />
                
                {/* Visual Label */}
                <div className="absolute bottom-3 left-3 bg-slate-950/95 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800/80 font-mono text-[9px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 font-bold uppercase">MODE:</span> HIGH-FIDELITY SCHEMATIC CAPTURE
                </div>
              </div>
            </div>

            {/* Bypassing simulator views and controls visually */}
            <div className={viewMode === "interactive" ? "" : "hidden"}>
              {/* DYNAMIC VIEWPORTS PER ROBOT CATEGORY */}
              <div className="flex-1 flex flex-col justify-center items-center py-4 relative min-h-[220px]">
                
                {/* Category 1: Educational Micro Line Tracker */}
                {activeCategory.id === "educational" && (
                <div className="w-full max-w-md h-full flex flex-col justify-between items-center gap-4">
                  <svg viewBox="0 0 400 160" className="w-full max-w-sm h-36 bg-slate-950 border border-slate-900 rounded-xl">
                    {/* Path representing the curve to track */}
                    <path d="M 20 80 Q 200 120 380 80" fill="none" stroke="#1f2937" strokeWidth="24" strokeLinecap="round" />
                    <path d="M 20 80 Q 200 120 380 80" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                    
                    {/* Position target line spot */}
                    <circle cx={200 + linePosition} cy={80 + Math.sin((200 + linePosition) / 80) * 15} r="4" fill="#60a5fa" />
                    
                    {/* Robot buggy shape */}
                    <g transform={`translate(${200 + linePosition * 0.9}, ${70 + Math.sin((200 + linePosition * 0.9) / 80) * 12})`}>
                      {/* Chassis */}
                      <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                      {/* Left wheel */}
                      <rect x="-18" y="-16" width="10" height="4" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
                      {/* Right wheel */}
                      <rect x="-18" y="12" width="10" height="4" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
                      
                      {/* Left sensor line light beam */}
                      <line x1="20" y1="-8" x2="28" y2="-8" stroke={linePosition > 0 ? "#f43f5e" : "#10b981"} strokeWidth="1" />
                      <circle cx="28" cy="-8" r="2" fill={linePosition > 0 ? "#f43f5e" : "#10b981"} />
                      
                      {/* Right sensor line light beam */}
                      <line x1="20" y1="8" x2="28" y2="8" stroke={linePosition < 0 ? "#f43f5e" : "#10b981"} strokeWidth="1" />
                      <circle cx="28" cy="8" r="2" fill={linePosition < 0 ? "#f43f5e" : "#10b981"} />
                      
                      {/* Battery Pack */}
                      <rect x="-12" y="-6" width="16" height="12" fill="#334155" />
                      <span className="text-[5px] text-white font-bold opacity-30 select-none pointer-events-none">BAT</span>

                      {/* Moving vector velocity arrow */}
                      <path d="M 24 0 L 36 0 M 32 -4 L 36 0 L 32 4" stroke="#38bdf8" strokeWidth="1" fill="none" />
                    </g>
                  </svg>
                  
                  {/* Live telemetry console feedback controls */}
                  <div className="grid grid-cols-2 gap-4 w-full text-slate-400 font-mono text-[9px] bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>LEFT MOTOR VOLTS: <span className="text-cyan-400 font-bold">{(1.2 + (leftMotor * 0.038)).toFixed(2)} Volts</span></div>
                      <div>RIGHT MOTOR VOLTS: <span className="text-sky-400 font-bold">{(1.2 + (rightMotor * 0.038)).toFixed(2)} Volts</span></div>
                      <div>STEER VELOCITY: <span className="text-amber-400 font-bold">{leftMotor - rightMotor} deg/s</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>LEFT SENSOR REFLECT: <span className={linePosition > 0 ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                        {linePosition > 0 ? "0.22V - DARK" : "4.82V - CLEAR"}
                      </span></div>
                      <div>RIGHT SENSOR REFLECT: <span className={linePosition < 0 ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>
                        {linePosition < 0 ? "0.22V - DARK" : "4.82V - CLEAR"}
                      </span></div>
                      <div>SAMPLING STATUS: <span className="text-emerald-400 font-semibold">982 Hz OK</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 2: Wheeled Explorer Radar Rover */}
              {activeCategory.id === "mobile" && (
                <div className="w-full max-w-sm h-full flex flex-col justify-between items-center gap-3">
                  <svg viewBox="0 0 320 150" className="w-full h-34 bg-slate-950 border border-slate-900 rounded-xl">
                    {/* Obstacle wall boundary */}
                    <rect x="250" y="20" width="10" height="110" fill="#334155" stroke="#475569" rx="1.5" />
                    
                    {/* Safe zone boundary ticks */}
                    <line x1={obstacleDistance} y1="20" x2={obstacleDistance} y2="130" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,3" className="opacity-40" />

                    {/* Ultrasonic radar emitter beam cone */}
                    <path 
                      d={`M ${80 + 36} 75 L 250 40 L 250 110 Z`} 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="0.5" 
                      strokeDasharray="2,4"
                      className="opacity-30" 
                    />
                    
                    {/* Scanning sine wave curves */}
                    <path 
                      d={`M ${120} 60 Q ${160} 75 ${120} 90`} 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="1.5" 
                      className="opacity-70 animate-pulse" 
                      transform={`translate(${sonarAngle * 0.15}, 0)`}
                    />

                    {/* The wheeled Rover body */}
                    <g transform="translate(60, 45)">
                      {/* Heavy Chassis base */}
                      <rect x="0" y="8" width="56" height="44" rx="6" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                      
                      {/* Wheels */}
                      {/* Left top wheel */}
                      <rect x="6" y="-2" width="14" height="10" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                      {/* Left bottom wheel */}
                      <rect x="6" y="52" width="14" height="10" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                      {/* Right top wheel */}
                      <rect x="36" y="-2" width="14" height="10" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                      {/* Right bottom wheel */}
                      <rect x="36" y="52" width="14" height="10" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                      
                      {/* Rotating LiDAR radar tower */}
                      <circle cx="28" cy="30" r="12" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
                      <line cx="28" cy="30" x1="28" y1="30" x2={28 + Math.cos((sonarAngle * Math.PI) / 180) * 12} y2={30 + Math.sin((sonarAngle * Math.PI) / 180) * 12} stroke="#06b6d4" strokeWidth="2" />
                      
                      {/* GPS Antenna dot */}
                      <circle cx="10" cy="20" r="3" fill="#f43f5e" />
                    </g>

                    {/* Distance metrics overlay */}
                    <text x={84 + obstacleDistance / 2} y="115" fill="#22d3ee" className="font-mono text-[7px] text-center font-bold">
                      RANGE: {Math.round(obstacleDistance)} mm
                    </text>
                  </svg>

                  {/* Telemetry output metrics console */}
                  <div className="grid grid-cols-2 gap-3 w-full text-slate-400 font-mono text-[9.5px] bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>LIDAR SPEED: <span className="text-cyan-400 font-bold">{roverScanning ? "320 RPM ( Sweep )" : "0 RPM ( Standby )"}</span></div>
                      <div>COLLISION LIMIT: <span className="text-rose-450 text-rose-400 font-extrabold">{obstacleDistance < 80 ? "⚠️ ABORT TARGET LIMIT" : "✓ NOMINAL RANGE"}</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>ESTIMATED X: <span className="text-indigo-400 font-bold">142.18 m</span></div>
                      <div>ESTIMATED Y: <span className="text-indigo-400 font-bold">89.44 m</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 3: SCARA industrial articulated manipulator */}
              {activeCategory.id === "manipulator" && (
                <div className="w-full max-w-sm h-full flex flex-col justify-between items-center gap-3">
                  <svg viewBox="0 0 320 150" className="w-full h-34 bg-slate-950 border border-slate-900 rounded-xl">
                    {/* Grid background */}
                    <line x1="160" y1="0" x2="160" y2="150" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="110" x2="320" y2="110" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />

                    {/* Joint coordinate details */}
                    <g transform="translate(160, 110)">
                      {/* Base stand anchor */}
                      <rect x="-18" y="0" width="36" height="24" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                      <line x1="-24" y1="24" x2="24" y2="24" stroke="#3b82f6" strokeWidth="2.5" />
                      
                      {/* Arm 1 Segment */}
                      {(() => {
                        const r1 = 54;
                        const rad1 = (armAngleJoint1 * Math.PI) / 180;
                        const j1_x = r1 * Math.cos(rad1);
                        const j1_y = -r1 * Math.sin(rad1);
                        
                        const r2 = 44;
                        const rad2 = ((armAngleJoint1 + armAngleJoint2) * Math.PI) / 180;
                        const j2_x = j1_x + r2 * Math.cos(rad2);
                        const j2_y = j1_y - r2 * Math.sin(rad2);

                        return (
                          <g>
                            {/* Link 1 bone */}
                            <line x1="0" y1="0" x2={j1_x} y2={j1_y} stroke="#3b82f6" strokeWidth="7.5" strokeLinecap="round" />
                            <line x1="0" y1="0" x2={j1_x} y2={j1_y} stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                            
                            {/* Joint 1 Hub */}
                            <circle cx="0" cy="0" r="7.5" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                            <circle cx="0" cy="0" r="2.5" fill="#fff" />
                            
                            {/* Link 2 bone */}
                            <line x1={j1_x} y1={j1_y} x2={j2_x} y2={j2_y} stroke="#1d4ed8" strokeWidth="5.5" strokeLinecap="round" />
                            
                            {/* Joint 2 Hub */}
                            <circle cx={j1_x} cy={j1_y} r="5.5" fill="#1e293b" stroke="#1d4ed8" strokeWidth="1.5" />
                            <circle cx={j1_x} cy={j1_y} r="1.5" fill="#3b82f6" />
                            
                            {/* Gripper Wrist Assembly */}
                            <g transform={`translate(${j2_x}, ${j2_y}) rotate(${-90 - armAngleJoint1 - armAngleJoint2})`}>
                              {/* Wrist block */}
                              <rect x="-6" y="-3" width="12" height="6" rx="1.5" fill="#334155" />
                              <line x1="0" y1="3" x2="0" y2="10" stroke="#475569" strokeWidth="2" />
                              
                              {/* Active Gripper clamping jaws */}
                              <path d={gripperClosed ? "M -4,10 L -1,13 L -1,17" : "M -6,10 L -3,13 L -3,17"} stroke="#94a3b8" strokeWidth="1.5" fill="none" />
                              <path d={gripperClosed ? "M 4,10 L 1,13 L 1,17" : "M 6,10 L 3,13 L 3,17"} stroke="#94a3b8" strokeWidth="1.5" fill="none" />
                              
                              {/* Active payload block */}
                              {gripperClosed && (
                                <rect x="-4" y="16" width="8" height="8" fill="#f59e0b" rx="1" stroke="#fff" strokeWidth="0.5" />
                              )}
                            </g>
                          </g>
                        );
                      })()}
                    </g>
                  </svg>
                  
                  {/* Control parameters readout */}
                  <div className="grid grid-cols-2 gap-3 w-full text-slate-400 font-mono text-[9.5px] bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>THETA 1 (θ1): <span className="text-cyan-400 font-bold">{armAngleJoint1}°</span></div>
                      <div>THETA 2 (θ2): <span className="text-cyan-400 font-bold">{armAngleJoint2}°</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>GRIPPER STATE: <span className={gripperClosed ? "text-amber-400 font-bold animate-pulse" : "text-slate-500 font-medium"}>
                        {gripperClosed ? "ENGAGED ( SUCTION )" : "VACANT ( OPEN )"}
                      </span></div>
                      <div>SOLVER INTEGRATION: <span className="text-emerald-450 text-emerald-400 font-bold">100% STABLE</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 4: Quadcopter Hover & Propellers */}
              {activeCategory.id === "aerial" && (
                <div className="w-full max-w-sm h-full flex flex-col justify-between items-center gap-3">
                  <svg viewBox="0 0 320 150" className="w-full h-34 bg-slate-950 border border-slate-900 rounded-xl">
                    {/* Alititude guide notches on the left */}
                    <line x1="30" y1="20" x2="40" y2="20" stroke="#475569" strokeWidth="1" />
                    <line x1="30" y1="70" x2="40" y2="70" stroke="#475569" strokeWidth="1" />
                    <line x1="30" y1="120" x2="40" y2="120" stroke="#475569" strokeWidth="1" />
                    <text x="12" y="73" fill="#64748b" className="font-mono text-[7px]">ALT_REF</text>
                    
                    {/* Land floor */}
                    <line x1="0" y1="134" x2="320" y2="134" stroke="#1e293b" strokeWidth="1.5" />

                    {/* Dynamic drone shape floating vertically depending on altitude state */}
                    {(() => {
                      // Scale altitude variable to visual screen limits
                      const y_pos = 110 - (currentAlt * 0.6);
                      const propScaleX1 = Math.abs(Math.sin((propAngle * Math.PI) / 180)) * 18;
                      const propScaleX2 = Math.abs(Math.cos((propAngle * Math.PI) / 180)) * 18;

                      return (
                        <g transform={`translate(160, ${y_pos})`}>
                          {/* Alititude shadow marker on land floor */}
                          <ellipse cx="0" cy={134 - y_pos} rx={Math.max(4, 50 - (currentAlt * 0.2))} ry={Math.max(2, 6 - (currentAlt * 0.05))} fill="#030712" className="opacity-70" />

                          {/* Carbon cross arms */}
                          <line x1="-42" y1="3" x2="42" y2="3" stroke="#6366f1" strokeWidth="3" />
                          
                          {/* Central MCU Dome fuselage */}
                          <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
                          <circle cx="0" cy="-2" r="6" fill="#818cf8" className="opacity-20 animate-pulse" />

                          {/* Left motor housing */}
                          <rect x="-45" y="-4" width="6" height="12" rx="1" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />
                          {/* Right motor housing */}
                          <rect x="39" y="-4" width="6" height="12" rx="1" fill="#1e293b" stroke="#6366f1" strokeWidth="1" />

                          {/* Propeller 1 (Left rotating blade visualizer) */}
                          <line x1={-42 - propScaleX1} y1="-10" x2={-42 + propScaleX1} y2="-10" stroke="#94a3b8" strokeWidth="1.5" />
                          <circle cx="-42" cy="-10" r="1.5" fill="#334155" />

                          {/* Propeller 2 (Right rotating blade visualizer) */}
                          <line x1={42 - propScaleX2} y1="-10" x2={42 + propScaleX2} y2="-10" stroke="#94a3b8" strokeWidth="1.5" />
                          <circle cx="42" cy="-10" r="1.5" fill="#334155" />
                          
                          {/* Dynamic Thrust vector jet lines */}
                          {aerialThrottle > 20 && isHoverArmed && (
                            <g>
                              <line x1="-42" y1="12" x2="-42" y2={12 + (aerialThrottle * 0.25)} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="1,2" className="opacity-70" />
                              <line x1="42" y1="12" x2="42" y2={12 + (aerialThrottle * 0.25)} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="1,2" className="opacity-70" />
                            </g>
                          )}
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Throttle mixer control telemetry */}
                  <div className="grid grid-cols-2 gap-3 w-full text-slate-400 font-mono text-[9.5px] bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>THROTTLE TARGET: <span className="text-cyan-400 font-bold">{aerialThrottle} %</span></div>
                      <div>PROPELLER ROTATION: <span className="text-cyan-400 font-bold">{Math.round(aerialThrottle * 164)} RPM</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>DRONE STATUS: <span className={isHoverArmed ? "text-emerald-400 font-bold animate-pulse" : "text-rose-450 text-rose-400 font-bold font-semibold"}>
                        {isHoverArmed ? "✓ ARMED ( AIRBORNE )" : "⚠️ SAFE ( POWERLOCK )"}
                      </span></div>
                      <div>TELEMETRY ALTITUDE: <span className="text-indigo-400 font-bold">{currentAlt} mm</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 5: Walking Robot Quadruped trot gait */}
              {activeCategory.id === "walking" && (
                <div className="w-full max-w-sm h-full flex flex-col justify-between items-center gap-3">
                  <svg viewBox="0 0 320 150" className="w-full h-34 bg-slate-950 border border-slate-900 rounded-xl">
                    <line x1="0" y1="120" x2="320" y2="120" stroke="#1e293b" strokeWidth="1" />
                    
                    {/* Isometric Walking dog coordinate */}
                    {(() => {
                      // Leg oscillation kinematics depending on phase
                      const stepYOffset1 = Math.sin(gaitPhase) * 16;
                      const stepXOffset1 = Math.cos(gaitPhase) * 12;
                      
                      const stepYOffset2 = Math.sin(gaitPhase + Math.PI) * 16;
                      const stepXOffset2 = Math.cos(gaitPhase + Math.PI) * 12;

                      return (
                        <g transform="translate(160, 75)">
                          {/* Dynamic ground collision indicator dots */}
                          <circle cx={-30 + stepXOffset1} cy={45 + Math.max(0, stepYOffset1)} r="3" fill="#ec4899" className="opacity-40" />
                          <circle cx={30 + stepXOffset2} cy={45 + Math.max(0, stepYOffset2)} r="3" fill="#ec4899" className="opacity-40" />

                          {/* Body torso plate */}
                          <rect x="-44" y="-14" width="88" height="24" rx="6" fill="#0f172a" stroke="#ec4899" strokeWidth="2.5" />
                          
                          {/* Smart battery/IMU block on top */}
                          <rect x="-18" y="-24" width="36" height="10" rx="2" fill="#1e293b" stroke="#db2777" strokeWidth="1" />
                          <circle cx="8" cy="-19" r="1.5" fill="#10b981" />

                          {/* Front leg (Leg 1) swinging */}
                          <line x1="-30" y1="10" x2={-30 + stepXOffset1} y2={45 + Math.max(0, stepYOffset1)} stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="-30" cy="10" r="4.5" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5" />
                          
                          {/* Back leg (Leg 2) swinging */}
                          <line x1="30" y1="10" x2={30 + stepXOffset2} y2={45 + Math.max(0, stepYOffset2)} stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="30" cy="10" r="4.5" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5" />
                          
                          {/* Front Knee joint joint details */}
                          <circle cx={-30 + stepXOffset1 * 0.5} cy={27 + Math.max(0, stepYOffset1) * 0.5} r="2.5" fill="#fff" />
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Gait speed parameters metrics */}
                  <div className="grid grid-cols-2 gap-3 w-full text-slate-400 font-mono text-[9.5px] bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>GAIT MOTIF: <span className="text-cyan-400 font-bold">{selectedWalkGait} Loop</span></div>
                      <div>GAIT PHASE STRIKE: <span className="text-cyan-400 font-bold">{(gaitPhase).toFixed(2)} Rads</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>WALK LOOPS: <span className={isWalking ? "text-emerald-400 font-bold animate-pulse" : "text-rose-500 font-bold"}>
                        {isWalking ? "✓ ACTIVE STRIDE CYCLE" : "⚠️ STOPPED CYCLE"}
                      </span></div>
                      <div>JOINT SERVO FREQ: <span className="text-indigo-400 font-bold">{(walkingSpeed * 12.5).toFixed(1)} Hz</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 6: Humanoid robot center of mass alignment */}
              {activeCategory.id === "humanoid" && (
                <div className="w-full max-w-sm h-full flex flex-col justify-between items-center gap-3">
                  <svg viewBox="0 0 320 150" className="w-full h-34 bg-slate-950 border border-slate-900 rounded-xl">
                    {/* Platform balance beam adjusting dynamically based on tilt slider */}
                    <g transform="translate(160, 110)">
                      <line x1="-100" y1={-platformTilt} x2="100" y2={platformTilt} stroke="#475569" strokeWidth="4" />
                      <circle cx="0" cy="0" r="4" fill="#64748b" />
                      
                      {/* Dynamic Humanoid positioning */}
                      {(() => {
                        // Calculate stabilizing lean offset to counter tilt
                        // Humanoid bends hips back to keep Center of Mass centered
                        const leanJointOffset = humanoidActiveBalance ? (platformTilt * -0.7) : 0;
                        const armOsc = humanoidWaveHand ? Math.sin(humanoidTime * 5) * 20 : 0;

                        return (
                          <g transform={`rotate(${humanoidActiveBalance ? 0 : platformTilt})`}>
                            {/* Torso link */}
                            <line x1="0" y1="-10" x2={leanJointOffset * 0.4} y2="-55" stroke="#a855f7" strokeWidth="5.5" strokeLinecap="round" />
                            
                            {/* Head dome */}
                            <circle cx={leanJointOffset * 0.4} cy="-68" r="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
                            <circle cx={leanJointOffset * 0.4 + 2} cy="-68" r="1.5" fill="#22d3ee" className="animate-pulse" /> {/* Camera eye */}

                            {/* Center of Mass (CoM) yellow target overlay marker */}
                            <circle cx={leanJointOffset * 0.2} cy="-35" r="5.5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" className="animate-pulse" />
                            <line x1={leanJointOffset * 0.2} y1="-45" x2={leanJointOffset * 0.2} y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                            <text x={leanJointOffset * 0.2 + 8} y="-32" fill="#f59e0b" className="font-mono text-[6.5px] font-bold">CoM</text>

                            {/* Wave arm axis link */}
                            <line x1={leanJointOffset * 0.4 - 3} y1="-50" x2={leanJointOffset * 0.4 - 20} y2={-50 + armOsc} stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />

                            {/* Hip joints */}
                            <circle cx="0" cy="-10" r="4.5" fill="#3b4252" stroke="#a855f7" strokeWidth="1" />

                            {/* Left leg link */}
                            <line x1="-6" y1="-8" x2="-8" y2="10" stroke="#a855f7" strokeWidth="4" />
                            
                            {/* Right leg link */}
                            <line x1="6" y1="-8" x2="8" y2="10" stroke="#a855f7" strokeWidth="4" />
                          </g>
                        );
                      })()}
                    </g>
                  </svg>

                  {/* Humanoid active coordinates parameters */}
                  <div className="grid grid-cols-2 gap-3 w-full text-slate-400 font-mono text-[9.5px] bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>PLATFORM TILT: <span className={Math.abs(platformTilt) > 20 ? "text-rose-400 font-bold" : "text-cyan-400 font-bold"}>{platformTilt}°</span></div>
                      <div>COM DEV DETECT: <span className="text-cyan-400 font-bold">{Math.abs(platformTilt * 0.18).toFixed(2)} mm</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>STABILIZER REGULA: <span className={humanoidActiveBalance ? "text-emerald-400 font-bold animate-pulse" : "text-rose-500 font-bold"}>
                        {humanoidActiveBalance ? "✓ ZMP ENFORCED" : "⚠️ UNBALANCED OFF"}
                      </span></div>
                      <div>WAVE RECREATION: <span className="text-indigo-400 font-bold">{humanoidWaveHand ? "WAVING ACTIVE" : "STABLE IDLE"}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 7: AI-Powered vision sorting system */}
              {activeCategory.id === "ai-powered" && (
                <div className="w-full max-w-sm h-full flex flex-col justify-between items-center gap-3">
                  <svg viewBox="0 0 320 150" className="w-full h-34 bg-slate-950 border border-slate-900 rounded-xl">
                    {/* Conveyor track */}
                    <rect x="10" y="90" width="300" height="15" fill="#1e293b" stroke="#334155" rx="2" />
                    
                    {/* Floating sorting block moving on conveyor */}
                    <g transform={`translate(${conveyorBlockX}, 74)`}>
                      <rect width="22" height="14" fill="#020617" stroke={aiDetectedCore ? aiDetectedCore.color_hex : "#10b981"} strokeWidth="1.5" rx="2" />
                      <line x1="4" y1="4" x2="18" y2="4" stroke="#64748b" strokeWidth="1" />
                      <circle cx="8" cy="10" r="1.5" fill="#64748b" />
                    </g>

                    {/* Camera view cone highlighting conveyor block */}
                    {conveyorBlockX > 100 && conveyorBlockX < 180 && (
                      <g>
                        <polygon points="160,20 125,75 195,75" fill="rgba(16,185,129,0.12)" stroke="none" />
                        <line x1="160" y1="20" x2="125" y2="75" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" />
                        <line x1="160" y1="20" x2="195" y2="75" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" />
                        
                        {/* Live AI recognition tag floating inside simulator */}
                        {aiDetectedCore && (
                          <g transform="translate(110, 42)">
                            <rect width="90" height="20" rx="4" fill="rgba(2,6,23,0.85)" stroke={aiDetectedCore.color_hex} strokeWidth="1" />
                            <text x="5" y="12" fill={aiDetectedCore.color_hex} className="font-mono text-[7px] font-black uppercase">
                              {aiDetectedCore.label} ({Math.round(aiDetectedCore.confidence * 100)}%)
                            </text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* The smart camera tower */}
                    <rect x="156" y="5" width="8" height="15" fill="#334155" />
                    <circle cx="160" cy="20" r="6.5" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                    <circle cx="160" cy="20" r="2.5" fill="#818cf8 animate-pulse" />
                  </svg>

                  {/* AI detection telemetry console */}
                  <div className="grid grid-cols-2 gap-3 w-full text-slate-400 font-mono text-[9.5px] bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>VISION ENGINE: <span className="text-cyan-400 font-bold">{aiModelWeightSelect}</span></div>
                      <div>ACTIVE INFERENCE: <span className="text-cyan-400 font-bold">12 ms / Frame</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>DECISION PIPELINE: <span className={activeSortingTask ? "text-emerald-400 font-bold animate-pulse" : "text-rose-500 font-bold"}>
                        {activeSortingTask ? "✓ CONVEYOR SORTING RUN" : "⚠️ PIPELINE STANDBY"}
                      </span></div>
                      <div>CYCLE COUNTER: <span className="text-indigo-400 font-bold">{aiScanCycles} classified</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category 8: Advanced Swarm orbit mesh network */}
              {activeCategory.id === "advanced" && (
                <div className="w-full max-w-sm h-full flex flex-col justify-between items-center gap-3">
                  <svg viewBox="0 0 320 150" className="w-full h-34 bg-slate-950 border border-slate-900 rounded-xl">
                    {/* Central anchor station beacon symbol */}
                    <circle cx="160" cy="75" r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="160" cy="75" r="4" fill="#eed055" />
                    <text x="145" y="48" fill="#f59e0b" className="font-mono text-[7px] font-black">BASE_LINK</text>

                    {/* Rotating orbit coordinates representing Swarm bots */}
                    {Array.from({ length: swarmSize }).map((_, idx) => {
                      const spacing = (Math.PI * 2) / swarmSize;
                      const activeOrbitAngle = advancedTime * 1.5 + (idx * spacing);
                      const orbitRadius = 45 + (idx % 2 === 0 ? 12 : -5);
                      
                      const botX = 160 + Math.cos(activeOrbitAngle) * orbitRadius;
                      const botY = 75 + Math.sin(activeOrbitAngle) * orbitRadius * 0.7;

                      return (
                        <g key={idx}>
                          {/* Interconnecting dynamic mesh networking lines to neighbors */}
                          {idx < swarmSize - 1 && (
                            (() => {
                              const nextAngle = advancedTime * 1.5 + ((idx + 1) * spacing);
                              const nextRadius = 45 + ((idx + 1) % 2 === 0 ? 12 : -5);
                              const nextX = 160 + Math.cos(nextAngle) * nextRadius;
                              const nextY = 75 + Math.sin(nextAngle) * nextRadius * 0.7;
                              return (
                                <line x1={botX} y1={botY} x2={nextX} y2={nextY} stroke="#fcd34d" strokeWidth="0.5" strokeDasharray="1,2" className="opacity-40" />
                              );
                            })()
                          )}
                          
                          {/* Central beacon connection wire lines */}
                          <line x1="160" y1="75" x2={botX} y2={botY} stroke="#f59e0b" strokeWidth="0.5" className="opacity-25" />

                          {/* Swarm bot micro triangle */}
                          <polygon points={`${botX},${botY-4} ${botX-4},${botY+4} ${botX+4},${botY+4}`} fill="#10b981" stroke="#fff" strokeWidth="0.5" />
                          <circle cx={botX} cy={botY} r="1.5" fill="#f59e0b" />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Swarm parameters console */}
                  <div className="grid grid-cols-2 gap-3 w-full text-slate-400 font-mono text-[9.5px] bg-slate-950/80 p-2 rounded-lg border border-slate-900">
                    <div className="space-y-1">
                      <div>SWARM MESH CAPACITY: <span className="text-cyan-400 font-bold">{swarmSize} nodes</span></div>
                      <div>BEACON STACK STATE: <span className="text-cyan-400 font-bold">{swarmBeaconMode}</span></div>
                    </div>
                    <div className="space-y-1">
                      <div>COMMUNICATION LOSS: <span className="text-emerald-400 font-bold">0.02% ( STABLE )</span></div>
                      <div>DECENTRALIZED SYNC: <span className="text-indigo-400 font-bold">14.1 ms OK</span></div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Visualizer Footer Controls Sidebar */}
            <div className="border-t border-slate-800/60 pt-4 mt-2 flex justify-between items-center flex-wrap gap-4">
              
              {/* Educational parameter controls sliders */}
              {activeCategory.id === "educational" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[200px] flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">TRACK_OFFSET:</span>
                    <input 
                      type="range" 
                      min="-90" 
                      max="90" 
                      value={linePosition} 
                      onChange={(e) => {
                        setLinePosition(parseInt(e.target.value));
                        setIsLineAutoMoving(false); // Disable auto-tracking on manual drag
                      }}
                      className="flex-1 accent-sky-500 h-1 bg-slate-800 rounded-lg outline-none"
                    />
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => setIsLineAutoMoving(!isLineAutoMoving)}
                      className="py-1 px-2.5 rounded border border-sky-500/20 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-mono text-[9px] uppercase font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {isLineAutoMoving ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {isLineAutoMoving ? "Pause Auto Osc" : "Resume Tracker"}
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile explorer parameter adjustments */}
              {activeCategory.id === "mobile" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[200px] flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">OBSTACLE_COORD:</span>
                    <input 
                      type="range" 
                      min="40" 
                      max="210" 
                      value={obstacleDistance}
                      onChange={(e) => setObstacleDistance(parseInt(e.target.value))}
                      className="flex-1 accent-cyan-500 h-1 bg-slate-805 bg-slate-800 rounded-lg outline-none"
                    />
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => setRoverScanning(!roverScanning)}
                      className="py-1 px-2.5 rounded border border-cyan-505/20 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-mono text-[9px] uppercase font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {roverScanning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {roverScanning ? "Pause LiDAR sweep" : "Sweep scan sweep"}
                    </button>
                  </div>
                </div>
              )}

              {/* Articulated joint manipulator parameters */}
              {activeCategory.id === "manipulator" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[150px] flex items-center gap-2">
                    <span className="font-mono text-[9px] text-slate-400 shrink-0">θ1_Joint:</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="140" 
                      value={armAngleJoint1}
                      onChange={(e) => setArmAngleJoint1(parseInt(e.target.value))}
                      className="flex-1 accent-blue-500 h-1 bg-slate-800 rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[150px] flex items-center gap-2">
                    <span className="font-mono text-[9px] text-slate-400 shrink-0">θ2_Forearm:</span>
                    <input 
                      type="range" 
                      min="-90" 
                      max="20" 
                      value={armAngleJoint2}
                      onChange={(e) => setArmAngleJoint2(parseInt(e.target.value))}
                      className="flex-1 accent-indigo-500 h-1 bg-slate-800 rounded-lg outline-none"
                    />
                  </div>
                  <div className="shrink-0 select-none outline-none">
                    <button
                      onClick={() => setGripperClosed(!gripperClosed)}
                      className="py-1 px-2.5 rounded border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-mono text-[9px] uppercase font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3 h-3 text-blue-400" />
                      {gripperClosed ? "VACUUM_RELEASE" : "VACUUM_ENGAGE"}
                    </button>
                  </div>
                </div>
              )}

              {/* Aerial Drone speed slider controls */}
              {activeCategory.id === "aerial" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[180px] flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">PWM_THROTTLE:</span>
                    <input 
                      type="range" 
                      min="20" 
                      max="110" 
                      value={aerialThrottle}
                      onChange={(e) => {
                        setAerialThrottle(parseInt(e.target.value));
                        if (parseInt(e.target.value) > 20) {
                          setIsHoverArmed(true);
                        }
                      }}
                      className="flex-1 accent-indigo-500 h-1 bg-slate-800 rounded-lg outline-none"
                    />
                    <span className="text-[9px] font-mono font-bold text-sky-400 block shrink-0">{aerialThrottle}%</span>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => {
                        setIsHoverArmed(!isHoverArmed);
                        if (!isHoverArmed) {
                          setAerialThrottle(65);
                        } else {
                          setAerialThrottle(20);
                        }
                      }}
                      className="py-1 px-2.5 rounded border border-indigo-505/20 bg-indigo-505/10 hover:bg-indigo-505/20 text-indigo-400 font-mono text-[9px] uppercase font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {isHoverArmed ? "disarm dome flight" : "ARM DOME PROP"}
                    </button>
                  </div>
                </div>
              )}

              {/* walking quadruped gait controls */}
              {activeCategory.id === "walking" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[150px] flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">STRIDE_VELOCITY:</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      value={walkingSpeed}
                      onChange={(e) => setWalkingSpeed(parseInt(e.target.value))}
                      className="flex-1 accent-pink-500 h-1 bg-slate-800 rounded-lg outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {["Trot", "Tripod", "Crawl"].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedWalkGait(g as any)}
                        className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer border ${
                          selectedWalkGait === g
                            ? "border-pink-500 bg-pink-500/20 text-pink-400 font-bold"
                            : "border-slate-850 bg-slate-950 text-slate-499 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsWalking(!isWalking)}
                      className="py-1 px-2.5 rounded border border-pink-500/20 bg-pink-500/10 hover:bg-pink-555/20 text-pink-400 font-mono text-[9px] uppercase font-bold active:scale-95 transition-all cursor-pointer"
                    >
                      {isWalking ? "HALT" : "WALK"}
                    </button>
                  </div>
                </div>
              )}

              {/* Humanoid balance platform tilting adjustment */}
              {activeCategory.id === "humanoid" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[180px] flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">BEAM_TILT_DEG:</span>
                    <input 
                      type="range" 
                      min="-30" 
                      max="30" 
                      value={platformTilt}
                      onChange={(e) => setPlatformTilt(parseInt(e.target.value))}
                      className="flex-1 accent-purple-500 h-1 bg-slate-800 rounded-lg outline-none"
                    />
                    <span className="text-[9px] font-mono font-bold text-purple-400 block shrink-0">{platformTilt}°</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHumanoidActiveBalance(!humanoidActiveBalance)}
                      className={`text-[9px] font-mono px-2.5 py-1 rounded border cursor-pointer select-none ${
                        humanoidActiveBalance
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      {humanoidActiveBalance ? "ZMP CALIBRATED" : "ZMP SUSPENDED"}
                    </button>
                    <button
                      onClick={() => {
                        setHumanoidWaveHand(true);
                        setTimeout(() => setHumanoidWaveHand(false), 2000);
                      }}
                      className="py-1 px-2.5 rounded border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-mono text-[9px] uppercase font-bold active:scale-95 transition-all cursor-pointer"
                    >
                      WAVE_HAND
                    </button>
                  </div>
                </div>
              )}

              {/* AI Powered sorting block toggles */}
              {activeCategory.id === "ai-powered" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[200px] flex items-center gap-2">
                    <span className="font-mono text-[9px] text-slate-500 shrink-0">AI_MODEL_WEIGHT:</span>
                    {["VisionConvNT", "RLPolicy", "SpatialDense"].map((w) => (
                      <button
                        key={w}
                        onClick={() => setAiModelWeightSelect(w as any)}
                        className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded border cursor-pointer ${
                          aiModelWeightSelect === w
                            ? "border-emerald-500 bg-emerald-500/25 text-emerald-400 font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={toggleConveyorSorting}
                      className="py-1 px-2.5 rounded border border-emerald-555/20 bg-emerald-500/10 hover:bg-emerald-555/20 text-emerald-400 font-mono text-[9px] uppercase font-bold active:scale-95 transition-all cursor-pointer"
                    >
                      {activeSortingTask ? "Stop conveyor sorting" : "LAUNCH CONVEYOR RUN"}
                    </button>
                  </div>
                </div>
              )}

              {/* Advanced Swarm size and telemetry adjustments */}
              {activeCategory.id === "advanced" && (
                <div className="flex flex-wrap items-center gap-4 w-full">
                  <div className="flex-1 min-w-[180px] flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">SWARM_NODES:</span>
                    <input 
                      type="range" 
                      min="3" 
                      max="11" 
                      value={swarmSize}
                      onChange={(e) => setSwarmSize(parseInt(e.target.value))}
                      className="flex-1 accent-amber-500 h-1 bg-slate-805 bg-slate-800 rounded-lg outline-none"
                    />
                    <span className="text-[9px] font-mono font-bold text-amber-400 block shrink-0">{swarmSize} Bots</span>
                  </div>
                  <div className="flex gap-1.5">
                    {["Orbit", "Search", "Align"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSwarmBeaconMode(m as any)}
                        className={`text-[8.5px] font-mono px-2 py-0.5 rounded border cursor-pointer ${
                          swarmBeaconMode === m
                            ? "border-amber-500 bg-amber-500/20 text-amber-400 font-bold"
                            : "border-slate-800 bg-slate-950 text-slate-400"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

          {/* Interactive Specifications Desk & Real-World Applications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Real World Applications Box */}
            <div className="bg-[#030815]/80 border border-slate-800/80 p-4 rounded-xl">
              <span className="font-mono text-[8.5px] text-slate-500 font-extrabold tracking-widest uppercase block mb-2">
                DEPLOYED REAL-WORLD APPLICATIONS
              </span>
              <ul className="space-y-2 text-slate-300 font-sans text-xs">
                {activeCategory.applications.map((app, appIdx) => (
                  <li key={appIdx} className="flex items-start gap-2 leading-relaxed">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Component Bill-of-Materials */}
            <div className="bg-[#030815]/80 border border-slate-800/80 p-4 rounded-xl">
              <span className="font-mono text-[8.5px] text-slate-500 font-extrabold tracking-widest uppercase block mb-2">
                RECONSTRUCTIVE BILL OF MATERIALS (BOM)
              </span>
              <div className="space-y-2 max-h-[125px] overflow-y-auto pr-1">
                {activeCategory.components.map((comp, compIdx) => (
                  <div key={compIdx} className="border-b border-slate-900/40 pb-1.5 last:border-0">
                    <div className="flex justify-between items-center select-none font-mono text-[8px]">
                      <span className="font-bold text-slate-200">{comp.name}</span>
                      <span className={`px-1 rounded uppercase font-bold text-[7px] ${
                        comp.category === "sensor" ? "bg-indigo-500/10 text-indigo-455" :
                        comp.category === "actuator" ? "bg-emerald-500/10 text-emerald-455" :
                        comp.category === "controller" ? "bg-sky-500/10 text-sky-455" :
                        "bg-amber-500/10 text-amber-455"
                      }`}>
                        {comp.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{comp.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
