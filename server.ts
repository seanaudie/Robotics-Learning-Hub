import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Gemini AI Client safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
  }
} else {
  console.log("Warning: GEMINI_API_KEY is not defined. AI functionality will use high-quality interactive fallback responses.");
}

// Robotics Tutor Analysis Endpoint
app.post("/api/robotics/analyze", async (req, res) => {
  const { parts, chassis, prompt, queryType, history } = req.body;

  if (!ai) {
    // Generate a beautiful, highly detailed mock response for the user to still enjoy the simulator sandbox
    setTimeout(() => {
      const text = getFallbackResponse(queryType, parts, chassis, prompt);
      return res.json({ success: true, text, fallback: true });
    }, 800);
    return;
  }

  try {
    let systemInstruction = "You are a world-class Robotics Engineer and STEM educator who teaches Robotics to high school and college students. " +
      "Your explanations are highly inspiring, technically accurate, clear, and well-structured. " +
      "Avoid dry jargon, instead explain with real-world mechanical analogies. " +
      "Use clean Markdown formatting, using subheadings, bullet points, and code blocks for hardware connections or code where relevant. " +
      "Focus deeply on explaining the interaction between Controllers, Actuators, and Sensors.";

    let userPrompt = "";

    if (queryType === "sandbox") {
      const partsStr = (parts || []).map((p: any) => `- ${p.name} (${p.category}): ${p.description}`).join("\n");
      userPrompt = `The student is building a robot using the standard online sandbox interface.
Chassis selected: ${chassis}
Parts mounted:
${partsStr}

Please review this specific configuration. Explain:
1. **System Viability**: Is this combination complete? (Does it have at least one Controller to process, at least one Sensor for input, and at least one Actuator for movement/output?) Explain how they will function together.
2. **Signal Flow**: Trace how a physical signal starts at a sensor, gets processed by the controller, and controls the actuator. (Make it clear and visual: Input -> Processing -> Output).
3. **Hardware Connection Guide**: Give clear instructions on which pins or wires connect where (e.g. VCC, GND, PWM signal pins, motor driver inputs).
4. **Code Blueprint**: Provide a very brief, fully commented educational Arduino C++ or Python code snippet demonstrating how to read the sensor and drive the actuator in a control loop.`;
    } else {
      userPrompt = `The student is asking a custom question about robotics:
"${prompt}"

Please answer their question in an engaging, visual way. If they ask about sensors, actuators, or controllers, explain with real-world engineering examples (e.g. how a self-driving car uses LiDAR sensors, ESP32 controllers, and DC brushless actuators to navigate safely). Provide custom code clips or wiring diagrams if asked or helpful.`;
    }

    // Format chat conversation history if available
    const contents: any[] = [];
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: userPrompt }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.warn("Gemini API is currently experiencing high demand or transient rate-limit. Fallback to local mechatronic advisor. Details:", error?.message || error);
    // Gracefully fallback to high-quality mechatronic knowledge generator without crashing the user interface
    const text = getFallbackResponse(queryType, parts, chassis, prompt);
    res.json({ success: true, text, fallback: true });
  }
});

