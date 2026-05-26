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
      let title = "Robotics Lab Simulated Analysis";
      let text = "";

      if (queryType === "sandbox") {
        const partsList = parts && parts.length > 0 ? parts.map((p: any) => `- **${p.name}** (${p.category})`).join("\n") : "None";
        text = `### 🤖 Live Simulation Feedback (Trial Mode)

You have successfully designed a robot built on a **${chassis || "Standard wheeled"}** platform with the following core components:
${partsList}

#### How these parts work together:
1. **Controllers & Brains**: Your controller coordinates input and output timings. In real hardware, make sure to link the ground pins of the battery and your microcontroller to prevent voltage reference drift.
2. **Sensors Input**: Sensors gather physical data and map them into variable readings.
3. **Actuators Control**: Actuators translate computational decisions into physical rotation, force, or movement.

#### recommended Hardware Connections
- **Servo Motor control**: Direct signal wire to an I/O pin (such as Pin 9 for PWM output). Ensure you provide a separate high-current power stream (e.g. 5V/6V) to prevent resetting the controller when motors draw peak current.
- **Sensor reading**: Connect ultrasonic pins or analog sensor signals with proper pull-up/pull-down resistors.

*Tip: Set up your **GEMINI_API_KEY** in the **Secrets** manager of AI Studio to get personalized, live AI reasoning and fully custom Arduino code tailored to this exact build!*`;
      } else {
        text = `### ⚡ Robotics Advisor Reply (Trial Mode)

Thank you for your question about *"${prompt || "general robotics"}"*. 

To help you learn:
- **Controllers** wait for incoming inputs, calculate using control loops (like PID), and output commands to motor drivers.
- **Sensors** measure ambient attributes (such as distance with Ultrasonic soundwaves, orientation with Gyroscopes, or light values with Photoresistors).
- **Actuators** carry out movement (such as DC Motors for driving, Servo Motors for precision angular control, or Saccadic cameras).

*Tip: Connect your own **GEMINI_API_KEY** via the AI Studio Settings menu to ask our AI Tutor custom questions and receive dynamic full-scale explanations with charts and schema diagrams!*`;
      }

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
      const partsStr = parts.map((p: any) => `- ${p.name} (${p.category}): ${p.description}`).join("\n");
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
    console.error("Gemini API Error:", error);
    res.status(500).json({ success: false, error: error.message || "An error occurred with Gemini API." });
  }
});

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
