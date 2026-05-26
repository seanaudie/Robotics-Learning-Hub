import React, { useState } from "react";
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
  Cpu
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
    id: "fingerprint",
    name: "Optical Fingerprint Scanner",
    symbol: "S-FPS",
    description: "Captures biometrics and checks safe hashes.",
    details: "Constructs biometric hash maps on request, comparing scans with saved internal secure databases."
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
  },
  {
    id: "jetson",
    name: "NVIDIA Jetson Nano",
    symbol: "C-JET",
    description: "AI-Specialist computer featuring Maxwell GPU.",
    details: "Unlocks high-performance machine learning inference directly on the platform, like facial matching."
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
  },
  {
    id: "solenoid_lock",
    name: "12V Electronic Deadbolt",
    symbol: "A-SOL",
    description: "Electromagnetic core piston lock.",
    details: "When energized with 12V supply, the copper core generates a powerful electromagnetic field, pulling back the bolt frame."
  }
];

// Presets representing the case studies
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
    actuator: "solenoid_lock",
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
    id: "clapped_light",
    title: "Acoustic Sound Toggle Light",
    subtitle: "Clasp dynamic response framework",
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
  },
  {
    id: "biometric_vault",
    title: "AI Security Fingerprint lock",
    subtitle: "Encrypted structural barricade gate",
    sensor: "fingerprint",
    controller: "jetson",
    actuator: "solenoid_lock",
    explanation: "High intelligence gatekeeper network. Captures localized fingerprint contours, converts them to encrypted security hashes and releases mechanical locks on successful match.",
    flowSteps: [
      { shape: "circle", label: "BOOT SENSOR", subtext: "Establish cryptographic check", x: 125, y: 15, width: 90, height: 40 },
      { shape: "parallelogram", label: "SCAN FINGER", subtext: "Upload localized visual contours", x: 105, y: 80, width: 130, height: 45 },
      { shape: "rectangle", label: "COMPUTE HASH", subtext: "Run secure matching filter", x: 110, y: 150, width: 120, height: 45 },
      { shape: "diamond", label: "MATCH OK?", subtext: "Validate entry conditions", x: 105, y: 220, width: 130, height: 80 },
      { shape: "parallelogram", label: "RELEASE BOLT", subtext: "De-energize deadbolt magnet", x: 10, y: 325, width: 120, height: 45 },
      { shape: "rectangle", label: "LOCK LOCKOUT", subtext: "Sound Piezo audio alert pin", x: 210, y: 325, width: 120, height: 45 }
    ],
    flowArrows: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4, label: "YES", direction: "left" },
      { from: 3, to: 5, label: "NO", direction: "right" }
    ]
  }
];

export interface RobotTypeOption {
  id: string;
  name: string;
  category: string;
  description: string;
  coreConcepts: string[];
  componentsNeeded: {
    sensors: string[];
    controllers: string[];
    actuators: string[];
  };
  useCases: string[];
}

export const ROBOT_TYPES_DATA: RobotTypeOption[] = [
  {
    id: "wheeled_rover",
    name: "Differential Drive Wheeled Rover",
    category: "Mobile Robotics",
    description: "Features independent left and right wheel speeds to spin or crawl across terrains. Common starting point for navigation and mapping systems.",
    coreConcepts: ["Kinematics scaling", "Speed matching", "Closed-loop feedback control"],
    componentsNeeded: {
      sensors: ["Ultrasonic Distance Sensor", "LDR Photoresistor"],
      controllers: ["Arduino Uno R3", "ESP32 Core Module"],
      actuators: ["DC Gear Motor Suite", "SG90 Micro Servo"]
    },
    useCases: ["Warehouse inventory crawlers", "Planetary rovers", "Autonomous vacuum sweepers"]
  },
  {
    id: "mechanical_arm",
    name: "Multiaxial Manipulator Arm",
    category: "Industrial Robotics",
    description: "An articulated arm that mimics human arm movement with multiple degrees of freedom (DOF). Driven by precision angles and coordinate systems.",
    coreConcepts: ["Inverse Kinematics (IK)", "Angular microstate precision", "Load distribution limits"],
    componentsNeeded: {
      sensors: ["Acoustic Decibel Microphone", "Optical Fingerprint Scanner"],
      controllers: ["Arduino Uno R3", "NVIDIA Jetson Nano"],
      actuators: ["SG90 Micro Servo", "12V Electronic Deadbolt"]
    },
    useCases: ["Precision pick-and-place assemblers", "Automated surgery assistants", "Laser cutting systems"]
  },
  {
    id: "iot_automation",
    name: "Automated Climate System",
    category: "Cyber-Physical & IoT",
    description: "Integrates environmental read loops with high-accuracy microcircuit actuators. Monitors physical thresholds and streams logs to server sockets.",
    coreConcepts: ["Wi-Fi socket broadcasts", "Relay state transitions", "ADC analog voltage quantization"],
    componentsNeeded: {
      sensors: ["Soil Moisture Sensor", "LDR Photoresistor"],
      controllers: ["ESP32 Core Module"],
      actuators: ["12V Electronic Deadbolt", "Acoustic Piezo Buzzer"]
    },
    useCases: ["Eco-smart vertical greenhouses", "Automated urban water conservation grid", "Industrial cleanroom safeguards"]
  },
  {
    id: "biometric_sentry",
    name: "AI Edge Vision Sentry Guard",
    category: "Automated Security & AI",
    description: "Leverages direct machine learning processing to restrict hardware entry points. Inspects cryptographic inputs or high-resolution facial matching.",
    coreConcepts: ["Edge image classification", "Biometric secure hash comparison", "Continuous interrupt triggers"],
    componentsNeeded: {
      sensors: ["Optical Fingerprint Scanner", "Ultrasonic Distance Sensor"],
      controllers: ["NVIDIA Jetson Nano"],
      actuators: ["12V Electronic Deadbolt", "Acoustic Piezo Buzzer", "SG90 Micro Servo"]
    },
    useCases: ["High-security banking portals", "Automated custom check-in gates", "Hazardous area lockdown suites"]
  }
];

