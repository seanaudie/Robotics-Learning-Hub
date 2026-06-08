import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Eye, Cpu, Zap, ChevronsRight, ChevronsDown, Sparkles, RefreshCw, Camera, Thermometer, Activity, Layers, Bell, Play, Radar, Wifi, Terminal, ArrowUpDown, Volume2, Droplet, X, Cog } from "lucide-react";

const EXAMPLE_IMAGES: Record<string, string> = {
  camera: "/src/assets/images/photo_ai_camera_1779710685980.png",
  humidity: "/src/assets/images/dht11_sensor_1779715125828.png",
  ultrasonic: "/src/assets/images/photo_ultrasonic_hcsr04_1779705055934.png",
  arduino: "/src/assets/images/photo_arduino_uno_1779705012697.png",
  esp32: "/src/assets/images/photo_esp32_dev_module_1779710601750.png",
  raspberrypi: "/src/assets/images/photo_raspberry_pi_4_1779710701747.png",
  servo: "/src/assets/images/photo_servo_sg90_1779705035399.png",
  "dc-motor": "/src/assets/images/photo_dc_geared_motor_1779710634180.png",
  buzzer: "/src/assets/images/photo_piezo_buzzer_1779710740204.png"
};

type RobotTypeId = "mobot" | "monitoring" | "automation";

interface RobotSystem {
  id: RobotTypeId;
  label: string;
  metric: string;
  sensorTitle: string;
  sensorSub: string;
  sensorMeta: string;
  controllerTitle: string;
  controllerSub: string;
  controllerMeta: string;
  actuatorTitle: string;
  actuatorSub: string;
  actuatorMeta: string;
  voltageFlow: string;
}

const ROBOT_SYSTEMS: RobotSystem[] = [
  {
    id: "mobot",
    label: "Mobile Navigation",
    metric: "Autonomous Transport",
    sensorTitle: "Sensors",
    sensorSub: "(Watching Roadways)",
    sensorMeta: "Scans nearby pathways using simple lasers & sound beams to recognize obstacles.",
    controllerTitle: "Controllers",
    controllerSub: "(Mapping Out Routes)",
    controllerMeta: "Fast microchips read data inputs and calculate the safest directions to steer.",
    actuatorTitle: "Actuators",
    actuatorSub: "(Electric Steering)",
    actuatorMeta: "Quiet electric motors spin physical wheels to smoothly guide the vehicle.",
    voltageFlow: "Signal Output: 5.0V PWM Bus"
  },
  {
    id: "monitoring",
    label: "Environmental Monitor",
    metric: "Safety Telemetry",
    sensorTitle: "Sensors",
    sensorSub: "(Reading Air & Temperature)",
    sensorMeta: "Constantly checks heat levels and air changes around the room to keep logs clean.",
    controllerTitle: "Controllers",
    controllerSub: "(Comparing Limits)",
    controllerMeta: "Compiles room updates against safety rules to check if anything is wrong.",
    actuatorTitle: "Actuators",
    actuatorSub: "(Alarms & Fans)",
    actuatorMeta: "Starts heavy ventilation fans or fires safety sound alerts instantly.",
    voltageFlow: "Signal Output: I2C Digital Read"
  },
  {
    id: "automation",
    label: "Industrial Assembly",
    metric: "Factory Control",
    sensorTitle: "Sensors",
    sensorSub: "(Checking Touch Weight)",
    sensorMeta: "Measures exactly how hard the tool arm touches or gripholds assembly items.",
    controllerTitle: "Controllers",
    controllerSub: "(Finding Perfect Degrees)",
    controllerMeta: "Decides the exact angle coordinates to assemble parts without scratching.",
    actuatorTitle: "Actuators",
    actuatorSub: "(Pneumatic Joint Clamp)",
    actuatorMeta: "Clamps physical frames firmly into alignment using powerful air valves.",
    voltageFlow: "Signal Output: 24.0V Industrial Loop"
  }
];

const GENERAL_THEORY = {
  sensorTitle: "Sensors",
  sensorSub: "(Gathering Surrounding Clues)",
  sensorMeta: "Gather simple feedback from the outside world (like touch, light, or distance) and turn it into standard electricity signals.",
  controllerTitle: "Controllers",
  controllerSub: "(Thinking & Calibrating)",
  controllerMeta: "The brain of the system. It reads incoming signal pulses, makes decisions based on code rules, and outputs coordinates.",
  actuatorTitle: "Actuators",
  actuatorSub: "(Performing Real Clank)",
  actuatorMeta: "Carry out physical work. They translate thinking decisions directly into movement (like revolving gears or pressing valves).",
  voltageFlow: "System Loop: Standard Feedback Bus"
};

interface ExampleDetail {
  id: string;
  name: string;
  model: string;
  category: "sensors" | "controllers" | "actuators";
  howItWorks: string;
  signalType: "Digital" | "Analog" | "Mixed (Analog & Digital)";
  waveformType: "Sinusoidal" | "Square Wave" | "Complex Digital Packets";
  specs: { label: string; value: string }[];
}

const EXAMPLE_DETAILS: Record<string, ExampleDetail> = {
  camera: {
    id: "camera",
    name: "HD Video Camera Module",
    model: "Sony IMX219 (8MP Module)",
    category: "sensors",
    howItWorks: "Captures ambient photons through high-purity glass focus lenses onto a CMOS semiconductor matrix. The pixels measure light wave intensities, converting them into electronic charge matrices that stream over MIPI CSI serial ports to form video frames.",
    signalType: "Digital",
    waveformType: "Square Wave",
    specs: [
      { label: "Optical Sensor", value: "8-Megapixel CMOS Sensor" },
      { label: "Lens Aperture", value: "f/2.0 Fixed Focal Lens" },
      { label: "Max Frame Rate", value: "1080p @ 30 FPS / 720p @ 60 FPS" },
      { label: "Supply Voltage", value: "3.3V DC Input Power" },
      { label: "Active Field of View", value: "160° Diagonal Panorama" },
      { label: "Core Communication", value: "15-pin MIPI CSI Serial Bus" }
    ]
  },
  humidity: {
    id: "humidity",
    name: "DHT11 Temp & Humidity Sensor",
    model: "DHT11 Digital Micro-Sensor",
    category: "sensors",
    howItWorks: "Utilizes a resistive component to measure surrounding water vapor molecules and a negative temperature coefficient (NTC) thermistor to gauge heat. An internal 8-bit chip calibrates physical properties, outputting relative humidity percentages and Celsius data.",
    signalType: "Digital",
    waveformType: "Square Wave",
    specs: [
      { label: "Relative Humidity Range", value: "20% to 90% RH (±5% accuracy)" },
      { label: "Air Temperature Range", value: "0°C to 50°C (±2°C accuracy)" },
      { label: "Core Communication", value: "Single-Bus Digital Proprietary Protocol" },
      { label: "Supply Voltage", value: "3.2V to 5.5V DC Power" },
      { label: "Sampling Interval", value: "2.0 Seconds reload interval" },
      { label: "Active Amperage", value: "0.5mA Active measurement / 110μA standby" }
    ]
  },
  ultrasonic: {
    id: "ultrasonic",
    name: "HC-SR04 Ultrasonic Distance Sensor",
    model: "HC-SR04 Sound Transducer",
    category: "sensors",
    howItWorks: "Fires a high-frequency 40 kHz acoustic burst from its transmitter. When this acoustic shockwave strikes an obstacle, it bounces back to the receiver. Calculating the microphone microseconds interval (Time-of-Flight) determines exact distance.",
    signalType: "Digital",
    waveformType: "Square Wave",
    specs: [
      { label: "Ranging Distance", value: "2.0 cm to 400.0 cm range" },
      { label: "Ranging Resolution", value: "0.3 cm high precision accuracy" },
      { label: "Ultrasonic Frequency", value: "40.0 kHz Acoustic Soundwave" },
      { label: "Supply Voltage", value: "5.0V DC Operational Power" },
      { label: "Sensing Coverage Angle", value: "< 15° Field of focus cone" },
      { label: "Pinout Definition", value: "VCC, Trig (Trigger), Echo (Feedback), GND" }
    ]
  },
  arduino: {
    id: "arduino",
    name: "Arduino Nano board",
    model: "ATmega328P RISC Hardware",
    category: "controllers",
    howItWorks: "Runs single-threaded control loops directly on silicon. It polls voltages across its analog pins, carries out built-in arithmetic equations matching user-uploaded scripts, and issues high/low digital logic pulses.",
    signalType: "Mixed (Analog & Digital)",
    waveformType: "Square Wave",
    specs: [
      { label: "Processor Core", value: "ATmega328P 8-Bit RISC Chip" },
      { label: "Core Frequency", value: "16.0 MHz (Quartz Crystal)" },
      { label: "Storage Architecture", value: "32KB Flash Storage / 2KB SRAM" },
      { label: "Supply Voltage", value: "5.0V Operating / 7.0V-12.0V external" },
      { label: "Pinout Peripheral Array", value: "14 Digital standard, 8 Analog inputs" },
      { label: "Available Protocols", value: "I2C, SPI, UART serial ports" }
    ]
  },
  esp32: {
    id: "esp32",
    name: "ESP32 WiFi NodeMCU",
    model: "ESP32-WROOM-32D SoC",
    category: "controllers",
    howItWorks: "Boasts extreme speed RISC computing integrated with wireless radio antennas. Perfect for telemetry systems where it intercepts incoming sensor variables and pushes it over local WiFi to central safety monitors.",
    signalType: "Digital",
    waveformType: "Square Wave",
    specs: [
      { label: "Processing Core", value: "Xtensa 32-Bit Dual-Core LX6 MCU" },
      { label: "Core Frequency", value: "240.0 MHz processor clock" },
      { label: "Storage Architecture", value: "4MB flash / 520KB safe SRAM buffers" },
      { label: "Supply Voltage", value: "3.3V Operating / 5V USB Input" },
      { label: "Wireless Protocols", value: "802.11 b/g/n Wi-Fi & Bluetooth LE" },
      { label: "Power States", value: "10μA Ultra low-power deep sleep" }
    ]
  },
  raspberrypi: {
    id: "raspberrypi",
    name: "Raspberry Pi SBC",
    model: "RPi 4 Model B Single-Board",
    category: "controllers",
    howItWorks: "Executes a complete Linux OS kernel with modern filesystem pipelines. Ideal for autonomous rovers that must perform heavy math, coordinate stereo video streams, analyze computer vision pipelines, or host telemetry servers.",
    signalType: "Digital",
    waveformType: "Square Wave",
    specs: [
      { label: "Processing System", value: "Broadcom BCM2711 QC Cortex-A72" },
      { label: "Core Frequency", value: "1.5 GHz clock cycle (64-Bit)" },
      { label: "Storage Architecture", value: "4 GB LPDDR4 physical SRAM / microSD" },
      { label: "Supply Voltage", value: "5.0V USB-C Connector (3.0A build)" },
      { label: "Available Ports", value: "Gigabit Ethernet, Dual Micro-HDMI 4K" },
      { label: "GP Connector IO", value: "40-pin multipurpose circuit strip" }
    ]
  },
  servo: {
    id: "servo",
    name: "SG90 Precision Micro Servo",
    model: "SG90 Micro Rotator",
    category: "actuators",
    howItWorks: "Reads incoming PWM commands to match targeted angles (typically 0-180°). An internal comparator board calculates variance from the current gear degree, running a small DC motor to snap and lock into position.",
    signalType: "Digital",
    waveformType: "Square Wave",
    specs: [
      { label: "Rotational Limit", value: "180° total turning range" },
      { label: "Holding Torque", value: "1.8 kg-cm @ 4.8V power" },
      { label: "Response Speed", value: "0.12 seconds / 60 degrees of rotation" },
      { label: "Supply Voltage", value: "4.8V to 6.0V continuous intake" },
      { label: "Control Protocol", value: "Pulse Width Modulation (20ms frames)" },
      { label: "Internal Materials", value: "Carbonized shockproof nylon gears" }
    ]
  },
  "dc-motor": {
    id: "dc-motor",
    name: "DC Driven Motor Core",
    model: "TT-130 Geared System",
    category: "actuators",
    howItWorks: "Uses magnetic forces to spin high-speed metal pins. Dual copper terminals connect to power, which speeds rotation. High-frequency speed modulation is handled via PWM switching, and direction is managed with H-Bridge gates.",
    signalType: "Analog",
    waveformType: "Sinusoidal",
    specs: [
      { label: "Reduction Gearbox", value: "1:48 output drive reducers" },
      { label: "Holding Torque", value: "4.5 kg-cm stall capacity" },
      { label: "Revolving Speed", value: "150 RPM standard operating speed" },
      { label: "Supply Voltage", value: "3.0V to 12.0V DC range" },
      { label: "Load Amperage", value: "80mA operational core draw" },
      { label: "Shaft Configuration", value: "Dual flat D-shaft axes output" }
    ]
  },
  buzzer: {
    id: "buzzer",
    name: "Piezo-Electric Acoustic Buzzer",
    model: "12mm Active Transducer",
    category: "actuators",
    howItWorks: "Applies electrical pulses to a thin piezo ceramic disc. This causes the crystal compound to expand and compress rapidly, propagating high-pitch audio warning waves directly into surrounding spaces.",
    signalType: "Analog",
    waveformType: "Sinusoidal",
    specs: [
      { label: "Audible Output", value: "≥ 85 dB measured at 10.0 cm" },
      { label: "Resonant Pitch", value: "2,300 Hz center pitch frequency" },
      { label: "Intake Current", value: "15mA to 30mA operating draw" },
      { label: "Supply Voltage", value: "3.0V to 12.0V DC active direct line" },
      { label: "Buzzer Class", value: "Active (requires no external frequency)" },
      { label: "Casing Material", value: "Thermoplastic sound resonant shell" }
    ]
  }
};

const CYBER_FLOW_SYSTEM_CSS = `
  @keyframes scanSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes sigFlow {
    0% { stroke-dashoffset: 24; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes gearRotateClockwise {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes gearRotateCounter {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  @keyframes pulseBeam {
    0%, 100% { filter: drop-shadow(0 0 10px var(--beam-glow)); opacity: 0.9; }
    50% { filter: drop-shadow(0 0 25px var(--beam-glow-bright)); opacity: 1; }
  }
  @keyframes premonitionH {
    0% { transform: translateX(-100%); opacity: 0; }
    30% { opacity: 0.8; }
    70% { opacity: 0.8; }
    100% { transform: translateX(450%); opacity: 0; }
  }
  @keyframes premonitionV {
    0% { transform: translateY(-100%); opacity: 0; }
    30% { opacity: 0.8; }
    70% { opacity: 0.8; }
    100% { transform: translateY(450%); opacity: 0; }
  }
  @keyframes radialGlow {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.1); opacity: 0.35; }
  }
  @keyframes cyberGlowSensors {
    0%, 100% {
      border-color: rgba(56, 189, 248, 0.7);
      box-shadow: 0 0 30px rgba(56, 189, 248, 0.35), inset 0 0 12px rgba(56, 189, 248, 0.12);
    }
    50% {
      border-color: rgba(56, 189, 248, 1);
      box-shadow: 0 0 50px rgba(56, 189, 248, 0.75), inset 0 0 24px rgba(56, 189, 248, 0.35);
    }
  }
  @keyframes cyberGlowControllers {
    0%, 100% {
      border-color: rgba(99, 102, 241, 0.7);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.35), inset 0 0 12px rgba(99, 102, 241, 0.12);
    }
    50% {
      border-color: rgba(99, 102, 241, 1);
      box-shadow: 0 0 50px rgba(99, 102, 241, 0.75), inset 0 0 24px rgba(99, 102, 241, 0.35);
    }
  }
  @keyframes cyberGlowActuators {
    0%, 100% {
      border-color: rgba(16, 185, 129, 0.7);
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.35), inset 0 0 12px rgba(16, 185, 129, 0.12);
    }
    50% {
      border-color: rgba(16, 185, 129, 1);
      box-shadow: 0 0 50px rgba(16, 185, 129, 0.75), inset 0 0 24px rgba(16, 185, 129, 0.35);
    }
  }
  @keyframes diagnosticBar {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  
  @keyframes scanline {
    0% { transform: translateX(-150px) skewX(-25deg); }
    100% { transform: translateX(1100px) skewX(-25deg); }
  }
  .cyber-scanline {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    background: linear-gradient(to right, transparent, rgba(56, 189, 248, 0.05) 20%, rgba(99, 102, 241, 0.08) 50%, rgba(16, 185, 129, 0.05) 80%, transparent);
    animation: scanline 4.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
    will-change: transform;
    pointer-events: none;
  }
  
  /* Modern glowing border component */
  .cyber-border-card {
    position: relative;
    border-radius: 16px;
    background: #020712;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1.5px solid rgba(148, 163, 184, 0.08);
    will-change: transform, border-color, box-shadow;
  }
  
  /* High-fidelity glowing active state styles on cards */
  .cyber-border-card.active-sensors {
    transform: translateY(-6px) scale(1.025);
    background: rgba(56, 189, 248, 0.03);
    animation: cyberGlowSensors 3s infinite ease-in-out;
  }
  .cyber-border-card.active-controllers {
    transform: translateY(-6px) scale(1.025);
    background: rgba(99, 102, 241, 0.03);
    animation: cyberGlowControllers 3s infinite ease-in-out;
  }
  .cyber-border-card.active-actuators {
    transform: translateY(-6px) scale(1.025);
    background: rgba(16, 185, 129, 0.03);
    animation: cyberGlowActuators 3s infinite ease-in-out;
  }
  
  /* Static highlight states without scale transform or glowing animations for initial boot highlight */
  .cyber-border-card.boot-highlight-sensors {
    border-color: rgba(56, 189, 248, 0.45);
    background: rgba(56, 189, 248, 0.04);
  }
  .cyber-border-card.boot-highlight-controllers {
    border-color: rgba(99, 102, 241, 0.45);
    background: rgba(99, 102, 241, 0.04);
  }
  .cyber-border-card.boot-highlight-actuators {
    border-color: rgba(16, 185, 129, 0.45);
    background: rgba(16, 185, 129, 0.04);
  }
  
  /* Card content sits safely over mask */
  .cyber-card-inner {
    position: relative;
    z-index: 10;
  }

  .animate-radial-slow {
    animation: radialGlow 9s ease-in-out infinite;
  }
  .animate-pulse-beam {
    animation: pulseBeam 4s ease-in-out infinite;
  }
  .animate-premonition-h {
    animation: premonitionH 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform;
  }
  .animate-premonition-v {
    animation: premonitionV 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform;
  }
  @keyframes wave-flow {
    0% { stroke-dashoffset: 400; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes grid-glow {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.3; }
  }
`;

