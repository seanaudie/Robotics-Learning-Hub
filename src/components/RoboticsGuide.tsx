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
  Layers,
  Thermometer
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
  const [activeElectSubTab, setActiveElectSubTab] = useState<"ohms" | "circuits">("ohms");
  const [isOhmsModalOpen, setIsOhmsModalOpen] = useState<boolean>(false);
  const [ohmsHighlightItem, setOhmsHighlightItem] = useState<"voltage" | "resistance" | "current">("voltage");
  const [ohmsVoltage, setOhmsVoltage] = useState<number>(5.0); // 0-12V
  const [ohmsResistance, setOhmsResistance] = useState<number>(220); // 100-1000 ohms
  const [isSeriesCut, setIsSeriesCut] = useState<boolean>(false);
  const [isParallel1Cut, setIsParallel1Cut] = useState<boolean>(false);
  const [isParallel2Cut, setIsParallel2Cut] = useState<boolean>(false);

  // Flowchart animation state
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);

  // Rapid 30fps continuous animation tick state for mechatronic visualizers
  const [simTick, setSimTick] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimTick((prev) => (prev + 1) % 12000);
      
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
                  STEM Electronics Academy
                </span>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-[#f8fafc] tracking-tight">
                  BASIC ELECTRONICS LAB
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
                              <p className="text-indigo-305 transition-colors duration-150 bg-indigo-500/5 px-1 rounded">
                                <span className="text-[#f43f5e]">int</span> distance = <span className="text-sky-400 font-extrabold">{userDistance}</span>; <span className="text-slate-655 text-[9.5px]">// updated dynamically</span>
                              </p>
                              <p className="text-emerald-305 transition-colors duration-150 bg-emerald-500/5 px-1 rounded">
                                <span className="text-[#f43f5e]">bool</span> obstacleDetected = <span className="text-emerald-400 font-extrabold">{userDistance < 20 ? "true" : "false"}</span>;
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2 text-slate-400">
                              <span className="text-slate-600 block">// Registers Thermistor temperature coefficient parameters</span>
                              <p><span className="text-[#f43f5e]">const int</span> thermistorPin = <span className="text-indigo-400">A1</span>;</p>
                              <p className="text-indigo-305 transition-colors duration-150 bg-indigo-500/5 px-1 rounded">
                                <span className="text-[#f43f5e]">float</span> tempSensorVal = <span className="text-[#38bdf8] font-bold">{tempSensorValue.toFixed(1)}</span>; <span className="text-slate-655 text-[9.5px]">// Float storing decimel levels</span>
                              </p>
                              <p className="text-emerald-305 transition-colors duration-150 bg-emerald-500/5 px-1 rounded">
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
                              <p className={`pl-4 py-1.5 transition-all rounded ${lightRawADC < 400 ? "bg-amber-500/15 text-amber-300 font-bold shadow-[inset_2px_0_0_#f59e0b]" : "text-slate-600 opacity-30"}`}>
                                digitalWrite(streetlampLED, HIGH); <span className="text-[9px] font-sans italic opacity-60">// streetlight ON</span>
                              </p>
                              <p className="text-slate-200">&#125; <span className="text-[#f43f5e] font-bold">else</span> &#123;</p>
                              <p className={`pl-4 py-1.5 transition-all rounded ${lightRawADC >= 400 ? "bg-indigo-500/15 text-indigo-300 font-bold shadow-[inset_2px_0_0_#6366f1]" : "text-slate-600 opacity-30"}`}>
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
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 0 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                                <span className="text-[#f43f5e]">int</span> r = analogRead(A0); <span className="text-[9.5px] font-sans opacity-60">// Acquisition (read raw input)</span>
                              </p>
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 1 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                                <span className="text-[#f43f5e]">float</span> val = r * <span className="text-indigo-400">0.12</span>; <span className="text-[9.5px] font-sans opacity-60">// Calibration (scale inputs)</span>
                              </p>
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 2 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                                checkThresholdFlags(val); <span className="text-[9.5px] font-sans opacity-60">// Decision (verify logic)</span>
                              </p>
                              <p className={`pl-4 py-0.5 rounded transition-all ${loopPlayCycle === 3 ? "bg-emerald-500/10 text-emerald-300 font-bold" : "text-slate-650"}`}>
                                digitalWrite(motor, HIGH); <span className="text-[9.5px] font-sans opacity-60">// Output (action trigger)</span>
                              </p>
                              <p className="pl-4 text-slate-600">delay(<span className="text-indigo-400 font-bold">{[2800, 1000, 180][loopFrequencySelected]}</span>); <span className="text-[9.5px] font-sans opacity-60">// Sleep interval</span></p>
                              <p className="text-[#a855f7]">&#125;</p>
                            </div>
                          ) : (
                            <div className="space-y-0.5 text-slate-400">
                              <p className="text-[#a855f7]"><span className="text-[#f43f5e] font-bold">void</span> <span className="text-white font-bold">loop</span>() &#123;</p>
                              <p className="pl-4 text-slate-600">// Cycles angle value registers in sequence loops</p>
                              <p className="pl-4 py-0.5 rounded transition-indigo bg-indigo-500/10 text-indigo-3 w-max">
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
{activeCase.id === "obstacle_avoidance" ? `if (distance < 15) {
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

            {/* Interactive Popup Modal for Shape Logic Guides */}
            <AnimatePresence>
              {showGlossaryModal && selectedShape && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm shadow-2xl" id="flowchart-glossary-modal">
                  <div className="absolute inset-0 cursor-pointer" onClick={() => setShowGlossaryModal(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    className="relative w-full max-w-md rounded-3xl border border-indigo-500/20 bg-slate-900 p-6 shadow-2xl space-y-4 text-left z-10"
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
                            <pre className="font-mono text-xs text-slate-350 leading-relaxed overflow-x-auto whitespace-pre">
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
                          <h4 className="font-sans font-extrabold text-sm text-pink-400 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-3 h-2.5 border border-pink-500 bg-pink-500/10 -skew-x-12 shrink-0" />
                            Input / Output Logic Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Reads digital/analog inputs from physical pins or writes commands directly to active components. Denotes data interactions. An **Input** reads raw parameters from physical pins (such as distance or pressure intensity). An **Output** changes component states by writing logical High/Low signals.
                          </p>
                          <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800/80">
                            <span className="font-mono text-[9px] text-pink-400 uppercase font-semibold block mb-1">C++ Firmware Equivalent</span>
                            <pre className="font-mono text-xs text-slate-350 leading-relaxed overflow-x-auto whitespace-pre">
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
                          <h4 className="font-sans font-extrabold text-sm text-purple-400 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-3 h-2 border border-purple-500 bg-purple-500/10 rounded shrink-0" />
                            Computation Process Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Calculates metric math, coordinates variables updates, scales levels, or triggers timers. Processes represent raw operational work. Use them to write arithmetic equations, calculate speed loops, scale sensor voltages, or wait for time delays.
                          </p>
                          <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800/80">
                            <span className="font-mono text-[9px] text-purple-400 uppercase font-semibold block mb-1">C++ Firmware Equivalent</span>
                            <pre className="font-mono text-xs text-slate-350 leading-relaxed overflow-x-auto whitespace-pre">
{`float dist = (pulseMs * 0.0343) / 2.0;
delay(250); // Pause execution`}
                            </pre>
                          </div>
                        </>
                      )}

                      {selectedShape === "diamond" && (
                        <>
                          <h4 className="font-sans font-extrabold text-sm text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-2.5 h-2.5 border border-yellow-500 bg-yellow-500/10 rotate-45 shrink-0" />
                            Decision Forks Guide
                          </h4>
                          <p className="font-sans text-xs text-slate-300 leading-relaxed">
                            Checks boolean comparisons. Splits flow of direction based on True / False outputs. Splits flowchart into parallel executions. Compares values against conditional limits. Branching pathways must always be clearly labeled **YES (True)** or **NO (False)**.
                          </p>
                          <div className="rounded-xl bg-[#030712] p-3.5 border border-slate-800/80">
                            <span className="font-mono text-[9px] text-yellow-550 uppercase font-semibold block mb-1">C++ Firmware Equivalent</span>
                            <pre className="font-mono text-xs text-slate-350 leading-relaxed overflow-x-auto whitespace-pre">
{activeCase.id === "obstacle_avoidance" ? `if (distance < 15) {
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
}`}
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
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md" id="control-loop-specs-modal">
                    <div className="absolute inset-0 cursor-pointer" onClick={() => setShowControlLoopModal(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ type: "spring", duration: 0.4 }}
                      className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-indigo-500/20 bg-slate-950 p-6 md:p-8 shadow-2xl space-y-6 text-left z-10"
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
                                {detail.code}
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
                  { id: "circuits", label: "Circuits (Series vs Parallel)", desc: "Build connections and break wire routes to see behaviors", icon: Layers }
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

                            {/* Solid flowing path with dynamic solid particles (no broken lines) */}
                            {/* The current coming from the battery is stable and only thins/narrows after passing through the resistor at x=90 */}
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

                            {/* Post-resistor segment: starting from inside resistor all the way back to battery negative (x=10, y=66) */}
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
                              {/* Text description nestled inside circuit loop */}
                              <text x="24" y="52" textAnchor="start" className="fill-indigo-400 font-mono text-[8px] font-extrabold">{ohmsVoltage.toFixed(1)}V Battery</text>
                            </g>

                            {/* Transparent Resistor Tube on top side centered at x=110, y=10 */}
                            <g>
                              {/* Outer transparent capsule shell */}
                              <rect x="90" y="2" width="40" height="16" rx="3.5" fill="rgba(30, 41, 59, 0.4)" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
                              
                              {/* Active dual-squeezing mechanical restrictor jaws that widen/narrow dynamically to block the channel */}
                              {/* Top squeezing restrictor plate */}
                              <path 
                                d={`M 90,2 Q 110,${10 - ohmsNeckSpacing/2} 130,2 L 130,1 L 90,1 Z`} 
                                fill="rgba(239, 68, 68, 0.35)"
                                stroke="#ef4444" 
                                strokeWidth="0.65" 
                                style={{
                                  animation: `throatThrobTop ${ohmsVibeDuration} ease-in-out infinite alternate`,
                                  transformOrigin: "center top",
                                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                  opacity: 0.3 + ohmsConstrictionFactor * 0.7,
                                  "--ohms-vibe-y": ohmsVibeY
                                } as React.CSSProperties}
                              />
                              
                              {/* Bottom squeezing restrictor plate */}
                              <path 
                                d={`M 90,18 Q 110,${10 + ohmsNeckSpacing/2} 130,18 L 130,19 L 90,19 Z`} 
                                fill="rgba(239, 68, 68, 0.35)"
                                stroke="#ef4444" 
                                strokeWidth="0.65" 
                                style={{
                                  animation: `throatThrobBottom ${ohmsVibeDuration} ease-in-out infinite alternate`,
                                  transformOrigin: "center bottom",
                                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                  opacity: 0.3 + ohmsConstrictionFactor * 0.7,
                                  "--ohms-vibe-y": ohmsVibeY
                                } as React.CSSProperties}
                              />

                              {/* Inside wall indicators of resistance channel width inside the tube */}
                              <line x1="90" y1={4 + (ohmsResistance / 250)} x2="130" y2={4 + (ohmsResistance / 250)} stroke="rgba(56, 189, 248, 0.15)" strokeWidth="0.5" />
                              <line x1="90" y1={16 - (ohmsResistance / 250)} x2="130" y2={16 - (ohmsResistance / 250)} stroke="rgba(56, 189, 248, 0.15)" strokeWidth="0.5" />

                              {/* Physical resistance obstacles (atoms/particles) inside the transparent capsule */}
                              {Array.from({ length: Math.round(ohmsResistance / 45) }).map((_, idx) => {
                                // Deterministic coordinates based on index so they don't jump around
                                const factorX = Math.abs(Math.sin((idx + 1) * 451.7));
                                const factorY = Math.abs(Math.cos((idx + 1) * 883.3));
                                const ox = 93 + factorX * 34; // fits inside [93, 127]
                                const oy = 5.5 + factorY * 9;  // fits inside [5.5, 14.5]
                                return (
                                  <circle 
                                    key={idx} 
                                    cx={ox} 
                                    cy={oy} 
                                    r="1.2" 
                                    fill="#ef4444" 
                                    stroke="#7f1d1d" 
                                    strokeWidth="0.3" 
                                    className={ohmsResistance > 500 ? "animate-pulse" : ""}
                                  />
                                );
                              })}

                              {/* Text label coordinates placed neatly inside the circuit loop at y=33 */}
                              <text x="110" y="32" textAnchor="middle" className="fill-emerald-400 font-mono text-[8.5px] font-extrabold">{ohmsResistance}Ω</text>
                              <text x="110" y="40" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">
                                {ohmsResistance > 700 
                                  ? "DENSE ATOMS: Jaws squeeze tight to resist current!" 
                                  : ohmsResistance < 300 
                                    ? "WIDE OPEN: Jaws widen, letting current pass easily!" 
                                    : "MODERATE SQUEEZE: Jaws throttle balanced current!"}
                              </text>
                            </g>
                          </svg>

                          <style>{`
                            @keyframes glowingPulse {
                              0% { opacity: 0.55; }
                              100% { opacity: 0.95; }
                            }
                            @keyframes dash {
                              to {
                                stroke-dashoffset: -46;
                              }
                            }
                            @keyframes throatThrobTop {
                              0% { transform: translateY(0); }
                              100% { transform: translateY(var(--ohms-vibe-y, 0px)); }
                            }
                            @keyframes throatThrobBottom {
                              0% { transform: translateY(0); }
                              100% { transform: translateY(calc(-1 * var(--ohms-vibe-y, 0px))); }
                            }
                          `}</style>

                          <div className="text-center font-mono text-[9px]">
                            {isPinBlown ? (
                              <div className="text-rose-400 font-extrabold animate-bounce bg-rose-955/20 border border-rose-900/50 p-1.5 rounded-lg">
                                BURNOUT WARNING! Continuous pin margin exceeded (40.0 mA). Add path resistance!
                              </div>
                            ) : (
                              <div className="text-slate-400">
                                Electron flow index: <span className="text-[#10b981] font-bold">Stable & Operational [OK]</span>
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
                          Series vs Parallel Connections
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
              </AnimatePresence>

            </div>
          </div>
        </div>
      )}

      {/* Ohm's Law Highly Interactive Educational Modal Overlay */}
      {isOhmsModalOpen && (
        <div className="fixed inset-0 z-[100005] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md shadow-2xl overflow-y-auto">
          <div 
            className="bg-[#030919] border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.25)] relative my-auto p-4 md:p-8 animate-slideUp text-left flex flex-col gap-6"
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

                    {/* Resistor body layout at x=90, y=2 */}
                    <g className="transition-all duration-300" style={{ transformOrigin: "110px 10px" }}>
                      <rect 
                        x="90" 
                        y="2" 
                        width="40" 
                        height="16" 
                        rx="3.5" 
                        fill={ohmsHighlightItem === "resistance" ? "#064e3b" : "rgba(30, 41, 59, 0.4)"} 
                        stroke={ohmsHighlightItem === "resistance" ? "#34d399" : "#38bdf8"} 
                        strokeWidth={ohmsHighlightItem === "resistance" ? "1.5" : "1.2"} 
                        strokeDasharray="1.5 1.5" 
                      />
                      
                      {/* Top restrictor jaws */}
                      <path 
                        d={`M 90,2 Q 110,${10 - ohmsNeckSpacing/2} 130,2 L 130,1 L 90,1 Z`} 
                        fill="rgba(239, 68, 68, 0.35)"
                        stroke="#ef4444" 
                        strokeWidth="0.65" 
                        style={{
                          animation: `throatThrobTop ${ohmsVibeDuration} ease-in-out infinite alternate`,
                          transformOrigin: "center top",
                          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          opacity: 0.3 + ohmsConstrictionFactor * 0.7,
                          "--ohms-vibe-y": ohmsVibeY
                        } as React.CSSProperties}
                      />
                      
                      {/* Bottom limit jaws */}
                      <path 
                        d={`M 90,18 Q 110,${10 + ohmsNeckSpacing/2} 130,18 L 130,19 L 90,19 Z`} 
                        fill="rgba(239, 68, 68, 0.35)"
                        stroke="#ef4444" 
                        strokeWidth="0.65" 
                        style={{
                          animation: `throatThrobBottom ${ohmsVibeDuration} ease-in-out infinite alternate`,
                          transformOrigin: "center bottom",
                          transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                          opacity: 0.3 + ohmsConstrictionFactor * 0.7,
                          "--ohms-vibe-y": ohmsVibeY
                        } as React.CSSProperties}
                      />

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

    </div>
  );
}