export interface OpenProjectOption {
  id: string;
  name: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
  description: string;
  partsList: string[];
  blockDiagramSteps: string[];
}

export const OPEN_PROJECTS_DATA: OpenProjectOption[] = [
  {
    id: "sentry_gate",
    name: "SafeGuard Fingerprint Vault Lid",
    complexity: "Advanced",
    timeEstimate: "6 - 8 Hours",
    description: "An AI-enhanced secure hatch system. Placing an authorized biometric scan triggers the NVIDIA Jetson Nano to calculate database matches. On positive authentication, the 12V solenoid core is pulled back and the servo swings open the visual lock hatch.",
    partsList: ["Optical Fingerprint Scanner", "NVIDIA Jetson Nano", "12V Electronic Deadbolt", "SG90 Micro Servo", "Acoustic Piezo Buzzer"],
    blockDiagramSteps: [
      "Fingerprint Scanner registers contour hash map",
      "Jetson Nano runs local secure DB validation matching",
      "On Success: Solenoid retreats, SG90 Servo sweeps 90 degrees",
      "On Failure: Solenoid remains locked, Piezo buzzer sounds alarm beeps"
    ]
  },
  {
    id: "avoidance_cart",
    name: "Sensing Obstacle Explorer Rover",
    complexity: "Beginner",
    timeEstimate: "2 - 3 Hours",
    description: "Classic differential rover built on an Arduino brain. The front-mounted Ultrasonic distance sensor swings on a servo. If an obstruction is detected closer than 15cm, the loop calculates navigation vectors, reverses the drive motors, spins, and advances in clear paths.",
    partsList: ["Ultrasonic Distance Sensor", "Arduino Uno R3", "DC Gear Motor Suite", "SG90 Micro Servo"],
    blockDiagramSteps: [
      "Ultrasonic Sensor broadcasts 40kHz ultrasound bursts",
      "Arduino computes echo bounce timing back to distance in cm",
      "If distance < 15cm: Reverse and turn DC drive wheels in opposite directions",
      "If distance is safe: Accelerate DC motors forward to crawl"
    ]
  },
  {
    id: "solar_irrigator",
    name: "Wireless Eco-Hydration Smart Planter",
    complexity: "Intermediate",
    timeEstimate: "3 - 5 Hours",
    description: "An eco-friendly IoT system. Features an ESP32 microcircuit that periodically wakes from deep sleep to read soil moisture content and light levels via an LDR. Sockets check weather limits: if soil is parched, a DC-powered solenoid valve opens to hydrate root nodes.",
    partsList: ["Soil Moisture Sensor", "LDR Photoresistor", "ESP32 Core Module", "12V Electronic Deadbolt"],
    blockDiagramSteps: [
      "ESP32 wakes from low-power deep sleep mode",
      "Saves analog LDR Light and Soil moisture voltage levels",
      "If Moisture falls below 45%: Energize 12V solenoid to initiate water cycle",
      "Transmit telemetry data stream online over Wi-Fi and return to sleep"
    ]
  },
  {
    id: "clapped_alarm",
    name: "Transient Sound Triggered Lock Screen",
    complexity: "Beginner",
    timeEstimate: "1 - 2 Hours",
    description: "A secure physical toggle triggered by sound thresholds. High-decibel transients (such as double physical hand claps) are caught by the analog microphone. The Arduino filters out background humming, and triggers the SG90 joint servo to rotate a physical locking mechanism.",
    partsList: ["Acoustic Decibel Microphone", "Arduino Uno R3", "SG90 Micro Servo", "Acoustic Piezo Buzzer"],
    blockDiagramSteps: [
      "Microphone reads continuous pressure fluctuations",
      "Arduino checks if voltage exceeds transient baseline values",
      "Filter out isolated single spikes (expects double-clap sequence)",
      "Command SG90 Servo to pivot 180 degrees to hook or release locks"
    ]
  }
];

