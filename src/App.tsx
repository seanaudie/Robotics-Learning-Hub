/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ROBOTIC_PARTS } from "./data";
import { RoboticPart, ChatMessage } from "./types";
import InteractiveDiagram, { getRealImagePath } from "./components/InteractiveDiagram";
import RoboticsGuide from "./components/RoboticsGuide";
import AIChatTutor from "./components/AIChatTutor";
import AIOutputRenderer from "./components/AIOutputRenderer";
import HomePage from "./components/HomePage";
import PremiumLogo from "./components/PremiumLogo";
import { Cpu, Zap, Eye, HelpCircle, HardDrive, Compass, BookOpen, Clock, Activity, Settings, Sparkles, MessageSquare, ChevronLeft, ChevronRight, Terminal, Radio, Layers, Info, Sliders, Database } from "lucide-react";

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
  const [isStarted, setIsStarted] = useState(() => {
    const hash = window.location.hash;
    return hash !== "" && hash !== "#home" && ["#explorer", "#guides", "#chat"].includes(hash);
  });
  const [activeTab, setActiveTab] = useState<"explorer" | "guides" | "chat">(() => {
    const hash = window.location.hash;
    if (hash === "#guides") return "guides";
    if (hash === "#chat") return "chat";
    return "explorer";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#home") {
        setIsStarted(false);
      } else if (hash === "#explorer") {
        setIsStarted(true);
        setActiveTab("explorer");
      } else if (hash === "#guides") {
        setIsStarted(true);
        setActiveTab("guides");
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
  const [selectedSensorSubcategory, setSelectedSensorSubcategory] = useState<string>("all");

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
      setSandboxResponse(`### ⚠️ System Warning\n\nFailed to establish link with AI Advisor: ${err.message || "Unknown communication state."}`);
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
        <HomePage onEnter={(startingTab) => {
          window.location.hash = startingTab || "explorer";
        }} />
      ) : (
        <div className="min-h-screen bg-[#020617] text-slate-50 flex font-sans relative overflow-x-hidden antialiased">
          {/* Left Action Sidebar (Geometric Balance styling) */}
          <aside className={`${isSidebarExpanded ? "w-64" : "w-20"} border-r border-slate-800 flex flex-col py-8 bg-[#020617] shrink-0 md:flex hidden z-20 transition-all duration-300`}>
            <button
              onClick={() => { window.location.hash = "home"; }}
              className="flex items-center justify-center px-4 mb-8 cursor-pointer hover:opacity-85 transition-opacity"
              title="Return to Homepage"
            >
              <PremiumLogo className="w-11 h-11" />
            </button>
 
            <nav className="flex flex-col gap-2 w-full px-2">
              {[
                { id: "explorer", label: "Component Diagnostics", icon: Compass },
                { id: "guides", label: "Robotics Guides", icon: BookOpen },
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
                    {isSidebarExpanded && <span className="font-mono font-bold uppercase text-xs truncate max-w-[170px]">{tab.label}</span>}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto px-4">
              <button 
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
                className="w-full flex items-center gap-3 text-slate-500 hover:text-white transition-colors p-3 rounded-xl hover:bg-slate-900/40"
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
                  <PremiumLogo className="w-8 h-8 group-hover:scale-105 transition-transform duration-200" glow={true} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-extrabold text-[15px] sm:text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors">Robotics Learning Hub</span>
                      <span className="bg-sky-500/10 text-sky-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-sky-500/20 font-bold">STEM 2.0</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-mono group-hover:text-slate-400 transition-colors">Interactive Hardware Cross-Sections & AI Co-pilot</p>
                  </div>
                </button>

                {/* Right Status Panel Details */}
                <div className="flex items-center gap-4 text-xs font-mono text-slate-550">
                  <div className="hidden md:flex items-center gap-1.5 text-slate-450">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>UTC: <strong className="text-slate-200">2026-05-25 08:43:00</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 " />
                    <span className="text-[10px] text-slate-300 font-bold">LAB HOST CONNECTED</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Central Screen Platform Segment Controls */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-24 md:pb-6 flex flex-col gap-6 relative z-10">
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                {/* Active Tab Explorer Content layout */}
                {activeTab === "explorer" && (
                  <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full animate-fadeIn">
                    
                    {/* Column 1: Directory Deck (Left Sidebar Navigation) */}
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
                            { id: "microcontroller", name: "Microcontrollers", icon: <Cpu className="w-3.5 h-3.5 text-sky-450" />, badgeColor: "bg-sky-500/10 text-sky-450 border border-sky-500/20" },
                            { id: "sensor", name: "Sensors", icon: <Eye className="w-3.5 h-3.5 text-indigo-400" />, badgeColor: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" },
                            { id: "actuator", name: "Actuators", icon: <Zap className="w-3.5 h-3.5 text-emerald-400" />, badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
                            { id: "motordriver", name: "Motor Drivers", icon: <Sliders className="w-3.5 h-3.5 text-amber-500" />, badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20" }
                          ] as const).map((cat, catIdx) => {
                            let partsList = ROBOTIC_PARTS.filter((p) => p.category === cat.id);
                            const totalCount = partsList.length;
                            
                            if (cat.id === "sensor" && selectedSensorSubcategory !== "all") {
                              partsList = partsList.filter((p) => p.sensorApplication === selectedSensorSubcategory);
                            }

                            return (
                              <div key={cat.id} className={`space-y-2.5 ${catIdx > 0 ? "pt-3.5 border-t border-slate-800/60" : ""}`}>
                                <div className="flex items-center justify-between pl-1 select-none">
                                  <span className="font-mono text-[9px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                                    {cat.icon} {cat.name}
                                  </span>
                                  <span className="font-mono text-[8.5px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">
                                    {totalCount}
                                  </span>
                                </div>

                                {/* Custom Subcategory Filters only for Sensors */}
                                {cat.id === "sensor" && (
                                  <div className="flex flex-wrap gap-1 pb-1 outline-none">
                                    {([
                                      { id: "all", name: "All", color: "border-slate-800 bg-slate-950 text-slate-400" },
                                      { id: "sound", name: "🔊 Sound", color: "border-sky-500/20 bg-sky-500/10 text-sky-300" },
                                      { id: "touch", name: "👉 Touch", color: "border-pink-500/20 bg-pink-500/10 text-pink-300" },
                                      { id: "vision", name: "👁️ Vision", color: "border-purple-500/20 bg-purple-500/10 text-purple-300" },
                                      { id: "light", name: "🔆 Light", color: "border-amber-500/20 bg-amber-500/10 text-amber-300" },
                                      { id: "environment", name: "🌍 Env", color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" },
                                      { id: "motion", name: "🔄 Motion", color: "border-blue-500/20 bg-blue-500/10 text-blue-300" },
                                      { id: "security", name: "🔑 Security", color: "border-indigo-500/20 bg-indigo-500/10 text-indigo-300" }
                                    ] as const).map((sub) => {
                                      const isActive = selectedSensorSubcategory === sub.id;
                                      return (
                                        <button
                                          key={sub.id}
                                          onClick={() => setSelectedSensorSubcategory(sub.id)}
                                          className={`text-[8px] font-mono px-1.5 py-0.5 rounded transition-all select-none border cursor-pointer ${
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

                                <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                                  {partsList.length === 0 ? (
                                    <div className="font-mono text-[9px] text-slate-500 italic p-3 text-center border border-slate-900 bg-slate-950/20 rounded-lg">
                                      No sensors found under this application category
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
                                              : "border-slate-800/60 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40 text-slate-400 hover:text-slate-100"
                                          }`}
                                        >
                                          {/* Left selection neon stick indicator */}
                                          {isSelected && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sky-400 shadow-[2px_0_8px_rgba(56,189,248,0.7)]" />
                                          )}
                                          <div className="truncate flex-1 pl-1">
                                            <h4 className="font-sans font-bold text-[11.5px] truncate">{part.name}</h4>
                                            {part.category === "sensor" && part.sensorApplication && (
                                              <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-wider block mt-0.5">
                                                Application: {part.sensorApplication}
                                              </span>
                                            )}
                                          </div>
                                          <span
                                            className={`font-mono text-[8px] px-1.5 py-0.5 rounded font-extrabold select-none shrink-0 ${
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
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                            <span className="font-mono text-[9px] text-sky-400 font-extrabold tracking-widest uppercase">Component Diagnostics</span>
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
                                      📡 REAL-TIME PIN TELEMETRY
                                    </span>
                                    <span className="bg-sky-400/10 text-sky-400 text-[8px] font-mono px-1.5 py-0.5 rounded border border-sky-400/20 font-bold animate-pulse">
                                      ANALYSIS ACTIVE
                                    </span>
                                  </div>
                                  
                                  <h4 className="font-sans font-extrabold text-[13px] text-white flex items-center gap-1.5 uppercase tracking-wide truncate">
                                    <Sliders className="w-4 h-4 text-sky-400 animate-spin flex-shrink-0" style={{ animationDuration: '6s' }} /> {hoveredHotspot.name}
                                  </h4>
                                  <p className="font-sans text-[11px] text-slate-350 leading-relaxed mt-1.5 font-medium">
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
                                    📡 REAL-TIME PIN TELEMETRY
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
                                    <div className="grid grid-cols-2 gap-x-1.5 gap-y-0.5 text-[8px] font-mono leading-none pt-0.5">
                                      <div>
                                        <span className="text-slate-500 block uppercase">FREQUENCY</span>
                                        <span className="text-slate-300 font-bold tracking-tight block truncate mt-0.5">{sigInfo.frequency}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500 block uppercase">AMPLITUDE</span>
                                        <span className="text-slate-350 font-bold block truncate mt-0.5">{sigInfo.amplitude}</span>
                                      </div>
                                      <div className="mt-1">
                                        <span className="text-slate-500 block uppercase">RANGE</span>
                                        <span className="text-slate-350 font-bold block mt-0.5">{sigInfo.voltageRange}</span>
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
                                  <span className="text-[8px] font-mono uppercase bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded border border-sky-950/40 font-bold">
                                    APPLICATION: {selectedPart.sensorApplication} SENSING
                                  </span>
                                  {selectedPart.sensorApplication === "sound" && <span className="text-xs" title="Sound application">🔊</span>}
                                  {selectedPart.sensorApplication === "touch" && <span className="text-xs" title="Touch application">👉</span>}
                                  {selectedPart.sensorApplication === "vision" && <span className="text-xs" title="Vision application">👁️</span>}
                                  {selectedPart.sensorApplication === "light" && <span className="text-xs" title="Light application">🔆</span>}
                                  {selectedPart.sensorApplication === "environment" && <span className="text-xs" title="Environment application">🌍</span>}
                                  {selectedPart.sensorApplication === "motion" && <span className="text-xs" title="Motion application">🔄</span>}
                                  {selectedPart.sensorApplication === "security" && <span className="text-xs" title="Security application">🔑</span>}
                                </div>
                              )}
                            </div>
                            <span className="font-mono text-[10px] bg-slate-900 text-sky-450 px-2.5 py-1 rounded border border-slate-800 font-bold self-start">
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
                              <Terminal className="w-3.5 h-3.5 text-sky-450" /> PHYSICS & SIGNAL PATHWAYS
                            </span>
                            <p className="text-[12px] text-slate-400 leading-relaxed font-sans">
                              {selectedPart.howItWorks}
                            </p>
                          </div>

                          {/* Real World context application */}
                          <div className="border-t border-slate-800/85 pt-3.5">
                            <span className="font-mono text-[9.5px] text-indigo-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                              <Database className="w-3.5 h-3.5 text-indigo-450" /> INDUSTRIAL ROBOTIC APPLICATIONS
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

                {/* Active Tab Assembly Guides Content layout */}
                {activeTab === "guides" && (
                  <div className="lg:col-span-12 space-y-6">
                    <RoboticsGuide />
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

            {/* Mobile Bottom Navigation Bar (Statically positioned below main section for easier control without overlapping page elements) */}
            <nav className="md:hidden static my-4 mx-4 bg-[#030a1c]/95 border border-slate-800 backdrop-blur-md flex justify-around py-3 px-3 rounded-2xl select-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-slate-700/40 z-10 shrink-0">
              {[
                { id: "explorer", label: "Diagnostics", icon: Compass },
                { id: "guides", label: "Guides", icon: BookOpen },
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
                    className={`flex flex-col items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "text-sky-400 font-bold bg-sky-500/10"
                        : "text-slate-500 hover:text-slate-200"
                    }`}
                  >
                    <IconComp className="w-5 h-5 shrink-0" />
                    <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Primary Footer */}
            <footer className="border-t border-slate-800 bg-slate-950/30 text-center py-6 font-mono text-[10px] text-slate-550 relative z-10 select-none mt-12">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© 2026 Robotics Explorer Lab. Formulated for advanced cybernetic engineering STEM models.</p>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