export default function RoboticsFlowSystem() {
  const [activeId, setActiveId] = useState<RobotTypeId | null>(null);
  const [activeStep, setActiveStep] = useState<"sensors" | "controllers" | "actuators" | null>(null);
  const [simTick, setSimTick] = useState<number>(0);
  const [cameraPitch, setCameraPitch] = useState<number>(24);
  const [cameraYaw, setCameraYaw] = useState<number>(0);

  // Drag-to-orbit refs for 3D simulation
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const startYawRef = useRef<number>(0);
  const startPitchRef = useRef<number>(0);

  // Interactive mechatronic telemetry part selections & test mass loads
  const [activePartSelection, setActivePartSelection] = useState<"base" | "shoulder" | "elbow" | "claw" | "cargo" | null>("elbow");
  const [payloadMassGrams, setPayloadMassGrams] = useState<number>(120);

  const handleSvgMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    startYawRef.current = cameraYaw;
    startPitchRef.current = cameraPitch;
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    const sensi = 0.65;
    let newYaw = startYawRef.current + dx * sensi;
    let newPitch = startPitchRef.current - dy * sensi;
    
    // Bounds for pitch & yaw to keep layout elegant
    newPitch = Math.max(8, Math.min(50, newPitch));
    newYaw = Math.max(-180, Math.min(180, newYaw));
    
    setCameraYaw(Math.round(newYaw));
    setCameraPitch(Math.round(newPitch));
  };

  const handleSvgMouseUp = () => {
    dragStartRef.current = null;
  };

  const handleSvgTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      startYawRef.current = cameraYaw;
      startPitchRef.current = cameraPitch;
    }
  };

  const handleSvgTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    
    const sensi = 0.6;
    let newYaw = startYawRef.current + dx * sensi;
    let newPitch = startPitchRef.current - dy * sensi;
    
    newPitch = Math.max(8, Math.min(50, newPitch));
    newYaw = Math.max(-180, Math.min(180, newYaw));
    
    setCameraYaw(Math.round(newYaw));
    setCameraPitch(Math.round(newPitch));
  };

  const handleSvgTouchEnd = () => {
    dragStartRef.current = null;
  };
  const simulatorRef = useRef<HTMLDivElement | null>(null);
  const simulationWorkspaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeId) return;
    const timer = setInterval(() => {
      setSimTick((t) => t + 1.5);
    }, 45);
    return () => clearInterval(timer);
  }, [activeId]);

  // High-fidelity active sub-examples within the general theory cards
  const [activeSensorEx, setActiveSensorEx] = useState<"camera" | "humidity" | "ultrasonic">("camera");
  const [activeControllerEx, setActiveControllerEx] = useState<"arduino" | "esp32" | "raspberrypi">("arduino");
  const [activeActuatorEx, setActiveActuatorEx] = useState<"servo" | "dc-motor" | "buzzer">("servo");

  // Selected educational hardware element details to view inside the spec sheet modal
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<"info" | "signal">("info");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const modalScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedExample) {
      setModalTab("info");
    }
  }, [selectedExample]);

  useEffect(() => {
    if (selectedExample && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [selectedExample, modalTab]);

  // Futuristic diagnostic boot scan state
  const [isDiagnosticActive, setIsDiagnosticActive] = useState<boolean>(true);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Individual boot highlight trackers for cascade intro:
  // 1. First, the sensor gets highlighted and stays.
  // 2. Next, the controller gets highlighted as well and stays.
  // 3. Last, the actuator gets highlighted and stays (all 3 stick!).
  // 4. Then lights fade out and loop starts.
  const [bootHighlightSensors, setBootHighlightSensors] = useState<boolean>(false);
  const [bootHighlightControllers, setBootHighlightControllers] = useState<boolean>(false);
  const [bootHighlightActuators, setBootHighlightActuators] = useState<boolean>(false);

  // Cascade initial animation timeline orchestrator
  useEffect(() => {
    if (isDiagnosticActive) {
      // Step 1: Highlight all three core parts together immediately
      setBootHighlightSensors(true);
      setBootHighlightControllers(true);
      setBootHighlightActuators(true);
      setActiveStep(null);

      // Step 2: Highlighted together stay active for 3000ms, then fade out together
      const t1 = setTimeout(() => {
        setBootHighlightSensors(false);
        setBootHighlightControllers(false);
        setBootHighlightActuators(false);
      }, 3000);

      // Step 3: Pause while completely faded out (2000ms), then start the standard looping cycles at 5000ms
      const t2 = setTimeout(() => {
        setIsDiagnosticActive(false);
        setActiveStep("sensors");
      }, 5000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      // Ensure all initial anim flags clean up if diagnostic gets cancelled early or finishes
      setBootHighlightSensors(false);
      setBootHighlightControllers(false);
      setBootHighlightActuators(false);
    }
  }, [isDiagnosticActive]);

  // Constant feedback loop moving smoothly and slowly
  // While initial boot synchronization/highlight is active, we pause the cycle.
  // In normal operation, it cycles every 9000ms to allow steady interactive exploration.
  useEffect(() => {
    if (isDiagnosticActive || selectedExample) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === "sensors") return "controllers";
        if (prev === "controllers") return "actuators";
        return "sensors";
      });
    }, 9000);

    return () => clearInterval(interval);
  }, [isDiagnosticActive, selectedExample]);

  // ESC key keydown listener for seamless keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedExample(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const systemData = activeId 
    ? ROBOT_SYSTEMS.find(r => r.id === activeId) || GENERAL_THEORY 
    : GENERAL_THEORY;

  const showInlineSimulator = !!(activeId && !isDesktop);

  const getSensorIcon = () => {
    if (!activeId) return Eye;
    if (activeId === "mobot") return Radar;
    if (activeId === "monitoring") return Thermometer;
    if (activeId === "automation") return Layers;
    return Eye;
  };

  const getControllerIcon = () => {
    if (!activeId) return Cpu;
    if (activeId === "mobot") return Cpu;
    if (activeId === "monitoring") return Terminal;
    if (activeId === "automation") return Cpu;
    return Cpu;
  };

  const getActuatorIcon = () => {
    return Cog;
  };

  const SensorIcon = getSensorIcon();
  const ControllerIcon = getControllerIcon();
  const ActuatorIcon = getActuatorIcon();

  return (
    <div id="robotics-systems-works-flow" className="w-full bg-[#030919] border border-slate-800/80 rounded-3xl p-5 md:p-10 relative overflow-hidden select-none">
      
      {/* Hyper-glowing interactive CSS animations with soft steady glowing borders & premium aesthetics */}
      <style>{CYBER_FLOW_SYSTEM_CSS}</style>

      {/* Futuristic Background Grids and soft ambient backdrops */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c162e_1px,transparent_1px),linear-gradient(to_bottom,#0c162e_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[130px] pointer-events-none animate-radial-slow" />
      <div className="absolute -bottom-40 -right-45 w-[500px] h-[500px] bg-sky-950/20 rounded-full blur-[130px] pointer-events-none animate-radial-slow" style={{ animationDelay: "4.5s" }} />

      {/* Seamless sci-fi visual brackets */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-slate-800/90 pointer-events-none" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-slate-800/90 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-slate-800/90 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-slate-800/90 pointer-events-none" />

      {/* Main Header with simple description that directly invites interaction */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-8 md:mb-10 animate-fadeIn">
        <span className="font-mono text-[9px] font-black uppercase tracking-widest bg-sky-950/65 text-sky-400 border border-sky-400/20 px-4 py-1.5 rounded-full mb-3 shadow-[0_4px_15px_rgba(56,189,248,0.15)] animate-pulse">
          Telemetry Signal Pathway
        </span>
        <h2 className="font-sans font-black text-white text-3xl md:text-4xl tracking-tight uppercase leading-none">
          How Robotics System Works
        </h2>
        <div className="w-16 h-[2.5px] bg-gradient-to-r from-sky-450 to-indigo-505 bg-sky-500 my-3.5 rounded" />
        <p className="font-sans text-xs md:text-sm text-slate-405 text-slate-400 leading-relaxed font-semibold max-w-lg">
          Explore how robots interact with the world through a continuous feedback loop. Tap any of the dynamic presets below to simulate real-world systems!
        </p>
      </div>

      {/* MAIN MONITOR: Dynamic Aspect Ratio adaptation to prevent cropping when active examples are opened */}
      <div className="relative z-10 w-full max-w-7xl mx-auto mb-8">
        <div className="w-full rounded-2xl md:rounded-3xl bg-[#01050e] border border-slate-850/80 p-5 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[inset_0_4px_50px_rgba(0,0,0,0.95)] animate-fadeIn aspect-auto md:aspect-auto min-h-auto md:min-h-0 gap-6">
          
          {/* Top telemetry state title metrics */}
          <div className="flex items-center justify-between z-10 text-[9px] font-mono select-none">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isDiagnosticActive ? "bg-cyan-400 animate-ping" : "bg-sky-450 bg-sky-400 animate-pulse"}`} />
              <span className="text-slate-300 tracking-wider font-extrabold uppercase flex items-center gap-1.5 flex-wrap">
                {isDiagnosticActive ? (
                  <>
                    <span className="text-sky-400 font-black">✦ CO-SYSTEM SYNCHRONIZATION</span>
                    <span className="text-slate-800">|</span>
                    <span className="text-slate-400 normal-case italic font-sans font-semibold">Hover, tap, or view how Sensors, Controllers and Actuators build a feedback loop!</span>
                  </>
                ) : activeId ? (
                  `${activeId.toUpperCase()} SIMULATOR SCREEN`
                ) : (
                  "GENERAL SYSTEM SCHEMATIC"
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-bold">ACTIVE PHASE: </span>
              {isDiagnosticActive ? (
                <span className="font-extrabold text-sky-400 uppercase py-0.5 px-2.5 rounded-md bg-sky-950/45 border border-sky-500/20 animate-pulse flex items-center gap-1 leading-none">
                  <Activity className="w-2.5 h-2.5 animate-spin" />
                  FULL LOOP SHOWCASE
                </span>
              ) : (
                <span className={`font-black uppercase py-0.5 px-2.5 rounded-md bg-slate-950/90 border border-slate-900/60 ${
                  activeStep === "sensors" ? "text-sky-400" :
                  activeStep === "controllers" ? "text-indigo-400" :
                  "text-emerald-400"
                }`}>
                  {activeStep}
                </span>
              )}
            </div>
          </div>
          
          {/* Feathery soft background radar line waves */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
            <svg viewBox="0 0 400 100" className="w-full h-32 select-none pointer-events-none">
              <path 
                d="M 0,50 Q 50,15 100,50 T 200,50 T 300,50 T 400,50" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                className="animate-oscilloscope"
              />
            </svg>
          </div>

          {/* SEAMLESS DIAGRAM PIPELINE LOOP (Flexible stacks on mobile, horizontal corridors on PC) */}
          <div ref={simulatorRef} className={`w-full z-10 relative ${
            showInlineSimulator ? "grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch" : ""
          }`}>
            <div className={`z-10 relative w-full ${
              showInlineSimulator 
                ? "lg:col-span-7 flex flex-col gap-3.5" 
                : "flex flex-col md:flex-row items-stretch justify-between my-auto gap-3.5 md:gap-4 lg:gap-6 py-2 md:py-0"
            }`}>
              {/* BLOCK 01: SENSORS CARD */}
            <div 
              style={{
                "--beam-color": "rgb(56, 189, 248)",
                "--beam-glow": "rgba(56, 189, 248, 0.15)",
                "--beam-glow-bright": "rgba(56, 189, 248, 0.45)"
              } as React.CSSProperties}
              onClick={() => {
                setIsDiagnosticActive(false);
                setActiveStep("sensors");
              }}
              className={`cyber-border-card cursor-pointer w-full md:flex-1 p-[1px] transition-all duration-500 hover:border-sky-500/40 select-none ${
                activeStep === "sensors"
                  ? "active-sensors font-semibold"
                  : bootHighlightSensors
                    ? "boot-highlight-sensors font-semibold"
                    : "opacity-45 scale-[0.98]"
              }`}
              title="Click to focus Sensors phase and reset slide timer"
            >
              {/* Seamless glass container with rounded interior */}
              <div className="cyber-card-inner bg-[#020716]/95 rounded-[15px] p-5 text-left h-full min-h-[170px] md:min-h-[180px] flex flex-col justify-between transition-all duration-500">
                <div>
                  <div className="flex items-start justify-between mb-3 border-b border-slate-900/80 pb-3">
                    <div className="flex flex-col">
                      <h3 className="font-sans font-black text-white text-base md:text-lg uppercase tracking-tight leading-none">
                        {systemData.sensorTitle}
                      </h3>
                      <span className="font-mono text-[9px] text-sky-400 font-black tracking-widest mt-1 uppercase">
                        {systemData.sensorSub}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-sky-950/45 border border-sky-500/10">
                      <SensorIcon className={`w-8 h-8 transition-all duration-500 ${activeStep === "sensors" ? "text-sky-400 rotate-12 scale-110" : bootHighlightSensors ? "text-sky-400/80 scale-100" : "text-slate-650"}`} />
                    </div>
                  </div>
                  
                  <p className="font-sans text-[11.5px] leading-relaxed text-slate-350 font-bold select-text mb-4">
                    {systemData.sensorMeta}
                  </p>
                </div>

                {/* SENSORS SCANNING LOGO ANIMATION */}
                <div className="mt-1 mb-3 py-2 border-t border-slate-900/40 flex items-center justify-center bg-slate-950/40 rounded-xl p-3 h-28 relative overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="1" />
                    <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" />
                    
                    <g style={{
                      transformOrigin: '50px 50px',
                      animation: (activeStep === "sensors") ? 'scanSweep 3s linear infinite' : 'scanSweep 8s linear infinite'
                    }}>
                      <path d="M 50,50 L 50,5 A 45,45 0 0,1 85,25 Z" fill="url(#scanGrad)" opacity={activeStep === "sensors" ? "0.35" : "0.15"} />
                      <line x1="50" y1="50" x2="50" y2="5" stroke="#38bdf8" strokeWidth={activeStep === "sensors" ? "1.5" : "0.75"} strokeLinecap="round" />
                    </g>
                    
                    {activeStep === "sensors" && (
                      <circle cx="50" cy="50" r="2.5" fill="#38bdf8" />
                    )}
                    
                    <circle cx="80" cy="30" r="1.5" fill="#38bdf8" opacity={activeStep === "sensors" ? "0.8" : "0.3"} className={activeStep === "sensors" ? "animate-pulse" : ""} />
                    <circle cx="30" cy="75" r="2" fill="#38bdf8" opacity={activeStep === "sensors" ? "0.9" : "0.3"} className={activeStep === "sensors" ? "animate-pulse" : ""} />
                    <circle cx="20" cy="25" r="1" fill="#38bdf8" opacity={activeStep === "sensors" ? "0.6" : "0.2"} />

                    <defs>
                      <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute bottom-1 right-2 font-mono text-[7px] text-sky-400/60 uppercase">
                    {activeStep === "sensors" ? "SENSING ACTIVE" : "STANDBY"}
                  </div>
                </div>

                {/* 3 EDUCATIONAL EXAMPLES (Visual highlight fade transition) */}
                <div className={`transition-all duration-750 ease-in-out ${
                  (activeStep === "sensors") 
                    ? "opacity-100 max-h-[140px] translate-y-0 mt-3 border-t border-slate-900/60 pt-3" 
                    : "opacity-0 max-h-0 -translate-y-2 overflow-hidden mt-0 border-t-0 pt-0 pointer-events-none"
                }`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-2.5 h-2.5 text-sky-400 animate-pulse" />
                    <span className="font-mono text-[8px] text-sky-400 uppercase tracking-wider font-extrabold">Active Examples:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("sensors");
                        setActiveSensorEx("camera");
                        setSelectedExample("camera");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeSensorEx === "camera" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-805 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View Camera Specs & Details"
                    >
                      {activeSensorEx === "camera" && <Camera className="w-3.5 h-3.5 text-sky-400 animate-pulse" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Camera</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("sensors");
                        setActiveSensorEx("humidity");
                        setSelectedExample("humidity");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeSensorEx === "humidity" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-805 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View Temp & Humidity Specs & Details"
                    >
                      {activeSensorEx === "humidity" ? <Droplet className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> : <Thermometer className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Humidity</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("sensors");
                        setActiveSensorEx("ultrasonic");
                        setSelectedExample("ultrasonic");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeSensorEx === "ultrasonic" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-805 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View Ultrasonic Specs & Details"
                    >
                      {activeSensorEx === "ultrasonic" ? <Radar className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> : <Radar className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Ultrasonic</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* PIPELINE CONNECTOR 1 (SENSORS ➔ CONTROLLERS) */}
            {!showInlineSimulator ? (
              <div className="flex md:flex-row flex-col items-center justify-center relative w-full md:w-12 lg:w-16 h-10 md:h-auto py-1 md:py-0">
                {/* Horizontal line (Desktop) */}
                <div className="hidden md:block w-full h-[4px] bg-slate-900 rounded-full relative overflow-hidden">
                  <div className={`absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-premonition-h ${
                    activeStep === "sensors" ? "block bg-sky-400" : "hidden"
                  }`} />
                </div>
                {/* Vertical line (Mobile) */}
                <div className="block md:hidden w-[4px] h-8 bg-slate-900 rounded-full relative overflow-hidden">
                  <div className={`absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-premonition-v ${
                    activeStep === "sensors" ? "block bg-sky-400" : "hidden"
                  }`} />
                </div>

                {/* Enhanced Directional Flow Arrows with colored glows */}
                <ChevronsRight className={`hidden md:block w-8 h-8 md:ml-2 transition-all duration-500 ${
                  activeStep === "sensors" 
                    ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)] scale-110" 
                    : bootHighlightControllers
                      ? "text-sky-400/80"
                      : "text-slate-800 opacity-20"
                }`} />
                <ChevronsDown className={`block md:hidden w-7 h-7 transition-all duration-500 ${
                  activeStep === "sensors" 
                    ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)] scale-110 animate-pulse" 
                    : bootHighlightControllers
                      ? "text-sky-400/80"
                      : "text-slate-800 opacity-20"
                }`} />
              </div>
            ) : (
              <div className="flex justify-center items-center py-1 select-none">
                <ChevronsDown className={`w-5 h-5 text-sky-400 opacity-45 animate-pulse ${activeStep === "sensors" ? "opacity-100 scale-110 text-sky-400" : "text-slate-705 text-slate-700"}`} />
              </div>
            )}

            {/* BLOCK 02: CONTROLLERS CARD */}
            <div 
              style={{
                "--beam-color": "rgb(99, 102, 241)",
                "--beam-glow": "rgba(99, 102, 241, 0.15)",
                "--beam-glow-bright": "rgba(99, 102, 241, 0.45)"
              } as React.CSSProperties}
              onClick={() => {
                setIsDiagnosticActive(false);
                setActiveStep("controllers");
              }}
              className={`cyber-border-card cursor-pointer w-full md:flex-1 p-[1px] transition-all duration-500 hover:border-indigo-500/40 select-none ${
                activeStep === "controllers"
                  ? "active-controllers"
                  : bootHighlightControllers
                    ? "boot-highlight-controllers"
                    : "opacity-45 scale-[0.98]"
              }`}
              title="Click to focus Controllers phase and reset slide timer"
            >
              {/* Seamless glass container with rounded interior */}
              <div className="cyber-card-inner bg-[#020716]/95 rounded-[15px] p-5 text-left h-full min-h-[170px] md:min-h-[180px] flex flex-col justify-between transition-all duration-500">
                <div>
                  <div className="flex items-start justify-between mb-3 border-b border-slate-900/80 pb-3">
                    <div className="flex flex-col">
                      <h3 className="font-sans font-black text-white text-base md:text-lg uppercase tracking-tight leading-none">
                        {systemData.controllerTitle}
                      </h3>
                      <span className="font-mono text-[9px] text-indigo-400 font-black tracking-widest mt-1 uppercase">
                        {systemData.controllerSub}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-indigo-950/45 border border-indigo-500/10">
                      <ControllerIcon className={`w-8 h-8 transition-all duration-500 ${activeStep === "controllers" ? "text-indigo-400 scale-110" : bootHighlightControllers ? "text-indigo-405/80 scale-100" : "text-slate-650"}`} />
                    </div>
                  </div>
                  
                  <p className="font-sans text-[11.5px] leading-relaxed text-slate-350 font-bold select-text mb-4">
                    {systemData.controllerMeta}
                  </p>
                </div>

                {/* CONTROLLERS PROCESSING LOGO ANIMATION */}
                <div className="mt-1 mb-3 py-2 border-t border-slate-900/40 flex items-center justify-center bg-slate-950/40 rounded-xl p-3 h-28 relative overflow-hidden">
                  <svg viewBox="0 0 120 100" className="w-28 h-24">
                    {/* Microchip pin traces / copper lines */}
                    <g opacity={activeStep === "controllers" ? "0.9" : "0.4"}>
                      {/* Left: Input trace lines (flowing inwards to MCU) */}
                      <path d="M 15 25 L 40 25 L 45 40" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,4" style={{ animation: "sigFlow 1.5s linear infinite" }} />
                      <path d="M 15 75 L 40 75 L 45 60" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,4" style={{ animation: "sigFlow 1.5s linear infinite" }} />
                      <line x1="5" y1="50" x2="42" y2="50" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,4" style={{ animation: "sigFlow 1.5s linear infinite" }} />

                      {/* Right: Output trace lines (staggered delay, flowing outwards from MCU) */}
                      <path d="M 75 40 L 80 25 L 105 25" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,4" style={{ animation: "sigFlow 1.5s linear infinite", animationDelay: "0.75s" }} />
                      <path d="M 75 60 L 80 75 L 105 75" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,4" style={{ animation: "sigFlow 1.5s linear infinite", animationDelay: "0.75s" }} />
                      <line x1="78" y1="50" x2="115" y2="50" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,4" style={{ animation: "sigFlow 1.5s linear infinite", animationDelay: "0.75s" }} />
                    </g>

                    {/* Central Microchip (MCU) Body */}
                    <g transform="translate(42, 32)">
                      {/* MCU chip casing */}
                      <rect x="0" y="0" width="36" height="36" rx="4" fill="#0c1020" stroke={activeStep === "controllers" ? "#6366f1" : "rgba(99, 102, 241, 0.4)"} strokeWidth="1.5" />
                      
                      {/* Silicon Chip pins */}
                      <rect x="-4" y="6" width="4" height="2" fill="#94a3b8" />
                      <rect x="-4" y="14" width="4" height="2" fill="#94a3b8" />
                      <rect x="-4" y="22" width="4" height="2" fill="#94a3b8" />
                      <rect x="-4" y="30" width="4" height="2" fill="#94a3b8" />
                      
                      <rect x="36" y="6" width="4" height="2" fill="#94a3b8" />
                      <rect x="36" y="14" width="4" height="2" fill="#94a3b8" />
                      <rect x="36" y="22" width="4" height="2" fill="#94a3b8" />
                      <rect x="36" y="30" width="4" height="2" fill="#94a3b8" />
                      
                      <rect x="6" y="-4" width="2" height="4" fill="#94a3b8" />
                      <rect x="14" y="-4" width="2" height="4" fill="#94a3b8" />
                      <rect x="22" y="-4" width="2" height="4" fill="#94a3b8" />
                      <rect x="30" y="-4" width="2" height="4" fill="#94a3b8" />
                      
                      <rect x="6" y="36" width="2" height="4" fill="#94a3b8" />
                      <rect x="14" y="36" width="2" height="4" fill="#94a3b8" />
                      <rect x="22" y="36" width="2" height="4" fill="#94a3b8" />
                      <rect x="30" y="36" width="2" height="4" fill="#94a3b8" />

                      {/* Internal processing Core activity indicator */}
                      <rect x="10" y="10" width="16" height="16" rx="2" fill={activeStep === "controllers" ? "rgba(99, 102, 241, 0.2)" : "rgba(30,30,50,0.4)"} stroke={activeStep === "controllers" ? "#6366f1" : "rgba(99, 102, 241, 0.2)"} strokeWidth="0.75" />
                      {activeStep === "controllers" ? (
                        <circle cx="18" cy="18" r="3.5" fill="#818cf8" className="animate-pulse" />
                      ) : (
                        <circle cx="18" cy="18" r="2" fill="#334155" />
                      )}
                    </g>
                  </svg>
                  <div className="absolute bottom-1 right-2 font-mono text-[7px] text-indigo-400/60 uppercase">
                    {activeStep === "controllers" ? "PROCESSING ACTIVE" : "STANDBY"}
                  </div>
                </div>

                {/* 3 EDUCATIONAL EXAMPLES (Visual highlight fade transition) */}
                <div className={`transition-all duration-750 ease-in-out ${
                  (activeStep === "controllers") 
                    ? "opacity-100 max-h-[140px] translate-y-0 mt-3 border-t border-slate-900/60 pt-3" 
                    : "opacity-0 max-h-0 -translate-y-2 overflow-hidden mt-0 border-t-0 pt-0 pointer-events-none"
                }`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
                    <span className="font-mono text-[8px] text-indigo-400 uppercase tracking-wider font-extrabold">Active Examples:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("controllers");
                        setActiveControllerEx("arduino");
                        setSelectedExample("arduino");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeControllerEx === "arduino" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View Arduino Specs & Details"
                    >
                      {activeControllerEx === "arduino" && <Cpu className="w-3.5 h-3.5 text-sky-400 animate-pulse" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Arduino</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("controllers");
                        setActiveControllerEx("esp32");
                        setSelectedExample("esp32");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeControllerEx === "esp32" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View ESP32 Specs & Details"
                    >
                      {activeControllerEx === "esp32" && <Wifi className="w-3.5 h-3.5 text-sky-400" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">ESP32</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("controllers");
                        setActiveControllerEx("raspberrypi");
                        setSelectedExample("raspberrypi");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeControllerEx === "raspberrypi" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View Raspberry Pi Specs & Details"
                    >
                      {activeControllerEx === "raspberrypi" && <Terminal className="w-3.5 h-3.5 text-sky-400" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Rasp. Pi</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* PIPELINE CONNECTOR 2 (CONTROLLERS ➔ ACTUATORS) */}
            {!showInlineSimulator ? (
              <div className="flex md:flex-row flex-col items-center justify-center relative w-full md:w-12 lg:w-16 h-10 md:h-auto py-1 md:py-0">
                {/* Horizontal line (Desktop) */}
                <div className="hidden md:block w-full h-[4px] bg-slate-950/20 bg-slate-900 rounded-full relative overflow-hidden">
                  <div className={`absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-premonition-h ${
                    activeStep === "controllers" ? "block bg-indigo-400" : "hidden"
                  }`} />
                </div>
                {/* Vertical line (Mobile) */}
                <div className="block md:hidden w-[4px] h-8 bg-slate-900 rounded-full relative overflow-hidden">
                  <div className={`absolute left-0 right-0 h-6 bg-gradient-to-b from-transparent via-indigo-400 to-transparent animate-premonition-v ${
                    activeStep === "controllers" ? "block bg-indigo-400" : "hidden"
                  }`} />
                </div>

                {/* Enhanced Directional Flow Arrows with colored glows */}
                <ChevronsRight className={`hidden md:block w-8 h-8 md:ml-2 transition-all duration-500 ${
                  activeStep === "controllers" 
                    ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)] scale-110" 
                    : bootHighlightActuators
                      ? "text-indigo-400/80"
                      : "text-slate-800 opacity-20"
                }`} />
                <ChevronsDown className={`block md:hidden w-7 h-7 transition-all duration-500 ${
                  activeStep === "controllers" 
                    ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.7)] scale-110 animate-pulse" 
                    : bootHighlightActuators
                      ? "text-indigo-400/80"
                      : "text-slate-800 opacity-20"
                }`} />
              </div>
            ) : (
              <div className="flex justify-center items-center py-1 select-none">
                <ChevronsDown className={`w-5 h-5 text-indigo-400 opacity-45 animate-pulse ${activeStep === "controllers" ? "opacity-100 scale-110 text-indigo-400" : "text-slate-705 text-slate-700"}`} />
              </div>
            )}

            {/* BLOCK 03: ACTUATORS CARD */}
            <div 
              style={{
                "--beam-color": "rgb(16, 185, 129)",
                "--beam-glow": "rgba(16, 185, 129, 0.15)",
                "--beam-glow-bright": "rgba(16, 185, 129, 0.45)"
              } as React.CSSProperties}
              onClick={() => {
                setIsDiagnosticActive(false);
                setActiveStep("actuators");
              }}
              className={`cyber-border-card cursor-pointer w-full md:flex-1 p-[1px] transition-all duration-500 hover:border-emerald-500/40 select-none ${
                activeStep === "actuators"
                  ? "active-actuators"
                  : bootHighlightActuators
                    ? "boot-highlight-actuators"
                    : "opacity-45 scale-[0.98]"
              }`}
              title="Click to focus Actuators phase and reset slide timer"
            >
              {/* Seamless glass container with rounded interior */}
              <div className="cyber-card-inner bg-[#020716]/95 rounded-[15px] p-5 text-left h-full min-h-[170px] md:min-h-[180px] flex flex-col justify-between transition-all duration-500">
                <div>
                  <div className="flex items-start justify-between mb-3 border-b border-slate-900/80 pb-3">
                    <div className="flex flex-col">
                      <h3 className="font-sans font-black text-white text-base md:text-lg uppercase tracking-tight leading-none">
                        {systemData.actuatorTitle}
                      </h3>
                      <span className="font-mono text-[9px] text-emerald-450 text-emerald-400 font-black tracking-widest mt-1 uppercase">
                        {systemData.actuatorSub}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-950/45 border border-emerald-500/10">
                      <ActuatorIcon className={`w-8 h-8 transition-all duration-500 ${activeStep === "actuators" ? "text-emerald-400 scale-110 animate-spin" : bootHighlightActuators ? "text-emerald-400/80 scale-100 animate-spin [animation-duration:8s]" : "text-slate-650"}`} />
                    </div>
                  </div>
                  
                  <p className="font-sans text-[11.5px] leading-relaxed text-slate-350 font-bold select-text mb-4">
                    {systemData.actuatorMeta}
                  </p>
                </div>

                {/* ACTUATORS GEARS LOGO ANIMATION */}
                <div className="mt-1 mb-3 py-2 border-t border-slate-900/40 flex items-center justify-center bg-slate-950/40 rounded-xl p-3 h-28 relative overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    {/* Large Gear (Clockwise rotation) */}
                    <g 
                      style={{
                        transformOrigin: "36px 42px",
                        animation: activeStep === "actuators" ? "gearRotateClockwise 3s linear infinite" : "gearRotateClockwise 12s linear infinite"
                      }}
                    >
                      {/* Spokes */}
                      <rect x="34.5" y="24" width="3" height="36" rx="1" fill={activeStep === "actuators" ? "rgba(16, 185, 129, 0.6)" : "rgba(16, 185, 129, 0.2)"} />
                      <rect x="18" y="40.5" width="36" height="3" rx="1" fill={activeStep === "actuators" ? "rgba(16, 185, 129, 0.6)" : "rgba(16, 185, 129, 0.2)"} />
                      
                      {/* Outer rim */}
                      <circle cx="36" cy="42" r="18" fill="none" stroke={activeStep === "actuators" ? "#10b981" : "rgba(16, 185, 129, 0.2)"} strokeWidth="3" />
                      
                      {/* Inner hub */}
                      <circle cx="36" cy="42" r="6" fill="#010614" stroke={activeStep === "actuators" ? "#34d399" : "rgba(16, 185, 129, 0.2)"} strokeWidth="1.5" />
                      
                      {/* Detailed Teeth */}
                      {Array.from({ length: 8 }).map((_, gi) => {
                        const angle = (gi * 360) / 8;
                        return (
                          <path
                            key={gi}
                            d="M 33,21 L 39,21 L 41,25 L 31,25 Z"
                            fill={activeStep === "actuators" ? "#10b981" : "rgba(16, 185, 129, 0.35)"}
                            transform={`rotate(${angle}, 36, 42)`}
                          />
                        );
                      })}
                    </g>

                    {/* Small Gear interlocking (Counter-Clockwise rotation) */}
                    <g 
                      style={{
                        transformOrigin: "66px 57px",
                        animation: activeStep === "actuators" ? "gearRotateCounter 2s linear infinite" : "gearRotateCounter 8s linear infinite"
                      }}
                    >
                      {/* Spokes */}
                      <rect x="64.5" y="46" width="3" height="22" rx="1" fill={activeStep === "actuators" ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.15)"} />
                      <rect x="55" y="55.5" width="22" height="3" rx="1" fill={activeStep === "actuators" ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.15)"} />
                      
                      {/* Outer rim */}
                      <circle cx="66" cy="57" r="11" fill="none" stroke={activeStep === "actuators" ? "#047857" : "rgba(16, 185, 129, 0.15)"} strokeWidth="2.5" />
                      
                      {/* Inner hub */}
                      <circle cx="66" cy="57" r="4" fill="#010614" stroke={activeStep === "actuators" ? "#059669" : "rgba(16, 185, 129, 0.15)"} strokeWidth="1" />
                      
                      {/* Detailed Teeth */}
                      {Array.from({ length: 6 }).map((_, gi) => {
                        const angle = (gi * 360) / 6 + 22.5; // Fine-tune angle to interlock beautifully
                        return (
                          <path
                            key={gi}
                            d="M 64.2,43.5 L 67.8,43.5 L 69.2,47 L 62.8,47 Z"
                            fill={activeStep === "actuators" ? "#059669" : "rgba(16, 185, 129, 0.25)"}
                            transform={`rotate(${angle}, 66, 57)`}
                          />
                        );
                      })}
                    </g>
                  </svg>
                  <div className="absolute bottom-1 right-2 font-mono text-[7px] text-emerald-400/60 uppercase">
                    {activeStep === "actuators" ? "MOTOR DRIVING" : "STANDBY"}
                  </div>
                </div>

                {/* 3 EDUCATIONAL EXAMPLES (Visual highlight fade transition) */}
                <div className={`transition-all duration-750 ease-in-out ${
                  (activeStep === "actuators") 
                    ? "opacity-100 max-h-[140px] translate-y-0 mt-3 border-t border-slate-900/60 pt-3" 
                    : "opacity-0 max-h-0 -translate-y-2 overflow-hidden mt-0 border-t-0 pt-0 pointer-events-none"
                }`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    <span className="font-mono text-[8px] text-emerald-400 uppercase tracking-wider font-extrabold">Active Examples:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("actuators");
                        setActiveActuatorEx("servo");
                        setSelectedExample("servo");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-2 text-center rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeActuatorEx === "servo" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View Servo Specs & Details"
                    >
                      {activeActuatorEx === "servo" && <Play className="w-3.5 h-3.5 text-sky-400 animate-pulse" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Servo</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("actuators");
                        setActiveActuatorEx("dc-motor");
                        setSelectedExample("dc-motor");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-2 text-center rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeActuatorEx === "dc-motor" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View DC Motor Specs & Details"
                    >
                      {activeActuatorEx === "dc-motor" && <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">DC Motor</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDiagnosticActive(false);
                        setActiveStep("actuators");
                        setActiveActuatorEx("buzzer");
                        setSelectedExample("buzzer");
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 px-2 text-center rounded-xl transition-all border cursor-pointer select-none text-xs ${
                        activeActuatorEx === "buzzer" 
                          ? "bg-sky-500/20 border-sky-500 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                          : "bg-slate-950/25 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950/45 hover:border-sky-500/50"
                      }`}
                      title="View Buzzer Specs & Details"
                    >
                      {activeActuatorEx === "buzzer" && <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
                      <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Buzzer</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            </div>

            {/* Right Column: Dynamic mechatronic simulator workspace */}
            {activeId && (
              <div 
                ref={simulationWorkspaceRef} 
                className={isDesktop 
                  ? "fixed inset-0 z-[100000] overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex justify-center items-center" 
                  : "lg:col-span-12 xl:col-span-5 bg-[#020614]/90 p-4 rounded-2xl border border-slate-900 flex flex-col justify-between min-h-[440px] relative overflow-hidden text-left shadow-[0_0_30px_rgba(56,189,248,0.05)]"
                }
                onClick={isDesktop ? () => { setActiveId(null); setActiveStep("sensors"); } : undefined}
              >
                <div 
                  className={isDesktop 
                    ? "w-full max-w-4xl bg-[#030919] border border-slate-800 rounded-2xl overflow-hidden shadow-[0_0_55px_rgba(56,189,248,0.3)] relative flex flex-col my-auto p-6 animate-slideUp text-left"
                    : "w-full h-full flex flex-col justify-between"
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Outer mechanical mesh glow effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none" />
                  
                  {/* Top HUD status bar */}
                  <div className="relative z-10 w-full flex items-center justify-between border-b border-slate-900 pb-2 select-none">
                    <span className="font-mono text-[8.5px] text-[#22d3ee] font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                      💻 MECHATRONIC SIMULATOR
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[8.5px] text-slate-505 text-slate-500 font-extrabold uppercase">
                        SIMULATION STATUS: RUNNING
                      </span>
                      {isDesktop && (
                        <button 
                          onClick={() => { setActiveId(null); setActiveStep("sensors"); }}
                          className="ml-3 px-2 py-1 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 hover:text-white rounded-lg text-[8.5px] font-mono cursor-pointer uppercase font-bold flex items-center gap-1 transition-all"
                        >
                          <X className="w-2.5 h-2.5" /> Close Sim
                        </button>
                      )}
                    </div>
                  </div>

                  {/* MAIN SYSTEM SPECIFIC SIMULATIONS */}
                  <div className="flex-1 w-full flex items-center justify-center my-3 relative min-h-[290px]">
                  {activeId === "mobot" && (() => {
                    const obstacleCycle = simTick % 180;
                    let robX = 56;
                    let isNearObstacle = false;
                    let isEarlyWarning = false;
                    let isMovingRight = true;
                    let isReversing = false;
                    
                    if (obstacleCycle < 70) {
                      // 1. Move forward at a speed of 60 pixels per 70 ticks
                      const pct = obstacleCycle / 70;
                      robX = 56 + pct * 60; // moves from 56 to 116
                      isMovingRight = true;
                      isEarlyWarning = (180 - (robX + 34)) <= 45; // early warning under 45cm
                      isNearObstacle = false;
                      isReversing = false;
                    } else if (obstacleCycle < 90) {
                      // 2. Stop/Brake at exactly 30cm (robX = 116)
                      robX = 116;
                      isMovingRight = false;
                      isEarlyWarning = false;
                      isNearObstacle = true;
                      isReversing = false;
                    } else if (obstacleCycle < 160) {
                      // 3. Reverse at the EXACT SAME speed of 60 pixels per 70 ticks
                      const pct = (obstacleCycle - 90) / 70;
                      robX = 116 - pct * 60; // moves from 116 back to 56
                      isMovingRight = false;
                      isEarlyWarning = false;
                      isNearObstacle = false;
                      isReversing = true;
                    } else {
                      // 4. Pause at start (robX = 56) (90cm)
                      robX = 56;
                      isMovingRight = false;
                      isEarlyWarning = false;
                      isNearObstacle = false;
                      isReversing = false;
                    }

                    const calculatedDist = Math.max(2, Math.round(180 - (robX + 34)));

                    return (
                       <div className="w-full h-full relative flex flex-col justify-between gap-1.5">
                        <svg viewBox="0 0 240 190" className="w-full h-[220px] bg-slate-950/70 border border-slate-900 rounded-lg">
                          <line x1="10" y1="140" x2="230" y2="140" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />
                          <rect x="0" y="141" width="240" height="50" fill="#020713" />

                          {/* Obstacle WALL */}
                          <g transform="translate(180, 75)">
                            <rect x="0" y="0" width="15" height="65" rx="3" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                            <line x1="0" y1="15" x2="15" y2="30" stroke="#ef4444" strokeWidth="1" />
                            <line x1="0" y1="35" x2="15" y2="50" stroke="#ef4444" strokeWidth="1" />
                            <text x="7.5" y="-8" textAnchor="middle" fontSize="6px" fill="#ef4444" fontFamily="monospace" fontWeight="black">WALL</text>
                          </g>

                          {/* Ultrasonic Sensor Scanning Rays */}
                          <g>
                            {isNearObstacle ? (
                              <polygon points={`${robX + 32},112 180,95 180,120`} fill="url(#alertBeam)" className="opacity-45" />
                            ) : isEarlyWarning ? (
                              <polygon points={`${robX + 32},112 180,98 180,116`} fill="url(#warningBeam)" className="opacity-40" />
                            ) : isMovingRight ? (
                              <polygon points={`${robX + 32},112 180,102 180,114`} fill="url(#activeBeam)" className="opacity-25" />
                            ) : null}
                          </g>

                          {/* Robot Body */}
                          <g transform={`translate(${robX}, 100)`} className="transition-all duration-75">
                            {/* Thruster exhaust flame (Rear Jet Emitter) */}
                            {isMovingRight && (
                              <g>
                                {/* Dynamic thrust trail on the left (rear) side */}
                                <polygon 
                                  points="-2,23 -18,25 -22,23 -18,21 -2,23" 
                                  fill="url(#thrusterFlame)" 
                                  opacity={0.7 + Math.sin(simTick * 0.4) * 0.25} 
                                />
                                {/* Plasma thruster core */}
                                <ellipse 
                                  cx="-4" 
                                  cy="23" 
                                  rx={4 + Math.sin(simTick * 0.6) * 2} 
                                  ry="2.5" 
                                  fill="#38bdf8" 
                                  className="animate-pulse" 
                                />
                                {/* Thrust spark particles */}
                                <circle cx="-8" cy="24" r="0.5" fill="#7dd3fc" />
                              </g>
                            )}
                            {isReversing && (
                              <g>
                                {/* Reverse thruster puff/trail on the right (front) side */}
                                <polygon 
                                  points="36,23 48,25 50,23 48,21 36,23" 
                                  fill="url(#reverseFlame)" 
                                  opacity={0.6 + Math.sin(simTick * 0.4) * 0.2} 
                                />
                                <ellipse 
                                  cx="38" 
                                  cy="23" 
                                  rx={3 + Math.sin(simTick * 0.6) * 1.5} 
                                  ry="2.2" 
                                  fill="#f97316" 
                                  className="animate-pulse" 
                                />
                              </g>
                            )}

                            {/* Heavy Duty Spoked Tread Guards / Covers */}
                            <path d="M -2,22 A 6,6 0 0,1 12,22" fill="none" stroke="#475569" strokeWidth="2.5" />
                            <path d="M 22,22 A 6,6 0 0,1 36,22" fill="none" stroke="#475569" strokeWidth="2.5" />

                            {/* Lower Mechanical Chassis Plate */}
                            <rect x="0" y="21" width="34" height="11" rx="2.5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                            
                            {/* Carbon Fiber Accent Panels */}
                            <rect x="2" y="23" width="13" height="7" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
                            <rect x="19" y="23" width="13" height="7" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.5" />
                            
                            {/* Diagonal Carbon Fiber stripes inside accent panels */}
                            <line x1="4" y1="28" x2="8" y2="24" stroke="#334155" strokeWidth="0.75" />
                            <line x1="8" y1="28" x2="12" y2="24" stroke="#334155" strokeWidth="0.75" />
                            <line x1="21" y1="28" x2="25" y2="24" stroke="#334155" strokeWidth="0.75" />
                            <line x1="25" y1="28" x2="29" y2="24" stroke="#334155" strokeWidth="0.75" />

                            {/* Processor Microchip Core Control Box */}
                            <rect x="3" y="10" width="22" height="12" rx="2" fill="#0c111d" stroke="#6366f1" strokeWidth="1" />
                            {/* Circuit bus design lines */}
                            <line x1="7" y1="10" x2="7" y2="7" stroke="#6366f1" strokeWidth="0.75" />
                            <line x1="21" y1="10" x2="21" y2="7" stroke="#6366f1" strokeWidth="0.75" />
                            
                            {/* Miniature Solar Array Wings atop Core */}
                            <rect x="1" y="5" width="26" height="2" rx="0.5" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="0.5" />
                            <line x1="8" y1="5" x2="8" y2="7" stroke="#312e81" strokeWidth="0.5" />
                            <line x1="14" y1="5" x2="14" y2="7" stroke="#312e81" strokeWidth="0.5" />
                            <line x1="20" y1="5" x2="20" y2="7" stroke="#312e81" strokeWidth="0.5" />

                            {/* Rotating LiDAR Laser Dome atop solar wings */}
                            <g transform="translate(14, 5)">
                              <rect x="-3" y="-3" width="6" height="3" fill="#334155" rx="0.5" stroke="#475569" strokeWidth="0.5" />
                              <circle cx="0" cy="-3.5" r="1.5" fill={isNearObstacle ? "#ef4444" : "#10b981"} />
                              {/* Rotary laser indicators */}
                              <line 
                                x1="0" y1="-3.5" x2="2" y2="-3.5" 
                                stroke="#fff" strokeWidth="0.5" 
                                transform={`rotate(${(simTick * 18) % 360}, 0, -3.5)`} 
                              />
                            </g>

                            {/* Dual Canister Dual-Eye Sonar Sensors on the front/right side */}
                            <rect x="25" y="10" width="8" height="3.5" rx="1" fill="#334155" stroke="#94a3b8" strokeWidth="0.5" />
                            <circle cx="29" cy="11.75" r="1" fill="#22d3ee" />
                            <rect x="25" y="17.5" width="8" height="3.5" rx="1" fill="#334155" stroke="#94a3b8" strokeWidth="0.5" />
                            <circle cx="29" cy="19.25" r="1" fill="#22d3ee" />

                            {/* Telemetry LED indicator dot */}
                            <circle cx="7" cy="16" r="1.2" fill={isNearObstacle ? "#ef4444" : isEarlyWarning ? "#eab308" : "#10b981"} />

                            {/* Premium Heavy Duty Spoked Wheels with high-grip tire tread ribs */}
                            <g transform="translate(7, 32)">
                              <circle cx="0" cy="0" r="6" fill="#090d16" stroke="#475569" strokeWidth="1.2" />
                              <circle cx="0" cy="0" r="4" fill="#1e293b" />
                              <circle cx="0" cy="0" r="1.5" fill="#cbd5e1" />
                              <g transform={`rotate(${isMovingRight ? (simTick * 9) % 360 : isReversing ? -(simTick * 9) % 360 : 0})`}>
                                <line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" strokeWidth="0.75" />
                                <line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" strokeWidth="0.75" />
                              </g>
                            </g>

                            <g transform="translate(27, 32)">
                              <circle cx="0" cy="0" r="6" fill="#090d16" stroke="#475569" strokeWidth="1.2" />
                              <circle cx="0" cy="0" r="4" fill="#1e293b" />
                              <circle cx="0" cy="0" r="1.5" fill="#cbd5e1" />
                              <g transform={`rotate(${isMovingRight ? (simTick * 9) % 360 : isReversing ? -(simTick * 9) % 360 : 0})`}>
                                <line x1="0" y1="-4" x2="0" y2="4" stroke="#94a3b8" strokeWidth="0.75" />
                                <line x1="-4" y1="0" x2="4" y2="0" stroke="#94a3b8" strokeWidth="0.75" />
                              </g>
                            </g>

                            {/* Direction Indicator Arrow */}
                            <path 
                              d={isMovingRight ? "M -4,15 H -1 L -1,13 L 2,16 L -1,19 L -1,17 H -4 Z" : "M 38,15 H 35 L 35,13 L 32,16 L 35,19 L 35,17 H 38 Z"} 
                              fill={isMovingRight ? "#22d3ee" : isReversing ? "#f97316" : "#475569"} 
                              className="animate-pulse" 
                            />
                          </g>

                          <defs>
                            <linearGradient id="activeBeam" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="warningBeam" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#eab308" stopOpacity="0.75" />
                              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="alertBeam" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
                            </linearGradient>
                            <linearGradient id="premiumLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#38bdf8" />
                              <stop offset="50%" stopColor="#4f46e5" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            <linearGradient id="thrusterFlame" x1="1" y1="0" x2="0" y2="0">
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="reverseFlame" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#f97316" stopOpacity="0.95" />
                              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-900 font-mono text-[8px]">
                          <div>
                            <span className="text-slate-500 block">SONAR</span>
                            <span className={`font-black ${isNearObstacle ? "text-rose-400 animate-pulse" : isEarlyWarning ? "text-amber-400" : "text-cyan-400"}`}>{calculatedDist} cm</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">THRUSTER</span>
                            <span className="font-extrabold text-[#f1f5f9] text-[7.5px] text-white">
                              {isNearObstacle ? "0% (BRAKE)" : isEarlyWarning ? "+40% (SLOW)" : isMovingRight ? "+80% FWD" : isReversing ? "-80% REV" : "0% (STANDBY)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">STEER</span>
                            <span className={`font-bold text-[7.5px] ${isNearObstacle ? "text-rose-500 animate-pulse" : isEarlyWarning ? "text-amber-400" : isReversing ? "text-orange-400" : "text-emerald-400"}`}>
                              {isNearObstacle ? "REVERSE @ 30CM" : isEarlyWarning ? "EARLY WARNING" : isReversing ? "REVERSING" : "PATH CLEAR"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {activeId === "monitoring" && (() => {
                    const envScannerCycle = simTick % 400;
                    let scanX = 35;
                    let isScanning = false;
                    let isWateringDaisy = false;
                    let isWateringSucculent = false;
                    let isWateringRose = false;
                    let isLampsActive = false;

                    if (envScannerCycle < 120) {
                      // Phase 1: Left-to-right scan (0 to 120) with camera sensor carriage
                      const pct = envScannerCycle / 115;
                      scanX = 35 + Math.min(1, pct) * 170; // Sweep from 35 to 205
                      isScanning = true;
                    } else if (envScannerCycle < 160) {
                      // Phase 2: Static sprinklers turn ON on all plants at the right end position (40 ticks)
                      scanX = 205; 
                      isScanning = false;
                      isWateringDaisy = true;
                      isWateringSucculent = true;
                      isWateringRose = true;
                    } else if (envScannerCycle < 200) {
                      // Phase 3: Lamps turn ON for plant growth at the right end position (40 ticks)
                      scanX = 205;
                      isScanning = false;
                      isWateringDaisy = false;
                      isWateringSucculent = false;
                      isWateringRose = false;
                      isLampsActive = true;
                    } else if (envScannerCycle < 320) {
                      // Phase 4: Right-to-left scan (200 to 320) with camera sensor carriage
                      const pct = (envScannerCycle - 200) / 115;
                      scanX = 205 - Math.min(1, pct) * 170; // Sweep from 205 back to 35
                      isScanning = true;
                    } else if (envScannerCycle < 360) {
                      // Phase 5: Static sprinklers turn ON together at the left end position (40 ticks)
                      scanX = 35;
                      isScanning = false;
                      isWateringDaisy = true;
                      isWateringSucculent = true;
                      isWateringRose = true;
                    } else {
                      // Phase 6: Lamps turn ON at the left end position prior to next cycle (40 ticks)
                      scanX = 35;
                      isScanning = false;
                      isWateringDaisy = false;
                      isWateringSucculent = false;
                      isWateringRose = false;
                      isLampsActive = true;
                    }

                    return (
                      <div className="w-full h-full relative flex flex-col justify-between gap-1.5">
                        <svg viewBox="0 0 240 190" className="w-full h-[220px] bg-slate-950/70 border border-slate-900 rounded-lg">
                               {/* High-Tech Overhead Sensor/Camera Rail */}
                          <g>
                            <rect x="20" y="27" width="200" height="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.5" opacity="0.8" />
                            <line x1="20" y1="28" x2="220" y2="28" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2,4" opacity="0.6" />
                          </g>

                          {/* Separate Overhead Sprinkler Pipeline/Rail below the line of the camera */}
                          <g>
                            <rect x="20" y="50" width="200" height="3" fill="#1e293b" rx="1" />
                            <line x1="20" y1="51.5" x2="220" y2="51.5" stroke="#94a3b8" strokeWidth="1.2" />
                            <circle cx="20" cy="51.5" r="2" fill="#475569" />
                            <circle cx="220" cy="51.5" r="2" fill="#475569" />
                          </g>

                          {/* UPPER SEGMENT: Camera sensor carriage on SENSOR_GUIDE_RAIL_A (moves independently) */}
                          <g transform={`translate(${scanX}, 28)`}>
                            {/* Body of camera carriage */}
                            <rect x="-8" y="-5" width="16" height="10" rx="1.5" fill="#090d16" stroke="#38bdf8" strokeWidth="0.85" />
                            <circle cx="0" cy="0" r="2.5" fill="#111827" stroke="#94a3b8" strokeWidth="0.5" />
                            <circle cx="0" cy="0" r="1.1" fill="#22d3ee" />
                            <circle cx="-5" cy="-2.5" r="0.75" fill={isScanning ? "#10b981" : "#475569"} />
                            
                            {/* Camera Scanning Laser Beam Pointer */}
                            {isScanning && (
                              <polygon points="0,2.5 -18,102 18,102" fill="url(#laserBeam)" className="opacity-25" />
                            )}
                          </g>

                          {/* LOWER SEGMENT: Static Sprinklers permanently aligned over each plant */}
                          {/* Sprinkler 1: Daisy Nozzle (X=50, Y=51.5) */}
                          <g transform="translate(50, 51.5)">
                            <rect x="-4" y="-2" width="8" height="4" rx="0.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
                            <path d="M -2,2 L 2,2 L 1,5 L -1,5 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.5" />
                            <circle cx="0" cy="5.5" r="1" fill="#38bdf8" />
                            <circle cx="0" cy="-3.5" r="0.8" fill={isWateringDaisy ? "#22d3ee" : "#475569"} className={isWateringDaisy ? "animate-pulse" : ""} />
                            {isWateringDaisy && (
                              <g>
                                <line x1="-1" y1="6" x2="-8" y2="58" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3,5" strokeDashoffset={-simTick * 3} opacity="0.65" />
                                <line x1="0" y1="6" x2="0" y2="60" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4,4" strokeDashoffset={-simTick * 4} opacity="0.8" />
                                <line x1="1" y1="6" x2="8" y2="58" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3,5" strokeDashoffset={-simTick * 3} opacity="0.65" />
                                <polygon points="0,6 -12,60 12,60" fill="url(#sprinklerRain)" opacity="0.18" />
                              </g>
                            )}
                          </g>

                          {/* Sprinkler 2: Succulent Nozzle (X=120, Y=51.5) */}
                          <g transform="translate(120, 51.5)">
                            <rect x="-4" y="-2" width="8" height="4" rx="0.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
                            <path d="M -2,2 L 2,2 L 1,5 L -1,5 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.5" />
                            <circle cx="0" cy="5.5" r="1" fill="#38bdf8" />
                            <circle cx="0" cy="-3.5" r="0.8" fill={isWateringSucculent ? "#22d3ee" : "#475569"} className={isWateringSucculent ? "animate-pulse" : ""} />
                            {isWateringSucculent && (
                              <g>
                                <line x1="-1" y1="6" x2="-8" y2="58" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3,5" strokeDashoffset={-simTick * 3.5} opacity="0.65" />
                                <line x1="0" y1="6" x2="0" y2="60" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4,4" strokeDashoffset={-simTick * 4.5} opacity="0.8" />
                                <line x1="1" y1="6" x2="8" y2="58" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3,5" strokeDashoffset={-simTick * 3.5} opacity="0.65" />
                                <polygon points="0,6 -12,60 12,60" fill="url(#sprinklerRain)" opacity="0.18" />
                              </g>
                            )}
                          </g>

                          {/* Sprinkler 3: Rose Nozzle (X=190, Y=51.5) */}
                          <g transform="translate(190, 51.5)">
                            <rect x="-4" y="-2" width="8" height="4" rx="0.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
                            <path d="M -2,2 L 2,2 L 1,5 L -1,5 Z" fill="#b45309" stroke="#78350f" strokeWidth="0.5" />
                            <circle cx="0" cy="5.5" r="1" fill="#38bdf8" />
                            <circle cx="0" cy="-3.5" r="0.8" fill={isWateringRose ? "#22d3ee" : "#475569"} className={isWateringRose ? "animate-pulse" : ""} />
                            {isWateringRose && (
                              <g>
                                <line x1="-1" y1="6" x2="-8" y2="58" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3,5" strokeDashoffset={-simTick * 3.2} opacity="0.65" />
                                <line x1="0" y1="6" x2="0" y2="60" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="4,4" strokeDashoffset={-simTick * 4.2} opacity="0.8" />
                                <line x1="1" y1="6" x2="8" y2="58" stroke="#0ea5e9" strokeWidth="0.8" strokeDasharray="3,5" strokeDashoffset={-simTick * 3.2} opacity="0.65" />
                                <polygon points="0,6 -12,60 12,60" fill="url(#sprinklerRain)" opacity="0.18" />
                              </g>
                            )}
                          </g>

                          {/* Ground and planters shelf */}
                          <rect x="10" y="130" width="220" height="25" fill="#0c111d" stroke="#1e293b" />

                          {/* Flower 1 (Daisy) */}
                          <g transform="translate(50, 110)">
                            <rect x="-5" y="10" width="10" height="11" fill="#78350f" />
                            <line x1="0" y1="10" x2="0" y2="-10" stroke="#22c55e" strokeWidth="1.5" />
                            <circle cx="0" cy="-10" r="3.5" fill="#fbbf24" />
                            {isWateringDaisy && (
                              <>
                                <ellipse cx="0" cy="11" rx="6" ry="1.5" fill="none" stroke="#22d3ee" strokeWidth="0.75" className="animate-pulse" />
                              </>
                            )}
                          </g>

                          {/* Flower 2 (Succulent, receives water overhead) */}
                          <g transform="translate(120, 110)">
                            <rect x="-6" y="10" width="12" height="11" fill="#451a03" stroke={isWateringSucculent ? "#10b981" : "#451a03"} strokeWidth="1" />
                            <line x1="0" y1="10" x2="0" y2="-8" stroke={isWateringSucculent ? "#22c55e" : "#b45309"} strokeWidth="1.5" />
                            <circle cx="0" cy="-8" r="3" fill={isWateringSucculent ? "#48bb78" : "#92400e"} />
                            
                            {isWateringSucculent && (
                              <>
                                {/* Micro soil hydration splash animations */}
                                <ellipse cx="0" cy="11" rx="8" ry="1.8" fill="none" stroke="#22d3ee" strokeWidth="0.75" className="animate-pulse" />
                                <circle cx="-4" cy="5" r="0.75" fill="#38bdf8" />
                                <circle cx="4" cy="2" r="0.75" fill="#38bdf8" />
                              </>
                            )}
                          </g>

                          {/* Flower 3 (Rose) */}
                          <g transform="translate(190, 110)">
                            <rect x="-5" y="10" width="10" height="11" fill="#78350f" />
                            <line x1="0" y1="10" x2="0" y2="-10" stroke="#22c55e" strokeWidth="1.5" />
                            <circle cx="0" cy="-10" r="4.5" fill="#ef4444" />
                            {isWateringRose && (
                              <>
                                <ellipse cx="0" cy="11" rx="6" ry="1.5" fill="none" stroke="#22d3ee" strokeWidth="0.75" className="animate-pulse" />
                              </>
                            )}
                          </g>

                          {/* Daisy Lamp */}
                          <g transform="translate(50, 56)">
                            <rect x="-8" y="-2" width="16" height="4" fill="#334155" />
                            <circle cx="0" cy="2" r="3" fill={isLampsActive ? "#fef08a" : "#1e293b"} stroke="#cabffd" strokeWidth="0.75" className={isLampsActive ? "animate-pulse" : ""} />
                            {isLampsActive && (
                              <polygon points="0,2 -15,74 15,74" fill="url(#lampRay)" opacity="0.15" />
                            )}
                          </g>

                          {/* Succulent Lamp */}
                          <g transform="translate(120, 56)">
                            <rect x="-8" y="-2" width="16" height="4" fill="#334155" />
                            <circle cx="0" cy="2" r="3" fill={isLampsActive ? "#fef08a" : "#1e293b"} stroke="#cabffd" strokeWidth="0.75" className={isLampsActive ? "animate-pulse" : ""} />
                            {isLampsActive && (
                              <polygon points="0,2 -15,74 15,74" fill="url(#lampRay)" opacity="0.15" />
                            )}
                          </g>

                          {/* Rose Lamp */}
                          <g transform="translate(190, 56)">
                            <rect x="-8" y="-2" width="16" height="4" fill="#334155" />
                            <circle cx="0" cy="2" r="3" fill={isLampsActive ? "#fef08a" : "#1e293b"} stroke="#cabffd" strokeWidth="0.75" className={isLampsActive ? "animate-pulse" : ""} />
                            {isLampsActive && (
                              <polygon points="0,2 -15,74 15,74" fill="url(#lampRay)" opacity="0.15" />
                            )}
                          </g>

                          <defs>
                            <linearGradient id="laserBeam" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="sprinklerRain" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                              <stop offset="65%" stopColor="#22d3ee" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="lampRay" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2 rounded-lg border border-slate-900 font-mono text-[8px]">
                          <div>
                            <span className="text-slate-500 block">SENSORS</span>
                            <span className={`font-semibold ${isScanning ? "text-cyan-400" : isLampsActive ? "text-amber-400" : "text-emerald-400"}`}>
                              {isScanning ? "CAM SCANNING" : isLampsActive ? "UV LIGHT TUNED" : "LEVEL OPTIMAL"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">GROW BULB</span>
                            <span className={`font-bold uppercase ${isLampsActive ? "text-yellow-500 animate-pulse" : "text-slate-500"}`}>
                              {isLampsActive ? "ACTIVE (100%)" : "STDBY (OFF)"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">SPRINKLER</span>
                            <span className={`font-bold ${isWateringDaisy ? "text-cyan-400 animate-pulse" : "text-slate-500"}`}>
                              {isWateringDaisy ? "ALL ACTIVE (100%)" : "STDBY (OFF)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {activeId === "automation" && (() => {
                    const armCycle = simTick % 260;
                    
                    // Direct Target Coordinates (xt, yt) for absolute-precision kinematic tracking
                    let clawRefX = 120;
                    let clawRefY = 78;
                    let isCarryingBox = false;
                    let clawClosed = false;
 
                    // Direct turntable-tracking system
                    const isBaseTurning = (armCycle < 40) || (armCycle >= 125 && armCycle < 165);
                    
                    let turnAngleDeg = 0;
                    if (armCycle < 40) {
                      // Phase 1: Rotating Empty from Conveyor (Right, 0 deg) to Left Bin (180 deg)
                      const pct = armCycle / 40;
                      turnAngleDeg = pct * 180;
                      const angleRad = (turnAngleDeg * Math.PI) / 180;
                      clawRefX = 117 + Math.cos(angleRad) * 80;
                      clawRefY = 78;
                      isCarryingBox = false;
                      clawClosed = false;
                    } else if (armCycle < 70) {
                      // Phase 2: Arrived at Left. Descend Empty to Left Pickup Bin (37, 78 -> 116)
                      const pct = (armCycle - 40) / 30;
                      turnAngleDeg = 180;
                      clawRefX = 37;
                      clawRefY = 78 + pct * 38;
                      isCarryingBox = false;
                      clawClosed = false;
                    } else if (armCycle < 95) {
                      // Phase 3: Pickup Lock at Left Bin
                      turnAngleDeg = 180;
                      clawRefX = 37;
                      clawRefY = 116;
                      clawClosed = armCycle >= 78;
                      isCarryingBox = armCycle >= 78;
                    } else if (armCycle < 125) {
                      // Phase 4: Ascend Loaded clear of Left Bin walls (116 -> 78)
                      const pct = (armCycle - 95) / 30;
                      turnAngleDeg = 180;
                      clawRefX = 37;
                      clawRefY = 116 - pct * 38;
                      isCarryingBox = true;
                      clawClosed = true;
                    } else if (armCycle < 165) {
                      // Phase 5: Rotating Loaded from Left Bin (180 deg) to Right Conveyor (0 deg)
                      const pct = (armCycle - 125) / 40;
                      turnAngleDeg = 180 - pct * 180;
                      const angleRad = (turnAngleDeg * Math.PI) / 180;
                      clawRefX = 117 + Math.cos(angleRad) * 80;
                      clawRefY = 78;
                      isCarryingBox = true;
                      clawClosed = true;
                    } else if (armCycle < 195) {
                      // Phase 6: Arrived at Conveyor. Descend Loaded to Right Conveyor (197, 78 -> 116)
                      const pct = (armCycle - 165) / 30;
                      turnAngleDeg = 0;
                      clawRefX = 197;
                      clawRefY = 78 + pct * 38;
                      isCarryingBox = true;
                      clawClosed = true;
                    } else if (armCycle < 215) {
                      // Phase 7: Deposit Release at conveyor
                      turnAngleDeg = 0;
                      clawRefX = 197;
                      clawRefY = 116;
                      clawClosed = armCycle < 205;
                      isCarryingBox = armCycle < 205;
                    } else if (armCycle < 240) {
                      // Phase 8: Lift clear of dropped cargo (116 -> 78)
                      const pct = (armCycle - 215) / 25;
                      turnAngleDeg = 0;
                      clawRefX = 197;
                      clawRefY = 116 - pct * 38;
                      isCarryingBox = false;
                      clawClosed = false;
                    } else {
                      // Phase 9: Standby Hover drift
                      const pct = (armCycle - 240) / 20;
                      turnAngleDeg = 0;
                      clawRefX = 197 - pct * 40;
                      clawRefY = 78;
                      isCarryingBox = false;
                      clawClosed = false;
                    }
 
                    // Mechanical joint pivot coordinates and link lengths
                    const baseX = 117;
                    const baseY = 135; // Elevator pedestal turntable base (clears the ground)
                    const shoulderL = 46;
                    const forearmL = 38;
 
                    // Solve local outreach path
                    const localReach = isBaseTurning ? 80 : Math.abs(clawRefX - baseX);
                    const localClawX = baseX + localReach;
                    const localClawY = clawRefY;
 
                    // REAL-TIME 2D INVERSE KINEMATICS CALCULATIONS ON LOCAL PLANE
                    const dx = localClawX - baseX; // equals localReach
                    const dy = baseY - localClawY; // Screen space Y inverted
                    const D2 = dx * dx + dy * dy;
                    const D = Math.sqrt(D2);
 
                    // Law of Cosines
                    let cosBeta = (D2 - shoulderL * shoulderL - forearmL * forearmL) / (2 * shoulderL * forearmL);
                    cosBeta = Math.max(-1, Math.min(1, cosBeta));
                    const beta = Math.acos(cosBeta);
 
                    let cosAlpha = (shoulderL * shoulderL + D2 - forearmL * forearmL) / (2 * shoulderL * D);
                    cosAlpha = Math.max(-1, Math.min(1, cosAlpha));
                    const alpha = Math.acos(cosAlpha);
 
                    const thetaBase = Math.atan2(dx, dy);
                    const radShoulder = thetaBase - alpha;
                    const radElbow = radShoulder + beta;
 
                    // Forward Kinematics to calculate exact pivot elbow coordinate on the local plane
                    const localElbowX = baseX + shoulderL * Math.sin(radShoulder);
                    const localElbowY = baseY - shoulderL * Math.cos(radShoulder);
 
                    // Solved exact claw effector coordinate on local plane (matches localClawX/localClawY precisely)
                    const localClawX_solved = localElbowX + forearmL * Math.sin(radElbow);
                    const localClawY_solved = localElbowY - forearmL * Math.cos(radElbow);
                    
                    // Projection of all joint positions to 3D screen space
                    const rad = (turnAngleDeg * Math.PI) / 180;
                    
                    // Core 3D Projection Model supporting custom camera orbital yaw + structural depth offset
                    const project3D = (xLocal: number, yLocal: number, zLocal: number) => {
                      const hAboveBase = baseY - yLocal; // height upward from pedestal platform
                      const reachOffset = xLocal - baseX;
                      
                      // Base is rotating with turnAngleDeg, but let's blend in optional camera orbital yaw offset
                      const viewYawRad = rad + (cameraYaw * Math.PI) / 180;
                      const viewPitchRad = (cameraPitch * Math.PI) / 180;
                      
                      // Rotate point in 3D cylindrical coordinates around vertical central hub
                      const rot3DX = reachOffset * Math.cos(viewYawRad) - zLocal * Math.sin(viewYawRad);
                      const rot3DZ = reachOffset * Math.sin(viewYawRad) + zLocal * Math.cos(viewYawRad);
                      
                      // Camera elevation foreshortening projects depth rot3DZ vertically
                      return {
                        x: baseX + rot3DX,
                        y: baseY - hAboveBase + rot3DZ * Math.sin(viewPitchRad)
                      };
                    };

                    // Static 3D Projection Model (No arm base rotation included)
                    const project3D_static = (xLocal: number, yLocal: number, zLocal: number) => {
                      const hAboveBase = baseY - yLocal;
                      const reachOffset = xLocal - baseX;
                      const viewYawRad = (cameraYaw * Math.PI) / 180;
                      const viewPitchRad = (cameraPitch * Math.PI) / 180;
                      const rot3DX = reachOffset * Math.cos(viewYawRad) - zLocal * Math.sin(viewYawRad);
                      const rot3DZ = reachOffset * Math.sin(viewYawRad) + zLocal * Math.cos(viewYawRad);
                      return {
                        x: baseX + rot3DX,
                        y: baseY - hAboveBase + rot3DZ * Math.sin(viewPitchRad)
                      };
                    };

                    // Solve key structural joints in 3D coordinate space
                    const pBaseCenter = { x: baseX, y: baseY }; // Base hub (0,0,0)
                    const pElbow3D = (zOffset: number) => project3D(localElbowX, localElbowY, zOffset);
                    const pClaw3D = (zOffset: number) => project3D(localClawX_solved, localClawY_solved, zOffset);

                    // Convert to degrees for rotatory mechatronic displays
                    const shoulderDeg = (radShoulder * 180) / Math.PI;
                    const elbowDeg = (radElbow * 180) / Math.PI;

                    // Solve alignment angle of gripper in 3D projection plane
                    const clawC0 = pClaw3D(0);
                    const elbowC0 = pElbow3D(0);
                    const projAngleDegrees = (Math.atan2(clawC0.y - elbowC0.y, clawC0.x - elbowC0.x) * 180) / Math.PI - 90;

                    // Helper to render high-fidelity 3D shaded boxes
                    const render3DBox = (xCenter: number, yCenter: number, zCenter: number, w: number, h: number, d: number, baseColor: string, topColor: string, sideColor: string, isPulse?: boolean) => {
                      const c1 = project3D(xCenter - w/2, yCenter - h, zCenter - d/2); // Top Front Left
                      const c2 = project3D(xCenter + w/2, yCenter - h, zCenter - d/2); // Top Front Right
                      const c3 = project3D(xCenter + w/2, yCenter - h, zCenter + d/2); // Top Back Right
                      const c4 = project3D(xCenter - w/2, yCenter - h, zCenter + d/2); // Top Back Left
                      const c5 = project3D(xCenter - w/2, yCenter,     zCenter - d/2); // Bottom Front Left
                      const c6 = project3D(xCenter + w/2, yCenter,     zCenter - d/2); // Bottom Front Right
                      const c7 = project3D(xCenter + w/2, yCenter,     zCenter + d/2); // Bottom Back Right
                      const c8 = project3D(xCenter - w/2, yCenter,     zCenter + d/2); // Bottom Back Left
                      
                      return (
                        <g className={isPulse ? "animate-pulse" : ""}>
                          {/* Left face */}
                          <polygon points={`${c1.x},${c1.y} ${c5.x},${c5.y} ${c8.x},${c8.y} ${c4.x},${c4.y}`} fill={sideColor} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                          {/* Right face */}
                          <polygon points={`${c2.x},${c2.y} ${c6.x},${c6.y} ${c7.x},${c7.y} ${c3.x},${c3.y}`} fill={baseColor} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                          {/* Top face */}
                          <polygon points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`} fill={topColor} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                        </g>
                      );
                    };

                    // Helper to render high-fidelity 3D static shaded boxes
                    const render3DBox_static = (xCenter: number, yCenter: number, zCenter: number, w: number, h: number, d: number, baseColor: string, topColor: string, sideColor: string, isPulse?: boolean) => {
                      const c1 = project3D_static(xCenter - w/2, yCenter - h, zCenter - d/2); // Top Front Left
                      const c2 = project3D_static(xCenter + w/2, yCenter - h, zCenter - d/2); // Top Front Right
                      const c3 = project3D_static(xCenter + w/2, yCenter - h, zCenter + d/2); // Top Back Right
                      const c4 = project3D_static(xCenter - w/2, yCenter - h, zCenter + d/2); // Top Back Left
                      const c5 = project3D_static(xCenter - w/2, yCenter,     zCenter - d/2); // Bottom Front Left
                      const c6 = project3D_static(xCenter + w/2, yCenter,     zCenter - d/2); // Bottom Front Right
                      const c7 = project3D_static(xCenter + w/2, yCenter,     zCenter + d/2); // Bottom Back Right
                      const c8 = project3D_static(xCenter - w/2, yCenter,     zCenter + d/2); // Bottom Back Left
                      
                      return (
                        <g className={isPulse ? "animate-pulse" : ""}>
                          {/* Left face */}
                          <polygon points={`${c1.x},${c1.y} ${c5.x},${c5.y} ${c8.x},${c8.y} ${c4.x},${c4.y}`} fill={sideColor} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                          {/* Right face */}
                          <polygon points={`${c2.x},${c2.y} ${c6.x},${c6.y} ${c7.x},${c7.y} ${c3.x},${c3.y}`} fill={baseColor} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                          {/* Top face */}
                          <polygon points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`} fill={topColor} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                        </g>
                      );
                    };
 
                    return (
                      <div className="w-full h-full relative flex flex-col justify-between gap-1.5" id="3d-arm-simulator-container">
                        <svg 
                          viewBox="0 0 240 185" 
                          className="w-full h-[225px] bg-[#02050e]/95 border border-slate-900 rounded-lg overflow-hidden relative cursor-grab active:cursor-grabbing select-none"
                          onMouseDown={handleSvgMouseDown}
                          onMouseMove={handleSvgMouseMove}
                          onMouseUp={handleSvgMouseUp}
                          onMouseLeave={handleSvgMouseUp}
                          onTouchStart={handleSvgTouchStart}
                          onTouchMove={handleSvgTouchMove}
                          onTouchEnd={handleSvgTouchEnd}
                        >
                          <defs>
                            {/* Shiny gradients for structural 3D parallel metal struts */}
                            <linearGradient id="shoulderMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#db2777" />
                              <stop offset="40%" stopColor="#fecdd3" />
                              <stop offset="100%" stopColor="#e11d48" />
                            </linearGradient>
                            <linearGradient id="forearmMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="45%" stopColor="#bfdbfe" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                            <radialGradient id="shadowGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="rgba(0, 0, 0, 0.75)" />
                              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                            </radialGradient>
                          </defs>

                          {/* Dynamic 3D coordinate floor grid */}
                          <g opacity="0.12">
                            {[-3, -2, -1, 0, 1, 2, 3].map((gZ) => {
                              const leftPt = project3D_static(15, 165, gZ * 14);
                              const rightPt = project3D_static(225, 165, gZ * 14);
                              return (
                                <line key={`z_${gZ}`} x1={leftPt.x} y1={leftPt.y} x2={rightPt.x} y2={rightPt.y} stroke="#22d3ee" strokeWidth="0.5" />
                              );
                            })}
                            {[-3, -2, -1, 0, 1, 2, 3].map((gX) => {
                              const offsetReach = gX * 24;
                              const backPt = project3D_static(baseX + offsetReach, 165, -45);
                              const frontPt = project3D_static(baseX + offsetReach, 165, 45);
                              return (
                                <line key={`x_${gX}`} x1={backPt.x} y1={backPt.y} x2={frontPt.x} y2={frontPt.y} stroke="#22d3ee" strokeWidth="0.5" />
                              );
                            })}
                          </g>

                          {/* Shadows under platforms and pedestal */}
                          {(() => {
                            const shadowLeft = project3D_static(37, 151.5, 0);
                            const shadowRight = project3D_static(197, 151.5, 0);
                            const shadowCenter = project3D_static(117, 151.2, 0);
                            return (
                              <>
                                <ellipse cx={shadowLeft.x} cy={shadowLeft.y} rx="14" ry="4" fill="url(#shadowGlow)" />
                                <ellipse cx={shadowRight.x} cy={shadowRight.y} rx="18" ry="4" fill="url(#shadowGlow)" />
                                <ellipse cx={shadowCenter.x} cy={shadowCenter.y} rx="22" ry="6.5" fill="url(#shadowGlow)" />
                              </>
                            );
                          })()}

                          {/* Left Platform Bin - Raised 3D Block (Centered at local X=37, Y=150, Z=0) */}
                          {(() => {
                            const pLeftLabelProj = project3D_static(37, 142, 0);
                            return (
                              <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setActivePartSelection("cargo"); }}>
                                {render3DBox_static(37, 150, 0, 24, 24, 24, "#0f172a", "#1e293b", "#334155")}
                                <text x={pLeftLabelProj.x} y={pLeftLabelProj.y} textAnchor="middle" fontSize="4.5px" fill="#94a3b8" fontFamily="monospace" fontWeight="bold">BIN_LEFT</text>
                              </g>
                            );
                          })()}

                          {/* Right Conveyor Assembly Platform - Raised 3D Block (Centered at local X=197, Y=150, Z=0) */}
                          {(() => {
                            const pConveyorLabelProj = project3D_static(197, 142, 0);
                            return (
                              <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setActivePartSelection("cargo"); }}>
                                {render3DBox_static(197, 150, 0, 32, 24, 24, "#0f172a", "#1e293b", "#334155")}
                                <text x={pConveyorLabelProj.x} y={pConveyorLabelProj.y} textAnchor="middle" fontSize="4.5px" fill="#94a3b8" fontFamily="monospace" fontWeight="bold">CONVEYOR</text>
                              </g>
                            );
                          })()}

                          {/* Packages in 3D Isometric View */}
                          {isCarryingBox ? null : (() => {
                            const showLeftPackage = armCycle < 78;
                            const showRightPackage = armCycle >= 205 || (armCycle >= 0 && armCycle < 50);
                            
                            let rightPkgX = 197;
                            let rightPkgOpacity = 1.0;
                            let isVisibleRight = false;

                            if (armCycle >= 205) {
                              isVisibleRight = true;
                              if (armCycle >= 215) {
                                const t = Math.min(1.0, (armCycle - 215) / 40);
                                rightPkgX = 197 + t * 40;
                                if (t > 0.6) {
                                  rightPkgOpacity = Math.max(0, 1.0 - (t - 0.6) / 0.4);
                                }
                              }
                            } else if (armCycle < 50) {
                              isVisibleRight = true;
                              const t = (armCycle + 45) / 95;
                              rightPkgX = 197 + t * 40;
                              rightPkgOpacity = Math.max(0, 1.0 - t);
                            }

                            return (
                              <>
                                {showLeftPackage && (
                                  <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setActivePartSelection("cargo"); }}>
                                    {render3DBox_static(37, 126, 0, 12, 10, 12, "#047857", "#10b981", "#059669")}
                                    {activePartSelection === "cargo" && (() => {
                                      const pLeftPkgTop = project3D_static(37, 116, 0);
                                      return (
                                        <ellipse cx={pLeftPkgTop.x} cy={pLeftPkgTop.y} rx="9" ry="3.2" fill="none" stroke="#10b981" strokeWidth="1" className="animate-pulse" />
                                      );
                                    })()}
                                  </g>
                                )}
                                {isVisibleRight && rightPkgOpacity > 0.01 && (
                                  <g className="cursor-pointer" style={{ opacity: rightPkgOpacity }} onClick={(e) => { e.stopPropagation(); setActivePartSelection("cargo"); }}>
                                    {render3DBox_static(rightPkgX, 126, 0, 12, 10, 12, "#047857", "#10b981", "#059669", true)}
                                    {activePartSelection === "cargo" && (() => {
                                      const pRightPkgTop = project3D_static(rightPkgX, 116, 0);
                                      return (
                                        <ellipse cx={pRightPkgTop.x} cy={pRightPkgTop.y} rx="9" ry="3.2" fill="none" stroke="#10b981" strokeWidth="1" className="animate-pulse" />
                                      );
                                    })()}
                                  </g>
                                )}
                              </>
                            );
                          })()}

                          {/* Dynamic 3D Turntable Base Cylinder Pedestal */}
                          {(() => {
                            const pBaseFloor = project3D_static(baseX, 160, 0);
                            const pBaseRing = project3D_static(baseX, 134, 0);
                            const topW = 20;
                            const topH = 5.5;
                            const botW = 22;
                            return (
                              <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setActivePartSelection("base"); }}>
                                {/* Shaded cylinder side representing pedestal height */}
                                <path 
                                  d={`M ${pBaseRing.x - topW},${pBaseRing.y} 
                                      L ${pBaseFloor.x - botW},${pBaseFloor.y} 
                                      A ${botW},7 0 0,0 ${pBaseFloor.x + botW},${pBaseFloor.y} 
                                      L ${pBaseRing.x + topW},${pBaseRing.y} 
                                      A ${topW},5 0 0,1 ${pBaseRing.x - topW},${pBaseRing.y} Z`} 
                                  fill="#0a0f24" 
                                  stroke={activePartSelection === "base" ? "#22d3ee" : "#334155"} 
                                  strokeWidth="0.8" 
                                />
                                {/* Rotating glowing circular collar atop base */}
                                <ellipse 
                                  cx={pBaseRing.x} 
                                  cy={pBaseRing.y} 
                                  rx={topW} 
                                  ry={topH} 
                                  fill="#111827" 
                                  stroke={isBaseTurning ? "#22d3ee" : activePartSelection === "base" ? "#e0f2fe" : "#38bdf8"} 
                                  strokeWidth={isBaseTurning || activePartSelection === "base" ? "1.6" : "1.0"} 
                                  className={isBaseTurning ? "animate-pulse" : ""} 
                                />

                                {/* Orbit ring highlight for active selection */}
                                {activePartSelection === "base" && (
                                  <ellipse 
                                    cx={pBaseRing.x} 
                                    cy={pBaseRing.y} 
                                    rx={topW + 2} 
                                    ry={topH + 1} 
                                    fill="none" 
                                    stroke="#22d3ee" 
                                    strokeWidth="1.2" 
                                    strokeDasharray="3 3"
                                  />
                                )}
                                
                                {/* Orbit directional micro-arrows */}
                                {isBaseTurning && (
                                  <ellipse 
                                    cx={pBaseRing.x} 
                                    cy={pBaseRing.y - 7} 
                                    rx="14" 
                                    ry="3.5" 
                                    fill="none" 
                                    stroke="#22d3ee" 
                                    strokeWidth="0.6" 
                                    strokeDasharray="2 2" 
                                  />
                                )}
                              </g>
                            );
                          })()}
 
                          {/* Back Shoulder Strut Plate (Rendered behind the arm plane at Z = +4.5) */}
                          <line 
                            x1={project3D(baseX, baseY, 4.5).x} 
                            y1={project3D(baseX, baseY, 4.5).y} 
                            x2={pElbow3D(4.5).x} 
                            y2={pElbow3D(4.5).y} 
                            stroke="rgba(157, 23, 77, 0.7)" 
                            strokeWidth="3.2" 
                            strokeLinecap="round" 
                          />
 
                          {/* Back Forearm Strut Plate (Rendered behind arm plane at Z = +3.5) */}
                          <line 
                            x1={pElbow3D(3.5).x} 
                            y1={pElbow3D(3.5).y} 
                            x2={pClaw3D(3.5).x} 
                            y2={pClaw3D(3.5).y} 
                            stroke="rgba(29, 78, 216, 0.7)" 
                            strokeWidth="2.8" 
                            strokeLinecap="round" 
                          />
  
                          {/* Front Shoulder Strut Plate - Shiny Gradient (Rendered at Z = -4.5) */}
                          <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setActivePartSelection("shoulder"); }}>
                            {/* Hover/Selection glow line */}
                            <line 
                              x1={project3D(baseX, baseY, -4.5).x} 
                              y1={project3D(baseX, baseY, -4.5).y} 
                              x2={pElbow3D(-4.5).x} 
                              y2={pElbow3D(-4.5).y} 
                              stroke="#ec4899" 
                              strokeWidth={activePartSelection === "shoulder" ? "7.5" : "5.5"} 
                              strokeLinecap="round" 
                              opacity={activePartSelection === "shoulder" ? "0.35" : "0"} 
                              className="transition-all duration-200"
                            />
                            <line 
                              x1={project3D(baseX, baseY, -4.5).x} 
                              y1={project3D(baseX, baseY, -4.5).y} 
                              x2={pElbow3D(-4.5).x} 
                              y2={pElbow3D(-4.5).y} 
                              stroke="url(#shoulderMetal)" 
                              strokeWidth="4.0" 
                              strokeLinecap="round" 
                            />
                            {/* Gloss highlight overlay */}
                            <line 
                              x1={project3D(baseX, baseY, -4.5).x} 
                              y1={project3D(baseX, baseY, -4.5).y} 
                              x2={pElbow3D(-4.5).x} 
                              y2={pElbow3D(-4.5).y} 
                              stroke="#fff" 
                              strokeWidth="0.8" 
                              strokeLinecap="round" 
                              opacity="0.4"
                            />
                          </g>
  
                          {/* Front Forearm Strut Plate - Shiny Gradient (Rendered at Z = -3.5) */}
                          <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setActivePartSelection("elbow"); }}>
                            {/* Selection highlight */}
                            <line 
                              x1={pElbow3D(-3.5).x} 
                              y1={pElbow3D(-3.5).y} 
                              x2={pClaw3D(-3.5).x} 
                              y2={pClaw3D(-3.5).y} 
                              stroke="#3b82f6" 
                              strokeWidth={activePartSelection === "elbow" ? "6.5" : "5.0"} 
                              strokeLinecap="round" 
                              opacity={activePartSelection === "elbow" ? "0.35" : "0"} 
                              className="transition-all duration-200"
                            />
                            <line 
                              x1={pElbow3D(-3.5).x} 
                              y1={pElbow3D(-3.5).y} 
                              x2={pClaw3D(-3.5).x} 
                              y2={pClaw3D(-3.5).y} 
                              stroke="url(#forearmMetal)" 
                              strokeWidth="3.4" 
                              strokeLinecap="round" 
                            />
                            {/* Gloss highlight overlay */}
                            <line 
                              x1={pElbow3D(-3.5).x} 
                              y1={pElbow3D(-3.5).y} 
                              x2={pClaw3D(-3.5).x} 
                              y2={pClaw3D(-3.5).y} 
                              stroke="#fff" 
                              strokeWidth="0.7" 
                              strokeLinecap="round" 
                              opacity="0.45"
                            />
                          </g>
  
                          {/* Structural Axle Pins (Elbow axle cylinder) */}
                          <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setActivePartSelection("elbow"); }}>
                            <circle cx={elbowC0.x} cy={elbowC0.y} r="8" fill="transparent" />
                            <circle cx={elbowC0.x} cy={elbowC0.y} r={activePartSelection === "elbow" ? "4.5" : "3.0"} fill={activePartSelection === "elbow" ? "rgba(244, 63, 94, 0.25)" : "#1e293b"} stroke="#f43f5e" strokeWidth="0.6" />
                            <circle cx={elbowC0.x} cy={elbowC0.y} r="1.5" fill="#fff" />
                          </g>
  
                          {/* Base Pin Caps */}
                          <circle cx={pBaseCenter.x} cy={project3D(baseX, baseY, 0).y} r="3.2" fill="#020613" stroke="#38bdf8" strokeWidth="1" />
  
                          {/* Wrist assembly structure & carried 3D cargo Box */}
                          <g 
                            className="cursor-pointer" 
                            onClick={(e) => { e.stopPropagation(); setActivePartSelection("claw"); }}
                            transform={`translate(${clawC0.x}, ${clawC0.y}) rotate(${projAngleDegrees})`}
                          >
                            {/* Selection highlight around claw */}
                            {activePartSelection === "claw" && (
                              <circle cx="0" cy="4" r="9" fill="none" stroke="#60a5fa" strokeWidth="0.8" strokeDasharray="2 2" className="animate-spin" />
                            )}
  
                            {/* Mechanical clamp wrist mount */}
                            <path d="M -5,-2 L 5,-2 L 3,1 L -3,1 Z" fill="#334155" stroke="#475569" strokeWidth="0.5" />
                            
                            {/* Dual grabber fingers with open/closed kinematics states */}
                            <path 
                              d={clawClosed 
                                ? "M -3,1 Q -4.5,5 -1.5,8.5" 
                                : "M -3,1 Q -6.5,4.5 -4,8.2"
                              } 
                              fill="none" 
                              stroke="#60a5fa" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                            />
                            <path 
                              d={clawClosed 
                                ? "M 3,1 Q 4.5,5 1.5,8.5" 
                                : "M 3,1 Q 6.5,4.5 4,8.2"
                              } 
                              fill="none" 
                              stroke="#60a5fa" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                            />
                          </g>

                          {/* 3D carried Package sandwiched in the claw */}
                          {isCarryingBox && (
                            render3DBox(localClawX_solved, localClawY_solved + 10, 0, 12, 10, 12, "#047857", "#10b981", "#059669")
                          )}
                          
                          {/* 3D coordinate compass axis locator in corner */}
                          <g transform="translate(19, 25)" opacity="0.65">
                            <line x1="0" y1="0" x2="12" y2="0" stroke="#f43f5e" strokeWidth="1" />
                            <text x="15" y="1" fontSize="4.5px" fill="#f43f5e" fontFamily="monospace">X</text>
                            
                            <line x1="0" y1="0" x2="0" y2="-12" stroke="#10b981" strokeWidth="1" />
                            <text x="-2" y="-14" fontSize="4.5px" fill="#10b981" fontFamily="monospace">Y</text>
                            
                            <line x1="0" y1="0" x2="7" y2="6" stroke="#3b82f6" strokeWidth="1" />
                            <text x="9" y="9" fontSize="4.5px" fill="#3b82f6" fontFamily="monospace">Z</text>
                          </g>
  
                          {/* Futuristic Heads-Up-Display (HUD) Overlay inside the SVG */}
                          <g transform="translate(142, 14)" opacity="0.85">
                            <rect x="0" y="0" width="86" height="28" rx="4" fill="#020617" stroke="#1e293b" strokeWidth="0.8" />
                            <text x="5" y="7" fontSize="4.2px" fill="#94a3b8" fontFamily="monospace" fontWeight="bold">DRAG 3D: ORBIT VIEW</text>
                            <text x="5" y="14" fontSize="3.8px" fill="#64748b" fontFamily="monospace">CLICK JOINTS TO INSPECT</text>
                            <text x="5" y="22" fontSize="4.5px" fill="#22d3ee" fontFamily="monospace" fontWeight="bold">
                              {activePartSelection === "base" && "• ID: SWEEP PEDESTAL"}
                              {activePartSelection === "shoulder" && "• ID: SHOULDER ACTUATOR"}
                              {activePartSelection === "elbow" && "• ID: ELBOW ROTATOR"}
                              {activePartSelection === "claw" && "• ID: END EFFECTOR CLAW"}
                              {activePartSelection === "cargo" && "• ID: PAYLOAD PROFILE"}
                              {!activePartSelection && "• ID: SELECT ELEMENT"}
                            </text>
                          </g>
                        </svg>
  
                        {/* Interactive mechatronic telemetry info & Viewpoint controllers */}
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col gap-2">
                          
                          {/* Live 3D Selection Inspector HUD */}
                          <div className="bg-[#040815]/80 p-2 rounded border border-slate-900/60 text-left font-sans text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-[8px] text-cyan-400 font-extrabold tracking-widest block uppercase">
                                mechatronic node: {activePartSelection ? activePartSelection.toUpperCase() : "NONE (CLICK SVG TO HIGHLIGHT)"}
                              </span>
                              {activePartSelection && (
                                <span className="inline-block px-1 rounded bg-indigo-950 border border-indigo-500/20 text-[7px] text-indigo-400 font-mono font-bold animate-pulse">
                                  CALIBRATED
                                </span>
                              )}
                            </div>
                            
                            {activePartSelection === "base" && (
                              <div className="space-y-1">
                                <p className="text-[10.5px] text-slate-350 leading-relaxed">
                                  Rotary turntable base executing continuous 180° sweeps. Managed by 50Hz PWM frequency registers.
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-slate-400">
                                  <span>YAW COORD: <strong className="text-white">{isBaseTurning ? "TRANSITING" : `${Math.round(shoulderDeg)}°`}</strong></span>
                                  <span>DRAG LOAD: <strong className="text-cyan-400">{(payloadMassGrams * 0.00981 * 0.08).toFixed(3)} N·m</strong></span>
                                </div>
                              </div>
                            )}
  
                            {activePartSelection === "shoulder" && (
                              <div className="space-y-1">
                                <p className="text-[10.5px] text-slate-350 leading-relaxed">
                                  Primary core bracket bearing the structural momentum vector of the mechatronic linkages.
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-slate-400">
                                  <span>BRAC LENGTH: <strong className="text-white">{shoulderL} mm</strong></span>
                                  <span>SHOULDER TORQUE: <strong className="text-pink-400">{(shoulderL * Math.sin(Math.abs(radShoulder || 0)) * (150 + (isCarryingBox ? payloadMassGrams : 0)) * 0.00981).toFixed(1)} N·mm</strong></span>
                                </div>
                              </div>
                            )}
  
                            {activePartSelection === "elbow" && (
                              <div className="space-y-1">
                                <p className="text-[10.5px] text-slate-350 leading-relaxed">
                                  Calculates real-time 180° joint angle outputs dynamically using reverse-engineered cosine vectors.
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-slate-400">
                                  <span>SWEEP ANGLE: <strong className="text-white">{Math.abs(Math.round(elbowDeg))}°</strong></span>
                                  <span>AXLE TENSION: <strong className="text-cyan-400">{(forearmL * Math.sin(Math.abs(radElbow || 0)) * (85 + (isCarryingBox ? payloadMassGrams : 0)) * 0.00981).toFixed(1)} N·mm</strong></span>
                                </div>
                              </div>
                            )}
  
                            {activePartSelection === "claw" && (
                              <div className="space-y-1">
                                <p className="text-[10.5px] text-slate-350 leading-relaxed">
                                  Pneumatic parallel claw end-effector. Governs interlocking grips and object detection.
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px] text-slate-400">
                                  <span>HOLD FORCE: <strong className="text-blue-400">{clawClosed ? "4.9 N (GRIPPED)" : "0.0 N (OPEN)"}</strong></span>
                                  <span>EFFECTOR STATE: <strong className="text-white">{clawClosed ? "CLOSED" : "HOVER"}</strong></span>
                                </div>
                              </div>
                            )}
  
                            {activePartSelection === "cargo" && (
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <p className="text-[10.5px] text-slate-350 leading-normal">
                                    Simulate variable cargo loads to see direct impacts on physics torque calculators:
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="font-mono text-[9px] text-slate-500 font-extrabold uppercase shrink-0">MASS SPEC:</span>
                                  <div className="flex gap-1.5">
                                    {[50, 120, 250].map((mass) => (
                                      <button
                                        key={mass}
                                        onClick={() => setPayloadMassGrams(mass)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-black border transition-all cursor-pointer ${
                                          payloadMassGrams === mass
                                            ? "bg-sky-500/20 border-sky-500 text-sky-400 ring-1 ring-sky-500/20"
                                            : "bg-slate-900 border-slate-800 text-slate-500 hover:text-white hover:border-sky-500/50"
                                        }`}
                                      >
                                        {mass}g
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
  
                          <div className="grid grid-cols-3 gap-1 px-1 font-mono text-[8.5px] border-t border-slate-900/40 pt-1.5">
                            <div>
                              <span className="text-slate-500 block uppercase">BASE ORIENT</span>
                              <span className="font-extrabold text-indigo-400">{isBaseTurning ? "ORBIT 180°" : `${Math.round(shoulderDeg)}°`}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase">ELBOW PIVOT</span>
                              <span className="font-extrabold text-cyan-400">{isBaseTurning ? "RESTING" : `${Math.round(elbowDeg)}°`}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block uppercase">CLAW LOCK</span>
                              <span className={`font-bold ${clawClosed ? "text-rose-400 animate-pulse" : "text-slate-400"}`}>
                                {clawClosed ? "CLOSED" : "STANDBY"}
                              </span>
                            </div>
                          </div>
  
                          {/* 3D camera controls HUD strip */}
                          <div className="border-t border-slate-900/60 pt-2 flex flex-col sm:flex-row gap-2 justify-between items-stretch">
                            <div className="flex-1 flex items-center gap-2 select-none">
                              <span className="font-mono text-[7.5px] text-slate-500 font-extrabold uppercase shrink-0">VIEWPORT EL:</span>
                              <input 
                                type="range" 
                                min="10" 
                                max="45" 
                                value={cameraPitch} 
                                onChange={(e) => setCameraPitch(Number(e.target.value))}
                                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-505 accent-indigo-500"
                              />
                              <span className="font-mono text-[7.5px] text-slate-400 font-bold shrink-0 w-5 text-right">{cameraPitch}°</span>
                            </div>
                            <div className="flex-1 flex items-center gap-2 select-none">
                              <span className="font-mono text-[7.5px] text-slate-500 font-extrabold uppercase shrink-0">CAMERA YAW:</span>
                              <input 
                                type="range" 
                                min="-180" 
                                max="180" 
                                value={cameraYaw} 
                                onChange={(e) => setCameraYaw(Number(e.target.value))}
                                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-450 accent-cyan-400"
                              />
                              <span className="font-mono text-[7.5px] text-slate-400 font-bold shrink-0 w-7 text-right">{cameraYaw > 0 ? `+${cameraYaw}` : cameraYaw}°</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Telemetry output status bottom strip */}
          <div className="flex items-center justify-between font-mono text-[8.5px] text-slate-505 text-slate-500 tracking-wider uppercase border-t border-slate-900/60 pt-4 mt-1 select-none">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              BUS CONSTANT:
            </span>
            <span className="text-emerald-400 font-extrabold">{systemData.voltageFlow}</span>
          </div>

        </div>
      </div>

      {/* THE ROBOT EXAMPLES PRESENTS */}
      <div className="relative z-10 w-full max-w-7xl mx-auto border-t border-slate-900/40 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pl-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-450 text-sky-400" />
            <span className="font-mono text-[9px] text-slate-400 font-black uppercase tracking-widest block">
              Robotics System Examples
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => {
                setIsDiagnosticActive(true);
                setActiveStep(null);
                setTimeout(() => {
                  if (simulatorRef.current) {
                    const isMobile = window.innerWidth < 768;
                    simulatorRef.current.scrollIntoView({ 
                      behavior: "smooth", 
                      block: isMobile ? "start" : "center" 
                    });
                  }
                }, 50);
              }}
              className="font-mono text-xs text-sky-450 text-sky-400 font-extrabold tracking-wider hover:text-sky-300 transition-colors uppercase cursor-pointer flex items-center gap-2 bg-sky-950/45 border border-slate-800 hover:border-sky-500 px-4 py-2 rounded-xl animate-pulse"
              title="Activate full loop synchronization, highlighting all 3 basic robotics components together"
            >
              <Activity className="w-3 h-3 text-sky-400" />
              Sync Co-System Loop
            </button>

            {/* Return button back to the clean general theory view */}
            {activeId && (
              <button
                onClick={() => {
                  setActiveId(null);
                  setActiveStep("sensors");
                }}
                className="font-mono text-xs text-sky-400 font-black tracking-wider hover:text-sky-300 transition-colors uppercase cursor-pointer flex items-center gap-2 bg-sky-950/40 border border-slate-800 hover:border-sky-500 px-4 py-2 rounded-xl animate-fadeIn"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Flow
              </button>
            )}
          </div>
        </div>

        {/* Preset Cards using clean non-redundant labels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROBOT_SYSTEMS.map((system) => {
            const isActive = activeId === system.id;
            return (
              <button
                key={system.id}
                onClick={() => {
                  if (isActive) {
                    // Turn off preset back to general theory flow
                    setActiveId(null);
                  } else {
                    setActiveId(system.id);
                    // Automatically redirect / scroll to the animation simulator
                    setTimeout(() => {
                      if (simulationWorkspaceRef.current) {
                        simulationWorkspaceRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "start"
                        });
                      } else if (simulatorRef.current) {
                        const isMobile = window.innerWidth < 768;
                        simulatorRef.current.scrollIntoView({ 
                          behavior: "smooth", 
                          block: isMobile ? "start" : "center" 
                        });
                      }
                    }, 50);
                  }
                  setActiveStep("sensors"); // Re-cascade back to stage 1 instantly
                }}
                className={`group relative flex flex-col text-left p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? "border-sky-500 bg-sky-500/[0.04] text-white shadow-lg"
                    : "border-slate-850 bg-slate-950/25 text-slate-500 hover:text-slate-200 hover:border-slate-755 hover:border-slate-750 hover:bg-slate-950/65"
                }`}
              >
                {/* Active marker sidebar keyline stripe */}
                <div className={`absolute top-0 bottom-0 left-0 w-[3px] bg-sky-500 transition-transform duration-300 ${
                  isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                }`} />

                <div className="flex justify-between items-start mb-2 border-b border-slate-900/40 pb-2">
                  <span className="font-sans font-black text-xs uppercase tracking-tight text-white group-hover:text-sky-400 transition-colors">
                    {system.label}
                  </span>
                  <span className={`font-mono text-[8px] font-bold tracking-widest text-right ${
                    isActive ? "text-sky-400" : "text-slate-500"
                  }`}>
                    {system.metric}
                  </span>
                </div>

                {/* GENERATED VECTOR SYSTEM LOGIC SCHEMATIC */}
                <div className="flex items-center justify-center my-3 bg-slate-950/60 rounded-xl py-3 px-4 border border-slate-900/50 transition-colors group-hover:border-slate-800/40 relative h-16">
                  {system.id === "mobot" && (
                    <svg className="w-16 h-8 text-sky-450 text-sky-400 opacity-85 group-hover:opacity-100 transition-opacity" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="25" y="22" width="50" height="9" rx="3.5" className="stroke-sky-400 fill-sky-950/10" />
                      <circle cx="34" cy="31" r="4.5" className="stroke-sky-400 fill-[#01050e]" />
                      <circle cx="66" cy="31" r="4.5" className="stroke-sky-400 fill-[#01050e]" />
                      <path d="M50,14 L50,22" className="stroke-sky-400" strokeWidth="1.5" />
                      <circle cx="50" cy="11" r="3" className="stroke-sky-400 fill-sky-400 animate-pulse" />
                      <path d="M35,6 Q50,0 65,6" className="stroke-sky-400/30 animate-pulse" strokeWidth="1" strokeDasharray="3 2" />
                    </svg>
                  )}
                  {system.id === "monitoring" && (
                    <svg className="w-16 h-8 text-indigo-400 opacity-85 group-hover:opacity-100 transition-opacity" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22,33 A30,30 0 0,1 78,33" className="stroke-slate-800" strokeWidth="1" />
                      <line x1="50" y1="12" x2="50" y2="33" className="stroke-indigo-400" strokeWidth="1.5" />
                      <circle cx="50" cy="11" r="3.5" className="stroke-indigo-400 fill-[#01050e]" />
                      <path d="M36,12 A14,14 0 0,1 64,12" className="stroke-indigo-400/40 animate-pulse" strokeWidth="1" />
                      <path d="M26,12 A24,24 0 0,1 74,12" className="stroke-indigo-400/20" strokeWidth="1.5" strokeDasharray="4 2" />
                    </svg>
                  )}
                  {system.id === "automation" && (
                    <svg className="w-16 h-8 text-emerald-400 opacity-85 group-hover:opacity-100 transition-opacity" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="42" y="28" width="16" height="5" rx="1" className="stroke-emerald-400 fill-[#01050e]" />
                      <path d="M50,28 L35,16" className="stroke-emerald-400" strokeWidth="2" />
                      <circle cx="35" cy="16" r="3" className="stroke-emerald-400 fill-emerald-500" />
                      <path d="M35,16 L58,8" className="stroke-emerald-400" strokeWidth="1.5" />
                      <circle cx="58" cy="8" r="2" className="stroke-emerald-400 fill-[#01050e]" />
                      <path d="M58,8 L65,12" className="stroke-emerald-400" />
                      <circle cx="68" cy="14" r="1" className="stroke-emerald-400 fill-emerald-300 animate-ping" />
                    </svg>
                  )}
                </div>
                
                <span className="font-sans text-[10.5px] text-slate-400 leading-normal group-hover:text-slate-300 transition-colors">
                  {isActive 
                    ? "Active loop simulator dashboard running." 
                    : "Tap to simulate the sensor-controlled feedback sequence."}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FUTURISTIC SPECIFICATION MODAL FOR EDUCATIONAL PRESET COMPONENTS */}
      {selectedExample && (() => {
        const detail = EXAMPLE_DETAILS[selectedExample];
        const imageSrc = EXAMPLE_IMAGES[selectedExample];
        const isAnalog = detail?.signalType?.includes("Analog");
        const isSine = detail?.waveformType === "Sinusoidal";
        
        // Define continuous paths for real-time oscilloscope rendering inside the modal
        const pathD = isSine
          ? "M 0,30 Q 12.5,10 25,30 T 50,30 T 75,30 T 100,30 T 125,30 T 150,30 T 175,30 T 200,30"
          : "M 0,45 L 20,45 L 20,15 L 40,15 L 40,45 L 60,45 L 60,15 L 80,15 L 80,45 L 100,45 L 100,15 L 120,15 L 120,45 L 140,45 L 140,15 L 160,15 L 160,45 L 180,45 L 180,15 L 200,15";
        const waveStrokeColor = isSine ? "stroke-amber-400" : "stroke-cyan-400";
        const waveTextLabel = isSine ? "Sinusoidal Wave Signature" : "Pulse / Square Wave Signature";

        if (typeof document === "undefined") return null;

        return createPortal(
          <div 
            className="fixed inset-0 z-[100000] overflow-hidden bg-slate-950/95 backdrop-blur-md p-2 sm:p-4 flex justify-center items-center" 
            onClick={() => setSelectedExample(null)}
          >
            <div 
              className="w-full max-w-4xl bg-[#030a21] border-2 border-slate-750 rounded-2xl overflow-hidden shadow-[0_0_55px_rgba(56,189,248,0.3)] relative flex flex-col max-h-[96vh] sm:max-h-[92vh] select-none text-left animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scanline beam visual */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-900 pb-4 flex items-start justify-between bg-[#01050e]/45 shrink-0">
                <div>
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-sky-400 bg-sky-950/55 px-2 py-0.5 rounded border border-sky-400/10">
                    {detail?.category.toUpperCase()} DIAGNOSTIC SUITE
                  </span>
                  <h3 className="font-sans font-black text-white text-base sm:text-2xl uppercase tracking-tight mt-1.5">
                    {detail?.name}
                  </h3>
                  <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                    CHIP SPECIFICATION REGISTER: {detail?.model}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedExample(null)}
                  className="font-mono text-[10px] tracking-wider font-extrabold text-slate-400 hover:text-white transition-colors uppercase border border-slate-800 hover:border-slate-750 bg-slate-950/45 px-3 py-1.5 rounded-lg cursor-pointer select-none shrink-0"
                >
                  Close (ESC)
                </button>
              </div>

              {/* Direct Grid Deck - Spec Parameters, Theory & Interactive Oscilloscope Signal waveforms side-by-side */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 select-none bg-[#020612]/20 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-800">
                
                {/* Left Column: Category Spec Parameters & Description Block */}
                <div className="lg:col-span-7 flex flex-col gap-5 text-left">
                  {/* Category description with Image rendering */}
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl relative flex flex-col sm:flex-row gap-4 items-stretch overflow-hidden">
                    <div className="absolute inset-0 bg-[#0c1322]/10 pointer-events-none" />
                    
                    {/* Floating HUD visual label */}
                    <div className="absolute top-2 left-2 font-mono text-[6.5px] text-slate-600">SYS_REGISTER: R_01</div>
                    
                    {/* Image visualizer card wrapper */}
                    <div className="w-full sm:w-1/3 min-h-[100px] flex items-center justify-center bg-slate-950/50 rounded-lg border border-slate-900 relative">
                      <div className="absolute inset-1.5 border border-dashed border-slate-900 rounded pointer-events-none" />
                      {imageSrc ? (
                        <img 
                          src={imageSrc} 
                          alt={detail?.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLDivElement;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                          className="max-h-[85px] max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(56,189,248,0.25)] select-none pointer-events-none rounded animate-fadeIn"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      {/* Fallback svg */}
                      <div className={`w-full h-full flex flex-col items-center justify-center ${imageSrc ? "hidden" : ""}`}>
                        <Cpu className="w-7 h-7 text-indigo-505/20 text-sky-500/20" />
                        <span className="font-mono text-[7px] text-slate-600 uppercase mt-1">CORE MODULE</span>
                      </div>
                    </div>

                    <div className="w-full sm:w-2/3 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[8.5px] text-sky-400 uppercase tracking-widest font-black block mb-1">🔬 SYSTEM OPERATING THEORY & GUIDE</span>
                        <p className="font-sans text-[11px] leading-relaxed text-slate-300 font-normal">
                          {detail?.howItWorks}
                        </p>
                      </div>
                      <div className="mt-2.5 border-t border-slate-900 pt-2 flex justify-between font-mono text-[7.5px] text-slate-500">
                        <span>BUS PROTOCOL: {detail?.signalType}</span>
                        <span className="text-emerald-400 font-extrabold tracking-widest animate-pulse">● CAPTURE RECORD READY</span>
                      </div>
                    </div>
                  </div>

                  {/* Param grid */}
                  <div className="space-y-2">
                    <span className="font-mono text-[8.5px] text-slate-500 uppercase tracking-widest font-black block">📖 Diagnostic Technical Parameters:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {detail?.specs.map((spec, sIdx) => (
                        <div 
                          key={sIdx}
                          className="bg-slate-950 border border-slate-900/80 rounded-xl p-3 flex flex-col justify-between"
                        >
                          <span className="font-mono text-[8.5px] uppercase text-slate-500 tracking-wider">
                            {spec.label}
                          </span>
                          <span className="font-sans font-black text-xs text-white mt-1">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Real-time Signal Oscilloscope Waveform Deck */}
                <div className="lg:col-span-5 flex flex-col gap-4 text-left">
                  <div className="p-4 bg-slate-1000 bg-[#01050a] border border-slate-900 rounded-xl space-y-4 relative flex-1 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[#0a1530]/5 pointer-events-none" />
                    
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                      <span className="font-mono text-[8.5px] text-emerald-400 font-extrabold tracking-widest block uppercase flex items-center gap-1.5 select-none">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> WAVEFORM SIGNAL ANALYZER
                      </span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded border select-none font-bold uppercase ${isSine ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"}`}>
                        {detail?.signalType}
                      </span>
                    </div>

                    <p className="font-sans text-[11px] leading-relaxed text-slate-400">
                      The active sensor is transmitting <strong className={isSine ? "text-amber-400 font-extrabold" : "text-cyan-400 font-extrabold"}>{isSine ? "Sinusoidal" : "Square"}</strong> telemetry waveforms over the localized system bus logic line:
                    </p>

                    {/* Integrated dynamic SVG Grid Scope */}
                    <div className="relative w-full h-[140px] bg-[#01050d] border border-emerald-900/40 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between p-1.5 select-none">
                      {/* Grid overlay lines */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-[0.1] pointer-events-none">
                        {[...Array(24)].map((_, i) => (
                          <div key={i} className="border-r border-b border-emerald-500/30" />
                        ))}
                      </div>

                      {/* Center index line */}
                      <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-emerald-400/20 pointer-events-none" />

                      {/* Moving pulse SVG paths */}
                      <svg className="w-full h-full relative z-10" viewBox="0 0 200 60" preserveAspectRatio="none">
                        {/* Glow Trace */}
                        <path
                          d={pathD}
                          fill="none"
                          className={`${waveStrokeColor} opacity-50 stroke-[3.5] filter blur-[2px]`}
                          style={{
                            strokeDasharray: '400',
                            animation: 'wave-flow 4.2s linear infinite'
                          }}
                        />
                        {/* Sharp core trace line */}
                        <path
                          d={pathD}
                          fill="none"
                          className={`${waveStrokeColor} stroke-2`}
                          style={{
                            strokeDasharray: '400',
                            animation: 'wave-flow 4.2s linear infinite'
                          }}
                        />
                      </svg>

                      {/* Real micro indices details */}
                      <div className="absolute bottom-1.5 right-2 font-mono text-[7px] text-[#10b981]/70 tracking-wider">
                        Hz: {isSine ? "2.50 kHz" : "50.0 Hz"} | AMPLITUDE: 5.0 Vpp
                      </div>
                    </div>

                    {/* Technical details register panel */}
                    <div className="bg-[#02050e]/90 border border-slate-900 rounded-lg p-3 text-left space-y-1.5">
                      <div className="flex justify-between text-[9px] font-mono leading-none">
                        <span className="text-slate-500 uppercase">TELEMETRY TYPE:</span>
                        <span className={isSine ? "text-amber-400 font-bold" : "text-cyan-400 font-bold"}>
                          {isSine ? "ANALOG VOLTAGE VECTOR" : "COORDINATED DIGITAL TRAIN"}
                        </span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono leading-none pt-1">
                        <span className="text-slate-500 uppercase">WAVEFORM PATTERN:</span>
                        <span className={`font-black tracking-wide ${isSine ? "text-amber-400" : "text-cyan-400"}`}>
                          {isSine ? "SINUSOIDAL WAVEFORM" : "SQUARE WAVEFORM"}
                        </span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono leading-none pt-1">
                        <span className="text-slate-550 text-slate-500">BUS INTEGRITY STATUS:</span>
                        <span className="text-emerald-400 font-extrabold animate-pulse">100% OPERATIONAL EXCELLENCE</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#01050e] border-t border-slate-900 flex justify-end shrink-0 select-none">
                <button 
                  onClick={() => setSelectedExample(null)}
                  className="font-mono text-[10px] tracking-widest font-extrabold text-[#f1f5f9] hover:text-white transition-colors bg-sky-950/80 hover:bg-sky-900/90 border border-sky-850 px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Close Specification Suite
                </button>
              </div>

            </div>
          </div>,
          document.body
        );
      })()}

    </div>
  );
}
