import React, { useState, useEffect } from "react";
import { Eye, Cpu, Zap, ChevronsRight, ChevronsDown, Sparkles, RefreshCw, Camera, Thermometer, Activity, Layers, Bell, Play, Radar, Wifi, Terminal, ArrowUpDown, Volume2, Droplet } from "lucide-react";

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

export default function RoboticsFlowSystem() {
  const [activeId, setActiveId] = useState<RobotTypeId | null>(null);
  const [activeStep, setActiveStep] = useState<"sensors" | "controllers" | "actuators" | null>(null);

  // High-fidelity active sub-examples within the general theory cards
  const [activeSensorEx, setActiveSensorEx] = useState<"camera" | "humidity" | "ultrasonic">("camera");
  const [activeControllerEx, setActiveControllerEx] = useState<"arduino" | "esp32" | "raspberrypi">("arduino");
  const [activeActuatorEx, setActiveActuatorEx] = useState<"servo" | "dc-motor" | "buzzer">("servo");

  // Selected educational hardware element details to view inside the spec sheet modal
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Futuristic diagnostic boot scan state
  const [isDiagnosticActive, setIsDiagnosticActive] = useState<boolean>(true);

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
    if (!activeId) return Zap;
    if (activeId === "mobot") return Play;
    if (activeId === "monitoring") return Bell;
    if (activeId === "automation") return ArrowUpDown;
    return Zap;
  };

  const SensorIcon = getSensorIcon();
  const ControllerIcon = getControllerIcon();
  const ActuatorIcon = getActuatorIcon();

  return (
    <div id="robotics-systems-works-flow" className="w-full bg-[#030919] border border-slate-800/80 rounded-3xl p-5 md:p-10 relative overflow-hidden select-none">
      
      {/* Hyper-glowing interactive CSS animations with soft steady glowing borders & premium aesthetics */}
      <style>{`
        @keyframes pulseBeam {
          0%, 100% { filter: drop-shadow(0 0 10px var(--beam-glow)); opacity: 0.9; }
          50% { filter: drop-shadow(0 0 25px var(--beam-glow-bright)); opacity: 1; }
        }
        @keyframes premonitionH {
          0% { left: -30%; opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { left: 130%; opacity: 0; }
        }
        @keyframes premonitionV {
          0% { top: -30%; opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { top: 130%; opacity: 0; }
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
          0% { left: -25%; }
          100% { left: 125%; }
        }
        .cyber-scanline {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 200px;
          background: linear-gradient(to right, transparent, rgba(56, 189, 248, 0.05) 20%, rgba(99, 102, 241, 0.1) 50%, rgba(16, 185, 129, 0.05) 80%, transparent);
          transform: skewX(-25deg);
          animation: scanline 4.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }
        
        /* Modern glowing border component */
        .cyber-border-card {
          position: relative;
          border-radius: 16px;
          background: #020712;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1.5px solid rgba(148, 163, 184, 0.08);
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
        }
        .animate-premonition-v {
          animation: premonitionV 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

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

      {/* MAIN MONITOR: Aspect Ratio 16:9 on Desktop, auto flow size adaptation on Mobile */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mb-8">
        <div className="w-full rounded-2xl md:rounded-3xl bg-[#01050e] border border-slate-850/80 p-5 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[inset_0_4px_50px_rgba(0,0,0,0.95)] animate-fadeIn aspect-auto md:aspect-video min-h-auto md:min-h-0 gap-6">
          
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
          <div className="flex flex-col md:flex-row items-stretch justify-between w-full my-auto z-10 relative gap-3.5 md:gap-4 lg:gap-6 py-2 md:py-0">
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
                    <div className="p-1.5 rounded-md bg-sky-950/45 border border-sky-500/10">
                      <SensorIcon className={`w-4 h-4 transition-all duration-500 ${activeStep === "sensors" ? "text-sky-400 rotate-12 scale-110" : bootHighlightSensors ? "text-sky-400/80 scale-100" : "text-slate-650"}`} />
                    </div>
                  </div>
                  
                  <p className="font-sans text-[11.5px] leading-relaxed text-slate-350 font-bold select-text mb-4">
                    {systemData.sensorMeta}
                  </p>
                </div>

                {/* 3 EDUCATIONAL EXAMPLES (Visual highlight fade transition) */}
                {activeId === null && (
                  <div className={`transition-all duration-750 ease-in-out ${
                    (activeStep === "sensors") 
                      ? "opacity-100 max-h-[140px] translate-y-0 mt-3 border-t border-slate-900/60 pt-3" 
                      : "opacity-0 max-h-0 -translate-y-2 overflow-hidden mt-0 border-t-0 pt-0 pointer-events-none"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-2.5 h-2.5 text-sky-400 animate-pulse" />
                      <span className="font-mono text-[8px] text-sky-400 uppercase tracking-wider font-extrabold">Active Examples:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("sensors");
                          setActiveSensorEx("camera");
                          setSelectedExample("camera");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1.5 rounded-lg transition-all border cursor-pointer select-none ${
                          activeSensorEx === "camera" 
                            ? "bg-sky-500/20 border-sky-400 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View Camera Specs & Details"
                      >
                        {activeSensorEx === "camera" && <Camera className="w-3 h-3 text-sky-400 animate-pulse" />}
                        <span className="font-sans text-[8.5px] uppercase">Camera</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("sensors");
                          setActiveSensorEx("humidity");
                          setSelectedExample("humidity");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1.5 rounded-lg transition-all border cursor-pointer select-none ${
                          activeSensorEx === "humidity" 
                            ? "bg-sky-500/20 border-sky-400 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View Temp & Humidity Specs & Details"
                      >
                        {activeSensorEx === "humidity" ? <Droplet className="w-3 h-3 text-sky-400 animate-pulse" /> : <Thermometer className="w-3 h-3 text-slate-400" />}
                        <span className="font-sans text-[8.5px] uppercase">Humidity</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("sensors");
                          setActiveSensorEx("ultrasonic");
                          setSelectedExample("ultrasonic");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1.5 rounded-lg transition-all border cursor-pointer select-none ${
                          activeSensorEx === "ultrasonic" 
                            ? "bg-sky-500/20 border-sky-400 text-white font-extrabold shadow-[0_0_12px_rgba(56,189,248,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View Ultrasonic Specs & Details"
                      >
                        {activeSensorEx === "ultrasonic" ? <Radar className="w-3 h-3 text-sky-400 animate-pulse" /> : <Radar className="w-3 h-3 text-slate-400" />}
                        <span className="font-sans text-[8.5px] uppercase">Ultrasonic</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* PIPELINE CONNECTOR 1 (SENSORS ➔ CONTROLLERS) */}
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
                    <div className="p-1.5 rounded-md bg-indigo-950/45 border border-indigo-500/10">
                      <ControllerIcon className={`w-4 h-4 transition-all duration-500 ${activeStep === "controllers" ? "text-indigo-400 scale-110" : bootHighlightControllers ? "text-indigo-400/80 scale-100" : "text-slate-650"}`} />
                    </div>
                  </div>
                  
                  <p className="font-sans text-[11.5px] leading-relaxed text-slate-350 font-bold select-text mb-4">
                    {systemData.controllerMeta}
                  </p>
                </div>

                {/* 3 EDUCATIONAL EXAMPLES (Visual highlight fade transition) */}
                {activeId === null && (
                  <div className={`transition-all duration-750 ease-in-out ${
                    (activeStep === "controllers") 
                      ? "opacity-100 max-h-[140px] translate-y-0 mt-3 border-t border-slate-900/60 pt-3" 
                      : "opacity-0 max-h-0 -translate-y-2 overflow-hidden mt-0 border-t-0 pt-0 pointer-events-none"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
                      <span className="font-mono text-[8px] text-indigo-400 uppercase tracking-wider font-extrabold">Active Examples:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("controllers");
                          setActiveControllerEx("arduino");
                          setSelectedExample("arduino");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1.5 rounded-lg transition-all border cursor-pointer select-none ${
                          activeControllerEx === "arduino" 
                            ? "bg-indigo-500/20 border-indigo-500 text-white font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View Arduino Specs & Details"
                      >
                        {activeControllerEx === "arduino" && <Cpu className="w-3 h-3 text-indigo-400 animate-pulse" />}
                        <span className="font-sans text-[8.5px] uppercase">Arduino</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("controllers");
                          setActiveControllerEx("esp32");
                          setSelectedExample("esp32");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1.5 rounded-lg transition-all border cursor-pointer select-none ${
                          activeControllerEx === "esp32" 
                            ? "bg-indigo-500/20 border-indigo-500 text-white font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View ESP32 Specs & Details"
                      >
                        {activeControllerEx === "esp32" && <Wifi className="w-3 h-3 text-indigo-400" />}
                        <span className="font-sans text-[8.5px] uppercase">ESP32</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("controllers");
                          setActiveControllerEx("raspberrypi");
                          setSelectedExample("raspberrypi");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1.5 rounded-lg transition-all border cursor-pointer select-none ${
                          activeControllerEx === "raspberrypi" 
                            ? "bg-indigo-500/20 border-indigo-500 text-white font-extrabold shadow-[0_0_12px_rgba(99,102,241,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View Raspberry Pi Specs & Details"
                      >
                        {activeControllerEx === "raspberrypi" && <Terminal className="w-3 h-3 text-indigo-400" />}
                        <span className="font-sans text-[8.5px] uppercase">Rasp. Pi</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* PIPELINE CONNECTOR 2 (CONTROLLERS ➔ ACTUATORS) */}
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
                    <div className="p-1.5 rounded-md bg-emerald-950/45 border border-emerald-500/10">
                      <ActuatorIcon className={`w-4 h-4 transition-all duration-500 ${activeStep === "actuators" ? "text-emerald-400 scale-110 animate-pulse" : bootHighlightActuators ? "text-emerald-400/80 scale-100" : "text-slate-650"}`} />
                    </div>
                  </div>
                  
                  <p className="font-sans text-[11.5px] leading-relaxed text-slate-350 font-bold select-text mb-4">
                    {systemData.actuatorMeta}
                  </p>
                </div>

                {/* 3 EDUCATIONAL EXAMPLES (Visual highlight fade transition) */}
                {activeId === null && (
                  <div className={`transition-all duration-750 ease-in-out ${
                    (activeStep === "actuators") 
                      ? "opacity-100 max-h-[140px] translate-y-0 mt-3 border-t border-slate-900/60 pt-3" 
                      : "opacity-0 max-h-0 -translate-y-2 overflow-hidden mt-0 border-t-0 pt-0 pointer-events-none"
                  }`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                      <span className="font-mono text-[8px] text-emerald-400 uppercase tracking-wider font-extrabold">Active Examples:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("actuators");
                          setActiveActuatorEx("servo");
                          setSelectedExample("servo");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1 text-center rounded-lg transition-all border cursor-pointer select-none ${
                          activeActuatorEx === "servo" 
                            ? "bg-emerald-500/20 border-emerald-500 text-white font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View Servo Specs & Details"
                      >
                        {activeActuatorEx === "servo" && <Play className="w-3 h-3 text-emerald-400 animate-pulse" />}
                        <span className="font-sans text-[8.5px] uppercase">Servo</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("actuators");
                          setActiveActuatorEx("dc-motor");
                          setSelectedExample("dc-motor");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1 text-center rounded-lg transition-all border cursor-pointer select-none ${
                          activeActuatorEx === "dc-motor" 
                            ? "bg-emerald-500/20 border-emerald-500 text-white font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View DC Motor Specs & Details"
                      >
                        {activeActuatorEx === "dc-motor" && <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />}
                        <span className="font-sans text-[8.5px] uppercase">DC Motor</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDiagnosticActive(false);
                          setActiveStep("actuators");
                          setActiveActuatorEx("buzzer");
                          setSelectedExample("buzzer");
                        }}
                        className={`flex items-center justify-center gap-1.5 p-1 px-1 text-center rounded-lg transition-all border cursor-pointer select-none ${
                          activeActuatorEx === "buzzer" 
                            ? "bg-emerald-500/20 border-emerald-500 text-white font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.2)]" 
                            : "bg-slate-950/25 border-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-950/45"
                        }`}
                        title="View Buzzer Specs & Details"
                      >
                        {activeActuatorEx === "buzzer" && <Volume2 className="w-3 h-3 text-emerald-400" />}
                        <span className="font-sans text-[8.5px] uppercase">Buzzer</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

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
      <div className="relative z-10 w-full max-w-5xl mx-auto border-t border-slate-900/40 pt-6">
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
              }}
              className="font-mono text-[9px] text-cyan-400 font-extrabold tracking-wider hover:text-cyan-300 transition-colors uppercase cursor-pointer flex items-center gap-1.5 bg-cyan-950/45 border border-cyan-500/20 px-2.5 py-1 rounded-md animate-pulse"
              title="Activate full loop synchronization, highlighting all 3 basic robotics components together"
            >
              <Activity className="w-2.5 h-2.5 text-cyan-450 text-cyan-400" />
              Sync Co-System Loop
            </button>

            {/* Return button back to the clean general theory view */}
            {activeId && (
              <button
                onClick={() => {
                  setActiveId(null);
                  setActiveStep("sensors");
                }}
                className="font-mono text-[9px] text-sky-450 text-sky-400 font-black tracking-wider hover:text-sky-300 transition-colors uppercase cursor-pointer flex items-center gap-1.5 bg-sky-950/40 border border-sky-400/10 px-2.5 py-1 rounded-md animate-fadeIn"
              >
                <RefreshCw className="w-2.5 h-2.5" />
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
      {selectedExample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#01040a]/85 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedExample(null)}>
          <div 
            className="w-full max-w-2xl bg-[#030919] border border-slate-800/90 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.15)] relative flex flex-col max-h-[90vh] md:max-h-[85vh] animate-slideUp text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top scanning bar light effect */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-900 pb-4 flex items-start justify-between">
              <div>
                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-400/10">
                  {EXAMPLE_DETAILS[selectedExample]?.category.toUpperCase()} SPECIFICATION
                </span>
                <h3 className="font-sans font-black text-white text-lg md:text-xl uppercase tracking-tight mt-1">
                  {EXAMPLE_DETAILS[selectedExample]?.name}
                </h3>
                <span className="font-mono text-[10px] text-slate-500 font-extrabold uppercase tracking-wide">
                  HARDWARE COMPONENT ID: {EXAMPLE_DETAILS[selectedExample]?.model}
                </span>
              </div>
              <button 
                onClick={() => setSelectedExample(null)}
                className="font-mono text-[10px] tracking-wider font-extrabold text-slate-400 hover:text-white transition-colors uppercase border border-slate-800 hover:border-slate-700 bg-slate-950/45 px-2.5 py-1 rounded-md cursor-pointer select-none"
              >
                Close ESC
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              
              {/* Photo Showcase (The Real Component Photo with Tech HUD design) */}
              <div className="relative rounded-xl border border-slate-900 overflow-hidden bg-[#01050e] flex flex-col md:flex-row items-stretch min-h-[190px]">
                
                {/* Tech HUD Grid and Scope Crosshairs */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                <div className="absolute top-2 left-2 font-mono text-[7px] text-slate-600">SYSTEM COORD: SPEC_02</div>
                <div className="absolute bottom-2 right-2 font-mono text-[7px] text-slate-600">RESOLUTION: UHD_512</div>
                
                {/* Radar Line Sweep Animation Overlay */}
                <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-sky-400 opacity-20 shadow-[0_0_8px_cyan] animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
                
                {/* Image showcase wrapper */}
                <div className="w-full md:w-2/5 min-h-[150px] bg-slate-950 relative flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-900/45">
                  <div className="absolute inset-3 border border-slate-900/30 rounded pointer-events-none" />
                  <img 
                    src={EXAMPLE_IMAGES[selectedExample]} 
                    alt={EXAMPLE_DETAILS[selectedExample]?.name}
                    className="max-h-[130px] max-w-full object-contain filter drop-shadow-[0_4px_20px_rgba(56,189,248,0.25)] select-none pointer-events-none rounded"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle technical scale metric marker */}
                  <div className="absolute bottom-2 left-2 text-[7px] font-mono text-emerald-400 border border-emerald-500/10 px-1 bg-emerald-950/45 rounded">
                    REAL PHOTO
                  </div>
                </div>

                {/* Scope specs summary */}
                <div className="w-full md:w-3/5 p-4.5 flex flex-col justify-between bg-slate-950/20">
                  <div>
                    <span className="font-mono text-[8.5px] text-sky-400 uppercase tracking-widest font-black block mb-1">
                      🔬 Physical Characteristics
                    </span>
                    <p className="font-sans text-[11px] leading-relaxed text-slate-300 select-text">
                      {EXAMPLE_DETAILS[selectedExample]?.howItWorks}
                    </p>
                  </div>
                  
                  {/* Test Pin Signal interaction area rebranded to Signal Analysis */}
                  <div className="mt-3.5 border-t border-slate-900/60 pt-3">
                    <span className="font-mono text-[8.5px] text-sky-400 uppercase tracking-widest font-black block mb-2">
                      ⚡ Signal Analysis
                    </span>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-[#020716] border border-slate-900 rounded-lg p-2.5 flex flex-col justify-between min-h-[48px]">
                        <span className="font-mono text-[7px] text-slate-500 uppercase">Domain Type</span>
                        <span className={`font-sans font-black text-[11px] uppercase mt-0.5 ${
                          EXAMPLE_DETAILS[selectedExample]?.signalType?.includes("Analog") ? "text-amber-400" : "text-cyan-400"
                        }`}>
                          {EXAMPLE_DETAILS[selectedExample]?.signalType}
                        </span>
                      </div>
                      <div className="bg-[#020716] border border-slate-900 rounded-lg p-2.5 flex flex-col justify-between min-h-[48px]">
                        <span className="font-mono text-[7px] text-slate-500 uppercase">Waveform Signature</span>
                        <span className="font-sans font-black text-[11px] uppercase text-emerald-450 text-emerald-450 text-emerald-450 text-emerald-400 mt-0.5">
                          {EXAMPLE_DETAILS[selectedExample]?.waveformType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-slate-950/45 p-2 rounded-xl border border-slate-900/60">
                      <button
                        onClick={() => {
                          setIsSimulating(true);
                          setTimeout(() => setIsSimulating(false), 2400);
                        }}
                        className="font-mono text-[8.5px] font-black tracking-widest uppercase bg-sky-950/50 hover:bg-sky-900/40 text-sky-400 border border-sky-400/20 px-3 py-1.5 rounded-lg cursor-pointer transition-colors active:scale-95 flex items-center gap-1.5"
                      >
                        <Activity className="w-3 h-3 text-sky-400 animate-pulse" />
                        {isSimulating ? "ANALYZING SIGNAL..." : "RUN SIGNAL ANALYSIS"}
                      </button>
                      
                      <span className="font-sans text-[8px] text-slate-500 font-bold block pr-1 leading-none">
                        STATUS: {isSimulating ? "● SCANNING" : "● STANDBY"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Simulated Waveform or binary stream logic scanner */}
              {isSimulating && (
                <div className="bg-[#020714] border border-sky-500/20 rounded-xl p-3.5 animate-pulse">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[8.5px] text-sky-400 tracking-wider">LOGIC OSCILLOSCOPE FEEDBACK [ACTIVE TEST STATE]</span>
                    <span className="font-mono text-[8.5px] text-emerald-400">STATUS: CAPTURING PULSES</span>
                  </div>
                  
                  {/* High Quality Real waveform rendering simulation */}
                  <div className="h-10 flex items-end justify-around gap-[2px] bg-[#01040a] rounded-lg p-1.5 border border-slate-900">
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const wave = EXAMPLE_DETAILS[selectedExample]?.waveformType;
                      let heightPct = 10;
                      
                      if (wave === "Sinusoidal") {
                        // Perfect sine wave representation
                        const angle = (idx / 23) * Math.PI * 4; // 2 complete periods
                        heightPct = Math.round(((Math.sin(angle) + 1) / 2) * 80 + 15);
                      } else if (wave === "Square Wave") {
                        // Perfect square wave representation
                        const step = Math.floor(idx / 4) % 2;
                        heightPct = step === 0 ? 90 : 15;
                      } else {
                        // Complex packets representation (Digital waves / pulses)
                        const packetHeights = [20, 90, 15, 15, 90, 20, 20, 90, 90, 15, 90, 15, 20, 90, 15, 90, 20, 15, 90, 90, 15, 20, 90, 15];
                        heightPct = packetHeights[idx % packetHeights.length];
                      }
                      
                      return (
                        <div 
                          key={idx} 
                          className={`w-1.5 md:w-2 rounded-t transition-all duration-300 ${
                            wave === "Sinusoidal" ? "bg-amber-400" :
                            wave === "Square Wave" ? "bg-cyan-400" :
                            "bg-emerald-400"
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-2 font-mono text-[7px] text-slate-500">
                    <span>DOMAIN: {EXAMPLE_DETAILS[selectedExample]?.signalType?.toUpperCase()}</span>
                    <span>BAUD SYSTEM: {EXAMPLE_DETAILS[selectedExample]?.signalType === "Analog" ? "CONTINUOUS SIGNAL" : "115200 BPS SERIAL"}</span>
                  </div>
                </div>
              )}

              {/* Specifications Bento Grid */}
              <div>
                <span className="font-mono text-[8.5px] text-slate-500 uppercase tracking-widest font-black block mb-2.5">
                  📖 Complete Technical Data Sheet
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EXAMPLE_DETAILS[selectedExample]?.specs.map((spec, sIdx) => (
                    <div 
                      key={sIdx}
                      className="bg-slate-950/35 border border-slate-900 rounded-xl p-2.5 flex flex-col justify-between"
                    >
                      <span className="font-mono text-[8.5px] uppercase text-slate-500 tracking-wider">
                        {spec.label}
                      </span>
                      <span className="font-sans font-extrabold text-[11px] text-white mt-1">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/45 border-t border-slate-900 flex justify-end">
              <button 
                onClick={() => setSelectedExample(null)}
                className="font-mono text-[10px] tracking-widest font-extrabold text-white bg-sky-950 hover:bg-sky-900 transition-colors uppercase px-4 py-2 rounded-xl cursor-pointer"
              >
                Close Spec Sheet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
