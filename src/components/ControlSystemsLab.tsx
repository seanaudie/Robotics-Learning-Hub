import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Sliders, Activity, Info, Sparkles, RefreshCw, BookOpen, Calculator, Play, X, GraduationCap } from "lucide-react";

interface ControlSystemsLabProps {
  onOpenModal: (type: "closed" | "open") => void;
}

const getProgressStyle = (val: number, min: number, max: number, color: string) => {
  const percent = ((val - min) / (max - min)) * 100;
  return {
    background: `linear-gradient(to right, ${color} ${percent}%, #02050f ${percent}%)`,
    height: "6px"
  };
};

export const ControlSystemsLab = ({ onOpenModal }: { onOpenModal: (type: "closed" | "open") => void }) => {
  const [activeStation, setActiveStation] = useState<"voltage" | "pendulum">("voltage");
  const [isZNModalOpen, setIsZNModalOpen] = useState<boolean>(false);
  const [selectedParam, setSelectedParam] = useState<"risetime" | "overshoot" | "steadystate" | "stability" | null>(null);
  const [calcKu, setCalcKu] = useState<number>(8.0);
  const [calcPu, setCalcPu] = useState<number>(2.2);

  const pendulumVisualizerRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // STATION A: Voltage PID Step-Response States
  // ==========================================
  const [pidKp, setPidKp] = useState<number>(3.5);
  const [pidKi, setPidKi] = useState<number>(1.2);
  const [pidKd, setPidKd] = useState<number>(0.6);
  const [isPidClosedLoop, setIsPidClosedLoop] = useState<boolean>(true);
  const [pidSetpoint, setPidSetpoint] = useState<number>(1.0);
  const [showStabilizedReference, setShowStabilizedReference] = useState<boolean>(false);

  // ==========================================
  // STATION B: Inverted Pendulum States
  // ==========================================
  const [kp, setKp] = useState(0.0);
  const [ki, setKi] = useState(0.0);
  const [kd, setKd] = useState(0.0);
  
  const [loopType, setLoopType] = useState<"closed" | "open">("closed");
  const [isRunning, setIsRunning] = useState(false);

  const [leftPulseActive, setLeftPulseActive] = useState(false);
  const [rightPulseActive, setRightPulseActive] = useState(false);

  // Cart-pole physical states
  const [theta, setTheta] = useState(0.0); 
  const [thetaDot, setThetaDot] = useState(0.0);
  const [cartX, setCartX] = useState(0.0); 
  const [cartXDot, setCartXDot] = useState(0.0);
  const [dropFrame, setDropFrame] = useState<number | null>(null);

  const [errorSum, setErrorSum] = useState(0.0);
  const [history, setHistory] = useState<{ t: number; val: number; sp: number }[]>([]);
  const [timeStep, setTimeStep] = useState(0);

  // Reset function for Cart-pole
  const handleResetPendulum = () => {
    setErrorSum(0.0);
    setHistory([]);
    setTimeStep(0);
    setIsRunning(false);
    setTheta(0.0);
    setThetaDot(0.0);
    setCartX(0.0);
    setCartXDot(0.0);
    setDropFrame(null);
  };

  // Pulse disturb for Cart-pole
  const handlePerturb = (direction: "left" | "right") => {
    if (!isRunning) {
      setIsRunning(true);
      setTheta(0.18);
      setThetaDot(0.0);
      setCartX(0.0);
      setCartXDot(0.0);
      setErrorSum(0.0);
    }
    const pulseSign = direction === "left" ? -1 : 1;
    setThetaDot((prev) => prev + pulseSign * 1.8);
  };

  // Cart-pole physics loop simulation
  useEffect(() => {
    if (!isRunning) {
      if (history.length === 0) {
        const initialPoints = [];
        const baseAngleDeg = theta * (180 / Math.PI);

        for (let i = 0; i < 60; i++) {
          initialPoints.push({ t: i, val: baseAngleDeg, sp: 0 });
        }
        setHistory(initialPoints);
      }
      return;
    }

    const interval = setInterval(() => {
      const dt = 0.03; 

      if (dropFrame !== null) {
        const nextFrame = dropFrame + 1;
        let currentTheta = 0.0;
        if (nextFrame >= 30) {
          setDropFrame(null);
          setTheta(Math.PI);
          setThetaDot(0.0);
          currentTheta = Math.PI;
        } else {
          setDropFrame(nextFrame);
          const t = nextFrame / 30;
          const angle = Math.PI * (1 - Math.cos(t * Math.PI)) / 2;
          setTheta(angle);
          setThetaDot(0.0);
          currentTheta = angle;
        }
        setCartX(0.0);
        setCartXDot(0.0);

        const degreeValue = currentTheta * (180 / Math.PI);
        setHistory((prev) => {
          const updated = [...prev, { t: timeStep, val: Math.round(degreeValue * 10) / 10, sp: 0 }];
          if (updated.length > 60) updated.shift();
          return updated;
        });

        setTimeStep((prev) => prev + 1);
        return;
      }
      
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
      if (nextTheta < -Math.PI) nextTheta -= 2 * Math.PI;

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
  }, [isRunning, kp, ki, kd, loopType, timeStep, history.length, errorSum, theta, thetaDot, cartX, cartXDot, dropFrame]);

  // Sync Suggestion values when station changes
  useEffect(() => {
    if (activeStation === "voltage") {
      setCalcKu(8.0);
      setCalcPu(2.2);
    } else {
      setCalcKu(10.0);
      setCalcPu(1.5);
    }
  }, [activeStation]);

  const calculatedGains = {
    p: {
      kp: calcKu * 0.5,
      ki: 0,
      kd: 0,
    },
    pi: {
      kp: calcKu * 0.45,
      ki: (calcKu * 0.54) / Math.max(0.1, calcPu),
      kd: 0,
    },
    pid: {
      kp: calcKu * 0.6,
      ki: (calcKu * 1.2) / Math.max(0.1, calcPu),
      kd: calcKu * 0.075 * calcPu,
    },
    noOvershoot: {
      kp: calcKu * 0.2,
      ki: (calcKu * 0.4) / Math.max(0.1, calcPu),
      kd: calcKu * 0.066 * calcPu,
    }
  };

  const handleApplyGains = (type: "p" | "pi" | "pid" | "noOvershoot") => {
    const gains = calculatedGains[type];
    if (activeStation === "voltage") {
      const targetKp = Math.max(0, Math.min(12, Math.round(gains.kp * 10) / 10));
      const targetKi = Math.max(0, Math.min(5, Math.round(gains.ki * 100) / 100));
      const targetKd = Math.max(0, Math.min(3, Math.round(gains.kd * 100) / 100));
      
      setPidKp(targetKp);
      setPidKi(targetKi);
      setPidKd(targetKd);
    } else {
      const targetKp = Math.max(0, Math.min(200, Math.round(gains.kp * 10) / 10));
      const targetKi = Math.max(0, Math.min(50, Math.round(gains.ki * 100) / 100));
      const targetKd = Math.max(0, Math.min(50, Math.round(gains.kd * 10) / 10));
      
      setKp(targetKp);
      setKi(targetKi);
      setKd(targetKd);
    }
  };

  const thetaDegrees = theta * (180 / Math.PI);
  const isStabilized = isRunning && Math.abs(thetaDegrees) < 2.5 && Math.abs(thetaDot) < 0.15;
  const isLossOfControl = isRunning && Math.abs(thetaDegrees) > 60;
  const isFallen = isRunning && Math.abs(thetaDegrees) > 60;

  const getPExplanation = () => "Reacts to the size of the current error. Higher strength corrects faster, but causes wild overshoot and wobbling.";
  const getIExplanation = () => "Accumulates historical errors over time to eliminate steady displacement offset, but too much memory causes slow swinging.";
  const getDExplanation = () => "Monitors error change rates to act as a prediction brake, smothering fast oscillations and dampening overshoot.";

  const getStat1Label = () => "ANGULAR DEVIATION";
  const getStat1Value = () => `${thetaDegrees.toFixed(1)}°`;
  const getStat1Color = () => {
    if (!isRunning) return "text-slate-400";
    const val = Math.abs(thetaDegrees);
    return val <= 15 ? "text-emerald-400" : val > 37.5 ? "text-rose-400 animate-pulse font-extrabold" : "text-amber-400";
  };

  const getStat2Value = () => `${thetaDot.toFixed(2)} r/s`;
  const getStat3Value = () => `${(cartX / 10).toFixed(1)} cm`;
  const getStat4Value = () => {
    if (!isRunning) return "STANDBY";
    if (loopType === "open") return "FEEDBACK OFF";
    if (isFallen) return "FALLEN / CRASHED";
    if (isLossOfControl) return "LIMIT DIVERGENCY";
    if (isStabilized) return "STEADY LOCK";
    return "BALANCING LEVEL";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full anim-fadeIn text-left font-sans text-slate-100">
      
      {/* 1. Header & Curriculum Box */}
      <div className="lg:col-span-12 bg-[#050C1C]/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-start justify-between backdrop-blur-md">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-mono text-[9px] text-amber-400 font-extrabold uppercase tracking-wider">
              Control Systems & PID Feedback Lab
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">Feedback and Control Systems</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl font-medium">
            Automated systems rely on feedback sensors to achieve stability and precision. Closed-loop control systems continuously measure actual performance, compare it to the desired state, and compute instantaneous corrections using PID algorithms to eliminate error.
          </p>
        </div>
        
         {/* Diagram details decoder widgets */}
        <div className="flex flex-col sm:flex-row gap-4.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onOpenModal("open")}
            className="flex-1 md:w-56 text-left bg-[#0b0e14] hover:bg-[#121824] border border-slate-800 hover:border-violet-500 p-4.5 rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            title="Click to view Open-Loop characteristics"
          >
            <div className="flex items-center justify-between pointer-events-none mb-1">
              <span className="font-mono font-black text-violet-400 block uppercase text-[9px] tracking-wider">Open-Loop Control</span>
              <span className="font-mono text-[9px] text-violet-300 font-extrabold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/25 animate-pulse">DECODE 💡</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug pointer-events-none">Pure command output. Disconnects sensors; ignores error deviation.</p>
          </button>
          
          <button
            type="button"
            onClick={() => onOpenModal("closed")}
            className="flex-1 md:w-56 text-left bg-[#081229]/80 lg:bg-[#081229]/60 hover:bg-[#0d1c3a] border border-slate-800 hover:border-violet-500 p-4.5 rounded-2xl transition-all duration-200 group cursor-pointer focus:outline-none shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:shadow-[0_4px_20px_rgba(139,92,246,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            title="Click to view Closed-Loop characteristics"
          >
            <div className="flex items-center justify-between pointer-events-none mb-1">
              <span className="font-mono font-black text-violet-400 block uppercase text-[9px] tracking-wider">Closed-Loop control</span>
              <span className="font-mono text-[9px] text-violet-300 font-extrabold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/25 animate-pulse">DECODE 💡</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug pointer-events-none">Pipes output back to input as feedback, dynamically minimizing error.</p>
          </button>
        </div>
      </div>

      {/* 2. Station Navigation Toggle */}
      <div className="lg:col-span-12 flex justify-start pb-1">
        <div className="flex flex-col bg-[#030712] p-2 rounded-2xl border border-slate-800 shadow-xl select-none w-full sm:w-auto">
          <div className="flex w-full">
            <button
              onClick={() => setActiveStation("voltage")}
              className={`font-mono text-xs uppercase tracking-wider font-extrabold px-6 py-4.5 rounded-2xl transition-all duration-250 cursor-pointer ${
                activeStation === "voltage"
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/40 font-black shadow-[0_0_12px_rgba(139,92,246,0.15)] scale-[1.03]"
                  : "text-slate-400 hover:text-violet-300 hover:bg-slate-900 border border-transparent hover:border-slate-800"
              }`}
            >
              Station 01: Voltage PID Response Lab
            </button>
            <button
              onClick={() => setActiveStation("pendulum")}
              className={`font-mono text-xs uppercase tracking-wider font-extrabold px-6 py-4.5 rounded-2xl transition-all duration-250 cursor-pointer ${
                activeStation === "pendulum"
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/40 font-black shadow-[0_0_12px_rgba(139,92,246,0.15)] scale-[1.03]"
                  : "text-slate-400 hover:text-violet-300 hover:bg-slate-900 border border-transparent hover:border-slate-800"
              }`}
            >
              Station 02: Inverted Cart-Pole Pendulum
            </button>
          </div>
        </div>
      </div>

      {/* 3. Render Selected Station Content */}
      {activeStation === "voltage" ? (
        // ==========================================
        // VOLTAGE STEP-RESPONSE LAB
        // ==========================================
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          <div className="lg:col-span-4 bg-[#050C1C]/90 rounded-2xl border border-slate-800/80 p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/40" />
            
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 font-extrabold">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-widest block">TELEMETRY TUNER UNIT</span>
                    <h3 className="font-sans font-black text-xs text-slate-100 uppercase tracking-tight">STATION 1 VOLTAGE GAINS</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZNModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[8.5px] font-mono font-black uppercase tracking-wider text-amber-400 border-2 border-amber-500/50 bg-amber-500/10 hover:bg-amber-550 hover:bg-amber-500 hover:text-slate-950 rounded-lg transition-all duration-150 cursor-pointer hover:shadow-[0_0_12px_rgba(245,158,11,0.3)] hover:scale-[1.03] active:scale-[0.97] focus:outline-none"
                  title="Open Ziegler-Nichols tuning tutorial"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Setpoint (Reference target) */}
                <div className="pl-3.5 border-l-2 border-amber-500/35 space-y-1.5 transition-all hover:border-amber-500/60">
                  <div className="flex justify-between font-mono text-[9.5px] text-slate-350 mb-1 font-extrabold select-none">
                    <span>SETPOINT TARGET (SV)</span>
                    <span className="text-amber-400 font-extrabold bg-amber-400/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">{pidSetpoint.toFixed(2)} V</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={pidSetpoint}
                    onChange={(e) => setPidSetpoint(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md"
                    style={getProgressStyle(pidSetpoint, 0.2, 2.0, "#f59e0b")}
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5">The desired reference output target voltage of the physical drive node.</span>
                </div>

                <div className="h-px bg-slate-800/20 my-1" />

                {/* Proportional Gain */}
                <div className="pl-3.5 border-l-2 border-amber-500/35 space-y-2.5 transition-all hover:border-amber-500/60">
                   <div className="flex justify-between items-center font-mono text-[9.5px] text-slate-350 font-extrabold select-none">
                    <span>[KP] PROPORTIONAL GAIN (P-TERM)</span>
                    <span className="text-amber-400 font-extrabold bg-amber-400/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">{pidKp.toFixed(1)}</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.2"
                    value={pidKp}
                    onChange={(e) => setPidKp(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md"
                    style={getProgressStyle(pidKp, 0, 12, "#f59e0b")}
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block"><strong>P (Proportional) - The Muscle:</strong> Reacts to size of current error. Higher strength corrects faster, but causes wild overshoot and rapid swing.</span>
                </div>

                {/* Integral Gain */}
                <div className="pl-3.5 border-l-2 border-amber-500/35 space-y-2.5 transition-all hover:border-amber-500/60">
                  <div className="flex justify-between items-center font-mono text-[9.5px] text-slate-350 font-extrabold select-none">
                    <span>[KI] INTEGRAL GAIN (I-TERM)</span>
                    <span className="text-amber-400 font-extrabold bg-amber-400/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">{pidKi.toFixed(2)}</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={pidKi}
                    onChange={(e) => setPidKi(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md"
                    style={getProgressStyle(pidKi, 0, 5, "#f59e0b")}
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block"><strong>I (Integral) - The Memory:</strong> Accumulates historical errors over time to eliminate steady displacement offset, but too much memory causes slow swinging.</span>
                </div>

                {/* Derivative Gain */}
                <div className="pl-3.5 border-l-2 border-amber-500/35 space-y-2.5 transition-all hover:border-amber-500/60">
                  <div className="flex justify-between items-center font-mono text-[9.5px] text-slate-350 font-extrabold select-none">
                    <span>[KD] DERIVATIVE GAIN (D-TERM)</span>
                    <span className="text-amber-400 font-extrabold bg-amber-400/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">{pidKd.toFixed(2)}</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.05"
                    value={pidKd}
                    onChange={(e) => setPidKd(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md"
                    style={getProgressStyle(pidKd, 0, 3, "#f59e0b")}
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block"><strong>D (Derivative) - The Braking:</strong> Monitors error change rates to act as a prediction brake, smothering fast oscillations and dampening overshoot.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setPidKp(3.5);
                setPidKi(1.2);
                setPidKd(0.6);
                setPidSetpoint(1.0);
                setIsPidClosedLoop(true);
              }}
              className="mt-6 w-full py-3.5 border-2 border-slate-700 bg-[#0d162d] hover:bg-amber-500 hover:border-amber-400 hover:text-slate-950 text-amber-450 text-amber-400 transition-all font-mono text-[9px] uppercase rounded-xl tracking-widest cursor-pointer font-black select-none hover:scale-[1.02] active:scale-[0.98] duration-150 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_20px_rgba(245,158,11,0.2)]"
            >
              RESET TO OPTIMIZED STANDARDS
            </button>
          </div>

          {/* Right side: step response scope plot */}
          {(() => {
            const kpVal = pidKp;
            const kiVal = pidKi;
            const kdVal = pidKd;
            const spVal = pidSetpoint;
            const dt = 0.05;

            const points: { t: number; y: number; sp: number; err: number }[] = [];
            let currentY = 0;
            let lastY = 0;
            let integralErr = 0;
            let lastErr = 0;

            for (let step = 0; step < 160; step++) {
              const t = step * dt;
              const err = spVal - currentY;
              integralErr += err * dt;
              const derivativeErr = (err - lastErr) / dt;
              
              const u = kpVal * err + kiVal * integralErr + kdVal * derivativeErr;

              // Plant coefficients (simulate physical plant friction dampers and springs)
              const mass = 1.0;
              const damping = 1.25; 
              const spring = 2.0;    

              const velocity = (currentY - lastY) / dt;
              const acceleration = (u - damping * velocity - spring * currentY) / mass;
              
              lastY = currentY;
              currentY = Math.max(0, currentY + velocity * dt + 0.5 * acceleration * dt * dt);
              lastErr = err;

              points.push({
                t: Math.round(t * 100) / 100,
                y: Math.min(2.5, currentY),
                sp: spVal,
                err: err
              });
            }

            // Generate perfectly stabilized reference curve points
            const stabilizedPoints: { t: number; y: number }[] = [];
            if (showStabilizedReference) {
              let refY = 0;
              let refLastY = 0;
              let refIntegralErr = 0;
              let refLastErr = 0;
              const refKp = 3.5;
              const refKi = 1.2;
              const refKd = 0.6;
              for (let step = 0; step < 160; step++) {
                const t = step * dt;
                const err = spVal - refY;
                refIntegralErr += err * dt;
                const derivativeErr = (err - refLastErr) / dt;
                
                const u = refKp * err + refKi * refIntegralErr + refKd * derivativeErr;

                const mass = 1.0;
                const damping = 1.25; 
                const spring = 2.0;    

                const velocity = (refY - refLastY) / dt;
                const acceleration = (u - damping * velocity - spring * refY) / mass;
                
                refLastY = refY;
                refY = Math.max(0, refY + velocity * dt + 0.5 * acceleration * dt * dt);
                refLastErr = err;

                stabilizedPoints.push({
                  t: Math.round(t * 100) / 100,
                  y: Math.min(2.5, refY)
                });
              }
            }

            const finalY = points[points.length - 1].y;
            const steadyStateErr = Math.abs(spVal - finalY);
            
            let peakHeight = 0;
            points.forEach(p => {
              if (p.y > peakHeight) peakHeight = p.y;
            });
            const overshootPct = peakHeight > spVal ? ((peakHeight - spVal) / spVal) * 100 : 0;

            let t90 = 0;
            let t10 = 0;
            let found10 = false;
            let found90 = false;
            for (let k = 0; k < points.length; k++) {
              const p = points[k];
              if (!found10 && p.y >= spVal * 0.1) {
                t10 = p.t;
                found10 = true;
              }
              if (!found90 && p.y >= spVal * 0.9) {
                t90 = p.t;
                found90 = true;
                break;
              }
            }
            const riseTime = (found90 && found10) ? Math.max(0.1, t90 - t10) : 0;

            const width = 500;
            const height = 240;
            const padding = 34;

            const getX = (valT: number) => padding + (valT / 8.0) * (width - 2 * padding);
            const getY = (valY: number) => height - padding - (valY / 2.5) * (height - 2 * padding);

            let pvPath = "";
            points.forEach((p, idx) => {
              const px = getX(p.t);
              const py = getY(p.y);
              if (idx === 0) pvPath = `M ${px} ${py}`;
              else pvPath += ` L ${px} ${py}`;
            });

            let refPvPath = "";
            if (showStabilizedReference) {
              stabilizedPoints.forEach((p, idx) => {
                const px = getX(p.t);
                const py = getY(p.y);
                if (idx === 0) refPvPath = `M ${px} ${py}`;
                else refPvPath += ` L ${px} ${py}`;
              });
            }

            const svPxStart = getX(0);
            const svPxEnd = getX(8.0);
            const svPy = getY(spVal);
            const svPath = `M ${svPxStart} ${svPy} L ${svPxEnd} ${svPy}`;

            return (
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-[#050C1C]/90 p-5 border border-slate-800 rounded-xl relative overflow-hidden select-none">
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-blue-500/20" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-blue-500/20" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-900">
                    <div>
                      <span className="font-mono text-[8px] text-blue-400 font-extrabold tracking-wider uppercase block">
                        OSCILLOSCOPE WAVES: STEP RESPONSE PV CURVES DECODER
                      </span>
                      <div className="flex flex-wrap gap-2.5 font-mono text-[7px] font-bold mt-1.5 text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-cyan-400 block" /> REF SV (SETPOINT)</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-rose-500 block animate-pulse" /> ACTUAL PV (CURRENT TUNING)</span>
                        {showStabilizedReference && (
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded bg-emerald-450 bg-emerald-400 block" /> STABILIZED REFERENCE GRAPH</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowStabilizedReference(!showStabilizedReference)}
                      type="button"
                      className={`px-3 py-1.5 rounded-lg border font-mono text-[8.5px] font-extrabold tracking-wide transition-all duration-150 cursor-pointer ${
                        showStabilizedReference
                          ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {showStabilizedReference ? "⚡ STABILIZED REFERENCE: ON" : "⚪ SHOW STABILIZED REFERENCE"}
                    </button>
                  </div>

                  <div className="relative bg-[#02050b] rounded-lg border border-slate-950 p-2 overflow-hidden">
                    <svg className="w-full h-auto aspect-[5/2.4] relative z-10" viewBox="0 0 500 240" fill="none">
                      {[0.5, 1.0, 1.5, 2.0, 2.5].map((gridY, gIdx) => {
                        const py = getY(gridY);
                        return (
                          <g key={gIdx}>
                            <line x1={padding} y1={py} x2={width - padding} y2={py} stroke="#0f172a" strokeWidth="1" strokeDasharray="3,3" />
                            <text x={padding - 6} y={py + 3} fill="#475569" fontSize="7.5" fontFamily="monospace" textAnchor="end">{gridY.toFixed(1)}V</text>
                          </g>
                        );
                      })}
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((gridT, tIdx) => {
                        const px = getX(gridT);
                        const pyBottom = height - padding;
                        return (
                          <g key={tIdx}>
                            <line x1={px} y1={padding} x2={px} y2={pyBottom} stroke="#0f172a" strokeWidth="1" strokeDasharray="3,3" />
                            <text x={px} y={pyBottom + 9} fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="middle">{gridT}s</text>
                          </g>
                        );
                      })}

                      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />
                      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1.5" />
                      <text x={width/2} y={height - 4} fill="#475569" fontSize="7.5" fontFamily="monospace" textAnchor="middle">Simulation Time Delta (Seconds)</text>

                      <path d={svPath} stroke="#22d3ee" strokeWidth="1.75" strokeDasharray="5,2" opacity="0.65" />
                      
                      {showStabilizedReference && (
                        <path d={refPvPath} stroke="#10b981" strokeWidth="2.25" strokeDasharray="4,3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
                      )}

                      <path d={pvPath} stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                    </svg>
                  </div>

                  {/* Operational specifications stats board */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 font-sans">
                    <button
                      type="button"
                      onClick={() => setSelectedParam("risetime")}
                      className="bg-[#0b0e17] p-4.5 rounded-2xl border border-slate-800 hover:border-violet-500 hover:bg-[#111624] text-left flex flex-col justify-between cursor-pointer transition-all duration-200 group relative overflow-hidden select-none outline-none focus:ring-2 focus:ring-violet-550 hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.2)]"
                      title="Click to view detailed Rise Time (Tr) information"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[9px] text-slate-400 group-hover:text-violet-400 uppercase font-black block leading-none transition-colors">Rise Time (Tr)</span>
                        <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors shrink-0" />
                      </div>
                      <span className="font-mono text-sm text-white font-black mt-3 block">
                        {riseTime ? `${riseTime.toFixed(2)}s` : isPidClosedLoop ? "Fast <0.2s" : "Infinite"}
                      </span>
                      <div className="flex items-center justify-between w-full mt-2 pt-1 border-t border-slate-900/40">
                        <span className="font-mono text-[7px] text-violet-400/85 group-hover:text-violet-400 group-hover:animate-pulse uppercase font-black tracking-wider">TAP TO ANALYZE 🔬</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedParam("overshoot")}
                      className="bg-[#0b0e17] p-4.5 rounded-2xl border border-slate-800 hover:border-violet-500 hover:bg-[#111624] text-left flex flex-col justify-between cursor-pointer transition-all duration-200 group relative overflow-hidden select-none outline-none focus:ring-2 focus:ring-violet-550 hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.2)]"
                      title="Click to view detailed Overshoot (Mp) information"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[9px] text-slate-400 group-hover:text-violet-400 uppercase font-black block leading-none transition-colors">Overshoot (Mp)</span>
                        <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors shrink-0" />
                      </div>
                      <span className={`font-mono text-sm font-black mt-3 block ${overshootPct > 20 ? "text-rose-400 animate-pulse font-black" : overshootPct > 0.1 ? "text-[#a78bfa]" : "text-emerald-400"}`}>
                        {overshootPct.toFixed(1)}%
                      </span>
                      <div className="flex items-center justify-between w-full mt-2 pt-1 border-t border-slate-900/40">
                        <span className="font-mono text-[7px] text-violet-400/85 group-hover:text-violet-400 group-hover:animate-pulse uppercase font-black tracking-wider">TAP TO ANALYZE 🔬</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedParam("steadystate")}
                      className="bg-[#0b0e17] p-4.5 rounded-2xl border border-slate-800 hover:border-violet-500 hover:bg-[#111624] text-left flex flex-col justify-between cursor-pointer transition-all duration-200 group relative overflow-hidden select-none outline-none focus:ring-2 focus:ring-violet-550 hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.2)]"
                      title="Click to view detailed Steady State Error information"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[9px] text-slate-400 group-hover:text-violet-400 uppercase font-black block leading-none transition-colors">Steady State Error</span>
                        <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors shrink-0" />
                      </div>
                      <span className={`font-mono text-sm font-black mt-3 block ${steadyStateErr > 0.05 ? "text-rose-450 text-rose-400" : "text-emerald-400"}`}>
                        {steadyStateErr.toFixed(3)}V
                      </span>
                      <div className="flex items-center justify-between w-full mt-2 pt-1 border-t border-slate-900/40">
                        <span className="font-mono text-[7px] text-violet-400/85 group-hover:text-violet-400 group-hover:animate-pulse uppercase font-black tracking-wider">TAP TO ANALYZE 🔬</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedParam("stability")}
                      className="bg-[#0b0e17] p-4.5 rounded-2xl border border-slate-800 hover:border-violet-500 hover:bg-[#111624] text-left flex flex-col justify-between cursor-pointer transition-all duration-200 group relative overflow-hidden select-none outline-none focus:ring-2 focus:ring-violet-550 hover:scale-[1.03] active:scale-[0.97] shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.2)]"
                      title="Click to view detailed System Stability State information"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-mono text-[9px] text-slate-400 group-hover:text-violet-400 uppercase font-black block leading-none transition-colors">Stability State</span>
                        <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 transition-colors shrink-0" />
                      </div>
                      <span className={`font-mono text-[10px] uppercase font-black mt-3 block ${
                        steadyStateErr > 0.3 ? "text-rose-400" :
                        overshootPct > 25 ? "text-amber-500 animate-pulse font-extrabold" :
                        "text-emerald-400"
                      }`}>
                        {steadyStateErr > 0.3 ? "UNSTABLE" : overshootPct > 25 ? "UNDER-DAMPED" : "REGULATED"}
                      </span>
                      <div className="flex items-center justify-between w-full mt-2 pt-1 border-t border-slate-900/40">
                        <span className="font-mono text-[6.5px] text-amber-500/70 group-hover:text-amber-400 group-hover:animate-pulse uppercase font-black tracking-wider">TAP TO ANALYZE 🔬</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#1e1b4b]/20 p-3.5 rounded-xl border border-purple-900/25 text-sans text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-[#a855f7] uppercase text-[9px] font-mono block mb-1">Interactive PID Stabilization Insights:</strong>
                  <span>
                    Increasing proportional gain <strong className="text-[#f43f5e]">Kp</strong> makes the feedback react aggressively to errors, reducing rise time but causing overshoot. Introducing derivative action <strong className="text-[#38bdf8]">Kd</strong> acts as a predictive stabilizer or shock absorber, countering acceleration to arrest oscillations and settle the system gracefully!
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        // ==========================================
        // INVERTED CAR-POLE PENDULUM LAB
        // ==========================================
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Calibration Controls Panel left */}
          <div className="lg:col-span-4 bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500/30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/30" />
            
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-widest block">TELEMETRY TUNER UNIT</span>
                    <h3 className="font-sans font-black text-xs text-slate-100 uppercase tracking-tight">CART-POLE PID GAINS</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZNModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[8.5px] font-mono font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 rounded transition-all cursor-pointer hover:border-amber-500/60 focus:outline-none"
                  title="Open Ziegler-Nichols tuning tutorial"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Guide</span>
                </button>
              </div>

              {/* Core control engagement - Placed right at the top for maximum prominence */}
              <div className="flex gap-2.5 mb-5 shrink-0">
                <button
                  onClick={() => {
                    const nextRunning = !isRunning;
                    setIsRunning(nextRunning);
                    if (nextRunning) {
                      // Begin the smooth dropping/swinging release animation from upright (0) to bottom (PI) before PID engages
                      setDropFrame(0);
                      setTheta(0.0);
                      setThetaDot(0.0);
                      setCartX(0.0);
                      setCartXDot(0.0);
                      setErrorSum(0.0);
                    } else {
                      // Retract back to vertical standby position
                      setTheta(0.0);
                      setThetaDot(0.0);
                      setCartX(0.0);
                      setCartXDot(0.0);
                      setDropFrame(null);
                    }
                    if (nextRunning && window.innerWidth < 1024) {
                      setTimeout(() => {
                        pendulumVisualizerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }, 100);
                    }
                  }}
                  className={`flex-1 py-3.5 px-5 font-mono text-[11px] h-[48px] font-black uppercase rounded-xl border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isRunning 
                      ? "border-red-500/40 bg-red-500/10 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)] font-extrabold" 
                      : "border-amber-500/50 bg-[#020716] text-amber-400 hover:text-white shadow-[0_0_12px_rgba(245,158,11,0.15)] font-bold"
                  }`}
                >
                  <Activity className={`w-4 h-4 ${isRunning ? "animate-spin" : ""}`} />
                  {isRunning ? "HALT CONTROL" : "ENGAGE CONTROL"}
                </button>
                
                <button
                  onClick={handleResetPendulum}
                  className="px-5 py-3.5 h-[48px] border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-mono uppercase font-black cursor-pointer select-none transition-colors flex items-center justify-center"
                  title="Reset simulation parameters"
                >
                  Reset
                </button>
              </div>
              
              <div className="mb-4 text-left">
                <label className="font-mono text-[9px] text-amber-500 font-extrabold uppercase tracking-wider block mb-1 select-none">
                  Apply Control Loop Technique
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLoopType("closed")}
                    className={`py-3.5 px-3 min-h-[44px] rounded-lg border font-mono text-[9px] font-black text-center transition-all cursor-pointer flex items-center justify-center ${
                      loopType === "closed"
                        ? "border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                        : "border-slate-800 bg-slate-950/40 text-slate-500 hover:text-slate-300"
                    }`}
                    title="Activates Closed-Loop PID controls"
                  >
                    PID BALANCING (CLOSED)
                  </button>
                  <button
                    onClick={() => {
                      setLoopType("open");
                      setErrorSum(0);
                    }}
                    className={`py-3.5 px-3 min-h-[44px] rounded-lg border font-mono text-[9px] font-black text-center transition-all cursor-pointer flex items-center justify-center ${
                      loopType === "open"
                        ? "border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                        : "border-slate-800 bg-slate-950/40 text-slate-500 hover:text-slate-350"
                    }`}
                    title="Bypasses control loops"
                  >
                    BYPASS CONTROL (OPEN)
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-left">
                {/* Proportional term */}
                <div className="pl-3.5 border-l-2 border-amber-500/35 space-y-2.5 transition-all hover:border-amber-500/60 opacity-100 disabled:opacity-50">
                  <div className="flex justify-between items-center font-mono text-[9.5px] text-slate-350 font-extrabold select-none">
                    <span>[KP] PROPORTIONAL GAIN (P-TERM)</span>
                    <span className="text-amber-400 font-extrabold bg-amber-400/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">{kp.toFixed(1)}</span>
                  </div>

                  <div className={`relative w-full flex items-center select-none ${loopType === "open" ? "opacity-40" : ""}`}>
                    <input 
                      type="range" min="0" max="200" step="0.5" value={kp} 
                      onChange={(e) => setKp(parseFloat(e.target.value))}
                      disabled={loopType === "open"}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md disabled:cursor-not-allowed"
                      style={getProgressStyle(kp, 0, 200, "#f59e0b")}
                    />
                  </div>
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block">{getPExplanation()}</span>
                </div>

                {/* Integral term */}
                <div className="pl-3.5 border-l-2 border-amber-500/35 space-y-2.5 transition-all hover:border-amber-500/60 opacity-100 disabled:opacity-50">
                  <div className="flex justify-between items-center font-mono text-[9.5px] text-slate-350 font-extrabold select-none">
                    <span>[KI] INTEGRAL GAIN (I-TERM)</span>
                    <span className="text-amber-400 font-extrabold bg-amber-400/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">{ki.toFixed(2)}</span>
                  </div>

                  <div className={`relative w-full flex items-center select-none ${loopType === "open" ? "opacity-40" : ""}`}>
                    <input 
                      type="range" min="0" max="50" step="0.1" value={ki} 
                      onChange={(e) => setKi(parseFloat(e.target.value))}
                      disabled={loopType === "open"}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md disabled:cursor-not-allowed"
                      style={getProgressStyle(ki, 0, 50, "#f59e0b")}
                    />
                  </div>
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block">{getIExplanation()}</span>
                </div>

                {/* Derivative term */}
                <div className="pl-3.5 border-l-2 border-amber-500/35 space-y-2.5 transition-all hover:border-amber-500/60 opacity-100 disabled:opacity-50">
                  <div className="flex justify-between items-center font-mono text-[9.5px] text-slate-350 font-extrabold select-none">
                    <span>[KD] DERIVATIVE GAIN (D-TERM)</span>
                    <span className="text-amber-400 font-extrabold bg-amber-400/5 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">{kd.toFixed(1)}</span>
                  </div>

                  <div className={`relative w-full flex items-center select-none ${loopType === "open" ? "opacity-40" : ""}`}>
                    <input 
                      type="range" min="0" max="50" step="0.1" value={kd} 
                      onChange={(e) => setKd(parseFloat(e.target.value))}
                      disabled={loopType === "open"}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-amber-500 [&::-moz-range-thumb]:shadow-md disabled:cursor-not-allowed"
                      style={getProgressStyle(kd, 0, 50, "#f59e0b")}
                    />
                  </div>
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block">{getDExplanation()}</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-left font-mono text-[9.5px] text-slate-400 leading-normal">
                  <span className="text-[7.5px] font-extrabold text-amber-500 uppercase block mb-1">INTERACTIVE INSTANT DISRUPTER</span>
                  <p className="text-[8px] text-slate-500 block mb-2">Inject sudden shock impulses to test controller dynamic corrections:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handlePerturb("left");
                        setLeftPulseActive(false);
                        setTimeout(() => setLeftPulseActive(true), 15);
                      }}
                      className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 text-[9px] text-amber-400 hover:text-slate-950 py-3.5 font-bold rounded-lg uppercase hover:from-amber-400 hover:to-amber-500 hover:border-amber-300 cursor-pointer overflow-hidden relative shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:scale-95 duration-100 transition-all select-none min-h-[44px] flex items-center justify-center"
                    >
                      <span className="relative z-10 font-black">&lt;&lt; Shock Left</span>
                      {leftPulseActive && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0.9 }}
                          animate={{ scale: 4.5, opacity: 0 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          onAnimationComplete={() => setLeftPulseActive(false)}
                          className="absolute w-12 h-12 bg-amber-500/30 rounded-full pointer-events-none"
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
                      className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 text-[9px] text-amber-400 hover:text-slate-950 py-3.5 font-bold rounded-lg uppercase hover:from-amber-400 hover:to-amber-500 hover:border-amber-300 cursor-pointer overflow-hidden relative shadow-[0_4px_10px_rgba(0,0,0,0.5)] active:scale-95 duration-100 transition-all select-none min-h-[44px] flex items-center justify-center"
                    >
                      <span className="relative z-10 font-black font-mono">Shock Right &gt;&gt;</span>
                      {rightPulseActive && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0.9 }}
                          animate={{ scale: 4.5, opacity: 0 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          onAnimationComplete={() => setRightPulseActive(false)}
                          className="absolute w-12 h-12 bg-amber-500/30 rounded-full pointer-events-none"
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
            <div ref={pendulumVisualizerRef} className="bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/30" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500/30" />
              
              <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                <span className="font-mono text-[8.5px] text-amber-400 font-extrabold tracking-wider uppercase block select-none">
                  CART-POLE BALANCE PLATFORM (NON-LINEAR NON-TRIVIAL DYNAMICS)
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
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />
                
                {isLossOfControl && (
                  <div className="absolute top-3 left-3 bg-red-950/50 border border-red-800 text-red-400 px-2.5 py-1 rounded font-mono text-[8px] tracking-wide uppercase select-none animate-bounce z-10">
                    OVER-DIVERGED // FEEDBACK TUNING SATURATED
                  </div>
                )}

                <svg className="w-full h-full relative font-sans" viewBox="-240 -120 480 240" preserveAspectRatio="xMidYMid meet">
                  <line x1="-190" y1="80" x2="190" y2="80" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />

                  <g transform={`translate(${cartX}, 80)`}>
                    <circle cx="-20" cy="12" r="8" fill="#020617" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="20" cy="12" r="8" fill="#020617" stroke="#475569" strokeWidth="1.5" />

                    <rect x="-35" y="-12" width="70" height="24" rx="4" fill="#0b1329" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle cx="0" cy="-6" r="3" fill={loopType === "open" ? "#ef4444" : isStabilized ? "#10b981" : "#0284c7"} className={isRunning ? "animate-pulse" : ""} />

                    <g transform={`rotate(${-thetaDegrees})`}>
                      <circle cx="0" cy="0" r="5" fill="#334155" />
                      <line x1="0" y1="0" x2="0" y2="-90" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="0" cy="-90" r="11" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" className={isStabilized ? "shadow-[0_0_15px_rgba(245,158,11,0.6)]" : "animate-pulse"} />
                      <circle cx="0" cy="-90" r="3" fill="#0f172a" />
                    </g>
                  </g>

                  <line x1={cartX} y1="20" x2={cartX} y2="80" stroke="#334155" strokeWidth="0.75" strokeDasharray="3,4" />
                </svg>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-5 font-mono text-left select-none text-[9.5px]">
                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
                  <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">ANGULAR ERROR</span>
                  <span className={`text-[12px] font-black ${getStat1Color()}`}>
                    {getStat1Value()}
                  </span>
                </div>
                
                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
                  <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">ANGUL. ACCEL</span>
                  <span className="text-[12px] font-black text-slate-350">
                    {getStat2Value()}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
                  <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">CART TRAVEL</span>
                  <span className="text-[12px] font-black text-sky-400">
                    {getStat3Value()}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl flex flex-col justify-between">
                  <span className="text-slate-500 uppercase text-[7px] font-extrabold block mb-1">SYSTEM LEVEL</span>
                  <span className={`text-[12px] font-black uppercase ${
                    isFallen ? "text-rose-500 font-extrabold animate-pulse" : isLossOfControl ? "text-amber-450" : "text-emerald-400"
                  }`}>
                    {isFallen ? "COLLAPSED" : isLossOfControl ? "DIVERGING" : "STABLE"}
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time signals chart */}
            <div className="bg-[#050C1C]/90 border border-slate-800/80 rounded-2xl p-5 md:p-6 backdrop-blur-md relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                <span className="font-mono text-[8.5px] text-amber-400 font-extrabold tracking-wider uppercase block select-none">
                  OSCILLOSCOPE SIGNAL: TIME SLICE VECTOR BUFFER
                </span>
                <div className="flex items-center gap-3 text-[8px] font-mono select-none">
                  <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-[2px] bg-slate-500" /> BASELINE TARGET (0°)</span>
                  <span className="flex items-center gap-1.5 text-amber-400 animate-pulse"><span className="w-2 h-[2px] bg-amber-400" /> DEVIATION TRAIL</span>
                </div>
              </div>

              <div className="h-44 bg-slate-950/70 border border-slate-900 rounded-xl relative p-3 overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(to_right,#0c1a30_1px,transparent_1px),linear-gradient(to_bottom,#0c1a30_1px,transparent_1px)] bg-[size:18px_18px] opacity-25 pointer-events-none" />
                
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <line 
                    x1="0" y1="100" x2="600" y2="100" 
                    stroke="#64748b" strokeWidth="1.2" strokeDasharray="3,3" strokeOpacity="0.5"
                  />

                  {(() => {
                    let pathD = "";
                    history.forEach((pt, idx) => {
                      const x = (idx / Math.max(1, history.length - 1)) * 600;
                      const scaledVal = (pt.val / 90) * 85; 
                      const y = Math.max(6, Math.min(194, 100 + scaledVal));
                      if (idx === 0) pathD += `M ${x},${y}`;
                      else pathD += ` L ${x},${y}`;
                    });
                    return <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" />;
                  })()}
                </svg>
                
                <div className="absolute bottom-2 left-3 flex justify-between w-[95%] font-mono text-[7px] text-slate-500 uppercase select-none">
                  <span>Buffer Time Segment (-1.8s)</span>
                  <span>Sync Ticking (Live Feedback)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {isZNModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsZNModalOpen(false)} />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl bg-[#040c26] border-2 border-slate-700 rounded-2xl p-3 sm:p-6 md:p-8 relative overflow-hidden shadow-2xl z-10 text-left cursor-default max-h-[96vh] sm:max-h-[90vh] flex flex-col"
          >
            {/* Ambient top slide light */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-900 mb-5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="font-mono text-[8px] font-extrabold uppercase tracking-widest block text-amber-400">PID TRAINING RESOURCE</span>
                  <h3 className="font-sans font-black text-sm md:text-base text-slate-100 uppercase tracking-tight">
                    Ziegler-Nichols Tuning Method Guide
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsZNModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-400 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto pr-2 space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
              
              {/* PID Mathematical Equation Block */}
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 sm:p-5 space-y-4">
                <span className="font-mono text-[8.5px] text-[#22d3ee] font-black uppercase tracking-widest block">
                  Foundational Control Formulation
                </span>
                <div className="flex flex-col lg:flex-row items-stretch gap-5">
                  {/* Left Column: Equation Graphic */}
                  <div className="flex-1 bg-[#01040f]/70 border border-slate-900/80 rounded-xl p-4 flex flex-col justify-center items-center text-center relative overflow-hidden select-none">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#22d3ee]/30" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#22d3ee]/30" />
                    
                    <div className="absolute top-1.5 left-1.5 font-mono text-[7px] text-slate-500 uppercase tracking-widest">
                      Continual time domain: u(t)
                    </div>
                    
                    {/* Visual Equation with colorful term groupings */}
                    <div className="my-5 flex flex-wrap items-center justify-center gap-1.5 font-mono text-xs sm:text-sm md:text-base leading-none">
                      <span className="text-slate-100 font-bold">u(t)</span>
                      <span className="text-slate-400 font-extrabold">=</span>
                      
                      {/* P Term */}
                      <span className="text-rose-400 font-black bg-rose-950/25 px-2 py-1.5 rounded border border-rose-500/10 flex items-center shrink-0" title="Proportional Term: Present Offset">
                        K<sub className="text-[8px] font-bold">p</sub>e(t)
                      </span>
                      
                      <span className="text-slate-500 font-bold">+</span>
                      
                      {/* I Term */}
                      <span className="text-amber-400 font-black bg-amber-950/25 px-2 py-1.5 rounded border border-amber-500/10 flex items-center shrink-0" title="Integral Term: Accumulated Past Offset">
                        K<sub className="text-[8px] font-bold">i</sub>
                        <span className="text-[17px] font-light leading-[0] mx-0.5" style={{ fontFamily: 'Georgia, serif' }}>∫</span>
                        <sub className="text-[7.5px] translate-y-1 -translate-x-1 font-bold">0</sub>
                        <sup className="text-[7.5px] -translate-y-1.5 -translate-x-1">t</sup>
                        e(τ)dτ
                      </span>
                      
                      <span className="text-slate-500 font-bold">+</span>
                      
                      {/* D Term */}
                      <span className="text-cyan-400 font-black bg-cyan-950/25 px-2 py-1.5 rounded border border-[#22d3ee]/10 flex items-center shrink-0" title="Derivative Term: Predicted Future Slope">
                        K<sub className="text-[8px] font-bold">d</sub>
                        <span className="flex flex-col items-center justify-center mx-1.5 leading-none">
                          <span className="border-b border-cyan-500/30 pb-0.5 text-[8px] font-black leading-none">de(t)</span>
                          <span className="text-[8px] font-black pt-0.5 leading-none font-sans">dt</span>
                        </span>
                      </span>
                    </div>

                    <div className="text-[10px] leading-relaxed text-slate-400 max-w-[350px] font-sans">
                      The PID system yields control force <strong className="text-slate-200 font-mono">u(t)</strong> continuously by tracking measured error <strong className="text-rose-455 text-rose-400 font-mono">e(t) = Setpoint (SV) - Process Value (PV)</strong>.
                    </div>
                  </div>

                  {/* Right Column: Key Term Breakdowns */}
                  <div className="w-full lg:w-[280px] flex flex-col gap-2 shrink-0 select-none">
                    {/* Proportional Panel */}
                    <div className="p-2.5 rounded-lg bg-rose-950/5 border border-rose-500/10 hover:border-rose-500/25 transition-all text-left">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="font-mono text-[8px] font-black text-rose-400 uppercase tracking-widest">[P] Proportional Term (Present)</span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-sans leading-normal">
                        Drives the system based on <strong className="text-slate-305 text-slate-300 font-medium">current error gravity</strong>. Higher gains produce raw, rapid acceleration, but excessive values trigger extreme overshoot.
                      </p>
                    </div>

                    {/* Integral Panel */}
                    <div className="p-2.5 rounded-lg bg-amber-950/5 border border-amber-500/10 hover:border-amber-500/25 transition-all text-left">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="font-mono text-[8px] font-black text-amber-500 uppercase tracking-widest">[I] Integral Term (Past)</span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-sans leading-normal">
                        Accumulates persistent discrepancies over <strong className="text-slate-305 text-slate-300 font-medium">historic time</strong>. Integrates minor drift to eliminate steady-state offset, but introduces slow oscillations.
                      </p>
                    </div>

                    {/* Derivative Panel */}
                    <div className="p-2.5 rounded-lg bg-cyan-950/5 border border-cyan-500/10 hover:border-[#22d3ee]/25 transition-all text-left">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
                        <span className="font-mono text-[8px] font-black text-[#22d3ee] uppercase tracking-widest">[D] Derivative Term (Future)</span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-sans leading-normal">
                        Acts on the <strong className="text-slate-305 text-slate-300 font-medium font-sans">predicted error speed</strong>. Cushions overshoot by resistive mechanical dampening, but amplifies feedback sensor noises.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Block Diagram Canvas */}
                <div className="bg-[#020510]/80 rounded-xl border border-slate-900/60 p-4 flex flex-col justify-center items-center text-center overflow-x-auto select-none backdrop-blur-sm">
                  <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest mb-3.5 block">
                    Telemetry Closed-Loop System Schema Diagram
                  </span>
                  
                  {/* Clean scalable block schematic */}
                  <svg viewBox="0 0 520 125" className="w-full min-w-[485px] max-w-[495px] font-mono text-[8px] text-slate-300 fill-current opacity-95 stroke-current">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                        <path d="M 0 2 L 10 5 L 0 8 z" fill="#475569" className="stroke-none" />
                      </marker>
                      <marker id="arrow-sky" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                        <path d="M 0 2 L 10 5 L 0 8 z" fill="#22d3ee" className="stroke-none" />
                      </marker>
                      <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
                        <path d="M 0 2 L 10 5 L 0 8 z" fill="#f43f5e" className="stroke-none" />
                      </marker>
                    </defs>

                    {/* Setpoint (r) marker */}
                    <text x="12" y="47" className="font-bold fill-slate-400 text-[8.5px]">Setpoint (SV)</text>
                    <text x="12" y="57" className="text-[7px] fill-slate-500">Desired State r(t)</text>
                    <line x1="82" y1="52" x2="108" y2="52" stroke="#475569" strokeWidth="1.2" markerEnd="url(#arrow)" />

                    {/* Confluence circle error generation */}
                    <circle cx="118" cy="52" r="8" className="fill-slate-950" stroke="#334155" strokeWidth="1.2" />
                    <text x="118" y="55" textAnchor="middle" className="text-[9.5px] font-black fill-slate-400">+</text>
                    <text x="113" y="67" textAnchor="middle" className="text-[9.5px] font-black fill-rose-550 fill-rose-500">-</text>

                    {/* Error e(t) arrow */}
                    <line x1="126" y1="52" x2="151" y2="52" stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#arrow-red)" />
                    <text x="138" y="45" textAnchor="middle" className="text-[7.5px] font-black fill-rose-400">Error e(t)</text>

                    {/* Path bifurcations into Kp, Ki, Kd */}
                    <path d="M 151 52 L 151 22 L 171 22" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow)" />
                    <path d="M 151 52 L 171 52" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow)" />
                    <path d="M 151 52 L 151 82 L 171 82" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow)" />

                    {/* Functional Operator Blocks */}
                    {/* Proportional Block */}
                    <rect x="171" y="12" width="76" height="20" rx="3" className="fill-rose-950/20" stroke="#f43f5e" strokeWidth="1" />
                    <text x="209" y="24" textAnchor="middle" className="fill-rose-400 font-bold text-[7.5px]">PROPORTIONAL Kp</text>

                    {/* Integral Block */}
                    <rect x="171" y="42" width="76" height="20" rx="3" className="fill-amber-950/20" stroke="#d97706" strokeWidth="1" />
                    <text x="209" y="54" textAnchor="middle" className="fill-amber-400 font-bold text-[7.5px]">INTEGRAL Ki</text>

                    {/* Derivative Block */}
                    <rect x="171" y="72" width="76" height="20" rx="3" className="fill-cyan-950/20" stroke="#0891b2" strokeWidth="1" />
                    <text x="209" y="84" textAnchor="middle" className="fill-[#22d3ee] font-bold text-[7.5px]">DERIVATIVE Kd</text>

                    {/* Merging Outputs into Command Confluence */}
                    <path d="M 247 22 L 265 22 L 265 44" fill="none" stroke="#475569" strokeWidth="1" />
                    <path d="M 247 52 L 257 52" fill="none" stroke="#475569" strokeWidth="1" markerEnd="url(#arrow)" />
                    <path d="M 247 82 L 265 82 L 265 60" fill="none" stroke="#475569" strokeWidth="1" />

                    {/* Command Confluence Circle */}
                    <circle cx="265" cy="52" r="8" className="fill-slate-950" stroke="#334155" strokeWidth="1.2" />
                    <text x="265" y="55" textAnchor="middle" className="text-[9.5px] font-bold fill-slate-300">+</text>

                    {/* Control Output u(t) line */}
                    <line x1="273" y1="52" x2="307" y2="52" stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arrow-sky)" />
                    <text x="290" y="45" textAnchor="middle" className="text-[7px] font-black fill-cyan-400">Control u(t)</text>

                    {/* Plant Block */}
                    <rect x="307" y="36" width="94" height="32" rx="4" className="fill-emerald-950/10" stroke="#10b981" strokeWidth="1.2" />
                    <text x="354" y="49" textAnchor="middle" className="fill-emerald-400 text-[8.5px] font-black font-sans">PHYSICAL PLANT</text>
                    <text x="354" y="60" textAnchor="middle" className="fill-slate-500 font-semibold text-[7px]" style={{ fontSize: "6.5px" }}>(Motors & Dynamics)</text>

                    {/* Exit State Loop */}
                    <line x1="401" y1="52" x2="475" y2="52" stroke="#10b981" strokeWidth="1.2" markerEnd="url(#arrow)" />
                    <text x="438" y="45" textAnchor="middle" className="text-[7.5px] font-black fill-emerald-400">State Vector y(t)</text>
                    <text x="480" y="47" className="font-bold fill-slate-400 text-[8.5px]">Output (PV)</text>
                    <text x="480" y="57" className="text-[7px] fill-slate-500">Actual Measurement</text>

                    {/* Returning Loop Path */}
                    <path d="M 438 52 L 438 110 L 118 110 L 118 60" fill="none" stroke="#475569" strokeWidth="1.2" markerEnd="url(#arrow)" />
                    <text x="278" y="105" textAnchor="middle" className="text-[7px] font-bold fill-slate-500 uppercase tracking-widest">Negative Feedback Path</text>
                  </svg>
                </div>
              </div>

              {/* Introduction */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4.5">
                <h4 className="font-bold text-xs text-amber-400 font-mono uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> What is the Ziegler-Nichols Method?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  The <strong>Ziegler-Nichols Method</strong> is a quick formula to find the best PID control values without endless guessing. Instead, we temporarily push the system until it oscillates in a steady, self-sustaining wave, measure two key numbers (Ultimate Gain and Ultimate Period), and use simple recipes to calculate safe, custom PID targets!
                </p>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <span className="font-mono text-[8.5px] text-indigo-400 font-extrabold uppercase tracking-wider block mb-3">
                  Step-by-Step Tuning Recipe
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl space-y-2">
                    <div className="font-mono font-black text-xs text-amber-500 bg-amber-500/10 w-6 h-6 rounded-full flex items-center justify-center">1</div>
                    <span className="font-mono text-[9.5px] font-black text-slate-200 block uppercase tracking-wide">TURN OFF Ki AND Kd</span>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Deactivate memory and braking parts first. Set both <strong>Ki = 0</strong> and <strong>Kd = 0</strong> on the active sliders. Only Kp should be running.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl space-y-2">
                    <div className="font-mono font-black text-xs text-amber-500 bg-amber-500/10 w-6 h-6 rounded-full flex items-center justify-center">2</div>
                    <span className="font-mono text-[9.5px] font-black text-slate-200 block uppercase tracking-wide">FIND WAVE GAIN (Ku)</span>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Slowly raise proportional gain <strong>Kp</strong> until the system's graph bobs up and down repeatedly in a regular, steady wave. This Kp value is your <strong>Ultimate Gain Ku</strong>.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-950/50 border border-slate-900 rounded-xl space-y-2">
                    <div className="font-mono font-black text-xs text-amber-500 bg-amber-500/10 w-6 h-6 rounded-full flex items-center justify-center">3</div>
                    <span className="font-mono text-[9.5px] font-black text-slate-200 block uppercase tracking-wide">MEASURE WAVE TIME (Pu)</span>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Measure the time in seconds between two consecutive peaks of the bouncing oscillation wave on the live graph grid. This duration is your <strong>Ultimate Period Pu</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Tuner Calculator Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5.5 border-t border-slate-900 pt-5.5">
                {/* Inputs */}
                <div className="md:col-span-12 lg:col-span-5 bg-slate-950 rounded-xl p-4.5 border border-slate-900 flex flex-col justify-between">
                  <div className="space-y-4 shadow-sm">
                    <h4 className="font-bold text-xs text-slate-200 font-mono uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-900 pb-2">
                      <Calculator className="w-4 h-4 text-emerald-400 animate-pulse" /> Interactive Calculator Inputs
                    </h4>
                    
                    {/* Ku Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center font-mono text-[10px]">
                        <span className="text-slate-400 font-bold">Ultimate Gain (Ku)</span>
                        <div className="flex items-center gap-1">
                          <span className="text-emerald-400 font-black px-2 py-0.5 border border-slate-800 rounded min-w-[32px] text-center bg-slate-950">{calcKu.toFixed(1)}</span>
                        </div>
                      </div>
                      <input 
                        type="range" min="1" max="25" step="0.2" value={calcKu} 
                        onChange={(e) => setCalcKu(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-500 [&::-moz-range-thumb]:shadow-md"
                        style={getProgressStyle(calcKu, 1, 25, "#10b981")}
                      />
                    </div>

                    {/* Pu Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center font-mono text-[10px]">
                        <span className="text-slate-400 font-bold">Ultimate Period (Pu)</span>
                        <div className="flex items-center gap-1">
                          <span className="text-emerald-400 font-black px-2 py-0.5 border border-slate-800 rounded min-w-[32px] text-center bg-slate-950">{calcPu.toFixed(1)}s</span>
                        </div>
                      </div>
                      <input 
                        type="range" min="0.5" max="5.0" step="0.1" value={calcPu} 
                        onChange={(e) => setCalcPu(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-500 [&::-moz-range-thumb]:shadow-md"
                        style={getProgressStyle(calcPu, 0.5, 5.0, "#10b981")}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-900/40 rounded-lg border border-slate-900/60 text-[9.5px] font-mono text-slate-400 space-y-1 select-none">
                    <span className="text-[7.5px] text-amber-500 uppercase font-black block leading-none">Suggested Resonances:</span>
                    <div className="flex justify-between text-[9px] border-b border-slate-900/30 pb-1 mt-1">
                      <span>Station 1 (Voltage)</span>
                      <button 
                        onClick={() => { setCalcKu(8.0); setCalcPu(2.2); }} 
                        className="text-amber-400 hover:underline font-black cursor-pointer uppercase text-[8px]"
                      >
                        Load (Ku=8.0, Pu=2.2)
                      </button>
                    </div>
                    <div className="flex justify-between text-[9px] pt-1">
                      <span>Station 2 (Pendulum)</span>
                      <button 
                        onClick={() => { setCalcKu(10.0); setCalcPu(1.5); }} 
                        className="text-amber-400 hover:underline font-black cursor-pointer uppercase text-[8px]"
                      >
                        Load (Ku=10.0, Pu=1.5)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Outputs / Applications */}
                <div className="md:col-span-12 lg:col-span-7 space-y-3">
                  <h4 className="font-bold text-xs text-slate-200 font-mono uppercase tracking-wide flex items-center gap-1.5 select-none pl-1">
                    Derived Analytical Formulations
                  </h4>

                  {/* Calculations Matrix */}
                  <div className="space-y-2.5">
                    {/* P ONLY */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-900/75 hover:border-slate-800 transition-all flex items-center justify-between gap-4">
                      <div className="font-mono text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white uppercase">Proportional (P) Only</span>
                          <span className="text-[7px] text-slate-500 font-extrabold uppercase bg-slate-900 px-1 border border-slate-950 rounded">Formulaic</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400">Kp = 0.5 × Ku | Ki = 0 | Kd = 0</p>
                        <div className="flex gap-2.5 text-[10px] font-bold text-emerald-400 mt-1">
                          <span>Kp: {calculatedGains.p.kp.toFixed(1)}</span>
                          <span>Ki: 0.00</span>
                          <span>Kd: 0.00</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleApplyGains("p");
                          setIsZNModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 font-mono text-[8.5px] font-extrabold uppercase tracking-wide rounded transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5" /> Apply
                      </button>
                    </div>

                    {/* PI CONTROLLER */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-900/75 hover:border-slate-800 transition-all flex items-center justify-between gap-4">
                      <div className="font-mono text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white uppercase">Proportional-Integral (PI)</span>
                          <span className="text-[7px] text-slate-500 font-extrabold uppercase bg-slate-900 px-1 border border-slate-950 rounded">Formulaic</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 flex flex-wrap gap-x-2">
                          <span>Kp = 0.45 × Ku</span>
                          <span>Ki = 0.54 × Ku / Pu</span>
                        </p>
                        <div className="flex gap-2.5 text-[10px] font-bold text-emerald-400 mt-1">
                          <span>Kp: {calculatedGains.pi.kp.toFixed(1)}</span>
                          <span>Ki: {calculatedGains.pi.ki.toFixed(2)}</span>
                          <span>Kd: 0.00</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleApplyGains("pi");
                          setIsZNModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 font-mono text-[8.5px] font-extrabold uppercase tracking-wide rounded transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5" /> Apply
                      </button>
                    </div>

                    {/* CLASSIC PID */}
                    <div className="p-3 bg-slate-900/40 border border-amber-500/20 rounded-xl hover:border-amber-550 transition-all flex items-center justify-between gap-4">
                      <div className="font-mono text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-amber-500 uppercase">Classic PID Controller</span>
                          <span className="text-[7px] text-amber-500/75 bg-amber-500/10 px-1.5 py-0.5 font-bold uppercase border border-amber-500/20 rounded">Recommended</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 flex flex-wrap gap-x-2 leading-none">
                          <span>Kp = 0.6 × Ku</span>
                          <span>Ki = 1.2 × Ku / Pu</span>
                          <span>Kd = 0.075 × Ku × Pu</span>
                        </p>
                        <div className="flex gap-2.5 text-[10px] font-extrabold text-amber-400 mt-1.5 animate-pulse">
                          <span>Kp: {calculatedGains.pid.kp.toFixed(1)}</span>
                          <span>Ki: {calculatedGains.pid.ki.toFixed(2)}</span>
                          <span>Kd: {calculatedGains.pid.kd.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleApplyGains("pid");
                          setIsZNModalOpen(false);
                        }}
                        className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-mono text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-150 shadow-[0_0_12px_rgba(245,158,11,0.15)] cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5 fill-current" /> Apply
                      </button>
                    </div>

                    {/* PESSEN NO OVERSHOOT PID */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-900/75 hover:border-slate-800 transition-all flex items-center justify-between gap-4">
                      <div className="font-mono text-left space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-white uppercase">No overshoot PID (Pessen Rule)</span>
                          <span className="text-[7px] text-slate-500 font-extrabold uppercase bg-slate-900 px-1 border border-slate-950 rounded">High Stability</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 leading-normal">Pessen calibration suppresses overshoot for sensitive physical operations.</p>
                        <div className="flex gap-2.5 text-[10px] font-bold text-emerald-400 mt-1">
                          <span>Kp: {calculatedGains.noOvershoot.kp.toFixed(1)}</span>
                          <span>Ki: {calculatedGains.noOvershoot.ki.toFixed(2)}</span>
                          <span>Kd: {calculatedGains.noOvershoot.kd.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleApplyGains("noOvershoot");
                          setIsZNModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-300 font-mono text-[8.5px] font-extrabold uppercase tracking-wide rounded transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5" /> Apply
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer */}
            <div className="border-t border-slate-900 mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 select-none">
              <span className="font-mono text-[8px] text-slate-500 uppercase">
                Active Simulation Station: {activeStation === "voltage" ? "01. VOLTAGE STEP RESPONSE LAB" : "02. INVERTED CART-POLE PENDULUM"}
              </span>
              <button
                onClick={() => setIsZNModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white transition-all font-mono text-[9px] uppercase tracking-wider rounded-lg font-bold cursor-pointer"
              >
                Close Interactive Guide
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedParam && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-md">
          {/* Background overlay click-off */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedParam(null)} />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#040c26] border-2 border-slate-700 rounded-2xl p-3 sm:p-6 relative overflow-hidden shadow-2xl z-10 text-left cursor-default flex flex-col max-h-[96vh] sm:max-h-[90vh]"
          >
            {/* Ambient top gold light decoration */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-550 text-amber-500">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[8.5px] font-extrabold uppercase tracking-widest block text-amber-400">Step Response Indicator</span>
                  <h3 className="font-sans font-black text-sm text-slate-100 uppercase tracking-tight">
                    {selectedParam === "risetime" && "Rise Time (Tr)"}
                    {selectedParam === "overshoot" && "Overshoot (Mp)"}
                    {selectedParam === "steadystate" && "Steady-State Error"}
                    {selectedParam === "stability" && "System Stability State"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedParam(null)}
                className="w-7 h-7 rounded-lg border border-slate-850 bg-slate-950/80 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-400 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="overflow-y-auto pr-1 space-y-4 text-xs text-slate-300 leading-relaxed font-sans flex-1 scrollbar-thin scrollbar-thumb-slate-800">
              {selectedParam === "risetime" && (
                <>
                  {/* Rise Time SVG Waveform */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 mb-2 flex flex-col items-center justify-center">
                    <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-1.5 select-none">Rise Time (Tr) Waveform Analysis</div>
                    <svg viewBox="0 0 240 110" className="w-full h-28 max-w-[280px]">
                      {/* Background Grid Lines */}
                      <line x1="20" y1="10" x2="20" y2="90" stroke="#1e293b" strokeWidth="1" />
                      <line x1="20" y1="90" x2="230" y2="90" stroke="#1e293b" strokeWidth="1.5" />
                      <line x1="20" y1="40" x2="230" y2="40" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" /> {/* Setpoint */}
                      
                      {/* Setpoint Label */}
                      <text x="225" y="34" fill="#64748b" className="font-mono text-[7px] font-bold" textAnchor="end">SETPOINT (100%)</text>
                      
                      {/* 10% and 90% guide lines */}
                      <line x1="20" y1="85" x2="230" y2="85" stroke="#10192e" strokeWidth="1" strokeDasharray="1 3" /> {/* 10% */}
                      <line x1="20" y1="45" x2="230" y2="45" stroke="#10192e" strokeWidth="1" strokeDasharray="1 3" /> {/* 90% */}
                      <text x="15" y="87" fill="#475569" className="font-mono text-[6.5px]" textAnchor="end">10%</text>
                      <text x="15" y="47" fill="#475569" className="font-mono text-[6.5px]" textAnchor="end">90%</text>

                      {/* The System Response Curve */}
                      <path 
                        d="M 20 90 Q 40 90 50 85 T 110 45 Q 130 40 150 40 L 230 40" 
                        fill="none" 
                        stroke="#475569" 
                        strokeWidth="1.5" 
                      />
                      
                      {/* Highlighted/Bold segment between 10% and 90% */}
                      <path 
                        d="M 50 85 T 110 45" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]"
                      />

                      {/* Encircle / Highlight focus area */}
                      <circle cx="80" cy="65" r="16" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
                      
                      {/* Vertical lines connecting 10% and 90% points to X-axis */}
                      <line x1="50" y1="85" x2="50" y2="90" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                      <line x1="110" y1="45" x2="110" y2="90" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />

                      {/* Tr Span indicator */}
                      <line x1="50" y1="98" x2="110" y2="98" stroke="#f59e0b" strokeWidth="1.5" />
                      <polygon points="53,95 50,98 53,101" fill="#f59e0b" />
                      <polygon points="107,95 110,98 107,101" fill="#f59e0b" />
                      <text x="80" y="106" fill="#f59e0b" className="font-mono text-[8px] font-black" textAnchor="middle">Rise Time (Tr)</text>
                      
                      {/* Axes Labels */}
                      <text x="225" y="102" fill="#475569" className="font-mono text-[6.5px]" textAnchor="end">Time (t)</text>
                      <text x="25" y="18" fill="#475569" className="font-mono text-[6.5px]">y(t)</text>
                    </svg>
                  </div>

                  <p>
                    <strong>Rise Time (Tr)</strong> is the space of time required for the actual system output to climb from <strong>10% to 90%</strong> of the target final value (the Setpoint).
                  </p>
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-slate-400 font-mono text-[10px] space-y-1">
                    <span className="text-amber-400 font-bold block uppercase text-[7.5px] tracking-widest mb-0.5">Thermodynamic & Mechanical Impact:</span>
                    <div>• <strong className="text-amber-500">Raise Kp (Proportional):</strong> Drastically speeds up the rise time, but drives up overshoots.</div>
                    <div>• <strong className="text-amber-500">Raise Ki (Integral):</strong> Moderately speeds up final rise speeds.</div>
                    <div>• <strong className="text-amber-500">Raise Kd (Derivative):</strong> Slightly dampens late-stage rise rates to ensure a smooth settle.</div>
                  </div>
                  <p className="text-slate-500 text-[10.5px] italic">
                    Pro Tip: Slavishly pursuing ultra-low rise times without any damping causes actuator wear due to sudden high-torque current spikes.
                  </p>
                </>
              )}

              {selectedParam === "overshoot" && (
                <>
                  {/* Overshoot SVG Waveform */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 mb-2 flex flex-col items-center justify-center">
                    <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-1.5 select-none">Transient Surge Peak Analysis</div>
                    <svg viewBox="0 0 240 110" className="w-full h-28 max-w-[280px]">
                      {/* Background Grid Lines */}
                      <line x1="20" y1="10" x2="20" y2="90" stroke="#1e293b" strokeWidth="1" />
                      <line x1="20" y1="90" x2="230" y2="90" stroke="#1e293b" strokeWidth="1.5" />
                      <line x1="20" y1="52" x2="230" y2="52" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" /> {/* Setpoint */}
                      
                      {/* Target line */}
                      <text x="225" y="46" fill="#64748b" className="font-mono text-[7px] font-bold" textAnchor="end">SETPOINT (y_ref)</text>

                      {/* Waveform with overshoot */}
                      <path 
                        d="M 20 90 C 40 90, 55 18, 75 20 C 95 22, 105 70, 120 70 C 135 70, 145 44, 160 45 C 175 46, 185 52, 210 52 L 230 52" 
                        fill="none" 
                        stroke="#475569" 
                        strokeWidth="1.5" 
                      />
                      
                      {/* Highlighted peak segment */}
                      <path 
                        d="M 52 52 C 59 34, 67 20, 75 20 C 83 20, 90 32, 98 52" 
                        fill="none" 
                        stroke="#f43f5e" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]"
                      />

                      {/* Encircle the overshoot peak */}
                      <circle cx="75" cy="20" r="15" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
                      
                      {/* Height indicator lines */}
                      <line x1="75" y1="20" x2="75" y2="52" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 1" />
                      <line x1="71" y1="20" x2="79" y2="20" stroke="#f59e0b" strokeWidth="1" />
                      <line x1="71" y1="52" x2="79" y2="52" stroke="#f59e0b" strokeWidth="1" />
                      
                      {/* Dimension Label */}
                      <text x="83" y="39" fill="#f59e0b" className="font-mono text-[8px] font-black">Overshoot (Mp)</text>

                      {/* Axes Labels */}
                      <text x="225" y="102" fill="#475569" className="font-mono text-[6.5px]" textAnchor="end">Time (t)</text>
                      <text x="25" y="18" fill="#475569" className="font-mono text-[6.5px]">y(t)</text>
                    </svg>
                  </div>

                  <p>
                    <strong>Overshoot (Mp)</strong> is the peak vertical displacement of the actual reaction curve that surges past the desired setpoint target, expressed relative to the target level.
                  </p>
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-slate-400 font-mono text-[10px] space-y-1">
                    <span className="text-amber-400 font-bold block uppercase text-[7.5px] tracking-widest mb-0.5">How to suppress overshoot:</span>
                    <div>• <strong className="text-amber-500">Raise Kd (Derivative):</strong> Acts as a predictive damper, applying a subtle reverse brake that scales with acceleration.</div>
                    <div>• <strong className="text-amber-500">Lower Kp:</strong> Softens the initial acceleration muscle.</div>
                    <div>• <strong className="text-amber-500">Lower Ki:</strong> Reduces integrator accumulation windup that overshoots the target.</div>
                  </div>
                  <p className="text-slate-500 text-[10.5px] italic">
                    Why it matters: In automated arms, severe overshoot causes physical collisions. In power grids, overshoot triggers emergency overvoltage breakers!
                  </p>
                </>
              )}

              {selectedParam === "steadystate" && (
                <>
                  {/* Steady-State Error SVG Waveform */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 mb-2 flex flex-col items-center justify-center">
                    <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-1.5 select-none">Steady-State Displacement Gap</div>
                    <svg viewBox="0 0 240 110" className="w-full h-28 max-w-[280px]">
                      {/* Background Grid Lines */}
                      <line x1="20" y1="10" x2="20" y2="90" stroke="#1e293b" strokeWidth="1" />
                      <line x1="20" y1="90" x2="230" y2="90" stroke="#1e293b" strokeWidth="1.5" />
                      <line x1="20" y1="35" x2="230" y2="35" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" /> {/* Setpoint */}
                      <text x="225" y="29" fill="#64748b" className="font-mono text-[7px] font-bold" textAnchor="end">SETPOINT (y_ref)</text>

                      {/* Curve settling below target (at y=62 permanently) */}
                      <path 
                        d="M 20 90 C 40 90, 70 58, 100 62 C 120 64, 150 62, 230 62" 
                        fill="none" 
                        stroke="#475569" 
                        strokeWidth="1.5" 
                      />
                      
                      {/* Highlight the steady-state curve section with gold */}
                      <path 
                        d="M 140 62 L 230 62" 
                        fill="none" 
                        stroke="#a1a1aa" 
                        strokeWidth="2" 
                        strokeDasharray="2 1"
                      />

                      {/* Encircle the gap area */}
                      <rect x="160" y="35" width="40" height="27" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" rx="4" />
                      
                      {/* Gap double-sided arrow */}
                      <line x1="180" y1="36" x2="180" y2="61" stroke="#f59e0b" strokeWidth="1.5" />
                      <polygon points="177,39 180,35 183,39" fill="#f59e0b" />
                      <polygon points="177,57 180,61 183,57" fill="#f59e0b" />
                      
                      {/* Ess Gap label */}
                      <text x="186" y="51" fill="#f59e0b" className="font-mono text-[8.5px] font-black">Error (e_ss)</text>

                      {/* Axes Labels */}
                      <text x="225" y="102" fill="#475569" className="font-mono text-[6.5px]" textAnchor="end">Time (t)</text>
                      <text x="25" y="18" fill="#475569" className="font-mono text-[6.5px]">y(t)</text>
                    </svg>
                  </div>

                  <p>
                    <strong>Steady-State Error</strong> is the persistent, constant difference between the real system value and the reference command Setpoint as time stretches into stability.
                  </p>
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-slate-400 font-mono text-[10px] space-y-1">
                    <span className="text-amber-400 font-bold block uppercase text-[7.5px] tracking-widest mb-0.5">Removing steady-state offsets:</span>
                    <div>• <strong className="text-amber-500">P-Only Control:</strong> Leaves steady-state offsets whenever opposing physical load forces (like mechanical gravity or friction) equal proportional force.</div>
                    <div>• <strong className="text-amber-500">Add Ki (Integral):</strong> Accumulates even tiny residual offsets over duration, multiplying actuator input until error drops to absolute zero!</div>
                  </div>
                  <p className="text-slate-500 text-[10.5px] italic">
                    Warning: Increasing Ki too far introduces low-frequency, sluggish oscillations termed "integrator hunting".
                  </p>
                </>
              )}

              {selectedParam === "stability" && (
                <>
                  {/* Comparative System Stability SVG Waveform */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900/60 mb-2 flex flex-col items-center justify-center">
                    <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-1.5 select-none">Comparative System Dynamics</div>
                    <svg viewBox="0 0 240 115" className="w-full h-28 max-w-[280px]">
                      {/* Background Grid Lines */}
                      <line x1="20" y1="10" x2="20" y2="95" stroke="#1e293b" strokeWidth="1" />
                      <line x1="20" y1="95" x2="230" y2="95" stroke="#1e293b" strokeWidth="1.5" />
                      <line x1="20" y1="55" x2="230" y2="55" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" /> {/* Setpoint */}

                      {/* Target reference */}
                      <text x="225" y="49" fill="#64748b" className="font-mono text-[7px] font-bold" textAnchor="end">SETPOINT</text>

                      {/* 1. REGULATED / Stable (Emerald) - Smooth decay */}
                      <path 
                        d="M 20 95 C 40 95, 55 52, 80 54 Q 100 56, 120 55 L 230 55" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="1.5"
                        className="drop-shadow-[0_0_2px_rgba(16,185,129,0.3)]"
                      />
                      <text x="140" y="65" fill="#10b981" className="font-mono text-[6px] font-bold">REGULATED</text>

                      {/* 2. UNDER-DAMPED / Decaying Waves (Amber) */}
                      <path 
                        d="M 20 95 C 35 95, 45 25, 60 27 C 75 29, 85 75, 100 75 C 115 75, 125 43, 140 45 C 155 47, 165 60, 180 58 C 195 56, 205 54, 230 55"
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="1"
                        strokeDasharray="2 1"
                      />
                      <text x="175" y="77" fill="#f59e0b" className="font-mono text-[6px] font-bold">UNDER-DAMPED</text>

                      {/* 3. UNSTABLE / Amplifying Waves (Rose) */}
                      <path 
                        d="M 20 95 C 30 95, 35 85, 45 80 C 55 75, 60 22, 70 18 C 80 14, 85 110, 95 112 C 105 114, 110 5, 120 2"
                        fill="none" 
                        stroke="#f43f5e" 
                        strokeWidth="1.5"
                        className="drop-shadow-[0_0_2px_rgba(244,63,94,0.3)]"
                      />
                      <text x="65" y="11" fill="#f43f5e" className="font-mono text-[6px] font-bold" textAnchor="middle">UNSTABLE</text>

                      {/* Axes Labels */}
                      <text x="225" y="105" fill="#475569" className="font-mono text-[6.5px]" textAnchor="end">Time (t)</text>
                      <text x="25" y="18" fill="#475569" className="font-mono text-[6.5px]">y(t)</text>
                    </svg>
                  </div>

                  <p>
                    <strong>System Stability State</strong> assesses whether the feedback closed-loop is robust, under-damped, or in danger of escalating resonance.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-900 space-y-2 font-sans">
                    <div className="flex items-start gap-1.5">
                      <span className="px-1 py-0.5 rounded text-[7.5px] font-black font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">REGULATED</span>
                      <p className="text-[10px] text-slate-400 leading-normal"><strong className="text-slate-200">Balanced PID:</strong> Highly stable damping where transient waves decay cleanly into perfect alignment with target setpoint.</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="px-1 py-0.5 rounded text-[7.5px] font-black font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">UNDER-DAMPED</span>
                      <p className="text-[10px] text-slate-400 leading-normal"><strong className="text-slate-200">Low damping:</strong> The system reaches the target fast, but rings in decaying waves. Needs more Kd braking.</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="px-1 py-0.5 rounded text-[7.5px] font-black font-mono bg-rose-500/10 text-rose-450 text-rose-400 border border-rose-500/20">UNSTABLE</span>
                      <p className="text-[10px] text-slate-400 leading-normal"><strong className="text-slate-200">Escalating resonance:</strong> Extreme gains create infinite, dangerous self-amplified oscillations that can damage actuators.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer button */}
            <div className="border-t border-slate-900 mt-5 pt-3 flex justify-end shrink-0 select-none">
              <button
                type="button"
                onClick={() => setSelectedParam(null)}
                className="px-4 py-2 border border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white transition-all font-mono text-[9px] uppercase tracking-wider rounded-lg font-bold cursor-pointer"
              >
                Acknowledge Decoder
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
