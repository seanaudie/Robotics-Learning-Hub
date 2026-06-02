import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SevenSegInteractiveModal } from "./SevenSegInteractiveModal";
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
  Layers,
  Thermometer
} from "lucide-react";

const highlightCppCodeText = (code: string) => {
  if (!code) return null;
  const tokenRegex = /(\/\/.*|"[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_][a-zA-Z0-9_\.]*\b)/g;
  const parts = code.split(tokenRegex);
  return parts.map((part, index) => {
    if (!part) return null;
    
    // Comments
    if (part.startsWith("//")) {
      return <span key={index} className="text-emerald-500 opacity-80 italic select-none">{part}</span>;
    }
    // Strings
    if (part.startsWith('"') || part.startsWith("'")) {
      return <span key={index} className="text-rose-400 font-medium">{part}</span>;
    }
    // Numbers
    if (/^\d+(?:\.\d+)?$/.test(part)) {
      return <span key={index} className="text-amber-500">{part}</span>;
    }
    
    // Types / keywords
    const keywords = ["const", "int", "float", "bool", "char", "void", "double", "unsigned", "long"];
    if (keywords.includes(part)) {
      return <span key={index} className="text-[#f43f5e] font-bold">{part}</span>;
    }
    
    // Control structures
    const controls = ["if", "else", "for", "while", "return"];
    if (controls.includes(part)) {
      return <span key={index} className="text-[#a855f7] font-extrabold">{part}</span>;
    }
    
    // Core constants
    const constants = ["HIGH", "LOW", "INPUT", "OUTPUT", "true", "false"];
    if (constants.includes(part)) {
      return <span key={index} className="text-[#38bdf8] font-extrabold">{part}</span>;
    }
    
    // Known API calls / special registers
    const functions = [
      "setup", "loop", "pinMode", "digitalWrite", "digitalRead", "analogRead", "analogWrite", 
      "delay", "delayMicroseconds", "pulseIn", "Serial", "begin", "println", "pow", 
      "WiFi", "Wire", "lidarServo", "attach", "write", "readLidarDistance", "mapObstacle", 
      "isHeadingEnvelopeClear", "calculateSteeringOffset", "findWidestSectorGap", "steerLeft", 
      "driveForward", "haltAndRecalculate", "sysLog", "stopSearch", "controlActuators", 
      "readSensorValues", "sysLog.println", "WiFi.begin", "Wire.begin", "lidarServo.attach", 
      "lidarServo.write", "Serial.begin", "Serial.println"
    ];
    if (functions.includes(part) || (part.includes(".") && functions.some(f => part.endsWith(f) || part.startsWith(f)))) {
      return <span key={index} className="text-sky-450 font-semibold">{part}</span>;
    }
    
    return <span key={index}>{part}</span>;
  });
};

const UART_CHAR_BITS: Record<string, number[]> = {
  "A": [0, 1, 0, 0, 0, 0, 0, 1],
  "B": [0, 1, 0, 0, 0, 0, 1, 0],
  "C": [0, 1, 0, 0, 0, 0, 1, 1],
  "X": [0, 1, 0, 1, 1, 0, 0, 0],
};

const segmentLogicTerms: Record<
  "a" | "b" | "c" | "d" | "e" | "f" | "g",
  { label: string; wires: string[] }[]
> = {
  a: [
    { label: "I3", wires: ["I3"] },
    { label: "I1", wires: ["I1"] },
    { label: "I2 ∧ I0", wires: ["I2", "I0"] },
    { label: "I2' ∧ I0'", wires: ["!I2", "!I0"] }
  ],
  b: [
    { label: "I2'", wires: ["!I2"] },
    { label: "I1' ∧ I0'", wires: ["!I1", "!I0"] },
    { label: "I1 ∧ I0", wires: ["I1", "I0"] }
  ],
  c: [
    { label: "I2", wires: ["I2"] },
    { label: "I1'", wires: ["!I1"] },
    { label: "I0", wires: ["I0"] }
  ],
  d: [
    { label: "I3", wires: ["I3"] },
    { label: "I2' ∧ I0'", wires: ["!I2", "!I0"] },
    { label: "I1 ∧ I0'", wires: ["I1", "!I0"] },
    { label: "I2' ∧ I1", wires: ["!I2", "I1"] },
    { label: "I2 ∧ I1' ∧ I0", wires: ["I2", "!I1", "I0"] }
  ],
  e: [
    { label: "I2' ∧ I0'", wires: ["!I2", "!I0"] },
    { label: "I1 ∧ I0'", wires: ["I1", "!I0"] }
  ],
  f: [
    { label: "I3", wires: ["I3"] },
    { label: "I1' ∧ I0'", wires: ["!I1", "!I0"] },
    { label: "I2 ∧ I1'", wires: ["I2", "!I1"] },
    { label: "I2 ∧ I0'", wires: ["I2", "!I0"] }
  ],
  g: [
    { label: "I3", wires: ["I3"] },
    { label: "I2 ∧ I1'", wires: ["I2", "!I1"] },
    { label: "I2' ∧ I1", wires: ["!I2", "I1"] },
    { label: "I1 ∧ I0'", wires: ["I1", "!I0"] }
  ]
};

const isWireActive = (wire: string, bits: boolean[]) => {
  if (wire === "I3") return bits[0];
  if (wire === "!I3") return !bits[0];
  if (wire === "I2") return bits[1];
  if (wire === "!I2") return !bits[1];
  if (wire === "I1") return bits[2];
  if (wire === "!I1") return !bits[2];
  if (wire === "I0") return bits[3];
  if (wire === "!I0") return !bits[3];
  return false;
};

const SevenSegmentDigit = ({ value, glowingColor = "fill-cyan-400 stroke-cyan-400" }: { value: number | string, glowingColor?: string, key?: any }) => {
  const segmentsMap: Record<string, boolean[]> = {
    "0": [true, true, true, true, true, true, false],
    "1": [false, true, true, false, false, false, false],
    "2": [true, true, false, true, true, false, true],
    "3": [true, true, true, true, false, false, true],
    "4": [false, true, true, false, false, true, true],
    "5": [true, false, true, true, false, true, true],
    "6": [true, false, true, true, true, true, true],
    "7": [true, true, true, false, false, false, false],
    "8": [true, true, true, true, true, true, true],
    "9": [true, true, true, true, false, true, true],
    "a": [true, true, true, false, true, true, true],
    "b": [false, false, true, true, true, true, true],
    "c": [true, false, false, true, true, true, false],
    "d": [false, true, true, true, true, false, true],
    "e": [true, false, false, true, true, true, true],
    "f": [true, false, false, false, true, true, true],
  };

  const char = String(value).toLowerCase();
  const s = segmentsMap[char] || [false, false, false, false, false, false, false];

  return (
    <svg width="22" height="34" viewBox="0 0 34 54" className="inline-block relative">
      {/* segment a */}
      <path d="M 6,4 L 28,4 L 25,7 L 9,7 Z" className={s[0] ? glowingColor : "fill-slate-900"} />
      {/* segment f */}
      <path d="M 4,6 L 7,9 L 7,24 L 4,26 Z" className={s[5] ? glowingColor : "fill-slate-900"} />
      {/* segment b */}
      <path d="M 30,6 L 30,26 L 27,24 L 27,9 Z" className={s[1] ? glowingColor : "fill-slate-900"} />
      {/* segment g */}
      <path d="M 6,27 L 9,25 L 25,25 L 28,27 L 25,29 L 9,29 Z" className={s[6] ? glowingColor : "fill-slate-900"} />
      {/* segment e */}
      <path d="M 4,28 L 7,30 L 7,45 L 4,48 Z" className={s[4] ? glowingColor : "fill-slate-900"} />
      {/* segment c */}
      <path d="M 30,28 L 30,48 L 27,45 L 27,30 Z" className={s[2] ? glowingColor : "fill-slate-900"} />
      {/* segment d */}
      <path d="M 6,50 L 9,47 L 25,47 L 28,50 Z" className={s[3] ? glowingColor : "fill-slate-900"} />
    </svg>
  );
};

const renderGateSymbol = (
  gate: "AND" | "OR" | "XOR" | "NAND" | "NOT",
  inputA?: boolean,
  inputB?: boolean,
  output?: boolean
) => {
  // Thick, vibrant colors for logic gate lines depending on high/low states
  const colorA = inputA ? "#10b981" : "#475569"; // Emerald for active 1, slate for 0
  const colorB = inputB ? "#10b981" : "#475569";
  const colorOut = output ? "#10b981" : "#475569";
  const strokeW_Active = "2.8";
  const strokeW_Inactive = "2.0";
  
  // Custom active fill color for the gate capsule itself
  const gateBorderColor = output ? "stroke-emerald-400 fill-emerald-500/15 animate-pulse" : "stroke-sky-400 fill-sky-500/5";

  return (
    <svg viewBox="0 0 60 30" className="w-28 h-14 md:w-36 md:h-18 mt-1.5 select-none transition-all duration-300">
      {/* Input pins lines */}
      {gate !== "NOT" ? (
        <>
          <path d="M 5,8 L 15,8" stroke={colorA} strokeWidth={inputA ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />
          <path d="M 5,22 L 15,22" stroke={colorB} strokeWidth={inputB ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />
        </>
      ) : (
        <path d="M 5,15 L 15,15" stroke={colorA} strokeWidth={inputA ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />
      )}
      
      {/* Shape based on Gate */}
      {gate === "AND" && (
        <path d="M 15,4 L 28,4 A 11,11 0 0,1 28,26 L 15,26 Z" className={gateBorderColor} strokeWidth="2.2" strokeLinejoin="round" />
      )}
      {gate === "NAND" && (
        <>
          <path d="M 15,4 L 28,4 A 11,11 0 0,1 28,26 L 15,26 Z" className={gateBorderColor} strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="41.5" cy="15" r="2.5" className={output ? "stroke-emerald-400 fill-emerald-500/15" : "stroke-sky-400 fill-slate-950"} strokeWidth="2.2" />
        </>
      )}
      {gate === "OR" && (
        <path d="M 12,4 Q 20,4 32,15 Q 20,26 12,26 Q 17,15 12,4 Z" className={gateBorderColor} strokeWidth="2.2" strokeLinejoin="round" />
      )}
      {gate === "XOR" && (
        <>
          <path d="M 8,4 Q 13,15 8,26" stroke={output ? "#34d399" : "#38bdf8"} strokeWidth="2" fill="none" />
          <path d="M 12,4 Q 20,4 32,15 Q 20,26 12,26 Q 17,15 12,4 Z" className={gateBorderColor} strokeWidth="2.2" strokeLinejoin="round" />
        </>
      )}
      {gate === "NOT" && (
        <>
          <polygon points="15,4 33,15 15,26" className={gateBorderColor} strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="36.5" cy="15" r="2.5" className={output ? "stroke-emerald-400 fill-emerald-500/15" : "stroke-sky-400 fill-slate-950"} strokeWidth="2.2" />
        </>
      )}
      
      {/* Output Pin lines */}
      {gate === "AND" && <path d="M 39,15 L 55,15" stroke={colorOut} strokeWidth={output ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />}
      {gate === "NAND" && <path d="M 44,15 L 55,15" stroke={colorOut} strokeWidth={output ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />}
      {gate === "OR" && <path d="M 32,15 L 55,15" stroke={colorOut} strokeWidth={output ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />}
      {gate === "XOR" && <path d="M 32,15 L 55,15" stroke={colorOut} strokeWidth={output ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />}
      {gate === "NOT" && <path d="M 39,15 L 55,15" stroke={colorOut} strokeWidth={output ? strokeW_Active : strokeW_Inactive} strokeLinecap="round" />}
    </svg>
  );
};

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
    id: "led",
    name: "High-Intensity LED Diode",
    symbol: "A-LED",
    description: "Emits bright visible indicator light when powered.",
    details: "Needs current-limiting resistor to protect the silicon substrate. Lights up instantly when driven HIGH by a logic pin."
  },
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
    direction?: "down" | "right" | "left" | "up" | "yes" | "no" | "loop-left" | "loop-right" | "terminate";
  }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "obstacle_avoidance",
    title: "Obstacle Avoidance",
    subtitle: "Beginner Project",
    sensor: "ultrasonic",
    controller: "arduino",
    actuator: "motor_driver",
    explanation: "This entry-level robot measures spatial distance using ultrasonic pulses. The system calculates safe target distances, checks for blockages, and drives its actuators to steer left away from barriers before returning to standby.",
    flowSteps: [
      { shape: "circle",        label: "START",         subtext: "Boot active loop",          x: 110, y: 15,  width: 120, height: 35 },
      { shape: "parallelogram", label: "READ SONAR",    subtext: "Measure Echo pulse",        x: 110, y: 65,  width: 120, height: 35 },
      { shape: "rectangle",     label: "CALC CM",       subtext: "Scale distance value",      x: 110, y: 115, width: 120, height: 35 },
      { shape: "diamond",       label: "DIST < 15CM?",  subtext: "Is path blocked?",          x: 95,  y: 165, width: 150, height: 50 },
      { shape: "parallelogram", label: "STEER LEFT",    subtext: "Engage left motor",         x: 15,  y: 245, width: 120, height: 35 },
      { shape: "parallelogram", label: "DRIVE FORWARD", subtext: "Set constant speed",        x: 205, y: 245, width: 120, height: 35 },
      { shape: "parallelogram", label: "WRITE ALERT",   subtext: "Blink hazard LED",          x: 15,  y: 300, width: 120, height: 35 },
      { shape: "circle",        label: "END",           subtext: "Restart sequence",          x: 110, y: 355, width: 120, height: 30 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, label: "YES",     direction: "left" },
      { from: 3, to: 5, label: "NO",      direction: "right" },
      { from: 4, to: 6 },
      { from: 6, to: 1, label: "RECYCLE", direction: "loop-left" },
      { from: 5, to: 1, label: "RECYCLE", direction: "loop-right" },
      { from: 3, to: 7, label: "OFF",     direction: "terminate" }
    ]
  },
  {
    id: "monitoring_system",
    title: "A Monitoring System",
    subtitle: "Intermediate Project",
    sensor: "photo_ldr",
    controller: "esp32",
    actuator: "led",
    explanation: "A telemetry station mapping illumination rates. It samples LDR sensor resistance, calculates light intensity in Lux, decides if twilight bounds are breached, and powers up high-contrast LEDs if dark.",
    flowSteps: [
      { shape: "circle",        label: "SYSTEM START",  subtext: "Start telemetry loop",      x: 110, y: 15,  width: 120, height: 35 },
      { shape: "parallelogram", label: "GET LUX LEVEL", subtext: "Read photoresistor",        x: 110, y: 65,  width: 120, height: 35 },
      { shape: "rectangle",     label: "CONVERT LUX",   subtext: "Calculate illumination",    x: 110, y: 115, width: 120, height: 35 },
      { shape: "diamond",       label: "LIGHT < 400?",  subtext: "Verify darkness bounds",    x: 95,  y: 165, width: 150, height: 50 },
      { shape: "parallelogram", label: "LOG STATE",     subtext: "Log darkness flag",         x: 15,  y: 245, width: 120, height: 35 },
      { shape: "parallelogram", label: "ACTIVATE LAMP", subtext: "Write Pin 13 HIGH",         x: 15,  y: 300, width: 120, height: 35 },
      { shape: "parallelogram", label: "QUIET STATUS",  subtext: "No light requested",        x: 205, y: 245, width: 120, height: 35 },
      { shape: "circle",        label: "END CYCLE",     subtext: "Cool down system",          x: 110, y: 355, width: 120, height: 30 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, label: "YES",     direction: "left" },
      { from: 3, to: 6, label: "NO",      direction: "right" },
      { from: 4, to: 5 },
      { from: 5, to: 1, label: "RECYCLE", direction: "loop-left" },
      { from: 6, to: 1, label: "RECYCLE", direction: "loop-right" },
      { from: 3, to: 7, label: "OFF",     direction: "terminate" }
    ]
  },
  {
    id: "autonomous_robot",
    title: "Autonomous Robot",
    subtitle: "Advanced Project",
    sensor: "ultrasonic",
    controller: "esp32",
    actuator: "motor_driver",
    explanation: "A multi-sensor navigation drone plotting autonomous grid routes. It scans surrounding sectors with laser grids, computes optimal heading angles, checks if path remains clear, and directs path steering vectors.",
    flowSteps: [
      { shape: "circle",        label: "BOOT STATE",    subtext: "Start grid sequence",       x: 110, y: 15,  width: 120, height: 35 },
      { shape: "parallelogram", label: "LiDAR SCAN",    subtext: "Map coordinate indices",    x: 110, y: 65,  width: 120, height: 35 },
      { shape: "rectangle",     label: "CALC ANGLE",    subtext: "Interpolate obstacle gap",  x: 110, y: 115, width: 120, height: 35 },
      { shape: "diamond",       label: "PATH IS SAFE?", subtext: "Check sector clear",        x: 95,  y: 165, width: 150, height: 50 },
      { shape: "parallelogram", label: "COAST AHEAD",   subtext: "Set full wheel speed",      x: 15,  y: 245, width: 120, height: 35 },
      { shape: "parallelogram", label: "BRAKE WHEELS",  subtext: "Trigger emergency braking", x: 205, y: 245, width: 120, height: 35 },
      { shape: "diamond",       label: "SAFE STOPPED?", subtext: "Is speed fully zero?",      x: 195, y: 295, width: 140, height: 45 },
      { shape: "circle",        label: "LOOP SHUTDOWN", subtext: "Flush telemetry caches",    x: 110, y: 355, width: 120, height: 30 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, label: "YES",     direction: "left" },
      { from: 3, to: 5, label: "NO",      direction: "right" },
      { from: 5, to: 6 },
      { from: 4, to: 1, label: "RECYCLE", direction: "loop-left" },
      { from: 6, to: 1, label: "NO",      direction: "loop-right" },
      { from: 6, to: 7, label: "YES" },
      { from: 3, to: 7, label: "OFF",     direction: "terminate" }
    ]
  },
  {
    id: "robotic_arm",
    title: "The Robotic Arm",
    subtitle: "Expert Project",
    sensor: "sound_mic",
    controller: "arduino",
    actuator: "servo",
    explanation: "A pick-and-place manipulator carrying heavy loads. It decodes feedback and joint potentials, calculates torque stress ratios, halts actions if mechanical limit bounds are exceeded, or moves joint servos.",
    flowSteps: [
      { shape: "circle",        label: "START GEARS",   subtext: "Warm joint coils",          x: 110, y: 15,  width: 120, height: 35 },
      { shape: "parallelogram", label: "POT READ",      subtext: "Capture joint resistance",  x: 110, y: 65,  width: 120, height: 35 },
      { shape: "rectangle",     label: "MATH JOINT Nm", subtext: "Calculate feedback torque",  x: 110, y: 115, width: 120, height: 35 },
      { shape: "diamond",       label: "STRESS HIGH?",  subtext: "Is load limit breached?",   x: 95,  y: 165, width: 150, height: 50 },
      { shape: "parallelogram", label: "TRIP RELAY",    subtext: "De-energize safe wire",     x: 15,  y: 245, width: 120, height: 35 },
      { shape: "parallelogram", label: "SWEEP SERVO",   subtext: "Write target angle pulse",  x: 205, y: 245, width: 120, height: 35 },
      { shape: "parallelogram", label: "HOLD STANCE",   subtext: "Engage magnetic brake",     x: 205, y: 300, width: 120, height: 35 },
      { shape: "circle",        label: "ARM OK END",    subtext: "Close calibration loop",    x: 110, y: 355, width: 120, height: 30 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, label: "YES",     direction: "left" },
      { from: 3, to: 5, label: "NO",      direction: "right" },
      { from: 5, to: 6 },
      { from: 4, to: 7,                   direction: "right" },
      { from: 6, to: 1, label: "RECYCLE", direction: "loop-right" },
      { from: 3, to: 7, label: "OFF",     direction: "terminate" }
    ]
  }
];

const FLOW_STEP_DETAILS: Record<string, { title: string; type: string; desc: string; code: string; signal: string }> = {
  // Obstacle Avoidance / Autonomous Robot steps
  "START": {
    title: "System Boot Sequence",
    type: "Initialization Process",
    desc: "Prepares registers, sets pin IO directions (Trig as Output, Echo as Input), and boots serial UART channels to establish standard data telemetry.",
    code: "void setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  Serial.begin(9605);\n}",
    signal: "VCC: 5.0V stable logic rail"
  },
  "BOOT STATE": {
    title: "Drone Multi-Grid Boot",
    type: "Initialization Process",
    desc: "Starts the primary wireless transceivers, initializes the internal SPI/I2C communication buses, and runs a diagnostic sweep on the LiDAR servo.",
    code: "void setup() {\n  WiFi.begin(ssid, password);\n  Wire.begin();\n  lidarServo.attach(servoPin);\n}",
    signal: "VCC: 3.3V stable SoC logic"
  },
  "READ SONAR": {
    title: "Ultrasonic Wave Telemetry",
    type: "Input Acquisition",
    desc: "Fires a 10-microsecond trigger pulse on the transmitter pin. This releases a high-frequency 40 kHz audio wave. The internal MCU timer is calibrated until the reflecting wave pulls the Echo feedback pin HIGH.",
    code: "digitalWrite(trigPin, LOW);\ndelayMicroseconds(2);\ndigitalWrite(trigPin, HIGH);\ndelayMicroseconds(10);\ndigitalWrite(trigPin, LOW);\nduration = pulseIn(echoPin, HIGH);",
    signal: "Echo Pin Input Pulse: 0V - 5V TTL"
  },
  "LiDAR SCAN": {
    title: "LiDAR Point Cloud Acquisition",
    type: "Input Acquisition",
    desc: "Rotates the micro-servo to map the surroundings. The sensor fires infrared light beams and counts the exact sub-nanosecond delay (Time-of-Flight) before the light bounces off obstacles and returns.",
    code: "for (int angle = 0; angle <= 180; angle += 10) {\n  lidarServo.write(angle);\n  delay(15);\n  int dist = readLidarDistance();\n  mapObstacle(angle, dist);\n}",
    signal: "I2C Serial: I2C Clock (SCL) & Data (SDA)"
  },
  "CALC CM": {
    title: "Distance Scaling Interpolation",
    type: "Process Computation",
    desc: "Uses the speed of sound at sea level (343 m/s) to scale the raw Time-of-Flight microsecond value. Dividing the microseconds by 58.2 converts the duration directly to standard centimeters.",
    code: "distanceCm = duration * 0.034 / 2;\n// Or dividing microseconds by 58.2:\ndistanceCm = duration / 58.2;",
    signal: "Digital Logic: CPU general registers"
  },
  "CALC ANGLE": {
    title: "Gap Vector Computation",
    type: "Process Computation",
    desc: "Anatomizes the current surrounding points. The MCU filters out angles blocked by barriers and solves the optimal path vector toward the widest obstacle-free opening.",
    code: "int bestAngle = findWidestSectorGap();\ntargetHeading = calculateSteeringOffset(bestAngle);",
    signal: "Digital Logic: ALU computation cycle"
  },
  "DIST < 15CM?": {
    title: "Proximity Boundary Comparison",
    type: "Decision Evaluation",
    desc: "Pulls the recently solved distance offset from the general register and evaluates it against the safety boundary threshold constant (15cm) to decide whether to yield or proceed.",
    code: "if (distanceCm < 15) {\n  // True branch: Obstacle detected\n} else {\n  // False branch: Way is clear\n}",
    signal: "Register Flags: Zero & Carry status"
  },
  "PATH IS SAFE?": {
    title: "Safety Envelope Evaluation",
    type: "Decision Evaluation",
    desc: "Scans the calculated coordinate matrices. If any point falls inside the 2D bounding box safety margin of the platform, the boolean status turns falsy, marking the sector as blocked.",
    code: "bool clear = isHeadingEnvelopeClear(targetHeading);\nif (clear) {\n  // Proceed along path vector\n} else {\n  // Initiate safety avoidance maneuver\n}",
    signal: "Register Flags: Condition branching instruction"
  },
  "STEER LEFT": {
    title: "Emergency Steering Outwear",
    type: "Output Actuation",
    desc: "Fires different Pulse Width Modulation (PWM) signal currents to the motor driver. Drives the right-side wheel wheels forward while flipping the left wheels back to quickly rotate the entire frame.",
    code: "motorLeft.run(BACKWARD, speedPWM);\nmotorRight.run(FORWARD, speedPWM);\ndelay(450); // 450ms turn sweep",
    signal: "PWM Channel H-Bridge: 5V - 12V current surge"
  },
  "DRIVE FORWARD": {
    title: "Constant Axis Cruise Drive",
    type: "Output Actuation",
    desc: "Maintains matching PWM duty cycles on both left and right wheels to propel the chassis forward along a straight path.",
    code: "motorLeft.run(FORWARD, cruiseSpeed);\nmotorRight.run(FORWARD, cruiseSpeed);",
    signal: "PWM Channel Output: 65% duty cycle steady bus"
  },
  "COAST AHEAD": {
    title: "Full Speed Path Cruise",
    type: "Output Actuation",
    desc: "Coordinates the mechatronic motors. It commands full forward throttle vectors on both tracks to keep moving steadily through clear open zones.",
    code: "driveLeftMotor(fullCruiseSpeed);\ndriveRightMotor(fullCruiseSpeed);",
    signal: "PWM Output: 90% duty cycle steady load"
  },
  "BRAKE WHEELS": {
    title: "Anti-Collision Regenerative Brake",
    type: "Output Actuation",
    desc: "Pulls the motor driver inputs directly to standard GROUND (0V) simultaneously. This triggers back-electromotive braking forces that abruptly lock the wheels and halt the drone.",
    code: "digitalWrite(motorLeftDirA, LOW);\ndigitalWrite(motorLeftDirB, LOW);\n// Or ground both driver lines instantly\nbrakeMotorDriver();",
    signal: "Logic Level Output: 0.0V absolute clamp"
  },
  "SAFE STOPPED?": {
    title: "Inertial Speed Verification",
    type: "Decision Evaluation",
    desc: "Polls the optical wheel speedometer encoders or secondary IMU gyros to confirm that the robot is physically stationary before checking the next direction path.",
    code: "if (currentSpeedRpm == 0) {\n  // Safe state verified\n} else {\n  // Still sliding - await complete stop\n}",
    signal: "Encoder Pulse: 0Hz frequency readout"
  },
  "WRITE ALERT": {
    title: "Visual Strobe Alarm",
    type: "Output Actuation",
    desc: "Drives voltage high directly to the safety LED pin, outputting a highly visible visual warning strobe to alert human operators of local roadblocks.",
    code: "digitalWrite(ledPin, HIGH);\n// Hazard flash state active",
    signal: "Digital Logic Out: 5V high margin current"
  },
  "END": {
    title: "Control Loop Recycle",
    type: "Sequence Termination",
    desc: "Flushes the registers, resets time watchdog counters, and loops back to block 01 to restart scanning variables.",
    code: "} // Loop ends and immediately restarts\n// standard cycle frequency: 45Hz",
    signal: "System Watchdog: Status OK tick"
  },
  "LOOP SHUTDOWN": {
    title: "Watchdog Loop Recycle",
    type: "Sequence Termination",
    desc: "Frees allocated memory buffers, logs final trajectory records, and loops back to boot state to coordinate next routing grids.",
    code: "sysLog.println(\"Loop cycle closed OK\");\n// Yield processing to cool board core",
    signal: "Serial Log Out: 'Loop cycle closed OK'"
  },
  // Environmental Monitor steps
  "SYSTEM START": {
    title: "Monitor Boot Setup",
    type: "Initialization Process",
    desc: "Prepares data registries, starts serial logging, and initializes the DHT11 temp single-bus interface connection line.",
    code: "void setup() {\n  Serial.begin(115200);\n  dht.begin();\n  pinMode(relayPin, OUTPUT);\n}",
    signal: "VCC: 3.3V Logic level stabilized"
  },
  "GET LUX LEVEL": {
    title: "ADC Photocell Sample",
    type: "Input Acquisition",
    desc: "Triggers the built-in Analog-to-Digital Converter (ADC). It measures the voltage drop across the LDR photoresistor, mapping it into a raw 10-bit numerical integer.",
    code: "int rawADC = analogRead(ldrPin);\n// converts 0V-5V to 0 - 1023",
    signal: "Analog Input Rail: 0V - 3.12V variable dropped scale"
  },
  "CONVERT LUX": {
    title: "Lux Calibration Scaling",
    type: "Process Computation",
    desc: "Transforms the raw 10-bit integer into standardized Lux. It calculates resistance according to Ohm's Law and applies logarithmic sensitivity coefficients to obtain the human equivalent light model.",
    code: "float voltage = rawADC * (5.0 / 1023.0);\nfloat ldrResistance = (5.0 - voltage) * 10000.0 / voltage;\nfloat lux = 500.0 / pow(ldrResistance/1000.0, 1.4);",
    signal: "Digital Logic: ALU float processing"
  },
  "LIGHT < 400?": {
    title: "Twilight Threshold Evaluation",
    type: "Decision Evaluation",
    desc: "Compares the solved Lux value against the constant 400 Lux boundary (the threshold marking twilight darkness) to determine if night mode is active.",
    code: "if (lux < 400.0) {\n  // Twilight boundary breached\n} else {\n  // Bright ambient daylight\n}",
    signal: "Register Flags: Status comparator match"
  },
  "LOG STATE": {
    title: "DARKNESS Flag Committal",
    type: "Input Acquisition",
    desc: "Updates the system state variables inside RAM and logs the darkness flag over the serial monitor to keep standard debugging lines clean.",
    code: "isDark = true;\nSerial.print(\"Darkness detected. Lux value: \");\nSerial.println(lux);",
    signal: "UART Transmit (TX): Serial TTL output"
  },
  "ACTIVATE LAMP": {
    title: "Power Relay Actuation",
    type: "Output Actuation",
    desc: "Fires a 5V digital signal to the base of the optotristor or standard mechanical relay, switching on external lighting rigs.",
    code: "digitalWrite(relayPin, HIGH);\n// High-flux Grow bulb on",
    signal: "Relay Pin Logic out: 5.0V switching load"
  },
  "QUIET STATUS": {
    title: "Daylight Inactive State",
    type: "Process Computation",
    desc: "Clears system night flags and writes the control relay pin LOW, shutting off the grow lighting system to conserve electric utility power.",
    code: "isDark = false;\ndigitalWrite(relayPin, LOW);\n// Night Grow light off",
    signal: "Relay Pin Logic out: 0.0V quiet load"
  },
  "END CYCLE": {
    title: "Watchdog Cooler Sequence",
    type: "Sequence Termination",
    desc: "Sleeps the controller for 1 second to limit energy and thermal load, resetting the watchdog timer for the next sensor polling cycle.",
    code: "delay(1000); // 1-second interval pause\n// watchDogTimer.reset();",
    signal: "Thermal State: Stable ambient register"
  },
  // Robotic Arm steps
  "START GEARS": {
    title: "Servo Coils Stabilization",
    type: "Initialization Process",
    desc: "Attaches the PWM joint servos, drives them to their home calibration degrees, and configures the input pin filters for the joint strain sensors.",
    code: "void setup() {\n  servoShoulder.attach(9);\n  servoElbow.attach(10);\n  servoShoulder.write(90); // Home angle\n}",
    signal: "VCC: 6.0V high torque power supply stabilized"
  },
  "POT READ": {
    title: "Feedback Variable Sampling",
    type: "Input Acquisition",
    desc: "Reads the internal feedback potentiometer pin on the servo motor or the voltage on an external load-cell strain gauge, measuring physical joint resistance.",
    code: "int loadRaw = analogRead(strainGaugePin);\n// maps resistance offsets directly",
    signal: "Analog Input Rail: 0V - 1.85V variable joint feedback"
  },
  "MATH JOINT Nm": {
    title: "Torque Stress Derivation",
    type: "Process Computation",
    desc: "Converts the raw strain voltage into standard Newton-meters (N·m) of physical torque. This matches arm geometry coordinates to compute mechanical stress.",
    code: "float forceNewtons = loadRaw * strainConversionFactor;\ntorqueNm = forceNewtons * linkArmDistance;",
    signal: "Digital Logic: ALU Newton-meters derivation"
  },
  "STRESS HIGH?": {
    title: "Load Limit Comparison",
    type: "Decision Evaluation",
    desc: "Compares the solved joint torque against the structural load threshold (3.5 N·m) to verify whether the structural gears are in danger of stalling or stripping.",
    code: "if (torqueNm > 3.5) {\n  // Torque limit exceeded!\n} else {\n  // Torque level safe\n}",
    signal: "Register Flags: Critical condition compare"
  },
  "TRIP RELAY": {
    title: "E-Stop Safety Trip",
    type: "Output Actuation",
    desc: "Immediately cuts the main power servo rails to disable physical motor torque, safely locking joint armatures in place to prevent structural failures.",
    code: "digitalWrite(emergencyPowerRelayPin, LOW);\nSerial.println(\"EMERGENCY TRIP: EXCEEDED JOINT TORQUE!\");",
    signal: "Power Supply Gated Interrupter: 0V E-Stop trip"
  },
  "SWEEP SERVO": {
    title: "PWM Angle Sweeping",
    type: "Output Actuation",
    desc: "Calculates the dynamic trajectory path and streams regular 50 Hz PWM duty cycles corresponding to the next target location angle (0° to 180°).",
    code: "int nextAngle = calculateInterpolatedPathStep();\nservoShoulder.write(nextAngle);\n// Streams 1.0ms - 2.0ms active pulse width",
    signal: "PWM Channel Output: 1.5ms pulse width standard 50Hz"
  },
  "HOLD STANCE": {
    title: "Steady Angle Dwell",
    type: "Output Actuation",
    desc: "Maintains current PWM pulses to hold the joint gears stationary. This lock counterbalances loads while waiting for conveyor synchronization.",
    code: "servoShoulder.write(currentAngle);\n// continuous pulse stream holding position",
    signal: "PWM Output: Steady 1.7ms active dwell pulse"
  },
  "ARM OK END": {
    title: "Calibration Loop Reset",
    type: "Sequence Termination",
    desc: "Clears mathematical registers, logs operational status flags over telemetry channels, and loops back to continue monitoring safe operation.",
    code: "} // Sequence loop end\n// System watchdog: OK\n// Operational temp: 34°C",
    signal: "Heartbeat Serial Pulse: STATUS_HEALTHY"
  }
};

export default function RoboticsGuide({ viewType }: { viewType?: "programming" | "electronics" }) {
  const [activeGuideTab, setActiveGuideTab] = useState<"coding" | "flowchart" | "electronics">(
    viewType === "electronics" ? "electronics" : "flowchart"
  );
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [showGlossaryModal, setShowGlossaryModal] = useState<boolean>(false);
  const [showControlLoopModal, setShowControlLoopModal] = useState<boolean>(false);

  // Keep track of the last time a user clicked/interacted with a flowchart glossary shape or node
  const lastInteractionRef = React.useRef<number>(0);

  // Mobile viewport detection state
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);
  
  // Alternating split branch state for flowchart loops
  const [alternateBranch, setAlternateBranch] = useState<boolean>(false);

  // Coding interactive sandbox state
  const [activeCodingSubTab, setActiveCodingSubTab] = useState<"variables" | "conditions" | "loops" | "handbook">("variables");
  const [userDistance, setUserDistance] = useState<number>(45); // 0-100cm slider
  const [isMotionTriggered, setIsMotionTriggered] = useState<boolean>(false);
  const [lightRawADC, setLightRawADC] = useState<number>(650); // 0-1023 slider
  const [loopFrequencySelected, setLoopFrequencySelected] = useState<number>(1); // 0=Slow, 1=Med, 2=Fast
  const [loopPlayCycle, setLoopPlayCycle] = useState<number>(0);

  // Easy examples toggling states
  const [activeVarExample, setActiveVarExample] = useState<"proximity" | "temp">("proximity");
  const [activeCondExample, setActiveCondExample] = useState<"lamp" | "laser">("lamp");
  const [activeLoopExample, setActiveLoopExample] = useState<"orbit" | "servo">("orbit");

  // Temperature example additional variables
  const [tempSensorValue, setTempSensorValue] = useState<number>(24.0); // °C simulation
  // Laser alarm variables
  const [laserBeamCut, setLaserBeamCut] = useState<boolean>(false);
  // Servo angle variable
  const [servoAngleDegrees, setServoAngleDegrees] = useState<number>(90);

  // Electronics interactive state
  const [activeElectSubTab, setActiveElectSubTab] = useState<"ohms" | "circuits" | "signals" | "binary" | "protocols">("ohms");
  const [isOhmsModalOpen, setIsOhmsModalOpen] = useState<boolean>(false);
  const [isAdcSandboxModalOpen, setIsAdcSandboxModalOpen] = useState<boolean>(false);
  const [ohmsHighlightItem, setOhmsHighlightItem] = useState<"voltage" | "resistance" | "current">("voltage");
  const [ohmsVoltage, setOhmsVoltage] = useState<number>(5.0); // 0-12V
  const [ohmsResistance, setOhmsResistance] = useState<number>(220); // 100-1000 ohms
  const [isSeriesCut, setIsSeriesCut] = useState<boolean>(false);
  const [isParallel1Cut, setIsParallel1Cut] = useState<boolean>(false);
  const [isParallel2Cut, setIsParallel2Cut] = useState<boolean>(false);
  const [isCombinedCircuitModalOpen, setIsCombinedCircuitModalOpen] = useState<boolean>(false);
  const [isCombinedMainCut, setIsCombinedMainCut] = useState<boolean>(false);
  const [isCombinedBranchACut, setIsCombinedBranchACut] = useState<boolean>(false);
  const [isCombinedBranchBCut, setIsCombinedBranchBCut] = useState<boolean>(false);

  // Signals subtab state variables
  const [signalType, setSignalType] = useState<"sine" | "square">("sine");
  const [signalFrequency, setSignalFrequency] = useState<number>(2); // 1 to 5 Hz
  const [signalAmplitude, setSignalAmplitude] = useState<number>(4.0); // 1.0 to 5.0 V
  const [signalNoise, setSignalNoise] = useState<boolean>(false);
  const [signalMode, setSignalMode] = useState<"oscilloscope" | "adc_dac">("oscilloscope");
  const [adcResolutionBits, setAdcResolutionBits] = useState<number>(3); // 2, 3, 4, 8 bits
  const [samplingFrequency, setSamplingFrequency] = useState<number>(4); // Hz
  const [manualSampleValue, setManualSampleValue] = useState<number>(2.5); // 0.0 to 5.0 V
  const [isLiveAdc, setIsLiveAdc] = useState<boolean>(true);

  // Binary counting & logic gate workshop states
  const [logicInputA, setLogicInputA] = useState<boolean>(true);
  const [logicInputB, setLogicInputB] = useState<boolean>(false);
  const [logicGate, setLogicGate] = useState<"AND" | "OR" | "XOR" | "NAND" | "NOT">("AND");
  const [binaryBits, setBinaryBits] = useState<boolean[]>([false, false, false, false]); // [bit3/8, bit2/4, bit1/2, bit0/1]

  // Protocols workshop state variables
  const [protocolType, setProtocolType] = useState<"uart" | "i2c" | "spi">("uart");
  const [isManualStepMode, setIsManualStepMode] = useState<boolean>(false);
  const [uartChar, setUartChar] = useState<string>("A");
  const [isUartTransmitting, setIsUartTransmitting] = useState<boolean>(false);
  const [uartTxStep, setUartTxStep] = useState<number>(-1); // -1=idle, 0=Start, 1-8=bits, 9=Stop
  const [i2cAddress, setI2cAddress] = useState<"0x2A" | "0x3F">("0x2A");
  const [i2cData, setI2cData] = useState<string>("0xFE");
  const [isI2cTransmitting, setIsI2cTransmitting] = useState<boolean>(false);
  const [i2cTxStep, setI2cTxStep] = useState<number>(-1); // -1=idle, 0=START, 1=Addr, 2=ACK1, 3=Data, 4=ACK2, 5=STOP

  // SPI Protocol states
  const [isSpiTransmitting, setIsSpiTransmitting] = useState<boolean>(false);
  const [spiTxStep, setSpiTxStep] = useState<number>(-1); // -1=idle, 0=CS_LOW, 1-8=bits, 9=CS_HIGH
  const [spiData, setSpiData] = useState<string>("0xD4");

  // PID Control Feedback states
  const [pidKp, setPidKp] = useState<number>(3.5);
  const [pidKi, setPidKi] = useState<number>(1.2);
  const [pidKd, setPidKd] = useState<number>(0.6);
  const [isPidClosedLoop, setIsPidClosedLoop] = useState<boolean>(true);
  const [pidSetpoint, setPidSetpoint] = useState<number>(1.0);

  // Seven Segment Interactive Modal States
  const [isSevenSegModalOpen, setIsSevenSegModalOpen] = useState<boolean>(false);
  const [sevenSegModalTab, setSevenSegModalTab] = useState<"logic" | "ic">("logic");
  const [sevenSegSelectedSegment, setSevenSegSelectedSegment] = useState<"a" | "b" | "c" | "d" | "e" | "f" | "g" | null>(null);
  const [sevenSegAutoCount, setSevenSegAutoCount] = useState<boolean>(false);
  const [sevenSegIcType, setSevenSegIcType] = useState<"decoder" | "shift">("decoder");

  // 74HC595 shift register simulation state
  const [shiftRegisterBits, setShiftRegisterBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]); // QA' to QH' latch register
  const [shiftRegisterOutputBits, setShiftRegisterOutputBits] = useState<boolean[]>([false, false, false, false, false, false, false, false]); // Parallel latch outputs QA to QH
  const [shiftRegisterSerPin, setShiftRegisterSerPin] = useState<boolean>(false); // Serial data input pin
  const [shiftRegAnimStep, setShiftRegAnimStep] = useState<number>(-1); // -1 = idle, 0 to 7 = shifting bit, 8 = latching

  // Serial Shift Register Simulation effect
  useEffect(() => {
    if (shiftRegAnimStep === -1) return;
    
    // Calculate the target 8-pin byte representing the current digit's segments!
    const sum = binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0);
    const hexDigit = sum.toString(16).toLowerCase();
    const segMap: Record<string, boolean[]> = {
      "0": [true, true, true, true, true, true, false, false],
      "1": [false, true, true, false, false, false, false, false],
      "2": [true, true, false, true, true, false, true, false],
      "3": [true, true, true, true, false, false, true, false],
      "4": [false, true, true, false, false, true, true, false],
      "5": [true, false, true, true, false, true, true, false],
      "6": [true, false, true, true, true, true, true, false],
      "7": [true, true, true, false, false, false, false, false],
      "8": [true, true, true, true, true, true, true, false],
      "9": [true, true, true, true, false, true, true, false],
      "a": [true, true, true, false, true, true, true, false],
      "b": [false, false, true, true, true, true, true, false],
      "c": [true, false, false, true, true, true, false, false],
      "d": [false, true, true, true, true, false, true, false],
      "e": [true, false, false, true, true, true, true, false],
      "f": [true, false, false, false, true, true, true, false],
    };
    
    const targetBits = segMap[hexDigit] || [false, false, false, false, false, false, false, false];

    const timer = setTimeout(() => {
      if (shiftRegAnimStep >= 0 && shiftRegAnimStep < 8) {
        const nextBit = targetBits[7 - shiftRegAnimStep];
        setShiftRegisterSerPin(nextBit);
        setShiftRegisterBits((prev) => {
          const updated = [...prev];
          updated.pop();
          updated.unshift(nextBit);
          return updated;
        });
        setShiftRegAnimStep(shiftRegAnimStep + 1);
      } else if (shiftRegAnimStep === 8) {
        setShiftRegisterOutputBits([...shiftRegisterBits]);
        setShiftRegAnimStep(-1);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [shiftRegAnimStep, binaryBits, shiftRegisterBits]);

  const pushShiftClock = (serValue: boolean) => {
    setShiftRegisterBits((prev) => {
      const updated = [...prev];
      updated.pop();
      updated.unshift(serValue);
      return updated;
    });
  };

  const pushLatchClock = () => {
    setShiftRegisterOutputBits([...shiftRegisterBits]);
  };

  const startAutoShift = () => {
    setShiftRegisterBits([false, false, false, false, false, false, false, false]);
    setShiftRegAnimStep(0);
  };

  // Flowchart animation state
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);

  // 7-segment display autocompleter count-up
  useEffect(() => {
    if (!sevenSegAutoCount) return;
    const interval = setInterval(() => {
      setBinaryBits((prev) => {
        const val = prev.reduce((acc, b, i) => acc + (b ? Math.pow(2, 3 - i) : 0), 0);
        const nextVal = (val + 1) % 16;
        return [
          (nextVal & 8) !== 0,
          (nextVal & 4) !== 0,
          (nextVal & 2) !== 0,
          (nextVal & 1) !== 0,
        ];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [sevenSegAutoCount, setBinaryBits]);

  // Rapid 30fps continuous animation tick state for mechatronic visualizers
  const [simTick, setSimTick] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimTick((prev) => (prev + 1.6) % 12000);
      
      // Keep background animations running for interactive 2D indicators
      if (activeCodingSubTab === "loops" && activeLoopExample === "servo") {
        setServoAngleDegrees((angle) => {
          const tickVal = Date.now() / [150, 75, 25][loopFrequencySelected];
          return Math.round(90 + 90 * Math.sin(tickVal / 10));
        });
      }
    }, 30);
    return () => clearInterval(interval);
  }, [activeCodingSubTab, activeLoopExample, loopFrequencySelected]);

  // Action triggers for serial protocols
  useEffect(() => {
    if (!isUartTransmitting || isManualStepMode) return;
    const interval = setInterval(() => {
      setUartTxStep((prev) => {
        if (prev >= 9) {
          setIsUartTransmitting(false);
          return -1;
        }
        return prev + 1;
      });
    }, 850);
    return () => clearInterval(interval);
  }, [isUartTransmitting, isManualStepMode]);

  useEffect(() => {
    if (!isI2cTransmitting || isManualStepMode) return;
    const interval = setInterval(() => {
      setI2cTxStep((prev) => {
        if (prev >= 5) {
          setIsI2cTransmitting(false);
          return -1;
        }
        return prev + 1;
      });
    }, 950);
    return () => clearInterval(interval);
  }, [isI2cTransmitting, isManualStepMode]);

  useEffect(() => {
    if (!isSpiTransmitting || isManualStepMode) return;
    const interval = setInterval(() => {
      setSpiTxStep((prev) => {
        if (prev >= 9) {
          setIsSpiTransmitting(false);
          return -1;
        }
        return prev + 1;
      });
    }, 750);
    return () => clearInterval(interval);
  }, [isSpiTransmitting, isManualStepMode]);

  const activeCase = CASE_STUDIES[selectedCaseIdx];

  // Monitor desktop vs mobile layout constraints
  useEffect(() => {
    const checkViewportLimit = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    checkViewportLimit();
    window.addEventListener("resize", checkViewportLimit);
    return () => window.removeEventListener("resize", checkViewportLimit);
  }, []);

  // Flowchart continuous animated loop progression
  useEffect(() => {
    if (activeGuideTab !== "flowchart") return;
    const loopInterval = setInterval(() => {
      const msSinceLastActiveInteract = Date.now() - lastInteractionRef.current;
      if (msSinceLastActiveInteract < 5000) {
        // Paused for 5 seconds after clicking or hover actions
        return;
      }

      setActiveFlowStep((currentStep) => {
        // Only walk along standard non-ending pathways (skip terminate/shut down lines during looping)
        const activeArrows = activeCase.flowArrows.filter(
          (a) => a.from === currentStep && a.direction !== "terminate"
        );

        if (activeArrows.length === 0) {
          // Reached the terminal node, wrap back to the beginning sequence node
          return 0;
        }

        if (activeArrows.length === 1) {
          return activeArrows[0].to;
        }

        // Handle path decision splitting (e.g. at Diamond shapes) by shifting branches
        const chosenIndex = alternateBranch ? 1 % activeArrows.length : 0;
        setAlternateBranch((prev) => !prev);
        return activeArrows[chosenIndex].to;
      });
    }, 1800); // 1.8 seconds transition speed is perfect

    return () => clearInterval(loopInterval);
  }, [activeGuideTab, activeCase, alternateBranch]);

  // 1. Code execution loops cycles simulation loop
  useEffect(() => {
    if (activeGuideTab !== "coding" || activeCodingSubTab !== "loops") return;
    const rateHz = [2800, 1000, 180]; // ms delays
    const interval = setInterval(() => {
      setLoopPlayCycle(prev => (prev + 1) % 4);
    }, rateHz[loopFrequencySelected]);
    return () => clearInterval(interval);
  }, [activeGuideTab, activeCodingSubTab, loopFrequencySelected]);

  // Compute Current for Ohm's Law
  const currentAmps = ohmsVoltage / ohmsResistance;
  const currentMilliamps = currentAmps * 1000;
  const isPinBlown = currentMilliamps > 40.0; // Arduino Uno pin maximum continuous specs: 40mA

  // Compute Resistor Constriction spacing based on relative resistance
  const ohmsConstrictionFactor = (ohmsResistance - 100) / 900; // 0.0 to 1.0
  const ohmsNeckSpacing = 13.5 * (1 - ohmsConstrictionFactor) + 1.5; // 15px (wide open) down to 1.5px (fully squeezed)
  const ohmsFlowThickness = 3.8 * (1 - ohmsConstrictionFactor) + 1.2; // 5.0px (low resistance) down to 1.2px (high resistance)
  const ohmsVibeDuration = ohmsResistance > 700 ? "0.22s" : ohmsResistance > 400 ? "0.45s" : "0.95s";
  const ohmsVibeY = ohmsResistance > 700 ? "1.5px" : ohmsResistance > 400 ? "0.75px" : "0.15px";

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full px-1" id="robotics-edu-suite">
      {/* Header banner explaining STEM systems */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8" id="edu-hero-intro">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-505/10 to-sky-505/0 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
          <div className={`${viewType === "electronics" ? "lg:col-span-12" : "lg:col-span-7"} space-y-3`}>
            {viewType === "electronics" ? (
              <>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
                  STEM Electronics & Digital Systems
                </span>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
                  BASIC ELECTRONICS AND DIGITAL SYSTEM
                </h2>
                <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
                  Explore foundational hardware physics, trace live series or parallel circuit current drops, study and compute Ohm's Law formulas in real-time. Pull virtual breakers to route wire currents safely.
                </p>
              </>
            ) : viewType === "programming" ? (
              <>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#6366f1] bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  STEM Programming Academy
                </span>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
                  PROGRAMMING & SOFTWARE LAB
                </h2>
                <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
                  Master combining input sensors, microcontrollers & output actuators. Learn algorithmic logic and flowchart flow loops, or test live compiled variables, condition checks, and timer systems.
                </p>
              </>
            ) : (
              <>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#6366f1] bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  STEM Robotics Academy
                </span>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
                  ROBOTICS & CODING GUIDE
                </h2>
                <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
                  Robots interact with the real world using a basic loop: they read physical sensors, make logical decisions, and control mechanical motors or indicators. Select a learning station to begin building.
                </p>
              </>
            )}
          </div>
          
          {viewType !== "electronics" && (
            <div className="lg:col-span-5 flex flex-col gap-2.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80 backdrop-blur-sm w-full">
              <span className="font-mono text-[9px] text-[#38bdf8] font-black tracking-widest uppercase pl-1.5 mb-1.5 block">
                CHOOSE A STATION (ACTIVE OUTLINE SHOWN)
              </span>
              {([
                { id: "flowchart", label: "Logic and Flow Chart", sub: "Interactive decision flowcharts & C++ loops", icon: Activity, num: "", visible: true },
                { id: "coding", label: "Code and Commands", sub: "Learn Variables, Loop timers & Condition checks", icon: Code2, num: "", visible: true },
                { id: "electronics", label: "Basic Circuits", sub: "Ohm's Law & Circuit schematic simulations", icon: Zap, num: "", visible: !viewType }
              ] as const).filter(tab => tab.visible).map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeGuideTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveGuideTab(tab.id);
                      if (isMobileScreen) {
                        setTimeout(() => {
                          let elemId = "";
                          if (tab.id === "coding") elemId = "coding-edu-tab";
                          else if (tab.id === "flowchart") elemId = "flowchart-guide-section";
                          else if (tab.id === "electronics") elemId = "electronics-guide-section";
                          const target = document.getElementById(elemId);
                          if (target) {
                            target.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 120);
                      }
                    }}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl border text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive
                        ? "border-sky-400 bg-sky-505/10 text-white font-extrabold shadow-[0_0_15px_rgba(56,189,248,0.22)] ring-1 ring-sky-400/50 scale-[1.015]"
                        : "border-slate-800 bg-slate-950/40 text-slate-450 hover:text-slate-100 hover:border-slate-600 hover:bg-slate-950/80"
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-sky-400 transition-transform duration-250 ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}`} />
                    <div className="flex items-center gap-3 relative z-10 pl-1.5">
                      <div className={`p-1.5 rounded-lg border transition-all ${isActive ? "bg-sky-500/15 border-sky-400 text-sky-400" : "bg-slate-950 border-slate-800 text-slate-500 group-hover:text-slate-300 group-hover:border-slate-700"}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`font-sans font-bold text-xs ${isActive ? "text-sky-305" : "text-slate-300"}`}>{tab.label}</h4>
                        <p className={`font-mono text-[9px] truncate max-w-[2700px] ${isActive ? "text-sky-400/70" : "text-slate-500"}`}>{tab.sub}</p>
                      </div>
                    </div>
                    {tab.num && (
                      <span className={`font-mono text-[10px] pr-2 transition-colors ${isActive ? "text-sky-400 font-extrabold" : "text-slate-700 group-hover:text-slate-555"}`}>
                        {tab.num}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Redesigned interactive "Coding" tab */}
      {activeGuideTab === "coding" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="coding-edu-tab">
          {/* Sub tabs on left */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-805 bg-slate-950 p-5 space-y-4">
              <span className="font-mono text-[8px] uppercase tracking-wider text-sky-400 font-extrabold">Programming Theory Laboratory</span>
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
                  { id: "loops", label: "The Continuous Loop", desc: "How robots read inputs and update outputs over and over again", flagColor: "border-emerald-500" },
                  { id: "handbook", label: "Programmer's Handbook", desc: "Core C++ syntax rules, variables types & beginner tips", flagColor: "border-amber-500" }
                ] as const).map((sub) => {
                  const isCur = activeCodingSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveCodingSubTab(sub.id);
                        if (isMobileScreen) {
                          setTimeout(() => {
                            const target = document.getElementById("coding-simulation-deck");
                            if (target) {
                              target.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }, 120);
                        }
                      }}
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

          </div>

          {/* Interactive display and simulation deck on right */}
          <div className="lg:col-span-8 flex flex-col gap-4" id="coding-simulation-deck">
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
                          Variable Declarations
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Variables serve as physical memory folders. Drag controls to watch cache registers scale:</p>
                      </div>
                      <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-905 rounded-xl self-start">
                        <button
                          type="button"
                          onClick={() => setActiveVarExample("proximity")}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${activeVarExample === "proximity" ? "bg-indigo-505/20 text-indigo-400 border border-indigo-500/20" : "text-slate-505"}`}
                        >
                          Ex 1: Proximity Tracker
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveVarExample("temp")}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${activeVarExample === "temp" ? "bg-indigo-505/20 text-indigo-400 border border-indigo-500/20" : "text-slate-505"}`}
                        >
                          Ex 2: Smart Thermostat
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Interactive Simulators */}
                      <div className="space-y-4 bg-slate-900/20 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold mb-3">Adjust Physical Knobs:</span>
                          
                          {activeVarExample === "proximity" ? (
                            <div className="space-y-4">
                              {/* 1. Distance sensor analog slider */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-300 font-sans font-bold">Ultrasonic Target Distance:</span>
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
                              <div className="space-y-2 pt-3 border-t border-slate-900/40">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-305 font-sans font-bold">Trigger Motion (PIR):</span>
                                  <button
                                    onClick={() => setIsMotionTriggered(!isMotionTriggered)}
                                    className={`px-3 py-1 rounded-md font-mono font-bold text-[10px] border cursor-pointer select-none transition-all ${
                                      isMotionTriggered 
                                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" 
                                        : "bg-slate-950 text-slate-500 border-slate-800"
                                    }`}
                                  >
                                    {isMotionTriggered ? "MOTION CONFIRMED (1)" : "STILL DWELL (0)"}
                                  </button>
                                </div>
                                <p className="font-sans text-[10px] text-slate-550">Compiles directly into: <code className="text-emerald-400 font-mono">bool isMotion = {isMotionTriggered ? "true" : "false"};</code></p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Thermostat controls */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-300 font-sans font-bold">Thermostat Sensed Temp:</span>
                                  <span className="font-mono text-amber-500 font-black">{tempSensorValue} °C</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="15" 
                                  max="55" 
                                  value={tempSensorValue}
                                  onChange={(e) => setTempSensorValue(parseFloat(e.target.value))}
                                  className="w-full accent-amber-550 cursor-pointer"
                                />
                                <p className="font-sans text-[10px] text-slate-555">Compiles directly into: <code className="text-amber-500 font-mono">float ambientTemp = {tempSensorValue.toFixed(1)};</code></p>
                              </div>

                              <div className="space-y-1.5 pt-3 border-t border-slate-900/40 text-[11px] text-slate-400 leading-normal">
                                <p className="font-sans"><strong className="text-slate-200">Thermostatic rules:</strong> Real-time temperature logs act as parameters stored in the RAM allocation register shown below.</p>
                              </div>
                            </div>
                          )}
                                               {/* Interactive Real-Time Schematic and Telemetry Simulator */}
                        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-900 flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden select-none">
                          <span className="font-mono text-[8px] text-sky-400 absolute top-2 left-2 tracking-widest uppercase font-extrabold">REAL-TIME SYSTEM SIMULATION</span>
                          
                          {activeVarExample === "proximity" ? (
                            <div className="w-full h-32 relative flex items-center justify-center">
                              {/* Sleek 2D horizontal radar/distance scanner */}
                              <div className="w-11/12 h-14 bg-slate-900/60 rounded-lg p-2 flex items-center justify-between border border-slate-800/80 relative">
                                {/* Left: 2D Sensor representation */}
                                <div className="flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-500/30 px-2 py-1 rounded">
                                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-indigo-500 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                  </div>
                                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-indigo-500 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                                  </div>
                                  <span className="font-mono text-[7px] text-slate-400 font-extrabold">HC-SR04</span>
                                </div>

                                {/* Dynamic vector ultrasonic waves */}
                                <div className="absolute left-20 right-14 top-1/2 -translate-y-1/2 flex justify-start items-center gap-1 overflow-hidden">
                                  {[...Array(6)].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className="h-6 w-[2px] bg-[#38bdf8] rounded-full transition-all duration-300"
                                      style={{
                                        opacity: ((simTick % 6) === i ? 0.9 : 0.2),
                                        transform: `scaleY(${1 - i * 0.1})`,
                                        marginLeft: '4px'
                                      }}
                                    />
                                  ))}
                                </div>

                                {/* Right: Obstacle Indicator */}
                                <div 
                                  className="absolute bg-rose-950/80 border border-rose-500/80 px-2.5 py-1 rounded flex items-center gap-1"
                                  style={{
                                    left: `${Math.min(85, Math.max(30, userDistance))}%`,
                                    transition: "left 0.15s cubic-bezier(0.16, 1, 0.3, 1)"
                                  }}
                                >
                                  <span className="font-sans text-[8.5px] text-rose-300 font-black">OBSTACLE</span>
                                </div>
                              </div>

                              <p className="absolute bottom-1 right-2 font-mono text-[9px] text-[#38bdf8] bg-slate-950/85 px-1.5 border border-slate-900 rounded select-none">
                                distance: {userDistance} cm
                              </p>
                            </div>
                          ) : (
                            <div className="w-full h-32 relative flex items-center justify-center">
                              <div className="w-11/12 h-16 bg-slate-900/60 rounded-lg p-2.5 flex items-center justify-between border border-slate-800/80">
                                {/* Left Panel: CPU and Temp sensor reading */}
                                <div className="flex flex-col gap-1">
                                  <span className="font-mono text-[7px] text-slate-500">THERMOMETER PIN A1</span>
                                  <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded">
                                    <Thermometer className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                    <span className="font-mono text-[10px] text-amber-400 font-bold">{tempSensorValue.toFixed(1)}°C</span>
                                  </div>
                                </div>

                                {/* Active Flow Connector with blinking dots */}
                                <div className="flex-1 flex items-center justify-center gap-1 px-4 text-slate-700">
                                  <div className={`w-1.5 h-1.5 rounded-full ${tempSensorValue > 35 ? "bg-emerald-400 animate-ping" : "bg-slate-700"}`} />
                                  <div className="h-[2px] w-12 bg-slate-800 relative overflow-hidden">
                                    {tempSensorValue > 35 && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-full h-full animate-pulse" />
                                    )}
                                  </div>
                                  <div className={`w-1.5 h-1.5 rounded-full ${tempSensorValue > 35 ? "bg-emerald-400" : "bg-slate-700"}`} />
                                </div>

                                {/* Right Panel: Cooling Fan 2D view */}
                                <div className="flex flex-col items-center">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase">COOLING FAN</span>
                                  <div className="relative w-10 h-10 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center mt-1">
                                    <RefreshCw 
                                      className={`w-5 h-5 transition-transform text-[#38bdf8] ${tempSensorValue > 35 ? "animate-spin" : ""}`}
                                      style={{
                                        animationDuration: tempSensorValue > 35 ? "0.6s" : "2s"
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>   </div>
                      </div>

                      {/* Right: Live code output highlighted */}
                      <div className="space-y-2 flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Firmware Code Output:</span>
                        <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 font-mono text-[10.5px] leading-relaxed relative flex-1 flex flex-col justify-between">
                          {activeVarExample === "proximity" ? (
                            <div className="space-y-2 text-slate-400">
                              <span className="text-slate-600 block">// Registers proximity sensor input pins</span>
                              <p><span className="text-[#f43f5e]">const int</span> trigPin = <span className="text-indigo-400">3</span>;</p>
                              <p><span className="text-[#f43f5e]">const int</span> echoPin = <span className="text-indigo-400">4</span>;</p>
                              <p className="text-pink-400 bg-pink-500/10 px-1 py-0.5 rounded shadow-[inset_2px_0_0_#f43f5e] transition-colors duration-150">
                                <span className="text-[#f43f5e]">int</span> distance = <span className="text-sky-400 font-extrabold">{userDistance}</span>; <span className="text-slate-655 text-[9.5px]">// updated dynamically</span>
                              </p>
                              <p className="text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded shadow-[inset_2px_0_0_#f59e0b] transition-colors duration-150">
                                <span className="text-[#f43f5e]">bool</span> obstacleDetected = <span className="text-emerald-400 font-extrabold">{userDistance < 20 ? "true" : "false"}</span>;
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 text-slate-400">
                              <span className="text-slate-600 block">// Registers Thermistor temperature coefficient parameters</span>
                              <p><span className="text-[#f43f5e]">const int</span> thermistorPin = <span className="text-indigo-400">A1</span>;</p>
                              <p className="text-pink-400 bg-pink-500/10 px-1 py-0.5 rounded shadow-[inset_2px_0_0_#f43f5e] transition-colors duration-150">
                                <span className="text-[#f43f5e]">float</span> tempSensorVal = <span className="text-[#38bdf8] font-bold">{tempSensorValue.toFixed(1)}</span>; <span className="text-slate-655 text-[9.5px]">// Float storing decimel levels</span>
                              </p>
                              <p className="text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded shadow-[inset_2px_0_0_#f59e0b] transition-colors duration-150">
                                <span className="text-[#f43f5e]">bool</span> activeCoolerState = <span className="text-emerald-400 font-extrabold">{tempSensorValue > 35 ? "true" : "false"}</span>;
                              </p>
                            </div>
                          )}
                          <div className="border-t border-slate-900/60 pt-3 mt-4 flex items-center gap-1.5 text-[9.5px] text-indigo-400 font-mono">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{activeVarExample === "proximity" ? "Integers save distance numbers. Booleans represent yes/no trigger states." : "Floats store fractional numbers (like celsius). Booleans activate status relays."}</span>
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
                          Conditional Logic Branches (if / else)
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Checks physical thresholds and triggers separate execution paths:</p>
                      </div>
                      <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-905 rounded-xl self-start">
                        <button
                          type="button"
                          onClick={() => setActiveCondExample("lamp")}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${activeCondExample === "lamp" ? "bg-sky-500/15 text-sky-400 border border-sky-505/20" : "text-slate-505"}`}
                        >
                          Ex 1: Solar Streetlamp
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveCondExample("laser")}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${activeCondExample === "laser" ? "bg-sky-500/15 text-sky-400 border border-sky-505/20" : "text-slate-505"}`}
                        >
                          Ex 2: Laser Tripwire
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left side: Interactive raw condition controllers */}
                      <div className="space-y-3 bg-slate-900/20 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold mb-2">Adjust Logical Trigger Sensed Metrics:</span>
                          
                          {activeCondExample === "lamp" ? (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-305 font-sans font-bold">Photoresistor Sensed Light:</span>
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
                              <div className="flex justify-between text-[10px] text-slate-550 mb-4">
                                <span>100 Lux (Dark Night)</span>
                                <span>950 Lux (Sunlight)</span>
                              </div>
                            </div>
                          ) : (
                            <div className="py-2 flex items-center justify-between border-b border-slate-900/40 pb-4 mb-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-slate-205 font-sans font-bold text-xs">Laser Tripwire Beam State:</span>
                                <span className="font-mono text-[9px] text-slate-400">Blocks physical path of laser receiver</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setLaserBeamCut(!laserBeamCut)}
                                className={`px-4 py-1.5 rounded-lg border font-mono font-black text-[10px] transition-all cursor-pointer select-none ${laserBeamCut ? "bg-rose-500/15 text-rose-400 border-rose-500" : "bg-emerald-500/15 text-emerald-400 border-emerald-550/40"}`}
                              >
                                {laserBeamCut ? "BEAM SEVERED (ALARM)" : "BEAM COMPLETED (OK)"}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 2D Interactive Schematic Diagram */}
                        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-900 flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden select-none">
                          <span className="font-mono text-[8px] text-sky-400 absolute top-2 left-2 tracking-widest uppercase font-extrabold">2D INTERACTIVE SCHEMATIC DIAGRAM</span>
                          
                          {activeCondExample === "lamp" ? (
                            <div className="w-full h-32 relative flex items-center justify-center">
                              <div className="w-11/12 h-16 bg-slate-900/60 rounded-lg p-3 flex items-center justify-between border border-slate-800/80">
                                {/* Left: Raw light ADC value reading */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase">LDR SENSOR</span>
                                  <div className="bg-slate-950/85 border border-slate-800 rounded px-2.5 py-1 flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${lightRawADC < 400 ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                                    <span className="font-mono text-xs text-slate-200">{lightRawADC} Lux</span>
                                  </div>
                                </div>

                                {/* Middle Flow Indicator */}
                                <div className="flex-1 flex flex-col items-center justify-center px-4 font-mono text-[7.5px] text-slate-500">
                                  <span className="uppercase">{lightRawADC < 450 ? "NIGHT TRIGGERED" : "DAY STANDBY"}</span>
                                  <div className="h-[2px] w-full bg-slate-800 mt-1 relative overflow-hidden">
                                    <div className={`absolute top-0 bottom-0 w-1/3 bg-sky-400 transition-all ${lightRawADC < 450 ? "left-[30%] animate-pulse" : "left-0 bg-slate-700"}`} />
                                  </div>
                                </div>

                                {/* Right: Street Light state in flat 2D */}
                                <div className="flex flex-col items-center">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase">STREET LIGHT</span>
                                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mt-1 transition-all ${lightRawADC < 450 ? "bg-amber-500/10 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse" : "bg-slate-950/50 border-slate-800"}`}>
                                    <Zap className={`w-5 h-5 ${lightRawADC < 450 ? "text-amber-400" : "text-slate-600"}`} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-32 relative flex items-center justify-center">
                              <div className="w-11/12 h-16 bg-slate-900/60 rounded-lg p-3 flex items-center justify-between border border-slate-800/80">
                                {/* Left: Transmitter */}
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase">TX EMITTER</span>
                                  <div className="bg-indigo-950 border border-indigo-500 rounded px-2.5 py-1 text-[8.5px] font-mono text-indigo-300">
                                    LASER ON
                                  </div>
                                </div>

                                {/* Main laser trace */}
                                <div className="flex-1 px-4 relative flex items-center justify-center self-center">
                                  {!laserBeamCut ? (
                                    <div className="h-[2.5px] w-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                                  ) : (
                                    <div className="w-full flex items-center justify-between">
                                      <div className="h-[2.5px] w-[35%] bg-red-500 shadow-[0_0_8px_#ef4444]" />
                                      {/* Barrier card representing severed beam in flat layout */}
                                      <div className="px-1.5 py-0.5 bg-rose-950/80 border border-rose-500/80 text-[8px] font-mono text-rose-300 font-extrabold rounded select-none shadow">
                                        CUT
                                      </div>
                                      <div className="h-[2.5px] w-[35%] bg-slate-800 opacity-20" />
                                    </div>
                                  )}
                                </div>

                                {/* Right: Receiver detector and logic switch */}
                                <div className="flex flex-col items-end gap-1">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase">RX SENSOR</span>
                                  <div className={`px-2.5 py-1 rounded transition-all text-[8.5px] font-mono border ${laserBeamCut ? "bg-rose-500/15 text-rose-400 border-rose-500" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/50"}`}>
                                    {laserBeamCut ? "TRIPPED" : "LOCKED"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Right side: Highlighted Code base depending on choice */}
                      <div className="space-y-2 flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Highlighting running loop branches:</span>
                        <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 font-mono text-[10.5px] leading-relaxed flex-1 flex flex-col justify-between">
                          {activeCondExample === "lamp" ? (
                            <div className="space-y-0.5 text-slate-400">
                              <p className="text-slate-555">// Evaluates photoresistor limits to toggle lights</p>
                              <p className="text-slate-200">
                                <span className="text-[#f43f5e] font-bold">if</span> (ambientLight &lt; <span className="text-indigo-400 font-bold">400</span>) &#123;
                              </p>
                              <p className={`pl-4 py-1.5 transition-all rounded ${lightRawADC < 400 ? "bg-emerald-500/15 text-emerald-300 font-bold shadow-[inset_2px_0_0_#10b981]" : "text-slate-600 opacity-30"}`}>
                                digitalWrite(streetlampLED, HIGH); <span className="text-[9px] font-sans italic opacity-60">// streetlight ON</span>
                              </p>
                              <p className="text-slate-200">&#125; <span className="text-[#f43f5e] font-bold">else</span> &#123;</p>
                              <p className={`pl-4 py-1.5 transition-all rounded ${lightRawADC >= 400 ? "bg-emerald-500/15 text-emerald-300 font-bold shadow-[inset_2px_0_0_#10b981]" : "text-slate-600 opacity-30"}`}>
                                digitalWrite(streetlampLED, LOW); <span className="text-[9px] font-sans italic opacity-60">// light standby OFF</span>
                              </p>
                              <p className="text-slate-200">&#125;</p>
                            </div>
                          ) : (
                            <div className="space-y-0.5 text-slate-400">
                              <p className="text-slate-555">// Trips sirens if laser beam gets severed</p>
                              <p className="text-slate-200">
                                <span className="text-[#f43f5e] font-bold">if</span> (laserBeamCut == <span className="text-[#38bdf8] font-bold">true</span>) &#123;
                              </p>
                              <p className={`pl-4 py-1.5 transition-all rounded ${laserBeamCut ? "bg-rose-500/15 text-rose-300 font-bold shadow-[inset_2px_0_0_#ef4444]" : "text-slate-655 opacity-30"}`}>
                                digitalWrite(piezoBuzzer, HIGH); <span className="text-[9px] font-sans italic opacity-60">// alarm siren sounded</span>
                              </p>
                              <p className="text-slate-200">&#125; <span className="text-[#f43f5e] font-bold">else</span> &#123;</p>
                              <p className={`pl-4 py-1.5 transition-all rounded ${!laserBeamCut ? "bg-emerald-500/15 text-emerald-300 font-bold shadow-[inset_2px_0_0_#10b981]" : "text-slate-655 opacity-30"}`}>
                                digitalWrite(piezoBuzzer, LOW); <span className="text-[9px] font-sans italic opacity-60">// security alarm standby</span>
                              </p>
                              <p className="text-slate-200">&#125;</p>
                            </div>
                          )}
                          
                          <div className="border-t border-slate-900/60 pt-3 mt-4 flex items-center gap-1.5 text-[9.5px] text-indigo-400 font-mono">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{activeCondExample === "lamp" ? "Checks if raw photoresistor ADC value falls below the 400 dark threshold." : "Uses the logical equality binary check (== true) to trigger alert branches."}</span>
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
                          The Infinite Execution loop()
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Fires continuous scans to update hardware positions. Change CPU clock frequencies below:</p>
                      </div>
                      <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-905 rounded-xl self-start">
                        <button
                          type="button"
                          onClick={() => setActiveLoopExample("orbit")}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${activeLoopExample === "orbit" ? "bg-emerald-500/15 text-emerald-450 border border-emerald-505/20" : "text-slate-505"}`}
                        >
                          Ex 1: instruction Orbit
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveLoopExample("servo")}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${activeLoopExample === "servo" ? "bg-emerald-500/15 text-emerald-450 border border-emerald-505/20" : "text-slate-505"}`}
                        >
                          Ex 2: Servo PWM sweep
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Interactive loop speed dials and visualizer */}
                      <div className="space-y-3 bg-slate-900/10 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold mb-2.5">Set Execution CPU Frequency:</span>
                          
                          <div className="flex gap-1.5 mb-4">
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
                                              {/* 2D Real-Time System Engine */}
                        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-900 flex flex-col items-center justify-center min-h-[170px] relative overflow-hidden select-none">
                          <span className="font-mono text-[8px] text-emerald-400 absolute top-2 left-2 tracking-widest uppercase font-extrabold">REAL-TIME SYSTEM ENGINE</span>
                          
                          {activeLoopExample === "orbit" ? (
                            <div className="w-full h-32 relative flex items-center justify-center animate-fadeIn">
                              <div className="w-11/12 h-18 bg-slate-900/60 rounded-lg p-2.5 flex items-center justify-between border border-slate-800/80">
                                {/* Left Panel: Instruction register */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-mono text-[7px] text-slate-500">INSTRUCTION STATE</span>
                                  <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                                    <span className="font-mono text-[10px] text-emerald-400 font-black animate-pulse">CYCLE ACTIVE</span>
                                  </div>
                                </div>

                                {/* Middle visualizer: Step Indicators */}
                                <div className="flex items-center gap-1.5 px-3">
                                  {[0, 1, 2, 3].map((stepIdx) => {
                                    const isCurrent = loopPlayCycle === stepIdx;
                                    return (
                                      <div 
                                        key={stepIdx}
                                        className={`flex flex-col items-center justify-center w-7 h-7 rounded-md border font-mono text-[10px] tracking-wide font-extrabold transition-all duration-300 ${isCurrent ? "bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-110" : "bg-slate-950 border-slate-900 text-slate-600"}`}
                                      >
                                        S{stepIdx + 1}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Right panel: execution rate telemetry details */}
                                <div className="flex flex-col items-end text-right">
                                  <span className="font-mono text-[7px] block text-slate-500">EXEC FREQUENCY</span>
                                  <span className="font-mono text-[11px] text-slate-300 uppercase font-black">
                                    {loopFrequencySelected === 0 ? "0.3 Hz (Slow)" : loopFrequencySelected === 1 ? "1.0 Hz (Med)" : "5.5 Hz (Fast)"}
                                  </span>
                                  <span className="font-mono text-[7.5px] text-emerald-400/80 animate-pulse uppercase tracking-wider mt-0.5">Continuous Exec</span>
                                </div>
                              </div>
                              
                              <p className="absolute bottom-1 right-2 font-mono text-[9px] text-[#10b981] bg-slate-950/80 border border-slate-900 rounded px-1.5 select-none">
                                step: {loopPlayCycle + 1} / 4
                              </p>
                            </div>
                          ) : (
                            <div className="w-full h-32 relative flex items-center justify-center animate-fadeIn">
                              <div className="w-11/12 h-18 bg-slate-900/60 rounded-lg p-2.5 flex items-center justify-between border border-slate-800/80">
                                {/* Left Panel: PWM Output channel pin */}
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-mono text-[7px] text-slate-500">ACTUATOR REGISTER</span>
                                  <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                                    <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase">PIN D9 (PWM)</span>
                                  </div>
                                </div>

                                {/* Middle panel: 2D radial angle arc gauge representation */}
                                <div className="relative w-16 h-16 flex items-center justify-center">
                                  {/* Custom flat 2D gauge circle */}
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                      className="stroke-[#020617]"
                                      strokeWidth="3.2"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    {/* Filled value of rotation */}
                                    <path
                                      className="stroke-indigo-500 transition-all duration-300"
                                      strokeDasharray={`${(servoAngleDegrees / 180) * 100}, 100`}
                                      strokeWidth="3.2"
                                      strokeLinecap="round"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  {/* Internal core center pin indicator */}
                                  <div className="absolute w-10 h-10 rounded-full bg-slate-950 flex flex-col items-center justify-center">
                                    <span className="font-sans font-bold text-[9px] text-[#f8fafc]">{servoAngleDegrees}°</span>
                                  </div>
                                </div>

                                {/* Right Panel: Active micro servo model specs flat */}
                                <div className="flex flex-col items-end text-right justify-center">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase">DEVICE: micro sg90</span>
                                  <span className="font-mono text-[9px] text-emerald-400 uppercase font-bold mt-1">LOCKING POSITION</span>
                                  <span className="font-mono text-[7.5px] text-slate-400 mt-0.5 uppercase">Duty Cycle: {((servoAngleDegrees / 180) * 10).toFixed(1)} ms</span>
                                </div>
                              </div>

                              <p className="absolute bottom-1 right-2 font-mono text-[9px] text-indigo-400 bg-slate-950/80 border border-slate-900 rounded px-1.5 select-none font-bold">
                                PWM Angle: {servoAngleDegrees}°
                              </p>
                            </div>
                          )}
                        </div>     </div>
                      </div>

                      {/* Right: Loop C++ code template */}
                      <div className="space-y-2 flex flex-col">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-550 block font-bold">Infinite sequence loop blocks:</span>
                        <div className="rounded-xl bg-slate-950 p-4 border border-slate-900 font-mono text-[10.5px] leading-relaxed relative flex-1 flex flex-col justify-between">
                          {activeLoopExample === "orbit" ? (
                            <div className="space-y-0.5 text-slate-400">
                              <p className="text-[#a855f7]"><span className="text-[#f43f5e] font-bold">void</span> <span className="text-white font-bold">loop</span>() &#123;</p>
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 0 ? "bg-pink-500/10 text-pink-400 font-bold shadow-[inset_2px_0_0_#f43f5e]" : "text-slate-650"}`}>
                                <span className="text-[#f43f5e]">int</span> r = analogRead(A0); <span className="text-[9.5px] font-sans opacity-60">// Acquisition (read raw input)</span>
                              </p>
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 1 ? "bg-purple-500/10 text-purple-400 font-bold shadow-[inset_2px_0_0_#a855f7]" : "text-slate-650"}`}>
                                <span className="text-[#f43f5e]">float</span> val = r * <span className="text-indigo-400">0.12</span>; <span className="text-[9.5px] font-sans opacity-60">// Calibration (scale inputs)</span>
                              </p>
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 2 ? "bg-amber-500/10 text-amber-400 font-bold shadow-[inset_2px_0_0_#f59e0b]" : "text-slate-650"}`}>
                                checkThresholdFlags(val); <span className="text-[9.5px] font-sans opacity-60">// Decision (verify logic)</span>
                              </p>
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 3 ? "bg-emerald-500/10 text-emerald-300 font-bold shadow-[inset_2px_0_0_#10b981]" : "text-slate-650"}`}>
                                digitalWrite(motor, HIGH); <span className="text-[9.5px] font-sans opacity-60">// Output (action trigger)</span>
                              </p>
                              <p className="pl-4 text-slate-600">delay(<span className="text-indigo-400 font-bold">{[2800, 1000, 180][loopFrequencySelected]}</span>); <span className="text-[9.5px] font-sans opacity-60">// Sleep interval</span></p>
                              <p className="text-[#a855f7]">&#125;</p>
                            </div>
                          ) : (
                            <div className="space-y-0.5 text-slate-400">
                              <p className="text-[#a855f7]"><span className="text-[#f43f5e] font-bold">void</span> <span className="text-white font-bold">loop</span>() &#123;</p>
                              <p className="pl-4 text-slate-600">// Cycles angle value registers in sequence loops</p>
                               <p className="pl-4 py-0.5 rounded transition-all bg-emerald-500/10 text-emerald-300 font-bold shadow-[inset_2px_0_0_#10b981] w-max">
                                servoMotor.write(<span className="text-sky-305 font-extrabold">{servoAngleDegrees}</span>); <span className="text-[9.5px] font-sans opacity-60">// angle sweep updated</span>
                              </p>
                              <p className="pl-4 text-slate-600">delay(<span className="text-indigo-400 font-bold">{[40, 20, 5][loopFrequencySelected]}</span>); <span className="text-[9.5px] font-sans opacity-60">// servo response delay</span></p>
                              <p className="text-[#a855f7]">&#125;</p>
                            </div>
                          )}
                          
                          <div className="border-t border-slate-900/60 pt-3 mt-4 flex items-center gap-1.5 text-[9.5px] text-indigo-400 font-mono">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{activeLoopExample === "orbit" ? "In embedded systems, loop() repeats thousands of times per second." : "Servo gears update their angle depending on the duty cycle width of PWM pulses."}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeCodingSubTab === "handbook" && (
                  <motion.div
                    key="handbook"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5 text-left"
                  >
                    <div className="border-b border-slate-905 border-b-slate-900 pb-3">
                      <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400 animate-pulse" />
                        Microcontroller Programming Fundamentals
                      </h4>
                      <p className="font-sans text-[11px] text-slate-500 leading-tight">Your complete beginner handbook to mastering embedded hardware programming logic.</p>
                    </div>

                    {/* Quick Start Tip Box */}
                    <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-2xl flex gap-3.5 items-start">
                      <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-sans font-extrabold text-[#f59e0b] text-xs uppercase text-amber-300">What is an Algorithm?</h5>
                        <p className="font-sans text-xs text-slate-305 leading-relaxed mt-1 text-slate-300">
                          An algorithm is simply a step-by-step recipe to solve a physical problem. For a robot, this means translating fuzzy human goals (like "drive forward without crashing") into exact, unambiguous mathematical actions (like "if ultrasonic distance is less than 15, rotate servo motor angle").
                        </p>
                      </div>
                    </div>

                    {/* The 4 pillars grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pillar A: Syntax Rules */}
                      <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-2xl space-y-3">
                        <span className="font-mono text-[8px] text-violet-400 font-extrabold tracking-widest block uppercase">SYNTAX LAWS</span>
                        <h5 className="font-sans font-extrabold text-slate-100 text-xs uppercase">Semicolons & Curly Braces</h5>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed font-sans">
                          Just like writing human language requires punctuation, computer microchips require exact syntax rules:
                        </p>
                        <div className="bg-[#020617] p-3 rounded-xl border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-1.5 leading-normal">
                          <p><span className="text-emerald-500">// Semicolon ends every command line:</span></p>
                          <p><span className="text-slate-200">int pinNumber = 13;</span></p>
                          <p className="pt-1"><span className="text-[#a855f7]">if</span> (<span className="text-slate-200">sensorActive</span>) &#123;</p>
                          <p className="pl-4 text-emerald-500">// Braces group blocks together</p>
                          <p className="pl-4 text-slate-200">digitalWrite(13, HIGH);</p>
                          <p>&#125; <span className="text-emerald-505 text-emerald-400">// closes the if-block</span></p>
                        </div>
                      </div>

                      {/* Pillar B: Variables Dictionary */}
                      <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-2xl space-y-3">
                        <span className="font-mono text-[8px] text-sky-450 font-extrabold tracking-widest block uppercase">PHYSICAL MEMORY</span>
                        <h5 className="font-sans font-extrabold text-slate-100 text-xs uppercase">Microchip Variables Cabinet</h5>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed font-sans">
                          Variables store data in physical memory modules. You must declare what type of data you are containing:
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="grid grid-cols-3 border-b border-slate-900/60 pb-1.5 text-[10.5px] pt-1.5">
                            <span className="font-mono font-bold text-sky-450">int</span>
                            <span className="col-span-2 text-slate-300">Whole integers (pin index, loop counts)</span>
                          </div>
                          <div className="grid grid-cols-3 border-b border-slate-900/60 pb-1.5 text-[10.5px]">
                            <span className="font-mono font-bold text-pink-400">float</span>
                            <span className="col-span-2 text-slate-300">Decimals (voltages, calculated distance)</span>
                          </div>
                          <div className="grid grid-cols-3 border-b border-slate-900/60 pb-1.5 text-[10.5px]">
                            <span className="font-mono font-bold text-violet-400">bool</span>
                            <span className="col-span-2 text-slate-300">True/False logic (HIGH / LOW pulse flags)</span>
                          </div>
                        </div>
                      </div>

                      {/* Pillar C: Control Decision Paths */}
                      <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-2xl space-y-3">
                        <span className="font-mono text-[8px] text-emerald-410 font-extrabold tracking-widest block uppercase text-emerald-400">DECISION LOGIC</span>
                        <h5 className="font-sans font-extrabold text-slate-100 text-xs uppercase">If/Else Logical Pathways</h5>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed font-sans">
                          Conditionals guide the processor to branching paths like train track switches. Only ONE path fires:
                        </p>
                        <div className="bg-[#020617] p-3 rounded-xl border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-1 leading-normal">
                          <p><span className="text-[#a855f7]">if</span> (dist &lt; <span className="text-amber-400">15.0</span>) &#123;</p>
                          <p className="pl-4 text-slate-400">steerLeft(); <span className="text-[8.5px] text-slate-500">// Too close bounds</span></p>
                          <p>&#125; <span className="text-[#a855f7]">else if</span> (dist &gt; <span className="text-amber-400">100</span>) &#123;</p>
                          <p className="pl-4 text-slate-400">stopSearch(); <span className="text-[8.5px] text-slate-500">// Limit out</span></p>
                          <p>&#125; <span className="text-[#a855f7]">else</span> &#123;</p>
                          <p className="pl-4 text-slate-400">driveForward(); <span className="text-[8.5px] text-slate-500">// Safe clear path</span></p>
                          <p>&#125;</p>
                        </div>
                      </div>

                      {/* Pillar D: Loop Lifecycles */}
                      <div className="bg-slate-950/45 border border-slate-900 p-4 rounded-2xl space-y-3">
                        <span className="font-mono text-[8px] text-orange-400 font-extrabold tracking-widest block uppercase">REPETITION LOOP</span>
                        <h5 className="font-sans font-extrabold text-slate-100 text-xs uppercase">The Continuous Loop Cycle</h5>
                        <p className="font-sans text-xs text-slate-400 leading-relaxed font-sans">
                          Robotics processors continuously scan registers and refresh outputs over and over again in an infinite loop:
                        </p>
                        <div className="bg-[#020617] p-3 rounded-xl border border-slate-900 font-mono text-[9.5px] text-slate-300 space-y-1.5 leading-normal">
                          <p><span className="text-[#f43f5e] font-bold">void</span> <span className="text-sky-300 font-bold">loop</span>() &#123;</p>
                          <p className="pl-4 text-slate-350">readSensorValues(); <span className="text-emerald-450 text-[8.5px] font-sans">// Runs continuously</span></p>
                          <p className="pl-4 text-slate-350">controlActuators(); <span className="text-emerald-450 text-[8.5px] font-sans">// Updates in order</span></p>
                          <p className="pl-4 text-slate-355">delay(<span className="text-indigo-400">10</span>); <span className="text-slate-500 text-[8.5px] font-sans">// clock cycle hold</span></p>
                          <p>&#125;</p>
                        </div>
                      </div>
                    </div>

                    {/* Best Practice Tips */}
                    <div className="rounded-2xl border border-slate-900 bg-[#04081c]/30 p-5 space-y-4">
                      <span className="font-mono text-[8.5px] text-amber-400 font-black tracking-widest uppercase flex items-center gap-1.5 select-none text-left">
                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                        BEGINNER DEBUGGING HANDBOOK: HOW TO THINK LIKE A CODER
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div className="space-y-3 animate-fadeIn">
                          <div className="flex gap-2.5 items-start">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span>
                            <div>
                              <h5 className="font-sans font-extrabold text-slate-200 text-xs">Print Telemetry Always</h5>
                              <p className="font-sans text-[11px] text-slate-400 leading-normal mt-0.5">
                                You write variable values to physical registers, but you cannot see them physically. Use <code className="font-mono text-[10px] px-1 bg-slate-100 px-1.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[9.5px]">Serial.println(distance)</code> to stream values onto your screen.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2.5 items-start">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">B</span>
                            <div>
                              <h5 className="font-sans font-extrabold text-slate-200 text-xs">Compile and Verify Early</h5>
                              <p className="font-sans text-[11px] text-slate-400 leading-normal mt-0.5">
                                Do not write 100 lines of code before hitting compile. Write 5 lines, build successfully, resolve syntax problems, then continue. This prevents compound errors.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 animate-fadeIn">
                          <div className="flex gap-2.5 items-start">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">C</span>
                            <div>
                              <h5 className="font-sans font-extrabold text-slate-200 text-xs">Beware of Semicolon Traps</h5>
                              <p className="font-sans text-[11px] text-slate-400 leading-normal mt-0.5">
                                The absolute most common syntax errors are missing semicolons <code className="font-mono text-[10px] px-1 bg-slate-100 px-1.5 py-0.5 rounded-md bg-slate-950 text-rose-300 text-[9.5px]">;</code>. Read compiler feedback warnings bottom-to-top to find precise line matches.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2.5 items-start">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">D</span>
                            <div>
                              <h5 className="font-sans font-extrabold text-slate-200 text-xs">Comment Your Intentions</h5>
                              <p className="font-sans text-[11px] text-slate-400 leading-normal mt-0.5">
                                Use <code className="font-mono text-[10px] px-1 bg-slate-100 px-1.5 py-0.5 rounded-md bg-slate-950 text-emerald-400 text-[9.5px]">// comments</code> to outline your core sequence logic in plain English before drafting microchip commands.
                              </p>
                            </div>
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
                    name: "Start / End", 
                    shape: "Circle (Rounded)", 
                    indicator: <div className="w-4 h-4 rounded-full border border-amber-500 bg-amber-500/10 shrink-0" />, 
                    desc: "Specifies initialization of program memory boot cycle or structural cessation.",
                    code: "Called only once at system bootup.\nvoid setup() {\n  initSensors();\n}"
                  },
                  { 
                    id: "parallelogram", 
                    name: "Input / Output", 
                    shape: "Parallelogram", 
                    indicator: <div className="w-4 h-3.5 border border-pink-500 bg-pink-500/10 -skew-x-12 shrink-0" />, 
                    desc: "Reads digital/analog inputs from physical pins or writes commands directly to active components.",
                    code: "digitalRead(triggerPin);\nanalogWrite(motorPin, 180);"
                  },
                  { 
                    id: "rectangle", 
                    name: "Process", 
                    shape: "Rectangle", 
                    desc: "Calculates metric math, coordinates variables updates, scales levels, or triggers timers.",
                    indicator: <div className="w-4 h-3 border border-purple-500 bg-purple-500/10 rounded shrink-0" />,
                    code: "float distanceCm = pulseDuration * 0.034 / 2.0;\ndelay(1000);"
                  },
                  { 
                    id: "diamond", 
                    name: "Decision Fork", 
                    shape: "Diamond", 
                    indicator: <div className="w-3.5 h-3.5 border border-yellow-500 bg-yellow-500/10 rotate-45 shrink-0" />,
                    desc: "Checks boolean comparisons. Splits flow of direction based on True / False outputs.",
                    code: "if (sensorVal < threshold) {\n  triggerAlarm();\n} else {\n  standbyState();\n}"
                  },
                  { 
                    id: "arrow", 
                    name: "Direction Pathway", 
                    shape: "Direction Arrow", 
                    indicator: <div className="w-4 h-4 flex items-center justify-center shrink-0"><ArrowRight className="w-3.5 h-3.5 text-sky-400" /></div>, 
                    desc: "Instructs program register sequence tracking. Determines the exact chronological direction of execution.",
                    code: "Proceed sequentially downward to next logic clock pointer."
                  }
                ]).map((block) => {
                  const isFocused = selectedShape === block.id;
                  return (
                    <button
                      key={block.id}
                      onClick={() => {
                        setSelectedShape(block.id);
                        setShowGlossaryModal(true);
                        lastInteractionRef.current = Date.now();
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isFocused 
                          ? "border-sky-500 bg-sky-500/[0.04] ring-1 ring-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.15)]" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {block.indicator}
                        <div>
                          <h4 className={`font-sans font-bold text-xs ${isFocused ? "text-sky-300" : "text-slate-205"}`}>{block.name}</h4>
                          <span className={`font-mono text-[9px] uppercase ${isFocused ? "text-sky-400" : "text-slate-400"}`}>{block.shape}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isFocused ? "rotate-90 text-sky-450" : ""}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Glossary active information display card */}
            <AnimatePresence mode="wait">
              {!isMobileScreen && selectedShape && (
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
                        <pre className="font-mono text-[10px] leading-normal overflow-x-auto whitespace-pre">
                          {highlightCppCodeText(`void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}`)}
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
                        <pre className="font-mono text-[10px] leading-normal overflow-x-auto whitespace-pre">
                          {highlightCppCodeText(`// INPUT
int dryRaw = analogRead(A0);

// OUTPUT
digitalWrite(pistonPin, HIGH);`)}
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
                        <pre className="font-mono text-[10px] leading-normal overflow-x-auto whitespace-pre">
                          {highlightCppCodeText(`float dist = (pulseMs * 0.0343) / 2.0;
delay(250); // Pause execution`)}
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
                        <pre className="font-mono text-[10px] leading-normal overflow-x-auto whitespace-pre">
                          {highlightCppCodeText(activeCase.id === "obstacle_avoidance" ? `if (distance < 15) {
  // Take YES (Blocked) branch
  steerLeft(); // Turn wheels left
} else {
  // Take NO (Clear) branch
  driveForward(); // Forward speed
}` : activeCase.id === "monitoring_system" ? `if (ambientLight < 400) {
  // Take YES (Darkness) branch
  digitalWrite(ledPin, HIGH); // LED Light ON
} else {
  // Take NO (Daylight) branch
  digitalWrite(ledPin, LOW); // LED Light OFF
}` : activeCase.id === "autonomous_robot" ? `if (isPathClear) {
  // Take YES (Clear) branch
  driveForward(); // Set cruise speed
} else {
  // Take NO (Blocked) branch
  haltAndRecalculate(); // Find new route
}` : `if (torqueLoad > 85) {
  // Take YES (Overload) branch
  digitalWrite(relayPin, LOW); // Cut relay safety power
} else {
  // Take NO (Safe) branch
  sweepServoJoint(); // Speed servo angle
}`)}
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

            {/* Interactive Popup Modal for Shape Logic Guides */}
            <AnimatePresence>
              {showGlossaryModal && selectedShape && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-sm shadow-2xl" id="flowchart-glossary-modal">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => setShowGlossaryModal(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="relative w-full max-w-md rounded-2xl border-2 border-slate-705 bg-[#090f2b] p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4 text-left z-10 max-h-[96vh] flex flex-col overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-slate-805/70 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                          <Compass className="w-4 h-4" />
                        </span>
                        <div>
                          <h3 className="font-sans font-extrabold text-white text-xs uppercase tracking-wide">
                            Flowchart Glossary
                          </h3>
                          <p className="font-sans text-[9px] text-slate-400">Interactive Logic Reference</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowGlossaryModal(false)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Close modal"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedShape === "circle" && (
                        <>
                          <h4 className="font-sans font-extrabold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500 shrink-0" />
                            Start / End Logic Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Specifies initialization of program memory boot cycle or structural cessation. Every system flow requires a clear initiator block. In standard robotics code, the **Start** correlates with starting the power rails, loading peripheral registers, and specifying input/output pin modes.
                          </p>
                          <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800/80">
                            <span className="font-mono text-[9px] text-emerald-400 uppercase font-semibold block mb-1">C++ Firmware Equivalent</span>
                            <pre className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
                              {highlightCppCodeText(`void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
}`)}
                            </pre>
                          </div>
                        </>
                      )}

                      {selectedShape === "parallelogram" && (
                        <>
                          <h4 className="font-sans font-extrabold text-sm text-pink-400 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-3 h-2.5 border border-pink-500 bg-pink-500/10 -skew-x-12 shrink-0" />
                            Input / Output Logic Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Reads digital/analog inputs from physical pins or writes commands directly to active components. Denotes data interactions. An **Input** reads raw parameters from physical pins (such as distance or pressure intensity). An **Output** changes component states by writing logical High/Low signals.
                          </p>
                          <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800/80">
                            <span className="font-mono text-[9px] text-pink-400 uppercase font-semibold block mb-1">C++ Firmware Equivalent</span>
                            <pre className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
                              {highlightCppCodeText(`// INPUT
int dryRaw = analogRead(A0);

// OUTPUT
digitalWrite(pistonPin, HIGH);`)}
                            </pre>
                          </div>
                        </>
                      )}

                      {selectedShape === "rectangle" && (
                        <>
                          <h4 className="font-sans font-extrabold text-sm text-purple-400 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-3 h-2 border border-purple-500 bg-purple-500/10 rounded shrink-0" />
                            Computation Process Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Calculates metric math, coordinates variables updates, scales levels, or triggers timers. Processes represent raw operational work. Use them to write arithmetic equations, calculate speed loops, scale sensor voltages, or wait for time delays.
                          </p>
                          <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800/80">
                            <span className="font-mono text-[9px] text-purple-400 uppercase font-semibold block mb-1">C++ Firmware Equivalent</span>
                            <pre className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
                              {highlightCppCodeText(`float dist = (pulseMs * 0.0343) / 2.0;
delay(250); // Pause execution`)}
                            </pre>
                          </div>
                        </>
                      )}

                      {selectedShape === "diamond" && (
                        <>
                          <h4 className="font-sans font-extrabold text-sm text-yellow-505 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-2.5 h-2.5 border border-yellow-500 bg-yellow-500/10 rotate-45 shrink-0" />
                            Decision Forks Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Checks boolean comparisons. Splits flow of direction based on True / False outputs. Splits flowchart into parallel executions. Compares values against conditional limits. Branching pathways must always be clearly labeled **YES (True)** or **NO (False)**.
                          </p>
                          <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800/80">
                            <span className="font-mono text-[9px] text-yellow-550 uppercase font-semibold block mb-1">C++ Firmware Equivalent</span>
                            <pre className="font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre">
                              {highlightCppCodeText(activeCase.id === "obstacle_avoidance" ? `if (distance < 15) {
  // Take YES (Blocked) branch
  steerLeft(); // Turn wheels left
} else {
  // Take NO (Clear) branch
  driveForward(); // Forward speed
}` : activeCase.id === "monitoring_system" ? `if (ambientLight < 400) {
  // Take YES (Darkness) branch
  digitalWrite(ledPin, HIGH); // LED Light ON
} else {
  // Take NO (Daylight) branch
  digitalWrite(ledPin, LOW); // LED Light OFF
}` : activeCase.id === "autonomous_robot" ? `if (isPathClear) {
  // Take YES (Clear) branch
  driveForward(); // Set cruise speed
} else {
  // Take NO (Blocked) branch
  haltAndRecalculate(); // Find new route
}` : `if (torqueLoad > 85) {
  // Take YES (Overload) branch
  digitalWrite(relayPin, LOW); // Cut relay safety power
} else {
  // Take NO (Safe) branch
  sweepServoJoint(); // Speed servo angle
}`) || ""}
                            </pre>
                          </div>
                        </>
                      )}

                      {selectedShape === "arrow" && (
                        <>
                          <h4 className="font-sans font-extrabold text-sm text-sky-400 uppercase tracking-wider flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-sky-400" />
                            Direction Pathway Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Instructs program register sequence tracking. Determines the exact chronological direction of execution. Arrows establish structural causality. They link execution nodes to guarantee that execution steps proceed. Always keep arrows pointing in clear directions with no intersection overlapping.
                          </p>
                        </>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setShowGlossaryModal(false)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer"
                      >
                        Acknowledge & Close
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>

          {/* Flowchart Control Loop Showcase Viewer */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              
              {/* COMPACT ACTIVE SYSTEM CONTROL BAR WITH SPEC CONFIGURATOR TOGGLE */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0a0f24]/50 p-4 border border-slate-900 rounded-2xl mb-1">
                <div className="text-left">
                  <span className="font-mono text-[9px] text-[#22d3ee] font-extrabold uppercase tracking-widest block">
                    ACTIVE CONTROL SCHEME
                  </span>
                  <h3 className="font-sans font-black text-slate-100 text-sm uppercase tracking-tight flex items-center gap-2 mt-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-ping inline-block" />
                    {activeCase.title}
                  </h3>
                </div>
                
                <button
                  onClick={() => setShowControlLoopModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 hover:text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-all uppercase tracking-wide shrink-0"
                >
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  Loop Specifications panel
                </button>
              </div>

              {/* Show Control Loop Selection & Hardware Specifications Modal */}
              <AnimatePresence>
                {showControlLoopModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md" id="control-loop-specs-modal">
                    <div className="absolute inset-0 cursor-pointer" onClick={() => setShowControlLoopModal(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ type: "spring", duration: 0.4 }}
                      className="relative w-full max-w-4xl max-h-[96vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-slate-700 bg-[#04091e] p-4 sm:p-6 md:p-8 shadow-2xl space-y-4 sm:space-y-6 text-left z-10"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Cpu className="w-5 h-5" />
                          </span>
                          <div>
                            <h3 className="font-sans font-black text-white text-base uppercase tracking-wide">
                              Control System Configurator
                            </h3>
                            <p className="font-sans text-[11px] text-slate-400">Select mechatronic loop, inspect firmware profiles & hardware mapping</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowControlLoopModal(false)}
                          className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Close modal"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Step 1: Selection Buttons */}
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] uppercase text-slate-500 font-extrabold tracking-widest block font-black">
                          SELECT ACTIVE CONTROL LOOP
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          {CASE_STUDIES.map((c, i) => {
                            const isSelected = selectedCaseIdx === i;
                            return (
                              <button
                                key={c.id}
                                onClick={() => {
                                  setSelectedCaseIdx(i);
                                  setActiveFlowStep(0);
                                  setSelectedShape(c.flowSteps[0].shape);
                                }}
                                className={`text-left p-3 rounded-2xl transition-all duration-300 cursor-pointer border flex flex-col justify-between h-20 ${
                                  isSelected
                                    ? "bg-indigo-500/10 border-indigo-400 text-indigo-300 ring-2 ring-indigo-505/30 shadow-[0_0_15px_rgba(99,102,241,0.25)] font-extrabold"
                                    : "border-slate-900 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-850 hover:bg-slate-900/80"
                                }`}
                              >
                                <span className="font-mono text-[9px] text-[#22d3ee] block uppercase">{c.subtitle}</span>
                                <span className="font-sans text-xs font-black uppercase tracking-tight mt-1 leading-snug line-clamp-2">
                                  {c.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step 2: System Specs Description */}
                      <div className="space-y-2 border-t border-slate-900 pt-5">
                        <label className="font-mono text-[9px] uppercase text-slate-500 font-extrabold tracking-widest block font-black">
                          SYSTEM REGISTRY & LOGIC SUMMARY
                        </label>
                        <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-905 flex flex-col lg:flex-row justify-between items-stretch gap-6">
                          <div className="space-y-1 lg:max-w-xl flex flex-col justify-between text-left">
                            <div>
                              <h4 className="font-sans text-sm font-extrabold text-indigo-300 uppercase tracking-wide">{activeCase.title}</h4>
                              <span className="font-mono text-[9px] text-slate-500 block uppercase font-bold mt-0.5">{activeCase.subtitle}</span>
                              <p className="font-sans text-xs text-slate-300 leading-relaxed pt-2.5">{activeCase.explanation}</p>
                            </div>
                          </div>

                          {/* System Registry Map */}
                          <div className="flex flex-col gap-2.5 pr-2 lg:border-l border-slate-900/60 lg:pl-6 shrink-0 text-left justify-center rounded-xl">
                            <span className="font-mono text-[9px] uppercase text-indigo-400 font-black tracking-widest">PIN ALLOCATION MAP:</span>
                            <div className="space-y-1.5 font-sans text-xs text-slate-300">
                              <span className="block flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                                Sensor [IN]: <strong className="font-bold text-sky-400">{activeCase.sensor === "ultrasonic" ? "HC-SR04 Sonar (Digital Trigger)" : activeCase.sensor === "photo_ldr" ? "GLAZED Photoresistor (Analog A0)" : activeCase.sensor === "sound_mic" ? "Decibel Mic (Analog/Digital)" : "Soil Moisture (Analog A1)"}</strong>
                              </span>
                              <span className="block flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                Controller [CPU]: <strong className="font-bold text-indigo-400">{activeCase.controller === "arduino" ? "ATmega328P Arduino (8-bit)" : "ESP32 Core OS (32-bit MCU)"}</strong>
                              </span>
                              <span className="block flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                Actuator [OUT]: <strong className="font-bold text-emerald-400">{activeCase.actuator === "motor_driver" ? "DC Motor Driver PWM Interface" : activeCase.actuator === "led" ? "High-Flux LED Board" : "SG90 PWM Miniature Servo"}</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Hardware Cards list */}
                      <div className="space-y-2 border-t border-slate-900 pt-5">
                        <label className="font-mono text-[9px] uppercase text-slate-500 font-extrabold tracking-widest block font-black">
                          ACTIVE MODULE SPECIFICATIONS
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          {/* Dynamic Sensor Module info panel */}
                          <div className="bg-[#030612] p-4 rounded-2xl border border-sky-500/10 hover:border-sky-500/25 transition-all text-left flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-bl-full pointer-events-none" />
                            <div>
                              <span className="font-mono text-[8px] text-sky-400 font-extrabold tracking-wider px-2 py-0.5 rounded bg-sky-950/50 border border-sky-500/15 uppercase">
                                [IN] SENSOR SPEC
                              </span>
                              <h5 className="font-sans font-extrabold text-[#38bdf8] text-xs mt-3.5 uppercase tracking-tight flex items-center gap-1.5 flex-wrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                {activeCase.sensor === "ultrasonic" ? "HC-SR04 Ultrasonic Sonar" : 
                                 activeCase.sensor === "photo_ldr" ? "Glazed Photoresistor" : 
                                 activeCase.sensor === "sound_mic" ? "Decibel Audio Transducer" : "Moisture Sensor Probe"}
                              </h5>
                              <p className="text-[10.5px] text-slate-400 font-sans mt-2 leading-relaxed">
                                {activeCase.sensor === "ultrasonic" 
                                  ? "Measures spatial distances between 2cm and 400cm by calculating acoustic bounce Time-of-Flight." 
                                  : "Measures ambient visual intensity by mapping photocell resistance curves into calibrated Lux."}
                              </p>
                            </div>
                            <div className="border-t border-slate-900 mt-4 pt-3 flex items-center justify-between font-mono text-[8.5px] text-slate-500">
                              <span className="font-bold">ADC: {activeCase.sensor === "ultrasonic" ? "DIGITAL PIN" : "ANALOG IN"}</span>
                              <span>STANDBY COST: &lt;15mW</span>
                            </div>
                          </div>

                          {/* Dynamic Controller MCU info panel */}
                          <div className="bg-[#030612] p-4 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/25 transition-all text-left flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
                            <div>
                              <span className="font-mono text-[8px] text-indigo-400 font-extrabold tracking-wider px-2 py-0.5 rounded bg-indigo-950/50 border border-indigo-500/15 uppercase">
                                [CPU] CONTROLLER SPEC
                              </span>
                              <h5 className="font-sans font-extrabold text-[#818cf8] text-xs mt-3.5 uppercase tracking-tight flex items-center gap-1.5 flex-wrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                {activeCase.controller === "arduino" ? "ATmega328P Arduino Uno" : "ESP-WROOM-32 Smart SoC"}
                              </h5>
                              <p className="text-[10.5px] text-slate-400 font-sans mt-2 leading-relaxed">
                                {activeCase.controller === "arduino"
                                  ? "Robust 8-bit RISC microprocessor executing deterministic control logic on bare silicon at 16 MHz."
                                  : "Advanced 240 MHz dual-core microcontroller equipped with wireless radio coils for telemetry pipelines."}
                              </p>
                            </div>
                            <div className="border-t border-slate-900 mt-4 pt-3 flex items-center justify-between font-mono text-[8.5px] text-slate-500">
                              <span className="font-bold">CLOCK: {activeCase.controller === "arduino" ? "16.0 MHz" : "240.0 MHz"}</span>
                              <span>BUS: Serial/I2C</span>
                            </div>
                          </div>

                          {/* Dynamic Actuator Module info panel */}
                          <div className="bg-[#030612] p-4 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/25 transition-all text-left flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
                            <div>
                              <span className="font-mono text-[8px] text-emerald-400 font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/15 uppercase">
                                [OUT] ACTUATOR SPEC
                              </span>
                              <h5 className="font-sans font-extrabold text-[#34d399] text-xs mt-3.5 uppercase tracking-tight flex items-center gap-1.5 flex-wrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {activeCase.actuator === "motor_driver" ? "TT-130 DC Motor Drive" : 
                                 activeCase.actuator === "led" ? "High-Flux LED Panel" : "SG90 180° Micro Servo"}
                              </h5>
                              <p className="text-[10.5px] text-slate-400 font-sans mt-2 leading-relaxed">
                                {activeCase.actuator === "motor_driver"
                                  ? "High-ratio gear motor providing continuous rotation torque to position vehicle wheel vectors."
                                  : activeCase.actuator === "led"
                                  ? "High illumination semiconductor panel designed for rapid Grow Light spectral farming applications."
                                  : "Precision joint rotator responding to incoming PWM signals to sweep degrees and hold payload positions."}
                              </p>
                            </div>
                            <div className="border-t border-slate-900 mt-4 pt-3 flex items-center justify-between font-mono text-[8.5px] text-slate-500">
                              <span className="font-bold">DRIVE: {activeCase.actuator === "led" ? "DIGITAL HIGH" : "PWM CURRENT"}</span>
                              <span>VDD: 5.0V LINK</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Apply Close Button */}
                      <div className="pt-4 border-t border-slate-900 flex justify-end">
                        <button
                          onClick={() => setShowControlLoopModal(false)}
                          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-black uppercase rounded-2xl cursor-pointer transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                        >
                          Apply & Display Flowchart
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* TWO COLUMN GRID: LOGICAL SCHEMATIC FLOWCHART ON LEFT, CYBER-PHYSICAL HARDWARE SIMULATOR ON RIGHT */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                
                {/* Left Side: Logical Flowchart SVG (6 Columns) */}
                <div className="xl:col-span-6 bg-[#020617] p-4 rounded-xl border border-slate-900 flex flex-col justify-between items-center overflow-x-auto min-h-[440px]" id="interactive-svg-flowchart">
                  <div className="w-full flex items-center justify-between border-b border-slate-900/60 pb-2 mb-2 select-none">
                    <span className="font-mono text-[8.5px] text-[#818cf8] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      Logical execution route
                    </span>
                    <span className="font-mono text-[8.5px] text-slate-600 uppercase font-bold text-shadow">
                      FLOW STATE: {activeCase.flowSteps[activeFlowStep]?.label}
                    </span>
                  </div>

                  <svg viewBox="0 0 340 400" className="w-full max-w-sm h-auto select-none font-mono text-[9.5px]">
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
                      } else if (arrow.direction === "loop-left") {
                        startX = fromNode.x;
                        startY = fromNode.y + fromNode.height / 2;
                        endX = toNode.x;
                        endY = toNode.y + toNode.height / 2;
                      } else if (arrow.direction === "loop-right") {
                        startX = fromNode.x + fromNode.width;
                        startY = fromNode.y + fromNode.height / 2;
                        endX = toNode.x + toNode.width;
                        endY = toNode.y + toNode.height / 2;
                      } else if (arrow.direction === "terminate") {
                        startX = fromNode.x + fromNode.width / 2;
                        startY = fromNode.y + fromNode.height;
                        endX = toNode.x + toNode.width / 2;
                        endY = toNode.y;
                      }

                      // Draw line paths
                      let dPath = `M ${startX} ${startY} L ${endX} ${endY}`;
                      if (arrow.direction === "left" || arrow.direction === "right") {
                        dPath = `M ${startX} ${startY} H ${endX} V ${endY}`;
                      } else if (arrow.direction === "loop-left") {
                        dPath = `M ${startX} ${startY} H 8 V ${endY} H ${endX}`;
                      } else if (arrow.direction === "loop-right") {
                        dPath = `M ${startX} ${startY} H 332 V ${endY} H ${endX}`;
                      } else if (arrow.direction === "terminate") {
                        dPath = `M ${startX} ${startY} L ${endX} ${endY}`;
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
                          {arrow.label && (() => {
                            let labelX = arrow.direction === "left" ? startX - 22 : startX + 22;
                            let labelY = startY + 15;
                            if (arrow.direction === "loop-left") {
                              labelX = 35;
                              labelY = startY - 6;
                            } else if (arrow.direction === "loop-right") {
                              labelX = 302;
                              labelY = startY + 14;
                            } else if (arrow.direction === "terminate") {
                              labelX = startX + 16;
                              labelY = startY + 22;
                            }
                            return (
                              <text
                                x={labelX}
                                y={labelY}
                                textAnchor="middle"
                                className={`font-extrabold text-[8px] font-mono ${
                                  arrow.label === "YES" || arrow.label === "RECYCLE" 
                                    ? "fill-emerald-400" 
                                    : arrow.label === "OFF" 
                                      ? "fill-slate-500" 
                                      : "fill-rose-450"
                                }`}
                              >
                                {arrow.label}
                              </text>
                            );
                          })()}
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
                        <g
                          key={idx}
                          className="cursor-pointer group select-none"
                          onClick={() => {
                            setActiveFlowStep(idx);
                            setSelectedShape(step.shape);
                            setShowGlossaryModal(true);
                            lastInteractionRef.current = Date.now();
                          }}
                        >
                          {shapeNode}
                          <text
                            x={step.x + step.width / 2}
                            y={step.y + step.height / 2 + 2}
                            textAnchor="middle"
                            className={`font-mono text-[9px] font-bold tracking-tight uppercase transition-all ${isStepCurrentlyWalkingActive ? "fill-white text-shadow animate-pulse" : "fill-slate-400 group-hover:fill-slate-200"}`}
                          >
                            {step.label}
                          </text>
                          <text
                            x={step.x + step.width / 2}
                            y={step.y + step.height / 2 + 11}
                            textAnchor="middle"
                            className={`font-sans text-[8px] opacity-75 transition-all ${isStepCurrentlyWalkingActive ? "fill-sky-300 font-bold" : "fill-slate-500 group-hover:fill-slate-400"}`}
                          >
                            {step.subtext}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Right Side: Step-by-Step Logic Telemetry Walkthrough (6 Columns) */}
                <div className="xl:col-span-6 bg-[#020614] p-5 rounded-xl border border-slate-900 flex flex-col justify-between min-h-[440px] relative overflow-hidden text-left">
                  {/* Outer mechanical mesh glow effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none" />
                  
                  {/* Top HUD status bar */}
                  <div className="relative z-10 w-full flex items-center justify-between border-b border-slate-900 pb-2.5 select-none">
                    <span className="font-mono text-[8.5px] text-[#22d3ee] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                      💻 ACTIVE STEP TELEMETRY
                    </span>
                    <span className="font-mono text-[8.5px] text-slate-500 uppercase font-extrabold">
                      REGISTER PROCESSING PROFILE
                    </span>
                  </div>

                  {/* ACTIVE LOGIC WALKTHROUGH SECTION */}
                  <div className="relative z-10 flex-1 w-full flex flex-col justify-between my-4 gap-4">
                    {(() => {
                      const currentStepNode = activeCase.flowSteps[activeFlowStep];
                      const detail = FLOW_STEP_DETAILS[currentStepNode?.label] || {
                        title: currentStepNode?.label || "Execution Step",
                        type: "Logical Operator",
                        desc: currentStepNode?.subtext || "Processing mechatronic system registers.",
                        code: "// Generic execution step\ndelay(100);",
                        signal: "Logical flow sequence steady"
                      };

                      // Map shape classes for beautiful color accents
                      const typeColors: Record<string, { bg: string; text: string; border: string }> = {
                        "Initialization Process": { bg: "bg-indigo-950/40", text: "text-indigo-400", border: "border-indigo-500/15" },
                        "Input Acquisition": { bg: "bg-sky-950/40", text: "text-sky-400", border: "border-sky-500/15" },
                        "Process Computation": { bg: "bg-purple-950/40", text: "text-purple-400", border: "border-purple-500/15" },
                        "Decision Evaluation": { bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-500/15" },
                        "Output Actuation": { bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-500/15" },
                        "Sequence Termination": { bg: "bg-rose-950/40", text: "text-rose-400", border: "border-rose-500/15" }
                      };

                      const col = typeColors[detail.type] || { bg: "bg-slate-900/30", text: "text-slate-400", border: "border-slate-800" };

                      return (
                        <div className="flex-1 flex flex-col justify-between gap-4 h-full">
                          {/* Node Type & Header Block */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`font-mono text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${col.bg} ${col.text} ${col.border}`}>
                                {detail.type}
                              </span>
                              <span className="font-mono text-[8.5px] text-slate-600 font-bold uppercase">
                                Node: {currentStepNode?.shape?.toUpperCase() || "SHAPE"}
                              </span>
                            </div>
                            
                            <h4 className="font-sans font-extrabold text-slate-100 text-sm uppercase tracking-tight">
                              {currentStepNode?.label}: {detail.title}
                            </h4>
                            
                            <p className="font-sans text-xs text-slate-300 leading-relaxed pt-1 select-text">
                              {detail.desc}
                            </p>
                          </div>

                          {/* Code Chunk Block */}
                          <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                            <div className="flex items-center gap-1">
                              <Code2 className="w-3 h-3 text-indigo-400" />
                              <span className="font-mono text-[8px] text-indigo-400 font-extrabold uppercase tracking-wider">MICROCHIP FIRMWARE CODE:</span>
                            </div>
                            
                            <div className="relative p-3 bg-slate-950/90 rounded-lg border border-slate-900/80 font-mono text-[10.5px] text-slate-300 leading-relaxed overflow-x-auto max-h-[140px] select-text">
                              <pre className="m-0 font-mono leading-normal whitespace-pre">
                                {highlightCppCodeText(detail.code)}
                              </pre>
                            </div>
                          </div>

                          {/* Electrical physical signal */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded-lg border border-slate-900/40 font-mono text-[8.5px]">
                            <div>
                              <span className="text-slate-500 block text-[7.5px] uppercase">Bus Register</span>
                              <span className="font-extrabold text-[#22d3ee] truncate block">UART_TX RX_RDY</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[7.5px] uppercase">I/O Electrical Signal</span>
                              <span className="font-extrabold text-[#34d399] truncate block">{detail.signal}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>

              {/* Instructions on how to parse flowchart */}
              <div className="p-3.5 bg-[#030712] border border-slate-900 rounded-xl flex items-center gap-3.5">
                <div className="w-8 h-8 rounded bg-sky-505/10 border border-sky-505/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-sky-400" />
                </div>
                <p className="font-sans text-xs text-slate-400 leading-normal">
                  <strong className="text-white">Interactive Flowchart Explorer:</strong> Click any node block in the schematic above to select it, triggering custom overlays and synchronizing its specific definition in the glossary on the left!
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

              <div className="space-y-3 pt-2 border-t border-slate-900">
                {([
                  { id: "ohms", label: "Ohm's Law (V = I * R)", desc: "Interact with Voltage, Resistance, and Amperage limits", icon: Sliders },
                  { id: "circuits", label: "Circuits (Series vs Parallel)", desc: "Build connections and break wire routes to see behaviors", icon: Layers },
                  { id: "signals", label: "Signals (Analog vs Digital)", desc: "Compare smooth voltage waves with high/low step functions", icon: Activity },
                  { id: "binary", label: "Binary & Logic Gates", desc: "Toggle bits to count in binary & trigger logical gates", icon: Cpu }
                ] as const).map((sub) => {
                  const isCur = activeElectSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveElectSubTab(sub.id);
                        if (isMobileScreen) {
                          setTimeout(() => {
                            const target = document.getElementById("electronics-simulation-deck");
                            if (target) {
                              target.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }, 120);
                        }
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer flex gap-4 items-center relative overflow-hidden group ${
                        isCur 
                          ? "border-emerald-500 bg-emerald-500/[0.06] shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/40 hover:shadow-inner"
                      }`}
                    >
                      {isCur && (
                        <div className="absolute top-0 right-0 bg-emerald-500/15 border-l border-b border-emerald-500/20 text-emerald-400 font-mono text-[7px] uppercase tracking-wide px-2 py-0.5 rounded-bl font-extrabold select-none">
                          Active Workstation
                        </div>
                      )}
                      <div className={`p-2 rounded-lg transition-colors ${
                        isCur ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-900 text-slate-500 group-hover:text-slate-300"
                      }`}>
                        <sub.icon className="w-4.5 h-4.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div>
                        <h4 className={`font-sans font-extrabold text-xs transition-colors ${isCur ? "text-white" : "text-slate-200 group-hover:text-white"}`}>{sub.label}</h4>
                        <p className={`font-sans text-[10px] leading-tight transition-colors ${isCur ? "text-slate-300" : "text-slate-400 group-hover:text-slate-300"}`}>{sub.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Core interactive animations panel on right */}
          <div className="lg:col-span-8 flex flex-col gap-4" id="electronics-simulation-deck">
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
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                            Ohm's Law interactive workshop
                          </h4>
                          <button
                            onClick={() => setIsOhmsModalOpen(true)}
                            className="text-xs bg-emerald-500/15 text-emerald-405 text-emerald-450 border border-emerald-505/20 px-2 py-0.5 rounded cursor-pointer font-bold hover:bg-emerald-500/25 transition-all text-[10px]"
                          >
                            Interactive Lab Sandbox
                          </button>
                        </div>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Vary Voltage (push strength) and Resistance (friction) to control current electron flow rates:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-emerald-505/10 text-emerald-400 border border-emerald-505/25 px-2 py-0.5 rounded font-extrabold uppercase shrink-0 self-start md:self-center">
                        V = I * R
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left font-sans items-stretch">
                      {/* Left: Input Controls columns (ordered 2nd on mobile) */}
                      <div className="lg:col-span-5 flex flex-col gap-4 order-2 lg:order-1 lg:justify-between">
                        {/* 1. Input Controls */}
                        <div className="space-y-4 bg-slate-900/25 p-4 rounded-xl border border-slate-900 flex flex-col justify-center">
                          {/* 1. Voltage slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-sans">
                              <span className="text-slate-300 font-bold">1. Input Voltage (Battery Strength):</span>
                              <span className="font-mono text-indigo-400 font-extrabold">{ohmsVoltage.toFixed(1)} V</span>
                            </div>
                            <input 
                              type="range" 
                              min="1.0" 
                              max="12.0" 
                              step="0.5"
                              value={ohmsVoltage}
                              onChange={(e) => setOhmsVoltage(parseFloat(e.target.value))}
                              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                            />
                            <div className="flex justify-between font-mono text-[8px] text-slate-500">
                              <span>1.0 V (Weak)</span>
                              <span>6.0 V</span>
                              <span>12.0 V (Strong)</span>
                            </div>
                          </div>

                          {/* 2. Resistance slider */}
                          <div className="space-y-1.5 pt-3 border-t border-slate-900/40">
                            <div className="flex justify-between text-xs font-sans">
                              <span className="text-slate-300 font-bold">2. Pathway Resistance (Ohm barrier):</span>
                              <span className="font-mono text-emerald-400 font-extrabold">{ohmsResistance} Ω</span>
                            </div>
                            <input 
                              type="range" 
                              min="100" 
                              max="1000" 
                              step="20"
                              value={ohmsResistance}
                              onChange={(e) => setOhmsResistance(parseInt(e.target.value))}
                              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                            />
                            <div className="flex justify-between font-mono text-[8px] text-slate-500">
                              <span>100 Ω (Wide Open)</span>
                              <span>500 Ω</span>
                              <span>1000 Ω (Squeezed-Dense)</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Decoded Mathematical HUD */}
                        <div className="bg-[#030712] p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-2">
                          <div className="flex justify-between items-center text-xs border-b border-slate-900/60 pb-1.5">
                            <span className="font-mono text-[9px] text-slate-400 font-black uppercase">Ohmic Physics (V = I * R)</span>
                            <span className="font-mono text-[8px] text-indigo-400 bg-indigo-950/40 border border-indigo-900/25 px-1.5 py-0.5 rounded font-bold">I = V / R</span>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1.5">
                            <div className="space-y-0.5">
                              <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase">Current formulation:</span>
                              <div className="text-slate-100 font-sans text-xs font-semibold">
                                I = <span className="text-indigo-400 font-bold">{ohmsVoltage.toFixed(1)}V</span> / <span className="text-emerald-400 font-bold">{ohmsResistance}Ω</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                              <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase">Resultant Current:</span>
                              <span className={`font-mono text-base md:text-lg font-black transition-all ${isPinBlown ? "text-rose-455 text-rose-450 text-rose-400 animate-pulse" : "text-[#10b981]"}`}>
                                {currentMilliamps.toFixed(1)} mA
                              </span>
                            </div>
                          </div>

                          <p className="font-sans text-[10px] leading-tight text-slate-400 border-t border-slate-900 pt-2">
                            {isPinBlown 
                              ? "Excessive flow! The current exceeds standard continuous pin logic-ports. Increase resistance to choke electron overload." 
                              : "Operational! The current is safely under the maximum continuous Arduino GPIO pin parameter of 40 mA."}
                          </p>
                        </div>
                      </div>

                      {/* Right: Live Animation Loop View (ordered 1st on mobile so it is visible immediately while adjusting) */}
                      <div className="lg:col-span-7 space-y-2 order-1 lg:order-2 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">Tightening/Loosening Resistor Clamp Simulation:</span>
                          <span className={`font-mono text-[9px] px-2 py-0.5 rounded border uppercase transition-all ${
                            isPinBlown 
                              ? "bg-rose-950/20 border-rose-500/30 text-rose-400 animate-pulse font-bold" 
                              : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 font-bold"
                          }`}>
                            {isPinBlown ? "WARNING: PIN BLOWN!" : "STATUS: STEADY & SAFE"}
                          </span>
                        </div>
                        
                        <div className="rounded-2xl border border-slate-900 bg-[#020614] p-3 md:p-6 flex flex-col items-center justify-center space-y-2 select-none h-44 sm:h-52 md:h-64 lg:h-72 relative overflow-hidden shadow-[inset_0_0_30px_rgba(15,23,42,0.8)]">
                          {/* Animated particle wire line loop (scaled wide and high) */}
                          <svg viewBox="0 0 220 120" className="w-full h-full overflow-visible select-none">
                            <rect 
                              x="10" 
                              y="10" 
                              width="200" 
                              height="80" 
                              rx="10" 
                              fill="none" 
                              stroke={isPinBlown ? "#f43f5e" : "#1e293b"} 
                              strokeWidth={isPinBlown ? "3.5" : "2.5"} 
                              className={`transition-colors duration-200 ${isPinBlown ? "animate-pulse" : ""}`}
                            />

                            {/* Solid flowing path with dynamic solid particles (no broken lines) */}
                            {/* Pre-resistor segment: battery positive terminal (x=10, y=31) up to resistor entrance (x=90) */}
                            <path
                              d="M 10 31 V 20 A 10 10 0 0 1 20 10 H 90"
                              fill="none"
                              stroke={isPinBlown ? "#f43f5e" : "#10b981"}
                              strokeWidth="5.0"
                              style={{
                                transition: "stroke 0.3s ease",
                                opacity: 0.75,
                                animation: "glowingPulse 1.5s ease-in-out infinite alternate"
                              }}
                            />

                            {/* Post-resistor segment: starting from inside resistor all the way back to battery negative */}
                            <path
                              d="M 90 10 H 200 A 10 10 0 0 1 210 20 V 80 A 10 10 0 0 1 200 90 H 20 A 10 10 0 0 1 10 80 V 66"
                              fill="none"
                              stroke={isPinBlown ? "#f43f5e" : "#10b981"}
                              strokeWidth={ohmsFlowThickness}
                              style={{
                                transition: "stroke-width 0.3s ease, stroke 0.3s ease",
                                opacity: 0.75,
                                animation: "glowingPulse 1.5s ease-in-out infinite alternate"
                              }}
                            />

                            {/* Solid circular electron particles flowing along the custom conventional path */}
                            {!isPinBlown && [0, 0.2, 0.4, 0.6, 0.8].map((offset, i) => (
                              <circle 
                                key={i} 
                                r={Math.min(3.8, Math.max(1.8, ohmsFlowThickness / 2 + 0.4))} 
                                fill="#22c55e"
                              >
                                <animateMotion
                                  path="M 10 31 V 20 A 10 10 0 0 1 20 10 H 200 A 10 10 0 0 1 210 20 V 80 A 10 10 0 0 1 200 90 H 20 A 10 10 0 0 1 10 80 V 66"
                                  dur={`${Math.max(0.12, 1.8 / Math.max(0.12, currentAmps * 35))}s`}
                                  begin={`${offset * Math.max(0.12, 1.8 / Math.max(0.12, currentAmps * 35))}s`}
                                  repeatCount="indefinite"
                                />
                              </circle>
                            ))}

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
                            </g>

                            {/* Improved Tightening & Loosening Resistor Clamp device */}
                            <g>
                              {/* Left and Right connector metal lines */}
                              <line x1="82" y1="10" x2="90" y2="10" stroke="#94a3b8" strokeWidth="1.5" />
                              <line x1="130" y1="10" x2="138" y2="10" stroke="#94a3b8" strokeWidth="1.5" />

                              {/* Outer rigid support guide frame */}
                              <rect x="88" y="0" width="44" height="20" rx="3.5" fill="none" stroke="#475569" strokeWidth="1.0" strokeDasharray="3 2" opacity="0.6" />

                              {/* Flexible conductive channel (crimped by the clamps) */}
                              <path
                                d={`M 90,3 
                                    Q 110,${3 + 5.5 * ohmsConstrictionFactor} 130,3 
                                    L 130,17 
                                    Q 110,${17 - 5.5 * ohmsConstrictionFactor} 90,17 
                                    Z`}
                                fill="rgba(34, 197, 94, 0.08)"
                                stroke="#10b981"
                                strokeWidth="0.8"
                                className="transition-all duration-300"
                              />

                              {/* Active Mechanical Clamp Jaws: Tighten (move in) for high resistance, loosen (retract) for low resistance */}
                              {/* Top Squeeze Jaw block */}
                              <g style={{ transform: `translateY(${5.5 * ohmsConstrictionFactor}px)`, transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)" }}>
                                <rect x="100" y="-1" width="20" height="4.5" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
                                {/* Clamp teeth/grooves */}
                                <line x1="104" y1="3" x2="104" y2="4.5" stroke="#78350f" strokeWidth="0.5" />
                                <line x1="110" y1="3" x2="110" y2="4.5" stroke="#78350f" strokeWidth="0.5" />
                                <line x1="116" y1="3" x2="116" y2="4.5" stroke="#78350f" strokeWidth="0.5" />
                                {/* Force direction down arrow */}
                                <path d="M 108,-3 L 110,-1 L 112,-3" fill="none" stroke="#f59e0b" strokeWidth="0.6" opacity={ohmsConstrictionFactor > 0.1 ? 0.9 : 0.2} />
                              </g>

                              {/* Bottom Squeeze Jaw block */}
                              <g style={{ transform: `translateY(${-5.5 * ohmsConstrictionFactor}px)`, transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)" }}>
                                <rect x="100" y="16.5" width="20" height="4.5" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
                                {/* Clamp teeth/grooves */}
                                <line x1="104" y1="16.5" x2="104" y2="17" stroke="#78350f" strokeWidth="0.5" />
                                <line x1="110" y1="16.5" x2="110" y2="17" stroke="#78350f" strokeWidth="0.5" />
                                <line x1="116" y1="16.5" x2="116" y2="17" stroke="#78350f" strokeWidth="0.5" />
                                {/* Force direction up arrow */}
                                <path d="M 108,23 L 110,21 L 112,23" fill="none" stroke="#f59e0b" strokeWidth="0.6" opacity={ohmsConstrictionFactor > 0.1 ? 0.9 : 0.2} />
                              </g>
                            </g>

                            {/* Live floating label indicators for Voltage, Resistance, and Current */}
                            <g>
                              {/* 1. Voltage indicator near Battery on left */}
                              <line x1="17" y1="50" x2="28" y2="50" stroke="#818cf8" strokeWidth="0.8" strokeOpacity="0.7" />
                              <rect x="28" y="38" width="48" height="24" rx="3" fill="#030712" fillOpacity="0.95" stroke="#4f46e5" strokeOpacity="0.5" strokeWidth="0.5" />
                              <text x="32" y="47" className="fill-indigo-400 font-mono text-[5.5px] font-extrabold uppercase">VOLTAGE (V)</text>
                              <text x="32" y="56" className="fill-white font-mono text-[8px] font-black">{ohmsVoltage.toFixed(1)}V</text>

                              {/* 2. Resistance indicator below clamp */}
                              <rect x="86" y="27" width="48" height="24" rx="3" fill="#030712" fillOpacity="0.95" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="0.5" />
                              <text x="110" y="36" textAnchor="middle" className="fill-amber-400 font-mono text-[5.5px] font-extrabold uppercase">RESISTANCE (R)</text>
                              <text x="110" y="45" textAnchor="middle" className="fill-white font-mono text-[8px] font-black">{ohmsResistance} Ω</text>

                              {/* 3. Current indicator at the bottom flow wire segment */}
                              <rect x="83" y="96" width="54" height="22" rx="3" fill="#030712" fillOpacity="0.95" stroke="#10b981" strokeOpacity="0.5" strokeWidth="0.5" />
                              <text x="110" y="104" textAnchor="middle" className="fill-emerald-400 font-mono text-[5.5px] font-extrabold uppercase">CURRENT (I)</text>
                              <text x="110" y="113" textAnchor="middle" className="fill-white font-mono text-[7.5px] font-black">{currentMilliamps.toFixed(1)} mA</text>
                            </g>
                          </svg>

                          <style>{`
                            @keyframes glowingPulse {
                              0% { opacity: 0.55; }
                              100% { opacity: 0.95; }
                            }
                          `}</style>
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
                          Series vs Parallel Connections
                        </h4>
                        <p className="font-sans text-[11px] text-slate-500 leading-tight">Click on the switch nodes to cut (break) the cables and compare current behaviors:</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setIsCombinedCircuitModalOpen(true)}
                          className="px-3 py-1.5 text-[10px] font-mono border border-indigo-500 bg-indigo-950/40 text-indigo-300 rounded-lg hover:bg-indigo-500/15 hover:border-indigo-400 hover:text-indigo-100 hover:scale-[1.03] active:scale-95 duration-150 transition-all font-black uppercase cursor-pointer flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Explore Combined Circuit Sandbox
                        </button>
                        <span className="font-mono text-[9px] bg-sky-505/10 text-sky-400 border border-sky-505/25 px-2 py-0.5 rounded font-extrabold uppercase">
                          CIRCUIT TOPOLOGY
                        </span>
                      </div>
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

                             {/* Flowing electrons when closed - no dashed line/broken line representation */}
                             {!isSeriesCut && (
                               <>
                                 <rect
                                   x="15"
                                   y="15"
                                   width="190"
                                   height="70"
                                   rx="3"
                                   fill="none"
                                   stroke="#10b981"
                                   strokeWidth="2.5"
                                   style={{
                                     opacity: 0.75,
                                     animation: "glowingPulse 1.5s ease-in-out infinite alternate"
                                   }}
                                 />
                                 {/* 4 solid green electron particles flowing along the path */}
                                 {[0, 0.25, 0.5, 0.75].map((offset, i) => (
                                   <circle key={i} r="2.2" fill="#34d399">
                                     <animateMotion
                                       path="M 15 55 V 15 H 205 V 85 H 15 Z"
                                       dur="3s"
                                       begin={`${offset * 3}s`}
                                       repeatCount="indefinite"
                                     />
                                   </circle>
                                 ))}
                               </>
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
                              <line x1="62" y1="82" x2="68" y2="88" stroke={!isSeriesCut ? "#78350f" : "#475569"} strokeWidth="0.8" />
                              <line x1="68" y1="82" x2="62" y2="88" stroke={!isSeriesCut ? "#78350f" : "#475569"} strokeWidth="0.8" />
                              <text x="65" y="101" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">LED-1</text>
                            </g>

                            {/* LED-02 at x=145, y=85 */}
                            <g>
                              {!isSeriesCut && (
                                <circle cx="145" cy="85" r="11" fill="rgba(245, 158, 11, 0.2)" className="animate-pulse" />
                              )}
                              <circle cx="145" cy="85" r="6.5" fill={!isSeriesCut ? "#fbbf24" : "#1e293b"} stroke={!isSeriesCut ? "#f59e0b" : "#475569"} strokeWidth="1" />
                              <line x1="142" y1="82" x2="148" y2="88" stroke={!isSeriesCut ? "#78350f" : "#475569"} strokeWidth="0.8" />
                              <line x1="148" y1="82" x2="142" y2="88" stroke={!isSeriesCut ? "#78350f" : "#475569"} strokeWidth="0.8" />
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
                              {isSeriesCut ? "ATTACH WIRE LINK" : "DISCONNECT WIRE"}
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

                            {/* Active solid flowing path and dot electrons for Branch 1 */}
                            {!isParallel1Cut && (
                              <>
                                <path
                                  d="M 20 55 V 15 H 100 V 95 H 20 Z"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2.5"
                                  style={{
                                    opacity: 0.7,
                                    animation: "glowingPulse 1.5s ease-in-out infinite alternate"
                                  }}
                                />
                                {[0, 0.33, 0.67].map((offset, i) => (
                                  <circle key={`p1-${i}`} r="2" fill="#34d399">
                                    <animateMotion
                                      path="M 20 55 V 15 H 100 V 95 H 20 Z"
                                      dur="2.5s"
                                      begin={`${offset * 2.5}s`}
                                      repeatCount="indefinite"
                                    />
                                  </circle>
                                ))}
                              </>
                            )}

                            {/* Active solid flowing path and dot electrons for Branch 2 */}
                            {!isParallel2Cut && (
                              <>
                                <path
                                  d="M 20 55 V 15 H 170 V 95 H 20 Z"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2.5"
                                  style={{
                                    opacity: 0.7,
                                    animation: "glowingPulse 1.5s ease-in-out infinite alternate"
                                  }}
                                />
                                {[0.15, 0.48, 0.81].map((offset, i) => (
                                  <circle key={`p2-${i}`} r="2" fill="#34d399">
                                    <animateMotion
                                      path="M 20 55 V 15 H 170 V 95 H 20 Z"
                                      dur="3.2s"
                                      begin={`${offset * 3.2}s`}
                                      repeatCount="indefinite"
                                    />
                                  </circle>
                                ))}
                              </>
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
                              <line x1="97" y1="67" x2="103" y2="73" stroke={!isParallel1Cut ? "#064e3b" : "#475569"} strokeWidth="0.8" />
                              <line x1="103" y1="67" x2="97" y2="73" stroke={!isParallel1Cut ? "#064e3b" : "#475569"} strokeWidth="0.8" />
                              <text x="108" y="72" textAnchor="start" className="fill-slate-500 font-mono text-[6px]">LED-A</text>
                            </g>

                            {/* LED-B on Branch 2 at x=170, y=70 */}
                            <g>
                              {!isParallel2Cut && (
                                <circle cx="170" cy="70" r="11" fill="rgba(16, 185, 129, 0.2)" className="animate-pulse" />
                              )}
                              <circle cx="170" cy="70" r="6.5" fill={!isParallel2Cut ? "#34d399" : "#1e293b"} stroke={!isParallel2Cut ? "#10b981" : "#475569"} strokeWidth="1" />
                              <line x1="167" y1="67" x2="173" y2="73" stroke={!isParallel2Cut ? "#064e3b" : "#475569"} strokeWidth="0.8" />
                              <line x1="173" y1="67" x2="167" y2="73" stroke={!isParallel2Cut ? "#064e3b" : "#475569"} strokeWidth="0.8" />
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

                {activeElectSubTab === "signals" && (
                  <motion.div
                    key="signals"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left font-sans"
                  >
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          Signals Subsystem Workshop
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <button
                            onClick={() => setSignalMode("oscilloscope")}
                            type="button"
                            className="px-2.5 py-1 text-[10px] font-mono border border-indigo-500/50 bg-[#110f2c] text-[#818cf8] rounded transition-all font-black uppercase cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                            • Oscilloscope Monitor
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          onClick={() => setIsAdcSandboxModalOpen(true)}
                          type="button"
                          className="px-3 py-1.5 text-[10px] font-mono border border-purple-500/50 bg-[#120624] text-[#d8b4fe] hover:text-white hover:bg-purple-950/60 rounded-lg transition-all font-bold cursor-pointer uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:scale-[1.03]"
                        >
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                          Analog to Digital Sandbox
                        </button>
                        <span className="font-mono text-[9px] bg-purple-500/10 text-[#c084fc] border border-purple-500/25 px-2 py-0.5 rounded font-extrabold uppercase animate-pulse self-start sm:self-center">
                          WAVEFORM ANALYZER
                        </span>
                      </div>
                    </div>

                    {/* Classic Oscilloscope Wave View */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left Workspace Controllers */}
                        <div className="space-y-4 bg-slate-900/10 p-4 rounded-xl border border-slate-900">
                          {/* Signal Type Selector Buttons */}
                          <div className="space-y-2">
                            <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase font-bold">Choose Signal Waveform:</span>
                            <div className="grid grid-cols-2 gap-2">
                              {(["sine", "square"] as const).map((t) => {
                                const active = signalType === t;
                                return (
                                  <button
                                    key={t}
                                    onClick={() => setSignalType(t)}
                                    type="button"
                                    className={`px-2 py-2 font-mono text-[9px] border transition-all rounded-lg font-bold cursor-pointer uppercase text-center ${
                                      active
                                        ? "bg-purple-950/20 border-purple-500 text-purple-400"
                                        : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                                    }`}
                                  >
                                    {t === "sine" ? "Sine (Analog)" : "Square (Digital)"}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Amplitude Slider */}
                          <div className="space-y-1.5 pt-3 border-t border-slate-900/60">
                            <div className="flex justify-between text-xs font-sans">
                              <span className="text-slate-300 font-bold">Signal Amplitude (Voltage Height):</span>
                              <span className="font-mono text-[#a855f7] font-extrabold">{signalAmplitude.toFixed(1)} V</span>
                            </div>
                            <input 
                              type="range" 
                              min="1.0" 
                              max="5.0" 
                              step="0.5"
                              value={signalAmplitude}
                              onChange={(e) => setSignalAmplitude(parseFloat(e.target.value))}
                              className="w-full accent-purple-500 cursor-pointer"
                            />
                          </div>

                          {/* Frequency Slider */}
                          <div className="space-y-1.5 pt-3 border-t border-slate-900/60">
                            <div className="flex justify-between text-xs font-sans">
                              <span className="text-slate-300 font-bold">Signal Frequency (Hz Cycle rate):</span>
                              <span className="font-mono text-[#a855f7] font-extrabold">{signalFrequency} Hz</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="5" 
                              step="1"
                              value={signalFrequency}
                              onChange={(e) => setSignalFrequency(parseInt(e.target.value))}
                              className="w-full accent-purple-500 cursor-pointer"
                            />
                          </div>

                          {/* Noise Toggle Switch */}
                          <div className="flex justify-between items-center bg-[#070b13] p-2 rounded-lg border border-slate-900">
                            <div>
                              <span className="font-sans text-xs text-slate-300 font-bold block">Inject Thermal/RF Interference:</span>
                              <span className="font-sans text-[10px] text-slate-500">Adds background environmental noise ripples.</span>
                            </div>
                            <button
                              onClick={() => setSignalNoise(!signalNoise)}
                              className={`px-3 py-1 rounded font-mono text-[8.5px] font-bold border cursor-pointer transition-all ${
                                signalNoise 
                                  ? "bg-red-950/20 border-red-900 text-red-100" 
                                  : "bg-slate-900 border-slate-800 text-slate-500"
                              }`}
                            >
                              {signalNoise ? "NOISE ACTIVE" : "CLEAN SIGNAL"}
                            </button>
                          </div>

                           {/* Educational Note */}
                           <div className="p-3 bg-purple-950/5 border border-purple-900/10 rounded-lg text-[10.5px] leading-relaxed text-slate-400 font-sans">
                             {signalType === "square" ? (
                               <p>
                                 <strong className="text-purple-400">Digital high/low states:</strong> Microcontrollers operate on 1s and 0s. A 5V signal registers as index 1 (HIGH) and 0V registers as 0 (LOW). This binary limit makes communication extremely resilient against background RF noise!
                               </p>
                             ) : (
                               <div className="space-y-2.5">
                                 <p>
                                   <strong className="text-purple-400">Analog continuous measurements:</strong> Sensors like microphones or temperature probes scale voltages smoothly. Microcontrollers use an internal <strong>ADC (Analog to Digital Converter)</strong>, cutting the voltage range into 1024 distinct staircase levels (10-bit resolution).
                                 </p>
                               </div>
                             )}
                           </div>
                        </div>

                        {/* Right Oscilloscope Visualization Panel */}
                        <div className="rounded-xl border border-slate-900 bg-[#030712] p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                            <span className="font-mono text-[9px] text-[#c084fc] font-extrabold tracking-widest uppercase">OSCILLOSCOPE CH-A VIEW</span>
                            <span className="text-[9.5px] bg-[#1e293b]/50 text-slate-300 px-2.5 py-0.5 rounded font-mono">
                              LEVEL: {signalType === "square" ? "5.0V Logic" : "Smooth Wave"}
                            </span>
                          </div>

                          {/* Graphic Wave Canvas */}
                          <div className="h-44 bg-slate-950 border border-slate-900/80 rounded-xl relative p-2 overflow-hidden flex flex-col justify-end">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

                            <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                              {/* Reference Gridlines */}
                              <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" />
                              <line x1="0" y1="20" x2="400" y2="20" stroke="#1e293b" strokeWidth="0.5" />
                              <line x1="0" y1="140" x2="400" y2="140" stroke="#1e293b" strokeWidth="0.5" />

                              {/* Live Wave Line */}
                              {(() => {
                                let pathD = "";
                                const width = 400;
                                const pointsCount = 100;
                                const phase = (simTick * 0.12);
                                
                                for (let i = 0; i <= pointsCount; i++) {
                                  const x = (i / pointsCount) * width;
                                  let rawY = 0;
                                  
                                  const angle = (i / pointsCount) * Math.PI * 2 * signalFrequency - phase;
                                  if (signalType === "sine") {
                                    rawY = Math.sin(angle);
                                  } else {
                                    rawY = Math.sin(angle) >= 0 ? 1 : -1;
                                  }
                                  
                                  const ampScale = (signalAmplitude / 5.0) * 55;
                                  let computedY = 80 - rawY * ampScale;
                                  
                                  if (signalNoise) {
                                    const noiseRipple = Math.sin(i * 1.5 + phase * 4) * 4 + (Math.random() - 0.5) * 3;
                                    computedY += noiseRipple;
                                  }
                                  
                                  const y = Math.max(5, Math.min(155, computedY));
                                  
                                  if (i === 0) pathD += `M ${x},${y}`;
                                  else pathD += ` L ${x},${y}`;
                                }
                                
                                return (
                                  <path 
                                    d={pathD} 
                                    fill="none" 
                                    stroke={signalType === "square" ? "#a855f7" : "#c084fc"} 
                                    strokeWidth="2.2" 
                                    className="transition-colors duration-200" 
                                  />
                                );
                              })()}
                            </svg>

                            <div className="absolute top-2 left-2 text-[7px] font-mono text-purple-400 select-none bg-black/60 px-1 py-0.5 rounded">
                              CH-A: {signalAmplitude.toFixed(1)}V peak-to-peak
                            </div>
                            
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between font-mono text-[7px] text-slate-500 uppercase select-none">
                              <span>Time buffer -1.2s</span>
                              <span>LIVE FEEDBACK</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-center font-mono text-[9px]">
                            <span className="text-slate-400 font-extrabold block uppercase tracking-wider">MEASUREMENT REGISTER</span>
                            <div className="grid grid-cols-2 gap-2 text-white">
                              <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                                <span className="text-slate-500 text-[7px] block">VOLTS HIGH TRACE</span>
                                <span className="text-[#34d399] font-black">{(signalAmplitude).toFixed(1)} V</span>
                              </div>
                              <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                                <span className="text-slate-500 text-[7px] block">VOLTS LOW TRACE</span>
                                <span className="text-rose-400 font-black">{signalType === "square" ? "0.0 V" : `-${(signalAmplitude).toFixed(1)} V`}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}

                {activeElectSubTab === "binary" && (
                  <motion.div
                    key="binary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left font-sans"
                  >
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          Binary & Logic Circuits
                        </h4>
                        <p className="font-sans text-[11px] text-slate-550 text-slate-400 leading-tight">Interact with elementary boolean inputs to construct truth gates and calculate nibble numbers:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/25 px-2 py-0.5 rounded font-extrabold uppercase">
                        DIGITAL ARCHITECTURE
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left column: 4-Bit counting register (Now Station A) */}
                      <div className="rounded-xl border border-slate-900 bg-[#030712] p-4 flex flex-col justify-between space-y-3 relative">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="font-mono text-[9px] text-[#22d3ee] font-extrabold tracking-widest uppercase">STATION A: 4-BIT BINARY REGISTER</span>
                          <div className="flex gap-1.5 font-mono">
                            <button
                              onClick={() => {
                                let count = 0;
                                const timerRef = setInterval(() => {
                                  setBinaryBits([
                                    (count & 8) !== 0,
                                    (count & 4) !== 0,
                                    (count & 2) !== 0,
                                    (count & 1) !== 0,
                                  ]);
                                  count++;
                                  if (count > 15) {
                                    clearInterval(timerRef);
                                  }
                                }, 400);
                              }}
                              className="font-mono text-[7px] uppercase font-black text-sky-400 bg-sky-950/20 px-2 py-0.5 border border-sky-900/50 rounded hover:border-sky-500 hover:bg-sky-550/20 transition-all hover:scale-105 active:scale-95 duration-150 cursor-pointer font-bold"
                            >
                              AUTO-COUNT
                            </button>
                            <button
                              onClick={() => {
                                setBinaryBits([false, false, false, false]);
                              }}
                              className="font-mono text-[7px] uppercase font-black text-rose-400 bg-rose-950/20 px-2 py-0.5 border border-rose-900/50 rounded hover:border-rose-500 hover:bg-rose-550/20 transition-all hover:scale-105 active:scale-95 duration-150 cursor-pointer font-bold"
                            >
                              RESET
                            </button>
                          </div>
                        </div>
                        {/* Glowing Pure Binary Word Display (Syncs with toggled bits below) */}
                        <div className="bg-[#02050b] border border-cyan-500/20 rounded-xl p-3.5 my-1.5 flex flex-col items-center justify-center select-none shadow-[inset_0_0_20px_rgba(34,211,238,0.03),0_0_15px_rgba(0,0,0,0.5)]">
                          <span className="font-mono text-[7px] text-cyan-500 font-extrabold uppercase tracking-widest mb-2">
                            ACTIVE BINARY REGISTER WORD (BASE-2)
                          </span>
                          
                          <div className="flex items-center justify-center gap-3">
                            {binaryBits.map((bVal, idx) => {
                              const bitChar = bVal ? "1" : "0";
                              return (
                                <div
                                  key={idx}
                                  className={`font-mono text-3xl sm:text-4xl font-extrabold w-11 h-14 sm:w-12 sm:h-16 flex items-center justify-center rounded-lg border transition-all duration-300 ${
                                    bVal
                                      ? "bg-[#092936] border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4),inset_0_0_8px_rgba(34,211,238,0.2)]"
                                      : "bg-[#04070d] border-slate-900 text-slate-800 shadow-[inset_0_0_6px_rgba(0,0,0,0.5)]"
                                  }`}
                                  style={{
                                    textShadow: bVal ? "0 0 10px #22d3ee, 0 0 20px rgba(34, 211, 238, 0.45)" : "none",
                                  }}
                                >
                                  {bitChar}
                                </div>
                              );
                            })}
                          </div>
                      
                          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:gap-4 font-mono text-[9px] bg-slate-950/80 px-4 py-2.5 rounded-lg border border-slate-900/60 select-none shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] w-full">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 font-extrabold uppercase">DECIMAL:</span>
                              <span className="text-cyan-400 font-black text-xs font-mono">{binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0)}₁₀</span>
                            </div>
                            <span className="text-slate-800 font-bold">|</span>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 font-extrabold uppercase">OCTAL:</span>
                              <span className="text-amber-400 font-black text-xs font-mono">{binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0).toString(8)}₈</span>
                            </div>
                            <span className="text-slate-800 font-bold">|</span>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500 font-extrabold uppercase">HEXADECIMAL:</span>
                              <span className="text-purple-400 font-black text-xs font-mono">0x{binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0).toString(16).toUpperCase()}₁₆</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                          {binaryBits.map((bVal, bIdx) => {
                            const bitExponent = 3 - bIdx;
                            const placeVal = Math.pow(2, bitExponent);
                            return (
                              <div key={bIdx} className="bg-slate-950 p-2 border border-slate-900 rounded-xl relative overflow-hidden flex flex-col justify-between items-center h-28">
                                <span className="font-mono text-[7px] text-slate-500 font-extrabold uppercase font-bold">BIT {bitExponent}</span>
                                <span className="font-mono text-[8px] text-cyan-400 font-black">x{placeVal}</span>

                                {/* Switch button styled nice */}
                                <button
                                  onClick={() => {
                                    const updatedBits = [...binaryBits];
                                    updatedBits[bIdx] = !updatedBits[bIdx];
                                    setBinaryBits(updatedBits);
                                  }}
                                  type="button"
                                  className={`w-9 h-11 border rounded-lg flex flex-col justify-between items-center py-1.5 transition-all shadow-inner select-none cursor-pointer hover:scale-110 active:scale-90 duration-150 ${
                                    bVal
                                      ? "bg-sky-500/15 border-sky-450 hover:bg-sky-500/25 shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold"
                                      : "bg-[#0b0f19] border-slate-900 hover:bg-[#121829] hover:border-slate-800"
                                  }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-full ${bVal ? "bg-sky-400" : "bg-slate-800"}`} />
                                  <span className="font-mono text-[8.5px] font-black font-extrabold text-[#f1f5f9]">{bVal ? "1" : "0"}</span>
                                </button>

                                <span className={`font-mono text-[6.5px] uppercase font-extrabold ${bVal ? "text-sky-400" : "text-slate-500"}`}>
                                  {bVal ? `+${placeVal}` : "0"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Sum value panel */}
                        <div className="bg-[#031c26]/20 border border-cyan-900/30 rounded-xl p-3 flex justify-between items-center text-left select-none">
                          <div>
                            <span className="font-mono text-[7px] text-cyan-400/80 font-bold uppercase tracking-wider block">COMPUTED DIGITAL VALUE:</span>
                            <div className="font-mono text-[11.5px] text-slate-300 leading-tight mt-0.5">
                              {binaryBits.map((b, i) => b ? Math.pow(2, 3 - i) : "0").join(" + ")}
                            </div>
                          </div>
                          <div className="text-right pr-1">
                            <span className="font-mono text-[8px] text-slate-500 block font-bold uppercase">DECIMAL SUM</span>
                            <span className="font-sans font-black text-xl text-cyan-400 leading-none">
                              {binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0)}
                            </span>
                          </div>
                        </div>

                        {/* 7-Segment Displays Visualizers */}
                        <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3 space-y-3">
                          <span className="font-mono text-[8.5px] text-[#22d3ee] font-black uppercase tracking-wider block font-bold">REAL-TIME HARDWARE DISPLAYS DECODERS:</span>
                          
                          <div className="grid grid-cols-2 gap-3 font-sans">
                            {/* 1-Digit Display (Hex Decoder) */}
                            <div 
                              onClick={() => {
                                setIsSevenSegModalOpen(true);
                              }}
                              className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-center group relative overflow-hidden select-none"
                              title="Click to explore interactive logic circuit and decoders"
                            >
                              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              <span className="font-mono text-[7.5px] text-slate-500 group-hover:text-cyan-400 uppercase font-black block mb-2 font-bold transition-colors flex items-center gap-1">
                                1-DIGIT DISPLAY (HEX) <Sparkles className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
                              </span>
                              <div className="bg-black/60 border border-cyan-500/10 group-hover:border-cyan-500/30 px-4 py-2 rounded-md flex items-center justify-center gap-1.5 min-w-[70px] min-h-[50px] transition-all shadow-inner group-hover:scale-105 duration-200">
                                {(() => {
                                  const sum = binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0);
                                  const hexDigit = sum.toString(16).toUpperCase();
                                  return (
                                    <>
                                      <SevenSegmentDigit value={hexDigit} glowingColor="fill-cyan-400 stroke-cyan-400 animate-pulse" />
                                      <span className="font-mono text-xs text-cyan-400 font-bold ml-1.5">{hexDigit}</span>
                                    </>
                                  );
                                })()}
                              </div>
                              <p className="font-sans text-[8px] text-slate-500 mt-1.5 leading-none font-medium">Pipes 4 bits directly to show 0-F</p>
                              <span className="font-mono text-[6.5px] text-cyan-400 font-bold tracking-wider uppercase block mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                CLICK TO EXPLORE HARDWARE INTERNALS
                              </span>
                            </div>

                            {/* 4-Digit Display (Decimal Decoder) */}
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-center flex flex-col items-center justify-center">
                              <span className="font-mono text-[7.5px] text-slate-500 uppercase font-black block mb-2 font-bold">4-DIGIT DISPLAY (DECIMAL)</span>
                              <div className="bg-black/60 border border-sky-500/10 px-3 py-2 rounded-md flex items-center justify-center gap-1 min-h-[50px]">
                                {(() => {
                                  const sum = binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0);
                                  const paddedStr = String(sum).padStart(4, "0");
                                  return (
                                    <>
                                      {paddedStr.split("").map((digit, index) => (
                                        <SevenSegmentDigit key={index} value={digit} glowingColor="fill-sky-400 stroke-sky-400" />
                                      ))}
                                      <span className="font-mono text-xs text-sky-400 font-bold ml-1">{sum}</span>
                                    </>
                                  );
                                })()}
                              </div>
                              <p className="font-sans text-[8px] text-slate-500 mt-1.5 leading-none font-medium">Multiplexes sum to digits 0000-0015</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right column: Logic Gate Workshop (Now Station B) */}
                      <div className="rounded-xl border border-slate-900 bg-[#030712] p-4 flex flex-col justify-between space-y-3 relative">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="font-mono text-[9px] text-sky-400 font-extrabold tracking-widest uppercase font-mono">STATION B: BOOLEAN GATES</span>
                          <span className="text-[9.5px] text-slate-400 font-mono">Gate Output Math</span>
                        </div>

                        <div className="bg-[#050b16] border border-cyan-500/15 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-left select-none shadow-[inset_0_0_15px_rgba(56,189,248,0.05)]">
                          <div className="flex-1 space-y-1">
                            <span className="font-mono text-[8px] text-sky-400 font-black tracking-widest block uppercase">Transfer Function Formula</span>
                            <h5 className="font-sans font-extrabold text-[#f1f5f9] text-base">
                              {logicGate === "AND" ? "Boolean Operator: Y = A • B" :
                               logicGate === "OR" ? "Boolean Operator: Y = A + B" :
                               logicGate === "XOR" ? "Boolean Operator: Y = A ⊕ B" :
                               logicGate === "NAND" ? "Boolean Operator: Y = A • B" :
                               "Boolean Operator: Y = A"}
                            </h5>
                            <p className="font-sans text-[10.5px] text-slate-400 leading-normal">
                              {logicGate === "AND" ? "The output is active ONLY if both input signals A and B are energized (1)." :
                               logicGate === "OR" ? "The output is active if input signal A OR input signal B (or both) are energized." :
                               logicGate === "XOR" ? "The output is active ONLY if the input signals are different from one another." :
                               logicGate === "NAND" ? "The inverse of the AND gate. The output is active unless both inputs A and B are active." :
                               "The inverter gate. Reverses the logic signal: high becomes low, and low becomes high."}
                            </p>
                          </div>
                          
                          {/* Compact schematic symbol drawing for PC users */}
                          <div className="flex flex-col items-center p-2 bg-slate-950 rounded-lg border border-slate-900/60 shrink-0 w-32 h-18 justify-center scale-115 md:scale-120 transition-transform">
                            {renderGateSymbol(logicGate, true, true, logicGate !== "NAND" && logicGate !== "NOT")}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Operator Buttons */}
                          <div className="grid grid-cols-5 gap-1 pt-1.5">
                            {(["AND", "OR", "XOR", "NAND", "NOT"] as const).map((g) => {
                              const isCur = logicGate === g;
                              return (
                                <button
                                  key={g}
                                  onClick={() => setLogicGate(g)}
                                  type="button"
                                  className={`px-1 py-1.5 rounded font-mono text-[8.5px] font-black uppercase text-center cursor-pointer border transition-all hover:scale-110 active:scale-95 duration-150 ${
                                    isCur
                                      ? "bg-sky-950 border-sky-450 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.35)] font-black animate-pulse"
                                      : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                                  }`}
                                >
                                  {g}
                                </button>
                              );
                            })}
                          </div>

                          {/* Inputs & Outputs Grid with Minimized Schematic scale for PC users */}
                          <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4.5 rounded-xl border-2 border-slate-900 items-center shadow-inner font-sans">
                            {/* Left Column: inputs A & B Toggles */}
                            <div className="space-y-4">
                              <div className="space-y-1.5 text-left">
                                <span className="font-mono text-[8px] text-slate-400 uppercase font-black block tracking-wider font-extrabold">Source PIN A</span>
                                <button
                                  onClick={() => setLogicInputA(!logicInputA)}
                                  type="button"
                                  className={`w-full py-2 text-center font-mono text-[10px] font-extrabold rounded-lg border-2 cursor-pointer select-none transition-all hover:scale-105 active:scale-95 duration-150 ${
                                    logicInputA
                                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-950/60"
                                      : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                                  }`}
                                >
                                  {logicInputA ? "HIGH (1)" : "LOW (0)"}
                                </button>
                              </div>

                              <div className="space-y-1.5 text-left">
                                <span className="font-mono text-[8px] text-slate-400 uppercase font-black block tracking-wider font-extrabold">Source PIN B</span>
                                <button
                                  disabled={logicGate === "NOT"}
                                  onClick={() => setLogicInputB(!logicInputB)}
                                  type="button"
                                  className={`w-full py-2 text-center font-mono text-[10px] font-extrabold rounded-lg border-2 cursor-pointer select-none transition-all duration-150 ${
                                    logicGate === "NOT"
                                      ? "opacity-20 cursor-not-allowed bg-slate-950 border-transparent text-slate-700"
                                      : logicInputB
                                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 hover:bg-emerald-950/60"
                                      : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:scale-105 active:scale-95"
                                  }`}
                                >
                                  {logicGate === "NOT" ? "UNUSED" : logicInputB ? "HIGH (1)" : "LOW (0)"}
                                </button>
                              </div>
                            </div>

                            {/* Middle Column: Visual Gate Symbol block - Minimized for PC users */}
                            {(() => {
                              const outVal = 
                                logicGate === "AND" ? (logicInputA && logicInputB) :
                                logicGate === "OR" ? (logicInputA || logicInputB) :
                                logicGate === "XOR" ? (logicInputA !== logicInputB) :
                                logicGate === "NAND" ? !(logicInputA && logicInputB) :
                                !logicInputA; // NOT gate

                              return (
                                <>
                                  <div className="flex flex-col items-center justify-center border-l border-r border-[#1e293b]/50 h-24 select-none px-2">
                                    <span className="font-mono text-[8px] text-slate-500 tracking-wider uppercase font-black block mb-1">Gate Schematic</span>
                                    <div className="scale-65 md:scale-70 transition-transform duration-300">
                                      {renderGateSymbol(logicGate, logicInputA, logicInputB, outVal)}
                                    </div>
                                    <span className="font-mono font-black text-[9px] text-sky-400 uppercase mt-2 tracking-wider">
                                      {logicGate} GATE
                                    </span>
                                  </div>

                                  {/* Right Column: Dynamic Output Indicator LED */}
                                  <div className="flex flex-col items-center justify-center">
                                    <span className="font-mono text-[8px] text-slate-400 uppercase font-black block mb-2 tracking-wider">Gate Output</span>
                                    <div className="flex flex-col items-center">
                                      <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-sans font-black text-xs shadow-lg transition-all duration-300 ${
                                        outVal
                                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-pulse"
                                          : "bg-slate-900 border-slate-800 text-slate-600"
                                      }`}>
                                        {outVal ? "1" : "0"}
                                      </div>
                                      <span className={`font-mono text-[8px] tracking-widest mt-1.5 uppercase font-black ${outVal ? "text-emerald-400" : "text-slate-500"}`}>
                                        {outVal ? "LED GLOWING" : "LED DARK"}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>

                          {/* Micro Truth Table visualizer */}
                          <div className="bg-slate-950 p-2 rounded border border-slate-900 select-none text-[8px] font-mono leading-relaxed text-slate-400 space-y-0.5">
                            <span className="text-slate-500 font-extrabold block text-[7.5px] mb-1 uppercase text-left">Truth Table Highlight Filter:</span>
                            <div className="flex justify-between border-b border-slate-900/60 pb-1 text-slate-500 font-bold uppercase text-[7px]">
                              <span>PIN A</span>
                              {logicGate !== "NOT" && <span>PIN B</span>}
                              <span>GATE {logicGate} OUTPUT</span>
                            </div>
                            {/* Generate standard truth rows */}
                            {(logicGate === "NOT" ? [true, false] : [[true, true], [true, false], [false, true], [false, false]]).map((row, rIdx) => {
                              let a: boolean, b: boolean = false;
                              if (logicGate === "NOT") {
                                a = row as boolean;
                              } else {
                                [a, b] = row as [boolean, boolean];
                              }

                              const outVal = 
                                logicGate === "AND" ? (a && b) :
                                logicGate === "OR" ? (a || b) :
                                logicGate === "XOR" ? (a !== b) :
                                logicGate === "NAND" ? !(a && b) :
                                !a;

                              const isHighlight = logicGate === "NOT"
                                ? (logicInputA === a)
                                : (logicInputA === a && logicInputB === b);

                              return (
                                <div key={rIdx} className={`flex justify-between px-1.5 py-0.5 rounded font-mono ${isHighlight ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold animate-pulse" : "opacity-45"}`}>
                                  <span>{a ? "1" : "0"}</span>
                                  {logicGate !== "NOT" && <span>{b ? "1" : "0"}</span>}
                                  <span className={outVal ? "text-emerald-400" : "text-slate-500"}>{outVal ? "1 HIGH" : "0 LOW"}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {false && (
                  <motion.div
                    key="controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5 text-left font-sans"
                  >
                    {/* Header */}
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          Control Systems & PID Feedback Lab
                        </h4>
                        <p className="font-sans text-[11px] text-slate-400 leading-tight">
                          Explore open-loop speed actions, closed-loop error matching, and real-time PID dynamic stabilization:
                        </p>
                      </div>
                      <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-extrabold uppercase shrink-0">
                        FEEDBACK CONTROL THEORY
                      </span>
                    </div>

                    {/* Section 1: Theory of Control Systems */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-900/15 border border-slate-900/60 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-indigo-400 font-extrabold text-xs uppercase tracking-wide">
                          <Info className="w-3.5 h-3.5 shrink-0" />
                          What is a Control System?
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          A <strong>Control System</strong> manages, commands, or regulates the behavior of physical joints, heating units, or motors. Its task is to drive a measured physical variable (called the <strong>Process Variable, PV</strong>) to match a desired target level (called the <strong>Setpoint, SP</strong>).
                        </p>
                      </div>

                      <div className="bg-slate-900/15 border border-slate-900/60 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-500 font-extrabold text-xs uppercase tracking-wide block">• Open-Loop Control</span>
                          <span className="text-[7.5px] bg-amber-950/30 text-amber-500 border border-amber-900/30 px-1 py-0.2 rounded font-mono font-bold">SPIN-AND-PRAY</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Operates blindly with <strong>no output sensors/feedback</strong>. It sends a fixed actuation force, assuming everything works. 
                          <em className="block mt-1.5 text-[10px] text-slate-500">❌ Distortions (load, friction) are ignored, leading to massive raw deviation. (Example: Standard kitchen toaster)</em>
                        </p>
                      </div>

                      <div className="bg-slate-900/15 border border-slate-900/60 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-wide block">• Closed-Loop Control</span>
                          <span className="text-[7.5px] bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 px-1 py-0.2 rounded font-mono font-bold">SENSE-CORRECT</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Uses <strong>continuous sensor feedback</strong> to subtract measured output from setpoint. This creates an <strong>Error (e = SP - PV)</strong>, which is continuously corrected.
                          <em className="block mt-1.5 text-[10px] text-emerald-400/80">✓ Self-adjusts instantly. Resilient against outside forces. (Example: Self-steering system)</em>
                        </p>
                      </div>
                    </div>

                    {/* Section 2: PID Parameter explanation and feedback loops */}
                    <div className="p-4 bg-purple-950/5 border border-purple-900/10 rounded-xl space-y-3">
                      <h5 className="font-sans font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        Unpacking PID: The Mathematical Stabilization Triple-Engine
                      </h5>
                      <p className="text-[11.5px] text-slate-300">
                        A PID controller calculates a continuous corrective output u(t) combining three distinct temporal lenses:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                        <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg">
                          <div className="font-mono text-[10.5px] font-black text-rose-400 mb-1 flex justify-between">
                            <span>[P] PROPORTIONAL (Present)</span>
                            <span className="text-[8px] bg-rose-950/40 text-rose-400 px-1 border border-rose-900/30 rounded uppercase font-black">Gain Kp</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Corresponds directly to the current amplitude of raw Error.
                            <strong className="block text-rose-400/95 mt-1">High Kp: Rushes fast toward target, but excessive values cause massive overshoot and aggressive oscillations!</strong>
                          </p>
                        </div>

                        <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg">
                          <div className="font-mono text-[10.5px] font-black text-amber-550 text-amber-500 mb-1 flex justify-between">
                            <span>[I] INTEGRAL (Past)</span>
                            <span className="text-[8px] bg-amber-950/40 text-amber-500 px-1 border border-amber-900/30 rounded uppercase font-black">Gain Ki</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Accumulates the history of persistent minor offset errors over time.
                            <strong className="block text-amber-400/95 mt-1">Eliminates steady-state offset errors completely, but builds sluggish "windup" causing extra overshoot.</strong>
                          </p>
                        </div>

                        <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg">
                          <div className="font-mono text-[10.5px] font-black text-cyan-455 text-cyan-400 mb-1 flex justify-between">
                            <span>[D] DERIVATIVE (Future)</span>
                            <span className="text-[8px] bg-cyan-950/40 text-cyan-400 px-1 border border-cyan-900/30 rounded uppercase font-black">Gain Kd</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            Measures the speed/slope of the changing error to project where the signal is headed.
                            <strong className="block text-cyan-400/95 mt-1">Acts like a shock absorber/damper. Cushions overshoot and kills aggressive oscillations, but amplifies HF sensor noise.</strong>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Interactive Playground & Simulator */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                      {/* Left panel of Playground: Controls */}
                      <div className="lg:col-span-5 bg-[#030712] p-4 rounded-xl border border-slate-900 flex flex-col justify-between space-y-4">
                        <div className="space-y-4.5">
                          <div>
                            <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase font-black mb-1">Active Loop Strategy:</span>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <button
                                onClick={() => setIsPidClosedLoop(true)}
                                type="button"
                                className={`px-2 py-2 font-mono text-[9px] border transition-all rounded-lg font-bold cursor-pointer uppercase text-center ${
                                  isPidClosedLoop
                                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                                    : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                Closed-Loop Feedback (PID)
                              </button>
                              <button
                                onClick={() => setIsPidClosedLoop(false)}
                                type="button"
                                className={`px-2 py-2 font-mono text-[9px] border transition-all rounded-lg font-bold cursor-pointer uppercase text-center ${
                                  !isPidClosedLoop
                                    ? "bg-amber-950/40 border-amber-500 text-amber-505 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                                    : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                                }`}
                              >
                                Open-Loop Command
                              </button>
                            </div>
                          </div>

                          {/* Sliders container */}
                          <div className="space-y-3.5">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-300 font-bold block">Target Position Setpoint:</span>
                                <span className="font-mono text-emerald-405 text-emerald-400 font-extrabold">{pidSetpoint.toFixed(1)} Volts</span>
                              </div>
                              <input 
                                type="range" 
                                min="0.5" 
                                max="1.5" 
                                step="0.1"
                                value={pidSetpoint}
                                onChange={(e) => setPidSetpoint(parseFloat(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                              />
                            </div>

                            {isPidClosedLoop ? (
                              <div className="space-y-3.5 pt-3.5 border-t border-slate-900/60">
                                {/* Kp Slider */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-rose-300 font-bold font-mono text-[9.5px]">Proportional Gain (Kp):</span>
                                    <span className="font-mono text-rose-400 font-bold text-[10px]">{pidKp.toFixed(1)}</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0.0" 
                                    max="10.0" 
                                    step="0.1"
                                    value={pidKp}
                                    onChange={(e) => setPidKp(parseFloat(e.target.value))}
                                    className="w-full accent-rose-500 cursor-pointer"
                                  />
                                </div>

                                {/* Ki Slider */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-amber-350 text-amber-400 font-bold font-mono text-[9.5px]">Integral Gain (Ki):</span>
                                    <span className="font-mono text-amber-400 font-bold text-[10px]">{pidKi.toFixed(1)}</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0.0" 
                                    max="5.0" 
                                    step="0.1"
                                    value={pidKi}
                                    onChange={(e) => setPidKi(parseFloat(e.target.value))}
                                    className="w-full accent-amber-500 cursor-pointer"
                                  />
                                </div>

                                {/* Kd Slider */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-cyan-300 font-bold font-mono text-[9.5px]">Derivative Gain (Kd):</span>
                                    <span className="font-mono text-cyan-450 text-cyan-400 font-bold text-[10px]">{pidKd.toFixed(2)}</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0.0" 
                                    max="5.0" 
                                    step="0.05"
                                    value={pidKd}
                                    onChange={(e) => setPidKd(parseFloat(e.target.value))}
                                    className="w-full accent-cyan-500 cursor-pointer"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 bg-amber-950/10 border border-amber-900/20 text-slate-400 rounded-lg text-[9.5px] leading-relaxed pt-2.5">
                                <span className="text-amber-500 font-black block mb-0.5 font-mono uppercase tracking-wide">OPEN LOOP ACTIVE</span>
                                In open loop mode, PID correction is bypassed. Actuator receives a fixed drive command. The motor rotates but environmental drag & spring stiffness mean it encounters steady-state offset and can never lock onto your Setpoint Voltage. Try matching SP=1.5V vs SP=0.5V.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Live MCU controller box look */}
                        <div className="p-3 bg-slate-950 border border-[#0f172a] rounded-lg flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[7px] text-[#22d3ee] font-black uppercase tracking-widest block">STM32 PID CORE</span>
                            <span className="font-sans text-[9.5px] text-slate-500 block font-semibold">Sampling Clock Rate:</span>
                          </div>
                          <span className="font-mono text-[#06b6d4] font-black text-[10px] uppercase bg-[#090d16] px-2 py-1 rounded border border-slate-900 animate-pulse whitespace-nowrap">
                            ⟲ 200 Hz Interrupt
                          </span>
                        </div>
                      </div>

                      {/* Right panel of Playground: Interactive Graph Showcase */}
                      {(() => {
                        // Math simulator function inside render block
                        const kp = pidKp;
                        const ki = pidKi;
                        const kd = pidKd;
                        const closedLoop = isPidClosedLoop;
                        
                        const points = [];
                        const setpoint = pidSetpoint;
                        
                        if (!closedLoop) {
                          // Open loop step response
                          let y = 0;
                          const dt = 0.05;
                          const steps = 140;
                          const damping = 0.55;
                          const gain = kp * 0.15 + 0.5; // steady gain
                          for (let i = 0; i < steps; i++) {
                            const u = setpoint * gain;
                            const dy = u - damping * y;
                            y += dy * dt;
                            points.push({ t: i * dt, y: Math.max(0, y), u });
                          }
                        } else {
                          // Closed loop PID mass-spring-damper response simulation
                          let y = 0;
                          let v = 0;
                          let errorSum = 0;
                          let prevError = setpoint - y;
                          const dt = 0.05;
                          const steps = 140;
                          
                          const mass = 1.0;
                          const plantDamping = 0.35;
                          const plantSpring = 0.2;
                          
                          for (let i = 0; i < steps; i++) {
                            const error = setpoint - y;
                            errorSum = Math.max(-8, Math.min(8, errorSum + error * dt));
                            const errorDeriv = (error - prevError) / dt;
                            prevError = error;
                            
                            const u = kp * error + ki * errorSum + kd * errorDeriv;
                            const uSat = Math.max(-12, Math.min(12, u));
                            
                            const acc = (uSat - plantDamping * v - plantSpring * y) / mass;
                            v += acc * dt;
                            y += v * dt;
                            
                            points.push({ t: i * dt, y, error, u: uSat });
                          }
                        }

                        // Calculate characteristics
                        let peakY = 0;
                        let peakTime = 0;
                        for (let i = 0; i < points.length; i++) {
                          if (points[i].y > peakY) {
                            peakY = points[i].y;
                            peakTime = points[i].t;
                          }
                        }
                        const overshootVal = peakY - setpoint;
                        const overshootPercent = (peakY > setpoint && closedLoop) ? (overshootVal / setpoint) * 100 : 0;
                        const finalY = points[points.length - 1].y;
                        const steadyStateErr = Math.abs(setpoint - finalY);

                        // Calculate Rise Time (10% to 90% of setpoint)
                        let t10 = -1;
                        let t90 = -1;
                        for (let i = 0; i < points.length; i++) {
                          if (t10 === -1 && points[i].y >= 0.1 * setpoint) {
                            t10 = points[i].t;
                          }
                          if (t90 === -1 && points[i].y >= 0.9 * setpoint) {
                            t90 = points[i].t;
                          }
                        }
                        const riseTime = (t10 !== -1 && t90 !== -1 && t90 > t10) ? (t90 - t10) : null;

                        // Core SVG configuration
                        // width=440 height=185
                        const mapX = (t: number) => {
                          const maxT = points[points.length - 1].t;
                          return 40 + (t / maxT) * 370;
                        };
                        const mapY = (val: number) => {
                          // range 0.0 to 2.2 Volts
                          return 155 - (val / 2.2) * 130;
                        };

                        let responsePath = "";
                        for (let i = 0; i < points.length; i++) {
                          const x = mapX(points[i].t);
                          const y = mapY(points[i].y);
                          if (i === 0) responsePath += `M ${x},${y}`;
                          else responsePath += ` L ${x},${y}`;
                        }

                        const spY = mapY(setpoint);
                        const peakX = mapX(peakTime);
                        const peakY_coord = mapY(peakY);
                        const finalX = mapX(points[points.length - 1].t);
                        const finalY_coord = mapY(finalY);

                        // Classification string
                        let classification = "Overdamped / Slow";
                        let classColor = "text-amber-400";
                        if (closedLoop) {
                          if (overshootPercent > 22) {
                            classification = "Highly Underdamped / Oscillatory";
                            classColor = "text-[#f43f5e] animate-pulse";
                          } else if (steadyStateErr > 0.12) {
                            classification = "Severe Steady-State Offset";
                            classColor = "text-[#fbbf24]";
                          } else if (overshootPercent > 0.5 && steadyStateErr < 0.04) {
                            classification = "Optimally Settled (Stable Response)";
                            classColor = "text-[#10b981] font-black";
                          } else {
                            classification = "Stiff Sluggish / Overdamped";
                            classColor = "text-indigo-400";
                          }
                        } else {
                          classification = "Open-Loop Steady Distortion";
                          classColor = "text-amber-500 font-extrabold uppercase";
                        }

                        return (
                          <div className="lg:col-span-7 rounded-xl border border-slate-900 bg-[#030712] p-4 flex flex-col justify-between space-y-4.5 relative overflow-hidden">
                            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                              <span className="font-mono text-[9px] text-[#10b981] font-extrabold tracking-widest uppercase">REAL-TIME STEP RESPONSE SCOPE</span>
                              <span className={`text-[9.5px] bg-[#1e293b]/50 px-2.5 py-0.5 rounded font-mono font-bold ${classColor}`}>
                                {classification}
                              </span>
                            </div>

                            {/* Response graphics */}
                            <div className="relative h-44 bg-slate-950 border border-slate-900/80 rounded-xl p-2 select-none">
                              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:16px_16px] opacity-15 pointer-events-none" />

                              <svg className="w-full h-full" viewBox="0 0 440 180" preserveAspectRatio="none">
                                {/* Grid reference lines */}
                                <line x1="40" y1={mapY(0)} x2="420" y2={mapY(0)} stroke="#111827" strokeWidth="1" />
                                <line x1="40" y1={mapY(0.5)} x2="420" y2={mapY(0.5)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                                <line x1="40" y1={mapY(1.0)} x2="420" y2={mapY(1.0)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                                <line x1="40" y1={mapY(1.5)} x2="420" y2={mapY(1.5)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
                                <line x1="40" y1={mapY(2.0)} x2="420" y2={mapY(2.0)} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />

                                {/* Left Y voltage axis labels */}
                                <text x="32" y={mapY(0) + 3} textAnchor="end" fill="#64748b" fontSize="7px" fontFamily="monospace">0.0V</text>
                                <text x="32" y={mapY(0.5) + 3} textAnchor="end" fill="#64748b" fontSize="7px" fontFamily="monospace">0.5V</text>
                                <text x="32" y={mapY(1.0) + 3} textAnchor="end" fill="#64748b" fontSize="7px" fontFamily="monospace">1.0V</text>
                                <text x="32" y={mapY(1.5) + 3} textAnchor="end" fill="#64748b" fontSize="7px" fontFamily="monospace">1.5V</text>
                                <text x="32" y={mapY(2.0) + 3} textAnchor="end" fill="#64748b" fontSize="7px" fontFamily="monospace">2.0V</text>

                                {/* Target Setpoint Line in dashed Yellow */}
                                <line 
                                  x1="40" 
                                  y1={spY} 
                                  x2="410" 
                                  y2={spY} 
                                  stroke="#fbbf24" 
                                  strokeWidth="1.2" 
                                  strokeDasharray="4,3" 
                                  opacity="0.85" 
                                />
                                
                                {/* Simulated Process Variable Curve output */}
                                <path 
                                  d={responsePath} 
                                  fill="none" 
                                  stroke={closedLoop ? "#10b981" : "#f59e0b"} 
                                  strokeWidth="2.5" 
                                />

                                {/* Visual Indicators of PID metrics directly on the step graph */}
                                {closedLoop && (
                                  <>
                                    {/* Overshoot Annotation Dot */}
                                    {overshootPercent > 0.1 && (
                                      <g>
                                        <circle cx={peakX} cy={peakY_coord} r="4.5" fill="#f43f5e" fillOpacity="0.4" />
                                        <circle cx={peakX} cy={peakY_coord} r="2" fill="#f43f5e" />
                                        <line x1={peakX} y1={peakY_coord} x2={peakX} y2={spY} stroke="#f43f5e" strokeWidth="0.8" strokeDasharray="1,1" />
                                        <text x={peakX + 6} y={peakY_coord - 2} fill="#f43f5e" fontSize="7px" fontFamily="monospace" fontWeight="bold">
                                          Overshoot (+{(overshootPercent).toFixed(1)}%)
                                        </text>
                                      </g>
                                    )}

                                    {/* Steady State Error Dimension Bracket */}
                                    {steadyStateErr > 0.015 && (
                                      <g>
                                        <line x1="412" y1={finalY_coord} x2="412" y2={spY} stroke="#fbbf24" strokeWidth="1" />
                                        <line x1="409" y1={finalY_coord} x2="415" y2={finalY_coord} stroke="#fbbf24" strokeWidth="1" />
                                        <line x1="409" y1={spY} x2="415" y2={spY} stroke="#fbbf24" strokeWidth="1" />
                                        <text x="404" y={(finalY_coord + spY) / 2 + 3} textAnchor="end" fill="#fbbf24" fontSize="7px" fontFamily="monospace" fontWeight="bold">
                                          e_ss: {steadyStateErr.toFixed(2)}V
                                        </text>
                                      </g>
                                    )}

                                    {/* Rise Time shaded column representing 10% to 90% */}
                                    {riseTime && (
                                      <g>
                                        <rect x={mapX(t10)} y="20" width={Math.max(2, mapX(t90) - mapX(t10))} height="130" fill="#10b981" fillOpacity="0.04" pointerEvents="none" />
                                        <line x1={mapX(t10)} y1="20" y2="150" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.32" />
                                        <line x1={mapX(t90)} y1="20" y2="150" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.32" />
                                        <text x={(mapX(t10) + mapX(t90)) / 2} y="145" textAnchor="middle" fill="#10b981" fontSize="6px" fontFamily="monospace" opacity="0.8">
                                          RISE COLUMN
                                        </text>
                                      </g>
                                    )}
                                  </>
                                )}
                              </svg>

                              <div className="absolute top-2 left-11 text-[7.5px] font-mono text-[#fbbf24] select-none bg-black/80 px-1 py-0.5 border border-slate-900 rounded">
                                Target Setpoint (SP) = {pidSetpoint.toFixed(1)}V
                              </div>
                              <div className="absolute top-2 right-2 text-[7.5px] font-mono text-[#10b981] select-none bg-black/80 px-1 py-0.5 border border-slate-900 rounded">
                                Measured Output (PV)
                              </div>
                              <div className="absolute bottom-1.5 left-11 right-2 flex justify-between font-mono text-[7px] text-slate-550 uppercase select-none">
                                <span>t = 0.0s</span>
                                <span className="opacity-60 text-slate-500">Step Input Applied</span>
                                <span>Steady range t = 7.0s</span>
                              </div>
                            </div>

                            {/* Dynamic Numeric Characteristics Cards */}
                            <div className="grid grid-cols-4 gap-2 text-white text-center font-mono text-[9px] pt-1">
                              <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                                <span className="text-slate-500 text-[6.5px] block font-bold">SETPOINT (SP)</span>
                                <span className="text-amber-400 font-extrabold">{pidSetpoint.toFixed(2)} Volts</span>
                              </div>
                              <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                                <span className="text-slate-500 text-[6.5px] block font-bold">RISE TIME (Tr)</span>
                                <span className="text-emerald-400 font-extrabold">
                                  {closedLoop && riseTime ? `${riseTime.toFixed(2)}s` : "N/A (Blind)"}
                                </span>
                              </div>
                              <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                                <span className="text-slate-500 text-[6.5px] block font-bold">OVERSHOOT (Mp)</span>
                                <span className="text-rose-450 text-rose-400 font-extrabold">
                                  {closedLoop ? `${(overshootPercent).toFixed(1)}%` : "N/A (0)"}
                                </span>
                              </div>
                              <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                                <span className="text-slate-500 text-[6.5px] block font-bold">STEADY ERR (ess)</span>
                                <span className={`font-extrabold ${steadyStateErr > 0.1 ? "text-amber-500 animate-pulse" : "text-emerald-400"}`}>
                                  {steadyStateErr.toFixed(3)} Volts
                                </span>
                              </div>
                            </div>

                            {/* Micro Explainer footer */}
                            <div className="bg-[#1e1b4b]/20 p-2.5 rounded-lg border border-purple-950/25 text-sans text-[10px] text-slate-400 leading-tight">
                              <strong className="text-[#a855f7] uppercase text-[9px] font-mono block mb-0.5 tracking-wider">Dynamic Controller Tuning Rule:</strong>
                              {closedLoop ? (
                                <span>
                                  Note: Raising proportional gain <strong className="text-rose-400">Kp</strong> boosts acceleration speed but yields momentum overshoot. Adding derivative damping <strong className="text-cyan-300">Kd</strong> counters acceleration as the error shrinks, acting as an optimal shock absorber to neutralize oscillation!
                                </span>
                              ) : (
                                <span>
                                  Notice that without closed feedback correction to recalculate dynamic error, the raw plant settles permanently at <strong className="text-amber-500">{(finalY).toFixed(3)}V</strong>, suffering a steady displacement error of <strong className="text-amber-400">{steadyStateErr.toFixed(3)}V</strong> from mechanical load resistance.
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}

                {false && (
                  <motion.div
                    key="protocols"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 text-left font-sans"
                  >
                    <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
                      <div>
                        <h4 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                          Serial Communication Protocols
                        </h4>
                        <p className="font-sans text-[11px] text-slate-550 text-slate-400 leading-tight">Learn and animate how microcontrollers send bytes of data across hardware pins:</p>
                      </div>
                      <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-extrabold uppercase">
                        HARDWARE SERIAL BUSES
                      </span>
                    </div>

                    {/* Protocol selector mini tabs */}
                    <div className="flex gap-2">
                      {(["uart", "i2c", "spi"] as const).map((p) => {
                        const isAct = protocolType === p;
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              setProtocolType(p);
                              setIsUartTransmitting(false);
                              setUartTxStep(-1);
                              setIsI2cTransmitting(false);
                              setI2cTxStep(-1);
                              setIsSpiTransmitting(false);
                              setSpiTxStep(-1);
                            }}
                            type="button"
                            className={`px-3 py-1.5 font-mono text-[9px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                              isAct
                                ? "bg-slate-950 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                : "bg-slate-900/30 border-slate-900 text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            {p === "uart" 
                              ? "UART Protocol (Async 1-on-1)" 
                              : p === "i2c" 
                              ? "I2C Protocol (Shared 2-Wire)" 
                              : "SPI Protocol (Full-Duplex 4-Wire)"}
                          </button>
                        );
                      })}
                    </div>

                    {/* Timing Playback Mode Configurator */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/10 border border-slate-900/60 p-3.5 rounded-xl text-xs gap-3">
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-mono text-[8px] bg-sky-950/40 text-sky-400 border border-sky-850/30 px-1.5 py-0.5 rounded font-black uppercase">INTERACTION MODE</span>
                          <span className="text-slate-200 font-sans font-extrabold text-xs">Choose Exploration Mode:</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans leading-tight">Switch to Step-by-Step mode to manually drive clock pulses and inspect wire transients at your own pace!</p>
                      </div>
                      <div className="flex gap-2 font-sans self-start sm:self-center">
                        <button
                          onClick={() => {
                            setIsManualStepMode(false);
                            setIsUartTransmitting(false);
                            setUartTxStep(-1);
                            setIsI2cTransmitting(false);
                            setI2cTxStep(-1);
                            setIsSpiTransmitting(false);
                            setSpiTxStep(-1);
                          }}
                          type="button"
                          className={`px-3 py-1.5 text-[10px] uppercase font-mono rounded-lg cursor-pointer font-bold transition-all border ${
                            !isManualStepMode
                              ? "bg-[#10b981]/15 border-[#10b981]/50 text-[#34d399] shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                              : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Auto-Play Waveform
                        </button>
                        <button
                          onClick={() => {
                            setIsManualStepMode(true);
                            setIsUartTransmitting(false);
                            setUartTxStep(-1);
                            setIsI2cTransmitting(false);
                            setI2cTxStep(-1);
                            setIsSpiTransmitting(false);
                            setSpiTxStep(-1);
                          }}
                          type="button"
                          className={`px-3 py-1.5 text-[10px] uppercase font-mono rounded-lg cursor-pointer font-bold transition-all border ${
                            isManualStepMode
                              ? "bg-sky-950/40 border-sky-500 text-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.1)]"
                              : "bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Manual Step Mode
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left half controllers/explanations */}
                      <div className="space-y-4 bg-slate-900/10 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                        <div>
                          {protocolType === "uart" ? (
                            <div className="space-y-3">
                              <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase font-bold">UART Setup Panel:</span>
                              <p className="font-sans text-xs text-slate-400 leading-relaxed font-semibold">
                                <strong className="text-white">UART (Universal Asynchronous Receiver-Transmitter)</strong> uses 2 cross-linked wires (<span className="text-emerald-400 font-mono font-bold">TX</span> and <span className="text-amber-400 font-mono font-bold font-bold">RX</span>) without a common clock line. Clock timings (Baud Rate) must be configured identically on both ends prior to communicating.
                              </p>

                              <div className="grid grid-cols-2 gap-3 bg-[#030712] p-3 rounded-lg border border-slate-900">
                                <div className="space-y-1">
                                  <span className="font-mono text-[7px] text-slate-505 text-slate-500 uppercase font-black block font-bold">Character Tx package:</span>
                                  <select
                                    value={uartChar}
                                    onChange={(e) => setUartChar(e.target.value)}
                                    disabled={isUartTransmitting}
                                    className="w-full bg-slate-950 border border-slate-900 text-slate-200 font-mono text-[10.5px] py-1 px-1.5 rounded outline-none cursor-pointer"
                                  >
                                    <option value="A">Char 'A' (01000001)</option>
                                    <option value="B">Char 'B' (01000010)</option>
                                    <option value="C">Char 'C' (01000011)</option>
                                    <option value="X">Char 'X' (01011000)</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <span className="font-mono text-[7px] text-slate-505 text-slate-500 uppercase font-black block font-bold">Standard Baud rate:</span>
                                  <div className="font-mono text-[10px] text-emerald-400 bg-slate-950/80 border border-slate-900 py-1.5 px-2 rounded font-black font-extrabold text-center">
                                    9600 bps (Bits/s)
                                  </div>
                                </div>
                              </div>

                              {isManualStepMode ? (
                                <div className="space-y-2">
                                  {!isUartTransmitting ? (
                                    <button
                                      onClick={() => {
                                        setIsUartTransmitting(true);
                                        setUartTxStep(0);
                                      }}
                                      type="button"
                                      className="w-full py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/35 text-sky-450 text-[#38bdf8] font-bold font-mono text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                                    >
                                      START MANUAL UART STEPPER
                                    </button>
                                  ) : (
                                    <div className="space-y-2 bg-[#02050f] p-3 rounded-lg border border-slate-900">
                                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                                        <span className="text-slate-500">Step: {uartTxStep} / 9</span>
                                        <span className="text-sky-400 font-bold uppercase text-[9px]">Stepping Active</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            setUartTxStep((prev) => Math.max(0, prev - 1));
                                          }}
                                          disabled={uartTxStep <= 0}
                                          type="button"
                                          className="flex-1 py-1.5 font-mono text-[9.5px] uppercase border cursor-pointer rounded-lg bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          ◄ PREV STEP
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (uartTxStep >= 9) {
                                              setIsUartTransmitting(false);
                                              setUartTxStep(-1);
                                            } else {
                                              setUartTxStep((prev) => prev + 1);
                                            }
                                          }}
                                          type="button"
                                          className="flex-1 py-1.5 font-mono text-[9.5px] uppercase border cursor-pointer rounded-lg bg-sky-550/15 bg-sky-500/15 border-sky-500/30 text-sky-400 font-extrabold hover:bg-sky-500/25"
                                        >
                                          {uartTxStep >= 9 ? "FINISH ⏹" : "NEXT STEP ►"}
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setIsUartTransmitting(false);
                                          setUartTxStep(-1);
                                        }}
                                        type="button"
                                        className="w-full mt-1 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 font-bold font-mono text-[9px] uppercase rounded cursor-pointer"
                                      >
                                        RESET SIMULATOR
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setIsUartTransmitting(true);
                                    setUartTxStep(0);
                                  }}
                                  disabled={isUartTransmitting}
                                  type="button"
                                  className={`w-full py-2.5 font-mono text-[10px] font-black uppercase tracking-wider rounded-xl border select-none transition-all duration-300 ${
                                    isUartTransmitting
                                      ? "bg-slate-950 border-[#10b981]/25 text-[#10b981]/50 cursor-not-allowed animate-pulse"
                                      : "bg-[#10b981]/10 hover:bg-[#10b981]/20 border-[#10b981]/30 hover:border-[#10b981]/60 text-[#34d399] cursor-pointer font-bold"
                                    }`}
                                >
                                  {isUartTransmitting ? `SENDING PACKET [STEP ${uartTxStep}/9]` : "FIRE UART TRANSMISSION"}
                                </button>
                              )}
                            </div>
                          ) : protocolType === "i2c" ? (
                            <div className="space-y-3">
                              <span className="font-mono text-[8px] text-slate-505 text-slate-500 tracking-wider block uppercase font-bold">I2C Setup Panel:</span>
                              <p className="font-sans text-xs text-slate-400 leading-relaxed font-semibold">
                                <strong className="text-white">I2C (Inter-Integrated Circuit)</strong> uses exactly 2 wires: <span className="text-[#22d3ee] font-mono font-bold font-bold">SDA</span> (Serial Data) and <span className="text-[#f59e0b] font-mono font-bold">SCL</span> (Serial Clock). This is a shared bus line: each peripheral chip has a unique hardware address.
                              </p>

                              <div className="grid grid-cols-2 gap-3 bg-[#030712] p-3 rounded-lg border border-slate-900">
                                <div className="space-y-1">
                                  <span className="font-mono text-[7px] text-slate-505 text-slate-500 uppercase font-black block font-bold">Target Hex Address:</span>
                                  <div className="grid grid-cols-2 gap-1.5 font-sans">
                                    {(["0x2A", "0x3F"] as const).map((addr) => {
                                      const isCur = i2cAddress === addr;
                                      return (
                                        <button
                                          key={addr}
                                          onClick={() => setI2cAddress(addr)}
                                          disabled={isI2cTransmitting}
                                          type="button"
                                          className={`py-1 rounded font-mono text-[9px] font-semibold transition-all border cursor-pointer ${
                                            isCur
                                              ? "bg-emerald-950 border-emerald-500 text-emerald-400 font-extrabold"
                                              : "bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-350"
                                          }`}
                                        >
                                          {addr === "0x2A" ? "0x2A" : "0x3F"}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="font-mono text-[7px] text-slate-505 text-slate-500 uppercase font-black block font-bold">Command byte:</span>
                                  <input
                                    type="text"
                                    value={i2cData}
                                    onChange={(e) => setI2cData(e.target.value.substring(0, 6))}
                                    disabled={isI2cTransmitting}
                                    className="w-full bg-slate-950 border border-slate-900 text-slate-200 font-mono text-[10.5px] py-1 px-2 rounded outline-none"
                                  />
                                </div>
                              </div>

                              {isManualStepMode ? (
                                <div className="space-y-2">
                                  {!isI2cTransmitting ? (
                                    <button
                                      onClick={() => {
                                        setIsI2cTransmitting(true);
                                        setI2cTxStep(0);
                                      }}
                                      type="button"
                                      className="font-bold py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/35 text-[#38bdf8] text-[10px] w-full font-mono uppercase rounded-xl transition-all cursor-pointer"
                                    >
                                      START MANUAL I2C STEPPER
                                    </button>
                                  ) : (
                                    <div className="space-y-2 bg-[#02050f] p-3 rounded-lg border border-slate-900">
                                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                                        <span className="text-slate-500">Step: {i2cTxStep} / 5</span>
                                        <span className="text-sky-450 text-[#38bdf8] font-bold uppercase text-[9px]">Stepping Active</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            setI2cTxStep((prev) => Math.max(0, prev - 1));
                                          }}
                                          disabled={i2cTxStep <= 0}
                                          type="button"
                                          className="flex-1 py-1.5 font-mono text-[9.5px] uppercase border cursor-pointer rounded-lg bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          ◄ PREV STEP
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (i2cTxStep >= 5) {
                                              setIsI2cTransmitting(false);
                                              setI2cTxStep(-1);
                                            } else {
                                              setI2cTxStep((prev) => prev + 1);
                                            }
                                          }}
                                          type="button"
                                          className="flex-1 py-1.5 font-mono text-[9.5px] uppercase border cursor-pointer rounded-lg bg-sky-500/15 border-sky-500/30 text-sky-400 font-extrabold hover:bg-sky-500/25"
                                        >
                                          {i2cTxStep >= 5 ? "FINISH ⏹" : "NEXT STEP ►"}
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setIsI2cTransmitting(false);
                                          setI2cTxStep(-1);
                                        }}
                                        type="button"
                                        className="w-full mt-1 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 font-bold font-mono text-[9px] uppercase rounded cursor-pointer"
                                      >
                                        RESET SIMULATOR
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setIsI2cTransmitting(true);
                                    setI2cTxStep(0);
                                  }}
                                  disabled={isI2cTransmitting}
                                  type="button"
                                  className={`w-full py-2.5 font-mono text-[10px] font-black uppercase tracking-wider rounded-xl border select-none transition-all duration-300 ${
                                    isI2cTransmitting
                                      ? "bg-slate-950 border-cyan-800/20 text-cyan-500/40 cursor-not-allowed animate-pulse"
                                      : "bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 border-[#06b6d4]/30 hover:border-[#06b6d4]/60 text-cyan-400 cursor-pointer font-bold"
                                  }`}
                                >
                                  {isI2cTransmitting ? `SENDING MASTER FRAME [STEP ${i2cTxStep}/5]` : "FIRE I2C BUS COMMAND"}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <span className="font-mono text-[8px] text-indigo-400 tracking-wider block uppercase font-bold">SPI Setup Panel:</span>
                              <p className="font-sans text-xs text-slate-400 leading-relaxed font-semibold">
                                <strong className="text-white">SPI (Serial Peripheral Interface)</strong> uses 4 wires: 
                                <span className="text-emerald-400 font-mono font-bold ml-1">SCLK</span> (Clock), 
                                <span className="text-rose-400 font-mono font-bold ml-1">MOSI</span> (Master Out), 
                                <span className="text-sky-400 font-mono font-bold ml-1">MISO</span> (Master In), and 
                                <span className="text-purple-400 font-mono font-bold ml-1">CS</span> (Chip Select). 
                                It is a synchronous full-duplex protocol where data is driven continuously in lockstep on SCLK edges.
                              </p>

                              <div className="grid grid-cols-2 gap-3 bg-[#030712] p-3 rounded-lg border border-slate-900">
                                <div className="space-y-1">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase font-black block font-bold">Data Byte to Send:</span>
                                  <select
                                    value={spiData}
                                    onChange={(e) => setSpiData(e.target.value)}
                                    disabled={isSpiTransmitting}
                                    className="w-full bg-slate-950 border border-slate-900 text-slate-200 font-mono text-[10.5px] py-1 px-1.5 rounded outline-none cursor-pointer"
                                  >
                                    <option value="0xD4">0xD4 (11010100)</option>
                                    <option value="0xAA">0xAA (10101010)</option>
                                    <option value="0x55">0x55 (01010101)</option>
                                    <option value="0xBF">0xBF (10111111)</option>
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <span className="font-mono text-[7px] text-slate-500 uppercase font-black block font-bold">SPI Clock Speed:</span>
                                  <div className="font-mono text-[10px] text-indigo-400 bg-slate-950 border border-slate-900 py-1.5 px-2 rounded font-black font-extrabold text-center">
                                    8.0 MHz (Clock SCLK)
                                  </div>
                                </div>
                              </div>

                              {isManualStepMode ? (
                                <div className="space-y-2">
                                  {!isSpiTransmitting ? (
                                    <button
                                      onClick={() => {
                                        setIsSpiTransmitting(true);
                                        setSpiTxStep(0);
                                      }}
                                      type="button"
                                      className="font-bold py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/35 text-[#38bdf8] text-[10px] w-full font-mono uppercase rounded-xl transition-all cursor-pointer"
                                    >
                                      START MANUAL SPI STEPPER
                                    </button>
                                  ) : (
                                    <div className="space-y-2 bg-[#02050f] p-3 rounded-lg border border-slate-900">
                                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                                        <span className="text-slate-500">Step: {spiTxStep} / 9</span>
                                        <span className="text-sky-450 text-[#38bdf8] font-bold uppercase text-[9px]">Stepping Active</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            setSpiTxStep((prev) => Math.max(0, prev - 1));
                                          }}
                                          disabled={spiTxStep <= 0}
                                          type="button"
                                          className="flex-1 py-1.5 font-mono text-[9.5px] uppercase border cursor-pointer rounded-lg bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          ◄ PREV STEP
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (spiTxStep >= 9) {
                                              setIsSpiTransmitting(false);
                                              setSpiTxStep(-1);
                                            } else {
                                              setSpiTxStep((prev) => prev + 1);
                                            }
                                          }}
                                          type="button"
                                          className="flex-1 py-1.5 font-mono text-[9.5px] uppercase border cursor-pointer rounded-lg bg-sky-500/15 border-sky-500/30 text-sky-400 font-extrabold hover:bg-sky-500/25"
                                        >
                                          {spiTxStep >= 9 ? "FINISH ⏹" : "NEXT STEP ►"}
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setIsSpiTransmitting(false);
                                          setSpiTxStep(-1);
                                        }}
                                        type="button"
                                        className="w-full mt-1 py-1 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 font-bold font-mono text-[9px] uppercase rounded cursor-pointer"
                                      >
                                        RESET SIMULATOR
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setIsSpiTransmitting(true);
                                    setSpiTxStep(0);
                                  }}
                                  disabled={isSpiTransmitting}
                                  type="button"
                                  className={`w-full py-2.5 font-mono text-[10px] font-black uppercase tracking-wider rounded-xl border select-none transition-all duration-300 ${
                                    isSpiTransmitting
                                      ? "bg-slate-950 border-indigo-900/40 text-indigo-500/40 cursor-not-allowed animate-pulse"
                                      : "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 hover:border-indigo-500/60 text-indigo-400 cursor-pointer font-bold"
                                  }`}
                                >
                                  {isSpiTransmitting ? `EXCHANGING SPI BYTE [STEP ${spiTxStep}/9]` : "FIRE SPI TRANSMISSION"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="p-3 bg-[#030712] border border-slate-905 rounded-lg text-[10.5px] leading-relaxed text-slate-400 font-sans">
                          {protocolType === "uart" ? (
                            <p>
                              <strong className="text-emerald-400">UART Frame Framing:</strong> To signal transmission, TX pulls low representing a <span className="text-white font-bold">Start Bit</span>. Then, 8 bits of data are driven LSB-first. A <span className="text-white font-bold">Stop Bit</span> returns the line High to idle at 5V.
                            </p>
                          ) : protocolType === "i2c" ? (
                            <p>
                              <strong className="text-cyan-400 font-bold">I2C Master Clock Sync:</strong> SCL forces a clock square pulse. For each tick, SDA toggles. The Master broadcasts address. If target Slave matches, it responds back by pulling SDA Low (<span className="text-white font-bold">ACK</span>).
                            </p>
                          ) : (
                            <p>
                              <strong className="text-indigo-400 font-bold">SPI Sync Exchanger:</strong> CS (Chip Select) pulls Low to wake target Slave. Synchronous clock pulses tick continuously on SCLK wire. At each rising clock edge, MOSI drives Master data bit out, while MISO returns Slave data bit back.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right half animation workspace */}
                      <div className="rounded-xl border border-slate-800 bg-[#030712] p-4 flex flex-col justify-between space-y-4 relative overflow-hidden">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                          <span className="font-mono text-[9px] text-[#34d399] font-extrabold tracking-widest uppercase">STATION B: PHYSICAL SIGNALS VIEW</span>
                          <span className="text-[10px] text-slate-400 font-mono select-none font-bold">
                            {isUartTransmitting || isI2cTransmitting || isSpiTransmitting ? "BUS ACTIVE" : "BUS IDLE"}
                          </span>
                        </div>

                        {protocolType === "uart" ? (
                          /* UART Visualizer */
                          <div className="space-y-4 flex-1 flex flex-col justify-between select-none">
                            {/* Wire Schematic Diagram */}
                            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 relative">
                              <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest block mb-2 font-bold">1-to-1 TX-RX Serial Cable</span>
                              
                              <div className="flex justify-between items-center px-4 relative">
                                <div className="w-12 h-12 bg-[#0d1329] border border-sky-500/30 rounded-lg flex flex-col items-center justify-center text-sky-404 text-sky-400">
                                  <span className="font-mono text-[8.5px] font-bold">MCU_TX</span>
                                  <span className="font-mono text-[7px] text-slate-500 mt-0.5">Caller</span>
                                </div>

                                {/* Wire line */}
                                <div className="flex-1 h-0.5 bg-slate-800 mx-2 relative flex items-center">
                                  {/* Pulsing signal bullet */}
                                  {isUartTransmitting && (
                                    <div 
                                      className="absolute w-3.5 h-3.5 rounded-full bg-emerald-450 bg-emerald-400 flex items-center justify-center text-[7px] font-mono text-black font-extrabold"
                                      style={{
                                        left: `${(uartTxStep / 9) * 90}%`,
                                        transition: "left 0.8s linear",
                                      }}
                                    >
                                      {uartTxStep === 0 ? "S" : uartTxStep === 9 ? "P" : (uartTxStep - 1)}
                                    </div>
                                  )}
                                </div>

                                <div className="w-12 h-12 bg-[#0d1329] border border-yellow-500/30 rounded-lg flex flex-col items-center justify-center text-amber-500">
                                  <span className="font-mono text-[8.5px] font-bold font-bold">DEV_RX</span>
                                  <span className="font-mono text-[7px] text-slate-505 mt-0.5">Listener</span>
                                </div>
                              </div>

                              {/* Dynamic Voltmeter Readout */}
                              <div className="mt-3.5 pt-2 border-t border-slate-900/60 flex items-center justify-between text-[10px] font-mono">
                                <span className="text-slate-550 text-slate-400 font-bold uppercase text-[8px]">Wire Probe (TX Pin):</span>
                                {(() => {
                                  let voltage = "5.0 V";
                                  let stateStr = "HIGH (IDLE)";
                                  let colorClass = "text-emerald-400 bg-emerald-950/30 border border-emerald-500/20";
                                  
                                  if (isUartTransmitting) {
                                    if (uartTxStep === 0) {
                                      voltage = "0.0 V";
                                      stateStr = "LOW (START BIT)";
                                      colorClass = "text-[#f43f5e] bg-rose-950/30 border border-rose-500/20 font-extrabold";
                                    } else if (uartTxStep >= 1 && uartTxStep <= 8) {
                                      const bitsArr = UART_CHAR_BITS[uartChar] ? [...UART_CHAR_BITS[uartChar]].reverse() : [0,0,0,0,0,0,0,0];
                                      const bitVal = bitsArr[uartTxStep - 1];
                                      if (bitVal === 1) {
                                        voltage = "5.0 V";
                                        stateStr = "HIGH (BIT value 1)";
                                        colorClass = "text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 font-extrabold";
                                      } else {
                                        voltage = "0.0 V";
                                        stateStr = "LOW (BIT value 0)";
                                        colorClass = "text-[#f43f5e] bg-rose-950/30 border border-rose-500/20 font-extrabold";
                                      }
                                    } else if (uartTxStep === 9) {
                                      voltage = "5.0 V";
                                      stateStr = "HIGH (STOP BIT)";
                                      colorClass = "text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 font-extrabold";
                                    }
                                  }
                                  return (
                                    <div className="flex items-center gap-2">
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider ${colorClass}`}>{stateStr}</span>
                                      <span className="font-extrabold text-[#f1f5f9] px-1.5 py-0.5 bg-slate-900 border border-slate-900 rounded">{voltage}</span>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* Step indicator readout */}
                            <div className="bg-[#070b13] p-3 rounded-lg border border-slate-900 font-mono text-[10px] space-y-2">
                              <span className="text-slate-500 text-[7px] block uppercase font-bold text-center">ACTIVE TIMELINE STATUS</span>
                              
                              <div className="grid grid-cols-10 gap-0.5 text-center text-[8.5px] font-sans">
                                {/* Start, 8 Data, Stop */}
                                {Array.from({ length: 10 }).map((_, stepIdx) => {
                                  const isPassed = uartTxStep > stepIdx;
                                  const isCurrent = uartTxStep === stepIdx;
                                  
                                  // Binary ASCII bits lookup (LSB first for classical UART transmission)
                                  const bitsArr = UART_CHAR_BITS[uartChar] ? [...UART_CHAR_BITS[uartChar]].reverse() : [0,0,0,0,0,0,0,0];
                                  
                                  return (
                                    <div 
                                      key={stepIdx} 
                                      className={`p-1 border rounded transition-all duration-300 font-mono ${
                                        isCurrent 
                                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-450 font-extrabold animate-pulse" 
                                          : isPassed 
                                          ? "bg-slate-900 border-slate-805 text-slate-500" 
                                          : "bg-slate-950 border-slate-900 text-slate-600"
                                      }`}
                                    >
                                      <div className="text-[7.5px] opacity-75">{stepIdx === 0 ? "START" : stepIdx === 9 ? "STOP" : `D${stepIdx - 1}`}</div>
                                      <div className="font-bold text-[8.5px] mt-1">
                                        {stepIdx === 0 ? "0" : stepIdx === 9 ? "1" : bitsArr[stepIdx - 1]}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="text-center text-[8.5px] text-slate-400 leading-snug pt-1">
                                {uartTxStep === -1 && <span className="text-slate-505">Receiver waiting for START bit frame...</span>}
                                {uartTxStep === 0 && <span className="text-rose-405 text-rose-400 font-semibold font-bold">START BIT: TX pulled LOW (0V) representing data frame start!</span>}
                                {uartTxStep >= 1 && uartTxStep <= 8 && (
                                  <span>
                                    Sending Bit {uartTxStep - 1} of Character '<strong className="text-emerald-450">{uartChar}</strong>': value is <strong className="text-[#34d399]">
                                      {([...(UART_CHAR_BITS[uartChar] ?? [0,0,0,0,0,0,0,0])].reverse())[uartTxStep - 1]}
                                    </strong>
                                  </span>
                                )}
                                {uartTxStep === 9 && <span className="text-[#38bdf8] font-bold font-semibold">STOP BIT: TX line raised back to idle HIGH (5V). Capture registered!</span>}
                              </div>
                            </div>
                          </div>
                        ) : protocolType === "i2c" ? (
                          /* I2C Visualizer */
                          <div className="space-y-4 flex-1 flex flex-col justify-between select-none">
                            {/* Bus network diagram */}
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 relative space-y-2.5">
                              <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest block font-bold mb-1">Dual Cable Multi-Drop Bus</span>
                              
                              {/* Master Node */}
                              <div className="flex flex-col items-center">
                                <div className="px-2.5 py-1 bg-[#0b1229] border border-cyan-500/20 rounded font-mono text-[8px] text-cyan-400 font-bold mb-1.5">
                                  Master Controller
                                </div>
                              </div>

                              {/* Shared buses details */}
                              <div className="space-y-1.5 px-6 relative">
                                {/* SCL Wires */}
                                <div className="flex items-center">
                                  <span className="font-mono text-[6.5px] text-[#f59e0b] w-6 uppercase font-black">Scl:</span>
                                  <div className="flex-1 h-0.5 bg-[#f59e0b]/20 relative">
                                    {isI2cTransmitting && (
                                      <div className="absolute inset-x-0 h-full bg-[#f59e0b] animate-pulse" />
                                    )}
                                  </div>
                                </div>
                                {/* SDA Wires */}
                                <div className="flex items-center">
                                  <span className="font-mono text-[6.5px] text-cyan-400 w-6 uppercase font-black font-bold">Sda:</span>
                                  <div className="flex-1 h-0.5 bg-cyan-500/20 relative">
                                    {isI2cTransmitting && (
                                      <div className="absolute inset-x-0 h-full bg-cyan-400 animate-pulse" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Two Slaves */}
                              <div className="grid grid-cols-2 gap-4 mt-3 font-sans">
                                {/* Slave 0x2A */}
                                <div className={`p-2 border rounded-xl flex flex-col items-center justify-center transition-all text-center ${
                                  i2cAddress === "0x2A" && i2cTxStep >= 2
                                    ? "bg-emerald-950/20 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)] text-emerald-400"
                                    : "bg-[#0b0f19] border-slate-900 text-slate-505"
                                }`}>
                                  <span className="font-mono text-[8px] font-black uppercase">SLAVE [0x2A]</span>
                                  <span className="font-mono text-[6.5px] text-slate-500">I2C Photo-Sensor</span>
                                  {i2cAddress === "0x2A" && i2cTxStep === 2 && (
                                    <span className="font-sans text-[7px] text-emerald-400 animate-pulse mt-0.5 font-bold">ACK REGISTERED!!</span>
                                  )}
                                </div>

                                {/* Slave 0x3F */}
                                <div className={`p-2 border rounded-xl flex flex-col items-center justify-center transition-all text-center ${
                                  i2cAddress === "0x3F" && i2cTxStep >= 2
                                    ? "bg-emerald-950/30 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)] text-emerald-400"
                                    : "bg-[#0b0f19] border-slate-900 text-slate-505"
                                }`}>
                                  <span className="font-mono text-[8px] font-black uppercase">SLAVE [0x3F]</span>
                                  <span className="font-mono text-[6.5px] text-slate-500">I2C OLED Screen</span>
                                  {i2cAddress === "0x3F" && i2cTxStep === 2 && (
                                    <span className="font-sans text-[7px] text-emerald-400 animate-pulse mt-0.5 font-bold font-bold">ACK REGISTERED!!</span>
                                  )}
                                </div>
                              </div>

                              {/* Dynamic Dual-Probe Voltmeter Readout */}
                              <div className="mt-3 pt-2 border-t border-slate-900/60 grid grid-cols-2 gap-4 text-[9.5px] font-mono">
                                <div className="flex items-center justify-between">
                                  <span className="text-[#f59e0b] font-bold text-[8px] uppercase">SCL Clock:</span>
                                  {(() => {
                                    let volt = "5.0 V";
                                    let clkState = "HIGH";
                                    if (isI2cTransmitting) {
                                      if (i2cTxStep === 0) {
                                        volt = "5.0 V";
                                      } else if (i2cTxStep === 4) {
                                        volt = "5.0 V";
                                      } else {
                                        volt = "PULSING";
                                        clkState = "0 <-> 5V";
                                      }
                                    }
                                    return (
                                      <span className="font-extrabold text-[#f1f5f9] px-1 bg-[#22d3ee]/5 rounded text-[8.5px]">{volt} {volt !== "PULSING" && `(${clkState})`}</span>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center justify-between border-l border-slate-900/40 pl-4">
                                  <span className="text-cyan-400 font-bold text-[8px] uppercase">SDA Data:</span>
                                  {(() => {
                                    let volt = "5.0 V";
                                    let stateStr = "HIGH";
                                    if (isI2cTransmitting) {
                                      if (i2cTxStep === 0) {
                                        volt = "0.0 V";
                                        stateStr = "LOW";
                                      } else if (i2cTxStep === 1) {
                                        volt = "PULSING";
                                        stateStr = "DATA";
                                      } else if (i2cTxStep === 2) {
                                        volt = "0.0 V";
                                        stateStr = "LOW";
                                      } else if (i2cTxStep === 3) {
                                        volt = "PULSING";
                                        stateStr = "DATA";
                                      } else if (i2cTxStep === 4) {
                                        volt = "5.0 V";
                                        stateStr = "HIGH";
                                      }
                                    }
                                    return (
                                      <span className="font-extrabold text-[#f1f5f9] px-1 bg-[#22d3ee]/5 rounded text-[8.5px]">{volt} {volt !== "PULSING" && `(${stateStr})`}</span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>

                            {/* Step Status detail */}
                            <div className="bg-[#070b13] p-2 rounded-lg border border-slate-900 font-mono text-[9px] space-y-1 text-center font-sans pr-1">
                              <span className="text-slate-500 text-[7px] uppercase font-bold block mb-1 font-mono">I2C BUS SEQUENCE STAGES</span>
                              
                              <div className="grid grid-cols-5 gap-0.5 text-[8.5px] text-center text-white">
                                {["START", "ADDR", "ACK", "WRITE", "STOP"].map((stage, idx) => {
                                  const isPassed = i2cTxStep > idx;
                                  const isCurrent = i2cTxStep === idx;
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-1 border rounded transition-all duration-300 font-mono ${
                                        isCurrent
                                          ? "bg-cyan-950 border-cyan-500 text-cyan-400 font-extrabold animate-pulse"
                                          : isPassed
                                          ? "bg-slate-900 border-slate-805 text-slate-500"
                                          : "bg-slate-950 border-slate-900 text-slate-600"
                                      }`}
                                    >
                                      {stage}
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="text-slate-400 text-[8.5px] leading-snug pt-1 font-mono">
                                {i2cTxStep === -1 && <span className="text-slate-500">Bus line free. SDA and SCL stay idle HIGH (Pull-up resistors bound).</span>}
                                {i2cTxStep === 0 && <span className="text-cyan-400 font-bold font-semibold">START: Master pulls SDA LOW while SCL stays HIGH. Bus claimed!</span>}
                                {i2cTxStep === 1 && <span>Frame: Master broadcasts addressing frame byte <strong className="text-amber-400 font-bold">{i2cAddress}</strong></span>}
                                {i2cTxStep === 2 && <span className="text-emerald-400 font-bold font-semibold">ACKNOWLEDGE: Target Slave pulled digital SDA LOW to verify connection match!</span>}
                                {i2cTxStep === 3 && <span>Writing data payload byte packet <strong className="text-cyan-400 font-bold">{i2cData}</strong> down the bus line</span>}
                                {i2cTxStep === 4 && <span className="text-indigo-400 font-bold font-semibold">STOP SEQUENCE: Master releases SDA back to high while SCL is high. Bus free!</span>}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* SPI Visualizer */
                          <div className="space-y-4 flex-1 flex flex-col justify-between select-none">
                            {/* Bus network diagram */}
                            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 relative space-y-2">
                              <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest block font-bold mb-1">Standard SPI 4-Wire Circuit</span>
                              
                              <div className="flex justify-between items-center px-2">
                                {/* Controller block */}
                                <div className="p-2 bg-indigo-950/40 border border-indigo-500/30 rounded text-center min-w-[70px]">
                                  <span className="font-mono text-[8px] font-black text-indigo-400 block font-bold">SPI MASTER</span>
                                  <span className="font-mono text-[6.5px] text-slate-505 text-slate-500">Controller</span>
                                </div>

                                {/* Slave block */}
                                <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded text-center min-w-[70px]">
                                  <span className="font-mono text-[8px] font-black text-purple-400 block font-bold">SPI SLAVE</span>
                                  <span className="font-mono text-[6.5px] text-slate-505 text-slate-500">Peripheral</span>
                                </div>
                              </div>

                              {/* Wires container */}
                              <div className="space-y-1.5 px-6 pt-1 font-mono text-[7px]">
                                {/* CS Select line */}
                                <div className="flex items-center font-bold">
                                  <span className="text-purple-400 w-8 text-left">CS:</span>
                                  <div className="flex-1 h-0.5 bg-purple-500/20 relative">
                                    <div className={`absolute inset-x-0 h-full ${spiTxStep >= 0 && spiTxStep < 9 ? "bg-purple-500 animate-pulse" : "bg-slate-800"}`} />
                                  </div>
                                  <span className="text-[6.5px] text-slate-500 ml-2">
                                    {spiTxStep >= 0 && spiTxStep < 9 ? "LOW (ACTIVE)" : "HIGH (IDLE)"}
                                  </span>
                                </div>

                                {/* SCLK Clock line */}
                                <div className="flex items-center font-bold">
                                  <span className="text-emerald-400 w-8 text-left">SCLK:</span>
                                  <div className="flex-1 h-0.5 bg-emerald-500/20 relative">
                                    <div className={`absolute inset-x-0 h-full ${spiTxStep >= 1 && spiTxStep <= 8 ? "bg-emerald-400 animate-pulse" : "bg-slate-800"}`} />
                                  </div>
                                  <span className="text-[6.5px] text-slate-500 ml-2">
                                    {spiTxStep >= 1 && spiTxStep <= 8 ? "PULSING" : "IDLE"}
                                  </span>
                                </div>

                                {/* MOSI Output line */}
                                <div className="flex items-center font-bold">
                                  <span className="text-rose-400 w-8 text-left">MOSI:</span>
                                  <div className="flex-1 h-0.5 bg-rose-500/20 relative flex items-center">
                                    <div className={`absolute inset-x-0 h-full ${spiTxStep >= 1 && spiTxStep <= 8 ? "bg-rose-500/50" : "bg-slate-800"}`} />
                                    {isSpiTransmitting && spiTxStep >= 1 && spiTxStep <= 8 && (
                                      <div 
                                        className="absolute w-2.5 h-2.5 rounded-full bg-rose-400"
                                        style={{
                                          left: `${((spiTxStep - 1) / 7) * 90}%`,
                                          transition: "left 0.7s linear"
                                        }}
                                      />
                                    )}
                                  </div>
                                  <span className="text-[6.5px] text-slate-500 ml-2 font-normal animate-pulse">OUT</span>
                                </div>

                                {/* MISO Input line */}
                                <div className="flex items-center font-bold">
                                  <span className="text-sky-400 w-8 text-left">MISO:</span>
                                  <div className="flex-1 h-0.5 bg-sky-500/20 relative flex items-center">
                                    <div className={`absolute inset-x-0 h-full ${spiTxStep >= 1 && spiTxStep <= 8 ? "bg-sky-500/50" : "bg-slate-800"}`} />
                                    {isSpiTransmitting && spiTxStep >= 1 && spiTxStep <= 8 && (
                                      <div 
                                        className="absolute w-2.5 h-2.5 rounded-full bg-sky-400"
                                        style={{
                                          right: `${((spiTxStep - 1) / 7) * 90}%`,
                                          transition: "right 0.7s linear"
                                        }}
                                      />
                                    )}
                                  </div>
                                  <span className="text-[6.5px] text-slate-500 ml-2 font-normal animate-pulse">IN</span>
                                </div>
                              </div>

                              {/* Dynamic Quad-Probe Voltmeter Readout */}
                              <div className="mt-3 pt-2 border-t border-slate-900/60 grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] font-mono">
                                <div className="flex items-center justify-between">
                                  <span className="text-purple-400 font-bold text-[8px] uppercase">CS Pin:</span>
                                  <span className="font-extrabold text-[#f1f5f9] px-1 bg-slate-900 border border-slate-800 rounded">
                                    {spiTxStep >= 0 && spiTxStep < 9 ? "0.0 V" : "5.0 V"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between border-l border-slate-900/40 pl-4">
                                  <span className="text-emerald-400 font-bold text-[8px] uppercase">SCLK pin:</span>
                                  <span className="font-extrabold text-[#f1f5f9] px-1 bg-slate-900 border border-slate-800 rounded">
                                    {spiTxStep >= 1 && spiTxStep <= 8 ? "PULSING" : "0.0 V"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-rose-455 text-[#f43f5e] font-bold text-[8px] uppercase">MOSI Node:</span>
                                  <span className="font-extrabold text-[#f1f5f9] px-1 bg-slate-900 border border-slate-800 rounded">
                                    {(() => {
                                      if (spiTxStep >= 1 && spiTxStep <= 8) {
                                        const bitVal = spiData === "0xD4" ? [1,1,0,1,0,1,0,0][spiTxStep - 1] : spiData === "0xAA" ? ((8 - spiTxStep) % 2 === 0 ? 0 : 1) : 1;
                                        return bitVal === 1 ? "5.0 V" : "0.0 V";
                                      }
                                      return "0.0 V";
                                    })()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between border-l border-slate-900/40 pl-4">
                                  <span className="text-sky-400 font-bold text-[8px] uppercase">MISO Node:</span>
                                  <span className="font-extrabold text-slate-500 px-1 bg-slate-900 border border-slate-800 rounded">0.0 V</span>
                                </div>
                              </div>
                            </div>

                            {/* SPI Timeline */}
                            <div className="bg-[#070b13] p-2.5 rounded-lg border border-slate-900 font-mono text-[9px] space-y-1.5 text-center">
                              <span className="text-slate-500 text-[7px] uppercase font-bold block mb-1">SPI BUS TRANSMISSION TIMELINE</span>
                              
                              <div className="grid grid-cols-10 gap-0.5 text-[8px] text-center text-white">
                                {["CS_L", "D7", "D6", "D5", "D4", "D3", "D2", "D1", "D0", "CS_H"].map((stage, idx) => {
                                  const isCurrent = spiTxStep === idx;
                                  const isPassed = spiTxStep > idx;
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-1.5 border rounded transition-all duration-300 font-mono leading-none ${
                                        isCurrent
                                          ? "bg-indigo-950 border-indigo-500 text-indigo-400 font-extrabold animate-pulse"
                                          : isPassed
                                          ? "bg-slate-900 border-slate-805 text-slate-500 font-medium"
                                          : "bg-slate-950 border-slate-900 text-slate-600"
                                      }`}
                                    >
                                      {stage}
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="text-slate-400 text-[8px] leading-snug pt-1 font-mono text-center">
                                {spiTxStep === -1 && <span className="text-slate-500">SPI Mode 0. Clock stays LOW. CS is HIGH (Slave disabled).</span>}
                                {spiTxStep === 0 && <span className="text-purple-400 font-bold">CS DETECTED: Chip Select pulled LOW. Slave registers woke up!</span>}
                                {spiTxStep >= 1 && spiTxStep <= 8 && (
                                  <span>
                                    Exchanging Bit {8 - spiTxStep} ({spiTxStep === 1 ? "MSB" : spiTxStep === 8 ? "LSB" : "Data"}): MOSI drives <strong className="text-rose-400 font-bold font-bold">{spiData === "0xAA" ? ((8 - spiTxStep) % 2 === 0 ? "0" : "1") : spiData === "0x55" ? ((8 - spiTxStep) % 2 === 0 ? "1" : "0") : spiData === "0xD4" ? ([1,1,0,1,0,1,0,0][spiTxStep - 1]) : "1"}</strong> while MISO returns <strong className="text-sky-400 font-bold font-bold">0</strong>.
                                  </span>
                                )}
                                {spiTxStep === 9 && <span className="text-indigo-400 font-bold">CS RELEASED: Chip Select raised back HIGH. SPI transaction completes!</span>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      )}

      {/* 7-Segment Interactive Modal Render */}
      <SevenSegInteractiveModal
        isOpen={isSevenSegModalOpen}
        onClose={() => {
          setIsSevenSegModalOpen(false);
          setSevenSegAutoCount(false);
        }}
        sevenSegModalTab={sevenSegModalTab}
        setSevenSegModalTab={setSevenSegModalTab}
        sevenSegSelectedSegment={sevenSegSelectedSegment}
        setSevenSegSelectedSegment={setSevenSegSelectedSegment}
        sevenSegAutoCount={sevenSegAutoCount}
        setSevenSegAutoCount={setSevenSegAutoCount}
        binaryBits={binaryBits}
        setBinaryBits={setBinaryBits}
        shiftRegisterBits={shiftRegisterBits}
        setShiftRegisterBits={setShiftRegisterBits}
        shiftRegisterOutputBits={shiftRegisterOutputBits}
        setShiftRegisterOutputBits={setShiftRegisterOutputBits}
        shiftRegisterSerPin={shiftRegisterSerPin}
        setShiftRegisterSerPin={setShiftRegisterSerPin}
        shiftRegAnimStep={shiftRegAnimStep}
        setShiftRegAnimStep={setShiftRegAnimStep}
        pushShiftClock={pushShiftClock}
        pushLatchClock={pushLatchClock}
        startAutoShift={startAutoShift}
      />

      {/* Combined Series & Parallel Circuit Sandbox Modal */}
      <AnimatePresence>
        {isCombinedCircuitModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden animate-fadeIn" id="combined-circuit-sandbox-modal">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsCombinedCircuitModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] overflow-y-auto rounded-2xl border-2 border-slate-705 bg-[#090e1f] p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 text-left z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-sm md:text-base text-white uppercase tracking-wider">
                      Combined Series &amp; Parallel Circuit Sandbox
                    </h3>
                    <p className="font-sans text-[11px] text-slate-405 text-slate-400">
                      Observe complex hardware branch dependencies, live node voltage attenuation, and current splitting physics
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsCombinedCircuitModalOpen(false)}
                  className="p-1 px-3 text-xs font-mono border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer select-none"
                >
                  Close (ESC)
                </button>
              </div>

              {/* Informational guide */}
              <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl">
                <p className="font-sans text-xs text-slate-400 leading-relaxed">
                  <span className="text-indigo-400 font-bold uppercase font-mono mr-1.5">[TOPOLOGY BLUEPRINT]</span>
                  This circuit has multiple dependent components: <strong>BULB-1 sits in Series</strong> with the power source, while <strong>BULB-A and BULB-B sit in Parallel</strong> branches. Click any slide-switch in the interactive diagram or use the toggle buttons below to study the resulting flow mechanics.
                </p>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Visual circuit canvas left */}
                <div className="lg:col-span-7 flex flex-col space-y-4">
                  <div className="text-xs font-mono text-slate-500 font-extrabold uppercase tracking-wider block">
                    Interactive Dynamic Circuit Schematic
                  </div>

                  <div className="relative py-4 px-2 bg-slate-950 border border-slate-900 rounded-2xl flex items-center justify-center">
                    {/* SVG Diagram */}
                    {(() => {
                      const seriesLit = !isCombinedMainCut && (!isCombinedBranchACut || !isCombinedBranchBCut);
                      const branchALit = !isCombinedMainCut && !isCombinedBranchACut;
                      const branchBLit = !isCombinedMainCut && !isCombinedBranchBCut;

                      return (
                        <svg viewBox="0 0 380 230" className="w-full h-auto select-none overflow-visible">
                          {/* Main background wiring */}
                          {/* Battery output up and over */}
                          <path d="M 35 110 V 45 H 105" fill="none" stroke={isCombinedMainCut ? "#1e293b" : "#10b981"} strokeWidth="2.5" className="transition-all duration-300" />
                          {/* Between switches and Series LED */}
                          <path d="M 135 45 H 170" fill="none" stroke={isCombinedMainCut ? "#1e293b" : "#10b981"} strokeWidth="2.5" className="transition-all duration-300" />
                          <path d="M 210 45 H 240" fill="none" stroke={seriesLit ? "#10b981" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />
                          
                          {/* Top Branch A wire */}
                          <path d="M 240 45 V 95 H 255" fill="none" stroke={branchALit ? "#34d399" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />
                          <path d="M 285 95 H 300" fill="none" stroke={branchALit ? "#34d399" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />
                          <path d="M 335 95 H 350 L 350 115" fill="none" stroke={branchALit ? "#34d399" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />

                          {/* Bottom Branch B wire */}
                          <path d="M 240 45 V 155 H 255" fill="none" stroke={branchBLit ? "#34d399" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />
                          <path d="M 285 155 H 300" fill="none" stroke={branchBLit ? "#34d399" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />
                          <path d="M 335 155 H 350 L 350 115" fill="none" stroke={branchBLit ? "#34d399" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />

                          {/* Common Return wire to Battery ground */}
                          <path d="M 350 115 H 355 V 195 H 35 V 135" fill="none" stroke={seriesLit ? "#10b981" : "#1e293b"} strokeWidth="2.5" className="transition-all duration-300" />

                          {/* Split/Rejoin Dots */}
                          <circle cx="240" cy="45" r="3" fill={seriesLit ? "#10b981" : "#334155"} />
                          <circle cx="350" cy="115" r="3" fill={seriesLit ? "#10b981" : "#334155"} />

                          {/* Solid flow visualizer animations */}
                          {seriesLit && (
                            <>
                              {/* Main Series Loop Electrons */}
                              {[0, 0.33, 0.67].map((offset, i) => (
                                <circle key={`main-e-${i}`} r="2" fill="#34d399">
                                  <animateMotion
                                    path="M 35 110 V 45 H 105 M 135 45 H 170 M 210 45 H 240"
                                    dur="2.5s"
                                    begin={`${offset * 2.5}s`}
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              ))}

                              {/* Common Ground Return Electrons */}
                              {[0.12, 0.45, 0.78].map((offset, i) => (
                                <circle key={`rtn-e-${i}`} r="2" fill="#34d399">
                                  <animateMotion
                                    path="M 350 115 H 355 V 195 H 35 V 135"
                                    dur="3.2s"
                                    begin={`${offset * 3.2}s`}
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              ))}
                            </>
                          )}

                          {branchALit && (
                            <>
                              {/* Branch A Electrons */}
                              {[0, 0.5].map((offset, i) => (
                                <circle key={`ba-e-${i}`} r="2" fill="#34d399">
                                  <animateMotion
                                    path="M 240 45 V 95 H 255 M 285 95 H 300 M 335 95 H 350"
                                    dur="1.8s"
                                    begin={`${offset * 1.8}s`}
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              ))}
                            </>
                          )}

                          {branchBLit && (
                            <>
                              {/* Branch B Electrons */}
                              {[0.25, 0.75].map((offset, i) => (
                                <circle key={`bb-e-${i}`} r="2" fill="#34d399">
                                  <animateMotion
                                    path="M 240 45 V 155 H 255 M 285 155 H 300 M 335 155 H 350"
                                    dur="1.8s"
                                    begin={`${offset * 1.8}s`}
                                    repeatCount="indefinite"
                                  />
                                </circle>
                              ))}
                            </>
                          )}

                          {/* Power Battery 9V representation */}
                          <g>
                            <rect x="23" y="102" width="14" height="4" fill="#3b82f6" rx="1" />
                            <rect x="15" y="105" width="30" height="30" rx="3" fill="#172554" stroke="#3b82f6" strokeWidth="1.5" />
                            <text x="30" y="118" textAnchor="middle" className="fill-white font-sans text-[9px] font-black">+</text>
                            <text x="30" y="130" textAnchor="middle" className="fill-slate-400 font-sans text-[9px] font-black">-</text>
                            <text x="56" y="122" textAnchor="start" className="fill-blue-400 font-mono text-[8px] font-black flex items-center gap-1">9V Source</text>
                          </g>

                          {/* SW-1 MAIN SWITCH at x=105 to 135 */}
                          <g className="cursor-pointer" onClick={() => setIsCombinedMainCut(!isCombinedMainCut)}>
                            <circle cx="105" cy="45" r="3.2" fill="#64748b" />
                            <circle cx="135" cy="45" r="3.2" fill="#64748b" />
                            {isCombinedMainCut ? (
                              <line x1="105" y1="45" x2="128" y2="28" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                            ) : (
                              <line x1="105" y1="45" x2="135" y2="45" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                            )}
                            <text x="120" y="22" textAnchor="middle" className={`font-mono text-[8.5px] font-extrabold ${isCombinedMainCut ? "fill-rose-400" : "fill-emerald-400"}`}>
                              SW-MAIN: {isCombinedMainCut ? "OPEN" : "CLOSED"}
                            </text>
                          </g>

                          {/* Bulb-1 Series at x=190, y=45 */}
                          <g>
                            {seriesLit && (
                              <>
                                <circle cx="190" cy="41" r="22" fill="rgba(234, 179, 8, 0.16)" className="animate-pulse" />
                                <circle cx="190" cy="41" r="14" fill="rgba(254, 240, 138, 0.28)" />
                              </>
                            )}
                            {/* Screw metallic base with thread details */}
                            <rect x="186" y="50" width="8" height="4" fill="#64748b" rx="1" />
                            <rect x="187" y="54" width="6" height="2" fill="#475569" rx="0.5" />
                            {/* Glass bulb dynamic bulbous shape */}
                            <path d="M 182 46 C 178 37 180 29 190 29 C 200 29 202 37 198 46 L 194 50 L 186 50 Z" 
                                  fill={seriesLit ? "rgba(253, 224, 71, 0.35)" : "#131a31"} 
                                  stroke={seriesLit ? "#facc15" : "#475569"} 
                                  strokeWidth="1.5" />
                            {/* Inner filament supports */}
                            <path d="M 186.5 50 L 188 43 M 193.5 50 L 192 43" stroke={seriesLit ? "#eab308" : "#475569"} strokeWidth="1" />
                            {/* Glowing filament loop */}
                            <path d="M 188 43 Q 190 38 192 43" fill="none" stroke={seriesLit ? "#fef08a" : "#475569"} strokeWidth="1.3" strokeLinecap="round" />
                            <text x="190" y="65" textAnchor="middle" className={`font-mono text-[8.5px] font-extrabold ${seriesLit ? "fill-amber-400" : "fill-slate-500"}`}>BULB-1 [SERIES]</text>
                          </g>

                          {/* SW-A Branch A at x=255 to 285, y=95 */}
                          <g className="cursor-pointer" onClick={() => setIsCombinedBranchACut(!isCombinedBranchACut)}>
                            <circle cx="255" cy="95" r="3" fill="#64748b" />
                            <circle cx="285" cy="95" r="3" fill="#64748b" />
                            {isCombinedBranchACut ? (
                              <line x1="255" y1="95" x2="278" y2="78" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                            ) : (
                              <line x1="255" y1="95" x2="285" y2="95" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                            )}
                            <text x="270" y="112" textAnchor="middle" className={`font-mono text-[7px] font-bold ${isCombinedBranchACut ? "fill-rose-400" : "fill-emerald-400"}`}>
                              SW-A
                            </text>
                          </g>

                          {/* Bulb-A Parallel 1 at x=318, y=95 */}
                          <g>
                            {branchALit && (
                              <>
                                <circle cx="318" cy="91" r="18" fill="rgba(234, 179, 8, 0.16)" className="animate-pulse" />
                                <circle cx="318" cy="91" r="11" fill="rgba(254, 240, 138, 0.28)" />
                              </>
                            )}
                            {/* Base */}
                            <rect x="314" y="100" width="8" height="4" fill="#64748b" rx="1" />
                            <rect x="315" y="104" width="6" height="2" fill="#475569" rx="0.5" />
                            {/* Glass */}
                            <path d="M 310 96 C 306 87 308 79 318 79 C 328 79 330 87 326 96 L 322 100 L 314 100 Z" 
                                  fill={branchALit ? "rgba(253, 224, 71, 0.35)" : "#131a31"} 
                                  stroke={branchALit ? "#facc15" : "#475569"} 
                                  strokeWidth="1.5" />
                            {/* Filament supports */}
                            <path d="M 314.5 100 L 316 93 M 321.5 100 L 320 93" stroke={branchALit ? "#eab308" : "#475569"} strokeWidth="1" />
                            {/* Filament loop */}
                            <path d="M 316 93 Q 318 88 320 93" fill="none" stroke={branchALit ? "#fef08a" : "#475569"} strokeWidth="1.3" strokeLinecap="round" />
                            <text x="318" y="115" textAnchor="middle" className={`font-mono text-[7.5px] font-bold ${branchALit ? "fill-amber-400" : "fill-slate-500"}`}>BULB-A (P1)</text>
                          </g>

                          {/* SW-B Branch B at x=255 to 285, y=155 */}
                          <g className="cursor-pointer" onClick={() => setIsCombinedBranchBCut(!isCombinedBranchBCut)}>
                            <circle cx="255" cy="155" r="3" fill="#64748b" />
                            <circle cx="285" cy="155" r="3" fill="#64748b" />
                            {isCombinedBranchBCut ? (
                              <line x1="255" y1="155" x2="278" y2="138" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                            ) : (
                              <line x1="255" y1="155" x2="285" y2="155" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                            )}
                            <text x="270" y="172" textAnchor="middle" className={`font-mono text-[7px] font-bold ${isCombinedBranchBCut ? "fill-rose-400" : "fill-emerald-400"}`}>
                              SW-B
                            </text>
                          </g>

                          {/* Bulb-B Parallel 2 at x=318, y=155 */}
                          <g>
                            {branchBLit && (
                              <>
                                <circle cx="318" cy="151" r="18" fill="rgba(234, 179, 8, 0.16)" className="animate-pulse" />
                                <circle cx="318" cy="151" r="11" fill="rgba(254, 240, 138, 0.28)" />
                              </>
                            )}
                            {/* Base */}
                            <rect x="314" y="160" width="8" height="4" fill="#64748b" rx="1" />
                            <rect x="315" y="164" width="6" height="2" fill="#475569" rx="0.5" />
                            {/* Glass */}
                            <path d="M 310 156 C 306 147 308 139 318 139 C 328 139 330 147 326 156 L 322 160 L 314 160 Z" 
                                  fill={branchBLit ? "rgba(253, 224, 71, 0.35)" : "#131a31"} 
                                  stroke={branchBLit ? "#facc15" : "#475569"} 
                                  strokeWidth="1.5" />
                            {/* Filament supports */}
                            <path d="M 314.5 160 L 316 153 M 321.5 160 L 320 153" stroke={branchBLit ? "#eab308" : "#475569"} strokeWidth="1" />
                            {/* Filament loop */}
                            <path d="M 316 153 Q 318 148 320 153" fill="none" stroke={branchBLit ? "#fef08a" : "#475569"} strokeWidth="1.3" strokeLinecap="round" />
                            <text x="318" y="175" textAnchor="middle" className={`font-mono text-[7.5px] font-bold ${branchBLit ? "fill-amber-400" : "fill-slate-500"}`}>BULB-B (P2)</text>
                          </g>
                        </svg>
                      );
                    })()}
                  </div>
                </div>

                {/* Dashboard / diagnostics control panel right */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="text-xs font-mono text-slate-500 font-extrabold uppercase tracking-wider block">
                    Telemetry &amp; Circuit Diagnostics
                  </div>

                  {(() => {
                    const isPowerflowing = !isCombinedMainCut;
                    const bAClosed = !isCombinedBranchACut;
                    const bBClosed = !isCombinedBranchBCut;
                    
                    const isBranchAFlowing = isPowerflowing && bAClosed;
                    const isBranchBFlowing = isPowerflowing && bBClosed;
                    const isSeriesGlowing = isBranchAFlowing || isBranchBFlowing;

                    // Compute physical circuit mathematics
                    let rTotalStr = "Disconnected (∞)";
                    let iTotal = 0;
                    let vLed1 = 0;
                    let vNode = 9.0;

                    if (isPowerflowing) {
                      if (bAClosed && bBClosed) {
                        // Parallel 150 & 150 = 75 ohm. Series 100 ohm. Total R = 175 ohm
                        rTotalStr = "175 Ω (Balanced Parallel/Series)";
                        iTotal = 51.4;
                        vLed1 = 5.14;
                        vNode = 3.86;
                      } else if (bAClosed) {
                        // Series 100 + 150 = 250 ohm
                        rTotalStr = "250 Ω (Series Branch A)";
                        iTotal = 36.0;
                        vLed1 = 3.60;
                        vNode = 5.40;
                      } else if (bBClosed) {
                        // Series 100 + 150 = 250 ohm
                        rTotalStr = "250 Ω (Series Branch B)";
                        iTotal = 36.0;
                        vLed1 = 3.60;
                        vNode = 5.40;
                      } else {
                        rTotalStr = "Infinite (Broken Branches)";
                      }
                    }

                    return (
                      <>
                        <div className="bg-slate-950 p-4 border border-slate-900 rounded-2xl space-y-3.5">
                          {/* Live parameters */}
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="bg-[#050816] p-2.5 rounded-xl border border-slate-900">
                              <span className="text-[8px] text-slate-500 uppercase font-black block">SYS CURRENT INTENSITY</span>
                              <span className={`text-sm font-black transition-colors ${iTotal > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                                {iTotal.toFixed(1)} mA
                              </span>
                            </div>

                            <div className="bg-[#050816] p-2.5 rounded-xl border border-slate-900">
                              <span className="text-[8px] text-slate-505 text-slate-500 uppercase font-black block">BULB-1 DROP VOLTAGE</span>
                              <span className={`text-sm font-black transition-colors ${vLed1 > 0 ? "text-purple-400" : "text-slate-400"}`}>
                                {vLed1.toFixed(2)} Volts
                              </span>
                            </div>

                            <div className="bg-[#050816] p-2.5 rounded-xl border border-slate-900">
                              <span className="text-[8px] text-slate-505 text-slate-500 uppercase font-black block">SPLITTER NODE LEVEL</span>
                              <span className={`text-sm font-black transition-colors ${iTotal > 0 ? "text-amber-400" : "text-slate-400"}`}>
                                {vNode.toFixed(2)} Volts
                              </span>
                            </div>

                            <div className="bg-[#050816] p-2.5 rounded-xl border border-slate-900">
                              <span className="text-[8px] text-slate-550 text-slate-500 uppercase font-black block">EQUIV ELECTRICAL R</span>
                              <span className="text-[10px] text-white font-black truncate leading-normal block pt-0.5">
                                {rTotalStr}
                              </span>
                            </div>
                          </div>

                          {/* Bulb Status Grid */}
                          <div className="border-t border-[#0f172a] pt-3 space-y-2 text-xs">
                            <span className="text-[8px] text-slate-505 text-slate-500 font-extrabold uppercase tracking-wider block font-mono">Component Operating States:</span>
                            
                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#050816]/60 border border-slate-900 leading-none">
                              <span className="font-mono text-[9px] text-purple-300 font-bold">BULB-1 (SERIES COMPONENT)</span>
                              <span className={`font-mono text-[9px] font-black uppercase ${isSeriesGlowing ? "text-purple-400 animate-pulse" : "text-slate-600"}`}>
                                {isSeriesGlowing ? "ON (GLOWING)" : "OFF (DARK)"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#050816]/60 border border-slate-900 leading-none">
                              <span className="font-mono text-[9px] text-rose-300 font-bold">BULB-A (PARALLEL BRANCH A)</span>
                              <span className={`font-mono text-[9px] font-black uppercase ${isBranchAFlowing ? "text-rose-400 animate-pulse" : "text-slate-600"}`}>
                                {isBranchAFlowing ? "ON (GLOWING)" : "OFF (DARK)"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#050816]/60 border border-slate-900 leading-none">
                              <span className="font-mono text-[9px] text-blue-300 font-bold">BULB-B (PARALLEL BRANCH B)</span>
                              <span className={`font-mono text-[9px] font-black uppercase ${isBranchBFlowing ? "text-blue-400 animate-pulse" : "text-slate-600"}`}>
                                {isBranchBFlowing ? "ON (GLOWING)" : "OFF (DARK)"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Slide Controls */}
                        <div className="bg-slate-950 p-4 border border-slate-900 rounded-2xl space-y-3">
                          <span className="text-[8px] text-slate-505 text-slate-550 text-slate-500 font-extrabold uppercase tracking-wider block font-mono">Interactive Swivel Controls</span>
                          
                          <div className="space-y-2 text-xs">
                            {/* Control Master Switch */}
                            <div className="flex items-center justify-between bg-[#040813] p-2 rounded-xl border border-slate-900">
                              <div className="text-left font-sans">
                                <h5 className="font-bold text-[10.5px] text-slate-101 text-slate-200">MAIN SW / SOURCE CABLE</h5>
                                <p className="text-[8px] text-slate-500 font-mono leading-none">Sits in series; cuts all paths</p>
                              </div>
                              <button
                                onClick={() => setIsCombinedMainCut(!isCombinedMainCut)}
                                className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded border cursor-pointer select-none transition-all duration-150 ${
                                  isCombinedMainCut
                                    ? "bg-rose-950/20 border-rose-900 text-rose-400"
                                    : "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                                }`}
                              >
                                {isCombinedMainCut ? "BROKEN (OPEN)" : "CONNECTED (CLOSED)"}
                              </button>
                            </div>

                            {/* Control Branch A */}
                            <div className="flex items-center justify-between bg-[#040813] p-2 rounded-xl border border-slate-900">
                              <div className="text-left font-sans">
                                <h5 className="font-bold text-[10.5px] text-slate-101 text-slate-200">BRANCH SW-A (TOP)</h5>
                                <p className="text-[8px] text-slate-500 font-mono leading-none">Controls Branch A parallel node</p>
                              </div>
                              <button
                                onClick={() => setIsCombinedBranchACut(!isCombinedBranchACut)}
                                className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded border cursor-pointer select-none transition-all duration-150 ${
                                  isCombinedBranchACut
                                    ? "bg-rose-950/20 border-rose-900 text-rose-400"
                                    : "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                                }`}
                              >
                                {isCombinedBranchACut ? "BROKEN (OPEN)" : "CONNECTED (CLOSED)"}
                              </button>
                            </div>

                            {/* Control Branch B */}
                            <div className="flex items-center justify-between bg-[#040813] p-2 rounded-xl border border-slate-900">
                              <div className="text-left font-sans">
                                <h5 className="font-bold text-[10.5px] text-slate-101 text-slate-200">BRANCH SW-B (BOTTOM)</h5>
                                <p className="text-[8px] text-slate-500 font-mono leading-none">Controls Branch B parallel node</p>
                              </div>
                              <button
                                onClick={() => setIsCombinedBranchBCut(!isCombinedBranchBCut)}
                                className={`px-2.5 py-1 text-[9px] font-mono font-bold rounded border cursor-pointer select-none transition-all duration-150 ${
                                  isCombinedBranchBCut
                                    ? "bg-rose-950/20 border-rose-900 text-rose-400"
                                    : "bg-emerald-950/20 border-emerald-900 text-emerald-400"
                                }`}
                              >
                                {isCombinedBranchBCut ? "BROKEN (OPEN)" : "CONNECTED (CLOSED)"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

              </div>

              {/* Note section */}
              <div className="bg-[#051c26]/25 border border-cyan-500/10 p-3 rounded-xl font-mono text-[10px] text-cyan-400 flex items-center gap-1.5">
                <Info className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Notice how SW-MAIN immediately breaks the entire loop current, while SW-A and SW-B independently manage Branch splitting.</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ohm's Law Highly Interactive Educational Modal Overlay */}
      {isOhmsModalOpen && (
        <div className="fixed inset-0 z-[100005] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md shadow-2xl overflow-hidden">
          <div 
            className="bg-[#03091e] border-2 border-slate-700 rounded-2xl w-full max-w-5xl overflow-y-auto max-h-[96vh] sm:max-h-[92vh] shadow-[0_0_50px_rgba(56,189,248,0.25)] relative p-3.5 md:p-8 animate-slideUp text-left flex flex-col gap-4 sm:gap-6"
            id="ohms-law-modal-container"
          >
            {/* Semi-translucent layout background details */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

            {/* Header bar */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-900 relative z-10 select-none">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <span className="font-mono text-[8.5px] text-[#22d3ee] font-black uppercase tracking-widest block leading-none">Interactive Lab Workspace</span>
                  <h3 className="font-sans font-black text-white text-sm md:text-base uppercase tracking-tight mt-0.5">Ohm's Law Master Class</h3>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOhmsModalOpen(false);
                }}
                className="p-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-705 transition-all font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span className="font-sans">Exit Sandbox</span> ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-stretch">
              
              {/* Left Interactive panel (7 columns on large screens) */}
              <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-4 text-left">
                
                {/* Main Formula overview widget */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-left space-y-1 max-w-sm">
                    <h5 className="font-sans font-black text-[#22d3ee] text-xs uppercase tracking-wider">The Core Law of Electricity</h5>
                    <p className="font-sans text-[11px] text-slate-400 leading-normal font-semibold">
                      Ohm’s Law describes how electricity moves through any wire loop. It relates three components: Voltage (Pressure), Resistance (Friction), and Current (Flow Rate).
                    </p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl text-center shadow-lg font-mono flex flex-col items-center justify-center shrink-0 min-w-[120px]">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">THE FORMULA</span>
                    <span className="text-lg text-emerald-400 font-extrabold tracking-widest mt-0.5">V = I × R</span>
                  </div>
                </div>

                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 font-extrabold font-black block">
                  Step 1: Click any parameter below to inspect its behavior and redirect to the circuit:
                </span>

                {/* Interactive tabs for Voltage, Resistance, Current */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Voltage Tab button */}
                  <button
                    onClick={() => {
                      setOhmsHighlightItem("voltage");
                      setTimeout(() => {
                        const target = document.getElementById("ohms-modal-circuit");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                      }, 100);
                    }}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[100px] relative overflow-hidden group ${
                      ohmsHighlightItem === "voltage" 
                        ? "border-sky-500 bg-sky-500/[0.04] ring-1 ring-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.15)]" 
                        : "border-slate-850 bg-slate-900/10 hover:border-slate-700 hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full select-none">
                      <span className={`font-mono text-[9px] uppercase pb-0.5 font-bold ${ohmsHighlightItem === "voltage" ? "text-sky-400" : "text-slate-500"}`}>VOLTAGE (V)</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${ohmsHighlightItem === "voltage" ? "bg-sky-400 animate-ping" : "bg-slate-800"}`} />
                    </div>
                    <div>
                      <span className="text-white text-sm font-black font-sans leading-none">{ohmsVoltage.toFixed(1)} V</span>
                      <p className="font-sans text-[9px] text-slate-400 leading-snug mt-1 line-clamp-2">Electrical pressure pushing current.</p>
                    </div>
                  </button>

                  {/* Resistance Tab button */}
                  <button
                    onClick={() => {
                      setOhmsHighlightItem("resistance");
                      setTimeout(() => {
                        const target = document.getElementById("ohms-modal-circuit");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                      }, 100);
                    }}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[100px] relative overflow-hidden group ${
                      ohmsHighlightItem === "resistance" 
                        ? "border-emerald-500 bg-emerald-500/[0.04] ring-1 ring-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                        : "border-slate-850 bg-slate-900/10 hover:border-slate-700 hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full select-none">
                      <span className={`font-mono text-[9px] uppercase pb-0.5 font-bold ${ohmsHighlightItem === "resistance" ? "text-emerald-400" : "text-slate-500"}`}>RESISTANCE (R)</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${ohmsHighlightItem === "resistance" ? "bg-emerald-400 animate-ping" : "bg-slate-800"}`} />
                    </div>
                    <div>
                      <span className="text-white text-sm font-black font-sans leading-none">{ohmsResistance} Ω</span>
                      <p className="font-sans text-[9px] text-slate-400 leading-snug mt-1 line-clamp-2">Physical friction opposing electrons.</p>
                    </div>
                  </button>

                  {/* Current Tab button */}
                  <button
                    onClick={() => {
                      setOhmsHighlightItem("current");
                      setTimeout(() => {
                        const target = document.getElementById("ohms-modal-circuit");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                      }, 100);
                    }}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[100px] relative overflow-hidden group ${
                      ohmsHighlightItem === "current" 
                        ? "border-[#a855f7] bg-[#a855f7]/[0.04] ring-1 ring-[#a855f7]/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                        : "border-slate-850 bg-slate-900/10 hover:border-slate-700 hover:bg-slate-900/30"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full select-none">
                      <span className={`font-mono text-[9px] uppercase pb-0.5 font-bold ${ohmsHighlightItem === "current" ? "text-purple-400" : "text-slate-500"}`}>CURRENT (I)</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${ohmsHighlightItem === "current" ? "bg-[#a855f7] animate-ping" : "bg-slate-800"}`} />
                    </div>
                    <div>
                      <span className={`text-sm font-black font-sans leading-none ${isPinBlown ? "text-rose-400 animate-pulse font-black" : "text-white"}`}>{currentMilliamps.toFixed(1)} mA</span>
                      <p className="font-sans text-[9px] text-slate-400 leading-snug mt-1 line-clamp-2">The output electron flow rate.</p>
                    </div>
                  </button>
                </div>

                {/* Step 2: Sliders & Adaptive Explanations Card */}
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/45 space-y-4">
                  
                  {ohmsHighlightItem === "voltage" && (
                    <div className="space-y-3.5 text-left animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <h5 className="font-sans font-black text-sky-400 text-xs uppercase tracking-wide">Adjust Voltage Input (Push Force):</h5>
                        <span className="font-mono text-xs text-sky-450 text-sky-400 font-extrabold bg-sky-950/45 px-2.5 py-0.5 rounded border border-sky-500/10">{ohmsVoltage.toFixed(1)} Volts (V)</span>
                      </div>
                      <input 
                        type="range" 
                        min="1.0" 
                        max="12.0" 
                        step="0.5"
                        value={ohmsVoltage}
                        onChange={(e) => setOhmsVoltage(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
                      />
                      <div className="p-3 bg-sky-950/10 border border-sky-900/25 rounded-xl space-y-1">
                        <span className="font-mono text-[8px] text-sky-400 tracking-wider font-extrabold uppercase">How Voltage Works:</span>
                        <p className="font-sans text-[11px] text-slate-300 leading-relaxed font-semibold">
                          Think of Voltage as physical water pressure. Just like a pump forces water through a pipe, the battery uses chemistry to create a force that "pushes" electrons. Higher voltage means a stronger push, forcing more electrons per second through the resistor restriction.
                        </p>
                      </div>
                    </div>
                  )}

                  {ohmsHighlightItem === "resistance" && (
                    <div className="space-y-3.5 text-left animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <h5 className="font-sans font-black text-emerald-400 text-xs uppercase tracking-wide">Adjust Resistor Impedance (Friction):</h5>
                        <span className="font-mono text-xs text-emerald-450 text-emerald-400 font-extrabold bg-emerald-950/45 px-2.5 py-0.5 rounded border border-emerald-500/10">{ohmsResistance} Ohms (Ω)</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="1000" 
                        step="20"
                        value={ohmsResistance}
                        onChange={(e) => setOhmsResistance(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-505 accent-emerald-500"
                      />
                      <div className="p-3 bg-emerald-950/10 border border-emerald-900/25 rounded-xl space-y-1">
                        <span className="font-mono text-[8px] text-emerald-400 tracking-wider font-extrabold uppercase">How Resistance Works:</span>
                        <p className="font-sans text-[11px] text-slate-300 leading-relaxed font-semibold">
                          Resistance is the electrical friction or constriction that opposes charge flow. Imagine squeezing a garden hose tight — that restriction limits the flow rate of water. Higher resistance bottlenecks the electron conventional pathway, naturally lowering the resulting Current.
                        </p>
                      </div>
                    </div>
                  )}

                  {ohmsHighlightItem === "current" && (
                    <div className="space-y-3.5 text-left animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <h5 className="font-sans font-black text-purple-400 text-xs uppercase tracking-wide">Resultant Electric Current (Flow Speed):</h5>
                        <span className={`font-mono text-xs font-black px-2.5 py-0.5 rounded border ${isPinBlown ? "bg-rose-950/40 border-rose-500/25 text-rose-450 text-rose-400 animate-pulse" : "bg-purple-950/40 border-purple-500/10 text-purple-300"}`}>
                          {currentMilliamps.toFixed(1)} Milliamperes (mA)
                        </span>
                      </div>
                      {/* Visual live current indicator meter bar instead of input since current is computed */}
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden relative border border-slate-950">
                        <div 
                          className={`h-full transition-all duration-350 rounded-full ${
                            isPinBlown 
                              ? "bg-gradient-to-r from-orange-500 to-rose-500 animate-pulse" 
                              : "bg-gradient-to-r from-emerald-500 to-indigo-505 bg-[#38bdf8]"
                          }`}
                          style={{ width: `${Math.min(100, (currentMilliamps / 120) * 100)}%` }}
                        />
                        {/* Blown Pin Red Alert Line Indicator at 40mA (33% limit of 120mA scale) */}
                        <div className="absolute top-0 bottom-0 left-[33%] w-[1.5px] bg-rose-500 opacity-60 flex items-center justify-center">
                          <span className="font-mono text-[5.5px] text-rose-400 absolute -top-3.5 scale-75 whitespace-nowrap">PIN LIMIT 40mA</span>
                        </div>
                      </div>

                      <div className="p-3 bg-purple-950/10 border border-purple-900/25 rounded-xl space-y-1">
                        <span className="font-mono text-[8px] text-[#a855f7] tracking-wider font-extrabold uppercase">How Current Works:</span>
                        <p className="font-sans text-[11px] text-slate-300 leading-relaxed font-semibold">
                          Current (I) is the actual flow rate of electrons (Amperage). It is the direct mathematical outcome of Voltage pushing against Resistance!
                        </p>
                        <p className={`font-sans text-[11px] leading-relaxed font-bold ${isPinBlown ? "text-rose-400" : "text-slate-400"}`}>
                          {isPinBlown 
                            ? "ALERT! Current exceeds 40mA (Arduino Uno Continuous Pin Ceil)! This causes short-circuit heating that can fry or damage the processor permanently." 
                            : `Current is currently ${currentMilliamps.toFixed(1)}mA. This is safe (< 40mA limit). You can increase voltage or reduce resistance to raise Current.`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* General Formula Math breakdown display */}
                  <div className="p-2.5 bg-[#030712] rounded-xl border border-slate-900 flex justify-between items-center text-[10.5px]">
                    <span className="font-mono text-slate-500 font-bold uppercase shrink-0">Mathematical Outcome:</span>
                    <div className="font-mono text-slate-300 flex items-center gap-1.5 font-bold flex-wrap justify-end">
                      <span className="text-sky-305 text-sky-400">V ({ohmsVoltage.toFixed(1)}V)</span>
                      <span>/</span>
                      <span className="text-emerald-400">R ({ohmsResistance}Ω)</span>
                      <span>=</span>
                      <span className={`px-1.5 py-0.5 rounded ${isPinBlown ? "bg-rose-950/50 text-rose-400 border border-rose-500/20" : "bg-slate-905 text-purple-300 bg-slate-900"}`}>
                        I ({currentAmps.toFixed(4)} Amps)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right schematic simulation with high-fidelity highlight (5 columns) */}
              <div id="ohms-modal-circuit" className="lg:col-span-12 xl:col-span-5 bg-[#020614] p-4 rounded-2xl border border-slate-900 flex flex-col justify-between min-h-[350px] relative overflow-hidden text-left">
                <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-900/10 to-transparent h-12 pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2 select-none">
                  <span className="font-mono text-[8px] text-slate-500 font-extrabold uppercase tracking-wider">Interactive Live Schematic Circuit</span>
                  {ohmsHighlightItem && (
                    <span className={`font-mono text-[8px] uppercase font-black px-2 py-0.5 rounded ${
                      ohmsHighlightItem === "voltage" ? "bg-sky-950/45 text-sky-400 border border-sky-500/15" :
                      ohmsHighlightItem === "resistance" ? "bg-emerald-950/45 text-emerald-400 border border-emerald-500/15" :
                      "bg-purple-950/45 text-[#c084fc] border border-purple-500/15"
                    }`}>
                      {ohmsHighlightItem} focus active
                    </span>
                  )}
                </div>

                {/* SVG representation of the circuit loop */}
                <div className="rounded-xl bg-[#030712] p-2 border border-slate-900/80 flex items-center justify-center flex-1 relative min-h-[180px]">
                  
                  {/* Outline highlight indicators floating on top */}
                  {ohmsHighlightItem === "voltage" && (
                    <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-sky-500/30 p-2 rounded-lg z-20 max-w-[200px] shadow-lg text-left animate-slideUp">
                      <h6 className="font-sans font-black text-sky-400 text-[9px] uppercase">BATTERY PRESSURE SOURCE</h6>
                      <p className="font-sans text-[8.5px] text-slate-400 leading-snug mt-0.5 font-semibold">Highlighted: The source of electrical force. It pushes electrons along the conventional route.</p>
                    </div>
                  )}
                  {ohmsHighlightItem === "resistance" && (
                    <div className="absolute top-2 right-2 bg-slate-950/90 border border-emerald-500/30 p-2 rounded-lg z-20 max-w-[200px] shadow-lg text-left animate-slideUp">
                      <h6 className="font-sans font-black text-emerald-450 text-[9px] uppercase">CARBONS RESISTOR</h6>
                      <p className="font-sans text-[8.5px] text-slate-400 leading-snug mt-0.5 font-semibold">Highlighted: Resistor core. Squeezes tighter as resistance rises to reduce electron speed.</p>
                    </div>
                  )}
                  {ohmsHighlightItem === "current" && (
                    <div className="absolute bottom-2 right-2 bg-slate-950/90 border border-purple-500/30 p-2 rounded-lg z-20 max-w-[200px] shadow-lg text-left animate-slideUp">
                      <h6 className="font-sans font-black text-[#a855f7] text-[9px] uppercase">ELECTRON FLOW VECTOR</h6>
                      <p className="font-sans text-[8.5px] text-slate-400 leading-snug mt-0.5 font-semibold">Highlighted: Electron flow rate. Spheres animate along the loop. Speed = Voltage / Resistance.</p>
                    </div>
                  )}

                  <svg viewBox="0 0 220 120" className="w-full h-36 overflow-visible">
                    
                    {/* Highlight outline glows */}
                    {ohmsHighlightItem === "voltage" && (
                      <rect x="1" y="27" width="22" height="46" rx="4" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="animate-pulse" opacity="0.8" />
                    )}
                    {ohmsHighlightItem === "resistance" && (
                      <rect x="86" y="-1" width="48" height="22" rx="6" fill="none" stroke="#10b981" strokeWidth="2.5" className="animate-pulse" opacity="0.8" />
                    )}
                    {ohmsHighlightItem === "current" && (
                      <rect x="10" y="10" width="200" height="80" rx="10" fill="none" stroke="#a855f7" strokeWidth="4" opacity="0.3" className="animate-pulse" />
                    )}

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

                    {/* Wire paths with highlight support */}
                    <path
                      d="M 10 31 V 20 A 10 10 0 0 1 20 10 H 90"
                      fill="none"
                      stroke={isPinBlown ? "#f43f5e" : (ohmsHighlightItem === "voltage" ? "#38bdf8" : (ohmsHighlightItem === "current" ? "#c084fc" : "#10b981"))}
                      strokeWidth={ohmsHighlightItem === "current" ? "5.5" : "4.0"}
                      className="transition-all duration-300"
                      opacity="0.85"
                    />

                    <path
                      d="M 90 10 H 200 A 10 10 0 0 1 210 20 V 80 A 10 10 0 0 1 200 90 H 20 A 10 10 0 0 1 10 80 V 66"
                      fill="none"
                      stroke={isPinBlown ? "#f43f5e" : (ohmsHighlightItem === "resistance" ? "#34d399" : (ohmsHighlightItem === "current" ? "#c084fc" : "#10b981"))}
                      strokeWidth={ohmsHighlightItem === "current" ? ohmsFlowThickness + 1.5 : ohmsFlowThickness}
                      className="transition-all duration-300"
                      opacity="0.85"
                    />

                    {/* Electron Particles conventional flow animation loop */}
                    {!isPinBlown && [0, 0.2, 0.4, 0.6, 0.8].map((offset, i) => (
                      <circle 
                        key={i} 
                        r={Math.min(4.2, Math.max(2.2, ohmsFlowThickness / 2 + (ohmsHighlightItem === "current" ? 1.0 : 0.4)))} 
                        fill={ohmsHighlightItem === "current" ? "#d8b4fe" : "#22c55e"}
                        className="transition-all duration-300"
                      >
                        <animateMotion
                          path="M 10 31 V 20 A 10 10 0 0 1 20 10 H 200 A 10 10 0 0 1 210 20 V 80 A 10 10 0 0 1 200 90 H 20 A 10 10 0 0 1 10 80 V 66"
                          dur={`${Math.max(0.12, 1.8 / Math.max(0.12, currentAmps * 35))}s`}
                          begin={`${offset * Math.max(0.12, 1.8 / Math.max(0.12, currentAmps * 35))}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    ))}

                    {/* Battery layout at x=3, y=31 */}
                    <g className="transition-all duration-300" style={{ transformOrigin: "10px 48px" }}>
                      <rect x="7" y="31" width="6" height="3" fill="#f97316" rx="0.5" />
                      <rect 
                        x="3" 
                        y="34" 
                        width="14" 
                        height="32" 
                        rx="3" 
                        fill={ohmsHighlightItem === "voltage" ? "#1e3a8a" : "#1e1b4b"} 
                        stroke={ohmsHighlightItem === "voltage" ? "#38bdf8" : "#4f46e5"} 
                        strokeWidth={ohmsHighlightItem === "voltage" ? "1.5" : "1"} 
                      />
                      <rect x="3.5" y="34.5" width="13" height="12" fill={isPinBlown ? "#f43f5e" : "#ef4444"} rx="1.5" />
                      <text x="10" y="43" textAnchor="middle" className="fill-white font-sans text-[8px] font-black">+</text>
                      <text x="10" y="60" textAnchor="middle" className="fill-slate-400 font-sans text-[9px] font-black">-</text>
                      <text x="24" y="52" textAnchor="start" className={`font-mono text-[7.5px] font-extrabold ${ohmsHighlightItem === "voltage" ? "fill-sky-400 font-black scale-105" : "fill-indigo-400"}`}>{ohmsVoltage.toFixed(1)}V Source</text>
                    </g>

                    {/* Tightening/Loosening Resistor Clamp device */}
                    <g className="transition-all duration-300" style={{ transformOrigin: "110px 10px" }}>
                      {/* Left and Right connector metal lines */}
                      <line x1="82" y1="10" x2="90" y2="10" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="130" y1="10" x2="138" y2="10" stroke="#94a3b8" strokeWidth="1.5" />

                      {/* Outer rigid support guide frame */}
                      <rect 
                        x="88" 
                        y="0" 
                        width="44" 
                        height="20" 
                        rx="3.5" 
                        fill={ohmsHighlightItem === "resistance" ? "rgba(6, 78, 59, 0.2)" : "none"} 
                        stroke={ohmsHighlightItem === "resistance" ? "#34d399" : "#475569"} 
                        strokeWidth={ohmsHighlightItem === "resistance" ? "1.5" : "1.0"} 
                        strokeDasharray="3 2" 
                        opacity="0.85" 
                      />

                      {/* Flexible conductive channel (crimped by the clamps) */}
                      <path
                        d={`M 90,3 
                            Q 110,${3 + 5.5 * ohmsConstrictionFactor} 130,3 
                            L 130,17 
                            Q 110,${17 - 5.5 * ohmsConstrictionFactor} 90,17 
                            Z`}
                        fill={ohmsHighlightItem === "resistance" ? "rgba(52, 211, 153, 0.12)" : "rgba(34, 197, 94, 0.08)"}
                        stroke={ohmsHighlightItem === "resistance" ? "#34d399" : "#10b981"}
                        strokeWidth="0.8"
                        className="transition-all duration-300"
                      />

                      {/* Active Mechanical Clamp Jaws: Tighten (move in) for high resistance, loosen (retract) for low resistance */}
                      {/* Top Squeeze Jaw block */}
                      <g style={{ transform: `translateY(${5.5 * ohmsConstrictionFactor}px)`, transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)" }}>
                        <rect x="100" y="-1" width="20" height="4.5" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
                        {/* Clamp teeth/grooves */}
                        <line x1="104" y1="3" x2="104" y2="4.5" stroke="#78350f" strokeWidth="0.5" />
                        <line x1="110" y1="3" x2="110" y2="4.5" stroke="#78350f" strokeWidth="0.5" />
                        <line x1="116" y1="3" x2="116" y2="4.5" stroke="#78350f" strokeWidth="0.5" />
                      </g>

                      {/* Bottom Squeeze Jaw block */}
                      <g style={{ transform: `translateY(${-5.5 * ohmsConstrictionFactor}px)`, transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)" }}>
                        <rect x="100" y="16.5" width="20" height="4.5" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
                        {/* Clamp teeth/grooves */}
                        <line x1="104" y1="16.5" x2="104" y2="17" stroke="#78350f" strokeWidth="0.5" />
                        <line x1="110" y1="16.5" x2="110" y2="17" stroke="#78350f" strokeWidth="0.5" />
                        <line x1="116" y1="16.5" x2="116" y2="17" stroke="#78350f" strokeWidth="0.5" />
                      </g>

                      <text x="110" y="31" textAnchor="middle" className={`font-mono text-[8px] font-black ${ohmsHighlightItem === "resistance" ? "fill-emerald-400" : "fill-slate-400"}`}>{ohmsResistance} Ω</text>
                    </g>

                  </svg>
                </div>

                {/* Live Sandbox Quick Tips */}
                <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl text-[10.5px] leading-relaxed text-slate-405 text-slate-400">
                  <span className="text-white font-bold select-none">Live Workbook Guide:</span> Select other parameters by clicking the custom cards on the left to learn specific formulas, adjust values, and experiment in real-time.
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {isAdcSandboxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md overflow-hidden">
          <div className="relative w-full max-w-5xl max-h-[96vh] sm:max-h-[92vh] overflow-y-auto bg-[#090d16] border-2 border-purple-500/45 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col">
            
            {/* Modal Header */}
            <div className="border-b border-purple-550/20 bg-[#120624] px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-ping" />
                  Analog to Digital Sandbox
                </h3>
                <p className="font-sans text-[11px] text-slate-400">
                  Real-time exploration of signal parsing, MCU discrete sampling, and DAC reconstruction.
                </p>
              </div>
              <button
                onClick={() => setIsAdcSandboxModalOpen(false)}
                type="button"
                className="p-1 px-3 bg-red-950/40 border border-red-500/20 text-red-400 font-mono text-xs uppercase font-extrabold hover:bg-red-900/30 hover:border-red-500/50 rounded-xl transition-all cursor-pointer whitespace-nowrap animate-pulse"
              >
                CLOSE [ X ]
              </button>
            </div>

            {/* Modal Work area */}
            <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Control workspace column */}
                <div className="space-y-4 bg-slate-900/20 p-5 rounded-xl border border-slate-900">
                  {/* 1. Resolution selection */}
                  <div className="space-y-2">
                    <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase font-black">ADC Bit Resolution (Quantization density):</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[2, 3, 4, 8].map((bits) => {
                        const active = adcResolutionBits === bits;
                        const levels = Math.pow(2, bits);
                        return (
                          <button
                            key={bits}
                            onClick={() => setAdcResolutionBits(bits)}
                            type="button"
                            className={`px-2 py-2 font-mono text-[9px] border transition-all rounded-lg font-bold cursor-pointer flex flex-col items-center justify-center ${
                              active
                                ? "bg-purple-950/45 border-purple-500/80 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                                : "bg-slate-950 border-slate-900 text-slate-450 hover:text-slate-200"
                            }`}
                          >
                            <span className="font-black text-[10.5px]">{bits}-Bit</span>
                            <span className="text-[7.5px] opacity-70 mt-0.5 font-semibold">{levels} Levels</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Wave trigger mode */}
                  <div className="space-y-2 pt-3 border-t border-slate-900/60">
                    <span className="font-mono text-[8px] text-slate-500 tracking-wider block uppercase font-black">Analog Input Mode:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setIsLiveAdc(true)}
                        type="button"
                        className={`px-2 py-2 font-mono text-[9px] border transition-all rounded-lg font-bold cursor-pointer uppercase ${
                          isLiveAdc
                            ? "bg-purple-950/45 border-purple-500/80 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                            : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Moving Sine wave
                      </button>
                      <button
                        onClick={() => setIsLiveAdc(false)}
                        type="button"
                        className={`px-2 py-2 font-mono text-[9px] border transition-all rounded-lg font-bold cursor-pointer uppercase ${
                          !isLiveAdc
                            ? "bg-purple-950/45 border-purple-500/80 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                            : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Manual DC sweep
                      </button>
                    </div>
                  </div>

                  {/* 3. Manual slider OR wave frequency controls */}
                  {isLiveAdc ? (
                    <div className="space-y-1.5 pt-3 border-t border-slate-900/60">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-slate-350 font-bold">Signal Frequency:</span>
                        <span className="font-mono text-purple-400 font-extrabold">{signalFrequency} Hz</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="1"
                        value={signalFrequency}
                        onChange={(e) => setSignalFrequency(parseInt(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-3 border-t border-slate-900/60">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="text-slate-350 font-bold">Manual Probe DC Input Voltage:</span>
                        <span className="font-mono text-purple-400 font-extrabold">{manualSampleValue.toFixed(2)} Volts</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.0" 
                        max="5.0" 
                        step="0.05"
                        value={manualSampleValue}
                        onChange={(e) => setManualSampleValue(parseFloat(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* 4. Sampling frequency rate */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-900/60">
                    <div className="flex justify-between text-xs font-sans">
                      <span className="text-slate-350 font-bold">A/D Sampling clock rate:</span>
                      <span className="font-mono text-purple-400 font-extrabold">{samplingFrequency} Hz</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="1"
                      value={samplingFrequency}
                      onChange={(e) => setSamplingFrequency(parseInt(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <p className="font-mono text-[8px] text-slate-500 uppercase leading-tight pt-0.5">
                      Samples the analog track is partitioned horizontally to create step staircase points.
                    </p>
                  </div>

                  {/* Explanatory description card */}
                  <div className="p-3.5 bg-purple-950/5 border border-purple-900/15 rounded-lg text-[10.5px] leading-relaxed text-slate-400 font-sans">
                    <strong className="text-purple-400 uppercase tracking-wide block mb-1">A/D & D/A conversion core:</strong>
                    An Analog-to-Digital Converter converts a continuous real-world voltage tracking curve into digital integer word indexes. The Digital-to-Analog Converter reconstructs the binary word back into a staircase voltage, demonstrating reconstruction errors.
                  </div>
                </div>

                {/* Interactive Scope visualization column */}
                <div className="rounded-xl border border-slate-900 bg-[#030712] p-5 flex flex-col justify-between space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="font-mono text-[9px] text-purple-400 font-extrabold tracking-widest uppercase font-black uppercase">CONVERSIONS LAB OSCOPE</span>
                    <span className="text-[9.5px] bg-[#1e293b]/50 text-[#818cf8] px-2.5 py-0.5 rounded font-mono font-bold">
                      {adcResolutionBits}-BIT ARCHITECTURE [Active]
                    </span>
                  </div>

                  {/* Graphical double-line staircase canvas */}
                  <div className="h-44 bg-slate-950 border border-[#1e293b]/40 rounded-xl relative p-2 overflow-hidden flex flex-col justify-end">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

                    <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                      {/* Reference voltage lines for the selected bit depth */}
                      {(() => {
                        const lines = [];
                        const levels = Math.pow(2, adcResolutionBits);
                        const maxLines = levels <= 16 ? levels : 8;
                        for (let i = 0; i < maxLines; i++) {
                          const v = (i / (maxLines - 1)) * 5.0;
                          const y = 140 - (v / 5.0) * 120;
                          lines.push(
                            <line 
                              key={i} 
                              x1="0" 
                              y1={y} 
                              x2="400" 
                              y2={y} 
                              stroke="#101b30" 
                              strokeWidth="0.5" 
                            />
                          );
                        }
                        return lines;
                      })()}

                      {/* Center timeline axis */}
                      <line x1="0" y1="80" x2="400" y2="80" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" />

                      {/* Mathematical conversion traces overlay path on oscilloscope screen */}
                      {(() => {
                        let analogPath = "";
                        let quantizedPath = "";
                        const pointsCount = 100;
                        const width = 400;
                        
                        const numSamples = samplingFrequency * 3;
                        const stepWidth = width / numSamples;

                        for (let i = 0; i <= pointsCount; i++) {
                          const x = (i / pointsCount) * width;
                          let rawV = 2.5;

                          if (isLiveAdc) {
                            const phase = (simTick * 0.08);
                            const angle = (x / width) * Math.PI * 2 * 1.5 - phase;
                            rawV = 2.5 + Math.sin(angle) * 2.0;
                          } else {
                            rawV = manualSampleValue;
                          }

                          const aY = 140 - (rawV / 5.0) * 120;
                          if (i === 0) analogPath += `M ${x},${aY}`;
                          else analogPath += ` L ${x},${aY}`;

                          // Calculate Sample-and-Hold step
                          const sampleIndex = Math.floor(x / stepWidth);
                          const sampleX = sampleIndex * stepWidth;

                          let sRawV = 2.5;
                          if (isLiveAdc) {
                            const phase = (simTick * 0.08);
                            const angle = (sampleX / width) * Math.PI * 2 * 1.5 - phase;
                            sRawV = 2.5 + Math.sin(angle) * 2.0;
                          } else {
                            sRawV = manualSampleValue;
                          }

                          const maxIdx = Math.pow(2, adcResolutionBits) - 1;
                          const level = Math.max(0, Math.min(maxIdx, Math.round((sRawV / 5.0) * maxIdx)));
                          const qVolt = (level / maxIdx) * 5.0;
                          const qY = 140 - (qVolt / 5.0) * 120;

                          if (i === 0) quantizedPath += `M ${x},${qY}`;
                          else {
                            // Make staircase transition
                            const prevX = ((i - 1) / pointsCount) * width;
                            let prevSRawV = 2.5;
                            if (isLiveAdc) {
                              const phase = (simTick * 0.08);
                              const prevSampleX = Math.floor(prevX / stepWidth) * stepWidth;
                              const angle = (prevSampleX / width) * Math.PI * 2 * 1.5 - phase;
                              prevSRawV = 2.5 + Math.sin(angle) * 2.0;
                            } else {
                              prevSRawV = manualSampleValue;
                            }
                            const prevLevel = Math.max(0, Math.min(maxIdx, Math.round((prevSRawV / 5.0) * maxIdx)));
                            const prevQVolt = (prevLevel / maxIdx) * 5.0;
                            const prevQY = 140 - (prevQVolt / 5.0) * 120;

                            quantizedPath += ` L ${x},${prevQY} L ${x},${qY}`;
                          }
                        }

                        return (
                          <>
                            {/* Analog wave (cyan) */}
                            <path d={analogPath} fill="none" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.75" />
                            {/* Reconstructed stair dac wave */}
                            <path d={quantizedPath} fill="none" stroke="#a855f7" strokeWidth="2.2" />
                          </>
                        );
                      })()}
                    </svg>

                    <div className="absolute top-2 left-2 text-[7.5px] font-mono text-[#06b6d4] select-none bg-black/60 px-1 py-0.5 rounded">
                      Line Cyan: Analog Wave Input
                    </div>
                    <div className="absolute top-2 right-2 text-[7.5px] font-mono text-[#a855f7] select-none bg-black/60 px-1 py-0.5 rounded text-right">
                      Stair Purple: Quantized DAC Output
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between font-mono text-[7px] text-slate-500 uppercase select-none">
                      <span>0.0V Ground</span>
                      <span>CLOCK: ACTIVE</span>
                      <span>5.0V VCC</span>
                    </div>
                  </div>

                  {/* Dynamic converter register readouts */}
                  {(() => {
                    const currentLevels = Math.pow(2, adcResolutionBits);
                    const maxLevelIdx = currentLevels - 1;
                    const sampleRawV = isLiveAdc
                      ? Math.max(0, Math.min(5, 2.5 + Math.sin(simTick * 0.12) * 2.0))
                      : manualSampleValue;
                    const levelIdx = Math.min(maxLevelIdx, Math.max(0, Math.round((sampleRawV / 5.0) * maxLevelIdx)));
                    const binWord = levelIdx.toString(2).padStart(adcResolutionBits, "0");
                    const dacVolt = (levelIdx / maxLevelIdx) * 5.0;
                    const qErr = sampleRawV - dacVolt;

                    return (
                      <div className="space-y-1.5 text-center font-mono text-[9px]">
                        <span className="text-slate-400 font-extrabold block uppercase tracking-wider">CONVERTER REGISTER DECODE</span>
                        <div className="grid grid-cols-4 gap-2 text-white">
                          <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                            <span className="text-slate-500 text-[6.5px] block font-bold">ANALOG IN</span>
                            <span className="text-cyan-400 font-black">{sampleRawV.toFixed(2)}V</span>
                          </div>
                          <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                            <span className="text-slate-500 text-[6.5px] block font-bold">DEC LEVEL</span>
                            <span className="text-indigo-400 font-black">Lvl {levelIdx}</span>
                          </div>
                          <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                            <span className="text-slate-500 text-[6.5px] block font-bold">BINARY OUT</span>
                            <span className="text-emerald-400 font-black">{binWord}</span>
                          </div>
                          <div className="p-1.5 bg-[#070b13] border border-slate-900 rounded-lg">
                            <span className="text-slate-500 text-[6.5px] block font-bold">RECON DAC</span>
                            <span className="text-purple-400 font-black">{dacVolt.toFixed(2)}V</span>
                          </div>
                        </div>
                        <div className="text-[7.5px] text-slate-500 leading-none pt-1">
                          Quantization error: <span className={Math.abs(qErr) > 0.4 ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>{qErr.toFixed(3)} Volts</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Complete real-time animated pipeline */}
              {(() => {
                const currentLevels = Math.pow(2, adcResolutionBits);
                const maxLevelIdx = currentLevels - 1;
                const sampleRawV = isLiveAdc
                  ? Math.max(0, Math.min(5, 2.5 + Math.sin(simTick * 0.12) * 2.0))
                  : manualSampleValue;
                const levelIdx = Math.min(maxLevelIdx, Math.max(0, Math.round((sampleRawV / 5.0) * maxLevelIdx)));
                const binWord = levelIdx.toString(2).padStart(adcResolutionBits, "0");
                const dacVolt = (levelIdx / maxLevelIdx) * 5.0;
                const qErr = sampleRawV - dacVolt;

                return (
                  <div className="bg-[#02050c]/50 border border-purple-900/10 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900/80 pb-2.5 gap-2">
                      <div>
                        <h5 className="font-sans font-extrabold text-[#f1f5f9] text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                          Real-Time Hardware Signal Conversion Pipeline Demo
                        </h5>
                        <p className="font-sans text-[10px] text-slate-400 leading-tight">
                          Trace physical electric waves being digitized (ADC) and reconstructed back to electric currents (DAC):
                        </p>
                      </div>
                      <span className="font-mono text-[8px] bg-purple-950/40 text-[#c084fc] border border-purple-900/30 px-2 py-0.5 rounded font-extrabold uppercase animate-pulse">
                        COMPANION SCHEMATIC VIEW
                      </span>
                    </div>

                    <div className="bg-[#050914] border border-purple-900/30 p-4 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <span className="font-mono text-[8.5px] text-[#22d3ee] font-black tracking-widest block uppercase">Interactive System-Level Signal & Actuation Loop</span>
                        </div>
                        <span className="font-mono text-[7px] bg-purple-950/60 text-purple-400 px-2 py-0.5 rounded border border-purple-900/30 font-bold uppercase whitespace-nowrap">
                          LOOP PROCESS VIEW
                        </span>
                      </div>

                      <svg className="w-full h-auto select-none overflow-visible" viewBox="0 0 540 100" style={{ minHeight: "100px" }}>
                        {/* Connection wires */}
                        <path d="M 75,50 L 210,50" stroke="#090d16" strokeWidth="8" strokeLinecap="round" />
                        <path d="M 75,50 L 210,50" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" opacity="0.3" />

                        <path d="M 330,50 L 465,50" stroke="#090d16" strokeWidth="8" strokeLinecap="round" />
                        <path d="M 330,50 L 465,50" stroke="#a855f7" strokeWidth="2" strokeDasharray="3,3" strokeLinecap="round" opacity="0.3" />

                        {/* Sensor */}
                        <rect x="5" y="15" width="70" height="70" rx="8" fill="#02050c" stroke="#1e293b" strokeWidth="1.5" />
                        <circle cx="40" cy="45" r="14" fill="#06d6a0" fillOpacity="0.05" stroke="#06d6a0" strokeWidth="0.8" strokeDasharray="2,2" />
                        <circle cx="40" cy="45" r="4.5" fill="#06d6a0" className="animate-pulse" />
                        <text x="40" y="74" textAnchor="middle" className="fill-slate-400 font-mono text-[6.5px] font-bold">RAW SENSOR</text>
                        <text x="40" y="27" textAnchor="middle" className="fill-[#06d6a0] font-mono text-[8px] font-black">{sampleRawV.toFixed(2)}V</text>

                        {/* Controller MCU */}
                        <rect x="210" y="5" width="120" height="90" rx="8" fill="#02050c" stroke="#4f46e5" strokeWidth="1.5" />
                        
                        {/* ADC */}
                        <rect x="216" y="25" width="50" height="58" rx="4" fill="#090d16" stroke="#0891b2" strokeWidth="1" />
                        <text x="241" y="35" textAnchor="middle" className="fill-cyan-400 font-mono text-[7px] font-extrabold">ADC</text>
                        <text x="241" y="47" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">DIGITAL OUT</text>
                        <text x="241" y="60" textAnchor="middle" className="fill-[#34d399] font-mono text-[7.5px] font-black">b{binWord}</text>
                        <text x="241" y="72" textAnchor="middle" className="fill-slate-400 font-mono text-[6.5px]">Lvl {levelIdx}</text>

                        {/* Internal link */}
                        <path d="M 266,50 L 274,50" stroke="#4f46e5" strokeWidth="1" strokeDasharray="1,1" />

                        {/* DAC */}
                        <rect x="274" y="25" width="50" height="58" rx="4" fill="#090d16" stroke="#d97706" strokeWidth="1" />
                        <text x="299" y="35" textAnchor="middle" className="fill-amber-500 font-mono text-[7px] font-extrabold">DAC</text>
                        <text x="299" y="47" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">RECONSTRUCT</text>
                        <text x="299" y="60" textAnchor="middle" className="fill-[#a855f7] font-mono text-[7.5px] font-black">{dacVolt.toFixed(2)}V</text>
                        <text x="299" y="72" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">({((1 - Math.abs(qErr)/5.0)*100).toFixed(0)}% acc)</text>

                        <text x="270" y="15" textAnchor="middle" className="fill-indigo-300 font-mono text-[7.5px] font-black uppercase tracking-wider">MCU CORE</text>

                        {/* Actuator */}
                        <rect x="465" y="15" width="70" height="70" rx="8" fill="#02050c" stroke="#1e293b" strokeWidth="1.5" />
                        <text x="500" y="74" textAnchor="middle" className="fill-slate-400 font-mono text-[6.5px] font-bold">DC MOTOR</text>
                        <text x="500" y="27" textAnchor="middle" className="fill-[#3b82f6] font-mono text-[8px] font-black">{dacVolt.toFixed(2)}V</text>

                        {/* Propeller */}
                        <g>
                          <g style={{ transformOrigin: "500px 46px", transform: `rotate(${(simTick * dacVolt * 12) % 360}deg)` }}>
                            <circle cx="500" cy="46" r="4.5" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
                            <path d="M 500,46 Q 492,31 500,19 Q 508,31 500,46 Z" fill="#3b82f6" fillOpacity="0.85" stroke="#60a5fa" strokeWidth="0.5" />
                            <path d="M 500,46 Q 492,61 500,73 Q 508,61 500,46 Z" fill="#3b82f6" fillOpacity="0.85" stroke="#60a5fa" strokeWidth="0.5" />
                          </g>
                          <circle cx="500" cy="46" r="1.5" fill="#cbd5e1" />
                        </g>

                        {/* CONTINUOUS SINE WAVE */}
                        <path 
                          d={(() => {
                            let p = "M 75,50";
                            for (let ix = 0; ix <= 135; ix++) {
                              const px = 75 + ix;
                              const phase = (simTick * 0.12);
                              const angle = (ix / 135) * Math.PI * 2 * 2.5 - phase;
                              const py = 50 + Math.sin(angle) * (6 + (sampleRawV * 1));
                              p += ` L ${px},${py}`;
                            }
                            return p;
                          })()}
                          fill="none" 
                          stroke="#22d3ee" 
                          strokeWidth="1.2" 
                          opacity="0.8"
                        />

                        {/* RECONSTRUCTED WAVE */}
                        <path 
                          d={(() => {
                            let p = "M 324,50";
                            const steps = 6;
                            const stepWidth = 141 / steps;
                            for (let s = 1; s <= steps; s++) {
                              const px_start = 324 + (s-1)*stepWidth;
                              const px_end = 324 + s*stepWidth;
                              const phase = (simTick * 0.08);
                              const angle = (s / steps) * Math.PI * 2 * 2.0 - phase;
                              const stepY = 50 + Math.sin(angle) * (2 + (dacVolt * 2));
                              p += ` L ${px_start},${stepY} L ${px_end},${stepY}`;
                            }
                            return p;
                          })()}
                          fill="none" 
                          stroke="#a855f7" 
                          strokeWidth="1.5" 
                          opacity="0.8"
                        />
                      </svg>
                      
                      <div className="bg-[#1e1b4b]/20 p-2.5 rounded-lg border border-purple-950/40 text-center font-sans text-[10px] text-slate-400 leading-tight">
                        Pipeline Process Summary: Since a microcontroller cannot interpret raw voltage directly, the <span className="text-cyan-400 font-extrabold">ADC</span> sample converts it into digital {adcResolutionBits}-bit intervals. These discrete packets are processed inside the MCU and sent straight back to the <span className="text-amber-500 font-extrabold">DAC</span> which outputs a scaled reconstructed voltage to control the mechanical spinning of physical system actuators.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch text-left">
                      
                      {/* STAGE 1: ANALOG INPUT TRANSCEIVER */}
                      <div className="bg-slate-950/80 border border-slate-900/80 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden h-48">
                        <div className="absolute top-1 right-2 font-mono text-[7px] text-slate-500 uppercase font-black">STAGE 1</div>
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] text-cyan-400 font-extrabold uppercase tracking-wide font-black">ANALOG IN (Voltage Wave)</span>
                          <p className="font-sans text-[9px] text-slate-400 leading-tight">
                            Continuous voltage wave representing a physical sensor.
                          </p>
                        </div>

                        {/* Input tracer preview */}
                        <div className="h-16 bg-slate-950 border border-slate-900/60 rounded-lg flex items-center justify-center relative overflow-hidden my-2">
                          <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
                            {isLiveAdc ? (
                              <path 
                                d={(() => {
                                  let p = "M 0,20";
                                  for (let x = 0; x <= 120; x++) {
                                    const phase = (simTick * 0.1);
                                    const angle = (x / 120) * Math.PI * 2 * 1.5 - phase;
                                    const y = 20 + Math.sin(angle) * 12;
                                    p += ` L ${x},${y}`;
                                  }
                                  return p;
                                })()}
                                fill="none" 
                                stroke="#22d3ee" 
                                strokeWidth="1" 
                              />
                            ) : (
                              <line x1="0" y1={40 - (manualSampleValue/5.0)*30 - 5} x2="120" y2={40 - (manualSampleValue/5.0)*30 - 5} stroke="#22d3ee" strokeWidth="1.5" />
                            )}
                          </svg>
                          <div className="absolute bottom-1 left-2 font-mono text-[8px] text-cyan-400 font-bold">
                            V(in) = {sampleRawV.toFixed(2)}V
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-slate-950 px-2 py-1 select-none rounded-md border border-slate-900 font-mono text-[8.5px]">
                          <span className="text-slate-500 font-bold font-extrabold">SOURCE:</span>
                          <span className="text-cyan-400 font-extrabold">{isLiveAdc ? "SINE WAVE GENERATOR" : "MANUAL SWEEP"}</span>
                        </div>
                      </div>

                      {/* STAGE 2: ADC */}
                      <div className="bg-slate-950/80 border border-slate-900/80 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden h-48">
                        <div className="absolute top-1 right-2 font-mono text-[7px] text-slate-500 uppercase font-black">STAGE 2</div>
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] text-purple-400 font-extrabold uppercase tracking-wide font-black">ANALOG-TO-DIGITAL (ADC)</span>
                          <p className="font-sans text-[9px] text-slate-400 leading-tight">
                            Digitizes input voltage into {adcResolutionBits}-bit register binary word.
                          </p>
                        </div>

                        {/* Flashing binary bits output */}
                        <div className="flex flex-col items-center justify-center my-2 space-y-1">
                          <span className="font-mono text-[7px] text-slate-550 text-slate-500 font-extrabold uppercase">OUTPUT BUS REGISTERS</span>
                          <div className="flex justify-center items-center gap-1">
                            {binWord.split("").map((bit, idx) => {
                              const isHigh = bit === "1";
                              return (
                                <div key={idx} className={`p-1 flex flex-col items-center justify-between border rounded-md min-w-[28px] h-[44px] transition-all bg-[#040812] ${isHigh ? "border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.1)]" : "border-slate-900/80"}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isHigh ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-800"}`} />
                                  <span className="font-mono text-[8.5px] font-black text-white mt-0.5">{bit}</span>
                                  <span className="font-mono text-[6px] text-slate-500 font-black leading-none uppercase mt-0.5">D{adcResolutionBits - 1 - idx}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded-md border border-slate-900 font-mono text-[8.5px]">
                          <span className="text-slate-500 font-bold font-extrabold">DIGITAL VALUE:</span>
                          <span className="text-emerald-400 font-black">b{binWord} (Lvl {levelIdx})</span>
                        </div>
                      </div>

                      {/* STAGE 3: DAC */}
                      <div className="bg-slate-950/80 border border-slate-900/80 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden h-48">
                        <div className="absolute top-1 right-2 font-mono text-[7px] text-slate-500 uppercase font-black">STAGE 3</div>
                        <div className="space-y-1">
                          <span className="font-mono text-[8.5px] text-amber-500 font-extrabold uppercase tracking-wide font-black">DIGITAL-TO-ANALOG (DAC)</span>
                          <p className="font-sans text-[9px] text-slate-400 leading-tight">
                            Resistor R-2R ladder sums weighted bits back into analog staircase voltage.
                          </p>
                        </div>

                        {/* R-2R networking schematic */}
                        <div className="h-16 bg-slate-950 border border-slate-900/60 rounded-lg flex flex-col items-center justify-center relative overflow-hidden my-2 py-1 space-y-0.5">
                          <div className="flex items-center gap-1 text-[#fbbf24] font-mono text-[8px] tracking-tight">
                            <span>REG BUS</span>
                            <span>➔</span>
                            <span className="bg-amber-950/20 px-1 border border-amber-900/40 rounded text-[7px]">R-2R NET</span>
                            <span>➔</span>
                            <span className="text-purple-400 font-bold">DAC V(out)</span>
                          </div>
                          <svg className="w-full h-7 mb-0.5" viewBox="0 0 120 30">
                            <line x1="10" y1="5" x2="110" y2="5" stroke="#1e293b" strokeWidth="1" />
                            <text x="10" y="27" fill="#fbbf24" fontSize="6px" fontFamily="monospace">LSB</text>
                            <text x="100" y="27" fill="#fbbf24" fontSize="6px" fontFamily="monospace">MSB</text>

                            {[20, 45, 70, 95].map((x, i) => {
                              const bitIdx = adcResolutionBits - 1 - i;
                              const isBitHigh = bitIdx >= 0 ? binWord[bitIdx] === "1" : false;
                              return (
                                <g key={i}>
                                  <line x1={x} y1="5" x2={x} y2="15" stroke={isBitHigh ? "#fbbf24" : "#1e293b"} strokeWidth={isBitHigh ? "1.2" : "1"} />
                                  <rect x={x-2} y="11" width="4" height="6" fill="#1e293b" stroke={isBitHigh ? "#fbbf24" : "#475569"} strokeWidth="0.8" rx="1" />
                                </g>
                              );
                            })}
                            <line x1="20" y1="18" x2="110" y2="18" stroke="#f59e0b" strokeWidth="1" strokeDasharray="1,1" />
                          </svg>
                          <div className="absolute bottom-0.5 right-2 font-mono text-[7px] text-amber-500 font-bold">
                            Recon V = {dacVolt.toFixed(2)}V
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-slate-950 px-2 py-1 rounded-md border border-slate-900 font-mono text-[8.5px]">
                          <span className="text-slate-500 font-extrabold uppercase flex items-center justify-between">DAC ACCURACY:</span>
                          <span className="text-amber-400 font-extrabold">{dacVolt.toFixed(2)}V ({((1 - Math.abs(qErr)/5.0)*100).toFixed(0)}%)</span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-900 bg-[#060a12] p-4 text-center text-xs text-slate-500 select-none">
              Interactive Hardware Emulation Module • Change ADC/DAC parameters or modes to observe live digital quantization effects.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
