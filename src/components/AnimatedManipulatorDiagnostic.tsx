import React, { useState, useEffect, useRef } from "react";

export default function AnimatedManipulatorDiagnostic() {
  const [time, setTime] = useState<number>(0);
  const [coordsPath, setCoordsPath] = useState<{ x: number; y: number }[]>([]);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Link lengths (in pixels)
  const l1 = 42;
  const l2 = 36;
  const l3 = 14; // Wrist / tool extension

  // Base and Joint 1 locations
  const x0 = 100;
  const y0 = 105;
  const x1 = 100;
  const y1 = 90; // Height offset from base cylinder

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    const handleAnimate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000; // time in seconds
      setTime(elapsed);

      requestRef.current = requestAnimationFrame(handleAnimate);
    };

    requestRef.current = requestAnimationFrame(handleAnimate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Compute dynamic target coordinate that traces a beautiful lissajous path
  // simulating a precision pick and place diagnostic trajectory
  const targetX = 100 + 44 * Math.sin(time * 0.9);
  const targetY = 52 + 14 * Math.cos(time * 1.8);

  // Analytical 2-DOF Inverse Kinematics
  const dx = targetX - x1;
  const dy = y1 - targetY; // Invert SVG y-axis to standard cartesian pointing upwards
  const rSquared = dx * dx + dy * dy;
  const r = Math.sqrt(rSquared);

  // Cosine rule solving for elbow angle (theta2) to reach targetX, targetY
  const cosTheta2 = (rSquared - l1 * l1 - l2 * l2) / (2 * l1 * l2);
  const clampedCos = Math.max(-0.99, Math.min(0.99, cosTheta2));
  const theta2Rad = Math.acos(clampedCos);

  // Shoulder angle (theta1)
  const alpha = Math.atan2(dy, dx);
  const beta = Math.atan2(l2 * Math.sin(theta2Rad), l1 + l2 * clampedCos);
  const theta1Rad = alpha - beta;

  // Joint angle readouts in degrees
  const angleShoulderDeg = (theta1Rad * 180) / Math.PI;
  const angleElbowDeg = (theta2Rad * 180) / Math.PI;

  // Compute actual physical coordinates of Joint 2 (Elbow) and Joint 3 (Wrist Input)
  const x2 = x1 + l1 * Math.cos(theta1Rad);
  const y2 = y1 - l1 * Math.sin(theta1Rad);

  const x3 = x2 + l2 * Math.cos(theta1Rad + theta2Rad);
  const y3 = y2 - l2 * Math.sin(theta1Rad + theta2Rad);

  // Extend Link 3 (wrist alignment pointer)
  const thetaSum = theta1Rad + theta2Rad;
  const xEnd = x3 + l3 * Math.cos(thetaSum);
  const yEnd = y3 - l3 * Math.sin(thetaSum);

  // Track coordinates history for tracing line
  useEffect(() => {
    // Collect paths periodically
    setCoordsPath((prev) => {
      const next = [...prev, { x: xEnd, y: yEnd }];
      if (next.length > 22) {
        next.shift();
      }
      return next;
    });
  }, [xEnd, yEnd]);

  // Jacobian determinant to represent cinematic leverage or speed reachability
  // J = l1 * l2 * sin(theta2)
  const jacobian = Math.abs(l1 * l2 * Math.sin(theta2Rad));
  const normalizedJacobian = (jacobian / (l1 * l2)).toFixed(3);

  // Gripper claws state (oscillates between open and closed state)
  const gripperCycle = Math.sin(time * 3);
  const isGripperClosing = gripperCycle < 0;
  const gripperWidth = isGripperClosing ? 1 : 4.5; // open/closed gap in pixels

  return (
    <div className="w-full h-full flex flex-col justify-between p-1 relative bg-transparent border-none select-none overflow-hidden">
      
      {/* Dynamic diagnostic banner tracking mechatronic state machines */}
      <div className="flex items-center justify-between border-b border-sky-950/20 pb-1 shrink-0">
        <span className="font-mono text-[7px] text-sky-450 text-sky-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping inline-block" style={{ width: '4px', height: '4px' }} />
          KINEMATIC SOLVER FEEDBACK // ACTIVE
        </span>
        <span className="font-mono text-[6px] text-slate-500 font-bold uppercase p-0.5 px-1 bg-sky-950/15 rounded border border-sky-900/20">
          SYS_MANP_KIN_05
        </span>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-2 py-1 items-center overflow-hidden">
        
        {/* LEFT PORTION: Aerospace Polar Coordinate Simulation Viewport */}
        <div className="col-span-8 flex justify-center items-center relative rounded-lg border border-slate-900/30 bg-[#02050f]/40 overflow-hidden h-[105px] w-full">
          
          {/* Subtle cyber background grid overlays */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#3bf_1px,transparent_1px),linear-gradient(to_bottom,#3bf_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <svg className="w-full h-full max-h-[100px] overflow-visible" viewBox="0 0 200 120" id="diagnostic-manipulator-svg">
            <defs>
              {/* Polar style radial grid and mechatronic glowing bars */}
              <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
                <stop offset="85%" stopColor="#0891b2" stopOpacity="0.0" />
              </radialGradient>

              <linearGradient id="linkCyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="40%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <linearGradient id="linkAmberGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* Polar Concentric Guide Arcs to represent limits of working space */}
            <circle cx={x1} cy={y1} r={l1 + l2} fill="transparent" stroke="#0891b2" strokeWidth="0.5" strokeDasharray="3,4" className="opacity-15" />
            <circle cx={x1} cy={y1} r={l1} fill="transparent" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,5" className="opacity-15" />
            <circle cx={x1} cy={y1} r={Math.abs(l1 - l2)} fill="transparent" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,3" className="opacity-5" />

            {/* Coordinate Vector Crosshair Lines */}
            <line x1="20" y1={y1} x2="180" y2={y1} stroke="#1e293b" strokeWidth="0.6" strokeDasharray="1,2" />
            <line x1={x1} y1="20" x2={x1} y2="114" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="1,2" />

            {/* Trailing path drawn behind the end-effector movement */}
            {coordsPath.length > 1 && (
              <polyline
                points={coordsPath.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1.2"
                strokeOpacity="0.75"
                strokeDasharray="100"
                className="opacity-70"
              />
            )}

            {/* TARGET SECTOR CROSSHAIR (The math task we target in real-time) */}
            <g transform={`translate(${targetX}, ${targetY})`}>
              {/* Outer pulse locator */}
              <circle cx="0" cy="0" r="4.5" fill="none" stroke="#22d3ee" strokeWidth="0.75" className="animate-ping" style={{ animationDuration: '2.5s' }} />
              {/* Target lock design */}
              <circle cx="0" cy="0" r="2.5" fill="none" stroke="#22d3ee" strokeWidth="1" className="opacity-70" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#22d3ee" strokeWidth="0.6" className="opacity-50" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#22d3ee" strokeWidth="0.6" className="opacity-50" />
            </g>

            {/* MECHANICAL STRUCTURE ASSEMBLY */}
            {/* LINK 0 (Base Column) - Sturdy mechatronic bracket holding pivot */}
            <path d={`M ${x0 - 15} ${y0} L ${x0 + 15} ${y0} L ${x1 + 6} ${y1} L ${x1 - 6} ${y1} Z`} fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
            <line x1={x1} y1={y0} x2={x1} y2={y1} stroke="#64748b" strokeWidth="3" strokeLinecap="butt" className="opacity-80" />

            {/* LINK 1 (Upper Arm) - Indigo & Blue mechatronic joint bridge */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#030712" strokeWidth="6.5" strokeLinecap="round" />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#linkCyanGlow)" strokeWidth="3.5" strokeLinecap="round" />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" className="opacity-60" />

            {/* LINK 2 (Forearm) - Cyber Glow Link Pin */}
            <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="#0f172a" strokeWidth="4.8" strokeLinecap="round" />
            <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="url(#linkAmberGlow)" strokeWidth="2.4" strokeLinecap="round" />
            <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" className="opacity-50" />

            {/* LINK 3 (Wrist Pointer Tool) - Precision extender connecting gripper */}
            <line x1={x3} y1={y3} x2={xEnd} y2={yEnd} stroke="#475569" strokeWidth="1.6" strokeLinecap="butt" />

            {/* Joint Pivots as subtle high-tech nodes */}
            {/* Joint 2 (Shoulder Joint Core) */}
            <circle cx={x1} cy={y1} r="5" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
            <circle cx={x1} cy={y1} r="1.5" fill="#22d3ee" />

            {/* Joint 3 (Elbow Joint Core) */}
            <circle cx={x2} cy={y2} r="4" fill="#0f172a" stroke="#d97706" strokeWidth="1" />
            <circle cx={x2} cy={y2} r="1.2" fill="#fbbf24" />

            {/* Joint 4 (Wrist Joint Core) */}
            <circle cx={x3} cy={y3} r="2.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="0.8" />

            {/* END EFFECTOR GRIPPER CLAWS (Dynamically animated to pivot claws) */}
            <g transform={`translate(${xEnd}, ${yEnd}) rotate(${(thetaSum * 180) / Math.PI - 90})`}>
              {/* Hand Hub */}
              <rect x="-3" y="-1.5" width="6" height="3" fill="#1e293b" stroke="#e2e8f0" strokeWidth="0.5" rx="0.5" />
              
              {/* Left Claw Prong */}
              <path
                d={`M -2.5,0 C -3.5,-3 -${gripperWidth},-6 -1,-8`}
                fill="none"
                stroke={isGripperClosing ? "#ef4444" : "#22d3ee"}
                strokeWidth="1.2"
                strokeLinecap="round"
                className="transition-all duration-150"
              />
              {/* Right Claw Prong */}
              <path
                d={`M 2.5,0 C 3.5,-3 ${gripperWidth},-6 1,-8`}
                fill="none"
                stroke={isGripperClosing ? "#ef4444" : "#22d3ee"}
                strokeWidth="1.2"
                strokeLinecap="round"
                className="transition-all duration-150"
              />
              
              {/* Tiny Center laser dot */}
              <circle cx="0" cy="-2" r="0.6" fill="#f43f5e" className="animate-pulse" />
            </g>

          </svg>
        </div>

        {/* RIGHT PORTION: Digital Telemetry Diagnostics Array */}
        <div className="col-span-4 flex flex-col justify-between h-[105px] bg-[#02050f]/30 px-1.5 py-1 rounded-lg border border-slate-900/50 font-mono text-[6.5px] text-slate-400 gap-0.5 overflow-hidden">
          
          <div className="border-b border-slate-900 pb-1">
            <span className="text-[6.5px] text-sky-400 font-bold block">JOINT POSITION DEGREES</span>
          </div>
          
          <div className="flex flex-col gap-1 flex-1 py-1">
            <div className="flex items-center justify-between">
              <span className="text-[6.5px] text-slate-500">θ1 (SHOULDER)</span>
              <span className="text-white font-semibold tabular-nums">{angleShoulderDeg.toFixed(1)}°</span>
            </div>
            {/* Mini progress bar */}
            <div className="w-full bg-slate-900 h-1 rounded overflow-hidden relative">
              <div
                className="bg-sky-500 h-full transition-all duration-75"
                style={{ width: `${((angleShoulderDeg + 90) / 180) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[6.5px] text-slate-500">θ2 (ELBOW)</span>
              <span className="text-amber-400 font-semibold tabular-nums">{angleElbowDeg.toFixed(1)}°</span>
            </div>
            {/* Mini progress bar */}
            <div className="w-full bg-slate-900 h-1 rounded overflow-hidden relative">
              <div
                className="bg-amber-500 h-full transition-all duration-75"
                style={{ width: `${(angleElbowDeg / 180) * 100}%` }}
              />
            </div>
          </div>

          <div className="border-t border-slate-900/60 pt-1 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[6px] text-slate-500">JACOBIAN DETERMINANT</span>
              <span className="text-emerald-400 font-bold tabular-nums">{normalizedJacobian}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[6px] text-slate-500">GRIPPER PHASE</span>
              <span className={`font-black uppercase tracking-tight text-[6.5px] ${isGripperClosing ? 'text-rose-400' : 'text-sky-400'}`}>
                {isGripperClosing ? "CLAMPING // CAP" : "OPEN // ALIGN"}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Cyber status footer readout */}
      <div className="flex items-center justify-between text-[6.5px] font-mono text-slate-500 pt-1 border-t border-slate-900/60 select-none uppercase shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse inline-block" style={{ width: '4px', height: '4px' }} />
          SOLVER_CALCULATIONS_STABLE
        </span>
        <span className="text-sky-400 font-bold">100% OK</span>
      </div>

    </div>
  );
}
