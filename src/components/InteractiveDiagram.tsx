import React, { useState } from "react";
import { ROBOTIC_PARTS } from "../data";
import { RoboticPart } from "../types";
import { Settings, Eye, HelpCircle, Activity, ZoomIn, Camera, Layers, Terminal, Info } from "lucide-react";

// Generated and high-quality premium image reference resolver
export const getRealImagePath = (partId: string) => {
  if (partId === "controller_arduino") {
    return "/src/assets/images/photo_arduino_uno_1779705012697.png";
  }
  if (partId === "actuator_servo_sg90") {
    return "/src/assets/images/photo_servo_sg90_1779705035399.png";
  }
  if (partId === "sensor_ultrasonic") {
    return "/src/assets/images/photo_ultrasonic_hcsr04_1779705055934.png";
  }
  if (partId === "controller_esp32") {
    return "/src/assets/images/photo_esp32_dev_module_1779710601750.png";
  }
  if (partId === "controller_driver_l298n") {
    return "/src/assets/images/photo_l298n_driver_1779710618145.png";
  }
  if (partId === "actuator_dc_geared") {
    return "/src/assets/images/photo_dc_geared_motor_1779710634180.png";
  }
  if (partId === "actuator_stepper") {
    return "/src/assets/images/photo_stepper_nema17_1779710651874.png";
  }
  if (partId === "sensor_imu_mpu6050") {
    return "/src/assets/images/photo_mpu6050_imu_1779710668096.png";
  }
  if (partId === "sensor_camera") {
    return "/src/assets/images/photo_ai_camera_1779710685980.png";
  }
  if (partId === "controller_raspberry_pi") {
    return "/src/assets/images/photo_raspberry_pi_4_1779710701747.png";
  }
  if (partId === "controller_jetson_nano") {
    return "/src/assets/images/jetson_nano_board_1779719349085.png";
  }
  if (partId === "controller_driver_pca9685") {
    return "/src/assets/images/photo_pca9685_driver_1779710726288.png";
  }
  if (partId === "actuator_buzzer") {
    return "/src/assets/images/photo_piezo_buzzer_1779710740204.png";
  }
  if (partId === "sensor_ir_tracker") {
    return "/src/assets/images/photo_ir_line_tracker_1779710756301.png";
  }
  if (partId === "comm_bluetooth_hc05") {
    return "/src/assets/images/hc05_bluetooth_1779715651558.png";
  }
  if (partId === "comm_wifi_esp8266") {
    return "/src/assets/images/esp8266_wifi_1779715669827.png";
  }
  if (partId === "comm_rf_nrf24l01") {
    return "/src/assets/images/nrf24l01_rf_1779715690979.png";
  }
  if (partId === "display_lcd1602") {
    return "/src/assets/images/lcd1602_display_1779715710415.png";
  }
  if (partId === "display_oled_ssd1306") {
    return "/src/assets/images/oled_ssd1306_1779715732815.png";
  }
  if (partId === "display_seven_segment") {
    return "/src/assets/images/seven_segment_1779715750541.png";
  }
  if (partId === "display_led_matrix") {
    return "/src/assets/images/led_matrix_8x8_1779715769200.png";
  }
  if (partId === "controller_driver_l293d") {
    return "/src/assets/images/l293d_driver_1779715791461.png";
  }
  if (partId === "controller_driver_a4988") {
    return "/src/assets/images/a4988_driver_1779715809626.png";
  }

  // Precise category fallback mappings to present accurate real-world imagery
  if (partId.includes("ir_obstacle")) {
    return "/src/assets/images/ir_obstacle_sensor_1779715091776.png"; 
  }
  if (partId.includes("pir_motion")) {
    return "/src/assets/images/pir_motion_sensor_1779715107698.png"; 
  }
  if (partId.includes("dht11") || partId.includes("dht22")) {
    return "/src/assets/images/dht11_sensor_1779715125828.png"; 
  }
  if (partId.includes("soil_moisture")) {
    return "/src/assets/images/soil_sensor_1779715000497.png"; 
  }
  if (partId.includes("rain")) {
    return "/src/assets/images/rain_sensor_1779715018808.png"; 
  }
  if (partId.includes("gas_mq")) {
    return "/src/assets/images/gas_sensor_1779715036404.png"; 
  }
  if (partId.includes("ldr")) {
    return "/src/assets/images/ldr_sensor_1779715142029.png"; 
  }
  if (partId.includes("sound")) {
    return "/src/assets/images/sound_sensor_1779716229525.png";
  }
  if (partId.includes("microphone")) {
    return "/src/assets/images/microphone_sensor_1779716245071.png";
  }
  if (partId.includes("tilt")) {
    return "/src/assets/images/tilt_sensor_1779716261672.png";
  }
  if (partId.includes("vibration")) {
    return "/src/assets/images/vibration_sensor_1779716277149.png";
  }
  if (partId.includes("rfid")) {
    return "/src/assets/images/rfid_module_1779715158711.png"; 
  }
  if (partId.includes("fingerprint")) {
    return "/src/assets/images/fingerprint_sensor_1779715241503.png"; 
  }
  if (partId.includes("button")) {
    return "/src/assets/images/push_button_sensor_1779716293602.png";
  }
  if (partId.includes("keypad")) {
    return "/src/assets/images/keypad_module_1779715209142.png"; 
  }
  if (partId.includes("joystick")) {
    return "/src/assets/images/joystick_module_1779715051753.png"; 
  }
  if (partId.includes("touch")) {
    return "/src/assets/images/touch_sensor_1779715225951.png"; 
  }
  if (partId.includes("relay")) {
    return "/src/assets/images/relay_module_1779715177638.png"; 
  }
  if (partId.includes("solenoid")) {
    return "/src/assets/images/solenoid_lock_1779715069824.png"; 
  }
  if (partId === "actuator_led_rgb" || partId.includes("led_rgb")) {
    return "/src/assets/images/rgb_led_module_1779715193755.png";
  }
  if (partId.includes("led")) {
    return "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80"; // colored glowing diode lamps
  }
  if (partId.includes("lcd") || partId.includes("oled") || partId.includes("seven_segment") || partId.includes("matrix")) {
    return "https://images.unsplash.com/photo-1517055720413-77a3394281f9?w=600&auto=format&fit=crop&q=80"; // pixel grid numeric readings
  }
  if (partId.includes("bluetooth") || partId.includes("wifi") || partId.includes("nrf24l01") || partId.includes("esp8266")) {
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"; // telemetry circuit transmitter
  }

  return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80";
};

const getSoftwareUsed = (partId: string, category: string): string => {
  const customMap: Record<string, string> = {
    controller_arduino: "Arduino IDE, PlatformIO, VS Code, Arduino CLI",
    controller_esp32: "Arduino IDE, Thonny IDE (MicroPython), ESP-IDF",
    controller_raspberry_pi: "Raspberry Pi OS, Thonny MicroPython, VS Code, Python SDKs",
    sensor_ultrasonic_hc_sr04: "NewPing Library, HC-SR04 pulse-timing APIs",
    sensor_dht11_temp: "Adafruit DHT Sensor Library, DHTStable driver, DHTxx SDK",
    sensor_camera_esp32: "ESP32 Camera WebServer Library, OV2640 driver",
    sensor_touch_ky036: "Standard GPIO Read, DigitalWrite Pin SDK",
    sensor_light_ldr: "AnalogRead ADC Voltage Conversion API",
    sensor_sound_ky038: "Microphone Comparator and ADC high-frequency sampling",
    actuator_servo_sg90: "Servo.h Standard Library, PWM Pulse Width Generator",
    actuator_dc_geared: "H-Bridge L298N library, PWM duty cycle speed control",
    actuator_stepper: "AccelStepper Library, stepper clock impulse sequence",
    actuator_buzzer: "Arduino tone Library, PWM frequency sweep scripts",
    actuator_relay: "Direct digital GPIO output pin drive",
    actuator_solenoid_lock: "MOSFET switch pulse drive or relay toggling",
    actuator_led_rgb: "FastLED, Adafruit NeoPixel Library, PWM color channels",
    display_lcd1602: "LiquidCrystal_I2C Library, Wire.h I2C connection driver",
    display_oled_ssd1306: "Adafruit SSD1306, Adafruit GFX Graphic API, U8g2",
    display_seven_segment: "LedControl Library, MAX7219 serial latch registers",
    display_led_matrix: "MAX7219 LedControl, MD_MAX72XX, MD_Parola marquee control",
  };
  return customMap[partId] || "Standard GPIO Input/Output controller driver library";
};

const getLanguageCompatibility = (partId: string, category: string): string => {
  if (partId === "controller_raspberry_pi") {
    return "Python, C++, JavaScript (Node.js), Rust, Go, bash";
  }
  if (partId === "controller_esp32") {
    return "C++, Python (MicroPython), JavaScript, Rust, Assembly";
  }
  return "C++ (Arduino), Python (MicroPython), Rust Embedded-HAL";
};

const getPinTelemetry = (partId: string) => {
  const defaultTelemetry = [
    { pinName: "VCC", voltage: "5.0V / 3.3V", status: "HIGH (POWER)", function: "Main voltage supply track" },
    { pinName: "GND", voltage: "0.0V", status: "LOW (GROUND)", function: "Common system ground reference" },
    { pinName: "SIGNAL", voltage: "0V-5V Max", status: "DYNAMIC", function: "Active I/O logic state or data bus track" },
  ];

  const specMap: Record<string, { pinName: string; voltage: string; status: string; function: string }[]> = {
    controller_arduino: [
      { pinName: "USB-C Jack", voltage: "5.0V Input", status: "STABLE", function: "Power supply source node" },
      { pinName: "5V PIN", voltage: "5.01V", status: "REGULATED_HIGH", function: "Stabilized auxiliary board supply" },
      { pinName: "Digital D0-D13", voltage: "0.0V - 5.0V PWM", status: "COMMUNICATING", function: "Digital lines and interrupt registers" },
      { pinName: "Analog A0-A5", voltage: "0.0V - 4.9V ADC", status: "SAMPLING", function: "10-bit hardware analog measurements" },
    ],
    controller_esp32: [
      { pinName: "3V3 PIN", voltage: "3.29V", status: "REGULATED_HIGH", function: "Low power processor supply rail" },
      { pinName: "GPIO 0-39", voltage: "0.0V - 3.3V", status: "HIGH_SPEED_IO", function: "High frequency logical GPIO lines" },
      { pinName: "ADC1/ADC2", voltage: "0V - 3.12V Max", status: "SAMPLING", function: "12-bit analog input resolution readings" },
      { pinName: "SDA/SCL Bus", voltage: "3.28V Peak", status: "ACTIVE_I2C", function: "I2C serial protocol synchronizer" },
    ],
    controller_raspberry_pi: [
      { pinName: "5V Pins (2/4)", voltage: "5.04V", status: "HIGH_CURRENT", function: "Direct heavy-load power bridge" },
      { pinName: "3.3V Pins (1/17)", voltage: "3.30V", status: "REGULATED_HIGH", function: "SoC processor core board power" },
      { pinName: "GPIO Bus", voltage: "0.0V - 3.3V", status: "DYNAMIC", function: "General software register interaction lines" },
      { pinName: "TXD / RXD", voltage: "3.3V Idle", status: "UART_TRANS", function: "Full-duplex serial communication lines" },
    ],
    sensor_ultrasonic_hc_sr04: [
      { pinName: "VCC", voltage: "5.0V", status: "NOMINAL", function: "Transducer acoustic controller rail" },
      { pinName: "Trigger", voltage: "0V-5V Input", status: "ACTIVE_PULSING", function: "Initiates 10 microsecond trigger loop" },
      { pinName: "Echo", voltage: "0V-5V PWM Output", status: "MEASURING", function: "Pulse width maps physical obstacle range" },
      { pinName: "GND", voltage: "0.0V", status: "GROUND", function: "Inert reference return path" },
    ],
    sensor_dht11_temp: [
      { pinName: "VDD/VCC", voltage: "3.3V - 5.0V", status: "NOMINAL", function: "Thermistor and humidity grid logic lines" },
      { pinName: "DATA", voltage: "3.3V-5.0V Bus", status: "PULL_UP", function: "Coordinates bidirectional single-wire frames" },
      { pinName: "GND", voltage: "0.0V", status: "GROUND", function: "Zero volt return reference" },
    ],
    sensor_camera_esp32: [
      { pinName: "3V3 & 5V", voltage: "3.31V & 5.02V", status: "POWERED", function: "Separate digital core and sensor optics rails" },
      { pinName: "SIOC / SIOD", voltage: "3.29V Bus", status: "SCCB_BUS", function: "Register config communication lines" },
      { pinName: "VSYNC / PCLK", voltage: "0.0V - 3.3V", status: "STREAMING", function: "Pixel synchronizations and scan-rate frames" },
    ],
    display_lcd1602: [
      { pinName: "VCC", voltage: "5.0V", status: "POWERED", function: "Main screen power and LED logic driver" },
      { pinName: "SDA (I2C)", voltage: "4.92V Pulse", status: "DATA_IN", function: "Reads alphanumeric menu instructions" },
      { pinName: "SCL (I2C)", voltage: "5.0V Clock", status: "CLOCK", function: "Main bus speed coordination lines" },
    ],
    display_oled_ssd1306: [
      { pinName: "VDD", voltage: "3.3V", status: "NOMINAL", function: "Organic pixel grid emission voltage" },
      { pinName: "SDA", voltage: "3.3V Pulse", status: "DATA_IN", function: "Graphic page buffers and pixel indices" },
      { pinName: "SCL", voltage: "3.3V Clock", status: "CLOCK", function: "I2C clock alignment intervals" },
    ],
  };

  return specMap[partId] || defaultTelemetry;
};

