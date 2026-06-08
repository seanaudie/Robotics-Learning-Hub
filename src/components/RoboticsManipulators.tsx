import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sliders, 
  Sparkles, 
  Play, 
  BookOpen, 
  Info,
  Activity,
  Award,
  Maximize2,
  RefreshCw,
  ChevronRight,
  Calculator,
  X
} from "lucide-react";
import RoboticArmIcon from "./RoboticArmIcon";

// Steps configuration
type StepId = 1 | 2 | 3 | 4 | 5 | 6;

interface StepDetail {
  id: StepId;
  title: string;
  tagline: string;
  badge: string;
}

const stepsList: StepDetail[] = [
  { id: 1, title: "1. Meet the Robotic Arm", tagline: "Inspect the mechanical components, linkages, and joints on a high-precision manipulator.", badge: "Anatomy & Structure" },
  { id: 2, title: "2. How the Arm Moves", tagline: "Discover Degrees of Freedom (DOF) and isolate active joint rotations.", badge: "Degrees of Freedom" },
  { id: 3, title: "3. Understanding Motion", tagline: "Take manual control. Manually calibrating multi-axis link coordinates.", badge: "Manual Calibration" },
  { id: 4, title: "4. Positioning Objects", tagline: "Introduce the Terminal Tool / End Effector. Program automated pick-and-place cycles.", badge: "Path Manipulation" },
  { id: 5, title: "5. Calculation & Kinematics", tagline: "Demystify Forward and Inverse Kinematics with immediate visual targets.", badge: "Mathematical Modeling" },
  { id: 6, title: "6. Types of Robotic Arms", tagline: "Explore the 5 essential configurations of modern industrial manipulators.", badge: "Arm Configurations" }
];