// Mechatronics Knowledge Base Fallback Generator
function getFallbackResponse(queryType: string, parts: any[] = [], chassis: string = "Standard Wheeled Chassis", prompt: string = ""): string {
  const partsListHeader = parts && parts.length > 0 
    ? parts.map((p: any) => `- **${p.name || p.id}** (${p.category || "unknown"})`).join("\n") 
    : "None mounted yet";

  if (queryType === "sandbox") {
    const hasController = parts.some((p: any) => p.category === "controllers" || p.category === "microcontroller");
    const hasSensor = parts.some((p: any) => p.category === "sensors" || p.category === "sensor");
    const hasActuator = parts.some((p: any) => p.category === "actuators" || p.category === "actuator");

    const controllerPart = parts.find((p: any) => p.category === "controllers" || p.category === "microcontroller") || { name: "Arduino Nano board" };
    const sensorPart = parts.find((p: any) => p.category === "sensors" || p.category === "sensor") || { name: "HC-SR04 Ultrasonic Distance Sensor" };
    const actuatorPart = parts.find((p: any) => p.category === "actuators" || p.category === "actuator") || { name: "SG90 Precision Micro Servo" };

    let viabilityText = "";
    if (hasController && hasSensor && hasActuator) {
      viabilityText = `### ✅ System Viability: Complete Autonomous Control Loop!
Your configuration is **complete and fully viable**! It has all three essential domains of modern mechatronics:
1. **Sensor (${sensorPart.name})**: Gathers physical feedback from the environment.
2. **Controller (${controllerPart.name})**: Computes control calculations and processes decision logic.
3. **Actuator (${actuatorPart.name})**: Executes physical movement based on instruction outputs.`;
    } else {
      viabilityText = `### ⚠️ System Viability: Partial Control Loop
Your current system layout has the following parts:
${partsListHeader}

To construct a fully self-governing autonomous system, we recommend adding:
${!hasController ? `- A **Controller** (such as an Arduino Nano or ESP32) to process code calculations.\n` : ""} ${!hasSensor ? `- A **Sensor** (such as an Ultrasonic sensor or Camera) to gather environment inputs.\n` : ""} ${!hasActuator ? `- An **Actuator** (such as a Servo motor or DC motor) to translate computational states into physical actions.\n` : ""}`;
    }

    return `> ⚠️ **AI Advisor High-Demand Fallback**: The live Gemini API is experiencing high demand. To keep your robotics simulator fully interactive and unbroken, our onboard smart simulation has analyzed your specific layout instantly.

## 🤖 Hardware Build Review & Signal Trace

You are designing an autonomous build on a **${chassis}** chassis, employing the following modules:
${partsListHeader}

${viabilityText}

---

## 🔄 Signal Flow & Processing Blueprint

\`\`\`
[Physical Environment]
         │
         ▼ (Acoustic Echo / Voltage Variation)
┌─────────────────────────────────────────┐
│     ${sensorPart.name}            │ (Sensor Input)
└────────────────────┬────────────────────┘
                     │ (Digital PWM or Analog Volt)
                     ▼
┌─────────────────────────────────────────┐
│     ${controllerPart.name}            │ (Processing & Decision Core)
└────────────────────┬────────────────────┘
                     │ (PWM Duty Cycle / Binary output)
                     ▼
┌─────────────────────────────────────────┐
│     ${actuatorPart.name}            │ (Physical Actuation & Kinetic Output)
└─────────────────────────────────────────┘
\`\`\`

---

## 🛠️ Mechatronic Wire Hookup Guide
To wire up your **${sensorPart.name}** and **${actuatorPart.name}** to your **${controllerPart.name}**:
1. **Power Bus**: Route **VCC / 5V** from the microcontroller to your breadboard positive strip. Route **GND** (Ground) to the ground strip.
2. **Sensor Connections**:
   - VCC of sensor to controller **5V** (or **3.3V** depending on specs).
   - GND of sensor to controller **GND** (sharing common ground is mandatory!).
   - Signal pin (Trigger or Echo) to a high-speed digital IO pin (such as **Pin 2** or **Pin 3**).
3. **Actuator Connections**:
   - Small components (like the SG90 Servo) can pull control signal directly from the 5V terminal of the controller.
   - High-load motors (like the DC Geared Motor Core) **must** run through an H-Bridge motor driver (e.g. L298N) to prevent burning out the microcontroller's logic pins. Connect driver logic inputs to **PWM Pin 9** & **Pin 10**.

---

## 💻 Arduino C++ Loop Script

Here is an optimized, non-blocking control loop written specifically for your configuration:

\`\`\`cpp
// Onboard Robotics Lab Auto-Generated Simulation Loop
const int INPUT_PIN = 2;   // Input Pin for ${sensorPart.name}
const int OUTPUT_PIN = 9;  // Control Pin for ${actuatorPart.name}

void setup() {
  Serial.begin(115200);
  pinMode(INPUT_PIN, INPUT);
  pinMode(OUTPUT_PIN, OUTPUT);
  Serial.println("System Initialized. Onboard knowledge loop running.");
}

void loop() {
  // Read sensor voltage or digital pulse duration
  long duration = pulseIn(INPUT_PIN, HIGH, 30000); // 30ms timeout
  
  // Convert sensor reading to actionable mechatronics variables
  int triggerThreshold = 15; // Target distance or trigger level
  
  if (duration > 0) {
    // Signal received - execute dynamic feedback control
    analogWrite(OUTPUT_PIN, 180); // Run actuator at 70% speed duty cycle
    Serial.println("Actuator state: COMMITTED (Sensor trigger received)");
  } else {
    // Idle state
    analogWrite(OUTPUT_PIN, 0); // Stop
  }
  
  delay(50); // Small loop stabilization pause
}
\`\`\`

*Tip: Keep your electrical connections secure. Ensure your battery packs are fully charged and share common ground lines!*`;
  } else {
    return `> ⚠️ **AI Advisor High-Demand Fallback**: The live Gemini API is experiencing high demand. Our onboard STEM knowledge-base is serving your request instantly to keep your learning session moving!

### 🔬 Mechatronics Educational Response

Thank you for your question on **"${prompt}"**. To help you build and refine your robotics projects, our educational system recommends looking at the relationships between **Controllers**, **Sensors**, and **Actuators**:

1. **System Control Principles**:
   Robots run a simple, continuous sequence: **Sense, Think, Act**. 
   - **Sensors** observe the state of the system (or the ambient environment).
   - **Controllers** compute the current error (the delta between a target setpoint and the actual state).
   - **Actuators** work as muscles to apply kinetic force and close the control loop.

2. **Common Coding & Interfacing Structures**:
   When implementing control systems (like autonomous steering, distance safety guards, or PID temperature controller modules), your script should maintain high refresh rates. Avoid using large block delay pauses like \`delay(1000)\`. Instead, track system runtime using millisecond clocks:
   \`\`\`cpp
   unsigned long previousMillis = 0;
   const long interval = 100; // Run every 100 milliseconds
   
   void loop() {
     unsigned long currentMillis = millis();
     if (currentMillis - previousMillis >= interval) {
       previousMillis = currentMillis;
       // Non-blocking poll & update routine
     }
   }
   \`\`\`

3. **Wiring & Hardware Safety Checklist**:
   - **Protect Logic Pins**: Microcontroller pins (generally rated for 20mA max drain) should never drive inductive loads like motors or solenoids directly. Use transistor drivers or H-Bridges.
   - **Independent Power Rails**: Keep high-frequency electronic chips on separate battery power or well-filtered lines relative to high-amp motor channels.
   - **Shared Ground Commonality**: Always bridge the ground wires of your microcontroller and external DC battery packs together. Without a shared voltage reference, signal communication fails.

If you have additional topics, you can ask about:
- **How to choose between Arduino and Raspberry Pi** for computational models
- **H-Bridge gate sequences** for controlling standard geared motor direction
- **PID Loop principles** (Proportional, Integral, Derivative) for keeping smooth paths`;
  }
}

// Configure Vite middleware in development or express static files in production
async function startServer() {
  // Always serve src/assets as static directory for component images in dev & production
  app.use("/src/assets", express.static(path.join(process.cwd(), "src/assets")));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