interface InteractiveDiagramProps {
  selectedPart: RoboticPart;
  onHoverHotspot: (name: string, description: string) => void;
  onClearHotspot: () => void;
  activeHotspotId: string | null;
  setActiveHotspotId: (id: string | null) => void;
}

export default function InteractiveDiagram({
  selectedPart,
  onHoverHotspot,
  onClearHotspot,
  activeHotspotId,
  setActiveHotspotId,
}: InteractiveDiagramProps) {
  const hasHotspots = !!selectedPart.hotspots && selectedPart.hotspots.length > 0;
  const [viewMode, setViewMode] = useState<"blueprint" | "crosssection" | "realphoto">("realphoto");
  
  // Safe resolved active view mode
  const activeMode = hasHotspots ? viewMode : (viewMode === "crosssection" ? "realphoto" : viewMode);

  const [isPhotoLoading, setIsPhotoLoading] = useState(true);

  React.useEffect(() => {
    setIsPhotoLoading(true);
  }, [selectedPart.id]);

  // Renders beautiful, fully custom vector visual schematics based on selected component
  const renderSVGDiagram = () => {
    const activeClass = "stroke-sky-400 stroke-[3] fill-sky-500/25 shadow-[0_0_12px_rgba(14,165,233,0.5)] select-none cursor-pointer transition-all duration-300";
    const normalClass = "stroke-slate-500 stroke-[1.5] fill-slate-800/40 select-none cursor-pointer hover:stroke-sky-400 hover:fill-sky-500/10 transition-all duration-300";

    if (selectedPart.id === "actuator_servo_sg90") {
      return (
        <svg viewBox="30 20 200 300" className="w-full max-w-sm h-auto mx-auto select-none" id="servo-svg" preserveAspectRatio="xMidYMid meet">
          {/* Outer Housing Outline */}
          <rect x="50" y="80" width="160" height="180" rx="10" className="stroke-slate-600 fill-slate-900/90" strokeWidth="2" />
          <rect x="40" y="110" width="180" height="20" rx="4" className="stroke-slate-600 fill-slate-800" strokeWidth="1.5" />
          
          {/* Internal coreless DC motor */}
          <rect x="65" y="150" width="50" height="80" rx="6" className={activeHotspotId === "srv_motor" ? activeClass : normalClass} strokeDasharray="3,3" />
          <line x1="90" y1="150" x2="90" y2="130" className="stroke-slate-500" strokeWidth="2" />
          <text x="90" y="195" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] pointer-events-none">DC Motor</text>

          {/* Gears composite section */}
          <circle cx="135" cy="130" r="28" className={activeHotspotId === "srv_gears" ? activeClass : normalClass} />
          <circle cx="135" cy="130" r="18" className="stroke-slate-600 fill-slate-900" strokeDasharray="2,2" />
          <circle cx="95" cy="120" r="15" className={activeHotspotId === "srv_gears" ? activeClass : normalClass} />
          <circle cx="150" cy="100" r="10" className={activeHotspotId === "srv_gears" ? activeClass : normalClass} />
          <text x="135" y="133" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] pointer-events-none">Gears</text>

          {/* Feedback potentiometer */}
          <circle cx="155" cy="180" r="16" className={activeHotspotId === "srv_pot" ? activeClass : normalClass} />
          <circle cx="155" cy="180" r="8" className="stroke-slate-600 fill-slate-900" />
          <line x1="145" y1="180" x2="165" y2="180" className="stroke-slate-500" strokeWidth="1" />
          <text x="155" y="215" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] pointer-events-none">Pot/Feedback</text>

          {/* Output horn representation */}
          <path d="M 120 40 L 180 40 A 15 15 0 0 1 180 70 L 120 70 A 15 15 0 0 1 120 40 Z" className={activeHotspotId === "srv_horn" ? activeClass : normalClass} />
          <circle cx="150" cy="55" r="15" className="stroke-slate-500 fill-slate-800" />
          <circle cx="150" cy="55" r="5" className="stroke-slate-600 fill-slate-900" />
          <circle cx="125" cy="55" r="2" className="fill-white" />
          <circle cx="175" cy="55" r="2" className="fill-white" />
          <text x="150" y="32" textAnchor="middle" className="fill-sky-400 font-mono text-[9px] font-bold pointer-events-none">HORN</text>

          {/* Embedded Control IC */}
          <rect x="60" y="240" width="140" height="15" rx="2" className={activeHotspotId === "srv_ic" ? activeClass : normalClass} />
          <text x="130" y="251" textAnchor="middle" className="fill-slate-400 font-mono text-[8.5px] pointer-events-none">Servo Driver PCB</text>

          {/* External brown, red, yellow cables */}
          <path d="M 130 255 C 130 280, 110 290, 110 310" className="stroke-amber-500 fill-none" strokeWidth="2" />
          <path d="M 133 255 C 133 280, 113 290, 113 310" className="stroke-red-500 fill-none" strokeWidth="2" />
          <path d="M 136 255 C 136 280, 116 290, 116 310" className="stroke-amber-700 fill-none" strokeWidth="2" />
        </svg>
      );
    }

    if (selectedPart.id === "sensor_ultrasonic") {
      return (
        <svg viewBox="10 40 300 190" className="w-full max-w-sm h-auto mx-auto select-none" id="ultrasonic-svg" preserveAspectRatio="xMidYMid meet">
          {/* Blue PCB Board background */}
          <rect x="40" y="90" width="240" height="130" rx="8" className="stroke-indigo-600 fill-slate-900/90" strokeWidth="2.5" />
          <text x="160" y="115" textAnchor="middle" className="fill-indigo-400/90 font-mono text-[9px] tracking-widest font-bold">HC-SR04 CONES</text>

          {/* Ultrasonic Transmitter T-pod */}
          <circle cx="100" cy="155" r="35" className={activeHotspotId === "ult_trig_pod" ? activeClass : normalClass} />
          <circle cx="100" cy="155" r="28" className="stroke-slate-600 fill-slate-900" />
          <line x1="75" y1="155" x2="125" y2="155" className="stroke-slate-500" strokeWidth="1" />
          <line x1="100" y1="130" x2="100" y2="180" className="stroke-slate-500" strokeWidth="1" />
          <text x="100" y="159" textAnchor="middle" className="fill-sky-400 font-mono text-[10px] font-bold pointer-events-none">TRIG (T)</text>

          {/* Emit waves helper animation */}
          {activeHotspotId === "ult_trig_pod" && (
            <>
              <path d="M 55 155 C 35 135, 35 175, 55 155" className="stroke-sky-400 fill-none opacity-80" strokeWidth="1.5" />
              <path d="M 45 155 C 15 115, 15 195, 45 155" className="stroke-sky-400/60 fill-none" strokeWidth="1.5" strokeDasharray="2,2" />
              <path d="M 35 155 C -5 95, -5 215, 35 155" className="stroke-sky-400/30 fill-none" strokeWidth="1.5" />
            </>
          )}

          {/* Ultrasonic Receiver R-pod */}
          <circle cx="220" cy="155" r="35" className={activeHotspotId === "ult_echo_pod" ? activeClass : normalClass} />
          <circle cx="220" cy="155" r="28" className="stroke-slate-600 fill-slate-900" />
          <line x1="195" y1="155" x2="245" y2="155" className="stroke-slate-500" strokeWidth="1" />
          <line x1="220" y1="130" x2="220" y2="180" className="stroke-slate-500" strokeWidth="1" />
          <text x="220" y="159" textAnchor="middle" className="fill-sky-400 font-mono text-[10px] font-bold pointer-events-none">ECHO (R)</text>

          {/* Returning echo helper animation */}
          {activeHotspotId === "ult_echo_pod" && (
            <>
              <path d="M 240 135 C 255 155, 240 175, 240 135" className="stroke-emerald-400 fill-none animate-pulse" strokeWidth="1.5" />
              <path d="M 260 115 C 285 155, 260 195, 260 115" className="stroke-emerald-400/60 fill-none" strokeWidth="1.5" strokeDasharray="3,3" />
            </>
          )}

          {/* Processing IC chip (internal representation on bottom layer) */}
          <rect x="135" y="145" width="50" height="40" rx="3" className={activeHotspotId === "ult_ic" ? activeClass : normalClass} />
          <text x="160" y="169" textAnchor="middle" className="fill-slate-400 font-mono text-[8px] pointer-events-none">LM324</text>
          
          {/* Connector headers pins */}
          <rect x="125" y="80" width="70" height="11" rx="2" className={activeHotspotId === "ult_pins" ? activeClass : normalClass} />
          <line x1="135" y1="80" x2="135" y2="55" className="stroke-slate-500" strokeWidth="2.5" />
          <line x1="151.7" y1="80" x2="151.7" y2="55" className="stroke-slate-500" strokeWidth="2.5" />
          <line x1="168.3" y1="80" x2="168.3" y2="55" className="stroke-slate-500" strokeWidth="2.5" />
          <line x1="185" y1="80" x2="185" y2="55" className="stroke-slate-500" strokeWidth="2.5" />
          
          <text x="160" y="50" textAnchor="middle" className="fill-slate-400 font-mono text-[8px] pointer-events-none">VCC trig echo GND</text>
        </svg>
      );
    }

    if (selectedPart.id === "controller_arduino") {
      return (
        <svg viewBox="20 35 280 260" className="w-full max-w-sm h-auto mx-auto select-none" id="arduino-svg" preserveAspectRatio="xMidYMid meet">
          {/* Teal base motherboard plate */}
          <rect x="30" y="40" width="260" height="240" rx="12" className="stroke-emerald-600 fill-slate-900" strokeWidth="2" />
          
          {/* USB connector slot */}
          <rect x="15" y="65" width="60" height="40" rx="3" className={activeHotspotId === "ard_usb" ? activeClass : normalClass} />
          <text x="45" y="89" textAnchor="middle" className="fill-slate-400 font-mono text-[8px] pointer-events-none">USB-B</text>

          {/* Direct power jack connector */}
          <rect x="15" y="160" width="65" height="50" rx="2" className={activeHotspotId === "ard_power" ? activeClass : normalClass} />
          <circle cx="48" cy="185" r="12" className="stroke-slate-700 fill-slate-950" />
          <text x="48" y="225" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] pointer-events-none">POWER JACK</text>

          {/* Processing MCU core chip */}
          <rect x="130" y="140" width="130" height="45" rx="3" className={activeHotspotId === "ard_mcu" ? activeClass : normalClass} />
          <line x1="140" y1="140" x2="140" y2="135" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="160" y1="140" x2="160" y2="135" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="180" y1="140" x2="180" y2="135" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="200" y1="140" x2="200" y2="135" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="220" y1="140" x2="220" y2="135" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="240" y1="140" x2="240" y2="135" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="140" y1="185" x2="140" y2="190" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="160" y1="185" x2="160" y2="190" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="180" y1="185" x2="180" y2="190" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="200" y1="185" x2="200" y2="190" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="220" y1="185" x2="220" y2="190" className="stroke-slate-500" strokeWidth="1.5" />
          <line x1="240" y1="185" x2="240" y2="190" className="stroke-slate-500" strokeWidth="1.5" />
          <text x="195" y="167" textAnchor="middle" className="fill-sky-400 font-mono text-[9px] font-bold pointer-events-none">ATmega328P</text>

          {/* Voltage level regulators */}
          <rect x="95" y="165" width="22" height="30" rx="2" className={activeHotspotId === "ard_reg" ? activeClass : normalClass} />
          <text x="106" y="208" textAnchor="middle" className="fill-slate-500 font-mono text-[7px] pointer-events-none">5V REG</text>

          {/* GPIO pins (Digital upper bar) */}
          <rect x="95" y="48" width="180" height="15" rx="1" className={activeHotspotId === "ard_pins_d" ? activeClass : normalClass} />
          <text x="185" y="58" textAnchor="middle" className="fill-slate-400 font-mono text-[8px] pointer-events-none">DIGITAL INPUTS (D0 - D13)</text>
          
          {/* GPIO pins (Analog right lower bar) */}
          <rect x="180" y="245" width="95" height="15" rx="1" className={activeHotspotId === "ard_pins_a" ? activeClass : normalClass} />
          <text x="227" y="255" textAnchor="middle" className="fill-slate-400 font-mono text-[8px] pointer-events-none">ANALOG (A0 - A5)</text>
          
          {/* Board lettering labels */}
          <text x="185" y="105" textAnchor="middle" className="fill-emerald-500/30 font-serif text-[18px] font-bold italic tracking-widest pointer-events-none">ARDUINO</text>
        </svg>
      );
    }

    if (selectedPart.id === "controller_esp32") {
      return (
        <svg viewBox="30 25 240 265" className="w-full max-w-sm h-auto mx-auto select-none" id="esp32-svg" preserveAspectRatio="xMidYMid meet">
          {/* Black PCB card */}
          <rect x="40" y="30" width="220" height="250" rx="8" className="stroke-slate-700 fill-slate-900/90" strokeWidth="2" />
          
          {/* PCB Antenna */}
          <rect x="75" y="42" width="150" height="30" rx="2" className={activeHotspotId === "esp_ant" ? activeClass : normalClass} />
          <path d="M 85 57 L 95 47 L 105 57 L 115 47 L 125 57 L 135 47 L 145 57 L 155 47 L 165 57 L 175 47 L 185 57 L 195 47 L 205 57 L 215 47" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="150" y="66" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] pointer-events-none">Onboard PCB Antenna</text>

          {/* Core SoC Shield casing */}
          <rect x="75" y="85" width="150" height="100" rx="4" className={activeHotspotId === "esp_cpu" ? activeClass : normalClass} />
          <text x="150" y="115" textAnchor="middle" className="fill-slate-300 font-bold font-mono text-[9px] pointer-events-none">ESP-WROOM-32 Shield</text>
          <rect x="95" y="125" width="110" height="40" rx="2" className="stroke-slate-600 fill-slate-950" />
          <text x="150" y="148" textAnchor="middle" className="fill-sky-400 font-mono text-[8px] font-bold pointer-events-none">Xtensa Dual Core</text>

          {/* Push buttons */}
          <rect x="60" y="205" width="30" height="30" rx="4" className={activeHotspotId === "esp_boot" ? activeClass : normalClass} />
          <circle cx="75" cy="220" r="8" className="fill-slate-700" />
          <text x="75" y="248" textAnchor="middle" className="fill-slate-500 font-mono text-[7px] pointer-events-none">BOOT/EN</text>

          {/* Micro USB controller port */}
          <rect x="120" y="242" width="60" height="35" rx="3" className={activeHotspotId === "esp_usb" ? activeClass : normalClass} />
          <rect x="130" y="248" width="40" height="15" rx="1" className="stroke-slate-600 fill-slate-950" />
          <text x="150" y="272" textAnchor="middle" className="fill-slate-400 font-mono text-[7px] pointer-events-none">SERIAL USB</text>
        </svg>
      );
    }

    if (selectedPart.id === "controller_driver_l298n") {
      return (
        <svg viewBox="30 35 260 245" className="w-full max-w-sm h-auto mx-auto select-none" id="l298n-svg" preserveAspectRatio="xMidYMid meet">
          {/* Main motherboard housing */}
          <rect x="40" y="40" width="240" height="230" rx="8" className="stroke-red-750 fill-slate-900" strokeWidth="2" />
          <text x="160" y="65" textAnchor="middle" className="fill-red-500/80 font-mono text-[10px] tracking-widest font-bold">L298N HEAVY-DUTY BRIDGE</text>

          {/* Black aluminum cooling heatsink */}
          <rect x="80" y="80" width="160" height="55" rx="3" className={activeHotspotId === "drv_sink" ? activeClass : normalClass} />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={95 + i * 18} y1="85" x2={95 + i * 18} y2="130" className="stroke-slate-600" strokeWidth="3" />
          ))}
          <text x="160" y="112" textAnchor="middle" className="fill-slate-400 font-mono text-[8px] pointer-events-none font-bold">ALUMINUM SINK</text>

          {/* Inside Silicon ZIP chip */}
          <rect x="100" y="145" width="120" height="35" rx="2" className={activeHotspotId === "drv_ic" ? activeClass : normalClass} />
          <text x="160" y="167" textAnchor="middle" className="fill-sky-400 font-bold font-mono text-[8.5px] pointer-events-none">L298 DUAL H-BRIDGE</text>

          {/* Left / Right outer screws connectors */}
          <rect x="48" y="175" width="28" height="50" rx="2" className={activeHotspotId === "drv_term_m" ? activeClass : normalClass} />
          <circle cx="62" cy="190" r="6" className="stroke-slate-600 fill-slate-900" />
          <circle cx="62" cy="210" r="6" className="stroke-slate-600 fill-slate-900" />
          <text x="62" y="235" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">OUT1/2</text>

          {/* Bottom center battery input terminals */}
          <rect x="110" y="215" width="55" height="45" rx="2" className={activeHotspotId === "drv_term_p" ? activeClass : normalClass} />
          <circle cx="123" cy="235" r="5" className="stroke-slate-600 fill-slate-950" />
          <circle cx="148" cy="235" r="5" className="stroke-slate-600 fill-slate-950" />
          <text x="137" y="255" textAnchor="middle" className="fill-indigo-400 font-mono text-[6.5px]">PWR_GND</text>

          {/* Jump shunt enable */}
          <rect x="235" y="175" width="22" height="30" rx="2" className={activeHotspotId === "drv_jump" ? activeClass : normalClass} />
          <rect x="239" y="180" width="14" height="20" fill="#15803d" />
          <text x="246" y="215" textAnchor="middle" className="fill-emerald-400 font-mono text-[6px]">5V_EN</text>
        </svg>
      );
    }

    if (selectedPart.id === "actuator_dc_geared") {
      return (
        <svg viewBox="30 75 260 145" className="w-full max-w-sm h-auto mx-auto select-none" id="dc-motor-svg" preserveAspectRatio="xMidYMid meet">
          {/* Sinuous body chassis */}
          <rect x="40" y="80" width="240" height="130" rx="8" className="stroke-amber-500 fill-slate-900/90" strokeWidth="2" />
          <text x="160" y="105" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-extrabold tracking-widest">YELLOW GEARED MOTOR</text>

          {/* Metal casing core (DC motor capsule) */}
          <rect x="48" y="125" width="90" height="70" rx="2" className={activeHotspotId === "dc_rotor" ? activeClass : normalClass} />
          {/* Wound copper rotors wire representation */}
          <circle cx="93" cy="160" r="22" className="stroke-amber-600/60 fill-none" strokeWidth="4" strokeDasharray="3,3" />
          <circle cx="93" cy="160" r="14" className="stroke-amber-700/80 fill-none" strokeWidth="3" />
          <text x="93" y="163" textAnchor="middle" className="fill-amber-500 font-mono text-[7.5px] pointer-events-none">COILS</text>

          {/* Back solder points */}
          <rect x="42" y="145" width="6" height="30" rx="1" className={activeHotspotId === "dc_term" ? activeClass : normalClass} />
          <circle cx="45" cy="153" r="1.5" fill="#ef4444" />
          <circle cx="45" cy="167" r="1.5" fill="#3b82f6" />

          {/* Brushes commutator */}
          <line x1="52" y1="160" x2="68" y2="160" className={activeHotspotId === "dc_brush" ? activeClass : normalClass} strokeWidth="3.5" />
          <text x="65" y="140" fill="#94a3b8" fontSize="7" fontFamily="monospace">BRUSH</text>

          {/* Gear reduction train */}
          <rect x="155" y="125" width="115" height="70" rx="4" className={activeHotspotId === "dc_gears" ? activeClass : normalClass} />
          {/* Intersecting gears */}
          <circle cx="180" cy="160" r="24" className="stroke-slate-600 fill-slate-950" strokeDasharray="4,4" />
          <circle cx="215" cy="150" r="16" className="stroke-slate-600 fill-slate-950" strokeDasharray="3,3" />
          <circle cx="245" cy="165" r="20" className="stroke-slate-600 fill-slate-950" strokeDasharray="4,4" />
          <text x="210" y="163" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] pointer-events-none">SPUR TRAIN</text>
        </svg>
      );
    }

    if (selectedPart.id === "actuator_stepper") {
      return (
        <svg viewBox="45 45 210 215" className="w-full max-w-sm h-auto mx-auto select-none" id="stepper-svg" preserveAspectRatio="xMidYMid meet">
          {/* Square NEMA frame */}
          <rect x="50" y="50" width="200" height="200" rx="14" className="stroke-slate-700 fill-slate-900" strokeWidth="2.5" />
          
          {/* Perimeter Electromagnetic coils */}
          {Array.from({ length: 8 }).map((_, idx) => {
            const angle = (idx * 360) / 8;
            const rad = (angle * Math.PI) / 180;
            const cx = 150 + 68 * Math.cos(rad);
            const cy = 150 + 68 * Math.sin(rad);
            return (
              <g key={idx} transform={`rotate(${angle}, ${cx}, ${cy})`}>
                <rect
                  x={cx - 15}
                  y={cy - 10}
                  width="30"
                  height="20"
                  rx="2"
                  className={activeHotspotId === "stp_coils" ? activeClass : normalClass}
                />
              </g>
            );
          })}
          <text x="150" y="65" textAnchor="middle" className="fill-amber-500/80 font-mono text-[8.5px] font-extrabold tracking-widest uppercase">STATOR PHASES</text>

          {/* Central teethed rotor */}
          <circle cx="150" cy="150" r="45" className={activeHotspotId === "stp_rot" ? activeClass : normalClass} />
          {Array.from({ length: 24 }).map((_, i) => {
            const rotAng = (i * 360) / 24;
            return (
              <line key={i} x1="150" y1="105" x2="150" y2="108" stroke="#94a3b8" strokeWidth="1.5" transform={`rotate(${rotAng}, 150, 150)`} />
            );
          })}
          <circle cx="150" cy="150" r="30" className="fill-slate-900" />

          {/* Center steel shaft */}
          <circle cx="150" cy="150" r="16" className={activeHotspotId === "stp_shaft" ? activeClass : normalClass} />
          {/* D-flat side layout */}
          <path d="M 139 140 L 161 140 A 15 15 0 0 1 139 160 Z" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="150" y="153" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold pointer-events-none">D-SHAFT</text>

          {/* Molex plug container */}
          <rect x="120" y="235" width="60" height="20" rx="1" className={activeHotspotId === "stp_socket" ? activeClass : normalClass} />
          <text x="150" y="248" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] pointer-events-none">4-PIN PLUG</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_imu_mpu6050") {
      return (
        <svg viewBox="45 45 210 200" className="w-full max-w-sm h-auto mx-auto select-none" id="imu-svg" preserveAspectRatio="xMidYMid meet">
          {/* Blue IMU PCB casing */}
          <rect x="50" y="50" width="200" height="200" rx="8" className="stroke-cyan-600 fill-slate-900" strokeWidth="2.5" />
          <text x="150" y="75" textAnchor="middle" className="fill-cyan-400 font-mono text-[9px] tracking-widest font-extrabold uppercase">GYRO DECK IMU</text>

          {/* MEMS IC Sensor package */}
          <rect x="100" y="100" width="100" height="100" rx="3" className={activeHotspotId === "imu_sensor_chip" ? activeClass : normalClass} />
          <text x="150" y="145" textAnchor="middle" className="fill-[#ffffff] font-bold font-mono text-[11px] pointer-events-none">MPU-6050</text>
          <text x="150" y="160" textAnchor="middle" className="fill-slate-400 font-mono text-[7px] pointer-events-none">6-AXIS MEMS</text>
          
          {/* Tiny graphic compass element overlay inside core */}
          <circle cx="150" cy="180" r="10" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" />
          <line x1="150" y1="172" x2="150" y2="188" stroke="#38bdf8" strokeWidth="1" />
          <line x1="142" y1="180" x2="158" y2="180" stroke="#38bdf8" strokeWidth="1" />

          {/* Smoothing ceramic caps */}
          <rect x="68" y="105" width="14" height="22" rx="1" className={activeHotspotId === "imu_caps" ? activeClass : normalClass} />
          <text x="75" y="143" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">CAPS</text>

          {/* Pullup Resistors */}
          <rect x="218" y="105" width="14" height="22" rx="1" className={activeHotspotId === "imu_pullup" ? activeClass : normalClass} />
          <text x="225" y="143" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">RES</text>

          {/* I2C headers pins */}
          <rect x="65" y="215" width="170" height="20" rx="1" className={activeHotspotId === "imu_header" ? activeClass : normalClass} />
          <text x="150" y="228" textAnchor="middle" className="fill-cyan-400 font-mono text-[8px] font-bold pointer-events-none">VCC GND Scl sda INT</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_camera") {
      return (
        <svg viewBox="35 35 230 210" className="w-full max-w-sm h-auto mx-auto select-none" id="camera-svg" preserveAspectRatio="xMidYMid meet">
          {/* Main camera housing card */}
          <rect x="40" y="40" width="220" height="220" rx="10" className="stroke-indigo-650 fill-slate-900" strokeWidth="2" />
          
          {/* Outer focus lens cylinder */}
          <circle cx="150" cy="130" r="50" className={activeHotspotId === "cam_lens" ? activeClass : normalClass} />
          <circle cx="150" cy="130" r="38" className="stroke-slate-650 fill-slate-950" />
          
          {/* Inner glass lens layers */}
          <circle cx="150" cy="130" r="24" className="stroke-sky-400/50 fill-sky-300/10" strokeWidth="2px" />
          <text x="150" y="96" textAnchor="middle" className="fill-sky-400 font-mono text-[8px] font-bold pointer-events-none">ZOOM_LENS</text>

          {/* Flat silicon CMOS matrix inside */}
          <rect x="135" y="115" width="30" height="30" rx="1" className={activeHotspotId === "cam_sensor" ? activeClass : normalClass} />
          <text x="150" y="133" textAnchor="middle" className="fill-slate-300 font-mono text-[7px] pointer-events-none">CMOS</text>

          {/* Image co-processor micro IC */}
          <rect x="202" y="180" width="45" height="45" rx="2" className={activeHotspotId === "cam_dsp" ? activeClass : normalClass} />
          <text x="224.5" y="206" textAnchor="middle" className="fill-slate-400 font-bold font-mono text-[7px] pointer-events-none">DSP SoC</text>

          {/* Pins interfaces */}
          <rect x="52" y="215" width="70" height="15" rx="1" className={activeHotspotId === "cam_pins" ? activeClass : normalClass} />
          <text x="87" y="226" textAnchor="middle" className="fill-emerald-400 font-mono text-[7px] pointer-events-none">UART_PORT</text>
        </svg>
      );
    }

    if (selectedPart.id === "controller_raspberry_pi") {
      return (
        <svg viewBox="25 35 290 255" className="w-full max-w-sm h-auto mx-auto select-none" id="raspberry-pi-svg" preserveAspectRatio="xMidYMid meet">
          {/* Base substrate */}
          <rect x="30" y="40" width="280" height="240" rx="14" className="stroke-green-650 fill-slate-900" strokeWidth="2.5" />
          <text x="170" y="65" textAnchor="middle" className="fill-green-500/70 font-mono text-[11px] font-extrabold tracking-widest uppercase">RASPBERRY PI SYSTEM</text>

          {/* High speed Quad Broadcom SoC chip */}
          <rect x="95" y="95" width="80" height="80" rx="3" className={activeHotspotId === "rpi_cpu" ? activeClass : normalClass} />
          <text x="135" y="132" textAnchor="middle" className="fill-[#ffffff] font-bold font-mono text-[9px] pointer-events-none">BCM2711</text>
          <text x="135" y="146" textAnchor="middle" className="fill-slate-400 font-mono text-[7px] pointer-events-none">64-BIT ARM</text>

          {/* RAM module card */}
          <rect x="95" y="185" width="55" height="40" rx="1" className={activeHotspotId === "rpi_ram" ? activeClass : normalClass} />
          <text x="122.5" y="209" textAnchor="middle" className="fill-slate-400 font-mono text-[8px] pointer-events-none">LPDDR4</text>

          {/* 40 pin GPIO headers top bar */}
          <rect x="65" y="44" width="210" height="13" rx="1" className={activeHotspotId === "rpi_gpio" ? activeClass : normalClass} />
          {Array.from({ length: 20 }).map((_, i) => (
            <rect key={i} x={69 + i * 10} y="47" width="4.5" height="7" fill="#1e293b" stroke="#cbd5e1" strokeWidth="0.5" />
          ))}

          {/* Multi Stacked USB slots bottom right */}
          <rect x="220" y="180" width="55" height="42" rx="2" className={activeHotspotId === "rpi_usb" ? activeClass : normalClass} />
          <text x="247.5" y="205" textAnchor="middle" className="fill-sky-400 font-mono text-[7.5px] pointer-events-none">USB 3.0</text>
        </svg>
      );
    }

    if (selectedPart.id === "controller_jetson_nano") {
      return (
        <svg viewBox="25 35 290 255" className="w-full max-w-sm h-auto mx-auto select-none" id="jetson-nano-svg" preserveAspectRatio="xMidYMid meet">
          {/* Base substrate (Dark slate/black PCB) */}
          <rect x="30" y="40" width="280" height="240" rx="14" className="stroke-slate-700 fill-slate-900" strokeWidth="2.5" />
          <text x="170" y="65" textAnchor="middle" className="fill-slate-500 font-mono text-[10px] font-extrabold tracking-widest uppercase">NVIDIA JETSON SYSTEM</text>

          {/* Large Aluminum Heatsink for AI chip */}
          <rect x="90" y="90" width="100" height="90" rx="3" className={activeHotspotId === "jet_gpu" ? activeClass : normalClass} />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={96 + i * 15} y="95" width="8" height="80" fill="#475569" className="opacity-80" />
          ))}
          <text x="140" y="140" textAnchor="middle" className="fill-white font-bold font-mono text-[9px] pointer-events-none drop-shadow-md">Tegra SoC</text>
          <text x="140" y="152" textAnchor="middle" className="fill-emerald-400 font-mono text-[7px] font-extrabold pointer-events-none uppercase">Maxwell GPU</text>

          {/* Unified RAM LPDDR4 memory chip */}
          <rect x="90" y="195" width="55" height="35" rx="1" className={activeHotspotId === "jet_ram" ? activeClass : normalClass} />
          <text x="117.5" y="216" textAnchor="middle" className="fill-slate-400 font-mono text-[8.5px] pointer-events-none">4GB RAM</text>

          {/* 40-pin header expansion right side */}
          <rect x="255" y="55" width="13" height="210" rx="1" className={activeHotspotId === "jet_gpio" ? activeClass : normalClass} />
          {Array.from({ length: 20 }).map((_, i) => (
            <rect key={i} x="258" y={59 + i * 10} width="7" height="4.5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="0.5" />
          ))}

          {/* USB ports stack bottom right */}
          <rect x="180" y="195" width="55" height="42" rx="2" className={activeHotspotId === "jet_usb" ? activeClass : normalClass} />
          <text x="207.5" y="220" textAnchor="middle" className="fill-sky-400 font-mono text-[7.5px] pointer-events-none">4x USB 3.0</text>
        </svg>
      );
    }

    if (selectedPart.id === "controller_driver_pca9685") {
      return (
        <svg viewBox="25 55 290 190" className="w-full max-w-sm h-auto mx-auto select-none" id="pca9685-svg" preserveAspectRatio="xMidYMid meet">
          {/* Blue PCB frame */}
          <rect x="30" y="60" width="280" height="190" rx="8" className="stroke-blue-600 fill-slate-900" strokeWidth="2" />
          <text x="170" y="85" textAnchor="middle" className="fill-blue-400 font-mono text-[10px] tracking-widest font-extrabold uppercase">16-Ch PWM Servo Board</text>

          {/* Centered chip */}
          <rect x="110" y="115" width="120" height="45" rx="2" className={activeHotspotId === "pca_chip" ? activeClass : normalClass} />
          <text x="170" y="141" textAnchor="middle" className="fill-sky-400 font-bold font-mono text-[10px] pointer-events-none">PCA9685 I2C</text>

          {/* Screw blue Power Terminal */}
          <rect x="180" y="72" width="45" height="30" rx="2" className={activeHotspotId === "pca_term" ? activeClass : normalClass} />
          <text x="202.5" y="90" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] font-bold">5V_VCC</text>

          {/* Massive filter Cap */}
          <circle cx="62" cy="110" r="18" className={activeHotspotId === "pca_cap" ? activeClass : normalClass} />
          <circle cx="62" cy="110" r="14" className="stroke-slate-700 fill-slate-950" />
          <line x1="56" y1="110" x2="68" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="62" y="136" textAnchor="middle" className="fill-indigo-400 font-mono text-[6.5px]">FILT_CAP</text>

          {/* 3-pin headers rows running at bottom */}
          <rect x="42" y="195" width="256" height="35" rx="2" className={activeHotspotId === "pca_servo_headers" ? activeClass : normalClass} />
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i}>
              <line x1={48 + i * 15.5} y1="200" x2={48 + i * 15.5} y2="225" stroke="#fbbf24" strokeWidth="2" />
              <line x1={51 + i * 15.5} y1="200" x2={51 + i * 15.5} y2="225" stroke="#ef4444" strokeWidth="2" />
              <line x1={54 + i * 15.5} y1="200" x2={54 + i * 15.5} y2="225" stroke="#000000" strokeWidth="2" />
            </g>
          ))}
          <text x="170" y="242" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">CHANNELS (0 - 15) HEADER TERMINATION</text>
        </svg>
      );
    }

    if (selectedPart.id === "actuator_buzzer") {
      return (
        <svg viewBox="50 55 200 180" className="w-full max-w-sm h-auto mx-auto select-none" id="buzzer-svg" preserveAspectRatio="xMidYMid meet">
          {/* Circular buzzer Canister core */}
          <circle cx="150" cy="150" r="85" className={activeHotspotId === "buz_can" ? activeClass : normalClass} />
          {/* Inner hollow concentric circles */}
          <circle cx="150" cy="150" r="70" className="stroke-slate-600 fill-slate-950/95" />
          <circle cx="150" cy="150" r="14" className="stroke-slate-700 fill-slate-900" />
          <text x="150" y="90" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold">RESONANT CAVITY</text>

          {/* Piezoelectric vibrating crystal */}
          <circle cx="150" cy="150" r="45" className={activeHotspotId === "buz_piezo" ? activeClass : normalClass} />
          {/* Brass disc overlay */}
          <circle cx="150" cy="150" r="32" className="stroke-amber-600 fill-amber-500/10" strokeWidth="1.5" />
          <text x="150" y="153" textAnchor="middle" className="fill-amber-400 font-mono text-[8px] font-bold">PIEZO DISK</text>

          {/* Small transistor driver */}
          <rect x="75" y="195" width="28" height="20" rx="1.5" className={activeHotspotId === "buz_transistor" ? activeClass : normalClass} />
          <text x="89" y="224" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">SOT23</text>

          {/* Interface standard leads */}
          <rect x="195" y="195" width="30" height="20" rx="1.5" className={activeHotspotId === "buz_header" ? activeClass : normalClass} />
          <text x="210" y="224" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">LEADS</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_ir_tracker") {
      return (
        <svg viewBox="25 75 290 145" className="w-full max-w-sm h-auto mx-auto select-none" id="ir-tracker-svg" preserveAspectRatio="xMidYMid meet">
          {/* Horizontal tracking board layout */}
          <rect x="30" y="80" width="280" height="130" rx="6" className="stroke-slate-700 fill-slate-900" strokeWidth="2" />
          <text x="170" y="105" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold tracking-wider">INFRARED LINE TRACK DETECTOR</text>

          {/* Clear Transmitting IR laser tube led */}
          <rect x="42" y="125" width="35" height="15" rx="1" className={activeHotspotId === "ir_emitter" ? activeClass : normalClass} />
          <text x="60" y="153" textAnchor="middle" className="fill-sky-400 font-mono text-[7px] font-bold">EMIT(Tx)</text>

          {/* Respective black phototransistor capsule */}
          <rect x="42" y="165" width="35" height="15" rx="1" className={activeHotspotId === "ir_receiver" ? activeClass : normalClass} />
          <text x="60" y="193" textAnchor="middle" className="fill-indigo-400 font-mono text-[7px] font-bold">RECV(Rx)</text>

          {/* Multi turn precision balance potentiometer trimmer */}
          <rect x="125" y="130" width="40" height="40" rx="2" className={activeHotspotId === "ir_trimmer" ? activeClass : normalClass} />
          <circle cx="145" cy="150" r="12" fill="#ef4444" />
          <rect x="142" y="148" width="6" height="4" fill="#fbbf24" />
          <text x="145" y="182" textAnchor="middle" className="fill-slate-400 font-mono text-[6.5px]">TRIMMER</text>

          {/* High speed LM393 logic comparator chip */}
          <rect x="195" y="125" width="45" height="45" rx="2" className={activeHotspotId === "ir_comparator" ? activeClass : normalClass} />
          <text x="217.5" y="151" textAnchor="middle" className="fill-sky-400 font-bold font-mono text-[7.5px] pointer-events-none">LM393</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_ir_obstacle") {
      return (
        <svg viewBox="20 20 280 150" className="w-full max-w-sm h-auto mx-auto select-none" id="ir-obstacle-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="30" y="30" width="260" height="130" rx="6" className="stroke-slate-700 fill-slate-900" strokeWidth="2" />
          <text x="160" y="52" textAnchor="middle" className="fill-slate-500 font-mono text-[9px] font-bold tracking-wider">COLLISION OBSTACLE SENSE</text>
          
          {/* Emitter LED */}
          <rect x="42" y="70" width="30" height="15" rx="1" className={activeHotspotId === "iro_emitter" ? activeClass : normalClass} />
          <circle cx="57" cy="77.5" r="3" fill="#38bdf8" />
          <text x="57" y="98" textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">Tx (IR LED)</text>

          {/* Receiver PD */}
          <rect x="42" y="112" width="30" height="15" rx="1" className={activeHotspotId === "iro_receiver" ? activeClass : normalClass} />
          <circle cx="57" cy="119.5" r="3" fill="#1e1b4b" />
          <text x="57" y="140" textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">Rx (Photodiode)</text>

          {/* Potentiometer trimmer (calibrator) */}
          <rect x="125" y="75" width="40" height="40" rx="3" className={activeHotspotId === "iro_trimmer" ? activeClass : normalClass} />
          <circle cx="145" cy="95" r="12" fill="#3b82f6" />
          <rect x="141" y="93" width="8" height="4" fill="#cbd5e1" />
          <text x="145" y="128" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">CALIBRATOR</text>

          {/* Compass comparator logic */}
          <rect x="195" y="72" width="45" height="45" rx="2" className={activeHotspotId === "iro_comparator" ? activeClass : normalClass} />
          <text x="217.5" y="98" textAnchor="middle" className="fill-sky-400 font-bold font-mono text-[8px] pointer-events-none">LM393</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_pir_motion") {
      return (
        <svg viewBox="20 20 280 200" className="w-full max-w-sm h-auto mx-auto select-none" id="pir-motion-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="30" y="30" width="260" height="160" rx="8" className="stroke-slate-700 fill-slate-900" strokeWidth="2" />
          <text x="160" y="50" textAnchor="middle" className="fill-slate-500 font-mono text-[10px] font-bold tracking-widest">HC-SR501 PIR DETECTION</text>

          {/* Fresnel lens dome cover */}
          <path d="M 120 100 A 40 40 0 0 1 200 100 Z" className={activeHotspotId === "pir_lens" ? activeClass : normalClass} />
          <text x="160" y="85" textAnchor="middle" className="fill-slate-400 font-mono text-[7.5px] pointer-events-none">FRESNEL LENS</text>

          {/* Heat sensor core device */}
          <rect x="140" y="105" width="40" height="25" rx="3" className={activeHotspotId === "pir_pyro" ? activeClass : normalClass} />
          {/* Internal crystals */}
          <circle cx="152" cy="117.5" r="4" fill="#64748b" />
          <circle cx="168" cy="117.5" r="4" fill="#64748b" />
          <text x="160" y="142" textAnchor="middle" className="fill-cyan-400 font-mono text-[7px] font-bold">CRYSTALS</text>

          {/* Delay Time Trimmer */}
          <rect x="52" y="115" width="30" height="30" rx="2" className={activeHotspotId === "pir_delay" ? activeClass : normalClass} />
          <circle cx="67" cy="130" r="8" fill="#eab308" />
          <line x1="67" y1="130" x2="67" y2="124" stroke="#475569" strokeWidth="1.5" />
          <text x="67" y="156" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">DELAY</text>

          {/* Sensitivity Limit Trimmer */}
          <rect x="238" y="115" width="30" height="30" rx="2" className={activeHotspotId === "pir_sensitivity" ? activeClass : normalClass} />
          <circle cx="253" cy="130" r="8" fill="#eab308" />
          <line x1="253" y1="130" x2="259" y2="130" stroke="#475569" strokeWidth="1.5" />
          <text x="253" y="156" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">SENSITIVE</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_dht11") {
      return (
        <svg viewBox="20 20 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="dht-sensor-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="30" y="30" width="260" height="140" rx="6" className="stroke-blue-650 fill-slate-900" strokeWidth="2" />
          <text x="160" y="50" textAnchor="middle" className="fill-sky-400 font-mono text-[10px] font-bold tracking-widest">DHT11 WEATHER MODULE</text>

          {/* Humidity capacitor grid */}
          <rect x="45" y="70" width="70" height="50" rx="2" className={activeHotspotId === "dht_grid" ? activeClass : normalClass} />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1="52" y1={78 + i * 8} x2="108" y2={78 + i * 8} stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3,2" />
          ))}
          <text x="80" y="132" textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">HUMIDITY CAP GRID</text>

          {/* Thermistor */}
          <rect x="145" y="70" width="40" height="50" rx="2" className={activeHotspotId === "dht_therm" ? activeClass : normalClass} />
          <path d="M 160 85 L 165 95 L 170 85" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="165" y="132" textAnchor="middle" className="fill-slate-400 font-mono text-[7px]">THERMISTOR</text>

          {/* Digital 8bit MCU processor */}
          <rect x="210" y="75" width="55" height="40" rx="2" className={activeHotspotId === "dht_mcu" ? activeClass : normalClass} />
          <text x="237.5" y="99" textAnchor="middle" className="fill-sky-400 font-mono text-[7px] font-bold">8-BIT MCU</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_ldr") {
      return (
        <svg viewBox="30 20 240 180" className="w-full max-w-sm h-auto mx-auto select-none" id="ldr-sensor-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="40" y="30" width="220" height="140" rx="6" className="stroke-slate-700 fill-slate-900" strokeWidth="2" />
          <text x="150" y="50" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] font-bold tracking-wider">PHOTOCELL RESISTOR</text>

          {/* Wavy tracks CdS */}
          <rect x="90" y="65" width="120" height="50" rx="10" className={activeHotspotId === "ldr_track" ? activeClass : normalClass} />
          <path d="M 100 90 Q 115 75 130 90 T 160 90 T 190 90" fill="none" stroke="#ea580c" strokeWidth="3" />
          <text x="150" y="128" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">CDS ACTIVE COIL</text>

          {/* Bias Resistor divider 10k */}
          <rect x="110" y="135" width="80" height="20" rx="2" className={activeHotspotId === "ldr_divider" ? activeClass : normalClass} />
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} x={125 + i * 14} y="138" width="5.5" height="14" fill={i === 0 ? "#854d0e" : (i === 1 ? "#ef4444" : "#eab308")} />
          ))}
          <text x="150" y="166" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">10K DRIFT DIVIDER</text>
        </svg>
      );
    }

    if (selectedPart.id === "actuator_relay") {
      return (
        <svg viewBox="20 20 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="relay-schematic-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="30" y="30" width="260" height="140" rx="6" className="stroke-indigo-700 fill-slate-900" strokeWidth="2" />
          <text x="160" y="50" textAnchor="middle" className="fill-indigo-400 font-mono text-[9px] font-bold tracking-widest">5V ELECTROMAGNETIC SWITCH</text>

          {/* Copper Coil */}
          <rect x="45" y="70" width="80" height="40" rx="4" className={activeHotspotId === "rly_coil" ? activeClass : normalClass} />
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse key={i} cx={55 + i * 12} cy="90" rx="4" ry="12" fill="none" stroke="#f97316" strokeWidth="1.5" />
          ))}
          <text x="85" y="122" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">COPPER INDUCTION</text>

          {/* Armature Return Spring */}
          <path d="M 135 80 Q 140 70 145 90 T 155 80" className={activeHotspotId === "rly_spring" ? activeClass : normalClass} strokeWidth="2.5" stroke="#ffffff" fill="none" />
          <text x="145" y="132" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">SPRING</text>

          {/* EL817 Optocoupler */}
          <rect x="185" y="65" width="30" height="30" rx="2" className={activeHotspotId === "rly_opto" ? activeClass : normalClass} />
          <text x="200" y="82" textAnchor="middle" className="fill-emerald-400 font-mono text-[6.2px] font-bold">OPTO</text>
          <text x="200" y="105" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">ISOLATION</text>

          {/* Output screw terminal */}
          <rect x="235" y="70" width="40" height="70" rx="2" className={activeHotspotId === "rly_screws" ? activeClass : normalClass} />
          <circle cx="255" cy="85" r="5" fill="#1e293b" stroke="#475569" />
          <circle cx="255" cy="105" r="5" fill="#1e293b" stroke="#475569" />
          <circle cx="255" cy="125" r="5" fill="#1e293b" stroke="#475569" />
          <text x="255" y="152" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">COM NO NC</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_soil_moisture") {
      return (
        <svg viewBox="10 10 280 200" className="w-full max-w-sm h-auto mx-auto select-none" id="soil-moisture-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="170" rx="8" className="stroke-emerald-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-bold tracking-widest">SOIL MOISTURE DETECTOR</text>
          
          {/* Soil Probe Tines */}
          <g className={activeHotspotId === "slm_tines" ? activeClass : normalClass}>
            {/* Left tine */}
            <path d="M 60 70 L 60 160 L 70 180 L 80 160 L 80 70 Z" fill="#b45309" stroke="#cbd5e1" strokeWidth="1" />
            {/* Right tine */}
            <path d="M 100 70 L 100 160 L 110 180 L 120 160 L 120 70 Z" fill="#b45309" stroke="#cbd5e1" strokeWidth="1" />
            <text x="90" y="130" textAnchor="middle" className="fill-amber-300 font-mono text-[8px] font-bold pointer-events-none">PROBE TINES</text>
          </g>

          {/* Logic Trimmer potentiometer */}
          <rect x="170" y="70" width="35" height="35" rx="2" className={activeHotspotId === "slm_pot" ? activeClass : normalClass} />
          <circle cx="187.5" cy="87.5" r="10" fill="#3b82f6" />
          <rect x="183.5" y="85.5" width="8" height="4" fill="#cbd5e1" />
          <text x="187.5" y="120" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">THRESHOLD</text>

          {/* LM393 chip */}
          <rect x="165" y="135" width="45" height="35" rx="2" className={activeHotspotId === "slm_logic" ? activeClass : normalClass} />
          <text x="187.5" y="156" textAnchor="middle" className="fill-sky-400 font-bold font-mono text-[7px]">LM393</text>

          {/* Interface pin header block */}
          <rect x="230" y="65" width="30" height="80" rx="2" className={activeHotspotId === "slm_header" ? activeClass : normalClass} />
          {Array.from({ length: 4 }).map((_, i) => (
            <circle key={i} cx="245" cy={80 + i * 16} r="4.5" fill="#1e293b" stroke="#475569" />
          ))}
          <text x="245" y="160" textAnchor="middle" className="fill-slate-500 font-mono text-[5.5px]">VCC GND AO DO</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_rain") {
      return (
        <svg viewBox="10 10 280 200" className="w-full max-w-sm h-auto mx-auto select-none" id="rain-sensor-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="170" rx="8" className="stroke-blue-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-blue-400 font-mono text-[10px] font-bold tracking-widest">FC-37 RAINBOARD SENSOR</text>

          {/* Sensing grid */}
          <rect x="40" y="65" width="90" height="100" rx="4" className={activeHotspotId === "ran_grid" ? activeClass : normalClass} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1="50" y1={75 + i * 10} x2="120" y2={75 + i * 10} stroke="#38bdf8" strokeWidth="2" strokeDasharray={i % 2 === 0 ? "5,3" : "3,5"} />
          ))}
          <text x="85" y="115" textAnchor="middle" className="fill-blue-300 font-mono text-[7px] font-bold pointer-events-none">SENSING GRID</text>

          {/* Potentiometer trimmer */}
          <rect x="165" y="70" width="35" height="35" rx="2" className={activeHotspotId === "ran_trimmer" ? activeClass : normalClass} />
          <circle cx="182.5" cy="87.5" r="10" fill="#3b82f6" />
          <line x1="172.5" y1="87.5" x2="192.5" y2="87.5" stroke="#ffffff" strokeWidth="1.5" />
          <text x="182.5" y="120" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">TRIMMER</text>

          {/* High speed operational comparator */}
          <rect x="215" y="115" width="45" height="40" rx="2" className={activeHotspotId === "ran_ic" ? activeClass : normalClass} />
          <text x="237.5" y="140" textAnchor="middle" className="fill-sky-400 font-bold font-mono text-[7.5px]">LM393</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_gas_mq2") {
      return (
        <svg viewBox="10 10 280 200" className="w-full max-w-sm h-auto mx-auto select-none" id="gas-sensor-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="170" rx="8" className="stroke-amber-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-bold tracking-widest">MQ-2 FLAMMABLE GAS SENSOR</text>

          {/* Stainless steel mesh cover */}
          <circle cx="90" cy="115" r="42" className={activeHotspotId === "gas_can" ? activeClass : normalClass} fill="none" strokeDasharray="3,2" strokeWidth="2" />
          <circle cx="90" cy="115" r="32" fill="#334155" stroke="#475569" strokeWidth="1" />
          <text x="90" y="118" textAnchor="middle" className="fill-slate-400 font-mono text-[7px] pointer-events-none">MESH COVER</text>

          {/* Internal heater coil */}
          <circle cx="90" cy="115" r="14" className={activeHotspotId === "gas_heater" ? activeClass : normalClass} />
          <path d="M 82 115 Q 86 105 90 115 T 98 115" fill="none" stroke="#f97316" strokeWidth="2" />
          <text x="90" y="145" textAnchor="middle" className="fill-orange-400 font-mono text-[6px] pointer-events-none">HEATER COIL</text>

          {/* SnO2 sensitive sleeve */}
          <ellipse cx="90" cy="115" rx="22" ry="22" fill="none" className={activeHotspotId === "gas_sensor" ? activeClass : normalClass} strokeWidth="2" strokeDasharray="4,2" />

          {/* Trimmer calibration */}
          <rect x="175" y="65" width="35" height="35" rx="2" className={activeHotspotId === "gas_pot" ? activeClass : normalClass} />
          <circle cx="192.5" cy="82.5" r="9" fill="#ef4444" />
          <text x="192.5" y="112" textAnchor="middle" className="fill-slate-500 font-mono text-[7px]">CALIBRATOR</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_joystick") {
      return (
        <svg viewBox="10 10 280 200" className="w-full max-w-sm h-auto mx-auto select-none" id="joystick-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="170" rx="8" className="stroke-slate-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] font-bold tracking-widest">DUAL-AXIS ANALOG JOYSTICK</text>

          {/* Joystick stick cup handle */}
          <circle cx="150" cy="115" r="36" className="stroke-slate-700 fill-slate-950" />
          <circle cx="150" cy="115" r="22" className={activeHotspotId === "joy_stick" ? activeClass : normalClass} />
          <circle cx="150" cy="115" r="8" fill="#475569" />
          <text x="150" y="118" textAnchor="middle" className="fill-slate-400 font-mono text-[6.5px] pointer-events-none">STICK</text>

          {/* Potentiometer X */}
          <rect x="42" y="95" width="32" height="40" rx="2" className={activeHotspotId === "joy_pot_x" ? activeClass : normalClass} />
          <circle cx="58" cy="115" r="10" fill="#22c55e" />
          <text x="58" y="148" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">X-POT (10K)</text>

          {/* Potentiometer Y */}
          <rect x="134" y="60" width="32" height="15" rx="2" className={activeHotspotId === "joy_pot_y" ? activeClass : normalClass} />
          <circle cx="150" cy="67.5" r="5" fill="#22c55e" />
          <text x="150" y="52" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">Y-POT (10K)</text>

          {/* Push down microswitch button */}
          <rect x="215" y="95" width="35" height="35" rx="3" className={activeHotspotId === "joy_switch" ? activeClass : normalClass} />
          <circle cx="232.5" cy="112.5" r="8" fill="#3b82f6" />
          <text x="232.5" y="145" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">Z-BUTTON</text>
        </svg>
      );
    }

    if (selectedPart.id === "actuator_solenoid_lock") {
      return (
        <svg viewBox="10 10 280 200" className="w-full max-w-sm h-auto mx-auto select-none" id="solenoid-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="170" rx="8" className="stroke-indigo-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-indigo-400 font-mono text-[9px] font-bold tracking-widest">SOLENOID ELECTRONIC LOCK</text>

          {/* Copper winding bundle */}
          <rect x="60" y="70" width="100" height="75" rx="4" className={activeHotspotId === "sol_coil" ? activeClass : normalClass} />
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={65 + i * 9} y1="75" x2={65 + i * 9} y2="140" stroke="#ea580c" strokeWidth="3" />
          ))}
          <text x="110" y="160" textAnchor="middle" className="fill-orange-400 font-mono text-[7px] font-bold">COPPER WINDINGS</text>

          {/* Metal plunger */}
          <rect x="130" y="90" width="110" height="35" rx="3" className={activeHotspotId === "sol_plunger" ? activeClass : normalClass} />
          <path d="M 225 90 L 240 107.5 L 225 125 Z" fill="#94a3b8" />
          <text x="185" y="112" textAnchor="middle" className="fill-slate-950 font-mono text-[6.5px] font-extrabold">SLIDING BOLT</text>

          {/* Internal spring */}
          <path d="M 35 107.5 Q 43 100 50 115 T 60 107.5" fill="none" className={activeHotspotId === "sol_spring" ? activeClass : normalClass} strokeWidth="3" stroke="#f1f5f9" />
          <text x="45" y="145" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">RETURN SPRING</text>
        </svg>
      );
    }

    if (selectedPart.id === "actuator_led_rgb") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="rgb-led-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-emerald-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-bold tracking-widest">SMD 5050 RGB MODULE</text>

          {/* Ceramic carrier dome */}
          <rect x="55" y="60" width="80" height="80" rx="8" className={activeHotspotId === "led_chip" ? activeClass : normalClass} />
          {/* Sub diodes Red, Green, Blue */}
          <circle cx="80" cy="90" r="10" fill="#ef4444" opacity="0.8" />
          <circle cx="110" cy="90" r="10" fill="#22c55e" opacity="0.8" />
          <circle cx="95" cy="115" r="10" fill="#3b82f6" opacity="0.8" />
          <text x="95" y="132" textAnchor="middle" className="fill-slate-950 text-[6.5px] font-mono font-extrabold pointer-events-none">RGB</text>

          {/* Micro resistors */}
          <g className={activeHotspotId === "led_resistors" ? activeClass : normalClass}>
            <rect x="180" y="65" width="40" height="15" rx="1" />
            <rect x="180" y="90" width="40" height="15" rx="1" />
            <rect x="180" y="115" width="40" height="15" rx="1" />
          </g>
          <text x="200" y="142" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">BALANCERS</text>
        </svg>
      );
    }

    if (selectedPart.id === "display_lcd1602") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="lcd-display-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-teal-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-teal-400 font-mono text-[9px] font-bold tracking-widest">16x2 LCD DISPLAY MODULE</text>
          
          {/* LCD screen glass */}
          <g className={activeHotspotId === "lcd_glass" ? activeClass : normalClass}>
            <rect x="40" y="60" width="200" height="55" rx="4" />
            <text x="140" y="82" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-extrabold animate-pulse">SYSTEM INITIALIZED</text>
            <text x="140" y="98" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-extrabold animate-pulse">ROBOT ONLINE</text>
          </g>
          
          {/* Backpack module */}
          <rect x="90" y="125" width="100" height="25" rx="2" className={activeHotspotId === "lcd_chip" ? activeClass : normalClass} />
          <text x="140" y="141" textAnchor="middle" className="fill-slate-400 font-mono text-[7px] font-bold">PCF8574 I2C ADAPTER</text>
        </svg>
      );
    }

    if (selectedPart.id === "display_oled_ssd1306") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="oled-display-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-cyan-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-cyan-400 font-mono text-[9px] font-bold tracking-widest">0.96" I2C OLED SCREEN</text>
          
          {/* OLED Screen Area */}
          <g className={activeHotspotId === "oled_glass" ? activeClass : normalClass}>
            <rect x="55" y="60" width="170" height="50" rx="4" />
            <circle cx="85" cy="85" r="12" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
            <line x1="120" y1="75" x2="200" y2="75" stroke="#22d3ee" strokeWidth="2" />
            <line x1="120" y1="85" x2="180" y2="85" stroke="#22d3ee" strokeWidth="1.5" />
            <line x1="120" y1="95" x2="195" y2="95" stroke="#22d3ee" strokeWidth="1" />
          </g>
          
          {/* SSD1306 internal driver */}
          <rect x="110" y="120" width="80" height="18" rx="2" className={activeHotspotId === "oled_ic" ? activeClass : normalClass} />
          <text x="150" y="131" textAnchor="middle" className="fill-slate-300 font-mono text-[6.5px] font-bold">SSD1306 COMPACT DRIVER</text>
        </svg>
      );
    }

    if (selectedPart.id === "display_seven_segment") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="seven-segment-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-red-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-red-400 font-mono text-[9px] font-bold tracking-widest">4-DIGIT 7-SEGMENT</text>
          
          {/* 7 Segment numbers */}
          <g className={activeHotspotId === "seg_digits" ? activeClass : normalClass}>
            <rect x="40" y="60" width="200" height="52" rx="4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <g key={i} transform={`translate(${55 + i * 45}, 68)`}>
                <line x1="5" y1="5" x2="25" y2="5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="5" y1="5" x2="5" y2="18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="25" y1="5" x2="25" y2="18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="5" y1="18" x2="25" y2="18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="5" y1="18" x2="5" y2="31" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="25" y1="18" x2="25" y2="31" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <line x1="5" y1="31" x2="25" y2="31" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <circle cx="30" cy="31" r="1.5" fill="#ef4444" />
              </g>
            ))}
          </g>
          
          {/* MAX7219 controller */}
          <rect x="100" y="122" width="100" height="22" rx="2" className={activeHotspotId === "seg_ic" ? activeClass : normalClass} />
          <text x="150" y="135" textAnchor="middle" className="fill-slate-300 font-mono text-[7px] font-bold">MAX7219 MULTIPLEXER</text>
        </svg>
      );
    }

    if (selectedPart.id === "display_led_matrix") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="led-matrix-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-rose-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-rose-400 font-mono text-[9px] font-bold tracking-widest">8x8 RED LED MATRIX</text>
          
          {/* LED dot grid matrix */}
          <g className={activeHotspotId === "mtx_bubble" ? activeClass : normalClass}>
            <rect x="40" y="55" width="110" height="90" rx="4" />
            {Array.from({ length: 8 }).map((_, r) => (
              Array.from({ length: 8 }).map((_, c) => {
                const isLit = (r === 2 && (c === 2 || c === 5)) || (r === 5 && c > 1 && c < 6) || (r === 4 && (c === 1 || c === 6));
                return (
                  <circle key={`${r}-${c}`} cx={52 + c * 12} cy={66 + r * 10} r="2.5" fill={isLit ? "#f43f5e" : "#334155"} />
                );
              })
            ))}
          </g>
          
          {/* MAX7219 Driver */}
          <rect x="165" y="75" width="75" height="50" rx="3" className={activeHotspotId === "mtx_ic" ? activeClass : normalClass} />
          <text x="202" y="103" textAnchor="middle" className="fill-slate-300 font-mono text-[7px] font-bold">MAX7219</text>
          <text x="202" y="112" textAnchor="middle" className="fill-slate-500 font-mono text-[5.5px]">SPI DRIVER</text>
        </svg>
      );
    }

    if (selectedPart.id === "controller_driver_l293d") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="l293d-controller-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-blue-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-blue-400 font-mono text-[9px] font-bold tracking-widest">L293D EXPANSION SHIELD</text>
          
          {/* Central integrated IC */}
          <g className={activeHotspotId === "l293_ic" ? activeClass : normalClass}>
            <rect x="80" y="65" width="100" height="40" rx="2" />
            <circle cx="88" cy="85" r="3" fill="#0f172a" />
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <line x1={92 + i * 11} y1="65" x2={92 + i * 11} y2="58" stroke="#94a3b8" strokeWidth="2" />
                <line x1={92 + i * 11} y1="105" x2={92 + i * 11} y2="112" stroke="#94a3b8" strokeWidth="2" />
              </g>
            ))}
            <text x="130" y="88" textAnchor="middle" className="fill-slate-300 font-mono text-[8px] font-bold">L293D MOTOR IC</text>
          </g>
          
          {/* Terminal clamp screws block */}
          <g className={activeHotspotId === "l293_clamp" ? activeClass : normalClass}>
            <rect x="205" y="65" width="45" height="55" rx="2" />
            <circle cx="227" cy="78" r="4" fill="#334155" />
            <circle cx="227" cy="92" r="4" fill="#334155" />
            <circle cx="227" cy="106" r="4" fill="#334155" />
            <text x="227" y="132" textAnchor="middle" className="fill-slate-400 font-mono text-[5px]">SCREW CLAMPS</text>
          </g>
        </svg>
      );
    }

    if (selectedPart.id === "controller_driver_a4988") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="a4988-driver-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-red-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-red-400 font-mono text-[9px] font-bold tracking-widest">A4988 STEPPER CONTROLLER</text>
          
          {/* Driver Chip under bottom layer */}
          <rect x="100" y="90" width="80" height="42" rx="2" className={activeHotspotId === "a4988_chip" ? activeClass : normalClass} />
          <text x="140" y="115" textAnchor="middle" className="fill-slate-300 font-mono text-[7px] font-bold uppercase">A4988 TRANSLATOR IC</text>
          
          {/* Compact cooling heatsink mounted on top of PCB */}
          <g className={activeHotspotId === "a4988_sink" ? activeClass : normalClass}>
            <rect x="90" y="55" width="100" height="28" rx="2" />
            <line x1="110" y1="55" x2="110" y2="83" stroke="#000" strokeWidth="2.5" />
            <line x1="130" y1="55" x2="130" y2="83" stroke="#000" strokeWidth="2.5" />
            <line x1="150" y1="55" x2="150" y2="83" stroke="#000" strokeWidth="2.5" />
            <line x1="170" y1="55" x2="170" y2="83" stroke="#000" strokeWidth="2.5" />
            <text x="140" y="73" textAnchor="middle" className="fill-cyan-400 font-mono text-[6px] font-bold">ALUMINUM HEATSINK</text>
          </g>
        </svg>
      );
    }

    if (selectedPart.id === "comm_bluetooth_hc05") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="hc05-bluetooth-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-blue-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-blue-400 font-mono text-[9px] font-bold tracking-widest">HC-05 BLUETOOTH SERIAL</text>
          
          {/* Meandering trace antenna */}
          <path d="M 60 70 L 220 70 L 220 75 L 75 75 L 75 80 L 220 80" fill="none" className={activeHotspotId === "bt_antenna" ? activeClass : normalClass} strokeWidth="3" />
          <text x="140" y="93" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">2.4GHz MEANDER TRACE ANTENNA</text>
          
          {/* BC417 chip */}
          <rect x="90" y="105" width="100" height="40" rx="3" className={activeHotspotId === "bt_chip" ? activeClass : normalClass} />
          <text x="140" y="125" textAnchor="middle" className="fill-slate-300 font-mono text-[8px] font-bold">BC417 TRANSCEIVER</text>
          <text x="140" y="135" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">BCC INTEGRAL CO-PROCESSOR</text>
        </svg>
      );
    }

    if (selectedPart.id === "comm_wifi_esp8266") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="esp8266-wifi-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-slate-700 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-bold tracking-widest">ESP-01s WIFI RF LINK</text>
          
          {/* Serpentine PCB trace antenna */}
          <g className={activeHotspotId === "wf_antenna" ? activeClass : normalClass}>
            <path d="M 50 60 L 50 90 L 60 90 L 60 65 L 70 65 L 70 90 L 80 90 Z" />
            <text x="65" y="105" textAnchor="middle" className="fill-amber-500 font-mono text-[5.5px] font-bold">WI-FI ANTENNA</text>
          </g>
          
          {/* Tensilica 32-bit SoC CPU */}
          <rect x="120" y="65" width="100" height="65" rx="4" className={activeHotspotId === "wf_mcu" ? activeClass : normalClass} />
          <text x="170" y="95" textAnchor="middle" className="fill-slate-300 font-mono text-[8.5px] font-bold">ESP8266 SoC</text>
          <text x="170" y="106" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">80MHz CPU CORE</text>
        </svg>
      );
    }

    if (selectedPart.id === "comm_rf_nrf24l01") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="nrf24l01-rf-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-zinc-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-zinc-400 font-mono text-[9px] font-bold tracking-widest">nRF24L01+ RF LINK MODULE</text>
          
          {/* Sinuous trace antenna left edge */}
          <g className={activeHotspotId === "rf_antenna" ? activeClass : normalClass}>
            <path d="M 40 60 L 40 120 L 50 120 L 50 70 L 60 70 L 60 120 L 70 120" fill="none" strokeWidth="2.5" />
            <text x="55" y="136" textAnchor="middle" className="fill-zinc-400 font-mono text-[5.5px]">TRACE COIL</text>
          </g>
          
          {/* nRF24L01 core IC */}
          <rect x="110" y="65" width="110" height="60" rx="4" className={activeHotspotId === "rf_ic" ? activeClass : normalClass} />
          <text x="165" y="94" textAnchor="middle" className="fill-slate-300 font-mono text-[8px] font-bold">nRF24L01+ IC</text>
          <text x="165" y="105" textAnchor="middle" className="fill-slate-500 font-mono text-[6.5px]">2.4G TRANSCEIVER</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_sound") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="sound-sensor-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-sky-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-sky-400 font-mono text-[9px] font-bold tracking-widest">CLAP DETECTION SOUND SENSOR</text>
          
          {/* Sound Microphone sensor cap */}
          <g className={activeHotspotId === "snd_mic" ? activeClass : normalClass}>
            <circle cx="60" cy="90" r="22" />
            <line x1="45" y1="90" x2="75" y2="90" stroke="#475569" strokeWidth="2" />
            <line x1="60" y1="75" x2="60" y2="105" stroke="#475569" strokeWidth="2" />
            <text x="60" y="125" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">ELECTRET CAPSULE</text>
          </g>
          
          {/* Sensitivity Trimmer Resistor */}
          <rect x="120" y="75" width="40" height="30" rx="3" className={activeHotspotId === "snd_pot" ? activeClass : normalClass} />
          <circle cx="140" cy="90" r="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
          <line x1="135" y1="90" x2="145" y2="90" stroke="#000" strokeWidth="1.5" />
          <text x="140" y="117" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">THRESHOLD</text>
          
          {/* Comparator LM393 */}
          <rect x="190" y="70" width="60" height="40" rx="2" className={activeHotspotId === "snd_ic" ? activeClass : normalClass} />
          <text x="220" y="92" textAnchor="middle" className="fill-slate-300 font-mono text-[7px] font-bold">LM393 IC</text>
          <text x="220" y="101" textAnchor="middle" className="fill-slate-500 font-mono text-[5.5px]">COMPARATOR</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_microphone") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="mic-precision-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-indigo-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-indigo-400 font-mono text-[9px] font-bold tracking-widest">MAX4466 ANALOG MICROPHONE</text>
          
          {/* Microphone Capacitor capsule */}
          <g className={activeHotspotId === "mic_capsule" ? activeClass : normalClass}>
            <circle cx="70" cy="90" r="24" />
            <circle cx="70" cy="90" r="16" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="70" y="127" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">ELECTRET CAPSULE</text>
          </g>
          
          {/* MAX4466 High Gain Preamplifier chip */}
          <rect x="150" y="70" width="80" height="40" rx="3" className={activeHotspotId === "mic_amp" ? activeClass : normalClass} />
          <text x="190" y="92" textAnchor="middle" className="fill-slate-300 font-mono text-[7.5px] font-bold">MAX4466 IC</text>
          <text x="190" y="101" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">OP-AMP PREAMP</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_tilt") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="tilt-sw-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-amber-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-amber-400 font-mono text-[9px] font-bold tracking-widest">SW-520D TILT SWITCH</text>
          
          {/* Metal cylinder canister shell */}
          <rect x="60" y="65" width="160" height="50" rx="4" className={activeHotspotId === "tlt_cyl" ? activeClass : normalClass} />
          <text x="140" y="94" textAnchor="middle" className="fill-slate-400 font-mono text-[6.5px] font-bold uppercase">METALLIC CONDUCTOR TUBE</text>
          
          {/* Two tiny gravity-driven steel balls */}
          <g className={activeHotspotId === "tlt_balls" ? activeClass : normalClass}>
            <circle cx="100" cy="90" r="10" />
            <circle cx="120" cy="90" r="10" />
            <text x="110" y="125" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">STEEL BALLS</text>
          </g>
          
          {/* Multi-Pins */}
          <g className={activeHotspotId === "tlt_pins" ? activeClass : normalClass}>
            <line x1="220" y1="80" x2="250" y2="80" stroke="#e2e8f0" strokeWidth="3" />
            <line x1="220" y1="100" x2="250" y2="100" stroke="#e2e8f0" strokeWidth="3" />
            <text x="235" y="125" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">TERMINALS</text>
          </g>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_vibration") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="vibe-sensor-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-emerald-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-emerald-400 font-mono text-[9px] font-bold tracking-widest">SW-420 SHAKE COMPONENT</text>
          
          {/* Floating coiled spring wire */}
          <g className={activeHotspotId === "vib_spring" ? activeClass : normalClass}>
            <path d="M 50 90 Q 60 70 70 90 T 90 90 T 110 90 T 130 90" fill="none" stroke="#22c55e" strokeWidth="3" />
            <text x="90" y="115" textAnchor="middle" className="fill-emerald-500 font-mono text-[6px] font-bold">COILED SPRING</text>
          </g>
          
          {/* Central static detector probe line pin */}
          <g className={activeHotspotId === "vib_probe" ? activeClass : normalClass}>
            <line x1="145" y1="90" x2="210" y2="90" stroke="#f1f5f9" strokeWidth="3.5" />
            <circle cx="145" cy="90" r="3" fill="#f1f5f9" />
            <text x="177" y="115" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">DETECTOR PIN</text>
          </g>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_rfid_rc522") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="rfid-rc522-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-blue-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-blue-400 font-mono text-[9px] font-bold tracking-widest">RC522 RFID TRANSCEIVER</text>
          
          {/* Rectangular antenna loop arrays */}
          <g className={activeHotspotId === "rfid_antenna" ? activeClass : normalClass}>
            <rect x="40" y="55" width="200" height="42" rx="4" stroke="#eab308" strokeWidth="1" fill="none" />
            <rect x="45" y="58" width="190" height="36" rx="3" stroke="#eab308" strokeWidth="1" fill="none" fillOpacity="0.05" />
            <rect x="50" y="61" width="180" height="30" rx="2" stroke="#eab308" strokeWidth="1" fill="none" />
            <text x="140" y="78" textAnchor="middle" className="fill-amber-400 font-mono text-[7px] font-bold">13.56 MHz LOOP ANTENNA</text>
          </g>
          
          {/* High speed SPI RFID controller chip */}
          <rect x="100" y="108" width="100" height="32" rx="2" className={activeHotspotId === "rfid_ic" ? activeClass : normalClass} />
          <text x="140" y="125" textAnchor="middle" className="fill-slate-300 font-mono text-[7.5px] font-bold">MFRC522 SILICON</text>
          <text x="140" y="134" textAnchor="middle" className="fill-slate-500 font-mono text-[5.5px]">SPI BUS ENGINE</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_fingerprint") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="fingerprint-scan-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-slate-700 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-sky-400 font-mono text-[9px] font-bold tracking-widest">AS608 OPTICAL BIOMETRIC</text>
          
          {/* Glass prism slot window */}
          <g className={activeHotspotId === "fgp_glass" ? activeClass : normalClass}>
            <rect x="50" y="54" width="80" height="42" rx="4" />
            <path d="M 60 75 Q 80 55 100 75 T 120 75" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="90" y="88" textAnchor="middle" className="fill-sky-400 font-mono text-[6px]">GLASS PRISM</text>
          </g>
          
          {/* CMOS Matrix photo camera */}
          <g className={activeHotspotId === "fgp_camera" ? activeClass : normalClass}>
            <circle cx="190" cy="75" r="16" />
            <circle cx="190" cy="75" r="8" fill="#475569" />
            <text x="190" y="103" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">CMOS IMAGE SENSOR</text>
          </g>
          
          {/* DSP logic and memory storage flash */}
          <rect x="70" y="112" width="140" height="30" rx="3" className={activeHotspotId === "fgp_dsp" ? activeClass : normalClass} />
          <text x="140" y="127" textAnchor="middle" className="fill-slate-300 font-mono text-[7.5px] font-bold">AS608 DSP UNIT</text>
          <text x="140" y="136" textAnchor="middle" className="fill-slate-500 font-mono text-[6px]">ENCRYPTED VECTOR MATCH</text>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_push_button") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="push-button-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-yellow-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-yellow-400 font-mono text-[9px] font-bold tracking-widest">TACTILE MOMENTARY PUSH BUTTON</text>
          
          {/* Molded Plunger button Cap */}
          <g className={activeHotspotId === "btn_cap" ? activeClass : normalClass}>
            <rect x="90" y="52" width="100" height="35" rx="6" />
            <line x1="110" y1="52" x2="110" y2="87" stroke="#000" strokeWidth="1.5" />
            <line x1="130" y1="52" x2="130" y2="87" stroke="#000" strokeWidth="1.5" />
            <line x1="150" y1="52" x2="150" y2="87" stroke="#000" strokeWidth="1.5" />
            <line x1="170" y1="52" x2="170" y2="87" stroke="#000" strokeWidth="1.5" />
            <text x="140" y="73" textAnchor="middle" className="fill-slate-950 font-sans text-[7px] font-extrabold">PLUNGER KEY</text>
          </g>
          
          {/* Click spring dome plate contact trigger */}
          <g className={activeHotspotId === "btn_dome" ? activeClass : normalClass}>
            <path d="M 80 120 Q 140 100 200 120" fill="none" strokeWidth="3" />
            <line x1="140" y1="125" x2="140" y2="135" stroke="#f1f5f9" strokeWidth="3.5" />
            <text x="140" y="138" textAnchor="middle" className="fill-slate-400 font-mono text-[6.5px]">CONTACT SPRING DOME</text>
          </g>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_keypad") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="membrane-keypad-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="142" rx="8" className="stroke-slate-700 fill-slate-900" strokeWidth="2" />
          <text x="150" y="40" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] font-bold tracking-widest">4x4 MEMBRANE KEYPAD MATRIX</text>
          
          {/* 4x4 matrix grid key switches */}
          <g className={activeHotspotId === "key_pads" ? activeClass : normalClass}>
            <rect x="35" y="48" width="130" height="98" rx="4" />
            {Array.from({ length: 4 }).map((_, r) => (
              Array.from({ length: 4 }).map((_, c) => {
                const labels = [
                  ["1", "2", "3", "A"],
                  ["4", "5", "6", "B"],
                  ["7", "8", "9", "C"],
                  ["*", "0", "#", "D"]
                ];
                return (
                  <g key={`${r}-${c}`} transform={`translate(${45 + c * 30}, ${54 + r * 22})`}>
                    <rect x="0" y="0" width="20" height="16" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
                    <text x="10" y="11" textAnchor="middle" className="fill-slate-300 font-mono text-[7px] font-bold">{labels[r][c]}</text>
                  </g>
                );
              })
            ))}
          </g>
          
          {/* Cable ribbon interface */}
          <g className={activeHotspotId === "key_ribbon" ? activeClass : normalClass}>
            <rect x="180" y="58" width="65" height="75" rx="3" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={185 + i * 7} y1="62" x2={185 + i * 7} y2="128" stroke="#cbd5e1" strokeWidth="1.5" />
            ))}
            <text x="212" y="145" textAnchor="middle" className="fill-slate-500 font-mono text-[5px]">8-PIN RIBBON</text>
          </g>
        </svg>
      );
    }

    if (selectedPart.id === "sensor_touch") {
      return (
        <svg viewBox="10 10 280 180" className="w-full max-w-sm h-auto mx-auto select-none" id="ttp223-touch-svg" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="260" height="145" rx="8" className="stroke-rose-600 fill-slate-900" strokeWidth="2" />
          <text x="150" y="42" textAnchor="middle" className="fill-rose-400 font-mono text-[9px] font-bold tracking-widest">TTP223 CAPACITIVE TOUCH SENSOR</text>
          
          {/* Target circular copper field */}
          <g className={activeHotspotId === "tch_pad" ? activeClass : normalClass}>
            <circle cx="85" cy="92" r="32" />
            <circle cx="85" cy="92" r="24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />
            <text x="85" y="96" textAnchor="middle" className="fill-slate-950 font-sans text-[7.5px] font-extrabold tracking-widest animate-pulse">TOUCH ZONE</text>
          </g>
          
          {/* TTP223 controller IC SOT23-6 */}
          <g className={activeHotspotId === "tch_ic" ? activeClass : normalClass}>
            <rect x="175" y="75" width="45" height="35" rx="2" />
            <line x1="170" y1="82" x2="175" y2="82" stroke="#64748b" strokeWidth="2" />
            <line x1="170" y1="92" x2="175" y2="92" stroke="#64748b" strokeWidth="2" />
            <line x1="220" y1="82" x2="225" y2="82" stroke="#64748b" strokeWidth="2" />
            <line x1="220" y1="92" x2="225" y2="92" stroke="#64748b" strokeWidth="2" />
            <text x="197" y="123" textAnchor="middle" className="fill-slate-400 font-mono text-[6px]">TTP223 IC</text>
          </g>
        </svg>
      );
    }

    // Default Fallback basic component wiring graphic (for parts without detailed diagram)
    return (
      <div className="w-full aspect-[4/3] flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-900/40 relative group overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        <div className="relative z-10 text-center p-6">
          <div className="text-4xl text-sky-500 font-mono mb-2 animate-bounce">{selectedPart.symbol}</div>
          <h4 className="font-mono text-slate-300 text-sm font-semibold mb-1">{selectedPart.name}</h4>
          <p className="text-slate-500 text-xs max-w-xs">{selectedPart.shortDesc}</p>
          <div className="mt-4 flex flex-wrap gap-1 items-center justify-center">
            {selectedPart.parameters.map((p, idx) => (
              <span key={idx} className="bg-slate-800/80 text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700/60">
                {p.label}: {p.value}
              </span>
            ))}
          </div>
          <div className="mt-4 text-[10px] text-sky-400/80 font-mono bg-sky-500/10 border border-sky-500/20 py-1.5 px-3 rounded-md max-w-xs inline-flex items-center gap-1">
            <Activity className="w-3 h-3 animate-pulse" /> Try assembling this inside the Sandbox!
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3 mb-4 select-none">
        <div>
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {selectedPart.category} Analyzer
          </span>
          <h3 className="text-base font-extrabold text-slate-100 mt-1 font-sans uppercase tracking-tight">{selectedPart.name}</h3>
        </div>

        {/* Dynamic Navigation Mode Toggle Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-[11px] self-start sm:self-auto font-mono">
          <button
            onClick={() => setViewMode("realphoto")}
            className={`px-3 py-1.5 rounded transition-all font-bold flex items-center gap-1.5 ${
              activeMode === "realphoto" ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Real Photo
          </button>
          {hasHotspots && (
            <button
              onClick={() => setViewMode("crosssection")}
              className={`px-3 py-1.5 rounded transition-all font-bold ${
                activeMode === "crosssection" ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cross-Section
            </button>
          )}
          <button
            onClick={() => setViewMode("blueprint")}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeMode === "blueprint" ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Blueprint/Specs
          </button>
        </div>
      </div>

      {/* Main Diagram Stage */}
      <div className="flex-1 flex flex-col justify-between relative bg-[#050C1C]/40 border border-slate-800/80 rounded-xl p-4 overflow-hidden shadow-2xl min-h-[360px]">
        {/* Decorative Grid Line Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-slate-800/60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-800/60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-800/60 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-slate-800/60 pointer-events-none" />

        {/* Dynamic Frame Layout */}
        {activeMode === "crosssection" && hasHotspots ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch flex-1 py-1">
            {/* Interactive Vector Schematic Render */}
            <div className="md:col-span-7 flex items-center justify-center bg-slate-950/80 rounded-lg p-6 border border-slate-900 relative overflow-hidden min-h-[360px] md:min-h-[480px] select-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#111b2f_1.5px,transparent_1.5px),linear-gradient(to_bottom,#111b2f_1.5px,transparent_1.5px)] bg-[size:18px_18px] opacity-15 pointer-events-none" />
              
              <div className="w-full relative max-w-[480px] md:max-w-[540px] [&_svg]:!max-w-full [&_svg]:mx-auto flex items-center justify-center">
                {renderSVGDiagram()}
              </div>
            </div>

            {/* Vertically Stacked Handcrafted Hotspot Button Navigation */}
            <div className="md:col-span-5 flex flex-col justify-between gap-3.5">
              <div className="space-y-2 font-sans">
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" /> CROSS-SECTION LANDMARKS
                </span>
                
                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[260px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {selectedPart.hotspots?.map((hot, index) => {
                    const isSelected = activeHotspotId === hot.id;
                    return (
                      <button
                        key={hot.id}
                        onClick={() => {
                          if (isSelected) {
                            setActiveHotspotId(null);
                            onClearHotspot();
                          } else {
                            setActiveHotspotId(hot.id);
                            onHoverHotspot(hot.name, hot.description);
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border flex items-center gap-3 transition-all relative cursor-pointer select-none ${
                          isSelected
                            ? "bg-sky-500/[0.05] border-sky-500 text-sky-400 font-semibold"
                            : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/30 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sky-400 shadow-[2px_0_8px_rgba(56,189,248,0.7)]" />
                        )}
                        <span className={`font-mono text-[8.5px] w-5 h-5 flex items-center justify-center rounded font-extrabold shrink-0 ${
                          isSelected ? "bg-sky-400 text-slate-950" : "bg-slate-900 text-slate-600 border border-slate-800/80"
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs block truncate font-sans tracking-tight">{hot.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-slate-900/30 border border-slate-800/80 p-3 rounded-lg text-[10px] text-slate-500 flex items-start gap-1.5 leading-relaxed">
                <span className="text-sky-400 font-extrabold text-[12px] font-mono leading-none">✦</span>
                <p className="font-sans">
                  Use this vertically stacked deck for direct landmark navigation. Hover or click to highlight internal signal layers.
                </p>
              </div>
            </div>
          </div>
        ) : activeMode === "realphoto" ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch flex-1 py-1">
            {/* Real Hardware Photo Display */}
            <div className="md:col-span-7 flex flex-col justify-center items-center bg-slate-950/80 rounded-lg p-4 border border-slate-900 relative min-h-[360px] md:min-h-[480px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.04)_0%,_transparent_75%)] pointer-events-none" />
              
              {isPhotoLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 rounded-lg z-15">
                  <div className="relative w-16 h-16 mb-3 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-sky-500/10 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-2 border-t-sky-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                    <Camera className="w-5 h-5 text-sky-400" />
                  </div>
                  <span className="font-mono text-[10px] text-sky-400 font-extrabold tracking-widest uppercase animate-pulse">
                    RECEIVING SIGNAL...
                  </span>
                  <span className="font-mono text-[8px] text-slate-500 mt-1 uppercase tracking-wider">
                    Resolving physical package profile
                  </span>
                </div>
              )}

              <img
                src={getRealImagePath(selectedPart.id)}
                alt={selectedPart.name}
                referrerPolicy="no-referrer"
                onLoad={() => setIsPhotoLoading(false)}
                className={`w-full h-full max-h-[340px] md:max-h-[420px] object-contain rounded-lg shadow-2xl border border-slate-900 hover:scale-[1.015] transition-all duration-500 mx-auto ${
                  isPhotoLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              />
            </div>
            
            {/* Physical Capture Metadata Panel */}
            <div className="md:col-span-5 flex flex-col justify-between gap-3.5">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest block">
                    IMPORTANT COMPONENT INFORMATION
                  </span>
                </div>
                <h4 className="font-sans font-extrabold text-[#f1f5f9] text-[14px] uppercase tracking-wide">
                  {selectedPart.name} Software Profile
                </h4>
                
                {/* Real-time Pin Telemetry table instead of physical text */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1 text-[9.5px] font-mono text-emerald-400 font-bold uppercase">
                    <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Real-Time Pin Telemetry</span>
                  </div>
                  <div className="space-y-1 max-h-[145px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-900">
                    {getPinTelemetry(selectedPart.id).map((pin, i) => (
                      <div key={i} className="bg-slate-950/60 border border-slate-900 p-2 rounded text-[10px] flex flex-col gap-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-200 font-mono text-[10.5px]">{pin.pinName}</span>
                          <span className="font-mono text-[9px] text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-900/30 px-1.5 py-0.5 rounded">
                            {pin.voltage}
                          </span>
                        </div>
                        <span className="text-slate-400 font-sans text-[9px] leading-tight block">
                          {pin.function}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Software used, programming language compatibility */}
              <div className="border-t border-slate-900 pt-2.5 flex flex-col gap-2 text-[10px] font-mono text-slate-500 select-none">
                <div className="flex flex-col gap-1 bg-slate-950/40 border border-slate-900 p-2.5 rounded-lg">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">SOFTWARE USED:</span>
                  <span className="font-extrabold text-slate-200 text-[10.5px]">
                    {getSoftwareUsed(selectedPart.id, selectedPart.category)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 bg-slate-950/40 border border-slate-900 p-2.5 rounded-lg">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">PROGRAMMING LANGUAGE COMPATIBILITY:</span>
                  <span className="font-extrabold text-sky-400 text-[10.5px]">
                    {getLanguageCompatibility(selectedPart.id, selectedPart.category)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Technical Specifications Blueprint View */
          <div className="flex-1 flex flex-col justify-center py-4 px-1.5 animate-fadeIn">
            <h4 className="font-mono text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3.5 flex items-center gap-1.5 select-none">
              <Eye className="w-4 h-4 text-sky-400" /> Coordinated Blueprint Specifications
            </h4>
            <div className="grid grid-cols-2 gap-3.5">
              {selectedPart.parameters.map((p, idx) => (
                <div key={idx} className="bg-slate-950/40 border border-slate-900 p-3 rounded-lg hover:border-slate-850 transition-colors">
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase block tracking-wider">{p.label}</span>
                  <span className="text-xs font-mono text-slate-200 mt-1 font-bold block">{p.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-[#081226]/50 border border-slate-850 p-3.5 rounded-lg text-xs leading-relaxed">
              <span className="text-[9.5px] font-mono text-indigo-400 font-bold tracking-wider block mb-1 uppercase">Wiring Signal Scheme:</span>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">{selectedPart.connections}</p>
            </div>
          </div>
        )}

        {/* Diagnostic instructional bar */}
        <div className="bg-slate-950/50 border border-slate-900/60 px-3.5 py-2.5 rounded-lg text-center font-mono text-[10px] text-slate-500 flex items-center justify-center gap-1.5 relative z-10 select-none mt-4">
          <HelpCircle className="w-3.5 h-3.5 text-slate-650" />
          {activeMode === "crosssection" ? (
            <span>Use the vertically stacked landmark panel to highlight and reveal internal electronic mechanics.</span>
          ) : activeMode === "realphoto" ? (
            <span>Active pin telemetry monitor. Trace voltage pathways and logic levels across peripheral connections.</span>
          ) : (
            <span>Comprehensive voltage, processor speeds, and physical interface wiring specifications.</span>
          )}
        </div>
      </div>
    </div>
  );
}
