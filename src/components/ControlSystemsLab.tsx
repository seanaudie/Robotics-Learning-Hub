import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sliders, Activity, Info, Sparkles, RefreshCw } from "lucide-react";

interface ControlSystemsLabProps {
  onOpenModal: (type: "closed" | "open") => void;
}

export const ControlSystemsLab = ({ onOpenModal }: { onOpenModal: (type: "closed" | "open") => void }) => {
  const [activeStation, setActiveStation] = useState<"voltage" | "pendulum">("voltage");

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
  const [theta, setTheta] = useState(0.18); 
  const [thetaDot, setThetaDot] = useState(0.0);
  const [cartX, setCartX] = useState(0.0); 
  const [cartXDot, setCartXDot] = useState(0.0);

  const [errorSum, setErrorSum] = useState(0.0);
  const [history, setHistory] = useState<{ t: number; val: number; sp: number }[]>([]);
  const [timeStep, setTimeStep] = useState(0);

  // Reset function for Cart-pole
  const handleResetPendulum = () => {
    setErrorSum(0.0);
    setHistory([]);
    setTimeStep(0);
    setIsRunning(false);
    setTheta(0.18);
    setThetaDot(0.0);
    setCartX(0.0);
    setCartXDot(0.0);
  };

  // Pulse disturb for Cart-pole
  const handlePerturb = (direction: "left" | "right") => {
    if (!isRunning) setIsRunning(true);
    const pulseSign = direction === "left" ? -1 : 1;
    setThetaDot((prev) => prev + pulseSign * 1.8);
  };

  // Cart-pole physics loop simulation
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
      const dt = 0.03; 
      
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
  }, [isRunning, kp, ki, kd, loopType, timeStep, history.length, errorSum, theta, thetaDot, cartX, cartXDot]);

  const thetaDegrees = theta * (180 / Math.PI);
  const isStabilized = isRunning && Math.abs(thetaDegrees) < 2.5 && Math.abs(thetaDot) < 0.15;
  const isLossOfControl = Math.abs(thetaDegrees) > 60;
  const isFallen = Math.abs(thetaDegrees) > 60;

  const getPExplanation = () => "Reacts to the size of the current error. Higher strength corrects faster, but causes wild overshoot and wobbling.";
  const getIExplanation = () => "Accumulates historical errors over time to eliminate steady displacement offset, but too much memory causes slow swinging.";
  const getDExplanation = () => "Monitors error change rates to act as a prediction brake, smothering fast oscillations and dampening overshoot.";

  const getStat1Label = () => "ANGULAR DEVIATION";
  const getStat1Value = () => `${thetaDegrees.toFixed(1)}°`;
  const getStat1Color = () => {
    const val = Math.abs(thetaDegrees);
    return val <= 15 ? "text-emerald-400" : val > 37.5 ? "text-rose-400 animate-pulse font-extrabold" : "text-amber-400";
  };

  const getStat2Value = () => `${thetaDot.toFixed(2)} r/s`;
  const getStat3Value = () => `${(cartX / 10).toFixed(1)} cm`;
  const getStat4Value = () => {
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
        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onOpenModal("open")}
            className="flex-1 md:w-48 text-left bg-slate-950/65 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-2.5 rounded-lg transition-all group cursor-pointer focus:outline-none"
            title="Click to view Open-Loop characteristics"
          >
            <div className="flex items-center justify-between pointer-events-none mb-0.5">
              <span className="font-mono font-bold text-amber-500 block uppercase text-[8px] tracking-widest">Open-Loop Control System</span>
              <span className="font-mono text-[7px] text-amber-500/60 group-hover:text-amber-400 font-extrabold">DECODE 💡</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug pointer-events-none">Pure command output. Disconnects sensors; ignores error deviation.</p>
          </button>
          
          <button
            type="button"
            onClick={() => onOpenModal("closed")}
            className="flex-1 md:w-48 text-left bg-[#081229]/50 hover:bg-[#0a1633]/70 border border-[#1e2a4a]/40 hover:border-sky-500/50 p-2.5 rounded-lg transition-all group cursor-pointer focus:outline-none"
            title="Click to view Closed-Loop characteristics"
          >
            <div className="flex items-center justify-between pointer-events-none mb-0.5">
              <span className="font-mono font-bold text-sky-400 block uppercase text-[8px] tracking-widest">Closed-Loop control</span>
              <span className="font-mono text-[7px] text-sky-450 group-hover:text-sky-300 font-extrabold">DECODE 💡</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug pointer-events-none">Pipes output back to input as feedback, dynamically minimizing error.</p>
          </button>
        </div>
      </div>

      {/* 2. Station Navigation Toggle */}
      <div className="lg:col-span-12 flex justify-start pb-1">
        <div className="flex bg-[#030712] p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveStation("voltage")}
            className={`font-mono text-[9px] uppercase tracking-wider font-extrabold px-4.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeStation === "voltage"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black shadow-inner"
                : "text-slate-500 hover:text-slate-350"
            }`}
          >
            Station 01: Voltage PID Response Lab
          </button>
          <button
            onClick={() => setActiveStation("pendulum")}
            className={`font-mono text-[9px] uppercase tracking-wider font-extrabold px-4.5 py-2.5 rounded-lg transition-all cursor-pointer ${
              activeStation === "pendulum"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black shadow-inner"
                : "text-slate-500 hover:text-slate-350"
            }`}
          >
            Station 02: Inverted Cart-Pole Pendulum
          </button>
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
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
                <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 font-extrabold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-widest block">TELEMETRY TUNER UNIT</span>
                  <h3 className="font-sans font-black text-xs text-slate-100 uppercase tracking-tight">STATION 1 VOLTAGE GAINS</h3>
                </div>
              </div>

              <div className="space-y-4">
                {/* Setpoint (Reference target) */}
                <div className="pl-3.5 border-l-2 border-amber-500/20 space-y-1 transition-all hover:border-amber-500/40">
                  <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                    <span>SETPOINT TARGET (SV)</span>
                    <span className="text-amber-400 font-extrabold">{pidSetpoint.toFixed(2)} V</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={pidSetpoint}
                    onChange={(e) => setPidSetpoint(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5">The desired reference output target voltage of the physical drive node.</span>
                </div>

                <div className="h-px bg-slate-800/20 my-1" />

                {/* Proportional Gain */}
                <div className="pl-3.5 border-l-2 border-amber-500/20 space-y-1 transition-all hover:border-amber-500/40">
                  <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                    <span>[KP] PROPORTIONAL GAIN (P-TERM)</span>
                    <span className="text-amber-400 font-extrabold">{pidKp.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.2"
                    value={pidKp}
                    onChange={(e) => setPidKp(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5"><strong>P (Proportional) - The Muscle:</strong> Reacts to size of current error. Higher strength corrects faster, but causes wild overshoot and rapid swing.</span>
                </div>

                {/* Integral Gain */}
                <div className="pl-3.5 border-l-2 border-amber-500/20 space-y-1 transition-all hover:border-amber-500/40">
                   <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                    <span>[KI] INTEGRAL GAIN (I-TERM)</span>
                    <span className="text-amber-400 font-extrabold">{pidKi.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={pidKi}
                    onChange={(e) => setPidKi(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5"><strong>I (Integral) - The Memory:</strong> Accumulates historical errors over time to eliminate steady displacement offset, but too much memory causes slow swinging.</span>
                </div>

                {/* Derivative Gain */}
                <div className="pl-3.5 border-l-2 border-amber-500/20 space-y-1 transition-all hover:border-amber-500/40">
                  <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                    <span>[KD] DERIVATIVE GAIN (D-TERM)</span>
                    <span className="text-amber-400 font-extrabold">{pidKd.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.05"
                    value={pidKd}
                    onChange={(e) => setPidKd(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5"><strong>D (Derivative) - The Braking:</strong> Monitors error change rates to act as a prediction brake, smothering fast oscillations and dampening overshoot.</span>
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
              className="mt-6 w-full py-2.5 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white transition-all font-mono text-[8px] uppercase rounded-lg tracking-widest cursor-pointer font-extrabold select-none hover:scale-[1.01] active:scale-[0.99] duration-150"
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
                  <div className="grid grid-cols-4 gap-3 mt-4.5 font-sans">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col justify-between">
                      <span className="font-mono text-[7px] text-slate-500 uppercase font-black block leading-none">Rise Time (Tr)</span>
                      <span className="font-mono text-xs text-white font-bold mt-1">
                        {riseTime ? `${riseTime.toFixed(2)}s` : isPidClosedLoop ? "Fast <0.2s" : "Infinite"}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col justify-between">
                      <span className="font-mono text-[7px] text-slate-500 uppercase font-black block leading-none">Overshoot (Mp)</span>
                      <span className={`font-mono text-xs font-bold mt-1 ${overshootPct > 20 ? "text-rose-400 font-extrabold animate-pulse" : overshootPct > 0.1 ? "text-amber-400" : "text-emerald-400"}`}>
                        {overshootPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col justify-between">
                      <span className="font-mono text-[7px] text-slate-500 uppercase font-black block leading-none">Steady State Error</span>
                      <span className={`font-mono text-xs font-bold mt-1 ${steadyStateErr > 0.05 ? "text-rose-4a text-rose-400" : "text-emerald-400"}`}>
                        {steadyStateErr.toFixed(3)}V
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 flex flex-col justify-between">
                      <span className="font-mono text-[7px] text-slate-500 uppercase font-black block leading-none">System Stability State</span>
                      <span className={`font-mono text-[8.5px] uppercase font-black mt-1 ${
                        steadyStateErr > 0.3 ? "text-rose-400" :
                        overshootPct > 25 ? "text-amber-500 animate-pulse" :
                        "text-emerald-400"
                      }`}>
                        {steadyStateErr > 0.3 ? "UNSTABLE" : overshootPct > 25 ? "UNDER-DAMPED" : "REGULATED"}
                      </span>
                    </div>
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
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
                <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-widest block">TELEMETRY TUNER UNIT</span>
                  <h3 className="font-sans font-black text-xs text-slate-100 uppercase tracking-tight">CART-POLE PID GAINS</h3>
                </div>
              </div>

              {/* Core control engagement - Placed right at the top for maximum prominence */}
              <div className="flex gap-2.5 mb-5 shrink-0">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-2.5 px-4 font-mono text-[10px] font-bold uppercase rounded-lg border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLoopType("closed")}
                    className={`p-2 rounded-lg border font-mono text-[8.5px] font-black text-center transition-all cursor-pointer ${
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
                    className={`p-2 rounded-lg border font-mono text-[8.5px] font-black text-center transition-all cursor-pointer ${
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
                <div>
                  <div className="flex justify-between font-mono text-[9.5px] text-slate-400 mb-1 font-bold">
                    <span>[KP] PROPORTIONAL GAIN (P-TERM)</span>
                    <span className="text-amber-400 font-extrabold">{kp.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="15" step="0.2" value={kp} 
                    onChange={(e) => setKp(parseFloat(e.target.value))}
                    disabled={loopType === "open"}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-30"
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
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-30"
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
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-30"
                  />
                  <span className="font-sans text-[8.5px] text-slate-500 leading-tight block mt-0.5">{getDExplanation()}</span>
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
                      className="bg-slate-900 border border-slate-800 text-[8px] text-slate-300 py-1.5 font-bold rounded uppercase hover:bg-slate-800 cursor-pointer overflow-hidden relative"
                    >
                      <span className="relative z-10">&lt;&lt; Shock Left</span>
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
                      className="bg-slate-900 border border-slate-800 text-[8px] text-slate-300 py-1.5 font-bold rounded uppercase hover:bg-slate-800 cursor-pointer overflow-hidden relative"
                    >
                      <span className="relative z-10">Shock Right &gt;&gt;</span>
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

    </div>
  );
};