export default function RoboticsGuide() {
  const [activeGuideTab, setActiveGuideTab] = useState<"pillars" | "flowchart" | "architect" | "types">("pillars");
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [selectedShape, setSelectedShape] = useState<string | null>("diamond");

  // New states for Types and Open Projects list selections
  const [selectedTypeIdx, setSelectedTypeIdx] = useState<number>(0);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number>(0);

  // Custom blueprint states
  const [customSensor, setCustomSensor] = useState<string>("ultrasonic");
  const [customController, setCustomController] = useState<string>("arduino");
  const [customActuator, setCustomActuator] = useState<string>("motor_driver");
  const [isSimulatingCustom, setIsSimulatingCustom] = useState<boolean>(false);
  const [simulationLogStr, setSimulationLogStr] = useState<string[]>([]);

  const activeCase = CASE_STUDIES[selectedCaseIdx];

  const triggerCustomSimulation = () => {
    setIsSimulatingCustom(true);
    setSimulationLogStr([]);
    
    const sensorObj = SENSOR_OPTIONS.find(s => s.id === customSensor)!;
    const controllerObj = CONTROLLER_OPTIONS.find(c => c.id === customController)!;
    const actuatorObj = ACTUATOR_OPTIONS.find(a => a.id === customActuator)!;

    const steps = [
      `[1/4] [SYS] System initialized. Power rails operational at stable input voltages.`,
      `[2/4] [INPUT] Interrogating sensor... ${sensorObj.name} is registering direct physical variables.`,
      `[3/4] [PROCESS] Processing central logic on the ${controllerObj.name}... Computing threshold variables.`,
      `[4/4] [OUTPUT] Output command sent! Active signal successfully pulsing the ${actuatorObj.name}. Loop repeating...`
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationLogStr(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsSimulatingCustom(false);
        }
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full px-1" id="robotics-edu-suite">
      {/* Header card explaining why we build systems */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8" id="edu-hero-intro">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-sky-500/0 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              Stem Learning Lab
            </span>
            <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
              ROBOTICS SYSTEM & LOGIC ENGINEERING
            </h2>
            <p className="font-sans text-xs md:text-sm text-slate-400 leading-relaxed">
              Every autonomous machine is built upon a continuous cycle: it senses its environment, computes logic paths, and translates commands into physical motion. Master flowcharting to build flawless firmware logic!
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:self-center">
            {([
              { id: "pillars", label: "Three Pillars", icon: Settings },
              { id: "flowchart", label: "Logic Flowcharts", icon: Activity },
              { id: "architect", label: "Blueprint Architect", icon: Sliders },
              { id: "types", label: "Robot Examples", icon: Bot }
            ] as const).map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeGuideTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveGuideTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10.5px] font-bold uppercase border transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-500 text-white border-indigo-400 font-bold shadow-md shadow-indigo-500/20"
                      : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-950/20"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pillars of Robotics View */}
      {activeGuideTab === "pillars" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="three-pillars-view">
          {/* Card 1: Sensors */}
          <div className="rounded-2xl border border-slate-850 bg-slate-950/40 p-5 space-y-4 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-sky-400" />
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-bold">STAGE 01 — INPUT</span>
              </div>
              <h3 className="font-sans font-extrabold text-lg text-slate-200 uppercase tracking-tight">1. Sensory Ingestion</h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                Sensors are the eyes, ears, and nerves of a cybernetic platform. They catch tangible physics waveforms in real-time (such as light intensity, sound barriers, structural vibrations, or atmospheric levels) and translate them into a form the brain can read.
              </p>
              <div className="space-y-1.5 pt-2">
                <span className="font-mono text-[9px] text-[#94a3b8] font-extrabold tracking-wider block uppercase">Examples:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">Ultrasonic Sourcing (S-ULS)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">Soil Moisture Sensor (S-SMO)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">GPIO Touch Switch (S-FPS)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">Analog LDR Photoresistor (S-LDR)</span>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-900 pt-3 flex items-center gap-2 text-[10.5px] font-mono text-sky-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Converts physics into Voltage levels.</span>
            </div>
          </div>

          {/* Card 2: Microcontrollers */}
          <div className="rounded-2xl border border-slate-850 bg-slate-950/40 p-5 space-y-4 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-bold">STAGE 02 — PROCESSING</span>
              </div>
              <h3 className="font-sans font-extrabold text-lg text-slate-200 uppercase tracking-tight">2. Microprocessing</h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                The centralized computing module acts as the machine's brain. It operates an infinite logical loop of firmware instructions. It reads input values from PIN registers, computes logic algorithms (like threshold and state checking), and targets specific output signals.
              </p>
              <div className="space-y-1.5 pt-2">
                <span className="font-mono text-[9px] text-[#94a3b8] font-extrabold tracking-wider block uppercase">Examples:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">Arduino Uno Board (C-ARD)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">ESP32 Core Module (C-ESP)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">NVIDIA Jetson Nano (C-JET)</span>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-900 pt-3 flex items-center gap-2 text-[10.5px] font-mono text-indigo-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Decides logic forks via program parameters.</span>
            </div>
          </div>

          {/* Card 3: Actuators */}
          <div className="rounded-2xl border border-slate-850 bg-slate-950/40 p-5 space-y-4 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-bold">STAGE 03 — OUTPUT</span>
              </div>
              <h3 className="font-sans font-extrabold text-lg text-slate-200 uppercase tracking-tight">3. Active Actuation</h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                Actuators are the muscles of your robotic system. They receive electrical pulses, pulses representing instructions (such as PWM duty cycles or active continuous power states), and transform them into real-world work like rotation, sound waves, or lock-bolt transitions.
              </p>
              <div className="space-y-1.5 pt-2">
                <span className="font-mono text-[9px] text-[#94a3b8] font-extrabold tracking-wider block uppercase">Examples:</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">SG90 Servo Drive (A-SRV)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">DC Geared Chassis (A-MTR)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">12V Solenoid Bolt (A-SOL)</span>
                  <span className="text-[11px] font-sans font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md">Acoustic Piezo Buzzer (A-BUZ)</span>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-900 pt-3 flex items-center gap-2 text-[10.5px] font-mono text-emerald-400">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Executes mechanical and continuous work.</span>
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
                    indicator: <div className="w-4 h-4 rounded-full border border-amber-500 bg-amber-500/10 shrink-0" />, 
                    desc: "Specifies initialization of program memory boot cycle or structural cessation.",
                    code: "Called only once at system bootup.\nvoid setup() {\n  initSensors();\n}"
                  },
                  { 
                    id: "parallelogram", 
                    name: "Input / Output Shape", 
                    shape: "Parallelogram", 
                    indicator: <div className="w-4 h-3.5 border border-pink-500 bg-pink-500/10 -skew-x-12 shrink-0" />, 
                    desc: "Reads digital/analog inputs from physical pins or writes commands directly to active components.",
                    code: "digitalRead(triggerPin);\nanalogWrite(motorPin, 180);"
                  },
                  { 
                    id: "rectangle", 
                    name: "Process Shape", 
                    shape: "Rectangle", 
                    desc: "Calculates metric math, coordinates variables updates, scales levels, or triggers timers.",
                    indicator: <div className="w-4 h-3 border border-purple-500 bg-purple-500/10 rounded shrink-0" />,
                    code: "float distanceCm = pulseDuration * 0.034 / 2.0;\ndelay(1000);"
                  },
                  { 
                    id: "diamond", 
                    name: "Decision Fork Shape", 
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
                      onClick={() => setSelectedShape(block.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isFocused 
                          ? "border-sky-500 bg-sky-500/[0.04] ring-1 ring-sky-500/30" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {block.indicator}
                        <div>
                          <h4 className="font-sans font-bold text-slate-200 text-xs">{block.name}</h4>
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
                      <h4 className="font-sans font-extrabold text-sm text-sky-400 uppercase tracking-wider">Start/End logic guide</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Every system flow requires a clear initiator block. In standard robotics code, the **Start** correlates with starting the power rails, loading peripheral registers, and specifying input/output pin modes.
                      </p>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="font-mono text-[9px] text-slate-500 uppercase font-bold block mb-1">C++ Firmware Equivalent</span>
                        <pre className="font-mono text-[10px] text-emerald-400 leading-normal overflow-x-auto whitespace-pre">
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
                      <h4 className="font-sans font-extrabold text-sm text-pink-400 uppercase tracking-wider">Input / Output logic guide</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Denotes data interactions. An **Input** reads raw parameters from physical pins (such as distance or pressure intensity). An **Output** changes component states by writing logical High/Low signals.
                      </p>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="font-mono text-[9px] text-slate-500 uppercase font-bold block mb-1">C++ Firmware Equivalent</span>
                        <pre className="font-mono text-[10px] text-pink-300 leading-normal overflow-x-auto whitespace-pre">
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
                        <pre className="font-mono text-[10px] text-purple-300 leading-normal overflow-x-auto whitespace-pre">
{`float dist = (pulseMs * 0.0343) / 2.0;
delay(250); // Pause execution`}
                        </pre>
                      </div>
                    </>
                  )}

                  {selectedShape === "diamond" && (
                    <>
                      <h4 className="font-sans font-extrabold text-sm text-yellow-500 uppercase tracking-wider">Decision forks guide</h4>
                      <p className="font-sans text-xs text-slate-400 leading-relaxed">
                        Splits flowchart into parallel executions. Compares values against conditional limits. Branching pathways must always be clearly labeled **YES (True)** or **NO (False)**.
                      </p>
                      <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                        <span className="font-mono text-[9px] text-slate-500 uppercase font-bold block mb-1">C++ Firmware Equivalent</span>
                        <pre className="font-mono text-[10px] text-yellow-300 leading-normal overflow-x-auto whitespace-pre">
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
                    Logical Implementation Blueprints
                  </h3>
                  <p className="font-sans text-[11px] text-slate-500">Pick an engineering system to view its structural flowchart:</p>
                </div>
                {/* Cases toggle */}
                <div className="flex flex-wrap gap-1">
                  {CASE_STUDIES.map((c, i) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaseIdx(i)}
                      className={`font-mono text-[9.5px] px-2.5 py-1 rounded-md transition-all cursor-pointer border ${
                        selectedCaseIdx === i
                          ? "bg-slate-900 border-indigo-500 text-indigo-400 font-extrabold"
                          : "border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Case {i + 1}
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
                <div className="flex flex-col gap-1 pr-1 border-l border-slate-900/60 pl-3 shrink-0">
                  <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider">Sourcing System Map:</span>
                  <span className="text-[11px] font-sans text-slate-300">[IN] Sensor: <strong className="font-bold text-sky-400">{SENSOR_OPTIONS.find(s => s.id === activeCase.sensor)?.name}</strong></span>
                  <span className="text-[11px] font-sans text-slate-300">[CPU] Brain: <strong className="font-bold text-indigo-400">{CONTROLLER_OPTIONS.find(c => c.id === activeCase.controller)?.name}</strong></span>
                  <span className="text-[11px] font-sans text-slate-300">[OUT] Actuator: <strong className="font-bold text-emerald-400">{ACTUATOR_OPTIONS.find(a => a.id === activeCase.actuator)?.name}</strong></span>
                </div>
              </div>

              {/* Render Flowchart SVG */}
              <div className="bg-[#020617] p-4 rounded-xl border border-slate-900 flex justify-center items-center overflow-x-auto min-h-[420px]" id="interactive-svg-flowchart">
                <svg viewBox="0 0 340 400" className="w-full max-w-lg h-auto select-none font-mono text-[9.5px]">
                  {/* Arrow Marker Definitions */}
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6366f1" />
                    </marker>
                  </defs>

                  {/* Flow Lines */}
                  {activeCase.flowArrows.map((arrow, idx) => {
                    const fromNode = activeCase.flowSteps[arrow.from];
                    const toNode = activeCase.flowSteps[arrow.to];
                    
                    // Simple logic to calculate coordinates for connections
                    let startX = fromNode.x + fromNode.width / 2;
                    let startY = fromNode.y + fromNode.height;
                    let endX = toNode.x + toNode.width / 2;
                    let endY = toNode.y;

                    // Adjust for branching YES/NO pathways
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

                    return (
                      <g key={idx}>
                        <path
                          d={dPath}
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                          markerEnd="url(#arrow)"
                          className="opacity-80"
                        />
                        {arrow.label && (
                          <text
                            x={arrow.direction === "left" ? startX - 22 : startX + 22}
                            y={startY + 15}
                            textAnchor="middle"
                            className={`font-extrabold text-[8px] font-mono ${arrow.label === "YES" ? "fill-emerald-400" : "fill-rose-400"}`}
                          >
                            {arrow.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Flow Shapes rendering */}
                  {activeCase.flowSteps.map((step, idx) => {
                    const idString = `step-${idx}`;
                    let shapeNode = null;

                    if (step.shape === "circle") {
                      shapeNode = (
                        <rect
                          x={step.x}
                          y={step.y}
                          width={step.width}
                          height={step.height}
                          rx={step.height / 2}
                          className="stroke-amber-500 fill-amber-950/20"
                          strokeWidth="2"
                        />
                      );
                    } else if (step.shape === "parallelogram") {
                      // Custom polygon to render nice slanted parallelogram
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
                          className="stroke-pink-500 fill-pink-950/10"
                          strokeWidth="2"
                        />
                      );
                    } else if (step.shape === "rectangle") {
                      shapeNode = (
                        <rect
                          x={step.x}
                          y={step.y}
                          width={step.width}
                          height={step.height}
                          rx="4"
                          className="stroke-purple-500 fill-purple-950/20"
                          strokeWidth="2"
                        />
                      );
                    } else if (step.shape === "diamond") {
                      const halfW = step.width / 2;
                      const halfH = step.height / 2;
                      const midX = step.x + halfW;
                      const midY = step.y + halfH;
                      const points = `
                        ${midX},${step.y} 
                        ${step.x + step.width},${midY} 
                        ${midX},${step.y + step.height} 
                        ${step.x},${midY}
                      `;
                      shapeNode = (
                        <polygon
                          points={points}
                          className="stroke-yellow-500 fill-yellow-950/10"
                          strokeWidth="2"
                        />
                      );
                    }

                    return (
                      <g key={idx} className="transition-all hover:scale-[1.01]" id={idString}>
                        {shapeNode}
                        <text
                          x={step.x + step.width / 2}
                          y={step.y + step.height / 2 - 1.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-slate-100 font-extrabold text-[9px] pointer-events-none uppercase tracking-wide"
                        >
                          {step.label}
                        </text>
                        <text
                          x={step.x + step.width / 2}
                          y={step.y + step.height / 2 + 10}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-slate-400 text-[6.5px] pointer-events-none"
                        >
                          {step.subtext}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive System Blueprint Architect View */}
      {activeGuideTab === "architect" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="blueprint-architect-container">
          {/* Custom Selection Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-400 font-extrabold">Engineering Laboratory</span>
              <h3 className="font-sans font-extrabold text-[#f1f5f9] text-[14px] uppercase tracking-wide">
                Robotics Hardware Customizer
              </h3>
              <p className="font-sans text-xs text-slate-400 leading-relaxed">
                Connect your chosen components dynamically. We will automatically map out the signal directions and build the operational logic system!
              </p>

              {/* Selector 1: Sensors */}
              <div className="space-y-1.5 pt-1.5 border-t border-slate-900">
                <label className="font-mono text-[11px] uppercase font-bold text-sky-400 flex items-center gap-1.5 justify-between">
                  <span>1. Choose Sensor Input</span>
                  <span className="text-slate-500">STAGE 1</span>
                </label>
                <div className="relative">
                  <select
                    value={customSensor}
                    onChange={(e) => setCustomSensor(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-lg p-2.5 font-sans text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {SENSOR_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>[{opt.symbol}] {opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selector 2: Microcontroller */}
              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                <label className="font-mono text-[9px] uppercase font-bold text-indigo-400 flex items-center gap-1.5 justify-between">
                  <span>2. Select Microcontroller Brain</span>
                  <span className="text-slate-500">STAGE 2</span>
                </label>
                <div className="relative">
                  <select
                    value={customController}
                    onChange={(e) => setCustomController(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-lg p-2.5 font-sans text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {CONTROLLER_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>[{opt.symbol}] {opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selector 3: Actuator */}
              <div className="space-y-1.5 pt-2 border-t border-slate-900">
                <label className="font-mono text-[9px] uppercase font-bold text-emerald-400 flex items-center gap-1.5 justify-between">
                  <span>3. Select Output Actuator</span>
                  <span className="text-slate-500">STAGE 3</span>
                </label>
                <div className="relative">
                  <select
                    value={customActuator}
                    onChange={(e) => setCustomActuator(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-lg p-2.5 font-sans text-xs text-slate-200 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {ACTUATOR_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>[{opt.symbol}] {opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={triggerCustomSimulation}
                disabled={isSimulatingCustom}
                className="w-full py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-indigo-500 to-sky-500 hover:opacity-90 text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                <Activity className="w-4 h-4 animate-pulse shrink-0" />
                {isSimulatingCustom ? "Running diagnostic simulation..." : "Simulate Electronic Loop"}
              </button>
            </div>
          </div>

          {/* Core logic output console */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <div>
                    <h3 className="font-sans font-extrabold text-[#f1f5f9] text-[13.5px] uppercase tracking-wide">
                      Dynamic Code System Blueprint
                    </h3>
                    <p className="font-sans text-[10.5px] text-slate-500">How your custom tailored components interact in a real loop:</p>
                  </div>
                  <span className="font-mono text-[9px] bg-slate-900 text-sky-400 border border-slate-800/80 px-2 py-0.5 rounded font-bold">
                    CONNECTED STATE
                  </span>
                </div>

                {/* 3 Blocks sequence show */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-[#030712] p-3 rounded-xl border border-slate-900 text-center relative">
                    <span className="font-mono text-[8px] text-sky-400 font-extrabold tracking-wider block mb-1 uppercase">Sensing (Input)</span>
                    <span className="inline-block mt-0.5 mb-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-sky-950/40 border border-sky-800/30 text-sky-400 rounded-md">
                      {SENSOR_OPTIONS.find(s => s.id === customSensor)?.symbol}
                    </span>
                    <h4 className="font-sans font-bold text-xs text-slate-300 truncate">{SENSOR_OPTIONS.find(s => s.id === customSensor)?.name}</h4>
                  </div>
                  
                  <div className="bg-[#030712] p-3 rounded-xl border border-slate-900 text-center relative flex flex-col items-center justify-center">
                    <span className="font-mono text-[8px] text-indigo-400 font-extrabold tracking-wider block mb-1 uppercase">Sourcing (Processing)</span>
                    <span className="inline-block mt-0.5 mb-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-indigo-950/40 border border-indigo-800/30 text-indigo-400 rounded-md">
                      {CONTROLLER_OPTIONS.find(c => c.id === customController)?.symbol}
                    </span>
                    <h4 className="font-sans font-bold text-xs text-slate-300 truncate">{CONTROLLER_OPTIONS.find(c => c.id === customController)?.name}</h4>
                  </div>

                  <div className="bg-[#030712] p-3 rounded-xl border border-slate-900 text-center relative">
                    <span className="font-mono text-[10px] text-emerald-400 font-extrabold tracking-wider block mb-1 uppercase">Driving (Output)</span>
                    <span className="inline-block mt-0.5 mb-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 rounded-md">
                      {ACTUATOR_OPTIONS.find(a => a.id === customActuator)?.symbol}
                    </span>
                    <h4 className="font-sans font-bold text-xs text-slate-300 truncate">{ACTUATOR_OPTIONS.find(a => a.id === customActuator)?.name}</h4>
                  </div>
                </div>

                {/* Simulated feedback screen */}
                <div className="rounded-xl border border-slate-900 bg-[#030712] p-3.5 space-y-2.5">
                  <span className="font-mono text-[9px] text-slate-400 tracking-wider block uppercase">Systems Engineers Analysis:</span>
                  <div className="space-y-1.5">
                    <p className="font-sans text-xs text-slate-300 leading-relaxed">
                      The <strong className="text-indigo-400">{CONTROLLER_OPTIONS.find(c => c.id === customController)?.name}</strong> reads physical data spikes sourced from the <strong className="text-sky-400">{SENSOR_OPTIONS.find(s => s.id === customSensor)?.name}</strong>. If measured thresholds go critical, logic coordinates commands to fire the <strong className="text-emerald-400">{ACTUATOR_OPTIONS.find(a => a.id === customActuator)?.name}</strong> immediately.
                    </p>
                    <p className="font-sans text-[11px] text-slate-500 italic">
                      {SENSOR_OPTIONS.find(s => s.id === customSensor)?.details} {ACTUATOR_OPTIONS.find(a => a.id === customActuator)?.details}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shell diagnostic logging mock */}
              <div className="rounded-xl border border-slate-900 bg-slate-950 p-4 font-mono text-[10px] space-y-2 min-h-[145px]" id="simulated-logger">
                <div className="flex items-center justify-between text-slate-600 border-b border-slate-900 pb-1.5 select-none">
                  <span>LOG FREQUENCY STREAM (9600 BAUD)</span>
                  <span>ONLINE</span>
                </div>
                <div className="space-y-1 text-slate-400">
                  {simulationLogStr.length === 0 ? (
                    <div className="text-slate-500 italic py-5 text-center">
                      Click "Simulate Electronic Loop" to stream microsecond diagnostics...
                    </div>
                  ) : (
                    simulationLogStr.map((log, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={idx === simulationLogStr.length - 1 ? "text-emerald-400 font-bold" : ""}
                      >
                        {log}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Types of Robots & Open Projects View */}
      {activeGuideTab === "types" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="types-and-projects-container">
          
          {/* Left Panel: Types of Robot Examples */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <div className="p-1 px-2 rounded bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold uppercase border border-indigo-500/20">
                  Concept Guide
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                    Types of Robot Architectures
                  </h3>
                  <p className="font-sans text-[11px] text-slate-500">Explore foundational mechanical layouts and their execution models:</p>
                </div>
              </div>

              {/* Grid of Robot Types buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                {ROBOT_TYPES_DATA.map((type, idx) => {
                  const isSelected = selectedTypeIdx === idx;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedTypeIdx(idx)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[105px] ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-500/[0.04] ring-1 ring-indigo-500/30" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-905/30"
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase text-indigo-400 font-bold">{type.category}</span>
                      <h4 className="font-sans font-extrabold text-slate-100 text-xs mt-1 leading-tight">{type.name}</h4>
                    </button>
                  );
                })}
              </div>

              {/* Active Robot Type Explanation Card */}
              {(() => {
                const activeType = ROBOT_TYPES_DATA[selectedTypeIdx];
                return (
                  <motion.div
                    key={activeType.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-slate-900 bg-[#030712] space-y-3"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 uppercase font-bold tracking-widest">{activeType.category} Architecture</span>
                      <h4 className="font-sans text-sm font-extrabold text-[#38bdf8] uppercase tracking-wide mt-0.5">{activeType.name}</h4>
                      <p className="font-sans text-[11.5px] text-slate-400 leading-relaxed mt-1.5">{activeType.description}</p>
                    </div>

                    {/* Core Mechanics */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-900/60">
                      <span className="font-mono text-[10px] uppercase text-slate-500 tracking-wider">Core Engineering Concepts:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeType.coreConcepts.map((concept, i) => (
                          <span key={i} className="text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded-full font-sans">
                            • {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Components Used */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900/60 font-sans text-[10px]">
                      <div className="p-2 rounded bg-slate-950/40 border border-slate-900">
                        <span className="font-mono text-[7.5px] uppercase text-sky-400 block mb-1 font-bold">Sensors</span>
                        <ul className="space-y-0.5 text-slate-400">
                          {activeType.componentsNeeded.sensors.map((s, i) => <li key={i} className="truncate">• {s}</li>)}
                        </ul>
                      </div>
                      <div className="p-2 rounded bg-slate-950/40 border border-slate-900">
                        <span className="font-mono text-[7.5px] uppercase text-indigo-400 block mb-1 font-bold">Controllers</span>
                        <ul className="space-y-0.5 text-slate-400">
                          {activeType.componentsNeeded.controllers.map((c, i) => <li key={i} className="truncate">• {c}</li>)}
                        </ul>
                      </div>
                      <div className="p-2 rounded bg-slate-950/40 border border-slate-900">
                        <span className="font-mono text-[9px] uppercase text-emerald-400 block mb-1 font-bold">Actuators</span>
                        <ul className="space-y-0.5 text-slate-400">
                          {activeType.componentsNeeded.actuators.map((a, i) => <li key={i} className="truncate">• {a}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* Common Use cases */}
                    <div className="pt-1.5">
                      <span className="font-mono text-[8px] uppercase text-slate-500 tracking-wider block mb-1">Industrial & Consumer Applications:</span>
                      <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-sans">
                        {activeType.useCases.map((use, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          </div>

          {/* Right Panel: Open Projects utilizing Provided Components */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <div className="p-1 px-2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold uppercase border border-emerald-500/20">
                  Open Projects
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-[#f1f5f9] text-sm uppercase tracking-wider">
                    Build Projects from Provided Hardware
                  </h3>
                  <p className="font-sans text-[11px] text-slate-500">Pick an open source schema to review its parts checklist and steps:</p>
                </div>
              </div>

              {/* Grid of Open Projects buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                {OPEN_PROJECTS_DATA.map((proj, idx) => {
                  const isSelected = selectedProjectIdx === idx;
                  const difficultyColor = 
                    proj.complexity === "Beginner" ? "text-emerald-400" :
                    proj.complexity === "Intermediate" ? "text-amber-400" :
                    "text-pink-400";
                  
                  return (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedProjectIdx(idx)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[105px] ${
                        isSelected 
                          ? "border-emerald-500 bg-emerald-500/[0.04] ring-1 ring-emerald-500/30" 
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-905/30"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-mono text-[8px] uppercase font-extrabold ${difficultyColor}`}>{proj.complexity}</span>
                        <span className="font-mono text-[8px] text-slate-500 font-bold">{proj.timeEstimate}</span>
                      </div>
                      <h4 className="font-sans font-extrabold text-slate-100 text-xs mt-1.5 leading-tight">{proj.name}</h4>
                    </button>
                  );
                })}
              </div>

              {/* Selected Open Project Details Card */}
              {(() => {
                const activeProj = OPEN_PROJECTS_DATA[selectedProjectIdx];
                return (
                  <motion.div
                    key={activeProj.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-slate-900 bg-[#030712] space-y-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase text-slate-500 font-extrabold">
                        <span>Schema Overview</span>
                        <span>•</span>
                        <span className={activeProj.complexity === "Beginner" ? "text-emerald-400" : activeProj.complexity === "Intermediate" ? "text-amber-400" : "text-pink-400"}>
                          {activeProj.complexity} Level
                        </span>
                        <span>•</span>
                        <span>{activeProj.timeEstimate} build</span>
                      </div>
                      <h4 className="font-sans text-sm font-extrabold text-emerald-400 uppercase tracking-wide mt-0.5">{activeProj.name}</h4>
                      <p className="font-sans text-[11.5px] text-slate-400 leading-relaxed mt-1.5">{activeProj.description}</p>
                    </div>

                    {/* Sourcing list check */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-900/60">
                      <span className="font-mono text-[8px] uppercase text-slate-500 tracking-wider">Exact Hardware Components Required:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProj.partsList.map((part, i) => (
                          <span key={i} className="text-[10px] bg-indigo-950/20 border border-indigo-900/40 text-indigo-300 px-2.5 py-0.5 rounded-md font-mono">
                            • {part}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Block Diagram Steps */}
                    <div className="space-y-2 pt-2 border-t border-slate-900/60">
                      <span className="font-mono text-[8px] uppercase text-slate-500 tracking-wider block">Operational Flow Architecture:</span>
                      <div className="space-y-1.5">
                        {activeProj.blockDiagramSteps.map((step, i) => (
                          <div key={i} className="flex gap-2 text-[11px] text-slate-305 leading-relaxed font-sans">
                            <span className="font-mono text-emerald-400 font-bold shrink-0">[{i + 1}]</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
