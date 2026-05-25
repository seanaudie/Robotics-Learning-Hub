export type PartCategory = "actuator" | "sensor" | "microcontroller" | "motordriver";

export interface HardwarePin {
  pinName: string;
  targetPin: string;
  description: string;
}

export interface RoboticPart {
  id: string;
  name: string;
  category: PartCategory;
  sensorApplication?: "sound" | "touch" | "vision" | "light" | "environment" | "motion" | "security";
  symbol: string; // Brief mnemonic e.g. "S-ULS" for Ultrasonic Sensor
  shortDesc: string;
  description: string; // Rich detailed description
  howItWorks: string; // Under the hood mechanism
  realWorldExample: string; // Self-driving car, factory, assembly line, etc.
  connections: string; // Explains wiring connections
  parameters: { label: string; value: string }[];
  trivia: string;
  // Interior hotspots details for active cross-section explore
  hotspots?: {
    id: string;
    name: string;
    description: string;
    x: number; // percentage coordinate X
    y: number; // percentage coordinate Y
  }[];
}

export interface SandboxedPart {
  sandboxId: string;
  partId: string;
  x: number; // grid column (0-3) or offset
  y: number; // grid row (0-3) or offset
}

export type ChassisType = "rover_wheeled" | "arm_robotic" | "crawler_tank";

export interface Chassis {
  id: ChassisType;
  name: string;
  description: string;
  maxSlots: number;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: PartCategory | "general";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