export const stepColors: Record<StepId, { hex: string; text: string; bg: string; border: string; glow: string; hover: string; hoverBorder: string }> = {
  1: { hex: "#06b6d4", text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500", glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]", hover: "hover:text-cyan-300", hoverBorder: "hover:border-cyan-500/55" },
  2: { hex: "#a855f7", text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500", glow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]", hover: "hover:text-purple-300", hoverBorder: "hover:border-purple-500/55" },
  3: { hex: "#f59e0b", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500", glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]", hover: "hover:text-amber-300", hoverBorder: "hover:border-amber-500/55" },
  4: { hex: "#14b8a6", text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500", glow: "shadow-[0_0_15px_rgba(20,184,166,0.15)]", hover: "hover:text-teal-300", hoverBorder: "hover:border-teal-500/55" },
  5: { hex: "#3b82f6", text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", hover: "hover:text-blue-300", hoverBorder: "hover:border-blue-500/55" },
  6: { hex: "#f43f5e", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500", glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]", hover: "hover:text-rose-300", hoverBorder: "hover:border-rose-500/55" }
};

const getStepOverview = (stepId: StepId) => {
  switch (stepId) {
    case 1:
      return {
        iconStatus: "Ready Verified",
        title: "ANATOMY & MECHANICAL STRUCTURE",
        subtitle: "Analyzing mechanical skeleton, linkages, and joints",
        desc: "Industrial manipulators consist of physical linkages (links) and joints that allow structural rotational or translational motion. In our 6-DOF simulation, click parts of the arm to isolate and inspect key mechanical components.",
        stats: [
          { name: "DOF Core", val: "6 Axes" },
          { name: "Base Linkage", val: "Joint 0-1" },
          { name: "Max Payload", val: "12.5 kg" },
          { name: "Link Assembly", val: "Carbon Fiber" }
        ],
        accentColor: "border-cyan-500/20 text-cyan-400"
      };
    case 2:
      return {
        iconStatus: "Active Test",
        title: "DEGREES OF FREEDOM (DOF)",
        subtitle: "Limiting and testing isolated rotational axes",
        desc: "Each degree of freedom corresponds to an independent joint variable (pitch, roll, yaw). Isolate and actuate individual axes to verify that components clear physical limit zones without grinding the gearboxes.",
        stats: [
          { name: "Angular Limit", val: "±150°" },
          { name: "Rotational Resolution", val: "0.024°" },
          { name: "Actuation Type", val: "Direct Drive" },
          { name: "Motor Core", val: "Brushless Servo" }
        ],
        accentColor: "border-purple-500/20 text-purple-400"
      };
    case 3:
      return {
        iconStatus: "Calibrating",
        title: "MANUAL CALIBRATION",
        subtitle: "Configuring multi-axis direct control & joint offsets",
        desc: "Use manual controllers on the left to rotate joints in forward space. This provides direct telemetry feedback on link coordinates, helping technicians align the arm after physical component replacements.",
        stats: [
          { name: "Link 1 Length", val: "40 mm" },
          { name: "Link 2 Length", val: "45 mm" },
          { name: "Calib State", val: "Synchronized" },
          { name: "System Offset", val: "0.00° Null" }
        ],
        accentColor: "border-amber-500/20 text-amber-400"
      };
    case 4:
      return {
        iconStatus: "Programmed Cycle",
        title: "PATH MANIPULATION & PICK-AND-PLACE",
        subtitle: "Defining repetitive coordinate paths for object movement",
        desc: "Run the automated program cycle to watch the arm execute a state-machine path. It moves from hover to pickup position, activates the end effector clamp, swivels to staging B, and deposits the target.",
        stats: [
          { name: "Gripper State", val: "5-axis clamp" },
          { name: "Cycle Rate", val: "12.5 s / cycle" },
          { name: "Path Resolution", val: "Linear Vector" },
          { name: "Solenoid Clamp", val: "10-bit PWM" }
        ],
        accentColor: "border-teal-500/20 text-teal-400"
      };
    case 5:
      return {
        iconStatus: "Calculating",
        title: "MATHEMATICAL KINEMATICS",
        subtitle: "Solving D-H parameters and inverse trigonometry matrices",
        desc: "Forward kinematics calculates the tool x/y/z coordinates from joint angles. Inverse kinematics computes the raw joint angles required to reach a specific coordinate target on our 3D plane.",
        stats: [
          { name: "Solver Mode", val: "Analytic Trig" },
          { name: "D-H Columns", val: "4 Standard" },
          { name: "Reachable Sphere", val: "85 mm" },
          { name: "Error Tol.", val: "<0.05 mm" }
        ],
        accentColor: "border-blue-500/20 text-blue-400"
      };
    case 6:
      return {
        iconStatus: "Ready Active",
        title: "INDUSTRIAL ARM CONFIGURATIONS",
        subtitle: "Key mechanical profiles of modern robotic manipulators",
        desc: "Industrial robots are categorized by their structural architecture, coordinate patterns, and mechanical joint configurations. Explore the five most essential physical arm profiles used in global production.",
        stats: [
          { name: "Articulated", val: "Rotary Multi-Joint" },
          { name: "Cobra SCARA", val: "Inverted Conveyor" },
          { name: "Cartesian", val: "Linear Sliding XYZ" },
          { name: "SCARA", val: "Compliant Assembly" },
          { name: "Delta Linkage", val: "Parallel Spider" }
        ],
        accentColor: "border-rose-500/20 text-[rgb(244,63,94)]"
      };
    default:
      return {
        iconStatus: "Idle",
        title: "UNKNOWN CORE STATE",
        subtitle: "Offline diagnostics",
        desc: "System diagnostic tool overview.",
        stats: [],
        accentColor: "border-slate-800 text-slate-400"
      };
  }
};

const ARM_DETAILS: Record<string, {
  title: string;
  sub: string;
  image: string;
  desc: string;
  how: string;
  spec: string;
  best: string;
}> = {
  articulated: {
    title: "Articulated Arm Manipulator",
    sub: "Human-like multi-jointed flexibility",
    image: "/src/assets/images/articulated_robot_1780735988951.png",
    desc: "The classic general-purpose multi-axis robot. It operates via rotating joints, allowing workheads to pivot freely in full 3D coordinates.",
    how: "An array of 4 to 6 rotary joints mounted on a central swiveling base platform.",
    spec: "6 Rotary Axes • Spherical Work Envelope • Deep Joint Reach",
    best: "Welding car parts, precision spray-painting, and general assembly lines."
  },
  cobra: {
    title: "Cobra SCARA / Arm Profile",
    sub: "Inverted overhead conveyor picker",
    image: "/src/assets/images/cobra_robot_1780736003660.png",
    desc: "A sleek, slim-profile high-speed robot often installed upside-down over conveyors to swap or sort products fast with zero footprint.",
    how: "Dual lightweight parallel links with a specialized low-inertia sweeping wrist pivot.",
    spec: "4 Axes • Compact Overhead Ceiling Gantry Layout • Extreme Speed",
    best: "Rapid package sorting and placing medical vials in tight lab units."
  },
  cartesian: {
    title: "Cartesian / Gantry Robot",
    sub: "Ultimate straight-line coordinate accuracy",
    image: "/src/assets/images/cartesian_robot_1780736017952.png",
    desc: "Constructed of three linear sliding tracks operating on perpendicular X, Y, and Z coordinate axes. It is extremely boxy, stable, and simple.",
    how: "Linear motors and belt slides driving rails mounted in a rigid metal framework.",
    spec: "3 Prismatic Axes • Rectangular Workspace Envelope • Mega Payload capacity",
    best: "3D printers, laser engravers, and overhead warehouse bulk material loaders."
  },
  scara: {
    title: "SCARA Assembly Robot",
    sub: "Compliance-balanced picking and insertion",
    image: "/src/assets/images/scara_robot_1780736033845.png",
    desc: "Designed with horizontal pivot joints, giving the arm massive speed and compliance horizontally while remaining rigidly locked in place vertically.",
    how: "Two parallel pivot links driving lateral placement, and a primary linear shaft plunging vertically.",
    spec: "4 Axes • Cyber Cylindrical Work Envelope • Under 0.01 mm Deviations",
    best: "Inserting electronic circuit board parts and loading small hardware cells."
  },
  delta: {
    title: "Delta Parallel Spider-Robot",
    sub: "Extreme pick-and-pack acceleration",
    image: "/src/assets/images/delta_robot_1780736048784.png",
    desc: "Uses three separate robotic triangular linkages mounted to a central overhead frame, acting together on a single base tool.",
    how: "Parallel mechanical arms sharing the force load to eliminate heavy motors from moving parts.",
    spec: "3-4 Parallel Axes • Suspended Dome Work Envelope • Blazing G-Force speed",
    best: "Blister tray wrapping, packaging chocolates, and quick sorting on conveyer belts."
  }
};

export default function RoboticsManipulators() {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [time, setTime] = useState<number>(0);

  const [lerpedJoints, setLerpedJoints] = useState({ y: 0, s: 45, e: -35, w: -20, claws: 22 });
  const targetsRef = useRef({ y: 0, s: 45, e: -35, w: -20, claws: 22 });

  const getProgressStyle = (val: number, min: number, max: number, color: string) => {
    const percent = ((val - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, ${color} ${percent}%, #02050f ${percent}%)`
    };
  };

  const renderCalibrationSliders = () => {
    return (
      <div className="space-y-3.5 font-mono text-[10.5px] pt-1 animate-fadeIn">
        {/* Step 3 Calibration Presets buttons */}
        <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase tracking-wider">// CHOOSE CALIBRATION PRESET:</span>
        <div className="grid grid-cols-4 bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 text-center font-mono text-[8.5px]">
          {[
            { id: "resting", label: "REST", j1: 25, j2: 45, j3: -35, j5: -20, j6: 22 },
            { id: "zero", label: "ZERO", j1: 0, j2: 0, j3: 0, j5: 0, j6: 0 },
            { id: "reach", label: "REACH", j1: -65, j2: 85, j3: 15, j5: 45, j6: 80 },
            { id: "custom", label: "CUSTOM", disabled: true }
          ].map((preset) => {
            const isSel = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                disabled={preset.disabled && activePreset !== "custom"}
                onClick={() => {
                  if (preset.j1 !== undefined) {
                    setJ1(preset.j1);
                    setJ2(preset.j2!);
                    setJ3(preset.j3!);
                    setJ5(preset.j5!);
                    setJ6Closed(preset.j6!);
                    setActivePreset(preset.id as any);
                    scrollToSimulation();
                  }
                }}
                className={`py-1.5 px-1 rounded transition-all font-bold ${
                  isSel 
                    ? "bg-[#2c1d04] border border-amber-500/50 text-amber-400 font-black shadow-[0_0_8px_rgba(245,158,11,0.15)] cursor-pointer"
                    : preset.disabled 
                      ? "text-slate-700 cursor-default opacity-40"
                      : "text-slate-500 hover:text-slate-350 cursor-pointer"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex justify-between text-slate-300">
            <span>J1 Base Axis (Yaw)</span>
            <span className="text-cyan-400 font-bold">{j1}°</span>
          </div>
          <input
            type="range"
            min="-135"
            max="135"
            value={j1}
            onChange={(e) => {
              setJ1(Number(e.target.value));
              setActivePreset("custom");
            }}
            className="w-full h-1 bg-slate-900 rounded appearance-none cursor-pointer"
            style={getProgressStyle(j1, -135, 135, "#22d3ee")}
          />
        </div>

        <div className="space-y-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex justify-between text-slate-300">
            <span>J2 Shoulder Axis (Tilt)</span>
            <span className="text-purple-400 font-bold">{j2}°</span>
          </div>
          <input
            type="range"
            min="-15"
            max="105"
            value={j2}
            onChange={(e) => {
              setJ2(Number(e.target.value));
              setActivePreset("custom");
            }}
            className="w-full h-1 bg-slate-900 rounded appearance-none cursor-pointer"
            style={getProgressStyle(j2, -15, 105, "#c084fc")}
          />
        </div>

        <div className="space-y-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex justify-between text-slate-300">
            <span>J3 Elbow Axis (Extension)</span>
            <span className="text-emerald-400 font-bold">{j3}°</span>
          </div>
          <input
            type="range"
            min="-110"
            max="110"
            value={j3}
            onChange={(e) => {
              setJ3(Number(e.target.value));
              setActivePreset("custom");
            }}
            className="w-full h-1 bg-slate-900 rounded appearance-none cursor-pointer"
            style={getProgressStyle(j3, -110, 110, "#34d399")}
          />
        </div>

        <div className="space-y-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex justify-between text-slate-300">
            <span>J4 Wrist Axis (Tilt)</span>
            <span className="text-amber-400 font-bold">{j5}°</span>
          </div>
          <input
            type="range"
            min="-75"
            max="75"
            value={j5}
            onChange={(e) => {
              setJ5(Number(e.target.value));
              setActivePreset("custom");
            }}
            className="w-full h-1 bg-slate-900 rounded appearance-none cursor-pointer"
            style={getProgressStyle(j5, -75, 75, "#fbbf24")}
          />
        </div>

        <div className="space-y-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
          <div className="flex justify-between text-slate-300">
            <span>Pneumatic Claws</span>
            <span className="text-rose-400 font-bold">{j6Closed}% Compression</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={j6Closed}
            onChange={(e) => {
              setJ6Closed(Number(e.target.value));
              setActivePreset("custom");
            }}
            className="w-full h-1 bg-slate-900 rounded appearance-none cursor-pointer"
            style={getProgressStyle(j6Closed, 0, 100, "#f43f5e")}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setJ1(25);
              setJ2(45);
              setJ3(-35);
              setJ5(-20);
              setJ6Closed(22);
              setActivePreset("resting");
            }}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 hover:border-amber-500/50 hover:text-amber-400 bg-slate-950 font-sans font-bold text-[10px] text-slate-300 flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer hover:shadow-[0_0_12px_rgba(245,158,11,0.08)]"
          >
            <RefreshCw className="w-3" /> Reset Calibration Posture
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let animId: number;
    const startTime = Date.now();
    const tick = () => {
      setTime((Date.now() - startTime) / 1000);
      
      setLerpedJoints((prev) => {
        const dest = targetsRef.current;
        // Fast, high-fidelity responsive interpolation (0.09 factor)
        const k = 0.09;

        // Measure direct mechatronic joint angular distance change between frames
        const dy = dest.y - prev.y;
        const ds = dest.s - prev.s;
        const de = dest.e - prev.e;
        const dw = dest.w - prev.w;
        const jointDisplacementSum = Math.abs(dy) + Math.abs(ds) + Math.abs(de) + Math.abs(dw);

        // Map movement velocity to mechatronic claw pneumatic pressure tension (opening/closing briefly as it accelerates)
        // Whenever the arm is moving actively, map the speed to an oscillatory flax/flex offset!
        const flexSpeed = 0.15;
        const jointClassVelocity = Math.min(2.5, jointDisplacementSum * flexSpeed);
        
        // This causes the gripper claws to dynamically cycle/flex (open & close) as the arm is traveling,
        // simulating mechatronic inertia and adaptive payload alignment.
        const dynamicClawOffset = jointClassVelocity > 0.02 
          ? 25 * Math.sin(Date.now() / 140) * jointClassVelocity
          : 0;

        const nextClawsTarget = Math.max(0, Math.min(100, dest.claws + dynamicClawOffset));

        return {
          y: prev.y + dy * k,
          s: prev.s + ds * k,
          e: prev.e + de * k,
          w: prev.w + dw * k,
          claws: prev.claws + (nextClawsTarget - prev.claws) * k
        };
      });

      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3D Viewport Controls
  const [rotYaw, setRotYaw] = useState<number>(-35);
  const [rotPitch, setRotPitch] = useState<number>(20);
  const [zoom, setZoom] = useState<number>(1.25);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  
  // Drag rotation tracking State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragRef = useRef<{ prevX: number; prevY: number }>({ prevX: 0, prevY: 0 });

  // Mechanical joint angle states (Degrees) - Standard neutral initial posture
  const [j1, setJ1] = useState<number>(25);   // Base swivel
  const [j2, setJ2] = useState<number>(45);   // Shoulder pitch
  const [j3, setJ3] = useState<number>(-35);  // Elbow pitch
  const [j5, setJ5] = useState<number>(-20);  // Wrist pitch
  const [j6Closed, setJ6Closed] = useState<number>(22); // Gripper Aperture Clamping Percent (0: open, 100: fully shut)
  const [activePreset, setActivePreset] = useState<"resting" | "zero" | "reach" | "custom">("resting");

  // Hover/Active inspection states for Step 1
  const [highlightedPart, setHighlightedPart] = useState<"none" | "base" | "shoulder" | "elbow" | "wrist" | "gripper">("none");

  // Isolated interactive test-sweep states for Step 2
  const [activeDofTest, setActiveDofTest] = useState<"none" | "j1" | "j2" | "j3" | "j5" | "j6">("none");
  const [dofSweepVal, setDofSweepVal] = useState<number>(0);

  // Pick and Place Scenario states for Step 4
  type AutomationScenario = "pcb_solder" | "battery_sorting" | "arc_welding";
  const [selectedScenario, setSelectedScenario] = useState<AutomationScenario>("battery_sorting");
  const [ppState, setPpState] = useState<"IDLE" | "HOVER" | "DESCENDING" | "GRIPPING" | "SWIVEL" | "DEPOSITING" | "RETRACTING">("IDLE");
  const [sortingBlockColor, setSortingBlockColor] = useState<"blue" | "gold" | "red">("gold");
  const [blockStatus, setBlockStatus] = useState<"pickup" | "attached" | "sorted">("pickup");

  // Step 5: Kinematics Configuration states
  const [kinematicsMode, setKinematicsMode] = useState<"forward" | "inverse">("forward");
  const [targetPoint, setTargetPoint] = useState<{ x: number; y: number; z: number }>({ x: 55, y: 35, z: 60 });
  const [isTargetSolvable, setIsTargetSolvable] = useState<boolean>(true);
  const [isMathSandboxOpen, setIsMathSandboxOpen] = useState<boolean>(false);

  // Step 6: Smart AI & Sensors State (Computer Vision sorting simulation)
  const [cameraState, setCameraState] = useState<"STANDBY" | "DETECTION" | "CLASSIFYING" | "AUTOPILOT_SORT">("STANDBY");
  const [detectedBlockType, setDetectedBlockType] = useState<"none" | "aluminum_can" | "organic_waste" | "reusable_bracket">("none");
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  const [aiSortingLog, setAiSortingLog] = useState<string[]>(["[SYSTEM]: Sensory camera initialized.", "[AI]: Waiting for feed..."]);
  const [selectedArmType, setSelectedArmType] = useState<"articulated" | "cobra" | "cartesian" | "scara" | "delta">("articulated");

  // Joint sweeps for Step 2 effect
  useEffect(() => {
    if (activeDofTest === "none") return;
    let animId: number;
    let angle = 0;
    
    const runSweep = () => {
      angle += 0.05;
      const amplitude = Math.sin(angle);
      
      // Map back and forth within limits
      if (activeDofTest === "j1") setDofSweepVal(Math.round(amplitude * 80));
      else if (activeDofTest === "j2") setDofSweepVal(Math.round(30 + amplitude * 40));
      else if (activeDofTest === "j3") setDofSweepVal(Math.round(-30 + amplitude * 45));
      else if (activeDofTest === "j5") setDofSweepVal(Math.round(-15 + amplitude * 40));
      else if (activeDofTest === "j6") setDofSweepVal(Math.round(50 + amplitude * 50));

      animId = requestAnimationFrame(runSweep);
    };

    animId = requestAnimationFrame(runSweep);
    return () => cancelAnimationFrame(animId);
  }, [activeDofTest]);

  // Reset sweep angles when exiting Step 2
  useEffect(() => {
    if (currentStep !== 2) {
      setActiveDofTest("none");
      setDofSweepVal(0);
    }
  }, [currentStep]);

  // Reset active joint highlights when switching steps or kinematics modes
  useEffect(() => {
    setHighlightedPart("none");
  }, [currentStep, kinematicsMode]);

  // Mechanical Geometry Dimensions
  const H_base = 42; // Base height
  const L_upper = 68; // Upper Arm link 1
  const L_fore = 58;  // Forearm link 2
  const L_wrist = 28; // Wrist connector
  const L_tool = 18;  // Gripper tips extend

  // Compute 3D forward kinematics joint coordinates mit robust safety guards to prevent unlinkable joints
  const computeArmCoords = (yawAng: number, shoulderAng: number, elbowAng: number, wristAng: number) => {
    // Rigid physical coercion guarantees nodes are never unlinkable
    const safeYaw = isNaN(yawAng) ? 25 : yawAng;
    const safeShoulder = isNaN(shoulderAng) ? 45 : shoulderAng;
    const safeElbow = isNaN(elbowAng) ? -35 : elbowAng;
    const safeWrist = isNaN(wristAng) ? -20 : wristAng;

    const yRad = (safeYaw * Math.PI) / 180;
    const sRad = (safeShoulder * Math.PI) / 180;
    const eRad = ((safeShoulder + safeElbow) * Math.PI) / 180;
    const wRad = ((safeShoulder + safeElbow + safeWrist) * Math.PI) / 180;

    // Node 1: Base (0,0,0)
    const n1 = { x: 0, y: 0, z: 0 };
    // Node 2: Shoulder joints (0, 0, BaseHeight)
    const n2 = { x: 0, y: 0, z: H_base };

    // Node 3: Elbow position
    const r3 = L_upper * Math.cos(sRad);
    const n3 = {
      x: r3 * Math.cos(yRad),
      y: r3 * Math.sin(yRad),
      z: H_base + L_upper * Math.sin(sRad)
    };

    // Node 4: Wrist position
    const r4 = r3 + L_fore * Math.cos(eRad);
    const n4 = {
      x: r4 * Math.cos(yRad),
      y: r4 * Math.sin(yRad),
      z: n3.z + L_fore * Math.sin(eRad)
    };

    // Node 5: Tool plate tip position
    const r5 = r4 + L_wrist * Math.cos(wRad);
    const n5 = {
      x: r5 * Math.cos(yRad),
      y: r5 * Math.sin(yRad),
      z: n4.z + L_wrist * Math.sin(wRad)
    };

    // Node 6: Terminal gripper tips (slightly further out along wrist vector)
    const r6 = r5 + L_tool * Math.cos(wRad);
    const n6 = {
      x: r6 * Math.cos(yRad),
      y: r6 * Math.sin(yRad),
      z: n5.z + L_tool * Math.sin(wRad)
    };

    return { n1, n2, n3, n4, n5, n6 };
  };

  // Determine current absolute coordinates being simulated
  const getActiveCoords = () => {
    let y = j1;
    let s = j2;
    let e = j3;
    let w = j5;

    if (currentStep === 1) {
      // General gentle breathing movement that keeps the entire arm alive
      const breathingY = 12 * Math.sin(time * 0.7);
      const breathingS = 8 * Math.cos(time * 0.85);
      const breathingE = 10 * Math.sin(time * 1.0);
      const breathingW = 8 * Math.cos(time * 1.15);

      if (highlightedPart === "none") {
        y = j1 + breathingY;
        s = j2 + breathingS;
        e = j3 + breathingE;
        w = j5 + breathingW;
      } else if (highlightedPart === "base") {
        y = j1 + 45 * Math.sin(time * 1.6); // Highlighted part sweeps widely!
        s = j2 + breathingS;
        e = j3 + breathingE;
        w = j5 + breathingW;
      } else if (highlightedPart === "shoulder") {
        y = j1 + breathingY;
        s = j2 + 25 * Math.sin(time * 1.6); // Highlighted part sweeps widely!
        e = j3 + breathingE;
        w = j5 + breathingW;
      } else if (highlightedPart === "elbow") {
        y = j1 + breathingY;
        s = j2 + breathingS;
        e = j3 + 30 * Math.sin(time * 1.6); // Highlighted part sweeps widely!
        w = j5 + breathingW;
      } else if (highlightedPart === "wrist") {
        y = j1 + breathingY;
        s = j2 + breathingS;
        e = j3 + breathingE;
        w = j5 + 35 * Math.sin(time * 1.9); // Highlighted part sweeps widely!
      } else if (highlightedPart === "gripper") {
        y = j1 + 15 * Math.sin(time * 1.0); // Medium wiggle sweep
        s = j2 + 10 * Math.cos(time * 1.1);
        e = j3 + 12 * Math.sin(time * 1.2);
        w = j5 + 10 * Math.cos(time * 1.3);
      }
    } else if (currentStep === 2 && activeDofTest !== "none") {
      y = activeDofTest === "j1" ? dofSweepVal : j1;
      s = activeDofTest === "j2" ? dofSweepVal : j2;
      e = activeDofTest === "j3" ? dofSweepVal : j3;
      w = activeDofTest === "j5" ? dofSweepVal : j5;
    } else if (currentStep === 4 && ppState !== "IDLE") {
      if (selectedScenario === "battery_sorting") {
        if (ppState === "HOVER") {
          y = -55; s = 30; e = -20; w = -10;
        } else if (ppState === "DESCENDING") {
          y = -55; s = 58; e = -50; w = -20;
        } else if (ppState === "GRIPPING") {
          y = -55; s = 58; e = -50; w = -20;
        } else if (ppState === "SWIVEL") {
          y = 55; s = 25; e = -15; w = 10;
        } else if (ppState === "DEPOSITING") {
          y = 55; s = 52; e = -42; w = -18;
        } else if (ppState === "RELEASE") {
          y = 55; s = 52; e = -42; w = -18;
        } else if (ppState === "RETRACTING") {
          y = 0; s = 45; e = -35; w = -20;
        }
      } else if (selectedScenario === "pcb_solder") {
        // High-precision automated PCB Micro-Solder path sequence
        if (ppState === "HOVER") {
          // Hovering solder node 1
          y = -35; s = 34; e = -22; w = -12;
        } else if (ppState === "DESCENDING") {
          // Touchdown solder node 1
          y = -35; s = 46; e = -36; w = -18;
        } else if (ppState === "GRIPPING") {
          // Solder node 1 contact dwell
          y = -35; s = 46; e = -36; w = -18;
        } else if (ppState === "SWIVEL") {
          // Hovering solder node 2
          y = 20; s = 34; e = -22; w = -12;
        } else if (ppState === "DEPOSITING") {
          // Touchdown solder node 2
          y = 20; s = 46; e = -36; w = -18;
        } else if (ppState === "RELEASE") {
          // Solder node 2 contact dwell
          y = 20; s = 46; e = -36; w = -18;
        } else if (ppState === "RETRACTING") {
          // Safely lift & center
          y = 0; s = 42; e = -32; w = -18;
        }
      } else if (selectedScenario === "arc_welding") {
        // Continuous Heavy Arc Seam welding trajectory
        if (ppState === "HOVER") {
          // Start point hover
          y = -45; s = 38; e = -24; w = -14;
        } else if (ppState === "DESCENDING") {
          // Contact torch strike position
          y = -45; s = 46; e = -35; w = -18;
        } else if (ppState === "GRIPPING") {
          // Dwell and stabilize initial weld puddle
          y = -45; s = 46; e = -35; w = -18;
        } else if (ppState === "SWIVEL") {
          // Continuous seam tracking! Sweeping from y = -45 to y = 45 with high precision AI alignment
          // Using a cosine-based spatial path representing a seam weld arc
          const sweepProgress = Math.sin(time * 2.0); // cycles beautifully over the state period
          y = -45 + 90 * (0.5 + 0.5 * sweepProgress);
          s = 40 + 3 * Math.cos(time * 4.0);
          e = -30 + 4 * Math.sin(time * 4.0);
          w = -15;
        } else if (ppState === "DEPOSITING") {
          // Terminal weld filling crater
          y = 45; s = 46; e = -35; w = -18;
        } else if (ppState === "RELEASE") {
          // Torch off rest phase
          y = 45; s = 38; e = -24; w = -14;
        } else if (ppState === "RETRACTING") {
          // Safe retract
          y = 0; s = 40; e = -28; w = -15;
        }
      }
    } else if (currentStep === 6 && cameraState === "AUTOPILOT_SORT") {
      const targetYaw = sortingBlockColor === "blue" ? 60 : sortingBlockColor === "red" ? -60 : 10;
      y = targetYaw; s = 58; e = -50; w = -20;
    }

    const computed = computeArmCoords(y, s, e, w);
    return { ...computed, y, s, e, w };
  };

  const rawCoords = getActiveCoords();

  const getActiveJ6Closed = () => {
    if (currentStep === 1) {
      if (highlightedPart === "gripper") {
        return 50 + 45 * Math.sin(time * 3.5);
      } else {
        return j6Closed + 10 * Math.sin(time * 1.2);
      }
    }
    return j6Closed;
  };
  const rawJ6Closed = getActiveJ6Closed();

  // Load raw target states to ref for continuous multi-joint linear interpolation
  targetsRef.current = {
    y: rawCoords.y,
    s: rawCoords.s,
    e: rawCoords.e,
    w: rawCoords.w,
    claws: rawJ6Closed
  };

  // Project the active coordinates safely from the beautifully integrated, inertia-simulated physical joints
  const coords = {
    ...computeArmCoords(lerpedJoints.y, lerpedJoints.s, lerpedJoints.e, lerpedJoints.w),
    y: lerpedJoints.y,
    s: lerpedJoints.s,
    e: lerpedJoints.e,
    w: lerpedJoints.w
  };
  const activeJ6Closed = lerpedJoints.claws;

  // Calculates 100% accurate staging area points (for Pick & Place Scenario touchdown and AI Autopilot Sort deposit zones)
  const getStagingPoints = () => {
    if (currentStep === 4) {
      let pickupAngles = { y: -55, s: 58, e: -50, w: -20 };
      let depositAngles = { y: 55, s: 52, e: -42, w: -18 };
      
      if (selectedScenario === "pcb_solder") {
        pickupAngles = { y: -35, s: 46, e: -36, w: -18 };
        depositAngles = { y: 20, s: 46, e: -36, w: -18 };
      } else if (selectedScenario === "arc_welding") {
        pickupAngles = { y: -45, s: 46, e: -35, w: -18 };
        depositAngles = { y: 45, s: 46, e: -35, w: -18 };
      }
      
      return {
        ptA: computeArmCoords(pickupAngles.y, pickupAngles.s, pickupAngles.e, pickupAngles.w).n6,
        ptB: computeArmCoords(depositAngles.y, depositAngles.s, depositAngles.e, depositAngles.w).n6
      };
    } else if (currentStep === 6) {
      const targetYaw = sortingBlockColor === "blue" ? 60 : sortingBlockColor === "red" ? -60 : 10;
      return {
        ptA: { x: -30, y: -70, z: -10 }, // Accurate inspection bay coordinate
        ptB: computeArmCoords(targetYaw, 58, -50, -20).n6
      };
    }
    return { ptA: { x: -55, y: -45, z: 0 }, ptB: { x: 55, y: 44, z: 0 } };
  };

  const { ptA, ptB } = getStagingPoints();

  // Solve real-time analytical Inverse Kinematics for Step 5
  useEffect(() => {
    if (currentStep !== 5 || kinematicsMode === "forward") return;

    // To make IK 100% accurate for the actual gripper end tip n6, we decouple
    // the positioning joints (J1, J2, J3) from the orientation of the wrist + tool.
    // We assume the wrist tilts to keep the tool perfectly flat or horizontal (wRad = 0).
    // Let L_end = L_wrist + L_tool = 28 + 18 = 46 mm.
    // Since the tool is horizontal, the wrist joint center (n4) must be at:
    // r_eff = r_target - 46, and z_eff = targetPoint.z - H_base.
    const r = Math.sqrt(targetPoint.x * targetPoint.x + targetPoint.y * targetPoint.y);
    const L_end = L_wrist + L_tool; // 46 mm
    const r_eff = r - L_end;
    const z_eff = targetPoint.z - H_base;

    const distanceSquared = r_eff * r_eff + z_eff * z_eff;
    const distance = Math.sqrt(distanceSquared);

    const totalReach = L_upper + L_fore;
    if (distance > totalReach || distance < Math.abs(L_upper - L_fore) || r_eff < 0) {
      setIsTargetSolvable(false);
      return;
    }

    const numerator = distanceSquared - L_upper * L_upper - L_fore * L_fore;
    const denominator = 2 * L_upper * L_fore;
    let cosElbow = numerator / denominator;
    
    cosElbow = Math.max(-1, Math.min(1, cosElbow));
    const sinElbow = -Math.sqrt(Math.max(0, 1 - cosElbow * cosElbow)); 
    const solvedElbowRad = Math.atan2(sinElbow, cosElbow);

    const k1 = L_upper + L_fore * cosElbow;
    const k2 = L_fore * sinElbow;
    const solvedShoulderRad = Math.atan2(z_eff, r_eff) - Math.atan2(k2, k1);

    const solvedYaw = Math.atan2(targetPoint.y, targetPoint.x) * (180 / Math.PI);
    const solvedShoulder = solvedShoulderRad * (180 / Math.PI);
    const solvedElbow = solvedElbowRad * (180 / Math.PI);
    const solvedWrist = -(solvedShoulder + solvedElbow); // Keeps tool flatly horizontal!

    setJ1(Math.round(solvedYaw));
    setJ2(Math.round(solvedShoulder));
    setJ3(Math.round(solvedElbow));
    setJ5(Math.round(solvedWrist)); 
    setIsTargetSolvable(true);
  }, [targetPoint, kinematicsMode, currentStep]);

  // Pick & Place automated execution routine for Step 4
  useEffect(() => {
    if (currentStep !== 4 || ppState === "IDLE") return;
    let timer: NodeJS.Timeout;

    const runPpCycle = () => {
      switch (ppState) {
        case "HOVER":
          setJ6Closed(10); 
          setBlockStatus("pickup");
          timer = setTimeout(() => setPpState("DESCENDING"), 1000);
          break;
        case "DESCENDING":
          timer = setTimeout(() => setPpState("GRIPPING"), 800);
          break;
        case "GRIPPING":
          setJ6Closed(95); 
          timer = setTimeout(() => {
            setBlockStatus("attached");
            setPpState("SWIVEL");
          }, 900);
          break;
        case "SWIVEL":
          timer = setTimeout(() => setPpState("DEPOSITING"), 1200);
          break;
        case "DEPOSITING":
          setJ6Closed(15); 
          timer = setTimeout(() => {
            setBlockStatus("sorted");
            setPpState("RETRACTING");
          }, 900);
          break;
        case "RETRACTING":
          timer = setTimeout(() => {
            setPpState("IDLE");
          }, 1000);
          break;
      }
    };

    runPpCycle();
    return () => clearTimeout(timer);
  }, [ppState, currentStep]);

  // AI Sorting Automation trigger for Step 6
  const triggerAiSortingCycle = (blockType: "aluminum_can" | "organic_waste" | "reusable_bracket") => {
    setCameraState("DETECTION");
    setDetectedBlockType(blockType);
    setAiConfidence(0);
    
    const colorCode = blockType === "aluminum_can" ? "blue" : blockType === "organic_waste" ? "red" : "gold";
    setSortingBlockColor(colorCode);

    setAiSortingLog((prev) => [
      ...prev,
      `[CAM_TRIG]: New physical payload recognized in inspection bay.`,
      `[AI_VISION]: Launching multi-layer convolutional feature scans...`
    ]);

    setTimeout(() => {
      setCameraState("CLASSIFYING");
      setAiConfidence(89.4);
      setAiSortingLog((prev) => [
        ...prev,
        `[AI_RESULT]: Match found - Detected: ${blockType.replace("_", " ")} with 97% confidence.`,
        `[AI_ROUTING]: Solving target bin vector trajectory toward ${colorCode.toUpperCase()} bucket.`
      ]);
    }, 1500);

    setTimeout(() => {
      setCameraState("AUTOPILOT_SORT");
      setJ6Closed(90);
      setBlockStatus("attached");
      setAiSortingLog((prev) => [
        ...prev,
        `[AUTOPILOT]: Driving 6-DOF actuators autonomously. Path solved.`
      ]);
    }, 3000);

    setTimeout(() => {
      setJ6Closed(10);
      setBlockStatus("sorted");
      setCameraState("STANDBY");
      setAiSortingLog((prev) => [
        ...prev,
        `[SYSTEM]: Core successfully deposited ${blockType.replace("_", " ")}. Actuators retracted. Ready.`
      ]);
    }, 5500);
  };

  // Viewport projection math
  const project3D = (pt: { x: number; y: number; z: number }) => {
    const cx = 160;
    const cy = 160;

    const yawRad = (rotYaw * Math.PI) / 180;
    const pitchRad = (rotPitch * Math.PI) / 180;

    const x1 = pt.x * Math.cos(yawRad) - pt.y * Math.sin(yawRad);
    const y1 = pt.x * Math.sin(yawRad) + pt.y * Math.cos(yawRad);
    const z1 = pt.z;

    const x2 = x1;
    const y2 = y1 * Math.cos(pitchRad) - z1 * Math.sin(pitchRad);
    const z2 = y1 * Math.sin(pitchRad) + z1 * Math.cos(pitchRad);

    return {
      x: cx + x2 * zoom,
      y: cy - z2 * zoom
    };
  };

  // Helper to generate dynamic 3D concentric circle paths on the z=0 ground plane
  const getProjectedCirclePath = (r: number) => {
    let d = "";
    for (let i = 0; i <= 360; i += 12) {
      const rad = (i * Math.PI) / 180;
      const px = r * Math.cos(rad);
      const py = r * Math.sin(rad);
      const pt = project3D({ x: px, y: py, z: 0 });
      if (i === 0) d += `M ${pt.x} ${pt.y}`;
      else d += ` L ${pt.x} ${pt.y}`;
    }
    return d + " Z";
  };

  // Radar-like radial spokes in 3D projection on the ground
  const radialGridLines = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const pStart = project3D({ x: 0, y: 0, z: 0 });
    const pEnd = project3D({ x: 145 * Math.cos(rad), y: 145 * Math.sin(rad), z: 0 });
    return (
      <line
        key={`radial-grid-${deg}`}
        x1={pStart.x}
        y1={pStart.y}
        x2={pEnd.x}
        y2={pEnd.y}
        stroke="#1e3a8a"
        strokeWidth="0.6"
        strokeDasharray="2,3"
        className="opacity-40"
      />
    );
  });

  // Projected grid square coordinates mesh (bounding box lines)
  const gridLines: React.ReactNode[] = [];
  for (let val = -120; val <= 120; val += 40) {
    const px1 = project3D({ x: val, y: -120, z: 0 });
    const px2 = project3D({ x: val, y: 120, z: 0 });
    gridLines.push(
      <line
        key={`grid-x-${val}`}
        x1={px1.x}
        y1={px1.y}
        x2={px2.x}
        y2={px2.y}
        stroke="#1e293b"
        strokeWidth="0.5"
        strokeDasharray="1,4"
        className="opacity-35"
      />
    );
    
    const py1 = project3D({ x: -120, y: val, z: 0 });
    const py2 = project3D({ x: 120, y: val, z: 0 });
    gridLines.push(
      <line
        key={`grid-y-${val}`}
        x1={py1.x}
        y1={py1.y}
        x2={py2.x}
        y2={py2.y}
        stroke="#1e293b"
        strokeWidth="0.5"
        strokeDasharray="1,4"
        className="opacity-35"
      />
    );
  }

  // Cardinal direction ticks and axes labels in 3D perspective projection
  const axisTicks = [
    { x: 140, y: 0, label: "+X" },
    { x: -140, y: 0, label: "-X" },
    { x: 0, y: 140, label: "+Y" },
    { x: 0, y: -140, label: "-Y" },
  ].map((tick, idx) => {
    const pos = project3D({ x: tick.x, y: tick.y, z: 0 });
    return (
      <g key={`axis-tick-${idx}`}>
        <circle cx={pos.x} cy={pos.y} r="1.5" fill="#22d3ee" className="opacity-60" />
        <text
          x={pos.x}
          y={pos.y - 4}
          textAnchor="middle"
          className="font-mono text-[7px] font-black tracking-widest fill-slate-500 uppercase pointer-events-none"
        >
          {tick.label}
        </text>
      </g>
    );
  });

  // Handle Mouse Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { prevX: e.clientX, prevY: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dX = e.clientX - dragRef.current.prevX;
    const dY = e.clientY - dragRef.current.prevY;
    
    setRotYaw((prev) => (prev + dX * 0.6) % 360);
    setRotPitch((prev) => Math.max(-75, Math.min(75, prev - dY * 0.6)));
    
    dragRef.current = { prevX: e.clientX, prevY: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Touch Dragging for Mobile Phones
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragRef.current = { prevX: touch.clientX, prevY: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dX = touch.clientX - dragRef.current.prevX;
    const dY = touch.clientY - dragRef.current.prevY;
    
    setRotYaw((prev) => (prev + dX * 0.65) % 360);
    setRotPitch((prev) => Math.max(-75, Math.min(75, prev - dY * 0.65)));
    
    dragRef.current = { prevX: touch.clientX, prevY: touch.clientY };
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Coordinates converted to 2D projections
  const p1 = project3D(coords.n1);
  const p2 = project3D(coords.n2);
  const p3 = project3D(coords.n3);
  const p4 = project3D(coords.n4);
  const p5 = project3D(coords.n5);
  const p6 = project3D(coords.n6);

  // Dynamic 3D perspective scales for base and cap ellipses depending on pitch rotation angle
  const pitchRad = (rotPitch * Math.PI) / 180;
  const sinPitch = Math.abs(Math.sin(pitchRad));
  const baseRy = Math.max(2, 11 * sinPitch);
  const topRy = Math.max(1.5, 8 * sinPitch);

  // Dynamically calculate the 2D slope angle for the active gripper claws orientation to align with wrist tilt
  const gripperAngleRad = Math.atan2(p5.y - p4.y, p5.x - p4.x);
  const gripperAngleDeg = (gripperAngleRad * 180) / Math.PI;

  const isSelectedStyle = (part: typeof highlightedPart) => {
    if (highlightedPart === "none") return false;
    return highlightedPart === part;
  };

  const scrollToSimulation = () => {
    if (typeof window !== "undefined") {
      const el = document.getElementById("robotic-manipulator-simulation-viewport");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" id="robotic-manipulator-module">
      {/* MODULE MAIN TITLE HEADER - SOLID AND NOT TRANSPARENT */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 px-2 rounded bg-slate-800 border border-slate-700 text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                STEM LABS MODULE 05
              </span>
              <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider flex items-center gap-1">
                <RoboticArmIcon className="w-3.5 h-3.5 text-cyan-500" /> Interactive Robotics
              </span>
            </div>
            <h1 className="font-sans font-black text-2xl md:text-3xl text-white tracking-tight uppercase">
              6-DOF Industrial Robotic Arm
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Explore industrial robotics, coordinate joints, path trajectories, and smart computer vision sorting on a generic multi-axis robotic manipulator.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 self-start md:self-center font-mono">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <div className="text-left">
                <span className="text-[7.5px] text-slate-500 block uppercase font-bold">SIMULATOR STATE:</span>
                <span className="text-[9.5px] text-white font-extrabold uppercase tracking-wide">6-DOF HIGH PRECISION CORE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE SYLLABUS STEPPERS - SEQUENTIAL, NO CHECKMARKS, FLAT BACKDROP */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stepsList.map((step) => {
            const isCurrent = currentStep === step.id;
            const colorConfig = stepColors[step.id];
            return (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStep(step.id);
                  scrollToSimulation();
                }}
                className={`p-3 rounded-xl text-left border transition-all duration-300 cursor-pointer select-none relative overflow-hidden group flex flex-col justify-between h-[85px] ${
                  isCurrent 
                    ? `bg-slate-800 ${colorConfig.border} ${colorConfig.glow}`
                    : `bg-slate-900 border-slate-800 text-slate-400 ${colorConfig.hoverBorder} hover:bg-slate-850 hover:shadow-[0_0_10px_rgba(255,255,255,0.02)]`
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono text-[8.5px] font-bold tracking-widest uppercase transition-colors duration-300 ${isCurrent ? colorConfig.text : "text-slate-500 group-hover:text-slate-350"}`}>
                    {step.badge}
                  </span>
                  <span className={`text-[9px] font-mono font-black transition-colors duration-300 ${isCurrent ? colorConfig.text : "text-slate-600 group-hover:text-slate-450"}`}>
                    0{step.id}
                  </span>
                </div>
                <span className={`font-sans font-extrabold text-[11px] leading-tight transition-colors block uppercase mt-2 group-hover:text-white ${isCurrent ? "text-white" : "text-slate-300"}`}>
                  {step.title.split(". ")[1]}
                </span>
                {/* Active indicator bar */}
                {isCurrent && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] transition-all"
                    style={{ backgroundColor: colorConfig.hex }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DUAL WORKSPACE PANEL MODULE: SOLID LABELS AND PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* INTERACTIVE COMPONENT WORKSPACE CONTROLS (LEFT-COLUMN) */}
        {currentStep !== 6 && (
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[380px]">
            
            {/* STEP 1: MEET THE ROBOTIC ARM */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">Meet the Robotic Arm</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Industrial manipulators are heavy-duty, multi-jointed mechanisms engineered to duplicate human arm movements with micron-level repetition. 
                </p>
                
                <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase tracking-wider mt-2">// HIGHLIGHT CORE COMPONENTS:</span>

                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "base", label: "Rotational Base", desc: "Allows full 360° rotation in horizontal plane." },
                    { id: "shoulder", label: "Shoulder Joint", desc: "Pitch axis controls arm lift tilt and range." },
                    { id: "elbow", label: "Elbow Joint", desc: "Bends/extends the forearm section forward." },
                    { id: "wrist", label: "Wrist Joint", desc: "Tilt axis allows exact terminal tooling angling." },
                    { id: "gripper", label: "End Effector", desc: "Claw/pneumatic gripping module for placement." }
                  ].map((part) => {
                    const isSelected = highlightedPart === part.id;
                    return (
                      <button
                        key={part.id}
                        onMouseEnter={() => setHighlightedPart(part.id as any)}
                        onMouseLeave={() => setHighlightedPart("none")}
                        onClick={() => {
                          const nextPart = isSelected ? "none" : (part.id as any);
                          setHighlightedPart(nextPart);
                          
                          // Dynamic 3D viewport gaze rotation represented by joint values
                          if (nextPart === "base") {
                            setRotYaw(0);
                            setRotPitch(35);
                          } else if (nextPart === "shoulder") {
                            setRotYaw(-85);
                            setRotPitch(20);
                          } else if (nextPart === "elbow") {
                            setRotYaw(-65);
                            setRotPitch(24);
                          } else if (nextPart === "wrist") {
                            setRotYaw(-25);
                            setRotPitch(18);
                          } else if (nextPart === "gripper") {
                            setRotYaw(45);
                            setRotPitch(12);
                          }
                          scrollToSimulation();
                        }}
                        className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-[#091a2e] border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                            : "bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-300 hover:border-cyan-500/50"
                        }`}
                      >
                        <span className="font-sans font-bold text-[10.5px] block truncate uppercase">{part.label}</span>
                        <span className="text-[8.5px] font-mono text-slate-500 block truncate mt-0.5">{part.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {highlightedPart !== "none" && (
                    <motion.div
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 mt-2 text-left"
                    >
                      <span className="font-mono text-[8.5px] text-cyan-400 font-extrabold block uppercase tracking-wider">
                        Component Insight: {highlightedPart.toUpperCase()}
                      </span>
                      <p className="text-[10px] text-slate-300 leading-normal">
                        {highlightedPart === "base" && "The Base assembly serves as the foundational spine. Anchored directly to production platforms using high-tensile steel frame bolts to absorb dynamic kinetic rebound."}
                        {highlightedPart === "shoulder" && "The Shoulder delivers the heavy torque required to hoist links against gravity. Leveraged by high-performance planetary gears."}
                        {highlightedPart === "elbow" && "The Elbow articulates the forearm link. Working closely with the Shoulder to stretch the end effector into dynamic vertical elevations with high accuracy."}
                        {highlightedPart === "wrist" && "The Wrist assembly fine-tunes tool targeting, rotating workheads so tools meet assembly targets at completely orthogonal alignments."}
                        {highlightedPart === "gripper" && "The Gripper acts as the robot hand. Translating internal signals into physical manipulation, picking components using dual-axis parallel claws."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex p-2 items-center gap-2 border border-slate-805 rounded-lg bg-slate-950 font-mono text-[8.5px] text-slate-500">
                  <Info className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>HOVER OR CLICK ON A COMPONENT TO HIGHLIGHT ON THE ROBOT ARM VIEWPORT</span>
                </div>
              </div>
            )}

            {/* STEP 2: HOW THE ARM MOVES */}
            {currentStep === 2 && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">How the Arm Moves</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Robots use Degrees of Freedom (DOF) to calculate spatial flexibility. Each axis allows rotation or translation in one physical plane.
                </p>

                <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase tracking-wider mt-2">// SELECT AN AXIS TO RUN HARMONIC MOTION:</span>

                <div className="space-y-2">
                  {[
                    { id: "j1", label: "Base Yaw (Axis 1 - Z Axis)", desc: "Sweeps horizontally. Limits: -170° to +170°." },
                    { id: "j2", label: "Shoulder Pitch (Axis 2 - Y Axis)", desc: "Tumbles forward. Limits: -45° to +110°." },
                    { id: "j3", label: "Elbow Pitch (Axis 3 - Y Axis)", desc: "Retracts forearm. Limits: -120° to +120°." },
                    { id: "j5", label: "Wrist Joint (Axis 4 - Y Axis)", desc: "Angles terminal tool. Limits: -90° to +90°." },
                    { id: "j6", label: "Gripper Aperture (Claw Actuator)", desc: "Compresses pneumatic jaws to hold payloads." }
                  ].map((test) => {
                    const isActive = activeDofTest === test.id;
                    return (
                      <button
                        key={test.id}
                        onClick={() => {
                          const nextTest = isActive ? "none" : (test.id as any);
                          setActiveDofTest(nextTest);
                          
                          // Dynamically set perspective angles for the sweeping test axis
                          if (nextTest === "j1") {
                            setRotYaw(0);
                            setRotPitch(40); // top-down look
                          } else if (nextTest === "j2") {
                            setRotYaw(-85); // profile lateral view
                            setRotPitch(20);
                          } else if (nextTest === "j3") {
                            setRotYaw(-65); 
                            setRotPitch(22);
                          } else if (nextTest === "j5") {
                            setRotYaw(-25);
                            setRotPitch(18);
                          } else if (nextTest === "j6") {
                            setRotYaw(45);
                            setRotPitch(12);
                          }
                          scrollToSimulation();
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isActive 
                            ? "bg-[#180f2b] border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                            : "bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400 hover:border-purple-500/50"
                        }`}
                      >
                        <div>
                          <span className="font-sans font-bold text-[10.5px] block uppercase">{test.label}</span>
                          <span className="text-[8.5px] font-mono text-slate-500 block truncate mt-0.5">{test.desc}</span>
                        </div>
                        {isActive ? (
                          <span className="font-mono text-[9px] text-purple-400 font-bold bg-purple-950/40 px-2 py-0.5 rounded uppercase flex items-center gap-1 border border-purple-900/30">
                            <span className="h-1 w-1 bg-purple-400 rounded-full animate-ping" /> SWEEPING: {dofSweepVal}°
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-mono text-slate-400 block uppercase border border-slate-700 p-1 px-2 rounded-lg bg-slate-900 hover:text-white hover:border-purple-500/40">
                            Simulate
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: UNDERSTANDING MOTION */}
            {currentStep === 3 && (
              <>
                <div className="hidden lg:block space-y-4 text-left animate-fadeIn">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <h3 className="font-sans font-black text-xs uppercase tracking-wider">Calibration Deck</h3>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Take full manual control. Modulate individual joint dials directly to tilt or rotate the robotic arm links.
                  </p>
                  {renderCalibrationSliders()}
                </div>
                <div className="block lg:hidden space-y-4 text-left bg-slate-950/45 p-4 border border-slate-800/80 rounded-2xl animate-fadeIn">
                  <span className="font-sans font-black text-xs text-white uppercase tracking-wider block">Calibration Controls</span>
                  <p className="text-slate-400 text-[11.5px] leading-relaxed">
                    ⚙️ <strong>Active calibration sliders are placed below the simulation</strong> so that you can tune the 6-DOF coordinate dials and monitor visual feedback in real-time without scrolling back and forth!
                  </p>
                </div>
              </>
            )}

            {/* STEP 4: POSITIONING OBJECTS */}
            {currentStep === 4 && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Play className="w-4 h-4 text-teal-400" />
                  <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">Pick-and-place staging</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  End effectors execute industrial trajectory sequences. Pick-and-place is the base foundation of packaging lines, micro-electronics, and automated welding cells.
                </p>

                <div className="space-y-2">
                  <span className="text-[8px] text-slate-500 font-mono font-bold block uppercase tracking-wider">// CHOOSE SEQUENCING SCENARIO:</span>

                  {[
                    { id: "battery_sorting", label: "Battery Cell Sorting Sequence", speed: "1.2s sweep", energy: "Pneumatic Grippers" },
                    { id: "pcb_solder", label: "PCB Micro-Solder Positioning", speed: "0.8s drop", energy: "Hot-needle Contact Tool" },
                    { id: "arc_welding", label: "Heavy Structural Arc Welding", speed: "3.4s path", energy: "Plasma Torch Probe" }
                  ].map((scenario) => {
                    const isPicked = selectedScenario === scenario.id;
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => {
                          setSelectedScenario(scenario.id as any);
                          setBlockStatus("pickup");
                          setPpState("IDLE");
                          
                          // Custom camera tracking alignments for physical scenario boundaries
                          if (scenario.id === "battery_sorting") {
                            setRotYaw(-40);
                            setRotPitch(16);
                          } else if (scenario.id === "pcb_solder") {
                            setRotYaw(-10);
                            setRotPitch(32); // steeper angle for detail
                          } else if (scenario.id === "arc_welding") {
                            setRotYaw(-60);
                            setRotPitch(12); // low sweep view
                          }
                          scrollToSimulation();
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                          isPicked 
                            ? "bg-[#0b2424] border-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.15)]" 
                            : "bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-350 hover:border-teal-500/50"
                        }`}
                      >
                        <span className="font-sans font-bold text-[10.5px] block uppercase">{scenario.label}</span>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[8.5px] font-mono text-slate-500">{scenario.energy}</span>
                          <span className="text-[8.5px] font-mono text-teal-400 font-bold">{scenario.speed}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  {ppState === "IDLE" ? (
                    <button
                      onClick={() => {
                        setPpState("HOVER");
                        scrollToSimulation();
                      }}
                      className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-sans font-black text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950 stroke-none" /> Trigger Automated Program Cycle
                    </button>
                  ) : (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[9px]">
                      <div className="flex justify-between items-center">
                        <span className="text-teal-400 font-extrabold uppercase animate-pulse">// SEQUENCE LIVE EXECUTION</span>
                        <span className="text-slate-500">STATE: {ppState}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1 text-left">
                        <div 
                          className="bg-teal-500 h-full transition-all duration-300"
                          style={{
                            width: 
                              ppState === "HOVER" ? "20%" :
                              ppState === "DESCENDING" ? "40%" :
                              ppState === "GRIPPING" ? "60%" :
                              ppState === "SWIVEL" ? "80%" : "100%"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: HOW ROBOTS CALCULATE MOVEMENT */}
            {currentStep === 5 && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">Kinematics Solver</h3>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Kinematics is the core mathematics that drives robot movement. Let's learn the differences between the two methods:
                </p>

                <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 font-mono text-[9px] w-full">
                  <button
                    onClick={() => {
                      setKinematicsMode("forward");
                      setRotYaw(-65);
                      setRotPitch(22);
                      scrollToSimulation();
                    }}
                    className={`p-1.5 text-center rounded font-extrabold uppercase transition-all cursor-pointer ${
                      kinematicsMode === "forward" 
                        ? "bg-[#0b1b36] text-blue-400 font-bold border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                        : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    Forward Kinematics
                  </button>
                  <button
                    onClick={() => {
                      setKinematicsMode("inverse");
                      setRotYaw(-25);
                      setRotPitch(18);
                      scrollToSimulation();
                    }}
                    className={`p-1.5 text-center rounded font-extrabold uppercase transition-all cursor-pointer ${
                      kinematicsMode === "inverse" 
                        ? "bg-[#0b1b36] text-blue-400 font-bold border border-blue-500/50 shadow-[0_0_12px_rgba(59,130,246,0.15)]" 
                        : "text-slate-500 hover:text-slate-350"
                    }`}
                  >
                    Inverse Kinematics
                  </button>
                </div>

                {/* Dynamic progressive line for Step 5 - Instant transition */}
                <div className="relative w-full h-[5px] bg-slate-950 rounded-full overflow-hidden border border-slate-900/40 p-[1px] shadow-inner mt-2 mb-2.5">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-150 ease-out"
                    style={{
                      width: `${kinematicsMode === "forward" ? "50%" : "100%"}`,
                      boxShadow: "0 0 10px #3b82f6"
                    }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {kinematicsMode === "forward" ? (
                    <motion.div
                      key="fwd"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <span className="font-sans font-black text-[10.5px] text-blue-400 uppercase tracking-wider block">Forward Kinematics (Joint to Space)</span>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                          Drag the sliders or tap the buttons to jog the individual joint motors. Mathematical trigonometric matrices map these angles to find the exact hand tip coordinate.
                        </p>
                      </div>

                      {/* Joint Cartesian Tracker Selection Dashboard */}
                      <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
                        <span className="text-[8px] font-extrabold text-[#3b82f6] block uppercase tracking-wider">// CHOOSE JOINT TO TRACK ON WORKSPACE:</span>
                        <div className="grid grid-cols-5 gap-1 font-mono text-[9px]">
                          {[
                            { id: "base", label: "Base J1", color: "border-cyan-500/40 text-cyan-400" },
                            { id: "shoulder", label: "Shld J2", color: "border-purple-500/40 text-purple-400" },
                            { id: "elbow", label: "Elb J3", color: "border-emerald-500/40 text-emerald-400" },
                            { id: "wrist", label: "Wrst J4", color: "border-amber-500/40 text-amber-400" },
                            { id: "gripper", label: "Tool J5", color: "border-rose-500/40 text-rose-400" }
                          ].map((item) => {
                            const isSelected = highlightedPart === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setHighlightedPart(highlightedPart === item.id ? "none" : (item.id as any))}
                                className={`py-1 rounded font-bold text-[8.5px] uppercase transition-all cursor-pointer text-center border ${
                                  isSelected 
                                    ? "bg-[#0b1b36] border-[#3b82f6] text-white shadow-[0_0_8px_rgba(59,130,246,0.25)]" 
                                    : "bg-slate-900 border-slate-850 hover:bg-slate-800 text-slate-400"
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[7.5px] text-slate-500 leading-normal font-mono">
                          Select a joint button above or click/hover directly on the physical arm joints in the 3D viewport to trace reference frames.
                        </p>
                      </div>

                      <div className="space-y-3 font-mono text-[10px]">
                        <span className="text-slate-500 block text-[8px] font-bold uppercase tracking-wider">// CHOOSE ACTIVE MOTOR ANGLES (°):</span>

                        {/* Joint 1 Slider & Jogs */}
                        <div 
                          className="space-y-1 p-1 rounded-lg hover:bg-slate-900/30 transition-all"
                          onMouseEnter={() => setHighlightedPart("base")}
                          onMouseLeave={() => setHighlightedPart("none")}
                        >
                          <div className="flex justify-between text-slate-400 text-[9px]">
                            <span>Joint 1 (Base Yaw):</span>
                            <span className="text-blue-400 font-bold">{j1}°</span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-300">
                            <button
                              type="button"
                              onClick={() => setJ1((prev) => Math.max(-120, prev - 5))}
                              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              -5°
                            </button>
                            <input
                              type="range"
                              min="-120"
                              max="120"
                              value={j1}
                              onChange={(e) => setJ1(Number(e.target.value))}
                              className="flex-grow h-1 bg-slate-955 rounded appearance-none hover:bg-slate-900 cursor-pointer"
                              style={getProgressStyle(j1, -120, 120, "#3b82f6")}
                            />
                            <button
                              type="button"
                              onClick={() => setJ1((prev) => Math.min(120, prev + 5))}
                              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              +5°
                            </button>
                          </div>
                        </div>

                        {/* Joint 2 Slider & Jogs */}
                        <div 
                          className="space-y-1 p-1 rounded-lg hover:bg-slate-900/30 transition-all"
                          onMouseEnter={() => setHighlightedPart("shoulder")}
                          onMouseLeave={() => setHighlightedPart("none")}
                        >
                          <div className="flex justify-between text-slate-400 text-[9px]">
                            <span>Joint 2 (Shoulder Pitch):</span>
                            <span className="text-blue-400 font-bold">{j2}°</span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-300">
                            <button
                              type="button"
                              onClick={() => setJ2((prev) => Math.max(-15, prev - 5))}
                              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              -5°
                            </button>
                            <input
                              type="range"
                              min="-15"
                              max="110"
                              value={j2}
                              onChange={(e) => setJ2(Number(e.target.value))}
                              className="flex-grow h-1 bg-slate-955 rounded appearance-none hover:bg-slate-900 cursor-pointer"
                              style={getProgressStyle(j2, -15, 110, "#3b82f6")}
                            />
                            <button
                              type="button"
                              onClick={() => setJ2((prev) => Math.min(110, prev + 5))}
                              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              +5°
                            </button>
                          </div>
                        </div>

                        {/* Joint 3 Slider & Jogs */}
                        <div 
                          className="space-y-1 p-1 rounded-lg hover:bg-slate-900/30 transition-all"
                          onMouseEnter={() => setHighlightedPart("elbow")}
                          onMouseLeave={() => setHighlightedPart("none")}
                        >
                          <div className="flex justify-between text-slate-400 text-[9px]">
                            <span>Joint 3 (Elbow Bend):</span>
                            <span className="text-blue-400 font-bold">{j3}°</span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-300">
                            <button
                              type="button"
                              onClick={() => setJ3((prev) => Math.max(-110, prev - 5))}
                              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              -5°
                            </button>
                            <input
                              type="range"
                              min="-110"
                              max="30"
                              value={j3}
                              onChange={(e) => setJ3(Number(e.target.value))}
                              className="flex-grow h-1 bg-slate-955 rounded appearance-none hover:bg-slate-900 cursor-pointer"
                              style={getProgressStyle(j3, -110, 30, "#3b82f6")}
                            />
                            <button
                              type="button"
                              onClick={() => setJ3((prev) => Math.min(30, prev + 5))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              +5°
                            </button>
                          </div>
                        </div>

                        {/* Joint 4 Slider & Jogs */}
                        <div 
                          className="space-y-1 p-1 rounded-lg hover:bg-slate-900/30 transition-all"
                          onMouseEnter={() => setHighlightedPart("wrist")}
                          onMouseLeave={() => setHighlightedPart("none")}
                        >
                          <div className="flex justify-between text-slate-400 text-[9px]">
                            <span>Joint 4 (Wrist Tilt):</span>
                            <span className="text-blue-400 font-bold">{j5}°</span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-300">
                            <button
                              type="button"
                              onClick={() => setJ5((prev) => Math.max(-120, prev - 5))}
                              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              -5°
                            </button>
                            <input
                              type="range"
                              min="-120"
                              max="120"
                              value={j5}
                              onChange={(e) => setJ5(Number(e.target.value))}
                              className="flex-grow h-1 bg-slate-955 rounded appearance-none hover:bg-slate-900 cursor-pointer"
                              style={getProgressStyle(j5, -120, 120, "#3b82f6")}
                            />
                            <button
                              type="button"
                              onClick={() => setJ5((prev) => Math.min(120, prev + 5))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              +5°
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono text-[9.5px]">
                        <span className="text-slate-500 block text-[8px] uppercase font-bold">// DERIVED END TIP TARGET LOCATION:</span>
                        <div className="flex justify-between border-b border-slate-900 pb-1 text-slate-400">
                          <span>Resulting End Tip X:</span>
                          <span className="text-white font-bold">{Math.round(coords.n6.x)} mm</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1 text-slate-400">
                          <span>Resulting End Tip Y:</span>
                          <span className="text-white font-bold">{Math.round(coords.n6.y)} mm</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Resulting End Tip Z:</span>
                          <span className="text-emerald-400 font-bold">{Math.round(coords.n6.z)} mm</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="inv"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <span className="font-sans font-black text-[10.5px] text-blue-400 uppercase tracking-wider block">Inverse Kinematics (Space to Joint)</span>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                          Drag standard X, Y, and Z targets. The on-board controller backward-solves trigonometric joint equations instantly to place the hand exactly at that target spot!
                        </p>
                      </div>

                      <div className="space-y-3 font-mono text-[10px]">
                        <span className="text-slate-500 block text-[8px] font-bold uppercase tracking-wider">// CHOOSE 3D TARGET SPATIAL VECTORS (mm):</span>
                        
                        {/* Target X Slider & Jogs */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-slate-400">
                            <span>Goal X Target Coordinate:</span>
                            <span className="text-blue-400 font-bold">{targetPoint.x} mm</span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-300">
                            <button
                              type="button"
                              onClick={() => setTargetPoint((p) => ({ ...p, x: Math.max(35, p.x - 5) }))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              -5
                            </button>
                            <input
                              type="range"
                              min="35"
                              max="115"
                              value={targetPoint.x}
                              onChange={(e) => setTargetPoint((p) => ({ ...p, x: Number(e.target.value) }))}
                              className="flex-grow h-1 bg-slate-900 rounded appearance-none hover:bg-slate-800 cursor-pointer"
                              style={getProgressStyle(targetPoint.x, 35, 115, "#3b82f6")}
                            />
                            <button
                              type="button"
                              onClick={() => setTargetPoint((p) => ({ ...p, x: Math.min(115, p.x + 5) }))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              +5
                            </button>
                          </div>
                        </div>

                        {/* Target Y Slider & Jogs (Adds massive 3D flexibility!) */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-slate-400">
                            <span>Goal Y Target Coordinate:</span>
                            <span className="text-blue-400 font-bold">{targetPoint.y} mm</span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-300">
                            <button
                              type="button"
                              onClick={() => setTargetPoint((p) => ({ ...p, y: Math.max(-80, p.y - 5) }))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              -5
                            </button>
                            <input
                              type="range"
                              min="-80"
                              max="80"
                              value={targetPoint.y}
                              onChange={(e) => setTargetPoint((p) => ({ ...p, y: Number(e.target.value) }))}
                              className="flex-grow h-1 bg-slate-900 rounded appearance-none hover:bg-slate-800 cursor-pointer"
                              style={getProgressStyle(targetPoint.y, -80, 80, "#3b82f6")}
                            />
                            <button
                              type="button"
                              onClick={() => setTargetPoint((p) => ({ ...p, y: Math.min(80, p.y + 5) }))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              +5
                            </button>
                          </div>
                        </div>

                        {/* Target Z Slider & Jogs */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-slate-400">
                            <span>Goal Z Target Coordinate:</span>
                            <span className="text-blue-400 font-bold">{targetPoint.z} mm</span>
                          </div>
                          <div className="flex gap-2 items-center text-slate-300">
                            <button
                              type="button"
                              onClick={() => setTargetPoint((p) => ({ ...p, z: Math.max(25, p.z - 5) }))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              -5
                            </button>
                            <input
                              type="range"
                              min="25"
                              max="115"
                              value={targetPoint.z}
                              onChange={(e) => setTargetPoint((p) => ({ ...p, z: Number(e.target.value) }))}
                              className="flex-grow h-1 bg-slate-900 rounded appearance-none hover:bg-slate-800 cursor-pointer"
                              style={getProgressStyle(targetPoint.z, 25, 115, "#3b82f6")}
                            />
                            <button
                              type="button"
                              onClick={() => setTargetPoint((p) => ({ ...p, z: Math.min(115, p.z + 5) }))}
                              className="px-1.5 py-0.5 bg-slate-955 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[9px] font-mono font-bold cursor-pointer transition-all hover:text-white"
                            >
                              +5
                            </button>
                          </div>
                        </div>

                        {isTargetSolvable ? (
                          <div className="p-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-450 text-[9px] rounded uppercase font-bold text-center">
                            ✓ Target within physical Reach envelope
                          </div>
                        ) : (
                          <div className="p-2 border border-rose-500/20 bg-rose-500/5 text-rose-450 text-[9px] rounded uppercase font-bold animate-pulse text-center font-bold">
                            ❌ OUT OF WORKSPACE ENVELOPE EXTENSION
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
        )}

        {/* PRIMARY PORTRAIT 3D SIMULATOR VIEWPORT WINDOW (RIGHT-COLUMN) */}
        <div id="robotic-manipulator-simulation-viewport" className={`${currentStep === 6 ? "lg:col-span-12" : "lg:col-span-8"} flex flex-col gap-4`}>
          
          {/* Active Topic Spotlight Banner Board */}
          {(() => {
            const overview = getStepOverview(currentStep);
            return (
              <div className={`p-5 rounded-2xl border bg-slate-900/60 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-300 ${overview.accentColor.split(" ")[0]} border-slate-800/85`}>
                {/* Accent neon decorative line for active topic */}
                <div className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-85`} />
                
                <div className="absolute top-0 right-0 p-3 flex items-center gap-1.5 font-mono text-[8px] uppercase text-slate-500 bg-slate-950 rounded-bl-xl border-l border-b border-slate-800/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Topic Status: {overview.iconStatus}</span>
                </div>

                <div className="space-y-3 text-left">
                  <div className="font-mono text-[9px] font-black tracking-widest text-cyan-400 block uppercase">
                    SPOTLIGHT FOCUS • TOPIC 0{currentStep}
                  </div>
                  <div>
                    <h4 className="font-sans font-black text-sm text-white uppercase tracking-tight leading-none">
                      {overview.title}
                    </h4>
                    <p className="font-mono text-[9.5px] text-slate-400 font-bold italic mt-1.5">
                      {overview.subtitle}
                    </p>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
                    {overview.desc}
                  </p>

                  <div className={`grid grid-cols-2 ${overview.stats.length === 5 ? "sm:grid-cols-5" : "sm:grid-cols-4"} gap-2 pt-1 border-t border-slate-800/40`}>
                    {overview.stats.map((stat, sIdx) => {
                      const isStep6 = currentStep === 6;
                      
                      // Map configuration card names to model IDs
                      const mapNameToArmId = (name: string): "articulated" | "cobra" | "cartesian" | "scara" | "delta" => {
                        const n = name.toLowerCase();
                        if (n.includes("articulated")) return "articulated";
                        if (n.includes("cobra")) return "cobra";
                        if (n.includes("cartesian")) return "cartesian";
                        if (n.includes("scara")) return "scara";
                        if (n.includes("delta")) return "delta";
                        return "articulated";
                      };

                      const armId = isStep6 ? mapNameToArmId(stat.name) : null;
                      const isSelected = isStep6 && selectedArmType === armId;

                      if (isStep6) {
                        return (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => {
                              if (armId) {
                                setSelectedArmType(armId);
                                if (armId === "articulated") {
                                  setJ1(25); setJ2(45); setJ3(-35); setJ5(-20);
                                } else if (armId === "cobra") {
                                  setJ1(-30); setJ2(75); setJ3(-110); setJ5(-10);
                                } else if (armId === "cartesian") {
                                  setJ1(0); setJ2(90); setJ3(-90); setJ5(0);
                                } else if (armId === "scara") {
                                  setJ1(35); setJ2(0); setJ3(-30); setJ5(-90);
                                } else if (armId === "delta") {
                                  setJ1(0); setJ2(110); setJ3(-110); setJ5(-90);
                                }
                                scrollToSimulation();
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none relative group overflow-hidden ${
                              isSelected
                                ? "bg-rose-950/20 border-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/30"
                                : "bg-slate-950/90 border-slate-850 hover:border-rose-500/40 text-slate-400 hover:text-white"
                            }`}
                          >
                            <span className={`block text-[7.5px] font-mono uppercase font-black tracking-wider ${isSelected ? "text-rose-400" : "text-slate-500 group-hover:text-rose-400"}`}>{stat.name}</span>
                            <span className="block text-[10px] font-sans font-black mt-1.5 leading-snug">{stat.val}</span>
                            {isSelected && (
                              <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            )}
                          </button>
                        );
                      }

                      return (
                        <div key={sIdx} className="p-2 rounded-xl bg-slate-950/90 border border-slate-800/40">
                          <span className="block text-[7.5px] font-mono text-slate-550 uppercase font-bold">{stat.name}</span>
                          <span className="block text-[10px] font-sans font-extrabold text-[#ffffff] mt-0.5">{stat.val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {currentStep === 6 ? (
            <div className="rounded-2xl border border-rose-500/20 bg-[#060813] overflow-hidden shadow-2xl relative flex flex-col min-h-[500px] text-left p-6 space-y-6">
              {/* Highlight ambient glow */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-85" />
              
              {(() => {
                const d = ARM_DETAILS[selectedArmType];
                return (
                  <div className="space-y-6 flex flex-col justify-between h-full flex-1">
                    
                    {/* Top title and coordinate system badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] font-mono text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                            Class: {selectedArmType}
                          </span>
                        </div>
                        <h3 className="font-sans font-black text-lg text-white uppercase tracking-tight">
                          {d.title}
                        </h3>
                        <p className="font-mono text-xs text-rose-400 tracking-wide uppercase font-bold mt-1">
                          ↳ {d.sub}
                        </p>
                      </div>
                      
                      {/* Big design coordinate axis code layout */}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[9px] text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="font-bold text-slate-300">GEO MODEL SYNCED</span>
                      </div>
                    </div>

                    {/* Main Layout Grid - Split Image on left / spec details on right */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-1">
                      
                      {/* Left side: Premium Image Viewport Frame */}
                      <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/80 border border-slate-800/80 rounded-2xl relative p-6 group min-h-[260px] overflow-hidden pt-10">
                        {/* Interactive glow effect */}
                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-b from-transparent to-rose-950/15 group-hover:to-rose-950/25 pointer-events-none transition-all duration-300" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#110e19_1px,transparent_1px),linear-gradient(to_bottom,#110e19_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

                        {/* Image wrapper */}
                        <div className="relative w-full h-[220px] flex items-center justify-center">
                          <img 
                            src={d.image} 
                            alt={d.title} 
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain select-none drop-shadow-[0_0_25px_rgba(244,63,94,0.15)] transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Position feedback coordinates */}
                        <div className="absolute bottom-2.5 right-4 font-mono text-[8px] text-slate-500 uppercase font-black">
                          VIEWPORT: SOLID PRESET
                        </div>
                      </div>

                      {/* Right side: Specialized Mechatronic Specifications */}
                      <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                          {/* Overview Description */}
                          <div className="space-y-1.5">
                            <span className="font-mono text-[8px] text-rose-450 font-extrabold tracking-widest block uppercase">// PROFILE OVERVIEW</span>
                            <p className="text-slate-300 text-xs leading-relaxed font-sans">{d.desc}</p>
                          </div>

                          {/* Specification Items */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                            
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="font-mono text-[8px] text-slate-500 block uppercase font-extrabold tracking-wider">JOINT LINKAGE</span>
                                <p className="text-[10px] text-white mt-1.5 font-bold leading-relaxed">{d.how}</p>
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="font-mono text-[8px] text-slate-500 block uppercase font-extrabold tracking-wider">SPEC SHEET</span>
                                <p className="text-[10px] text-white mt-1.5 font-bold leading-relaxed">{d.spec}</p>
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="font-mono text-[8px] text-slate-500 block uppercase font-extrabold tracking-wider">APPLICATIONS</span>
                                <p className="text-[10px] text-slate-300 mt-1.5 font-bold leading-relaxed">{d.best}</p>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Interactive Alignment Controller Deck at the bottom of Right-Column card */}
                        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-[10px] font-mono leading-none">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider">Baseline Stance:</span>
                            <span className="text-slate-200">J1={selectedArmType === "articulated" ? "25" : selectedArmType === "cobra" ? "-30" : selectedArmType === "cartesian" ? "0" : selectedArmType === "scara" ? "35" : "0"}°</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (selectedArmType === "articulated") {
                                setJ1(25); setJ2(45); setJ3(-35); setJ5(-20);
                              } else if (selectedArmType === "cobra") {
                                setJ1(-30); setJ2(75); setJ3(-110); setJ5(-10);
                              } else if (selectedArmType === "cartesian") {
                                setJ1(0); setJ2(90); setJ3(-90); setJ5(0);
                              } else if (selectedArmType === "scara") {
                                setJ1(35); setJ2(0); setJ3(-30); setJ5(-90);
                              } else if (selectedArmType === "delta") {
                                setJ1(0); setJ2(110); setJ3(-110); setJ5(-90);
                              }
                              scrollToSimulation();
                            }}
                            className="px-3.5 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-extrabold uppercase text-[9px] tracking-widest transition-colors cursor-pointer text-center"
                          >
                            Align 3D Stance
                          </button>
                        </div>

                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-[#060a16] overflow-hidden shadow-2xl relative select-none flex flex-col min-h-[500px]">
              {/* Ambient visual graph overlay background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1.5px,transparent_1.5px),linear-gradient(to_bottom,#0f172a_1.5px,transparent_1.5px)] bg-[size:24px_24px] opacity-45 pointer-events-none" />

            {/* Viewport upper toolbar controller */}
            <div className="relative z-10 p-4 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-left font-mono">
                <span className="text-[8px] text-cyan-500 uppercase font-black tracking-widest block">INTERACTIVE SIMULATION VIEWPORT</span>
                <span className="text-xs text-white font-extrabold uppercase tracking-wide">6-DOF VIRTUAL ARM WORKSPACE</span>
              </div>

              {/* Viewport Settings */}
              <div className="flex flex-wrap gap-2 items-center font-mono text-[9px]">
                <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-lg">
                  <span className="text-slate-400 ml-1">Zoom:</span>
                  <input
                    type="range"
                    min="0.75"
                    max="1.75"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-16 h-1 bg-slate-950 rounded appearance-none"
                    style={getProgressStyle(zoom, 0.75, 1.75, "#22d3ee")}
                  />
                  <span className="text-slate-300 font-bold px-1">{Math.round(zoom * 100)}%</span>
                </div>
              </div>
            </div>

            {/* MAIN SVG CANVAS CONTAINER: MOUSE & TOUCH ROTATIONS ATTACHED DIRECTLY */}
            <div 
              className="flex-1 w-full flex items-center justify-center relative cursor-grab active:cursor-grabbing h-[340px] overflow-hidden bg-slate-950"
              style={{ touchAction: "none" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
               onTouchEnd={handleTouchEnd}
            >
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full max-w-[420px] overflow-visible drop-shadow-[0_0_35px_rgba(6,182,212,0.05)]"
              >
                <defs>
                  {/* Cyberpunk & Mechatronic Linear High-Contrast Bar Gradients */}
                  <linearGradient id="cyanGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0891b2" />
                    <stop offset="30%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                  <linearGradient id="purpleGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d8b4fe" />
                    <stop offset="35%" stopColor="#c084fc" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                  <linearGradient id="emeraldGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a7f3d0" />
                    <stop offset="40%" stopColor="#34d399" />
                    <stop offset="70%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#022c22" />
                  </linearGradient>
                  <linearGradient id="amberGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>

                {/* Dynamic 3D Horizontal Grid and Coordinate Systems Plane */}
                {radialGridLines}
                {gridLines}

                {/* Concentric 3D Range Sweep Circles */}
                <path d={getProjectedCirclePath(45)} fill="none" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="2,4" className="opacity-20" />
                <path d={getProjectedCirclePath(90)} fill="none" stroke="#22d3ee" strokeWidth="0.75" strokeDasharray="3,5" className="opacity-30" />
                <path d={getProjectedCirclePath(135)} fill="none" stroke="#22d3ee" strokeWidth="0.95" strokeDasharray="4,6" className="opacity-35" />
                <path d={getProjectedCirclePath(150)} fill="none" stroke="#22d3ee" strokeWidth="1.2" className="opacity-15" />

                {/* Dynamic Cardinal Degree Marks in 3D projection */}
                {axisTicks}

                {/* Horizontal projection path outlines of arm segments on plane */}
                <path
                  d={`M ${project3D({ x: 0, y: 0, z: 0 }).x} ${project3D({ x: 0, y: 0, z: 0 }).y} 
                     L ${project3D({ x: coords.n3.x, y: coords.n3.y, z: 0 }).x} ${project3D({ x: coords.n3.x, y: coords.n3.y, z: 0 }).y}
                     L ${project3D({ x: coords.n4.x, y: coords.n4.y, z: 0 }).x} ${project3D({ x: coords.n4.x, y: coords.n4.y, z: 0 }).y}
                     L ${project3D({ x: coords.n6.x, y: coords.n6.y, z: 0 }).x} ${project3D({ x: coords.n6.x, y: coords.n6.y, z: 0 }).y}`}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2,3"
                  className="opacity-60"
                />

                {/* Link drop references */}
                <line x1={p3.x} y1={p3.y} x2={project3D({ x: coords.n3.x, y: coords.n3.y, z: 0 }).x} y2={project3D({ x: coords.n3.x, y: coords.n3.y, z: 0 }).y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                <line x1={p4.x} y1={p4.y} x2={project3D({ x: coords.n4.x, y: coords.n4.y, z: 0 }).x} y2={project3D({ x: coords.n4.x, y: coords.n4.y, z: 0 }).y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                <line x1={p6.x} y1={p6.y} x2={project3D({ x: coords.n6.x, y: coords.n6.y, z: 0 }).x} y2={project3D({ x: coords.n6.x, y: coords.n6.y, z: 0 }).y} stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />

                {/* STEP 5 Inverse Kinematics target point marker */}
                {currentStep === 5 && kinematicsMode === "inverse" && (
                  <g>
                    <circle cx="160" cy="165" r={(L_upper + L_fore) * zoom} fill="none" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="2,4" className="opacity-20" />
                    <g transform={`translate(${project3D(targetPoint).x}, ${project3D(targetPoint).y})`}>
                      <circle cx="0" cy="0" r="12" fill="none" stroke="#3b82f6" strokeWidth="1" className="opacity-40" />
                      <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                      <line x1="-16" y1="0" x2="16" y2="0" stroke="#3b82f6" strokeWidth="0.5" />
                      <line x1="0" y1="-16" x2="0" y2="16" stroke="#3b82f6" strokeWidth="0.5" />
                      <text x="18" y="3" className="font-mono text-[7px]" fill="#3b82f6">Target Pos</text>
                    </g>
                  </g>
                )}

                {/* Staging plates for Pick & Place / Sorting */}
                {((currentStep === 4 && ppState !== "IDLE") || (currentStep === 6 && cameraState !== "STANDBY")) && (
                  <g>
                    <ellipse cx={project3D(ptA).x} cy={project3D(ptA).y} rx="16" ry="7" fill="#030712" stroke="#4a5568" strokeWidth="1" />
                    <text x={project3D(ptA).x} y={project3D(ptA).y - 12} textAnchor="middle" className="font-mono text-[6px] text-slate-500 font-bold uppercase">Staging Area A</text>

                    <ellipse cx={project3D(ptB).x} cy={project3D(ptB).y} rx="16" ry="7" fill="#030712" stroke="#4a5568" strokeWidth="1" />
                    <text x={project3D(ptB).x} y={project3D(ptB).y - 12} textAnchor="middle" className="font-mono text-[6px] text-slate-500 font-bold uppercase">Staging Area B</text>

                    {/* Block in startup/pickup place - adjusted offsets align 100% seamlessly at touchdown */}
                    {blockStatus === "pickup" && (
                      <g transform={`translate(${project3D(ptA).x - 6}, ${project3D(ptA).y + 4})`}>
                        <rect width="12" height="8" rx="1.5" fill={sortingBlockColor === "blue" ? "#3182ce" : sortingBlockColor === "red" ? "#e53e3e" : "#dd6b20"} stroke="#fff" strokeWidth="0.5" />
                        <line x1="3" y1="4" x2="9" y2="4" stroke="#fff" strokeWidth="0.5" opacity="0.6" />
                      </g>
                    )}

                    {blockStatus === "sorted" && (
                      <g transform={`translate(${project3D(ptB).x - 6}, ${project3D(ptB).y + 4})`}>
                        <rect width="12" height="8" rx="1.5" fill={sortingBlockColor === "blue" ? "#3182ce" : sortingBlockColor === "red" ? "#e53e3e" : "#dd6b20"} stroke="#fff" strokeWidth="0.5" />
                        <line x1="3" y1="4" x2="9" y2="4" stroke="#fff" strokeWidth="0.5" opacity="0.6" />
                      </g>
                    )}
                  </g>
                )}

                {/* PHYSICAL MULTI-AXIS MECHANICAL SECTIONS */}
                <g className="transition-all duration-300">
                  {/* UNBREAKABLE BASE COLUMN (LINK 0) - Rendered behind caps with butt caps to NEVER overlap or detach */}
                  {!showWireframe && (
                    <>
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isSelectedStyle("base") ? "#22d3ee" : "#0d1b2a"} strokeWidth="13" strokeLinecap="butt" />
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="url(#cyanGlowGrad)" strokeWidth="11" strokeLinecap="butt" className="opacity-95" />
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ffffff" strokeWidth="1.8" strokeLinecap="butt" className="opacity-80" />
                    </>
                  )}
                  {showWireframe && (
                    <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3" strokeLinecap="butt" />
                  )}

                   {/* Base Cylinder Caps layered ON TOP of the cylinder body to perfectly mask and bind them */}
                   <g 
                     onClick={() => setHighlightedPart(highlightedPart === "base" ? "none" : "base")} 
                     onMouseEnter={() => setHighlightedPart("base")} 
                     onMouseLeave={() => setHighlightedPart("none")} 
                     className="cursor-pointer"
                   >
                     <ellipse cx={p1.x} cy={p1.y} rx="26" ry={baseRy} fill={showWireframe ? "none" : "#1e293b"} stroke={isSelectedStyle("base") ? "#22d3ee" : "#475569"} strokeWidth="1.5" />
                     <ellipse cx={p2.x} cy={p2.y} rx="17" ry={topRy} fill={showWireframe ? "none" : "#1e293b"} stroke={isSelectedStyle("base") ? "#22d3ee" : "#4b5563"} strokeWidth="1.2" className="opacity-90" />
                   </g>
 
                   {/* Joint 2 (Shoulder Pivot) - Glowing Purple */}
                   <g 
                     onClick={() => setHighlightedPart(highlightedPart === "shoulder" ? "none" : "shoulder")} 
                     onMouseEnter={() => setHighlightedPart("shoulder")} 
                     onMouseLeave={() => setHighlightedPart("none")} 
                     className="cursor-pointer"
                   >
                     <circle cx={p2.x} cy={p2.y} r="8.5" fill={showWireframe ? "none" : "#0d041c"} stroke={isSelectedStyle("shoulder") ? "#d8b4fe" : "#a855f7"} strokeWidth={2} />
                     <circle cx={p2.x} cy={p2.y} r="3" fill="#c084fc" />
                   </g>
 
                   {/* Axis indication during sweep */}
                   {activeDofTest === "j2" && (
                     <g>
                       <line x1={p2.x - 22} y1={p2.y} x2={p2.x + 22} y2={p2.y} stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2,2" />
                       <ellipse cx={p2.x} cy={p2.y} rx="15" ry="15" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="1,2" />
                     </g>
                   )}
 
                   {/* LINK 1 (Upper Arm) - Gorgeous purple glow bar connecting joints */}
                   <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke={isSelectedStyle("shoulder") ? "#d8b4fe" : "#3b0764"} strokeWidth="11" strokeLinecap="round" opacity={showWireframe ? 0.35 : 0.95} />
                   <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="url(#purpleGlowGrad)" strokeWidth="8" strokeLinecap="round" opacity={showWireframe ? 0.1 : 0.9} />
                   <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity={showWireframe ? 0.05 : 0.75} />
 
                   {/* Joint 3 (Elbow Pivot) - Glowing Emerald Green */}
                   <g 
                     onClick={() => setHighlightedPart(highlightedPart === "elbow" ? "none" : "elbow")} 
                     onMouseEnter={() => setHighlightedPart("elbow")} 
                     onMouseLeave={() => setHighlightedPart("none")} 
                     className="cursor-pointer"
                   >
                     <circle cx={p3.x} cy={p3.y} r="7.5" fill={showWireframe ? "none" : "#02170e"} stroke={isSelectedStyle("elbow") ? "#a7f3d0" : "#10b981"} strokeWidth={2} />
                     <circle cx={p3.x} cy={p3.y} r="2.5" fill="#34d399" />
                   </g>
 
                   {/* LINK 2 (Forearm) - Energetic emerald carbon glow bar connecting joints */}
                   <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke={isSelectedStyle("elbow") ? "#a7f3d0" : "#064e3b"} strokeWidth="9" strokeLinecap="round" opacity={showWireframe ? 0.35 : 0.95} />
                   <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke="url(#emeraldGlowGrad)" strokeWidth="6.5" strokeLinecap="round" opacity={showWireframe ? 0.1 : 0.9} />
                   <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity={showWireframe ? 0.05 : 0.7} />
 
                   {/* Joint 4/5 (Wrist Pivot) - Glowing Amber Gold */}
                   <g 
                     onClick={() => setHighlightedPart(highlightedPart === "wrist" ? "none" : "wrist")} 
                     onMouseEnter={() => setHighlightedPart("wrist")} 
                     onMouseLeave={() => setHighlightedPart("none")} 
                     className="cursor-pointer"
                   >
                     <circle cx={p4.x} cy={p4.y} r="6" fill={showWireframe ? "none" : "#1c1102"} stroke={isSelectedStyle("wrist") ? "#fde047" : "#f59e0b"} strokeWidth={1.5} />
                     <circle cx={p4.x} cy={p4.y} r="2" fill="#fbbf24" />
                   </g>
 
                   {/* LINK 3 (Wrist Tool) - Bronze Metallic glow bar connecting joints */}
                   <line x1={p4.x} y1={p4.y} x2={p5.x} y2={p5.y} stroke={isSelectedStyle("wrist") ? "#fde047" : "#451a03"} strokeWidth="6.5" strokeLinecap="round" />
                   <line x1={p4.x} y1={p4.y} x2={p5.x} y2={p5.y} stroke="url(#amberGlowGrad)" strokeWidth="4.5" strokeLinecap="round" />
                   <line x1={p4.x} y1={p4.y} x2={p5.x} y2={p5.y} stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />
 
                   {/* Animated Signal Energy Pulse traveling up the arm, showing signal flow mechatronics */}
                   {!showWireframe && (
                     <path
                       d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} L ${p5.x} ${p5.y}`}
                       fill="none"
                       stroke="#22d3ee"
                       strokeWidth="1.5"
                       strokeDasharray="10 30"
                       strokeLinecap="round"
                       className="opacity-90"
                     >
                       <animate
                         attributeName="stroke-dashoffset"
                         values="100;0"
                         dur="1.8s"
                         repeatCount="indefinite"
                       />
                     </path>
                   )}
 
                   {/* End Effector Gripper Claws - Dynamically rotating to match the robot arm segment direction */}
                   <g 
                     transform={`translate(${p5.x}, ${p5.y}) rotate(${gripperAngleDeg - 90})`}
                     onClick={() => setHighlightedPart(highlightedPart === "gripper" ? "none" : "gripper")} 
                     onMouseEnter={() => setHighlightedPart("gripper")} 
                     onMouseLeave={() => setHighlightedPart("none")} 
                     className="cursor-pointer"
                   >
                     <circle cx="0" cy="0" r="4.5" fill={isSelectedStyle("gripper") ? "#ffe4e6" : "#f43f5e"} />
                    {(() => {
                      const gap = 8.5 - (activeJ6Closed / 100) * 8.0;
                      const leftX2 = -2.5 - gap;
                      const rightX2 = 2.5 + gap;
                      return (
                        <g>
                          {/* Left Claw Segment */}
                          <line x1="-3.5" y1="0" x2={leftX2} y2="9" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1={leftX2} y1="9" x2={leftX2 + 1.8} y2="14" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                          
                          {/* Right Claw Segment */}
                          <line x1="3.5" y1="0" x2={rightX2} y2="9" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1={rightX2} y1="9" x2={rightX2 - 1.8} y2="14" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                        </g>
                      );
                    })()}
                  </g>

                  {/* Attached payload during carry operations */}
                  {((currentStep === 4 && ppState === "GRIPPING") || 
                    (currentStep === 4 && ppState === "SWIVEL") ||
                    (currentStep === 4 && ppState === "DEPOSITING") ||
                    (currentStep === 6 && cameraState === "AUTOPILOT_SORT")) && blockStatus === "attached" && (
                    <g transform={`translate(${p6.x - 6}, ${p6.y + 4})`}>
                      <rect width="12" height="8" rx="1.5" fill={sortingBlockColor === "blue" ? "#3182ce" : sortingBlockColor === "red" ? "#e53e3e" : "#dd6b20"} stroke="#fff" strokeWidth="0.5" />
                    </g>
                  )}
                </g>

                {/* Specialized Industrial Tool Tip Effects for Step 4 */}
                {currentStep === 4 && ppState !== "IDLE" && (
                  <g>
                    {/* PCB Solder Thermal Effect */}
                    {selectedScenario === "pcb_solder" && ["DESCENDING", "GRIPPING", "DEPOSITING", "RELEASE"].includes(ppState) && (
                      <g>
                        <circle cx={p6.x} cy={p6.y + 11} r="9" fill="#f97316" opacity="0.35" className="animate-pulse" />
                        <circle cx={p6.x} cy={p6.y + 11} r="4" fill="#ffedd5" />
                        <line x1={p6.x} y1={p6.y + 11} x2={p6.x - 4 + 8 * Math.random()} y2={p6.y + 11 + 6 * Math.random()} stroke="#fdba74" strokeWidth="1" />
                      </g>
                    )}
                    
                    {/* Heavy Arc Welding Plasma/Spark Burst */}
                    {selectedScenario === "arc_welding" && ["DESCENDING", "GRIPPING", "SWIVEL", "DEPOSITING"].includes(ppState) && (
                      <g>
                        <circle cx={p6.x} cy={p6.y + 10} r="16" fill="#22d3ee" opacity="0.4" className="animate-pulse" />
                        <circle cx={p6.x} cy={p6.y + 10} r="6" fill="#f0fdfa" />
                        
                        {/* Beautifully animated electric sparks using random offsets synced with the frame clock */}
                        <line x1={p6.x} y1={p6.y + 10} x2={p6.x - 14 + 28 * Math.cos(time * 42)} y2={p6.y + 10 - 14 + 28 * Math.sin(time * 35)} stroke="#06b6d4" strokeWidth="1.5" opacity="0.9" />
                        <line x1={p6.x} y1={p6.y + 10} x2={p6.x - 18 * Math.sin(time * 50)} y2={p6.y + 10 + 18 * Math.cos(time * 45)} stroke="#22d3ee" strokeWidth="1" opacity="0.8" />
                        <line x1={p6.x} y1={p6.y + 10} x2={p6.x + 15 * Math.cos(time * 58)} y2={p6.y + 10 + 15 * Math.cos(time * 24)} stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />
                        <line x1={p6.x} y1={p6.y + 10} x2={p6.x - 16 * Math.cos(time * 70)} y2={p6.y + 10 + 16 * Math.sin(time * 61)} stroke="#38bdf8" strokeWidth="1" opacity="0.85" />
                      </g>
                    )}
                  </g>
                )}

                {/* Glowing 3D Target Reticle for Step 1 highlightedPart */}
                {currentStep === 1 && highlightedPart !== "none" && (
                  <g>
                    {(() => {
                      let cx = 0, cy = 0, color = "#22d3ee";
                      if (highlightedPart === "base") {
                        cx = p1.x; cy = p1.y; color = "#22d3ee";
                      } else if (highlightedPart === "shoulder") {
                        cx = p2.x; cy = p2.y; color = "#c084fc";
                      } else if (highlightedPart === "elbow") {
                        cx = p3.x; cy = p3.y; color = "#34d399";
                      } else if (highlightedPart === "wrist") {
                        cx = p4.x; cy = p4.y; color = "#fbbf24";
                      } else if (highlightedPart === "gripper") {
                        cx = p5.x; cy = p5.y; color = "#f43f5e";
                      }
                      
                      return (
                        <g className="animate-fadeIn">
                          {/* Corner alignment brackets */}
                          <path d={`M ${cx - 25} ${cy - 12} L ${cx - 25} ${cy - 25} L ${cx - 12} ${cy - 25}`} fill="none" stroke={color} strokeWidth="1.8" opacity="0.95" />
                          <path d={`M ${cx + 25} ${cy - 12} L ${cx + 25} ${cy - 25} L ${cx + 12} ${cy - 25}`} fill="none" stroke={color} strokeWidth="1.8" opacity="0.95" />
                          <path d={`M ${cx - 25} ${cy + 12} L ${cx - 25} ${cy + 25} L ${cx - 12} ${cy + 25}`} fill="none" stroke={color} strokeWidth="1.8" opacity="0.95" />
                          <path d={`M ${cx + 25} ${cy + 12} L ${cx + 25} ${cy + 25} L ${cx + 12} ${cy + 25}`} fill="none" stroke={color} strokeWidth="1.8" opacity="0.95" />
                        </g>
                      );
                    })()}
                  </g>
                )}

                {/* DYNAMIC FORWARD KINEMATICS JOINT COORDINATES FRAME (X, Y, Z OVERLAY) */}
                {highlightedPart !== "none" && kinematicsMode === "forward" && (
                  <g>
                    {(() => {
                      let p3D = coords.n1;
                      let label = "Rotational Base (J1)";
                      let color = "#22d3ee";
                      
                      if (highlightedPart === "base") {
                        p3D = coords.n1;
                        label = "Rotational Base (J1)";
                        color = "#22d3ee";
                      } else if (highlightedPart === "shoulder") {
                        p3D = coords.n2;
                        label = "Shoulder Joint (J2)";
                        color = "#c084fc";
                      } else if (highlightedPart === "elbow") {
                        p3D = coords.n3;
                        label = "Elbow Joint (J3)";
                        color = "#34d399";
                      } else if (highlightedPart === "wrist") {
                        p3D = coords.n4;
                        label = "Wrist Joint (J4)";
                        color = "#fbbf24";
                      } else if (highlightedPart === "gripper") {
                        p3D = coords.n6;
                        label = "End Tool Tip (J5)";
                        color = "#f43f5e";
                      }

                      const ppO = project3D(p3D);
                      const axisLen = 32; // mm vectors Length
                      
                      // Project axes of the dynamic reference coordinate frame in full 3D viewport perspective
                      const ppX = project3D({ x: p3D.x + axisLen, y: p3D.y, z: p3D.z });
                      const ppY = project3D({ x: p3D.x, y: p3D.y + axisLen, z: p3D.z });
                      const ppZ = project3D({ x: p3D.x, y: p3D.y, z: p3D.z + axisLen });

                      // Position offset for the mechatronic data card overlay
                      // Keep it relative to the projected joint coordinate to align neatly
                      const isLeftOfCenter = ppO.x > 160;
                      const textX = ppO.x + (isLeftOfCenter ? -100 : 25);
                      const textY = ppO.y - 35;

                      return (
                        <g>
                          {/* Anchor Circle reticle indicator */}
                          <circle cx={ppO.x} cy={ppO.y} r="14" fill="none" stroke={color} strokeWidth="0.75" strokeDasharray="2,3" className="opacity-80 animate-pulse" />
                          <circle cx={ppO.x} cy={ppO.y} r="5" fill="none" stroke={color} strokeWidth="1.5" />
                          <circle cx={ppO.x} cy={ppO.y} r="1.5" fill="#ffffff" />

                          {/* Dynamic 3D Axes Vectors pointing from the joint position */}
                          {/* X Vector (Red: horizontal/depth translation) */}
                          <line x1={ppO.x} y1={ppO.y} x2={ppX.x} y2={ppX.y} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                          <circle cx={ppX.x} cy={ppX.y} r="2" fill="#ef4444" />
                          <text x={ppX.x + (ppX.x > ppO.x ? 5 : -5)} y={ppX.y + 2} className="font-mono text-[7.5px] font-black text-rose-500" fill="#ef4444" textAnchor="middle">x</text>

                          {/* Y Vector (Green: lateral rotation) */}
                          <line x1={ppO.x} y1={ppO.y} x2={ppY.x} y2={ppY.y} stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                          <circle cx={ppY.x} cy={ppY.y} r="2" fill="#10b981" />
                          <text x={ppY.x + (ppY.x > ppO.x ? 5 : -5)} y={ppY.y + 2} className="font-mono text-[7.5px] font-black text-emerald-500" fill="#10b981" textAnchor="middle">y</text>

                          {/* Z Vector (Blue: vertical link height lift) */}
                          <line x1={ppO.x} y1={ppO.y} x2={ppZ.x} y2={ppZ.y} stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                          <circle cx={ppZ.x} cy={ppZ.y} r="2" fill="#3b82f6" />
                          <text x={ppZ.x} y={ppZ.y - 4} className="font-mono text-[7.5px] font-black text-blue-500" fill="#3b82f6" textAnchor="middle">z</text>

                          {/* Dotted Leader Line linking joint to math tooltip tag */}
                          <path d={`M ${ppO.x} ${ppO.y} L ${textX + 35} ${textY + 18}`} fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="0.8" strokeDasharray="1,2" />

                          {/* STEM Cartesian Readout Box */}
                          <g transform={`translate(${textX}, ${textY})`} className="drop-shadow-lg">
                            {/* Glass overlay background panel */}
                            <rect x="0" y="-14" width="76" height="38" rx="5" fill="#030712" fillOpacity="0.94" stroke={color} strokeWidth="1.2" />
                            <rect x="2" y="-12" width="72" height="34" rx="3.5" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            
                            {/* Title Label */}
                            <text x="38" y="-5" className="font-sans font-black text-[6.5px] fill-slate-200 tracking-wider text-center" textAnchor="middle">
                              {label.toUpperCase()}
                            </text>
                            
                            <line x1="4" y1="-1" x2="72" y2="-1" stroke="rgba(148,163,184,0.18)" strokeWidth="0.5" />

                            {/* Cartesian values in mm in distinct high-contrast colors */}
                            <text x="8" y="8" className="font-mono text-[7.5px] font-black fill-red-450">X: {Math.round(p3D.x)}mm</text>
                            <text x="8" y="16" className="font-mono text-[7.5px] font-black fill-emerald-450">Y: {Math.round(p3D.y)}mm</text>
                            <text x="44" y="12" className="font-mono text-[8px] font-black fill-blue-450">Z: {Math.round(p3D.z)}mm</text>
                          </g>
                        </g>
                      );
                    })()}
                  </g>
                )}

                {/* Perspective coordinate labels & Real-time 3D Compass */}
                <g className="font-mono text-[7px]" fill="#475569">
                  <text x="10" y="305">W_SPACE AXIS [X_0]</text>
                  <line x1="10" y1="310" x2="45" y2="310" stroke="#334155" strokeWidth="0.8" />
                  <text x="200" y="305">BASE PLANE ROTATION [Z_0]</text>
                </g>

                {/* Real-time 3D Coordinate Axis Compass */}
                {(() => {
                  const origin3D = { x: -110, y: -110, z: 0 };
                  const ppO = project3D(origin3D);
                  const ppX = project3D({ x: origin3D.x + 25, y: origin3D.y, z: origin3D.z });
                  const ppY = project3D({ x: origin3D.x, y: origin3D.y + 25, z: origin3D.z });
                  const ppZ = project3D({ x: origin3D.x, y: origin3D.y, z: origin3D.z + 25 });
                  
                  return (
                    <g>
                      {/* Origin dot */}
                      <circle cx={ppO.x} cy={ppO.y} r="1.5" fill="#475569" opacity="0.8" />
                      
                      {/* X Axis - Red */}
                      <line x1={ppO.x} y1={ppO.y} x2={ppX.x} y2={ppX.y} stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
                      <text x={ppX.x + (ppX.x > ppO.x ? 5 : -5)} y={ppX.y + 2.5} className="font-mono text-[7px] font-extrabold" fill="#f87171" textAnchor="middle">+X</text>
                      
                      {/* Y Axis - Green */}
                      <line x1={ppO.x} y1={ppO.y} x2={ppY.x} y2={ppY.y} stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
                      <text x={ppY.x + (ppY.x > ppO.x ? 5 : -5)} y={ppY.y + 2.5} className="font-mono text-[7px] font-extrabold" fill="#34d399" textAnchor="middle">+Y</text>
                      
                      {/* Z Axis - Blue */}
                      <line x1={ppO.x} y1={ppO.y} x2={ppZ.x} y2={ppZ.y} stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
                      <text x={ppZ.x} y={ppZ.y - (ppZ.y < ppO.y ? 3 : -6)} className="font-mono text-[7px] font-extrabold" fill="#60a5fa" textAnchor="middle">+Z (Up)</text>
                      
                      {/* Caption text */}
                      <text x={ppO.x - 5} y={ppO.y + 20} className="font-mono text-[6px] fill-slate-500 font-bold uppercase tracking-wider">3D orientation</text>
                    </g>
                  );
                })()}
              </svg>

              {/* Viewport Floating Orbit Directions Tooltip */}
              <div className="absolute bottom-3 left-3 bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-[8.5px] text-slate-400 space-y-0.5 pointer-events-none transition-all">
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span className="text-slate-300">Drag or swipe above to rotate 3D viewport</span>
                </div>
              </div>
            </div>

            {/* REAL-TIME SIMULATOR DIGI-PANEL AT THE BOTTOM - COMPACT & SOLID */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono relative z-10">
              <div className="space-y-1">
                <span className="text-[7.5px] text-slate-500 block uppercase font-bold">1st JOINT (YAW):</span>
                <span className="text-[11.5px] text-white font-extrabold">{Math.round(coords.y)}° / 135°</span>
              </div>
              <div className="space-y-1 border-l border-slate-800 pl-3">
                <span className="text-[7.5px] text-purple-400 block uppercase font-bold">2nd JOINT (SHOULDER):</span>
                <span className="text-[11.5px] text-white font-extrabold">{Math.round(coords.s)}° / 105°</span>
              </div>
              <div className="space-y-1 border-l border-slate-800 pl-3">
                <span className="text-[7.5px] text-emerald-400 block uppercase font-bold">3rd JOINT (ELBOW):</span>
                <span className="text-[11.5px] text-white font-extrabold">{Math.round(coords.e)}° / 110°</span>
              </div>
              <div className="space-y-1 border-l border-slate-800 pl-3">
                <span className="text-[7.5px] text-cyan-400 block uppercase font-bold">END EFF-XYZ (mm):</span>
                <span className="text-[11.5px] text-amber-500 font-extrabold">X:{Math.round(coords.n6.x)} Y:{Math.round(coords.n6.y)} Z:{Math.round(coords.n6.z)}</span>
              </div>
            </div>

          </div>
          )}

          {/* STEP 3 BELOW-SIMULATION FOR MOBILE USERS - CALIBRATION CONTROLS */}
          {currentStep === 3 && (
            <div className="block lg:hidden bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4 text-left animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="font-sans font-black text-xs uppercase tracking-wider">Calibration Deck</h3>
              </div>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                Tune the multi-axis physical joint controls directly below the viewport. Watch how the robotic arm tilts and pivots in real-time.
              </p>
              {renderCalibrationSliders()}
            </div>
          )}

          {/* STEP 5 BELOW-SIMULATION - PERSISTENT REAL-TIME MATH SANDBOX DASHBOARD */}
          {currentStep === 5 && (
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-5 text-left animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 text-white justify-between flex-wrap">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-400 animate-pulse" />
                  <h3 className="font-sans font-black text-xs uppercase tracking-wider">Kinematics Mathematics Sandbox</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.5 border border-blue-500/20 bg-blue-500/5 text-blue-400/80 rounded-full">
                    LIVE EQUATION BACKSOLVER
                  </div>
                  <button
                    onClick={() => setIsMathSandboxOpen(true)}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-sans font-black text-[10px] uppercase tracking-wider rounded-lg shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all text-center cursor-pointer flex items-center gap-1.5 border border-blue-400/30 font-bold"
                  >
                    <Calculator className="w-3.5 h-3.5 text-white" />
                    Open Sandbox
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                This dashboard showcases the actual Denavit-Hartenberg (D-H) matrix calculations and law-of-cosines trigonometry backsolvers updating live under the hood of the robot arm simulator.
              </p>

              {/* Mode Selection */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="space-y-0.5">
                  <span className="font-mono text-[8px] text-slate-500 block uppercase font-bold">// RESOLVER MODE:</span>
                  <p className="text-[10px] text-slate-300">
                    {kinematicsMode === "forward" 
                      ? "Forward Kinematics: Joint Angles (θ) ➔ Cartesian Coordinates (X, Y, Z)" 
                      : "Inverse Kinematics: Cartesian Coordinates (X, Y, Z) ➔ Joint Angles (θ)"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 bg-slate-900/60 p-1 rounded-lg border border-slate-800 gap-1 font-mono text-[9px] w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      setKinematicsMode("forward");
                      setRotYaw(-65);
                      setRotPitch(22);
                      scrollToSimulation();
                    }}
                    className={`py-1.5 px-3 text-center rounded font-extrabold transition-all cursor-pointer ${
                      kinematicsMode === "forward" 
                        ? "bg-slate-955 text-blue-400 border border-blue-500/30" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Forward
                  </button>
                  <button
                    onClick={() => {
                      setKinematicsMode("inverse");
                      setRotYaw(-25);
                      setRotPitch(18);
                      scrollToSimulation();
                    }}
                    className={`py-1.5 px-3 text-center rounded font-extrabold transition-all cursor-pointer ${
                      kinematicsMode === "inverse" 
                        ? "bg-slate-955 text-blue-400 border border-blue-500/30" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Inverse
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDUCATIVE KNOWLEDGE CARD (TIES LOOSE ENDS) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className={`p-2.5 rounded-lg bg-slate-800 ${stepColors[currentStep].text} border border-slate-700`}>
                <Award className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                  {currentStep === 1 && "Assembly Check Completed"}
                  {currentStep === 2 && "Isolate Axis limits tuned"}
                  {currentStep === 3 && "Joint Dilation calibrated"}
                  {currentStep === 4 && "Path Sequence validated"}
                  {currentStep === 5 && "Denavit-Hartenberg Matrices solved"}
                  {currentStep === 6 && "Industrial Arm Configurations Reviewed"}
                </h4>
                <p className="text-[10.5px] text-slate-400 leading-normal max-w-xl">
                  {currentStep === 1 && "You have completed a structural inspection. Industrial arms always launch diagnostic swivels to verify physical component health before running active tasks."}
                  {currentStep === 2 && "Each isolated rotation proves limits. Exceeding nominal tolerances risks structural friction or planetary gearbox wear."}
                  {currentStep === 3 && "Manual calibration overrides let technicians tweak micro-alignments if components change during manufacturing."}
                  {currentStep === 4 && "Programs loop identically. This repeating path cycle eliminates human deviation, improving product yields."}
                  {currentStep === 5 && "Forward systems specify angles. Inverse logic forms the central core of advanced robotic path planning algorithms."}
                  {currentStep === 6 && "You have completed the robotics curriculum! Industrial robots vary in structure to balance workspace layouts, mechanical speed, lifting payloads, and precision requirements."}
                </p>
              </div>
            </div>

            <div className="p-2 px-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-500 text-left shrink-0">
              <span>DH-SOLVER RESOLUTION:</span>
              <div className="text-emerald-400 font-bold mt-0.5">T_6^(-1) STABLE</div>
            </div>
          </div>

        </div>

      </div>

      {/* KINEMATICS MATHEMATICS RUNTIME MODAL */}
      <AnimatePresence>
        {isMathSandboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsMathSandboxOpen(false)}
          >
            <div
              className="bg-[#030712] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-950/50 rounded-lg border border-blue-800/30 text-blue-400">
                    <Calculator className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                      Kinematics Mathematics Sandbox
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Denavit-Hartenberg (D-H) Matrix Solver & Analytical Backsolver
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMathSandboxOpen(false)}
                  className="p-1 px-3 rounded-lg text-xs font-mono font-bold text-slate-450 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 uppercase text-[9px]">
                    <X className="w-3.5 h-3.5 text-rose-400" /> Close
                  </span>
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300 font-sans max-h-[calc(90vh-80px)]">
                {/* Intro Alert Banner */}
                <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-950/10 text-slate-300 leading-relaxed text-[11px] space-y-1.5">
                  <span className="font-bold text-blue-400 font-mono uppercase text-[10px] tracking-wider block">// Math Engine Status: Operational (6-Axis Solved)</span>
                  <p>
                    This console showcases the genuine mathematics running under the hood of industrialized robotic joints. Set angles or target sliders in the background workspace and watch these mathematical matrices and backcalculated angles update instantly.
                  </p>
                </div>

                {/* Grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left Column: D-H Parameter Matrix */}
                  <div className="space-y-4">
                    <div className="p-3 border border-slate-800 bg-slate-900/30 rounded-xl space-y-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-blue-400 font-black uppercase tracking-widest">
                        <span>[TABLE 01] DENAVIT-HARTENBERG MATRIX</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        To compute forward kinematics, we build reference frames along each link and tabulate their dynamic DH parameters.
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full text-center font-mono text-[9px] border-collapse border border-slate-800">
                          <thead>
                            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                              <th className="p-1.5 border-r border-slate-800 text-[8px]">Joint (i)</th>
                              <th className="p-1.5 border-r border-slate-800 text-[8px]">Length (a_i)</th>
                              <th className="p-1.5 border-r border-slate-800 text-[8px]">Twist (α_i)</th>
                              <th className="p-1.5 border-r border-slate-800 text-[8px]">Offset (d_i)</th>
                              <th className="p-1.5 text-[8px]">Angle (θ_i)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-900">
                              <td className="p-1.5 font-bold text-slate-450 border-r border-slate-800">Joint 1 (Base)</td>
                              <td className="p-1.5 border-r border-slate-800">0 mm</td>
                              <td className="p-1.5 border-r border-slate-800">90°</td>
                              <td className="p-1.5 border-r border-slate-800">{H_base} mm</td>
                              <td className="p-1.5 font-extrabold text-cyan-400">{j1}° (Yaw)</td>
                            </tr>
                            <tr className="border-b border-slate-900">
                              <td className="p-1.5 font-bold text-slate-450 border-r border-slate-800">Joint 2 (Shoulder)</td>
                              <td className="p-1.5 border-r border-slate-800">{L_upper} mm</td>
                              <td className="p-1.5 border-r border-slate-800">0°</td>
                              <td className="p-1.5 border-r border-slate-800">0 mm</td>
                              <td className="p-1.5 font-extrabold text-purple-400">{j2}° (Pitch)</td>
                            </tr>
                            <tr className="border-b border-slate-900">
                              <td className="p-1.5 font-bold text-slate-450 border-r border-slate-800">Joint 3 (Elbow)</td>
                              <td className="p-1.5 border-r border-slate-800">{L_fore} mm</td>
                              <td className="p-1.5 border-r border-slate-800">0°</td>
                              <td className="p-1.5 border-r border-slate-800">0 mm</td>
                              <td className="p-1.5 font-extrabold text-emerald-400">{j3}° (Extension)</td>
                            </tr>
                            <tr>
                              <td className="p-1.5 font-bold text-slate-450 border-r border-slate-800">Joint 4 (Wrist)</td>
                              <td className="p-1.5 border-r border-slate-800">0 mm</td>
                              <td className="p-1.5 border-r border-slate-800">90°</td>
                              <td className="p-1.5 border-r border-slate-800">{L_wrist} mm</td>
                              <td className="p-1.5 font-extrabold text-amber-400">{j5}° (Tilt)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[9px] text-slate-400">
                        <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">// COMPOSITE REACH RANGE:</span>
                        <div className="grid grid-cols-2 gap-2 mt-1.5">
                          <div>
                            <span className="text-slate-500 text-[8px] block">Max Radial Reach:</span>
                            <span className="text-white font-extrabold">{(L_upper + L_fore + L_wrist)} mm</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[8px] block">Active End coordinates:</span>
                            <span className="text-amber-400 font-extrabold">X:{Math.round(coords.n6.x)}, Y:{Math.round(coords.n6.y)}, Z:{Math.round(coords.n6.z)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border border-slate-800 bg-slate-900/30 rounded-xl space-y-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-purple-400 font-black uppercase tracking-widest">
                        <span>[TRANSFORM 02] HOMOGENEOUS LINK MATRIX Transformation</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        To translate reference frames from Joint 'i-1' to 'i', we construct a Standard Transformation matrix incorporating Joint angles:
                      </p>
                      
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-[#161a22] overflow-x-auto">
                        <pre className="font-mono text-[7px] leading-relaxed text-blue-300">
{`[  cos(θ)    -sin(θ)cos(α)    sin(θ)sin(α)     a_i * cos(θ) ]
[  sin(θ)     cos(θ)cos(α)   -cos(θ)sin(α)     a_i * sin(θ) ]
[    0          sin(α)          cos(α)             d_i      ]
[    0            0               0                 1       ]`}
                        </pre>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Dynamic computation of Link 2 (Shoulder segment) resolved values at current set Angle (θ_2 = {j2}°):
                      </p>

                      {(() => {
                        const th2_rad = (j2 * Math.PI) / 180;
                        const cos_2 = Math.cos(th2_rad).toFixed(3);
                        const sin_2 = Math.sin(th2_rad).toFixed(3);
                        return (
                          <div className="bg-slate-950 p-2 rounded border border-slate-900 font-mono text-[8px]">
                            <span className="text-slate-500 block text-[7px] uppercase font-bold">// RESOLVED SOLVER MATRIX:</span>
                            <div className="grid grid-cols-4 gap-1 text-center font-bold text-blue-400 mt-1">
                              <span className="bg-[#0b0f19] py-0.5 rounded">{cos_2}</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">-{sin_2}</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">0.000</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">{(L_upper * Math.cos(th2_rad)).toFixed(1)}</span>

                              <span className="bg-[#0b0f19] py-0.5 rounded">{sin_2}</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">{cos_2}</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">0.000</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">{(L_upper * Math.sin(th2_rad)).toFixed(1)}</span>

                              <span className="bg-[#0b0f19] py-0.5 rounded">0.000</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">0.000</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">1.000</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">0.0</span>

                              <span className="bg-[#0b0f19] py-0.5 rounded">0</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">0</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">0</span>
                              <span className="bg-[#0b0f19] py-0.5 rounded">1</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Inverse Kinematics analytical solver */}
                  <div className="space-y-4">
                    <div className="p-3 border border-slate-800 bg-slate-900/30 rounded-xl space-y-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400 font-black uppercase tracking-widest">
                        <span>[SOLVER 03] ANALYTICAL TRIGONOMETRY ENGINE</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        In Inverse Kinematics, the processor starts from target coordinates (X, Y, Z) and solves equations for Joints.
                      </p>

                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 space-y-2.5 font-mono text-[9px]">
                        <div>
                          <span className="text-slate-500 text-[7px] block uppercase font-bold">1. Radial Distance to joint center (Pr, Zrel) in plane:</span>
                          {(() => {
                            const rx = Math.sqrt(targetPoint.x * targetPoint.x + targetPoint.y * targetPoint.y);
                            const zRel = targetPoint.z - H_base;
                            const dSq = rx * rx + zRel * zRel;
                            return (
                              <div className="text-slate-300 mt-0.5 space-y-0.5">
                                <div>r = √(x² + y²) = √({targetPoint.x}² + {targetPoint.y}²) = {rx.toFixed(1)} mm</div>
                                <div>z_rel = z - H_base = {targetPoint.z} - {H_base} = {zRel.toFixed(0)} mm</div>
                                <div>D_diag = √(r² + z_rel²) = {Math.sqrt(dSq).toFixed(1)} mm</div>
                              </div>
                            );
                          })()}
                        </div>

                        <div>
                          <span className="text-slate-500 text-[7px] block uppercase font-bold">2. Law of Cosines for Elbow Angle (θ_3):</span>
                          {(() => {
                            const r = Math.sqrt(targetPoint.x * targetPoint.x + targetPoint.y * targetPoint.y);
                            const zRel = targetPoint.z - H_base;
                            const distanceSquared = r * r + zRel * zRel;
                            const numerator = distanceSquared - L_upper * L_upper - L_fore * L_fore;
                            const denominator = 2 * L_upper * L_fore;
                            const cosElbow = numerator / denominator;
                            return (
                              <div className="mt-0.5 space-y-0.5 text-slate-300">
                                <div>cos(θ_3) = (D² - L1² - L2²) / (2*L1*L2) = {cosElbow.toFixed(4)}</div>
                                <div>θ_3 = atan2(±√(1 - cos²(θ_3)), cos(θ_3)) = {(Math.acos(Math.max(-1, Math.min(1, cosElbow))) * (180 / Math.PI)).toFixed(1)}°</div>
                              </div>
                            );
                          })()}
                        </div>

                        <div>
                          <span className="text-slate-500 text-[7px] block uppercase font-bold font-black">3. Computed Active Joint angles output:</span>
                          {(() => {
                            const r = Math.sqrt(targetPoint.x * targetPoint.x + targetPoint.y * targetPoint.y);
                            const zRel = targetPoint.z - H_base;
                            const distanceSquared = r * r + zRel * zRel;
                            const numerator = distanceSquared - L_upper * L_upper - L_fore * L_fore;
                            const denominator = 2 * L_upper * L_fore;
                            let cosElbow = numerator / denominator;
                            cosElbow = Math.max(-1, Math.min(1, cosElbow));
                            const sinElbow = -Math.sqrt(Math.max(0, 1 - cosElbow * cosElbow)); 
                            const solvedElbowRad = Math.atan2(sinElbow, cosElbow);
                            const k1 = L_upper + L_fore * cosElbow;
                            const k2 = L_fore * sinElbow;
                            const solvedShoulderRad = Math.atan2(zRel, r) - Math.atan2(k2, k1);
                            const solvedYaw = Math.atan2(targetPoint.y, targetPoint.x) * (180 / Math.PI);
                            const solvedShoulder = solvedShoulderRad * (180 / Math.PI);
                            const solvedElbow = solvedElbowRad * (180 / Math.PI);
                            return (
                              <div className="grid grid-cols-3 gap-1.5 mt-1 bg-slate-900 p-2 rounded border border-slate-800 text-blue-400">
                                <div className="p-1 rounded bg-slate-950/80 text-center">
                                  <span className="text-slate-500 text-[6.5px] block">Yaw [J1]</span>
                                  <span className="font-extrabold">{solvedYaw.toFixed(1)}°</span>
                                </div>
                                <div className="p-1 rounded bg-slate-950/80 text-center">
                                  <span className="text-slate-500 text-[6.5px] block">Pitch [J2]</span>
                                  <span className="font-extrabold">{solvedShoulder.toFixed(1)}°</span>
                                </div>
                                <div className="p-1 rounded bg-slate-950/80 text-center">
                                  <span className="text-slate-500 text-[6.5px] block">Elbow [J3]</span>
                                  <span className="font-extrabold">{solvedElbow.toFixed(1)}°</span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border border-slate-800 bg-slate-900/30 rounded-xl space-y-2">
                      <span className="font-mono text-[9px] text-amber-400 font-extrabold block">// SINGULARITY DETECTOR DICTIONARY:</span>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        If the distance to the goal vector exceeds combined mechanical segment boundaries, the mathematical cosine becomes invalid (&gt; 1 or &lt; -1), triggering a Jacobian structural deadlock singularity block.
                      </p>
                      
                      <div className="p-2 rounded bg-slate-950 border border-slate-900 flex justify-between items-center text-[9.5px]">
                        <span className="text-slate-400">Reachability Envelope Matrix:</span>
                        {isTargetSolvable ? (
                          <span className="text-emerald-400 font-black animate-pulse">✓ SOLVABLE NOMINAL ZONE</span>
                        ) : (
                          <span className="text-rose-500 font-black animate-bounce">❌ SINGULARITY LIMIT BREACHED</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
