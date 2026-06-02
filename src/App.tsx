/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ROBOTIC_PARTS } from "./data";
import { RoboticPart, ChatMessage } from "./types";
import InteractiveDiagram, { getRealImagePath } from "./components/InteractiveDiagram";
import RoboticsGuide from "./components/RoboticsGuide";
import { ControlSystemsLab } from "./components/ControlSystemsLab";
import AIChatTutor from "./components/AIChatTutor";
import RoboticsFlowSystem from "./components/RoboticsFlowSystem";
import AIOutputRenderer from "./components/AIOutputRenderer";
import HomePage from "./components/HomePage";
import PremiumLogo from "./components/PremiumLogo";
import { CreatorProfileModal } from "./components/CreatorProfileCard";
import { Cpu, Zap, Eye, HelpCircle, HardDrive, Compass, BookOpen, Clock, Activity, Settings, Sparkles, MessageSquare, ChevronLeft, ChevronRight, Terminal, Radio, Layers, Info, Sliders, Database, Code2, Network, X, Brain, Check, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface SignalDetails {
  type: string;
  waveType: "sine" | "square" | "pwm" | "flat" | "serial" | "stepper";
  frequency: string;
  amplitude: string;
  efficiency: string;
  description: string;
  voltageRange: string;
  signalDomain: "Analog" | "Digital";
}

const getSignalInfo = (partId: string, partCategory: string, hotspotId?: string | null): SignalDetails => {
  if (hotspotId) {
    const idLower = hotspotId.toLowerCase();
    if (idLower.includes("pins_a") || idLower.includes("analog") || idLower.includes("pot") || idLower.includes("receiver") || idLower.includes("gyro") || idLower.includes("ram")) {
      return {
        type: "Analog Voltage Level",
        waveType: "sine",
        frequency: "Variable (0 - 500 Hz)",
        amplitude: partId.includes("32") || partId.includes("imu") || partId.includes("camera") || partId.includes("pi") || partId.includes("jetson") ? "3.30 Vpp" : "5.00 Vpp",
        efficiency: "98.7% Signal-to-Noise Ratio",
        description: "Varying smooth analog sensor outputs converted into system-quantized voltage levels.",
        voltageRange: partId.includes("32") || partId.includes("imu") || partId.includes("camera") || partId.includes("pi") || partId.includes("jetson") ? "0.0V - 3.3V" : "0.0V - 5.0V",
        signalDomain: "Analog"
      };
    }
    if (idLower.includes("pins_d") || idLower.includes("gpio") || idLower.includes("servo") || idLower.includes("header") || idLower.includes("trigger") || idLower.includes("echo") || idLower.includes("buzzer") || idLower.includes("piezo")) {
      return {
        type: "Pulse Width Modulation (PWM)",
        waveType: "pwm",
        frequency: partId.includes("servo") || partId.includes("pca") ? "50 Hz (Servo Lock Frame)" : "490 Hz (Active GPIO Train)",
        amplitude: partId.includes("32") || partId.includes("pi") || partId.includes("jetson") ? "3.30 Vpp" : "5.00 Vpp",
        efficiency: "99.5% Waveform Symmetry",
        description: "Varying cycle square pulses expressing rotational targets or duty outputs.",
        voltageRange: partId.includes("32") || partId.includes("pi") || partId.includes("jetson") ? "0.0V - 3.3V" : "0.0V - 5.0V",
        signalDomain: "Digital"
      };
    }
    if (idLower.includes("usb") || idLower.includes("ant") || idLower.includes("serial") || idLower.includes("chip") || idLower.includes("mcu") || idLower.includes("cpu") || idLower.includes("i2c") || idLower.includes("comparator")) {
      return {
        type: "High-Speed Communication Bus (I2C/SPI)",
        waveType: "serial",
        frequency: partId.includes("esp32") || partId.includes("pi") || partId.includes("jetson") ? "400 kHz to 10 MHz Clock" : "115.2 kbps Baud Rate",
        amplitude: "3.30 Vpp Transmitter Standard",
        efficiency: "99.99% Signal Integrity",
        description: "Dense binary sequence frame transmission delivering custom registers to slave peripherals.",
        voltageRange: "0.0V - 3.3V",
        signalDomain: "Digital"
      };
    }
    if (idLower.includes("motor") || idLower.includes("term") || idLower.includes("hbridge") || idLower.includes("gears") || idLower.includes("brush")) {
      return {
        type: "Inductive High-Power H-Bridge Active Drive",
        waveType: "square",
        frequency: "20.5 kHz Base Frequency",
        amplitude: partId.includes("l298n") ? "12.0 Vpp" : "5.00 Vpp",
        efficiency: "89.2% Motor Driver Efficiency",
        description: "High-current modulated output delivering electrical power directly to continuous windings.",
        voltageRange: partId.includes("l298n") ? "0.0V - 12.0V" : "0.0V - 5.0V",
        signalDomain: "Digital"
      };
    }
  }

  // category fallback/baseline
  if (partCategory === "microcontroller") {
    return {
      type: "High-Impedance Standby Reference",
      waveType: (partId === "controller_raspberry_pi" || partId === "controller_jetson_nano") ? "serial" : "pwm",
      frequency: partId === "controller_raspberry_pi" ? "1.50 GHz Core Resonator" : partId === "controller_jetson_nano" ? "1.43 GHz Quad-Core Resonator" : "16.0 MHz External Clock",
      amplitude: partId.includes("32") || partId.includes("pi") || partId.includes("jetson") ? "3.30 Vpp" : "5.00 Vpp",
      efficiency: "100% High-Z Logic Standby",
      description: "Baseline logic supply operating in full cycle monitor standby mode.",
      voltageRange: partId.includes("32") || partId.includes("pi") || partId.includes("jetson") ? "0.0V - 3.3V" : "0.0V - 5.0V",
      signalDomain: "Digital"
    };
  } else if (partCategory === "motordriver") {
    return {
      type: "Power Controller Steady State",
      waveType: "square",
      frequency: "20.0 kHz Hardware Switch",
      amplitude: partId.includes("l298n") ? "12.0 Vpp Line" : "6.00 Vpp Line",
      efficiency: "94.5% Mosfet/Bipolar Efficiency",
      description: "Low noise baseline voltage rails awaiting directional dynamic pulses.",
      voltageRange: partId.includes("l298n") ? "0.0V - 12.0V" : "0.0V - 6.0V",
      signalDomain: "Digital"
    };
  } else if (partCategory === "sensor") {
    return {
      type: "Analog Transducer Noise Floor",
      waveType: "sine",
      frequency: "Standby 60Hz Filter Ratio",
      amplitude: partId.includes("imu") || partId.includes("camera") || partId.includes("jetson") ? "3.30 Vpp" : "5.00 Vpp",
      efficiency: "95.0% Carrier SNR Rate",
      description: "Active power status with continuous high sensitivity noise floor tracking.",
      voltageRange: partId.includes("imu") || partId.includes("camera") || partId.includes("jetson") ? "0.0V - 3.3V" : "0.0V - 5.0V",
      signalDomain: "Analog"
    };
  } else {
    // actuator
    if (partId.includes("servo") || partId.includes("pca")) {
      return {
        type: "Standard Servo Command (PWM Frame)",
        waveType: "pwm",
        frequency: "50 Hz Target Ref",
        amplitude: "5.00 Vpp Supply Line",
        efficiency: "98.8% Pulse Integrity",
        description: "Positional frame modulation feeding target angles directly.",
        voltageRange: "0.0V - 5.0V",
        signalDomain: "Digital"
      };
    }
    if (partId.includes("stepper")) {
      return {
        type: "Coordinated Phase Quadrature Step Wave",
        waveType: "stepper",
        frequency: "Dual Continuous Increments",
        amplitude: "12.0 Vpp Peak-to-Peak Coil",
        efficiency: "99.9% Microstep Symmetrical Hold",
        description: "Dynamic phase-shifted wave patterns coordinating stepping angles.",
        voltageRange: "0.0V - 12.0V",
        signalDomain: "Digital"
      };
    }
    if (partId.includes("buzzer")) {
      return {
        type: "Acoustic Oscillator Target Frame",
        waveType: "sine",
        frequency: "2.50 kHz Active Alert",
        amplitude: "5.00 Vpp Piezo Drive",
        efficiency: "96.2% Acoustic Transmission",
        description: "Piezoelectric sound oscillation waveform generating warning diagnostics.",
        voltageRange: "0.0V - 5.0V",
        signalDomain: "Analog"
      };
    }
    return {
      type: "Continuous DC Traction Drive Output",
      waveType: "square",
      frequency: "Direct Ripple Spectrum",
      amplitude: "5.00 Vpp Line Output",
      efficiency: "88.0% Coupling Factor",
      description: "Raw active current flow rotating permanent magnet magnetic elements.",
      voltageRange: "0.0V - 5.0V",
      signalDomain: "Digital"
    };
  }
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<"foundations" | "explorer" | "programming" | "electronics" | "control" | "ai" | "chat">("foundations");
  const [explorerSection, setExplorerSection] = useState<"catalog" | "control" | "ai">("catalog");
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [controlLoopModalType, setControlLoopModalType] = useState<"closed" | "open" | null>(null);

  useEffect(() => {
    // Reset to homepage on reload/mount so users don't resume left-off state
    window.location.hash = "home";
  }, []);

  useEffect(() => {
    // Scroll to top immediately when active view or tab changes
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab, isStarted, explorerSection]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#home") {
        setIsStarted(false);
      } else if (hash === "#foundations") {
        setIsStarted(true);
        setActiveTab("foundations");
      } else if (hash === "#control" || hash === "#explorer-control") {
        setIsStarted(true);
        setActiveTab("control");
      } else if (hash === "#ai" || hash === "#explorer-ai") {
        setIsStarted(true);
        setActiveTab("ai");
      } else if (hash.startsWith("#explorer")) {
        setIsStarted(true);
        setActiveTab("explorer");
        setExplorerSection("catalog");
      } else if (hash === "#programming") {
        setIsStarted(true);
        setActiveTab("programming");
      } else if (hash === "#electronics") {
        setIsStarted(true);
        setActiveTab("electronics");
      } else if (hash === "#chat") {
        setIsStarted(true);
        setActiveTab("chat");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Eagerly preload all high-definition hardware images in the background on initial mount
  useEffect(() => {
    const preloadAllImages = () => {
      if (!ROBOTIC_PARTS) return;
      
      // Loop over every parts configuration and preload its respective photographic asset
      ROBOTIC_PARTS.forEach((part) => {
        try {
          const path = getRealImagePath(part.id);
          if (path) {
            const img = new Image();
            img.src = path;
          }
        } catch (e) {
          // Fail gracefully if path resolution has any issues
          console.warn("Preloading failed for part:", part.id, e);
        }
      });
    };

    if (typeof window !== "undefined") {
      // Use requestIdleCallback if supported to avoid blocking main thread start animations, otherwise defer
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(() => preloadAllImages());
      } else {
        setTimeout(preloadAllImages, 1500);
      }
    }
  }, []);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string>("controller_arduino");
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [selectedSensorSubcategory, setSelectedSensorSubcategory] = useState<string>("sound");
  const [selectedActuatorSubcategory, setSelectedActuatorSubcategory] = useState<string>("motion");

  // Hotspot details hover state
  const [hoveredHotspot, setHoveredHotspot] = useState<{ name: string; desc: string } | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const selectedPart = ROBOTIC_PARTS.find((p) => p.id === selectedPartId) || ROBOTIC_PARTS[0];

  const handleHoverHotspot = (name: string, desc: string) => {
    setHoveredHotspot({ name, desc });
  };

  const handleClearHotspot = () => {
    setHoveredHotspot(null);
  };

  const scrollToDiagnostics = () => {
    setTimeout(() => {
      const element = document.getElementById("station-diag-section");
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        
        if (window.innerWidth < 1024) {
          // Mobile: catalog is on top, diagnostics are below. Scroll down to show results.
          const offsetPosition = absoluteElementTop - 30; // professional breathing room spacer
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        } else {
          // Desktop: "Different from mobile user"
          // When lower components or fold results are focused, scroll UP to make sure the
          // live diagnostics station and interactive diagram remain comfortably pinned at the top.
          const offsetPosition = absoluteElementTop - 24; // aligned with desktop header height grid
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    }, 120);
  };

  // Triggers API Call to backend Express server proxying Gemini
  const handleAnalyzeBuild = async (mountedParts: RoboticPart[], chassisName: string) => {
    setSandboxLoading(true);
    setSandboxResponse(null);

    try {
      const response = await fetch("/api/robotics/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryType: "sandbox",
          parts: mountedParts,
          chassis: chassisName,
        }),
      });

      if (!response.ok) {
        throw new Error("Advisor system encountered an error. Please try again.");
      }

      const data = await response.json();
      if (data.success) {
        setSandboxResponse(data.text);
      } else {
        throw new Error(data.error || "Failed to analyze chassis loops.");
      }
    } catch (err: any) {
      setSandboxResponse(`### [System Warning]\n\nFailed to establish link with AI Advisor: ${err.message || "Unknown communication state."}`);
    } finally {
      setSandboxLoading(false);
    }
  };

  // Handle Chat Tutor custom message sending
  const handleSendMessage = async (prompt: string, history: ChatMessage[]): Promise<string> => {
    setChatLoading(true);
    try {
      const response = await fetch("/api/robotics/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queryType: "chat",
          prompt: prompt,
          history: history.slice(-5), // Keep a small slice of context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive feedback from the AI core.");
      }

      const data = await response.json();
      if (data.success) {
        return data.text;
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      return `Failed to connect with AI Tutor: ${err.message || "Check your API connection parameters and try again."}`;
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      {!isStarted ? (
        <HomePage 
          onEnter={(startingTab) => {
            window.location.hash = startingTab || "foundations";
          }} 
          onOpenCreatorModal={() => setIsCreatorModalOpen(true)}
        />
      ) : (
        <div className="min-h-screen bg-[#020617] text-slate-50 flex font-sans relative overflow-x-hidden antialiased">
          {/* Left Action Sidebar Companion Spacer to prevent layout reflow */}
          <div className={`${isSidebarExpanded ? "w-64" : "w-20"} shrink-0 md:block hidden transition-all duration-300 h-screen`} />
          {/* Left Action Sidebar (Geometric Balance styling) */}
          <aside className={`fixed left-0 top-0 bottom-0 ${isSidebarExpanded ? "w-64" : "w-20"} border-r border-slate-800 flex flex-col py-8 bg-[#020617] shrink-0 md:flex hidden z-20 transition-all duration-300 h-screen overflow-y-auto overflow-x-hidden scrollbar-none`}>
            <button
              onClick={() => { window.location.hash = "home"; }}
              className="flex items-center justify-center px-4 mb-8 cursor-pointer hover:opacity-85 transition-opacity"
              title="Return to Homepage"
            >
              <PremiumLogo className="w-11 h-11" />
            </button>
 
            <nav className="flex flex-col gap-2 w-full px-2">
              {[
                { id: "foundations", label: "Core Foundations", icon: Layers },
                { id: "programming", label: "Learn Programming", icon: Code2 },
                { id: "electronics", label: "Learn Electronics", icon: Zap },
                { id: "control", label: "Control Systems", icon: Sliders },
                { id: "ai", label: "AI Robotics Systems", icon: Sparkles },
                { id: "explorer", label: "Component Diagnostics", icon: Compass },
                { id: "chat", label: "Advisor", icon: MessageSquare },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;
 
                return (
                  <button
                    key={tab.id}
                    onClick={() => { window.location.hash = tab.id; }}
                    className={`flex ${isSidebarExpanded ? "flex-row items-center gap-3 px-4" : "flex-col items-center justify-center gap-1.5 p-3"} rounded-xl transition-all duration-200 ${
                      isSelected
                        ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-bold"
                        : "text-slate-500 hover:text-slate-200 hover:bg-slate-900/40"
                    }`}
                  >
                    <IconComp className="w-5 h-5 shrink-0" />
                    {isSidebarExpanded && <span className="font-mono font-bold uppercase text-[10.5px] tracking-tight truncate max-w-[170px]">{tab.label}</span>}
                  </button>
                );
              })}
            </nav>

            {/* Creator Badge in Sidebar */}
            <div className="mt-auto px-4 mb-3 pt-3 border-t border-slate-900 select-none">
              {isSidebarExpanded ? (
                <div 
                  onClick={() => setIsCreatorModalOpen(true)}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-sky-500/25 transition-all duration-305 relative group overflow-hidden cursor-pointer"
                  title="View System Creator Profile"
                >
                  <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-sky-500/20 via-sky-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex flex-col gap-1 select-none text-left">
                    <span className="font-mono text-[8px] text-sky-405 text-sky-400 tracking-widest font-extrabold pb-0.5 uppercase block">SYSTEM AUTHOR</span>
                    <h4 className="font-sans font-black text-[11px] text-white uppercase tracking-tight truncate leading-tight">Sean Audie I. Buscano II</h4>
                    <p className="font-sans text-[8.5px] text-slate-400 leading-none">AI &amp; Robotics Educator</p>
                    <p className="font-sans text-[8.5px] text-slate-500 leading-none">Electronics Engineer</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mb-1">
                  <button
                    onClick={() => setIsCreatorModalOpen(true)}
                    className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-950 text-sky-400 flex items-center justify-center hover:bg-sky-500/10 hover:border-sky-500/40 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)] transition-all cursor-pointer"
                    title="View System Creator Profile"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="px-4 pb-2">
              <button 
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
                className="w-full flex items-center justify-center lg:justify-start gap-3 text-slate-500 hover:text-white transition-colors p-3 rounded-xl hover:bg-slate-900/40"
              >
                {isSidebarExpanded ? <ChevronLeft className="w-6 h-6 shrink-0" /> : <ChevronRight className="w-6 h-6 shrink-0" />}
                {isSidebarExpanded && <span className="font-mono font-bold uppercase text-xs">Collapse</span>}
              </button>
            </div>
          </aside>

          {/* Mobile Bottom Navigation Bar removed from fixed mode */}

          {/* Main Container */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
            {/* Absolute Geometric Digital Grid Accents */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Cyberpunk Top Ambient Glow Grid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-gradient-to-b from-sky-500/10 to-transparent blur-[80px] pointer-events-none" />

            {/* Primary Header Interface */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md relative z-10 select-none">
              <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Logo Name block */}
                <button
                  onClick={() => { window.location.hash = "home"; }}
                  className="flex items-center gap-3 text-left hover:opacity-85 active:scale-[0.99] transition-all cursor-pointer select-none group focus:outline-none"
                  title="Return to Homepage"
                >
                  <PremiumLogo className="w-8 h-8 md:hidden group-hover:scale-105 transition-transform duration-200" glow={true} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-extrabold text-[15px] sm:text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors">Robotics Learning Hub</span>
                      <span className="bg-sky-500/10 text-sky-405 text-sky-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-sky-500/20 font-bold">STEM Build v2.0</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono group-hover:text-slate-400 transition-colors">Interactive Hardware Cross-Sections &amp; AI Co-pilot</p>
                  </div>
                </button>

                {/* Right Status Panel Details */}
                <div className="flex items-center text-right font-mono text-slate-300 ml-auto">
                  {/* Small Creator Label in Header */}
                  <div 
                    onClick={() => setIsCreatorModalOpen(true)}
                    className="flex flex-col text-right select-none cursor-pointer hover:opacity-80 transition-opacity"
                    title="View System Creator Profile"
                  >
                    <span className="font-mono text-[8.5px] text-sky-400 font-extrabold tracking-widest uppercase text-right">Developer</span>
                    <span className="font-sans font-black text-[11px] text-slate-200 leading-tight block">Sean Audie I. Buscano II</span>
                    <span className="font-sans text-[8.5px] text-slate-505 text-slate-400 leading-none font-bold block mt-0.5">AI &amp; Robotics Educator • Electronics Engineer</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Central Screen Platform Segment Controls */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 md:pb-6 flex flex-col gap-6 relative z-10">
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                {/* Active Tab Core Foundations Overview */}
                {activeTab === "foundations" && (
                  <div className="lg:col-span-12 w-full animate-fadeIn shrink-0">
                    <RoboticsFlowSystem />
                  </div>
                )}

                {/* Active Tab Explorer Content layout */}
                {activeTab === "explorer" && (
                  <div className="lg:col-span-12 flex flex-col gap-6 w-full animate-fadeIn">
                    
                    {explorerSection === "catalog" && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full animate-fadeIn">
                    <div className="lg:col-span-4 flex flex-col gap-4">
                      <div className="bg-[#050C1C]/90 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4 backdrop-blur-md relative overflow-hidden group">
                        {/* Interactive scanline beam glow */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent pointer-events-none" />
                        
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                          <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-bold text-sky-400 font-mono text-sm antialiased">
                            01
                          </div>
                          <div>
                            <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest block">System Catalog</span>
                            <h3 className="font-sans font-extrabold text-xs text-slate-100 uppercase tracking-tight">HARDWARE DECK</h3>
                          </div>
                        </div>

                        {/* Hardware Catalog Category Deck */}
                        <div className="space-y-4">
                          {([
                            { id: "microcontroller", name: "Microcontrollers", icon: <Cpu className="w-3.5 h-3.5 text-sky-400" />, badgeColor: "bg-sky-500/10 text-sky-400 border border-sky-500/20" },
                            { id: "sensor", name: "Sensors", icon: <Eye className="w-3.5 h-3.5 text-indigo-400" />, badgeColor: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" },
                            { id: "actuator", name: "Actuators", icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />, badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
                            { id: "motordriver", name: "Motor Drivers", icon: <Sliders className="w-3.5 h-3.5 text-amber-500" />, badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20" }
                          ] as const).map((cat, catIdx) => {
                            let partsList = ROBOTIC_PARTS.filter((p) => p.category === cat.id);
                            const totalCount = partsList.length;
                            
                            if (cat.id === "sensor") {
                              partsList = partsList.filter((p) => p.sensorApplication === selectedSensorSubcategory);
                            }
                            if (cat.id === "actuator") {
                              partsList = partsList.filter((p) => p.actuatorApplication === selectedActuatorSubcategory);
                            }

                            return (
                              <div key={cat.id} className={`space-y-2.5 ${catIdx > 0 ? "pt-3.5 border-t border-slate-800/60" : ""}`}>
                                <div className="flex items-center justify-between pl-1 select-none">
                                  <span className="font-mono text-[11px] text-slate-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                    {cat.icon} {cat.name}
                                  </span>
                                  <span className="font-mono text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold">
                                    {totalCount}
                                  </span>
                                </div>

                                {/* Custom Subcategory Filters only for Sensors */}
                                {cat.id === "sensor" && (
                                  <div className="flex flex-wrap gap-1 pb-1 outline-none">
                                    {([
                                      { id: "sound", name: "Sound", color: "border-sky-500/20 bg-sky-500/10 text-sky-300" },
                                      { id: "touch", name: "Touch", color: "border-pink-500/20 bg-pink-500/10 text-pink-300" },
                                      { id: "vision", name: "Vision", color: "border-purple-500/20 bg-purple-500/10 text-purple-300" },
                                      { id: "light", name: "Light", color: "border-amber-500/20 bg-amber-500/10 text-amber-350" },
                                      { id: "environment", name: "Env", color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" },
                                      { id: "motion", name: "Motion", color: "border-blue-500/20 bg-blue-500/10 text-blue-350" },
                                      { id: "security", name: "Security", color: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300" }
                                    ] as const).map((sub) => {
                                      const isActive = selectedSensorSubcategory === sub.id;
                                      return (
                                        <button
                                          key={sub.id}
                                          onClick={() => setSelectedSensorSubcategory(sub.id)}
                                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all select-none border cursor-pointer ${
                                            isActive
                                              ? "border-sky-500 bg-sky-500/20 text-sky-400 font-bold shadow-[0_0_6px_rgba(56,189,248,0.2)]"
                                              : "border-slate-800/65 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/60"
                                          }`}
                                        >
                                          {sub.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Custom Subcategory Filters only for Actuators */}
                                {cat.id === "actuator" && (
                                  <div className="flex flex-wrap gap-1 pb-1 outline-none">
                                    {([
                                      { id: "motion", name: "Motion", color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-305" },
                                      { id: "display", name: "Display", color: "border-sky-500/20 bg-sky-500/10 text-sky-305" },
                                      { id: "indicator", name: "Alert", color: "border-amber-500/20 bg-amber-500/10 text-amber-305" },
                                      { id: "switch", name: "Switch", color: "border-pink-500/20 bg-pink-500/10 text-pink-305" }
                                    ] as const).map((sub) => {
                                      const isActive = selectedActuatorSubcategory === sub.id;
                                      return (
                                        <button
                                          key={sub.id}
                                          onClick={() => setSelectedActuatorSubcategory(sub.id)}
                                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all select-none border cursor-pointer ${
                                            isActive
                                              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold shadow-[0_0_6px_rgba(16,185,129,0.2)]"
                                              : "border-slate-800/65 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900/60"
                                          }`}
                                        >
                                          {sub.name}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}

                                <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                                  {partsList.length === 0 ? (
                                    <div className="font-mono text-[9px] text-slate-500 italic p-3 text-center border border-slate-900 bg-slate-950/20 rounded-lg w-full">
                                      No components found under this application category
                                    </div>
                                  ) : (
                                    partsList.map((part) => {
                                      const isSelected = selectedPartId === part.id;
                                      return (
                                        <button
                                          key={part.id}
                                          onClick={() => {
                                            setSelectedPartId(part.id);
                                            setActiveHotspotId(null);
                                            setHoveredHotspot(null);
                                            scrollToDiagnostics();
                                          }}
                                          className={`w-full group/btn p-2 rounded-lg border text-left flex items-center justify-between gap-2.5 transition-all relative overflow-hidden cursor-pointer select-none ${
                                            isSelected
                                              ? "border-sky-500 bg-sky-500/[0.04] ring-1 ring-sky-500/30 text-white"
                                              : "border-slate-800/60 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300 hover:text-slate-100"
                                          }`}
                                        >
                                          {/* Left selection neon stick indicator */}
                                          {isSelected && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sky-400 shadow-[2px_0_8px_rgba(56,189,248,0.7)]" />
                                          )}
                                          <div className="truncate flex-1 pl-1">
                                            <h4 className="font-sans font-bold text-[13px] truncate">{part.name}</h4>
                                            {part.category === "sensor" && part.sensorApplication && (
                                              <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider block mt-0.5">
                                                Application: {part.sensorApplication}
                                              </span>
                                            )}
                                            {part.category === "actuator" && part.actuatorApplication && (
                                              <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider block mt-0.5">
                                                Application: {part.actuatorApplication}
                                              </span>
                                            )}
                                          </div>
                                          <span
                                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-extrabold select-none shrink-0 ${
                                              isSelected
                                                ? "bg-sky-400 text-slate-950 shadow-[0_0_8px_rgba(56,189,248,0.4)]"
                                                : cat.badgeColor
                                            }`}
                                          >
                                            {part.symbol}
                                          </span>
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Column 2: Diagnostic Stage (Center Interactive Schematic) */}
                    <div id="station-diag-section" className="lg:col-span-8 flex flex-col gap-4">
                      {/* Interactive Diagram Container with premium corner brackets */}
                      <div className="bg-[#050C1C]/90 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group/stage min-h-[460px]">
                        {/* Interactive scanline beam glow */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/25 to-transparent pointer-events-none" />
                        
                        {/* Aesthetic HUD brackets */}
                        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-slate-600/50 pointer-events-none" />
                        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-slate-600/50 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-slate-600/50 pointer-events-none" />
                        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-slate-600/50 pointer-events-none" />

                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                            <span className="font-mono text-[9px] text-fuchsia-400 font-extrabold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(217,70,239,0.5)] animate-pulse">Component Diagnostics</span>
                          </div>
                          <span className="font-mono text-[8.5px] text-slate-500">REF: 2026-X4</span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center py-2">
                          <InteractiveDiagram
                            selectedPart={selectedPart}
                            onHoverHotspot={handleHoverHotspot}
                            onClearHotspot={handleClearHotspot}
                            activeHotspotId={activeHotspotId}
                            setActiveHotspotId={setActiveHotspotId}
                          />
                        </div>
                      </div>

                      {/* Integrated Diagnostic Dashboard - Combined Pin Telemetry & Signal Waveform Analyzer */}
                      {(() => {
                        const activeHotspot = selectedPart.hotspots?.find(h => h.name === hoveredHotspot?.name) || selectedPart.hotspots?.find(h => h.id === activeHotspotId);
                        const sigInfo = getSignalInfo(selectedPart.id, selectedPart.category, activeHotspot?.id);
                        
                        // Waveform Path selection
                        let pathD = "M 0,30 Q 25,10 50,30 T 100,30 T 150,30 T 200,30"; // Sine fallback
                        let waveStrokeColor = "stroke-emerald-400";
                        let waveGlowColor = "rgba(52,211,153,0.6)";

                        if (sigInfo.waveType === "square") {
                          pathD = "M 0,45 L 25,45 L 25,15 L 75,15 L 75,45 L 125,45 L 125,15 L 175,15 L 175,45 L 200,45";
                          waveStrokeColor = "stroke-amber-400";
                        } else if (sigInfo.waveType === "pwm") {
                          pathD = "M 0,45 L 15,45 L 15,15 L 25,15 L 25,45 L 80,45 L 80,15 L 90,15 L 90,45 L 145,45 L 145,15 L 155,15 L 155,45 L 200,45";
                          waveStrokeColor = "stroke-sky-400";
                        } else if (sigInfo.waveType === "serial") {
                          pathD = "M 0,45 L 10,45 L 10,15 L 18,15 L 18,45 L 22,45 L 22,15 L 34,15 L 34,45 L 38,45 L 38,15 L 42,15 L 42,45 L 60,45 L 60,15 L 72,15 L 72,45 L 76,45 L 76,15 L 84,15 L 84,45 L 92,45 L 92,15 L 104,15 L 104,45 L 120,45 L 120,15 L 132,15 L 132,45 L 145,45 L 145,15 L 155,15 L 155,45 L 180,45 L 180,15 L 200,15";
                          waveStrokeColor = "stroke-indigo-400";
                        } else if (sigInfo.waveType === "stepper") {
                          pathD = "M 0,20 L 30,20 L 30,40 L 90,40 L 90,20 L 150,20 L 150,40 L 200,40";
                          waveStrokeColor = "stroke-emerald-400";
                        } else if (sigInfo.waveType === "flat") {
                          pathD = "M 0,30 L 25,30 L 30,28 L 35,32 L 40,30 L 100,30 L 105,29 L 110,31 L 115,30 L 200,30";
                          waveStrokeColor = "stroke-cyan-400";
                        }

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            
                            {/* LEFT CARD: Real-Time Pin Telemetry Panel */}
                            {hoveredHotspot ? (
                              <div className="bg-[#051124]/90 border border-sky-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(14,165,233,0.15)] animate-fadeIn relative overflow-hidden flex flex-col justify-between min-h-[195px]">
                                <div>
                                  {/* Top ambient status light */}
                                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-sky-400" />
                                  
                                  <div className="flex items-center justify-between border-b border-sky-950/70 pb-2 mb-3">
                                    <span className="font-mono text-[9px] text-sky-400 font-extrabold tracking-widest block uppercase">
                                      REAL-TIME PIN TELEMETRY
                                    </span>
                                    <span className="bg-sky-400/10 text-sky-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-sky-400/20 font-bold animate-pulse">
                                      ANALYSIS ACTIVE
                                    </span>
                                  </div>
                                  
                                  <h4 className="font-sans font-extrabold text-[13px] text-white flex items-center gap-1.5 uppercase tracking-wide truncate">
                                    <Sliders className="w-4 h-4 text-sky-400 animate-spin flex-shrink-0" style={{ animationDuration: '6s' }} /> {hoveredHotspot.name}
                                  </h4>
                                  <p className="font-sans text-[12px] text-slate-300 leading-relaxed mt-1.5 font-medium">
                                    {hoveredHotspot.desc}
                                  </p>
                                </div>

                                {/* Dynamic slider feedback */}
                                <div className="mt-3.5 space-y-2 border-t border-sky-950/70 pt-2.5">
                                  <div>
                                    <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-0.5">
                                      <span>I/O VOLTAGE STATE</span>
                                      <span className="text-sky-400 font-semibold">
                                        {selectedPart.id.includes("32") || selectedPart.id.includes("imu") || selectedPart.id.includes("camera") || selectedPart.id.includes("pi") || selectedPart.id.includes("jetson") ? "3.30 V" : "5.00 V"}
                                      </span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                      <div className="h-full bg-sky-400 rounded-full w-[80%] animate-pulse" />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-0.5">
                                      <span>SIGNAL NOISE TOLERANCE</span>
                                      <span className="text-emerald-400 font-semibold">98.2%</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* Default Idle System Panel State */
                              <div className="bg-[#050C1C]/95 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md flex flex-col justify-between min-h-[195px]">
                                <div>
                                  <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-1.5">
                                    REAL-TIME PIN TELEMETRY
                                  </span>
                                  <div className="bg-slate-900/40 border border-slate-800/50 p-3 rounded-lg text-[11px] text-slate-400 leading-relaxed flex items-start gap-2 select-none">
                                    <span className="text-sky-400 font-bold font-mono text-xs">ⓘ</span>
                                    <p className="font-sans leading-relaxed">
                                      Hover or toggle any of the <strong className="text-sky-300 font-sans font-bold inline">Landmarks</strong> in the Cross-Section view above to run microsecond electronic analyses on the pin paths.
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="border-t border-slate-800/60 pt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
                                  <span>GRID LATENCY: <strong className="text-emerald-400 animate-pulse">1.2ms</strong></span>
                                  <span>IO BUS: <strong className="text-slate-300">STABLE</strong></span>
                                </div>
                              </div>
                            )}

                            {/* RIGHT CARD: Live Signal Waveform Analyzer */}
                            <div className="bg-[#050C1C]/95 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md flex flex-col justify-between min-h-[195px] relative overflow-hidden group/analyzer">
                              {/* Glowing sweep effect */}
                              <div className="absolute top-0 right-0 w-[50px] h-[50px] bg-emerald-500/5 blur-[20px] pointer-events-none" />
                              <style dangerouslySetInnerHTML={{__html: `
                                @keyframes wave-flow {
                                  0% { stroke-dashoffset: 400; }
                                  100% { stroke-dashoffset: 0; }
                                }
                                @keyframes grid-glow {
                                  0%, 100% { opacity: 0.15; }
                                  50% { opacity: 0.3; }
                                }
                              `}} />

                              <div>
                                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-2">
                                  <span className="font-mono text-[9px] text-emerald-400 font-extrabold tracking-widest block uppercase flex items-center gap-1">
                                    <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> WAVEFORM SIGNAL ANALYZER
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded border font-bold select-none uppercase ${
                                      sigInfo.signalDomain === "Analog"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                                    }`}>
                                      {sigInfo.signalDomain}
                                    </span>
                                    <span className="text-[8.5px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold select-none uppercase">
                                      {sigInfo.waveType} WAVE
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-12 gap-2 items-center">
                                  {/* Oscilloscope Grid */}
                                  <div className="col-span-12 xs:col-span-7 sm:col-span-7 md:col-span-7">
                                    <div className="relative w-full h-[64px] bg-slate-950 p-[1px] border border-slate-900 rounded-lg overflow-hidden select-none">
                                      {/* Oscilloscope grid lines overlay */}
                                      <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 opacity-20 pointer-events-none" style={{ animation: 'grid-glow 3s infinite' }}>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-b border-emerald-500/30"></div>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-r border-b border-emerald-500/30"></div>
                                        <div className="border-b border-emerald-500/30"></div>
                                        <div className="border-r border-emerald-500/30"></div>
                                        <div className="border-r border-emerald-500/30"></div>
                                        <div className="border-r border-emerald-500/30"></div>
                                        <div className="border-r border-emerald-500/30"></div>
                                        <div></div>
                                      </div>

                                      {/* Center reference dash lines */}
                                      <div className="absolute top-1/2 left-0 right-0 h-[1px] border-t border-dashed border-emerald-500/15 pointer-events-none"></div>

                                      <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                                        {/* Under-glow line */}
                                        <path
                                          d={pathD}
                                          fill="none"
                                          className={`${waveStrokeColor} opacity-35 stroke-[3] filter blur-[2px]`}
                                          style={{
                                            strokeDasharray: '400',
                                            animation: 'wave-flow 5s linear infinite'
                                          }}
                                        />
                                        
                                        {/* Main Trace line */}
                                        <path
                                          d={pathD}
                                          fill="none"
                                          className={`${waveStrokeColor} stroke-2`}
                                          style={{
                                            strokeDasharray: '400',
                                            animation: 'wave-flow 5s linear infinite'
                                          }}
                                        />

                                        {/* If stepper motor, overlay Phase B out-of-phase wave */}
                                        {sigInfo.waveType === "stepper" && (
                                          <>
                                            <path
                                              d="M 0,40 L 30,40 L 30,20 L 90,20 L 90,40 L 150,40 L 150,20 L 200,20"
                                              fill="none"
                                              className="stroke-violet-500 stroke-2 opacity-55"
                                              style={{
                                                strokeDasharray: '400',
                                                animation: 'wave-flow 5s linear infinite',
                                                animationDelay: '1.25s'
                                              }}
                                            />
                                          </>
                                        )}
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Right Text Stats */}
                                  <div className="col-span-12 xs:col-span-5 sm:col-span-5 md:col-span-5 space-y-1 pl-1">
                                    <span className="font-mono text-[9px] text-[#f1f5f9] font-extrabold uppercase line-clamp-1 block leading-tight">
                                      {sigInfo.type}
                                    </span>
                                    <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[10px] font-mono leading-none pt-0.5">
                                      <div>
                                        <span className="text-slate-400 block uppercase">FREQUENCY</span>
                                        <span className="text-slate-200 font-bold tracking-tight block truncate mt-0.5">{sigInfo.frequency}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block uppercase">AMPLITUDE</span>
                                        <span className="text-slate-200 font-bold block truncate mt-0.5">{sigInfo.amplitude}</span>
                                      </div>
                                      <div className="mt-1">
                                        <span className="text-slate-400 block uppercase">RANGE</span>
                                        <span className="text-slate-200 font-bold block mt-0.5">{sigInfo.voltageRange}</span>
                                      </div>
                                      <div className="mt-1">
                                        <span className="text-slate-500 block uppercase">INTEGRITY</span>
                                        <span className="text-emerald-400 font-bold block mt-0.5 truncate">{sigInfo.efficiency.split(" ")[0]}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <p className="font-sans text-[10px] text-slate-400 leading-snug pt-2 mt-2 border-t border-slate-800/50">
                                <span className="font-mono text-[8px] text-emerald-400 font-extrabold tracking-wider block mb-0.5 uppercase">PHYSICAL SIGNAL PATHWAY</span>
                                {sigInfo.description}
                              </p>
                            </div>

                          </div>
                        );
                      })()}

                      {/* Specification Engine (Repositioned here under telemetry and waveform analyzer) */}
                      <div className="w-full bg-[#050C1C]/90 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
                        {/* Soft subtle vertical light gradient */}
                        <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-sky-500/5 blur-[30px] pointer-events-none" />

                        <div className="space-y-4">
                          <div className="flex items-start justify-between border-b border-slate-800/60 pb-3.5">
                            <div>
                              <span className="font-mono text-[9.5px] text-indigo-400 font-extrabold uppercase tracking-wider block">
                                SPECIFICATION ENGINE
                              </span>
                              <h4 className="font-sans font-extrabold text-[#f1f5f9] text-[18px] uppercase tracking-wide mt-1">{selectedPart.name}</h4>
                              {selectedPart.category === "sensor" && selectedPart.sensorApplication && (
                                <div className="mt-1.5 flex items-center gap-1.5">
                                  <span className="text-[9px] font-mono uppercase bg-slate-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-900/30 font-bold">
                                    APPLICATION: {selectedPart.sensorApplication} SENSING
                                  </span>
                                </div>
                              )}
                              {selectedPart.category === "actuator" && selectedPart.actuatorApplication && (
                                <div className="mt-1.5 flex items-center gap-1.5">
                                  <span className="text-[9px] font-mono uppercase bg-slate-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/30 font-bold">
                                    APPLICATION: {selectedPart.actuatorApplication} ACTUATION
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="font-mono text-[11px] bg-slate-900 text-sky-400 px-2.5 py-1 rounded border border-slate-800 font-bold self-start">
                              {selectedPart.symbol}
                            </span>
                          </div>

                          <div>
                            <span className="font-mono text-[9.5px] text-slate-500 font-bold uppercase block tracking-wider mb-1.5">Theoretical Core Analysis</span>
                            <p className="text-[12.5px] text-slate-300 leading-relaxed font-sans font-medium">{selectedPart.description}</p>
                          </div>

                          {/* Parameters list rendered as cybernetic micro-cards */}
                          <div className="pt-2">
                            <span className="font-mono text-[9.5px] text-slate-500 font-bold uppercase block tracking-wider mb-2.5">Key Performance Characteristics</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {selectedPart.parameters.map((p, idx) => (
                                <div key={idx} className="bg-slate-950/70 border border-slate-900 p-3 rounded-lg hover:border-slate-850 transition-colors">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">{p.label}</span>
                                  <span className="text-[12px] font-mono text-slate-200 font-extrabold mt-1 block truncate">{p.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* How it Works physics block */}
                          <div className="border-t border-slate-800/85 pt-3.5">
                            <span className="font-mono text-[9.5px] text-sky-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                              <Terminal className="w-3.5 h-3.5 text-sky-400" /> PHYSICS & SIGNAL PATHWAYS
                            </span>
                            <p className="text-[13px] text-slate-300 leading-relaxed font-sans font-medium">
                              {selectedPart.howItWorks}
                            </p>
                          </div>

                          {/* Real World context application */}
                          <div className="border-t border-slate-800/85 pt-3.5">
                            <span className="font-mono text-[10.5px] text-indigo-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                              <Database className="w-3.5 h-3.5 text-indigo-400" /> INDUSTRIAL ROBOTIC APPLICATIONS
                            </span>
                            <p className="text-[12px] text-slate-400 leading-relaxed font-sans">
                              {selectedPart.realWorldExample}
                            </p>
                          </div>
                        </div>

                        {/* Interactive Trivia Section */}
                        <div className="mt-5 border-t border-slate-800/85 pt-3.5">
                          <div className="bg-[#081226]/50 border border-indigo-950/75 p-3.5 rounded-lg flex gap-3 w-full animate-fadeIn">
                            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <strong className="text-[10px] text-slate-200 uppercase tracking-widest block font-mono font-bold">Did You Know? (Historical / Physics Fact)</strong>
                              <p className="text-slate-400 font-mono text-[10.5px] leading-relaxed mt-1">
                                {selectedPart.trivia}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Active Tab Control Systems Content layout */}
            {activeTab === "control" && (
              <div className="lg:col-span-12 flex flex-col gap-6 w-full animate-fadeIn">
                <ControlSystemsLab onOpenModal={setControlLoopModalType} />
              </div>
            )}

            {/* Active Tab AI Systems Content layout */}
            {activeTab === "ai" && (
              <div className="lg:col-span-12 flex flex-col gap-6 w-full animate-fadeIn">
                <RoboticsAiCore />
              </div>
            )}

                {/* Active Tab Programming Guide Content layout */}
                {activeTab === "programming" && (
                  <div className="lg:col-span-12 space-y-6">
                    <RoboticsGuide viewType="programming" />
                  </div>
                )}

                {/* Active Tab Electronics Guide Content layout */}
                {activeTab === "electronics" && (
                  <div className="lg:col-span-12 space-y-6">
                    <RoboticsGuide viewType="electronics" />
                  </div>
                )}

                {/* Active Tab Advisor Chat layout */}
                {activeTab === "chat" && (
                  <div className="lg:col-span-12 max-w-3xl mx-auto w-full">
                    <AIChatTutor onSendMessage={handleSendMessage} loading={chatLoading} />
                  </div>
                )}

              </div>
            </main>

            {/* Mobile Bottom Navigation Bar - Sticky Pinned to the Bottom of viewport */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#020715]/95 border-t border-slate-800/90 backdrop-blur-md flex justify-around py-3 px-1 select-none shadow-[0_-8px_32px_rgba(0,0,0,0.6)] z-50">
              {[
                { id: "foundations", label: "Foundations", icon: Layers },
                { id: "programming", label: "Program", icon: Code2 },
                { id: "electronics", label: "Electronics", icon: Zap },
                { id: "control", label: "Control", icon: Sliders },
                { id: "ai", label: "AI Core", icon: Sparkles },
                { id: "explorer", label: "Diag", icon: Compass },
                { id: "chat", label: "Advisor", icon: MessageSquare },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      window.location.hash = tab.id;
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 px-1 py-1 rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "text-sky-400 font-bold bg-sky-500/10"
                        : "text-slate-500 hover:text-slate-200"
                    }`}
                  >
                    <IconComp className="w-4.5 h-4.5 shrink-0" />
                    <span className="font-mono text-[7.5px] uppercase tracking-wider font-extrabold">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Primary Footer */}
            <footer className="border-t border-slate-800 bg-slate-950/40 text-center py-6 font-mono text-[11px] text-slate-400 relative z-10 select-none mt-12 bg-[#020617]">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>Robotics Learning Hub © 2026 — Developed in Dubai, UAE by Sean Buscano</p>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-[9px]">
                  <button 
                    onClick={() => setIsCreatorModalOpen(true)} 
                    className="hover:text-sky-400 transition-colors cursor-pointer text-slate-400 font-extrabold"
                  >
                    [ AUTHOR INDEX ]
                  </button>
                  <span>STEM Build v2.0</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
      <CreatorProfileModal isOpen={isCreatorModalOpen} onClose={() => setIsCreatorModalOpen(false)} />

      {/* Control Loop Decoder Modal Overlay - Top Level to ignore any panel spacing/framing constraints */}
      {controlLoopModalType && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pt-20 pb-20 px-4 sm:p-6 bg-slate-950/95 backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setControlLoopModalType(null)} />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-3xl bg-[#030922] border-2 border-slate-700 rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-2xl z-10 text-left cursor-default max-h-[75vh] md:max-h-[85vh] flex flex-col justify-between"
          >
            {/* Ambient indicator lights */}
            <div className={`absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r ${controlLoopModalType === "closed" ? "from-transparent via-cyan-500 to-transparent" : "from-transparent via-amber-500 to-transparent"}`} />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-900/80 mb-5 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${controlLoopModalType === "closed" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}>
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <span className={`font-mono text-[8px] font-extrabold uppercase tracking-widest block ${controlLoopModalType === "closed" ? "text-cyan-400" : "text-amber-400"}`}>SYSTEM CONTROLLER DECODER</span>
                  <h3 className="font-sans font-black text-sm md:text-base text-slate-100 uppercase tracking-tight">
                    {controlLoopModalType === "closed" ? "Closed-Loop Feedback Control (PID)" : "Open-Loop Bypassed Control"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setControlLoopModalType(null)}
                className="w-8 h-8 rounded-xl border border-slate-900 bg-slate-950/80 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-400 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body with scroll capability */}
            <div className="space-y-6 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
              {/* 1. CONCEPT & PURPOSE */}
              <div>
                <span className="font-mono text-[8.5px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-1.5">
                  1. CONCEPT &amp; CORE PURPOSE
                </span>
                <p className="text-[12px] text-slate-300 leading-relaxed font-sans">
                  {controlLoopModalType === "closed" 
                    ? "A Closed-Loop feedback control system dynamically maintains a target state by continuously measuring system error and using that error calculation to compute physical corrections. In our self-balancing grid, angular deviations are measured by IMU accelerometers, piped to the calculations unit, and fed back to correct wheel acceleration. This feedback loops continuously to prevent balance tipping." 
                    : "An Open-Loop control system executes commands blindly without verifying the actual state output coordinates. It issues a fixed operating command (such as a constant motor drive signal) regardless of active gravity drift. Because sensors are bypassed or disconnected, minor random interferences or gravity torque cause infinite accumulative error, leading to quick and inevitable physical tipping."
                  }
                </p>
              </div>

              {/* 2. FEEDBACK LOOP DIAGRAM */}
              <div>
                <span className="font-mono text-[8.5px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-1.5">
                  2. SYSTEM FEEDBACK LOOP DIAGRAM
                </span>
                <div className="bg-slate-950 rounded-xl p-2 border border-slate-900/60 overflow-hidden flex justify-center items-center">
                  <img
                    src={controlLoopModalType === "closed" ? "/src/assets/images/closed_loop_diagram_1780216426087.png" : "/src/assets/images/open_loop_diagram_1780216409651.png"}
                    alt={controlLoopModalType === "closed" ? "Closed-Loop Feedback Block Diagram" : "Open-Loop Block Diagram"}
                    referrerPolicy="no-referrer"
                    className="max-h-[220px] object-contain rounded-lg shadow-md border border-slate-900"
                  />
                </div>
              </div>

              {/* 3. ARCHITECTURAL PILLARS */}
              <div>
                <span className="font-mono text-[8.5px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-2">
                  3. KEY ARCHITECTURAL COMPONENT ANALYSIS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {controlLoopModalType === "closed" ? (
                    <>
                      <div className="p-3 bg-[#0a142c]/40 border border-cyan-955/20 rounded-xl">
                        <span className="font-mono text-[8.5px] text-cyan-400 block font-bold mb-0.5 uppercase tracking-wide">Dynamic Compensation (e)</span>
                        <p className="text-[11px] text-slate-400 leading-normal font-sans">The difference between desired balance target and actual IMU orientation. It is computed hundreds of times per second.</p>
                      </div>
                      <div className="p-3 bg-[#0a142c]/40 border border-cyan-955/20 rounded-xl">
                        <span className="font-mono text-[8.5px] text-cyan-400 block font-bold mb-0.5 uppercase tracking-wide">PID Control Unit</span>
                        <p className="text-[11px] text-slate-400 leading-normal font-sans">Computes Proportional (instancy), Integral (past offset), and Derivative (future dampening) terms to drive clean stability.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-[#1e100c]/30 border border-amber-955/20 rounded-xl">
                        <span className="font-mono text-[8.5px] text-amber-500 block font-bold mb-0.5 uppercase tracking-wide">Preset Output Command</span>
                        <p className="text-[11px] text-slate-400 leading-normal font-sans">A fixed drive command sent with zero context on structural deviations, balance tipping, or gravitational pull.</p>
                      </div>
                      <div className="p-3 bg-[#1e100c]/30 border border-amber-955/20 rounded-xl">
                        <span className="font-mono text-[8.5px] text-amber-500 block font-bold mb-0.5 uppercase tracking-wide">Bypassed States</span>
                        <p className="text-[11px] text-slate-400 leading-normal font-sans">No feedback wire exists. Sensor inputs are completely disconnected or ignored, preventing self-balancing math entirely.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 4. REAL-WORLD EXAMPLE APPLICATIONS */}
              <div>
                <span className="font-mono text-[8.5px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-2">
                  4. REAL-WORLD ENGINEERING APPLICATIONS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {controlLoopModalType === "closed" ? (
                    <>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-cyan-300 font-bold block mb-0.5 uppercase tracking-wide font-mono">Self-Balancing Transporters</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">Segways and balancing logistics robots use IMU sensor feedback loops to continuously adjust wheel motors, keeping the passenger deck perfectly flat.</p>
                        </div>
                      </div>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-cyan-300 font-bold block mb-0.5 uppercase tracking-wide font-mono">Automotive Cruise Control</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">Measures speedometer rate to adjust the throttle valve dynamically, maintaining a static cruise speed across steep hills and valleys.</p>
                        </div>
                      </div>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-cyan-300 font-bold block mb-0.5 uppercase tracking-wide font-mono">Thermostatic Climatic HVAC</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">Continually samples ambient temperature, switching cooling cycle mechanisms on or off to precisely regulate room warmth with high accuracy.</p>
                        </div>
                      </div>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-cyan-300 font-bold block mb-0.5 uppercase tracking-wide font-mono">Surgical Robotics</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">High-resolution optical rotational encoders track exact joint positions, ensuring medical instruments execute micro-movements safely.</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-amber-400 font-bold block mb-0.5 uppercase tracking-wide font-mono">Domestic Kitchen Toaster</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">Heats toast on a blind mechanical dual-timer. It does not measure actual bread brownness, frequently leading to scorched toast.</p>
                        </div>
                      </div>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-amber-400 font-bold block mb-0.5 uppercase tracking-wide font-mono">Lawn Sprinkler Timers</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">Sprays lawn grass strictly on pre-scheduled hours. It is unaware of current weather elements, spraying water even during massive downpours.</p>
                        </div>
                      </div>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-amber-400 font-bold block mb-0.5 uppercase tracking-wide font-mono">Basic DC Motor Conveyors</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">Spins a conveyor belt at a fixed supply voltage. Minor load weight differences or friction spikes cause the belt to spin slower or stall.</p>
                        </div>
                      </div>
                      <div className="p-3.5 bg-slate-900/35 border border-slate-800/80 rounded-xl flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-[11px] text-amber-400 font-bold block mb-0.5 uppercase tracking-wide font-mono">Timed Traffic Sign Lights</span>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">Sequence lights strictly on a static loop period. Light phases do not adapt to actual traffic queue build-ups or vacant roads.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Locked Footer Action row to ensure Close/Acknowledge command is always visible without scrolling up */}
            <div className="pt-4 border-t border-slate-900/80 mt-4 shrink-0 flex items-center justify-end w-full">
              <button
                onClick={() => setControlLoopModalType(null)}
                className={`w-full sm:w-auto px-6 py-3 font-mono text-[11px] font-black tracking-widest rounded-xl transition-all duration-200 active:scale-95 cursor-pointer uppercase flex items-center justify-center gap-2 border shadow-lg ${
                  controlLoopModalType === "closed"
                    ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                }`}
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Acknowledged &amp; Close</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

const ControlSystemsLab_OLD = ({ onOpenModal }: { onOpenModal: (type: "closed" | "open") => void }) => {
  // Telemetry tuner coefficients initialized to 0.0 as requested
  const [kp, setKp] = useState(0.0);
  const [ki, setKi] = useState(0.0);
  const [kd, setKd] = useState(0.0);
  
  const [loopType, setLoopType] = useState<"closed" | "open">("closed");
  const [isRunning, setIsRunning] = useState(false);

  const [leftPulseActive, setLeftPulseActive] = useState(false);
  const [rightPulseActive, setRightPulseActive] = useState(false);

  // Inverted Pendulum (Cart-pole) states
  const [theta, setTheta] = useState(0.18); 
  const [thetaDot, setThetaDot] = useState(0.0);
  const [cartX, setCartX] = useState(0.0); 
  const [cartXDot, setCartXDot] = useState(0.0);

  const [errorSum, setErrorSum] = useState(0.0);
  const [history, setHistory] = useState<{ t: number; val: number; sp: number }[]>([]);
  const [timeStep, setTimeStep] = useState(0);

  // Comprehensive reset actions
  const handleReset = () => {
    setErrorSum(0.0);
    setHistory([]);
    setTimeStep(0);
    setIsRunning(false);
    setTheta(0.18);
    setThetaDot(0.0);
    setCartX(0.0);
    setCartXDot(0.0);
  };

  // Instant horizontally guided pulse perturbers
  const handlePerturb = (direction: "left" | "right") => {
    if (!isRunning) setIsRunning(true);
    const pulseSign = direction === "left" ? -1 : 1;
    setThetaDot((prev) => prev + pulseSign * 1.8);
  };

  // Coordinated physical dynamics simulation effect
  useEffect(() => {
    if (!isRunning) {
      if (history.length === 0) {
        const initialPoints = [];
        const baseAngleDeg = 0.18 * (180 / Math.PI);

        for (let i = 0; i < 60; i++) {
          initialPoints.push({ t: i, val: baseAngleDeg, sp: 0 });
        }
        setHistory(initialPoints);
      }
      return;
    }

    const interval = setInterval(() => {
      const dt = 0.03; // Dynamic step delta
      
      // Double-integrator cart-pole system physics formulas
      const g = 9.81;
      const L = 1.0;
      const M = 1.1; 
      const dampTheta = 0.08;
      const dampCart = 0.45;

      let F = 0;
      if (loopType === "closed") {
        const currentError = theta;
        const localErrorSum = Math.max(-10, Math.min(10, errorSum + currentError * dt));
        setErrorSum(localErrorSum);

        F = kp * currentError + ki * localErrorSum + kd * thetaDot;
        F = Math.max(-12, Math.min(12, F)) * 14.5; 
      }

      const cartXAccel = (F - dampCart * cartXDot) / M;
      const thetaAccel = (g * Math.sin(theta) - cartXAccel * Math.cos(theta)) / L - dampTheta * thetaDot;

      const nextThetaDot = thetaDot + thetaAccel * dt;
      let nextTheta = theta + nextThetaDot * dt;

      if (nextTheta > Math.PI) nextTheta -= 2 * Math.PI;
      if (nextTheta < -Math.PI) nextTheta += 2 * Math.PI;

      const nextCartXDot = cartXDot + cartXAccel * dt;
      let nextCartX = cartX + nextCartXDot * dt;

      if (nextCartX > 160) {
        nextCartX = 160;
        setCartXDot(-nextCartXDot * 0.15); 
      } else if (nextCartX < -160) {
        nextCartX = -160;
        setCartXDot(-nextCartXDot * 0.15);
      } else {
        setCartXDot(nextCartXDot);
      }

      setTheta(nextTheta);
      setThetaDot(nextThetaDot);
      setCartX(nextCartX);

      const degreeValue = nextTheta * (180 / Math.PI);
      setHistory((prev) => {
        const updated = [...prev, { t: timeStep, val: Math.round(degreeValue * 10) / 10, sp: 0 }];
        if (updated.length > 60) updated.shift();
        return updated;
      });

      setTimeStep((prev) => prev + 1);
    }, 30);

    return () => clearInterval(interval);
  }, [isRunning, kp, ki, kd, loopType, timeStep, history.length, errorSum, theta, thetaDot, cartX, cartXDot]);

  const thetaDegrees = theta * (180 / Math.PI);

  const isStabilized = isRunning && Math.abs(thetaDegrees) < 2.5 && Math.abs(thetaDot) < 0.15;
  const isLossOfControl = Math.abs(thetaDegrees) > 60;
  const isFallen = Math.abs(thetaDegrees) > 60;

  // Static descriptions for Cart-Pole
  const getPExplanation = () => "Applies instantaneous torque force proportional to tilt divergence angle. Causes overshoot if high.";
  const getIExplanation = () => "Aggregates past tilt offsets to offset constant drift or gravitational bias. High values provoke hunting.";
  const getDExplanation = () => "Predicts immediate forward velocity to act as an angular shock absorber. High values block quick response.";

  const getStat1Label = () => "ANGULAR DEVIATION";
  const getStat1Value = () => `${thetaDegrees.toFixed(1)}°`;
  const getStat1Color = () => {
    const val = Math.abs(thetaDegrees);
    return val <= 15 ? "text-emerald-400" : val > 37.5 ? "text-rose-400 animate-pulse font-extrabold" : "text-amber-400";
  };

  const getStat2Label = () => "ANGULAR SPEED (D)";
  const getStat2Value = () => `${thetaDot.toFixed(2)} r/s`;

  const getStat3Label = () => "CART POSITION (X)";
  const getStat3Value = () => `${(cartX / 10).toFixed(1)} cm`;

  const getStat4Value = () => {
    if (loopType === "open") return "FEEDBACK OFF";
    if (isFallen) return "FALLEN / CRASHED";
    if (isLossOfControl) return "LIMIT DIVERGENCE";
    if (isStabilized) return "STEADY LOCK";
    return "BALANCING FEEDBACK";
  };

  return (
    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full animate-fadeIn text-left font-sans">
      
      {/* Dynamic Curriculum Information Card */}
      <div className="lg:col-span-12 bg-[#050C1C]/60 border border-slate-800/80 p-5 rounded-xl flex flex-col md:flex-row gap-5 items-start justify-between backdrop-blur-md">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <h3 className="font-mono text-[11px] text-amber-400 font-extrabold uppercase tracking-wider">
              CORE SYNOPSIS: INVERTED PENDULUM BALANCING
            </h3>
          </div>
          <p className="text-[12.5px] text-slate-300 leading-relaxed max-w-4xl font-sans font-medium">
            A classic, non-linear pole balancing challenge. Actuating forces on the core cart must shift center-of-gravity vectors dynamically, mimicking self-balancing personal transporters.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onOpenModal("open")}
            className="flex-1 md:w-48 text-left bg-slate-950/65 hover:bg-slate-900 border border-slate-900 hover:border-amber-500/40 p-2.5 rounded-lg transition-all group cursor-pointer focus:outline-none"
            title="Click to view Open-Loop Block Diagram and operational characteristics"
          >
            <div className="flex items-center justify-between pointer-events-none mb-0.5">
              <span className="font-mono font-bold text-amber-500 block uppercase text-[8.5px] tracking-widest">OPEN-LOOP SYSTEM</span>
              <span className="font-mono text-[7px] text-amber-500/60 group-hover:text-amber-400 font-extrabold uppercase">DECODE 💡</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug pointer-events-none">Pure command output. Disconnects sensors; runs blind to errors.</p>
          </button>
          
          <button
            type="button"
            onClick={() => onOpenModal("closed")}
            className="flex-1 md:w-48 text-left bg-[#081229]/50 hover:bg-[#0a1633]/70 border border-[#1e2a4a]/40 hover:border-sky-500/50 p-2.5 rounded-lg transition-all group cursor-pointer focus:outline-none"
            title="Click to view Closed-Loop Block Diagram and operational characteristics"
          >
            <div className="flex items-center justify-between pointer-events-none mb-0.5">
              <span className="font-mono font-bold text-sky-400 block uppercase text-[8.5px] tracking-widest">CLOSED-LOOP SYSTEM</span>
              <span className="font-mono text-[7px] text-sky-450 group-hover:text-sky-300 font-extrabold uppercase">DECODE 💡</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug pointer-events-none">Pipes output back to input as feedback, correcting differences.</p>
          </button>
        </div>
      </div>

      {/* Calibration Controls Panel left */}
      <div className="lg:col-span-4 bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/30" />
        
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-widest block">TELEMETRY TUNER UNIT</span>
              <h3 className="font-sans font-black text-xs text-slate-100 uppercase tracking-tight">PID GAIN COEFFICIENTS</h3>
            </div>
          </div>

          {/* Core control engagement - Placed right at the top for maximum prominence */}
          <div className="flex gap-2.5 mb-5 shrink-0">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-2.5 px-4 font-mono text-[10px] font-bold uppercase rounded-lg border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isRunning 
                  ? "border-red-500/40 bg-red-500/10 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                  : "border-amber-500/50 bg-[#020716] text-amber-400 hover:text-white shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              }`}
            >
              <Activity className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
              {isRunning ? "HALT CONTROL" : "ENGAGE CONTROL"}
            </button>
            
            <button
              onClick={handleReset}
              className="px-3.5 border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 rounded-lg text-xs cursor-pointer select-none transition-colors"
              title="Reset simulation parameters"
            >
              Reset
            </button>
          </div>
          
          <div className="mb-4 text-left">
            <label className="font-mono text-[9px] text-amber-500 font-extrabold uppercase tracking-wider block mb-1 select-none">
              Apply Control Loop Technique
            </label>
            <p className="font-sans text-[8.5px] text-slate-400 mb-2 leading-normal">
              Stabilizing systems requires an active **feedback control loop technique** (such as PID Calculus) to calculate error vectors in real-time. Manual/Open-Loop results in immediate gravity-induced tipping.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLoopType("closed")}
                className={`p-2 rounded-lg border font-mono text-[8.5px] font-black text-center transition-all cursor-pointer ${
                  loopType === "closed"
                    ? "border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                    : "border-slate-800 bg-slate-950/40 text-slate-500 hover:text-slate-300"
                }`}
                title="Activates Closed-Loop PID algorithm controls to auto-balance the physical system."
              >
                APPLY PID TECHNIQUE (CLOSED)
              </button>
              <button
                onClick={() => {
                  setLoopType("open");
                  setErrorSum(0);
                }}
                className={`p-2 rounded-lg border font-mono text-[8.5px] font-black text-center transition-all cursor-pointer ${
                  loopType === "open"
                    ? "border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                    : "border-slate-800 bg-slate-950/40 text-slate-500 hover:text-slate-350"
                }`}
                title="Bypasses all control loop algorithms. The physical actuator halts and is subject entirely to drift and gravity."
              >
                BYPASS TECHNIQUE (OPEN)
              </button>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                <span>[KP] PROPORTIONAL GAIN (P-TERM)</span>
                <span className="text-amber-400 font-extrabold">{kp.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="0" max="15" step="0.2" value={kp} 
                onChange={(e) => setKp(parseFloat(e.target.value))}
                disabled={loopType === "open"}
                className="w-full accent-amber-500 cursor-pointer disabled:opacity-40"
              />
              <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5">{getPExplanation()}</span>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                <span>[KI] INTEGRAL GAIN (I-TERM)</span>
                <span className="text-amber-400 font-extrabold">{ki.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="4" step="0.05" value={ki} 
                onChange={(e) => setKi(parseFloat(e.target.value))}
                disabled={loopType === "open"}
                className="w-full accent-amber-500 cursor-pointer disabled:opacity-40"
              />
              <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5">{getIExplanation()}</span>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                <span>[KD] DERIVATIVE GAIN (D-TERM)</span>
                <span className="text-amber-400 font-extrabold">{kd.toFixed(1)}</span>
              </div>
              <input 
                type="range" min="0" max="6" step="0.1" value={kd} 
                onChange={(e) => setKd(parseFloat(e.target.value))}
                disabled={loopType === "open"}
                className="w-full accent-amber-500 cursor-pointer disabled:opacity-40"
              />
              <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5">{getDExplanation()}</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 text-left font-mono text-[9.5px] text-slate-400 leading-normal">
              <span className="text-[7.5px] font-extrabold text-amber-500 uppercase block mb-1">INTERACTIVE INSTANT DISRUPTER</span>
              <p className="text-[8px] text-slate-500 block mb-2 leading-none">Inject instantaneous impulse load disturbance to test controller compensation:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePerturb("left");
                    setLeftPulseActive(false);
                    setTimeout(() => setLeftPulseActive(true), 15);
                  }}
                  className="bg-slate-900 border border-slate-800 text-[8px] text-slate-300 py-1 font-bold rounded uppercase hover:bg-slate-850 cursor-pointer overflow-hidden relative"
                >
                  <span className="relative z-10">&lt;&lt; Disturb Left</span>
                  {leftPulseActive && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.9 }}
                      animate={{ scale: 4.5, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      onAnimationComplete={() => setLeftPulseActive(false)}
                      className="absolute w-12 h-12 bg-amber-500/25 rounded-full pointer-events-none"
                      style={{ left: "calc(50% - 24px)", top: "calc(50% - 24px)" }}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePerturb("right");
                    setRightPulseActive(false);
                    setTimeout(() => setRightPulseActive(true), 15);
                  }}
                  className="bg-slate-900 border border-slate-800 text-[8px] text-slate-300 py-1 font-bold rounded uppercase hover:bg-slate-850 cursor-pointer overflow-hidden relative"
                >
                  <span className="relative z-10">Disturb Right &gt;&gt;</span>
                  {rightPulseActive && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0.9 }}
                      animate={{ scale: 4.5, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      onAnimationComplete={() => setRightPulseActive(false)}
                      className="absolute w-12 h-12 bg-amber-500/25 rounded-full pointer-events-none"
                      style={{ left: "calc(50% - 24px)", top: "calc(50% - 24px)" }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Oscilloscope Graph & Dynamics Renderer block */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Dynamic 2D Physics Visualizer */}
        <div className="bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/30" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/30" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500/30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/30" />

          <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
            <span className="font-mono text-[8px] text-amber-400 font-extrabold tracking-wider uppercase block">
              CART-POLE INVERTED PENDULUM BALANCE PLATFORM
            </span>
            <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
              loopType === "open"
                ? "border-red-950 bg-red-950/20 text-red-400 animate-pulse"
                : isLossOfControl
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : isStabilized
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-sky-500/30 bg-sky-500/10 text-sky-400"
            }`}>
              {getStat4Value()}
            </span>
          </div>

          <div className="h-64 rounded-xl bg-slate-950/90 border border-slate-900/80 relative overflow-hidden flex items-center justify-center p-4">
            {/* Grid overlay background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />
            
            {/* Limit Warning banners */}
            {isLossOfControl && (
              <div className="absolute top-3 left-3 bg-red-950/50 border border-red-800 text-red-400 px-2.5 py-1 rounded font-mono text-[8px] tracking-wide uppercase select-none animate-bounce z-10">
                OVER-DIVERGED // CORRECTION TORQUE SATURANTED
              </div>
            )}

            {/* Static track markers */}
            <>
              <div className="absolute bottom-[36px] left-[5%] right-[5%] h-1 bg-slate-900 rounded-full" />
              <div className="absolute bottom-[30px] left-[10%] h-3 w-0.5 bg-slate-800 block" />
              <div className="absolute bottom-[30px] right-[10%] h-3 w-0.5 bg-slate-800 block" />
            </>
            
            {/* SVG Interactive Physics canvas */}
            <svg className="w-full h-full relative" viewBox="-240 -120 480 240" preserveAspectRatio="xMidYMid meet">
              <>
                <line x1="-190" y1="80" x2="190" y2="80" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />

                <g transform={`translate(${cartX}, 80)`}>
                  <circle cx="-20" cy="12" r="8" fill="#020617" stroke="#475569" strokeWidth="1.5" />
                  <circle cx="20" cy="12" r="8" fill="#020617" stroke="#475569" strokeWidth="1.5" />

                  <rect x="-35" y="-12" width="70" height="24" rx="4" fill="#0b1329" stroke="#f59e0b" strokeWidth="1.5" className="shadow" />
                  <circle cx="0" cy="-6" r="3" fill={loopType === "open" ? "#ef4444" : isStabilized ? "#10b981" : "#0284c7"} className={isRunning ? "animate-pulse" : ""} />

                  <g transform={`rotate(${-thetaDegrees})`}>
                    <circle cx="0" cy="0" r="5" fill="#334155" />
                    <line x1="0" y1="0" x2="0" y2="-90" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="0" cy="-90" r="11" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" className={isStabilized ? "shadow-[0_0_15px_rgba(245,158,11,0.6)]" : "animate-pulse"} />
                    <circle cx="0" cy="-90" r="3" fill="#0f172a" />
                  </g>
                </g>

                <line x1={cartX} y1="20" x2={cartX} y2="80" stroke="#334155" strokeWidth="0.75" strokeDasharray="3,4" />
              </>
            </svg>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-5 font-mono text-left select-none text-[9.5px]">
            <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
              <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">{getStat1Label()}</span>
              <span className={`text-[12.5px] font-black ${getStat1Color()}`}>
                {getStat1Value()}
              </span>
            </div>
            
            <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
              <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">{getStat2Label()}</span>
              <span className="text-[12.5px] font-black text-slate-350">
                {getStat2Value()}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
              <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">{getStat3Label()}</span>
              <span className="text-[12.5px] font-black text-sky-450 text-sky-400">
                {getStat3Value()}
              </span>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
              <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">SYSTEM STABILITY</span>
              <span className={`text-[12.5px] font-black uppercase ${
                isFallen ? "text-rose-500 font-extrabold animate-pulse" : isLossOfControl ? "text-amber-450" : "text-emerald-400"
              }`}>
                {isFallen ? "COLLAPSED" : isLossOfControl ? "DIVERGING" : "STABLE"}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time signals chart */}
        <div className="bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex-1 flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/30" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/30" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500/30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/30" />

          <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
            <span className="font-mono text-[8px] text-amber-400 font-extrabold tracking-wider uppercase block">
              OSCILLOSCOPE SIGNAL WAVE (ACTIVE SETPOINT TARGET: 0)
            </span>
            <div className="flex items-center gap-3 text-[8px] font-mono select-none">
              <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-[2px] bg-slate-500" /> TARGET (0)</span>
              <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-[2px] bg-amber-400" /> DEVIATION SIGNAL</span>
            </div>
          </div>

          <div className="h-44 bg-slate-950/70 border border-slate-900 rounded-xl relative p-3 overflow-hidden flex flex-col justify-end">
            <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:18px_18px] opacity-25 pointer-events-none" />
            
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Target baseline angle (Sit in high balance mid height 100) */}
              <line 
                x1="0" y1="100" x2="600" y2="100" 
                stroke="#64748b" strokeWidth="1.2" strokeDasharray="3,3" strokeOpacity="0.5"
              />

              {/* History trail dynamic path mapper */}
              {(() => {
                let pathD = "";
                history.forEach((pt, idx) => {
                  const x = (idx / Math.max(1, history.length - 1)) * 600;
                  const scaledVal = (pt.val / 90) * 85; 
                  const y = Math.max(6, Math.min(194, 100 + scaledVal));
                  if (idx === 0) pathD += `M ${x},${y}`;
                  else pathD += ` L ${x},${y}`;
                });
                return <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" className="animate-pulse" />;
              })()}
            </svg>
            
            <div className="absolute bottom-2 left-3 flex justify-between w-[95%] font-mono text-[7px] text-slate-500 uppercase select-none">
              <span>Time Slice -1.8s (Static window buffers)</span>
              <span>Real-Time (t=0 Dynamic Ticking)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const CatLogo = () => (
  <svg className="w-16 h-16 text-cyan-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 25 38 L 12 12 L 40 28 Z" fill="rgba(34, 211, 238, 0.1)" />
    <path d="M 75 38 L 88 12 L 60 28 Z" fill="rgba(34, 211, 238, 0.1)" />
    <path d="M 20 45 C 20 28, 80 28, 80 45 C 80 68, 20 68, 20 45 Z" fill="#020718" />
    <ellipse cx="38" cy="46" rx="4" ry="2" fill="currentColor" />
    <line x1="38" y1="42" x2="38" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="62" cy="46" rx="4" ry="2" fill="currentColor" />
    <line x1="62" y1="42" x2="62" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <polygon points="50,56 46,52 54,52" fill="currentColor" />
    <path d="M 44 60 Q 50 63 50 60 Q 50 63 56 60" />
    <line x1="8" y1="52" x2="26" y2="55" stroke="rgba(34, 211, 238, 0.6)" />
    <line x1="8" y1="58" x2="24" y2="59" stroke="rgba(34, 211, 238, 0.6)" />
    <line x1="92" y1="52" x2="74" y2="55" stroke="rgba(34, 211, 238, 0.6)" />
    <line x1="92" y1="58" x2="76" y2="59" stroke="rgba(34, 211, 238, 0.6)" />
  </svg>
);

const DogLogo = () => (
  <svg className="w-16 h-16 text-amber-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 18 28 C 8 28, 8 55, 16 60 C 22 60, 24 45, 24 35" fill="rgba(245, 158, 11, 0.1)" />
    <path d="M 82 28 C 92 28, 92 55, 84 60 C 78 60, 76 45, 76 35" fill="rgba(245, 158, 11, 0.1)" />
    <path d="M 23 35 Q 50 30 77 35 Q 82 65 74 76 Q 50 83 26 76 Q 18 65 23 35" fill="#020718" />
    <circle cx="36" cy="48" r="4" fill="#010309" stroke="currentColor" strokeWidth="2" />
    <circle cx="35" cy="47" r="1" fill="white" />
    <circle cx="64" cy="48" r="4" fill="#010309" stroke="currentColor" strokeWidth="2" />
    <circle cx="63" cy="47" r="1" fill="white" />
    <ellipse cx="50" cy="62" rx="6" ry="4" fill="currentColor" />
    <path d="M 50 66 Q 47 72 44 71" />
    <path d="M 50 66 Q 53 72 56 71" />
  </svg>
);

const RabbitLogo = () => (
  <svg className="w-16 h-16 text-emerald-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M 32 30 C 22 5, 34 5, 38 32" fill="rgba(52, 211, 153, 0.1)" />
    <path d="M 68 30 C 78 5, 66 5, 62 32" fill="rgba(52, 211, 153, 0.1)" />
    <path d="M 25 45 C 22 35, 78 35, 75 45 C 75 68, 25 68, 25 45 Z" fill="#020718" />
    <ellipse cx="38" cy="46" rx="3.5" ry="2" fill="currentColor" />
    <ellipse cx="62" cy="46" rx="3.5" ry="2" fill="currentColor" />
    <polygon points="50,54 47,50 53,50" fill="currentColor" />
    <path d="M 46 58 Q 50 60 50 58 Q 50 60 54 58" />
    <line x1="12" y1="52" x2="28" y2="54" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="1.5" />
    <line x1="12" y1="58" x2="28" y2="58" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="1.5" />
    <line x1="88" y1="52" x2="72" y2="54" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="1.5" />
    <line x1="88" y1="58" x2="72" y2="58" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="1.5" />
  </svg>
);

const RoboticsAiCore = () => {
  const [activeParadigm, setActiveParadigm] = useState<"supervised" | "unsupervised" | "reinforcement" | null>(null);
  const [showMdpModal, setShowMdpModal] = useState(false);

  const handleSelectParadigm = (paradigm: "supervised" | "unsupervised" | "reinforcement") => {
    setActiveParadigm(prev => {
      const nextParadigm = prev === paradigm ? null : paradigm;
      if (nextParadigm) {
        setTimeout(() => {
          const containerId = `${nextParadigm}-container`;
          const elem = document.getElementById(containerId);
          if (elem) {
            elem.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
      }
      return nextParadigm;
    });
    // When changing paradigms, deselect layer
    setActiveLayer(null);
  };

  const getParadigmDescription = () => {
    switch (activeParadigm) {
      case "supervised":
        return "Supervised Learning trains models using paired feature-label datasets. In this module, the network classifies animal species (Cat, Dog, or Rabbit) based on registered input features and dynamic activations.";
      case "unsupervised":
        return "Unsupervised Learning processes and groups unlabelled game telemetry vectors (such as player K/D ratio coordinates and Actions-Per-Minute bounds) into distinct skill clusters: Noobs, Good, and Experts, completely without manual programmer tags.";
      case "reinforcement":
        return "Reinforcement Learning optimizes structural mechanical control strategies by executing autonomous balance loops inside physical environments. An inverted pendulum cart agent receives scalar rewards (+100 for upright static) or resets for tumbling.";
      default:
        return "";
    }
  };

  // State for active network layer selected
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  // Synaptic propagation trigger (Supervised/Unsupervised/Reinforcement visual pulse triggers)
  const [isInferring, setIsInferring] = useState(false);

  // Hyperparameters
  const [learningRate, setLearningRate] = useState(0.05);
  const [epochs, setEpochs] = useState(150);
  const [currentLoss, setCurrentLoss] = useState(0.08);
  const [currentEpoch, setCurrentEpoch] = useState(150);
  const [isTraining, setIsTraining] = useState(false);

  const handleTrainNet = () => {
    if (isTraining) return;
    setIsTraining(true);
    setCurrentEpoch(0);
    setCurrentLoss(0.95);
    
    let ep = 0;
    const interval = setInterval(() => {
      ep += 10;
      if (ep > epochs) {
        clearInterval(interval);
        setIsTraining(false);
        return;
      }
      
      const decay = Math.max(0.02, 0.95 * Math.exp(-0.022 * ep * (1.2 - learningRate)));
      const randomNoise = (Math.random() - 0.5) * 0.035;
      const stepLoss = Math.round(Math.max(0.012, decay + randomNoise) * 1000) / 1000;
      
      setCurrentEpoch(ep);
      setCurrentLoss(stepLoss);
    }, 100);
  };

  // 1. Supervised States (Animal classification with lock-to-registered logic, with emojis)
  const [supervisedLog, setSupervisedLog] = useState<string>("Ready for model inference...");
  const [trainedAnimals, setTrainedAnimals] = useState<("cat" | "dog" | "rabbit")[]>([]);
  const [feedAnimation, setFeedAnimation] = useState<{ active: boolean; type: "cat" | "dog" | "rabbit" } | null>(null);
  const [fedAnimal, setFedAnimal] = useState<"cat" | "dog" | "rabbit" | null>(null);
  const [supervisedCounts, setSupervisedCounts] = useState<{ cat: number; dog: number; rabbit: number; unknown: number }>({
    cat: 0,
    dog: 0,
    rabbit: 0,
    unknown: 0
  });

  // Toggle dynamic trained selection logic (multiple selection)
  const handleToggleTrained = (animal: "cat" | "dog" | "rabbit") => {
    setTrainedAnimals(prev => {
      const exists = prev.includes(animal);
      let next: ("cat" | "dog" | "rabbit")[];
      if (exists) {
        next = prev.filter(a => a !== animal);
      } else {
        next = [...prev, animal];
      }
      const activeAnimalsStr = next.length > 0 ? next.map(a => a.toUpperCase()).join(", ") : "None";
      setSupervisedLog(`Synapse calibrations updated. Active weight signatures: [${activeAnimalsStr}]`);
      return next;
    });
  };

  const handleClearTrained = () => {
    setTrainedAnimals([]);
    setSupervisedLog("System switched to untrained weights. General animal class is uncalibrated.");
  };

  // Calculated species probability
  const getAnimalClassification = () => {
    if (trainedAnimals.length === 0 || !fedAnimal) {
       return { predicted: "UNKNOWN" };
    }

    if (trainedAnimals.includes(fedAnimal)) {
      return { predicted: fedAnimal.toUpperCase() as "CAT" | "DOG" | "RABBIT" };
    }

    return { predicted: "UNKNOWN" };
  };

  const { predicted } = getAnimalClassification();

  const triggerSupervisedInference = () => {
    if (isInferring) return;
    setIsInferring(true);
    setSupervisedLog("Feeding raw inputs into vector synapses...");
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      if (ticks === 1) setSupervisedLog("Adjusting neural weights. Backpropagating margins...");
      if (ticks === 2) setSupervisedLog(`Output bias activated! Classified as: ${predicted}`);
      if (ticks >= 3) {
        clearInterval(interval);
        setIsInferring(false);
      }
    }, 450);
  };

  const handleFeedAnimal = (type: "cat" | "dog" | "rabbit") => {
    // Enable multiple input taps in rapid succession
    setFeedAnimation({ active: true, type });
    setFedAnimal(type);

    const isDetermined = trainedAnimals.includes(type);

    setSupervisedCounts(prev => {
      if (isDetermined) {
        return { ...prev, [type]: prev[type] + 1 };
      } else {
        return { ...prev, unknown: prev.unknown + 1 };
      }
    });

    if (isDetermined) {
      setSupervisedLog(`Dynamic vector identified. Successfully determined specified ${type.toUpperCase()}!`);
    } else {
      setSupervisedLog(`Model weight mismatch: UNKNOWN class determined for raw ${type.toUpperCase()}.`);
    }

    setTimeout(() => {
      setFeedAnimation(prev => prev?.type === type ? null : prev);
    }, 850);
  };

  // 2. Unsupervised States (Gamer Clustering: Noob, Good, Expert)
  const [isClustered, setIsClustered] = useState(false);
  const [unsupervisedLog, setUnsupervisedLog] = useState("Awaiting clustering fit criteria...");
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [unsupervisedTrainingState, setUnsupervisedTrainingState] = useState<"untrained" | "trained">("untrained");

  const randomScatteredPlayers = [
    { name: "RawSensor_A", kd: 3.12, apm: 45, cluster: null, group: "Noob" },
    { name: "RawSensor_B", kd: 0.52, apm: 295, cluster: null, group: "Expert" },
    { name: "RawSensor_C", kd: 1.15, apm: 220, cluster: null, group: "Good" },
    { name: "RawSensor_D", kd: 2.45, apm: 80, cluster: null, group: "Good" },
    { name: "RawSensor_E", kd: 0.38, apm: 155, cluster: null, group: "Noob" },
    { name: "RawSensor_F", kd: 4.38, apm: 130, cluster: null, group: "Expert" }
  ];

  const clusteredPlayers = [
    { name: "NoobChassis_9", kd: 0.38, apm: 42, cluster: 0, group: "Noob" },
    { name: "PneumaticSpam", kd: 0.65, apm: 78, cluster: 0, group: "Noob" },
    { name: "ProSteadyGamer", kd: 1.55, apm: 135, cluster: 1, group: "Good" },
    { name: "TacticalGearX", kd: 1.82, apm: 160, cluster: 1, group: "Good" },
    { name: "ApexWalkingBox", kd: 3.48, apm: 285, cluster: 2, group: "Expert" },
    { name: "ZeroFrictionGOD", kd: 4.12, apm: 310, cluster: 2, group: "Expert" }
  ];

  const [players, setPlayers] = useState(randomScatteredPlayers);

  const handleUnsupervisedModeChange = (mode: "untrained" | "trained") => {
    setUnsupervisedTrainingState(mode);
    if (mode === "untrained") {
      setPlayers(randomScatteredPlayers);
      setIsClustered(false);
      setUnsupervisedLog("Untrained state: Raw unlabelled vectors scattered across coordinate field.");
    } else {
      setIsClustered(false);
      setIsInferring(true);
      setUnsupervisedLog("Calculating spatial APM & K/D centroids and groupings...");
      setTimeout(() => {
        setPlayers(clusteredPlayers);
        setIsClustered(true);
        setIsInferring(false);
        setUnsupervisedLog("Unsupervised fit converged! Nodes cleanly sorted and partitioned into clusters C1, C2, C3.");
      }, 700);
    }
  };

  const toggleUnsupervisedLearning = () => {
    const nextMode = unsupervisedTrainingState === "untrained" ? "trained" : "untrained";
    handleUnsupervisedModeChange(nextMode);
  };

  const triggerUnsupervisedClustering = () => {
    handleUnsupervisedModeChange("trained");
  };

  const resetUnsupervisedClustering = () => {
    handleUnsupervisedModeChange("untrained");
  };

  // 3. Reinforcement States (Inverted Pendulum Cart Balancing)
  const [rlStage, setRlStage] = useState<"low" | "medium" | "high">("low");
  const [isRlRunning, setIsRlRunning] = useState(false);
  const [rlAngle, setRlAngle] = useState(0); // in degrees
  const [rlCartX, setRlCartX] = useState(130); // pixels
  const [rlRewards, setRlRewards] = useState(0);
  const [rlSurvivalTime, setRlSurvivalTime] = useState(0);
  const [rlLogs, setRlLogs] = useState<string[]>(["[System initialized] Select Q-learning stage."]);
  const [rlLeftPulseActive, setRlLeftPulseActive] = useState(false);
  const [rlRightPulseActive, setRlRightPulseActive] = useState(false);

  const handleRlPerturb = (direction: "left" | "right") => {
    setIsInferring(true);
    setRlAngle(prev => {
      let offset = direction === "left" ? -22 : 22;
      let next = prev + offset;
      if (next > 45) next = 45;
      if (next < -45) next = -45;
      return next;
    });
    setRlLogs(prev => [
      `[Perturbation: ${direction.toUpperCase()}] External pulse force vectors injected!`,
      ...prev
    ].slice(0, 5));
    setTimeout(() => setIsInferring(false), 200);
  };

  // Handle active simulation ticking loops
  useEffect(() => {
    if (!isRlRunning) return;

    let timeElapsed = 0;
    let accumulatedRewards = 0;

    const interval = setInterval(() => {
      timeElapsed = Math.round((timeElapsed + 0.15) * 100) / 100;
      setRlSurvivalTime(timeElapsed);

      if (rlStage === "low") {
        // Untrained model falls down within 2 seconds
        const currentAngle = Math.sin(timeElapsed * 4) * (20 + timeElapsed * 28);
        setRlAngle(currentAngle);
        setRlCartX(130 + Math.sin(timeElapsed * 10) * 45);

        if (Math.abs(currentAngle) > 40) {
          setIsRlRunning(false);
          setRlLogs(prev => [
            `[Episode status: TUMBLED] Angle exceeded safety limits (${currentAngle.toFixed(1)}°). Resetting environment...`,
            "[Q-Value Penalty] Penalty score -150 issued.",
            ...prev
          ].slice(0, 5));
          setRlAngle(65); // fallen flat
        } else {
          accumulatedRewards += 1;
          setRlRewards(accumulatedRewards);
          setRlLogs(prev => [`[Tick: Step] e=${timeElapsed}s. Angle=${currentAngle.toFixed(1)}°`, ...prev].slice(0, 5));
        }
      } else if (rlStage === "medium") {
        // Tolerable oscillation, recovers but wobbles
        const oscillation = Math.sin(timeElapsed * 3) * 12 + (Math.random() - 0.5) * 8;
        setRlAngle(oscillation);
        setRlCartX(130 + Math.sin(timeElapsed * 2) * 25);
        accumulatedRewards += 10;
        setRlRewards(accumulatedRewards);

        if (timeElapsed > 15 && Math.random() < 0.15) {
          setIsRlRunning(false);
          setRlLogs(prev => [
            `[Episode status: LOST LIMIT] Failed drift control after ${timeElapsed}s.`,
            "[Q-Value Penalty] Adjusting state matrices.",
            ...prev
          ].slice(0, 5));
          setRlAngle(-55);
        } else {
          setRlLogs(prev => [
            `[Tick: Balancing] Wobbling oscillation=${oscillation.toFixed(1)}°. Recovering via cart snaps.`,
            ...prev
          ].slice(0, 5));
        }
      } else {
        // Perfectly Balanced optimal walk control
        const microscopicWobble = Math.sin(timeElapsed * 8) * 1.2 + (Math.random() - 0.5) * 0.4;
        setRlAngle(microscopicWobble);
        setRlCartX(130 + Math.sin(timeElapsed * 0.5) * 3);
        accumulatedRewards += 100;
        setRlRewards(accumulatedRewards);

        setRlLogs(prev => [
          `[Tick: Perfectly Balanced] Centered balance. Angle=${microscopicWobble.toFixed(2)}° | Reward value maximum!`,
          ...prev
        ].slice(0, 5));
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isRlRunning, rlStage]);

  const changeRlStage = (stage: "low" | "medium" | "high") => {
    setRlStage(stage);
    setIsRlRunning(false);
    setRlAngle(0);
    setRlCartX(130);
    setRlRewards(0);
    setRlSurvivalTime(0);
    setRlLogs([`[System state configured] Switched to ${stage === "low" ? "Episode 5 (Untrained)" : stage === "medium" ? "Episode 65 (Basic Success)" : "Episode 250 (Highly Optimal)"}.`]);
  };

  const toggleRlSimulation = () => {
    if (isRlRunning) {
      setIsRlRunning(false);
    } else {
      setRlAngle(0);
      setRlCartX(130);
      setRlSurvivalTime(0);
      setRlRewards(0);
      setIsRlRunning(true);
      setRlLogs([`[Episode balance loop engaged] Commencing testing cycles...`]);
    }
  };

  // State for original walker sandbox at bottom of supervised/reinforcement (kept for compatibility)
  const [walkerX, setWalkerX] = useState(30);
  const [walkerReward, setWalkerReward] = useState(120);
  const [walkerLogs, setWalkerLogs] = useState<string[]>([
    "[Agent: Init] Spawned on flat training plane.",
    "[Action: Flex] Dynamic hip torque offset +0.4rad.",
    "[Reward: +10] Steady level trunk. Balanced velocity."
  ]);
  const [isWalkerRunning, setIsWalkerRunning] = useState(false);

  useEffect(() => {
    if (!isWalkerRunning) return;
    const interval = setInterval(() => {
      setWalkerX((prev) => {
        let next = prev + 12;
        if (next > 360) next = 30;
        return next;
      });
      
      const drift = Math.random();
      let logEntry = "";
      let rewardDelta = 0;
      
      if (drift < 0.35) {
        logEntry = "[Action: Step] Joint expansion successful. Lean offset optimized.";
        rewardDelta = 10;
      } else if (drift < 0.7) {
        logEntry = "[Reward: +15] Stable gate. Centroid sits cleanly inside safety base.";
        rewardDelta = 15;
      } else {
        logEntry = "[Penalty: -8] Angular twist deviation exceeded. Hip stabilizer recovery applied.";
        rewardDelta = -8;
      }
      
      setWalkerReward((prev) => Math.max(0, prev + rewardDelta));
      setWalkerLogs((prev) => {
        const updated = [...prev, logEntry];
        if (updated.length > 5) updated.shift();
        return updated;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isWalkerRunning]);

  return (
    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full animate-fadeIn text-left font-sans">
      
      {/* Educational introductory header panel */}
      <div className="lg:col-span-12 bg-[#050C1C]/60 border border-slate-800/80 p-5 rounded-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b]/70 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="font-mono text-[10px] text-purple-400 font-extrabold uppercase tracking-wider">UNDERSTANDING ARTIFICIAL BRAINS</h3>
            </div>
            <h2 className="font-sans font-black text-lg text-slate-100 uppercase tracking-tight">MACHINE LEARNING: HOW IT WORKS</h2>
          </div>
        </div>

        <p className="text-[12.5px] text-slate-300 leading-relaxed font-sans max-w-4xl font-medium mb-5">
          Machine learning is how we give robots a mathematical brain. Instead of writing rigid rules for every possible situation, we provide data or let them practice a task. By recognizing repeating patterns and receiving feedback, the robot updates its internal parameters to make smart, correct decisions on its own. Select an ML paradigm below to activate its interactive simulation sandbox:
        </p>

        {/* Types of Machine Learning - Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleSelectParadigm("supervised")}
            className={`p-3 text-left rounded-xl border transition-all duration-300 group cursor-pointer ${
              activeParadigm === "supervised"
                ? "border-cyan-500 bg-cyan-950/15 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[8px] font-black tracking-widest text-slate-500 uppercase group-hover:text-slate-400">TYPE 01 / LABELED</span>
              <div className={`w-1.5 h-1.5 rounded-full ${activeParadigm === "supervised" ? "bg-cyan-400 animate-ping" : "bg-slate-700"}`} />
            </div>
            <h4 className="font-sans font-black text-sm text-slate-200 group-hover:text-cyan-300 mb-1">Supervised Learning</h4>
            <p className="text-[10px] text-slate-400 group-hover:text-slate-350 leading-relaxed">
              Trains using matched input-label pairs. Perfect for classification, sensor mapping, and species prediction.
            </p>
          </button>

          <button
            onClick={() => handleSelectParadigm("unsupervised")}
            className={`p-3 text-left rounded-xl border transition-all duration-300 group cursor-pointer ${
              activeParadigm === "unsupervised"
                ? "border-pink-500 bg-pink-950/15 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
                : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[8px] font-black tracking-widest text-slate-500 uppercase group-hover:text-slate-400">TYPE 02 / UNLABELED</span>
              <div className={`w-1.5 h-1.5 rounded-full ${activeParadigm === "unsupervised" ? "bg-pink-400 animate-ping" : "bg-slate-700"}`} />
            </div>
            <h4 className="font-sans font-black text-sm text-slate-200 group-hover:text-pink-300 mb-1">Unsupervised Learning</h4>
            <p className="text-[10px] text-slate-400 group-hover:text-slate-350 leading-relaxed">
              Discovers latent groupings from raw unlabelled telemetry vectors, identifying dynamic patterns automatically.
            </p>
          </button>

          <button
            onClick={() => handleSelectParadigm("reinforcement")}
            className={`p-3 text-left rounded-xl border transition-all duration-300 group cursor-pointer ${
              activeParadigm === "reinforcement"
                ? "border-purple-500 bg-purple-950/15 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-705 hover:text-slate-200"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-[8px] font-black tracking-widest text-slate-500 uppercase group-hover:text-slate-400">TYPE 03 / TRIAL & ERROR</span>
              <div className={`w-1.5 h-1.5 rounded-full ${activeParadigm === "reinforcement" ? "bg-purple-400 animate-ping" : "bg-slate-700"}`} />
            </div>
            <h4 className="font-sans font-black text-sm text-slate-200 group-hover:text-purple-300 mb-1">Reinforcement Learning</h4>
            <p className="text-[10px] text-slate-400 group-hover:text-slate-350 leading-relaxed">
              Teaches strategies via feedback trial rewards, shaping motor controls for balancing cart pendulums.
            </p>
          </button>
        </div>
      </div>

      {/* Left Column: Neural Network visualizer */}
      <div className="lg:col-span-6 bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500/30" />
        
        <div>
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
            <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] text-purple-405 font-bold uppercase tracking-widest block">DEEP MULTI-LAYER PERCEPTRON</span>
              <h3 className="font-sans font-black text-xs text-slate-100 uppercase tracking-tight">NEURAL NET ARCHITECTURE</h3>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 block mb-4 leading-normal">
            Interact with the neural pathways. Click any of the layer buttons below to inspect and explain the mathematical purpose of each layer in real-time.
          </p>

          {/* Neural net interactive SVG map (adjusts/modifies based on ML paradigm) */}
          <div className="h-56 bg-slate-950/70 rounded-xl relative overflow-hidden p-3 border border-slate-900">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b1120_1px,transparent_1px),linear-gradient(to_bottom,#0b1120_1px,transparent_1px)] bg-[size:14px_14px] opacity-40 pointer-events-none" />
            
            <svg className="w-full h-full relative" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
              {(() => {
                // Determine nodes based on active machine learning paradigm
                let inputs: { id: string; label: string; y: number }[] = [];
                let hiddens: { id: string; y: number }[] = [];
                let outputs: { id: string; label: string; y: number }[] = [];

                if (activeParadigm === "supervised") {
                  inputs = [
                    { id: "x1", label: "CAT", y: 30 },
                    { id: "x2", label: "DOG", y: 90 },
                    { id: "x3", label: "RBT", y: 150 },
                  ];
                  hiddens = [
                    { id: "h1", y: 22 },
                    { id: "h2", y: 67 },
                    { id: "h3", y: 112 },
                    { id: "h4", y: 158 },
                  ];
                  outputs = [
                    { id: "y1", label: "CAT", y: 30 },
                    { id: "y2", label: "DOG", y: 90 },
                    { id: "y3", label: "RBT", y: 150 },
                  ];
                } else if (activeParadigm === "unsupervised") {
                  inputs = [
                    { id: "x1", label: "K/D", y: 50 },
                    { id: "x2", label: "APM", y: 130 },
                  ];
                  hiddens = [
                    { id: "h1", y: 22 },
                    { id: "h2", y: 67 },
                    { id: "h3", y: 112 },
                    { id: "h4", y: 158 },
                  ];
                  outputs = [
                    { id: "y1", label: "C1", y: 30 },
                    { id: "y2", label: "C2", y: 90 },
                    { id: "y3", label: "C3", y: 150 },
                  ];
                } else if (activeParadigm === "reinforcement") {
                  inputs = [
                    { id: "x1", label: "POS", y: 22 },
                    { id: "x2", label: "VEL", y: 67 },
                    { id: "x3", label: "ANG", y: 112 },
                    { id: "x4", label: "AVC", y: 158 },
                  ];
                  hiddens = [
                    { id: "h1", y: 22 },
                    { id: "h2", y: 67 },
                    { id: "h3", y: 112 },
                    { id: "h4", y: 158 },
                  ];
                  outputs = [
                    { id: "y1", label: "LFT", y: 50 },
                    { id: "y2", label: "RGT", y: 130 },
                  ];
                } else {
                  inputs = [
                    { id: "x1", label: "X1", y: 30 },
                    { id: "x2", label: "X2", y: 90 },
                    { id: "x3", label: "X3", y: 150 },
                  ];
                  hiddens = [
                    { id: "h1", y: 15 },
                    { id: "h2", y: 60 },
                    { id: "h3", y: 105 },
                    { id: "h4", y: 150 },
                  ];
                  outputs = [
                    { id: "y1", label: "Y1", y: 50 },
                    { id: "y2", label: "Y2", y: 130 },
                  ];
                }

                return (
                  <g>
                    {/* Dynamic Connection Lines (Input -> Hidden) */}
                    {inputs.map((inNode) =>
                      hiddens.map((hNode, hIdx) => {
                        let strokeColor = "#1e1e38";
                        let strokeWidth = "0.75";
                        const isAnimated = isInferring || isRlRunning || isTraining;

                        if (activeLayer === 0) {
                          strokeColor = "#c084fc";
                          strokeWidth = "2.0";
                        } else if (activeLayer === null) {
                          strokeColor = "#2a2d4e";
                          strokeWidth = "1.0";
                        }

                        if (isAnimated) {
                          strokeColor = "#c084fc";
                          strokeWidth = "1.5";
                        }

                        const hashVal = (inNode.id.charCodeAt(0) || 0) + hIdx * 7;
                        const dur = 1.6 + (hashVal % 4) * 0.4; // 1.6s to 2.8s
                        const delay = (hashVal % 3) * 0.4;
                        const dotColor = isAnimated ? "#38bdf8" : activeLayer === 0 ? "#e9d5ff" : "#818cf8";
                        const dotRadius = isAnimated ? "2.8" : "1.8";

                        return (
                          <g key={`lin_lh_${inNode.id}_${hNode.id}`}>
                            <line
                              x1="60" y1={inNode.y} x2="200" y2={hNode.y}
                              stroke={strokeColor}
                              strokeWidth={strokeWidth}
                              className="transition-all duration-300"
                            />
                            <circle r={dotRadius} fill={dotColor} style={{ filter: `drop-shadow(0 0 3px ${dotColor})` }}>
                              <animate attributeName="cx" from="60" to="200" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                              <animate attributeName="cy" from={inNode.y} to={hNode.y} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                            </circle>
                          </g>
                        );
                      })
                    )}

                    {/* Dynamic Connection Lines (Hidden -> Output) */}
                    {hiddens.map((hNode, hIdx) =>
                      outputs.map((outNode) => {
                        let strokeColor = "#1e1e38";
                        let strokeWidth = "0.75";
                        const isAnimated = isInferring || isRlRunning || isTraining;

                        if (activeLayer === 1) {
                          strokeColor = "#c084fc";
                          strokeWidth = "2.0";
                        } else if (activeLayer === null) {
                          strokeColor = "#2a2d4e";
                          strokeWidth = "1.0";
                        }

                        if (isAnimated) {
                          strokeColor = "#c084fc";
                          strokeWidth = "1.5";
                        }

                        const hashVal = hIdx * 11 + (outNode.id.charCodeAt(0) || 0);
                        const dur = 1.6 + (hashVal % 4) * 0.4;
                        const delay = (hashVal % 3) * 0.4 + 0.5; // Offset slightly to simulate sequential activation flow
                        const dotColor = isAnimated ? "#f472b6" : activeLayer === 1 ? "#e9d5ff" : "#818cf8";
                        const dotRadius = isAnimated ? "2.8" : "1.8";

                        return (
                          <g key={`lh_lout_${hNode.id}_${outNode.id}`}>
                            <line
                              x1="200" y1={hNode.y} x2="340" y2={outNode.y}
                              stroke={strokeColor}
                              strokeWidth={strokeWidth}
                              className="transition-all duration-300"
                            />
                            <circle r={dotRadius} fill={dotColor} style={{ filter: `drop-shadow(0 0 3px ${dotColor})` }}>
                              <animate attributeName="cx" from="200" to="340" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                              <animate attributeName="cy" from={hNode.y} to={outNode.y} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                            </circle>
                          </g>
                        );
                      })
                    )}

                    {/* Input Nodes Container */}
                    <g onClick={() => setActiveLayer(prev => prev === 0 ? null : 0)} className="cursor-pointer select-none">
                      {inputs.map((node) => (
                        <g key={node.id}>
                          <circle cx="60" cy={node.y} r="10" fill="#0d1b3e" stroke={activeLayer === 0 ? "#22d3ee" : "#818cf8"} strokeWidth="2" />
                          <text x="60" y={node.y + 3} textAnchor="middle" fill="#22d3ee" fontSize="6.5" fontWeight="black">{node.label}</text>
                        </g>
                      ))}
                      <text x="60" y="171" textAnchor="middle" fill="#22d3ee" fontSize="6px" fontWeight="bold">INPUT LAYER</text>
                    </g>

                    {/* Hidden Nodes Container */}
                    <g onClick={() => setActiveLayer(prev => prev === 1 ? null : 1)} className="cursor-pointer select-none">
                      {hiddens.map((node) => (
                        <circle
                          key={node.id}
                          cx="200" cy={node.y} r="9"
                          fill={activeLayer === 1 ? "#3b0764" : "#0f082e"}
                          stroke="#c084fc" strokeWidth="2"
                          className={isInferring || isRlRunning || isTraining ? "animate-pulse" : ""}
                        />
                      ))}
                      <text x="200" y="171" textAnchor="middle" fill="#c084fc" fontSize="6px" fontWeight="bold">HIDDEN CORE</text>
                    </g>

                    {/* Output Nodes Container */}
                    <g onClick={() => setActiveLayer(prev => prev === 2 ? null : 2)} className="cursor-pointer select-none">
                      {outputs.map((node) => (
                        <g key={node.id}>
                          <circle
                            cx="340"
                            cy={node.y}
                            r="11"
                            fill="#011f12"
                            stroke={activeLayer === 2 ? "#34d399" : "#10b981"}
                            strokeWidth={activeLayer === 2 ? "3.5" : "2"}
                            className={activeLayer === 2 ? "drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] filter transition-all duration-300" : "transition-all duration-300"}
                          />
                          <text x="340" y={node.y + 3} textAnchor="middle" fill="#10b981" fontSize="6.5" fontWeight="black">{node.label}</text>
                        </g>
                      ))}
                      <text x="340" y="171" textAnchor="middle" fill="#10b981" fontSize="6px" fontWeight="bold" className={activeLayer === 2 ? "animate-pulse font-black tracking-widest text-[#34d399]" : ""}>OUTPUT LAYER</text>
                    </g>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Interactive button explanations for each layer */}
          <div className="mt-4 flex gap-2 font-mono text-[9px]">
            <button
              onClick={() => setActiveLayer(prev => prev === 0 ? null : 0)}
              className={`flex-1 py-2 border rounded-lg uppercase font-bold tracking-wider transition-all cursor-pointer ${
                activeLayer === 0 
                  ? "border-sky-500 bg-sky-500/10 text-cyan-400" 
                  : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-300"
              }`}
            >
              {activeParadigm === "supervised" ? "[CAT,DOG,RBT] Input Layer" : activeParadigm === "unsupervised" ? "[K/D,APM] Input Layer" : activeParadigm === "reinforcement" ? "[POS,VEL,ANG,AVC] Input" : "Input Layer"}
            </button>
            <button
              onClick={() => setActiveLayer(prev => prev === 1 ? null : 1)}
              className={`flex-1 py-2 border rounded-lg uppercase font-bold tracking-wider transition-all cursor-pointer ${
                activeLayer === 1 
                  ? "border-purple-500 bg-purple-500/10 text-purple-400" 
                  : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-300"
              }`}
            >
              Hidden Layer
            </button>
            <button
              onClick={() => setActiveLayer(prev => prev === 2 ? null : 2)}
              className={`flex-1 py-2 border rounded-lg uppercase font-bold tracking-wider transition-all cursor-pointer ${
                activeLayer === 2 
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" 
                  : "border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-300"
              }`}
            >
              {activeParadigm === "supervised" ? "[CAT,DOG,RBT] Output Layer" : activeParadigm === "unsupervised" ? "[C1,C2,C3] Output Layer" : activeParadigm === "reinforcement" ? "[LFT,RGT] Output Layer" : "Output Layer"}
            </button>
          </div>

          {/* Content panel describing layers */}
          <div className="mt-4 p-4 bg-slate-950/80 border border-slate-900 rounded-xl min-h-[92px] text-left">
            <span className="font-mono text-[7px] text-slate-500 uppercase block tracking-widest mb-1.5 font-black">
              {activeLayer === 0 ? "INPUT TELEMETRY DECODER [LAYER 0]" : activeLayer === 1 ? "SYNAPTIC WEIGHT MATRIX CORES [LAYER 1]" : activeLayer === 2 ? "ACTUATING CONTROL CLASSIFICATION [LAYER 2]" : "NEURAL NETWORK COMPONENT DECODER"}
            </span>
            <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
              {activeLayer === 0 && (activeParadigm === "supervised" 
                ? "The Input Layer takes 3-dimensional high-level features representing Cat, Dog, or Rabbit metrics respectively."
                : activeParadigm === "unsupervised"
                ? "The Input Layer takes 2-dimensional telemetry coordinates comprising player Kill/Death ratio bounds and APM."
                : activeParadigm === "reinforcement"
                ? "The Input Layer takes a 4-dimensional state space: Cart Position (POS), Cart Velocity (VEL), Pole Angle (ANG), and Pole Angular Velocity (AVC)."
                : "The Input Layer parses raw environmental variables into structured input vectors for feedforward calculation.")}
              
              {activeLayer === 1 && "The Hidden Layer maps abstract dot-product combinations. Linear parameters are modified by weights and non-linear biases, formulating hyperplanes of division for classification boundaries."}
              
              {activeLayer === 2 && (activeParadigm === "supervised"
                ? "The Output Layer uses Softmaxactivation probabilities to determine the identified species: CAT vs. DOG vs. RABBIT."
                : activeParadigm === "unsupervised"
                ? "The Output Layer groups points into 3 clustered output centroids: Cluster 1, Cluster 2, and Cluster 3."
                : activeParadigm === "reinforcement"
                ? "The Output Layer decides corrective physical actuator force values: PUSH LEFT vs. PUSH RIGHT."
                : "The Output Layer uses activation functions to calculate classification probabilities or steady balanced poles.")}
                
              {activeLayer === null && "A Feedforward Neural Network acts as the brains of AI robotics. Choose any layer of the network (Input, Hidden, or Output) by clicking on the nodes or the buttons below to inspect how data propagates and computes decisions of posture, control, or species identification."}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Three Interactive learning sandboxes depending on tab */}
      <div className="lg:col-span-6 bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-500/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-500/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-500/30" />

        {/* While nothing is selected, render direct guidance + network overview */}
        {activeParadigm === null && (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn">
            <div>
              {/* Terminal Title */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 select-none">
                <span className="font-mono text-[8px] text-purple-400 font-extrabold tracking-wider uppercase block">Holographic Guide Module</span>
                <span className="font-mono text-[7px] px-1.5 py-0.5 rounded border border-[#22d3ee]/25 text-[#22d3ee] bg-[#22d3ee]/5 uppercase animate-pulse">TERMINAL_ONLINE_V20</span>
              </div>

              {/* Glowing Holographic Robot Section */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#030a1c] border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.06)] relative overflow-hidden mb-5">
                {/* Visual scanline effect */}
                <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent top-0 animate-bounce" style={{ animationDuration: "5s" }} />
                
                {/* Holographic Robot Avatar */}
                <div className="shrink-0 relative">
                  <div className="w-16 h-16 rounded-full bg-cyan-950/40 border border-cyan-500/35 flex items-center justify-center text-cyan-400 relative">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" style={{ animationDuration: "3s" }} />
                    <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Cyber Head */}
                      <rect x="25" y="30" width="50" height="40" rx="10" fill="#010410" />
                      {/* Antenna */}
                      <path d="M 50 20 L 50 30" />
                      <circle cx="50" cy="17" r="4" className="fill-cyan-400 animate-pulse" />
                      {/* Glowing Cyan Eyes */}
                      <circle cx="40" cy="50" r="3" fill="#22d3ee" className="animate-pulse" />
                      <circle cx="60" cy="50" r="3" fill="#22d3ee" className="animate-pulse" />
                      {/* Mouth / Smile */}
                      <path d="M 42 60 Q 50 64 58 60" />
                      {/* Cyber Cheek Brackets */}
                      <path d="M 20 50 Q 25 50 25 55" stroke="rgba(34, 211, 238, 0.5)" />
                      <path d="M 80 50 Q 75 50 75 55" stroke="rgba(34, 211, 238, 0.5)" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-cyan-900 border border-cyan-400 px-1 py-0.2 rounded font-mono text-[5.5px] font-black text-cyan-200 tracking-wider">NEURO_V2</span>
                </div>

                {/* Robot Voice / Speech bubble */}
                <div className="flex-1 font-sans">
                  <h4 className="font-sans font-black text-[13px] text-slate-100 flex items-center gap-1.5 mb-1 text-cyan-300">
                    Hello, Operator! Let's Connect.
                  </h4>
                  <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                    "I am the holographic core guide. Our AI robotics system is currently idling. To unlock and launch the real-time simulation circuits, <strong className="text-cyan-400">select any of the three Machine Learning types</strong> in the block above! Try clicking one to toggle it, and click it again to return here."
                  </p>
                </div>
              </div>

              {/* General Information about Neural Networks */}
              <div className="space-y-3.5">
                <h4 className="font-mono text-[9px] text-[#22d3ee] font-black uppercase tracking-wider select-none border-b border-slate-900 pb-1.5">
                  SYSTEM OVERVIEW: HOW NEURAL NETWORKS COMPUTE
                </h4>

                <div className="grid grid-cols-1 gap-3 text-left">
                  {/* Input Layer */}
                  <div className="p-3 rounded-lg border border-[#22d3ee]/10 bg-slate-950/40 hover:border-[#22d3ee]/20 transition-all flex gap-3">
                    <div className="w-7 h-7 rounded bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-cyan-400 font-mono text-[9px] font-bold shrink-0">
                      IN
                    </div>
                    <div>
                      <h5 className="font-sans font-black text-xs text-slate-200">Input Layer (Sensing)</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                        This layer accepts parameters representing environmental observations (such as an animal's weight, the player's Actions-Per-Minute, or pendulum coordinate deviation vectors). It decodes these variables into normalized mathematical data vectors.
                      </p>
                    </div>
                  </div>

                  {/* Hidden Layer */}
                  <div className="p-3 rounded-lg border border-purple-500/10 bg-slate-950/40 hover:border-purple-500/20 transition-all flex gap-3">
                    <div className="w-7 h-7 rounded bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 font-mono text-[9px] font-bold shrink-0">
                      HID
                    </div>
                    <div>
                      <h5 className="font-sans font-black text-xs text-slate-200">Hidden Layers (Computing Pattern Spaces)</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                        Interconnected synaptic matrices process raw signals. By applying mathematical weights (strengths of synapses) and non-linear activation biases, these node grids extract high-level patterns and draw boundaries between categories.
                      </p>
                    </div>
                  </div>

                  {/* Output Layer */}
                  <div className="p-3 rounded-lg border border-emerald-500/10 bg-slate-950/40 hover:border-emerald-500/20 transition-all flex gap-3">
                    <div className="w-7 h-7 rounded bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 font-mono text-[9px] font-bold shrink-0">
                      OUT
                    </div>
                    <div>
                      <h5 className="font-sans font-black text-xs text-slate-200">Output Layer (Acting / Classifying)</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                        The final computation layer registers the desired output. It infers probability lists (such as Feline classification percentages) or continuously maps analog kinetic joint movements and motorized pendulum motor forces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt footer action */}
            <div className="mt-4 p-3 bg-[#0d1424]/40 border border-slate-900 rounded-xl flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              <p className="font-mono text-[8px] text-cyan-300 uppercase tracking-wide">
                Awaiting operators control instruction panel... select a model above to begin.
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Supervised Learning block (Cat, Dog, and Rabbit animal classification) */}
        {activeParadigm === "supervised" && (
          <div id="supervised-container" className="flex-1 flex flex-col justify-between animate-fadeIn scroll-mt-24">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 select-none">
                <span className="font-mono text-[8px] text-purple-400 font-extrabold tracking-wider uppercase block">SUPERVISED CLASSIFICATION: SPECIES CLASSIFIER</span>
                <span className="font-mono text-[7px] px-1.5 py-0.5 rounded border border-purple-950 text-purple-450 bg-purple-950/10 uppercase">SPECIES ID ENGINE</span>
              </div>

              {/* Training State Selectors */}
              <div className="mb-4">
                <span className="font-mono text-[7px] text-slate-500 uppercase block mb-1.5 font-bold tracking-wider">MODEL TRAINING STATUS</span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={handleClearTrained}
                    className={`px-2 py-1.5 font-mono text-[8.5px] font-bold rounded border transition-all cursor-pointer ${
                      trainedAnimals.length === 0
                        ? "border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.12)]"
                        : "border-slate-850 bg-slate-950/40 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Untrained
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTrained("cat")}
                    className={`px-2 py-1.5 font-mono text-[8.5px] font-bold rounded border transition-all cursor-pointer ${
                      trainedAnimals.includes("cat")
                        ? "border-[#22d3ee] bg-[#22d3ee]/15 text-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,0.12)]"
                        : "border-slate-850 bg-slate-950/40 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Trained (Cat)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTrained("dog")}
                    className={`px-2 py-1.5 font-mono text-[8.5px] font-bold rounded border transition-all cursor-pointer ${
                      trainedAnimals.includes("dog")
                        ? "border-[#f59e0b] bg-[#f59e0b]/15 text-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.12)]"
                        : "border-slate-850 bg-slate-950/40 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Trained (Dog)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTrained("rabbit")}
                    className={`px-2 py-1.5 font-mono text-[8.5px] font-bold rounded border transition-all cursor-pointer ${
                      trainedAnimals.includes("rabbit")
                        ? "border-[#34d399] bg-[#34d399]/15 text-[#34d399] shadow-[0_0_10px_rgba(52,211,153,0.12)]"
                        : "border-slate-850 bg-slate-950/40 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Trained (Rabbit)
                  </button>
                </div>
              </div>

              {/* Interactive Feeders */}
              <div className="mb-4">
                <span className="font-mono text-[7px] text-slate-500 uppercase block mb-1.5 font-bold tracking-wider">INTERACTIVE RAW DATA FEEDS</span>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleFeedAnimal("cat")}
                    className="p-2 text-left bg-cyan-950/15 hover:bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl flex flex-col justify-between transition-all text-sm group cursor-pointer relative overflow-hidden"
                  >
                    <div className="font-mono text-[7px] text-cyan-450 block font-bold leading-none mb-1">FEED SIGNAL</div>
                    <span className="font-sans font-extrabold text-[11px] text-[#edf2f7] group-hover:text-cyan-300">Cat 🐱</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedAnimal("dog")}
                    className="p-2 text-left bg-amber-950/15 hover:bg-amber-950/30 border border-amber-500/20 hover:border-amber-500/40 rounded-xl flex flex-col justify-between transition-all text-sm group cursor-pointer relative overflow-hidden"
                  >
                    <div className="font-mono text-[7px] text-amber-450 block font-bold leading-none mb-1">FEED SIGNAL</div>
                    <span className="font-sans font-extrabold text-[11px] text-[#edf2f7] group-hover:text-amber-400">Dog 🐶</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedAnimal("rabbit")}
                    className="p-2 text-left bg-emerald-950/15 hover:bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl flex flex-col justify-between transition-all text-sm group cursor-pointer relative overflow-hidden"
                  >
                    <div className="font-mono text-[7px] text-emerald-450 block font-bold leading-none mb-1">FEED SIGNAL</div>
                    <span className="font-sans font-extrabold text-[11px] text-[#edf2f7] group-hover:text-emerald-300">Rabbit 🐰</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Determination Tally */}
              <div className="mb-4 p-2.5 bg-slate-950 border border-slate-900 rounded-xl">
                <div className="flex items-center justify-between mb-1.5 border-b border-slate-900 pb-1.5">
                  <span className="font-mono text-[7px] text-slate-500 uppercase font-bold tracking-wider">DETERMINED SPECIMENS COUNTERS</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSupervisedCounts({ cat: 0, dog: 0, rabbit: 0, unknown: 0 });
                      setTrainedAnimals([]);
                      setSupervisedLog("Simulation state and tallies reset.");
                      setFedAnimal(null);
                      setFeedAnimation(null);
                    }}
                    className="px-2 py-0.5 font-mono text-[7px] font-black uppercase text-red-400 bg-red-950/25 border border-red-900/40 rounded hover:border-red-500 hover:bg-red-900/20 active:scale-95 transition-all cursor-pointer select-none"
                  >
                    Reset Simulation
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-white font-mono text-[10px] select-none">
                  <div className="p-1 px-1.5 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex flex-col items-center">
                    <span className="text-[7.5px] text-cyan-400 font-extrabold uppercase mb-0.5">CATS 🐱</span>
                    <span className="text-sm font-black text-[#22d3ee]">{supervisedCounts.cat}</span>
                  </div>
                  <div className="p-1 px-1.5 bg-amber-950/20 border border-amber-500/20 rounded-lg flex flex-col items-center">
                    <span className="text-[7.5px] text-amber-500 font-extrabold uppercase mb-0.5">DOGS 🐶</span>
                    <span className="text-sm font-black text-amber-400">{supervisedCounts.dog}</span>
                  </div>
                  <div className="p-1 px-1.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex flex-col items-center">
                    <span className="text-[7.5px] text-emerald-500 font-extrabold uppercase mb-0.5">RABBITS 🐰</span>
                    <span className="text-sm font-black text-emerald-400">{supervisedCounts.rabbit}</span>
                  </div>
                  <div className="p-1 px-1.5 bg-red-950/20 border border-red-500/20 rounded-lg flex flex-col items-center">
                    <span className="text-[7.5px] text-red-400 font-extrabold uppercase mb-0.5">UNKNOWN 🚫</span>
                    <span className="text-sm font-black text-red-500">{supervisedCounts.unknown}</span>
                  </div>
                </div>
              </div>

              {/* Logo display dynamic */}
              <div className="h-36 bg-slate-950 rounded-xl border border-slate-900 flex items-center justify-center p-4 relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-[radial-gradient(#141d3a_1px,transparent_1px)] bg-[size:12px_12px] opacity-40 pointer-events-none" />
                
                {/* Floating Animal Feeding Animation Overlay */}
                {feedAnimation?.active && (
                  <motion.div
                    initial={{ scale: 0.1, y: 30, opacity: 0 }}
                    animate={{ scale: [1, 1.4, 0.9], y: [-10, -30, -5], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.15, ease: "easeOut" }}
                    className="absolute z-40 pointer-events-none flex flex-col items-center gap-1 font-sans"
                  >
                    <div className="text-4xl filter drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] mb-1">
                      {feedAnimation.type === "cat" ? "🐱" : feedAnimation.type === "dog" ? "🐶" : "🐰"}
                    </div>
                    <div className="font-mono text-[11px] font-black tracking-widest text-[#22d3ee] uppercase text-center px-3 py-1 bg-[#010410] rounded-md border border-[#22d3ee]/40 animate-pulse">
                      FEEDING: {feedAnimation.type.toUpperCase()} SPECIMEN
                    </div>
                    <span className="font-mono text-[6.5px] bg-slate-900 border border-purple-500/35 text-purple-450 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                      FEEDING SYSTEM SYNAPSE INTEGRATOR
                    </span>
                  </motion.div>
                )}

                <div className="z-10 flex flex-col items-center justify-center">
                  {trainedAnimals.length === 0 || !fedAnimal ? (
                    <div className="text-slate-650 flex flex-col items-center justify-center">
                      <HelpCircle className="w-12 h-12 text-slate-700 animate-pulse mb-1" />
                    </div>
                  ) : predicted === "CAT" ? (
                    <CatLogo />
                  ) : predicted === "DOG" ? (
                    <DogLogo />
                  ) : predicted === "RABBIT" ? (
                    <RabbitLogo />
                  ) : (
                    <div className="w-14 h-14 bg-slate-950 border-2 border-dashed border-red-500/40 rounded-full flex items-center justify-center text-red-400 font-mono text-[8px] font-bold">
                      UNKNOWN
                    </div>
                  )}
                  <span className={`font-mono text-[7.5px] mt-2 block font-extrabold uppercase tracking-wider ${
                    trainedAnimals.length === 0 || !fedAnimal
                      ? "text-slate-500"
                      : predicted === "UNKNOWN"
                      ? "text-red-400 font-black animate-pulse"
                      : predicted === "CAT"
                      ? "text-cyan-400"
                      : predicted === "DOG"
                      ? "text-amber-500"
                      : "text-emerald-400"
                  }`}>
                    ACTIVE SENSOR SIGNATURE: {trainedAnimals.length === 0 || !fedAnimal ? "UNTRAINED_MODEL (?)" : predicted}
                  </span>
                </div>
              </div>
            </div>

            {/* Probability diagnostics and logger */}
            <div className="mt-4 p-3 bg-slate-950 border border-slate-900 rounded-xl font-mono text-[9px] flex justify-between items-center">
              <div>
                <span className="text-[7px] text-slate-500 block uppercase mb-1">PROBABILITY BAR COMPILATION</span>
                <div className="flex items-center gap-1.5 select-none w-44">
                  <div className="flex font-bold text-[8px] h-3 rounded-md overflow-hidden flex-1 border border-slate-900 bg-slate-900 text-center text-white">
                    {trainedAnimals.length === 0 || !fedAnimal ? (
                      <div className="bg-slate-800 leading-none h-full w-full" />
                    ) : (
                      <>
                        <div style={{ width: predicted === "CAT" ? "100%" : "0%" }} className="bg-cyan-500 leading-none h-full" />
                        <div style={{ width: predicted === "DOG" ? "100%" : "0%" }} className="bg-amber-500 leading-none h-full" />
                        <div style={{ width: predicted === "RABBIT" ? "100%" : "0%" }} className="bg-emerald-500 leading-none h-full" />
                        <div style={{ width: predicted === "UNKNOWN" ? "100%" : "0%" }} className="bg-red-500 leading-none h-full" />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-[7.5px] text-slate-500 mt-1 select-none">
                  <span>Cat: {trainedAnimals.includes("cat") && fedAnimal === "cat" ? "100" : "0"}%</span>
                  <span>Dog: {trainedAnimals.includes("dog") && fedAnimal === "dog" ? "100" : "0"}%</span>
                  <span>Rabbit: {trainedAnimals.includes("rabbit") && fedAnimal === "rabbit" ? "100" : "0"}%</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[7.5px] text-slate-550 block uppercase text-slate-500 font-bold mb-0.5">RESOLVED LOG VALUE</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{supervisedLog}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Unsupervised Spatial grouping of unlabeled gametelemetry coords */}
        {activeParadigm === "unsupervised" && (
          <div id="unsupervised-container" className="flex-1 flex flex-col justify-between animate-fadeIn animate-duration-200 scroll-mt-24">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 select-none">
                <span className="font-mono text-[8px] text-purple-400 font-extrabold tracking-wider uppercase block">UNSUPERVISED CLUSTERING: PLAYER CLASSIFIER</span>
                <span className="font-mono text-[7px] px-1.5 py-0.5 rounded border border-purple-950 text-purple-450 bg-purple-950/10 uppercase">K-MEANS DISCOVERY</span>
              </div>

              <p className="text-[10px] text-slate-400 block mb-3 leading-normal">
                Discovers features from unlabeled game datasets. Highlights clusters identifying Noob (low K/D & low APM), Good (moderate APM & K/D), or Expert players entirely on geometric spatial positions.
              </p>

              {/* 2D Grid Plotting matrices */}
              <div className="h-40 bg-slate-950 rounded-xl border border-slate-900 relative p-2 select-none overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1328_1px,transparent_1px),linear-gradient(to_bottom,#0c1328_1px,transparent_1px)] bg-[size:15px_15px] opacity-25 pointer-events-none" />
                
                {/* SVG diagram matrix */}
                <svg className="w-full h-full text-slate-650" viewBox="0 0 300 150">
                  {/* Grid labelling axes */}
                  <line x1="20" y1="130" x2="280" y2="130" stroke="#1e293b" strokeWidth="1" />
                  <line x1="20" y1="10" x2="20" y2="130" stroke="#1e293b" strokeWidth="1" />
                  <text x="280" y="142" textAnchor="end" fill="#475569" fontSize="6" fontWeight="bold">ACTIONS PER MINUTE (APM) &rarr;</text>
                  <text x="5" y="20" fill="#475569" fontSize="6" fontWeight="bold" transform="rotate(-90 5 20)">KILL/DEATH RATE &rarr;</text>

                  {/* Centroid highlights bubbles */}
                  {isClustered && (
                    <>
                      {/* Cluster 0 Centroid Bubble (Noob) */}
                      <circle cx="50" cy="110" r="30" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,3" strokeOpacity="0.45" />
                      <circle cx="50" cy="110" r="3" fill="#ef4444" />
                      <text x="50" y="118" textAnchor="middle" fill="#ef4444" fontSize="6.5" fontWeight="black">C1: NOOBS</text>

                      {/* Cluster 1 Centroid Bubble (Good) */}
                      <circle cx="140" cy="70" r="30" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,3" strokeOpacity="0.45" />
                      <circle cx="140" cy="70" r="3" fill="#38bdf8" />
                      <text x="140" y="78" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontWeight="black">C2: GOOD</text>

                      {/* Cluster 2 Centroid Bubble (Expert) */}
                      <circle cx="240" cy="30" r="30" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2,3" strokeOpacity="0.45" />
                      <circle cx="240" cy="30" r="3" fill="#10b981" />
                      <text x="240" y="38" textAnchor="middle" fill="#10b981" fontSize="6.5" fontWeight="black">C3: EXPERTS</text>
                    </>
                  )}

                  {/* Gamer dataset plot points */}
                  {players.map((plr, index) => {
                    // Map raw KD and APM coordinate dimensions to fits
                    // KD ranges 0.2 to 4.5 -> map to Y range 125 down to 15
                    const plotY = 125 - (plr.kd / 4.5) * 105;
                    // APM ranges 30 to 320 -> map to X range 35 to 275
                    const plotX = 35 + ((plr.apm - 30) / 290) * 235;

                    const color = plr.cluster === 0 ? "#ef4444" : plr.cluster === 1 ? "#38bdf8" : plr.cluster === 2 ? "#10b981" : "#475569";

                    return (
                      <g 
                        key={`plr_node_${index}`} 
                        className="cursor-pointer group"
                        onClick={() => setSelectedPlayerIndex(index)}
                      >
                        <circle
                          cx={plotX}
                          cy={plotY}
                          r={selectedPlayerIndex === index ? "7" : "5"}
                          fill={color}
                          stroke={selectedPlayerIndex === index ? "#ffffff" : "#020617"}
                          strokeWidth="1.5"
                          className="transition-all duration-350 transform hover:scale-125"
                        />
                        {selectedPlayerIndex === index && (
                          <rect x={plotX - 25} y={plotY - 14} width="50" height="9" rx="1.5" fill="#01040f" stroke="#475569" strokeWidth="0.5" />
                        )}
                        <text x={plotX} y={plotY - 8} textAnchor="middle" fill="#edf2f7" fontSize="5.5" fontWeight="bold" className={`${selectedPlayerIndex === index ? "block" : "hidden"}`}>
                          {plr.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Player list telemetry data */}
              <div className="grid grid-cols-3 gap-2 mt-3 select-none">
                {players.slice(0, 6).map((plr, i) => (
                  <div
                    onClick={() => setSelectedPlayerIndex(i)}
                    className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedPlayerIndex === i 
                        ? "bg-[#09152b] border-[#1e3a6d]" 
                        : "bg-[#030610]/80 border-slate-900 hover:border-slate-800"
                    }`}
                    key={`plr_row_${i}`}
                  >
                    <span className="font-mono text-[7px] text-slate-400 truncate block font-bold">{plr.name}</span>
                    <div className="flex justify-between items-center mt-0.5 select-none font-mono text-[7px]">
                      <span className="text-slate-500 font-extrabold">KD: {plr.kd}</span>
                      <span className="text-violet-400 font-extrabold">APM: {plr.apm}</span>
                    </div>
                    {isClustered && (
                      <span className={`text-[6.5px] font-extrabold block uppercase mt-0.5 ${plr.cluster === 0 ? "text-red-400" : plr.cluster === 1 ? "text-sky-450" : "text-emerald-400"}`}>
                        [{plr.group.toUpperCase()}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Clustering Actions */}
            <div className="mt-5 border-t border-slate-900 pt-3.5 flex flex-col gap-3 font-mono">
              <div className="bg-slate-950/40 p-3 border border-slate-900 rounded-xl">
                <span className="font-mono text-[7px] block text-slate-500 uppercase mb-1.5 font-bold">Unsupervised Learning Switch</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUnsupervisedModeChange("untrained")}
                    className={`flex-1 py-2 font-mono text-[8.5px] font-bold rounded border transition-all cursor-pointer ${
                      unsupervisedTrainingState === "untrained"
                        ? "border-[#ef4444] bg-[#ef4444]/15 text-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                        : "border-slate-850 bg-slate-950/45 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Untrained Scattered
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUnsupervisedModeChange("trained")}
                    className={`flex-1 py-2 font-mono text-[8.5px] font-bold rounded border transition-all cursor-pointer ${
                      unsupervisedTrainingState === "trained"
                        ? "border-[#10b981] bg-[#10b981]/15 text-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                        : "border-slate-850 bg-slate-950/45 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    Trained Clusters
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[7.5px] text-slate-500 leading-snug flex-1">
                  STATUS: <strong className="text-purple-400 uppercase">{unsupervisedLog}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reinforcement Learning Inverted Pendulum Balancing */}
        {activeParadigm === "reinforcement" && (
          <div id="reinforcement-container" className="flex-1 flex flex-col justify-between animate-fadeIn animate-duration-200 scroll-mt-24">
            <div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 select-none">
                <span className="font-mono text-[8px] text-purple-400 font-extrabold tracking-wider uppercase block">REINFORCEMENT BALANCING: INVERTED PENDULUM</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowMdpModal(true)}
                    className="font-mono text-[7px] px-2 py-0.5 rounded border border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500 hover:text-slate-950 transition-all font-extrabold uppercase cursor-pointer flex items-center gap-1 shadow-sm hover:shadow-purple-500/25 active:scale-95"
                    title="Open Markov Decision Process (MDP) Interactive Guide"
                  >
                    <BookOpen className="w-2.5 h-2.5" /> MDP Guide
                  </button>
                  <span className="font-mono text-[7px] px-1.5 py-0.5 rounded border border-purple-950 text-purple-450 bg-purple-950/10 uppercase">AGENT STRATEGY CORE</span>
                </div>
              </div>

              {/* Selector for Episode Stages */}
              <div className="flex gap-1.5 mb-3 font-mono text-[8px]">
                <button
                  onClick={() => changeRlStage("low")}
                  className={`flex-1 py-1.5 rounded-lg border uppercase font-extrabold tracking-wider transition-all select-none cursor-pointer ${
                    rlStage === "low" 
                      ? "border-red-500 bg-red-950/20 text-red-400" 
                      : "border-slate-800 bg-slate-950/50 text-slate-500 hover:bg-slate-900"
                  }`}
                  title="Episode 5: Low training. Fails and tumbles within 2 seconds."
                >
                  Episode 5 (Untrained)
                </button>

                <button
                  onClick={() => changeRlStage("medium")}
                  className={`flex-1 py-1.5 rounded-lg border uppercase font-extrabold tracking-wider transition-all select-none cursor-pointer ${
                    rlStage === "medium" 
                      ? "border-sky-500 bg-sky-950/20 text-sky-400" 
                      : "border-slate-800 bg-slate-950/50 text-slate-500 hover:bg-slate-900"
                  }`}
                  title="Episode 65: Moderately trained. Wobbles heavily but recovers."
                >
                  Episode 65 (Adaptive)
                </button>

                <button
                  onClick={() => changeRlStage("high")}
                  className={`flex-1 py-1.5 rounded-lg border uppercase font-extrabold tracking-wider transition-all select-none cursor-pointer ${
                    rlStage === "high" 
                      ? "border-emerald-500 bg-emerald-950/20 text-emerald-400" 
                      : "border-slate-800 bg-slate-950/50 text-slate-500 hover:bg-slate-900"
                  }`}
                  title="Episode 250: Flawlessly trained. Perfectly vertical stability."
                >
                  Episode 250 (Optimal)
                </button>
              </div>

              {/* Simulated Pendulum SVG Graphic (Matches PID model perfectly) */}
              <div className="h-64 bg-slate-950 rounded-xl border border-slate-900 relative p-3 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#1c164a_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

                {/* Status metrics banners */}
                <div className="flex justify-between items-center z-10 font-mono text-[8px] select-none">
                  <div className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400 font-bold">
                    POLE ANGLE GAP: <span className={`${Math.abs(rlAngle) > 25 ? "text-red-400 animate-pulse font-extrabold" : "text-emerald-400"}`}>{rlAngle.toFixed(1)}°</span>
                  </div>

                  <div className="bg-[#0b1c12] px-2 py-0.5 rounded border border-emerald-950 text-emerald-400 font-extrabold">
                    REWARD STACK: {rlRewards} pts
                  </div>
                </div>

                {/* SVG Canvas (Identical to PID model) */}
                <div className="flex-1 w-full relative">
                  <svg className="w-full h-full relative" viewBox="-150 -75 300 150" preserveAspectRatio="xMidYMid meet">
                    {/* Rail center base line */}
                    <line x1="-120" y1="40" x2="120" y2="40" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />

                    <g transform={`translate(${rlCartX - 130}, 40)`}>
                      {/* Wheels */}
                      <circle cx="-15" cy="8" r="6" fill="#020617" stroke="#475569" strokeWidth="1.25" />
                      <circle cx="15" cy="8" r="6" fill="#020617" stroke="#475569" strokeWidth="1.25" />

                      {/* Cart Body */}
                      <rect x="-25" y="-8" width="50" height="16" rx="3" fill="#0b1329" stroke="#f59e0b" strokeWidth="1.25" />

                      {/* Sensor LED on cart */}
                      <circle cx="0" cy="-4" r="2.2" fill={rlStage === "low" ? "#ef4444" : rlStage === "medium" ? "#38bdf8" : "#10b981"} />

                      {/* Pendulum Arm rotating relative to cart */}
                      <g transform={`rotate(${rlAngle})`}>
                        {/* Axis pivot ring */}
                        <circle cx="0" cy="0" r="4" fill="#334155" />
                        
                        {/* Pole Shaft */}
                        <line x1="0" y1="0" x2="0" y2="-50" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                        
                        {/* Mass Bob (End point) */}
                        <circle cx="0" cy="-50" r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.25" className="animate-pulse" />
                        {/* Mass bob center core */}
                        <circle cx="0" cy="-50" r="2.2" fill="#0f172a" />
                      </g>
                    </g>

                    {/* Angle Reference helper line */}
                    <line x1={rlCartX - 130} y1="-10" x2={rlCartX - 130} y2="40" stroke="#334155" strokeWidth="0.75" strokeDasharray="3,4" />
                  </svg>
                </div>

                {/* Floating metric duration */}
                <div className="flex justify-[#edf2f7] justify-between items-center z-10 font-mono text-[7px] text-slate-500 uppercase select-none mt-1">
                  <span>REINFORCEMENT ENVIRONMENT BALANCE PLANE</span>
                  <span>SURVIVED TIME: {rlSurvivalTime}s / {rlStage === "low" ? "2s" : rlStage === "medium" ? "15s" : "60s+"}</span>
                </div>
              </div>

              {/* Interactive disrupter section */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-left font-mono text-[9px] text-slate-400 leading-normal mt-3">
                <span className="text-[7.5px] font-extrabold text-purple-400 uppercase block mb-1">INTERACTIVE INSTANT DISRUPTER</span>
                <p className="text-[8px] text-slate-500 block mb-2 leading-none">Inject horizontal pulse load momentum directly into the reinforcement agent:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleRlPerturb("left");
                      setRlLeftPulseActive(false);
                      setTimeout(() => setRlLeftPulseActive(true), 15);
                    }}
                    className="bg-slate-900 border border-slate-800 text-[8px] text-slate-300 py-1 font-bold rounded uppercase hover:bg-slate-850 cursor-pointer overflow-hidden relative font-mono"
                  >
                    <span className="relative z-10">&lt;&lt; Push Left</span>
                    {rlLeftPulseActive && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0.9 }}
                        animate={{ scale: 4.5, opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        onAnimationComplete={() => setRlLeftPulseActive(false)}
                        className="absolute w-12 h-12 bg-purple-500/25 rounded-full pointer-events-none"
                        style={{ left: "calc(50% - 24px)", top: "calc(50% - 24px)" }}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleRlPerturb("right");
                      setRlRightPulseActive(false);
                      setTimeout(() => setRlRightPulseActive(true), 15);
                    }}
                    className="bg-slate-900 border border-slate-800 text-[8px] text-slate-300 py-1 font-bold rounded uppercase hover:bg-slate-850 cursor-pointer overflow-hidden relative font-mono"
                  >
                    <span className="relative z-10">Push Right &gt;&gt;</span>
                    {rlRightPulseActive && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0.9 }}
                        animate={{ scale: 4.5, opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        onAnimationComplete={() => setRlRightPulseActive(false)}
                        className="absolute w-12 h-12 bg-purple-500/25 rounded-full pointer-events-none"
                        style={{ left: "calc(50% - 24px)", top: "calc(50% - 24px)" }}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Simulation feedback console tickers */}
              <div className="bg-[#020510] border border-slate-950 rounded-xl p-2.5 text-left font-mono text-[7.5px] space-y-1 mt-3.5 leading-normal max-h-[82px] overflow-y-auto">
                <span className="text-[7px] text-slate-500 block uppercase border-b border-slate-900/40 pb-0.5 mb-1.5 font-bold">Policy Evaluation Real-time logs</span>
                {rlLogs.map((log, idx) => (
                  <div
                    key={`rl_log_${idx}`}
                    className={log.includes("LOST") || log.includes("TUMBLED") ? "text-rose-400 font-bold" : log.includes("Balanced") || log.includes("Wobbling") ? "text-cyan-400 font-semibold" : "text-slate-400"}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={toggleRlSimulation}
              className={`w-full mt-3.5 py-2 font-mono text-[9px] font-bold rounded-lg border uppercase transition-all cursor-pointer ${
                isRlRunning 
                  ? "border-red-500/50 bg-red-950/10 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.1)]" 
                  : "border-purple-500/35 bg-slate-950/90 text-purple-400 hover:text-white"
              }`}
            >
              {isRlRunning ? "STOP BALANCE LOGGING TRIAL" : "ENGAGE PENDULUM BALANCING TRIAL"}
            </button>
          </div>
        )}

        {/* MDP Guide Modal Overlay - rendered conditionally inside component scope */}
        {showMdpModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setShowMdpModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-4xl bg-[#090518] border-2 border-purple-900/60 rounded-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden shadow-2xl z-10 text-left cursor-default max-h-[94vh] sm:max-h-[90vh] flex flex-col justify-between"
            >
              {/* Top glowing ambient strip */}
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-purple-950/40 mb-5 shrink-0 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-purple-800 bg-purple-500/10 text-purple-400 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                    <Brain className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="font-mono text-[8px] font-extrabold uppercase tracking-widest text-purple-400 block">REINFORCEMENT LEARNING CORE</span>
                    <p className="font-sans text-[13px] sm:text-base font-extrabold text-slate-100 leading-tight">
                      Markov Decision Process (MDP) Interactive Guide
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMdpModal(false)}
                  className="w-7 h-7 bg-slate-950/80 border border-slate-900 hover:border-purple-800/40 hover:bg-purple-950/30 text-slate-400 hover:text-purple-300 rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scrollable Contents */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar font-sans text-xs text-slate-300 leading-relaxed md:pb-4">
                
                {/* Introduction Card */}
                <div className="p-4 bg-purple-950/10 border border-purple-900/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-purple-400 font-extrabold uppercase">
                    <Info className="w-3.5 h-3.5" /> What is an MDP?
                  </div>
                  <p>
                    A <strong>Markov Decision Process (MDP)</strong> is a classical mathematical framework used to model decision-making in environments where outcomes are partially random and partially under the control of a decision-maker (the agent). It forms the foundational model for almost all <strong>Reinforcement Learning (RL)</strong> algorithms.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    The term <strong>"Markov"</strong> indicates that the environment complies with the <em>Markov Property</em>: the future is conditionally independent of the past given the present state. In other words, to make an optimal decision, you only need to know the current state, not how you got there.
                  </p>
                </div>

                {/* MDP Mapping Table */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center select-none">
                    <span className="font-mono text-[9px] text-purple-400 font-extrabold uppercase tracking-wider block">
                      [TABLE 1.0] THE 5-TUPLE FORMULATION MAPPED TO OUR CART-POLE
                    </span>
                    <span className="font-mono text-[7px] text-slate-500 font-bold uppercase">
                      HOVER TO REVEAL CORRESPONDENCE
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-purple-950/30 bg-[#04020a]">
                    <table className="w-full text-left font-mono text-[10px] sm:text-[11px] border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-purple-950/30 border-b border-purple-950/50 text-purple-400 font-extrabold uppercase select-none">
                          <th className="p-3 text-[9px] w-[18%]">Tuple Component</th>
                          <th className="p-3 text-[9px] w-[27%]">Mathematical Role</th>
                          <th className="p-3 text-[9px] text-purple-300 w-[20%]">Simulation Values</th>
                          <th className="p-3 text-[9px] text-slate-500 w-[35%]">Physical Execution Detail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-950/20 text-slate-300">
                        <tr className="hover:bg-purple-500/5 transition-colors">
                          <td className="p-3 font-semibold text-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            State (<span className="text-purple-400">S</span>)
                          </td>
                          <td className="p-3 text-slate-400 leading-snug">
                            All environmental variables the agent relies on. At step t, state is S_t ∈ S.
                          </td>
                          <td className="p-3 text-purple-350 font-bold">
                            [ x, dx, θ, dθ ]
                          </td>
                          <td className="p-3 text-slate-300 leading-normal">
                            Readings from linear position sensor (Cart position/velocity) & rotary encoder (Pole angle/angular velocity).
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-500/5 transition-colors">
                          <td className="p-3 font-semibold text-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Action (<span className="text-purple-400">A</span>)
                          </td>
                          <td className="p-3 text-slate-400 leading-snug">
                            Available choices A_t ∈ A the agent can select to execute.
                          </td>
                          <td className="p-3 text-purple-350 font-bold">
                            [ LEFT, RIGHT ]
                          </td>
                          <td className="p-3 text-slate-300 leading-normal">
                            Fires motor voltage states to drive cart base left (-10N thrust) or right (+10N thrust) to counter dynamic gravity load vectors.
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-500/5 transition-colors">
                          <td className="p-3 font-semibold text-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            Transition (<span className="text-purple-400">P</span>)
                          </td>
                          <td className="p-3 text-slate-400 leading-snug">
                            Probability of landing on s' from (s, a): P(s' | s, a).
                          </td>
                          <td className="p-3 text-purple-350 font-bold">
                            Deterministic Physics
                          </td>
                          <td className="p-3 text-slate-300 leading-normal">
                            Governed by friction coefficients, force thrust magnitude, cart mass, mass center, and current gravity fields.
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-500/5 transition-colors">
                          <td className="p-3 font-semibold text-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Reward (<span className="text-purple-400">R</span>)
                          </td>
                          <td className="p-3 text-slate-400 leading-snug">
                            Feedback score R(s, a) indicating immediate goodness of action.
                          </td>
                          <td className="p-3 text-purple-350 font-bold">
                            +100 pts or 0 pts
                          </td>
                          <td className="p-3 text-slate-300 leading-normal">
                            Gives +100 reward for each time step the pole is kept within ±36° and cart remains on track. Returns 0 on tipping reset.
                          </td>
                        </tr>
                        <tr className="hover:bg-purple-500/5 transition-colors">
                          <td className="p-3 font-semibold text-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Discount (<span className="text-purple-400">γ</span>)
                          </td>
                          <td className="p-3 text-slate-400 leading-snug">
                            Gamma γ ∈ [0, 1] models the importance given to future rewards.
                          </td>
                          <td className="p-3 text-purple-350 font-bold">
                            γ = 0.99
                          </td>
                          <td className="p-3 text-slate-300 leading-normal">
                            Prioritizes far-reaching structural safety. It forces the agent to prevent early wiggles that lead inevitably to tipping.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* The Bellman & Q-Learning Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 space-y-2.5">
                    <span className="font-mono text-[9px] text-purple-400 font-extrabold uppercase tracking-wider block">
                      Learning via Q-Value Estimation
                    </span>
                    <p className="text-[11px] text-slate-350 leading-relaxed animate-pulse">
                      By modeling the environment as an MDP, the agent uses <strong>temporal-difference learning</strong> to approximate the value of performing an action a inside a specific state s. This status metric is stored as Q(s, a).
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      When training our cart-pole model across episodes (e.g. Episode 5 to Episode 250), the system continuously updates its policy matrix using the classic <strong>Bellman Update Equation</strong> displayed on the right. Over hundreds of balancing trials, the optimal action coordinates converge.
                    </p>
                  </div>
                  <div className="md:col-span-5 bg-black/40 border border-purple-950/40 p-3.5 rounded-xl flex flex-col justify-center space-y-2 select-none">
                    <span className="font-mono text-[8.5px] text-purple-400 font-extrabold uppercase leading-none block">THE BELLMAN UPDATE EQUATION</span>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[9px] sm:text-[10px] text-center text-purple-300 leading-normal">
                      {"Q(s, a) ⟵ Q(s, a) + α [ r + γ max_a' Q(s', a') - Q(s, a) ]"}
                    </div>
                    <div className="font-mono text-[7.5px] text-slate-500 space-y-0.5 leading-snug">
                      <p>• <strong className="text-purple-400">α (Alpha):</strong> Learning rate, governing speed of update.</p>
                      <p>• <strong className="text-purple-400">r:</strong> Current step scalar reward (+100 pts).</p>
                      <p>• <strong className="text-purple-400">γ (Gamma):</strong> Future discount (set to 0.99).</p>
                      <p>• <strong className="text-purple-400">max Q(s', a'):</strong> Max potential value expected in next state.</p>
                    </div>
                  </div>
                </div>

                {/* Training Stages Explained */}
                <div className="space-y-2 shrink-0 border-t border-purple-950/30 pt-4">
                  <span className="font-mono text-[9px] text-purple-400 font-extrabold uppercase tracking-wider block">
                    How Training Affects the MDP Decisions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[9px] sm:text-[10px]">
                    <div className="p-3 bg-red-950/5 border border-red-900/10 rounded-lg space-y-1.5">
                      <span className="text-red-400 font-extrabold block uppercase">[Untrained Pilot]</span>
                      <p className="text-slate-400 text-[9px] leading-snug font-sans">
                        The Q-table is filled with zeroes or random weights. The agent initiates random actions, immediately tilting the pole past the failure boundary.
                      </p>
                    </div>
                    <div className="p-3 bg-sky-950/5 border border-sky-900/10 rounded-lg space-y-1.5">
                      <span className="text-sky-400 font-extrabold block uppercase">[Adaptive wobbles]</span>
                      <p className="text-slate-400 text-[9px] leading-snug font-sans">
                        The agent has mapped critical hazard zones. It performs continuous aggressive Left/Right actions, wobbling significantly but maintaining survival.
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-950/5 border border-emerald-900/10 rounded-lg space-y-1.5">
                      <span className="text-emerald-400 font-extrabold block uppercase">[Optimal policy]</span>
                      <p className="text-slate-400 text-[9px] leading-snug font-sans">
                        The state-action value landscape is perfectly converged. The system predicts minor offset angles early, maintaining near-perfect rest posture.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-purple-950/40 flex justify-end gap-2 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setShowMdpModal(false)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-mono text-[10px] font-bold rounded-lg cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.25)] select-none uppercase"
                >
                  ACQUIRE &amp; CLOSE STATION
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
