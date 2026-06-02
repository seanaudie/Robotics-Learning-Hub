import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Play, Pause, Zap, Check } from 'lucide-react';

export const segmentLogicTerms: Record<
  "a" | "b" | "c" | "d" | "e" | "f" | "g",
  { label: string; wires: string[] }[]
> = {
  a: [
    { label: "I3", wires: ["I3"] },
    { label: "I1", wires: ["I1"] },
    { label: "I2 ∧ I0", wires: ["I2", "I0"] },
    { label: "I2' ∧ I0'", wires: ["!I2", "!I0"] }
  ],
  b: [
    { label: "I2'", wires: ["!I2"] },
    { label: "I1' ∧ I0'", wires: ["!I1", "!I0"] },
    { label: "I1 ∧ I0", wires: ["I1", "I0"] }
  ],
  c: [
    { label: "I2", wires: ["I2"] },
    { label: "I1'", wires: ["!I1"] },
    { label: "I0", wires: ["I0"] }
  ],
  d: [
    { label: "I3", wires: ["I3"] },
    { label: "I2' ∧ I0'", wires: ["!I2", "!I0"] },
    { label: "I1 ∧ I0'", wires: ["I1", "!I0"] },
    { label: "I2' ∧ I1", wires: ["!I2", "I1"] },
    { label: "I2 ∧ I1' ∧ I0", wires: ["I2", "!I1", "I0"] }
  ],
  e: [
    { label: "I2' ∧ I0'", wires: ["!I2", "!I0"] },
    { label: "I1 ∧ I0'", wires: ["I1", "!I0"] }
  ],
  f: [
    { label: "I3", wires: ["I3"] },
    { label: "I1' ∧ I0'", wires: ["!I1", "!I0"] },
    { label: "I2 ∧ I1'", wires: ["I2", "!I1"] },
    { label: "I2 ∧ I0'", wires: ["I2", "!I0"] }
  ],
  g: [
    { label: "I3", wires: ["I3"] },
    { label: "I2 ∧ I1'", wires: ["I2", "!I1"] },
    { label: "I2' ∧ I1", wires: ["!I2", "I1"] },
    { label: "I1 ∧ I0'", wires: ["I1", "!I0"] }
  ]
};

export const isWireActive = (wire: string, bits: boolean[]) => {
  if (wire === "I3") return bits[0];
  if (wire === "!I3") return !bits[0];
  if (wire === "I2") return bits[1];
  if (wire === "!I2") return !bits[1];
  if (wire === "I1") return bits[2];
  if (wire === "!I1") return !bits[2];
  if (wire === "I0" || wire === "I5") return bits[3];
  if (wire === "!I0" || wire === "!I5") return !bits[3];
  return false;
};

// Check standard combinational logic for segment activation
export const getSegmentActiveFromBits = (seg: "a" | "b" | "c" | "d" | "e" | "f" | "g", bits: boolean[]) => {
  const val = bits.reduce((acc, curr, idx) => acc + (curr ? Math.pow(2, 3 - idx) : 0), 0);
  switch (val) {
    case 0:  return seg !== "g";
    case 1:  return seg === "b" || seg === "c";
    case 2:  return seg === "a" || seg === "b" || seg === "d" || seg === "e" || seg === "g";
    case 3:  return seg === "a" || seg === "b" || seg === "c" || seg === "d" || seg === "g";
    case 4:  return seg === "b" || seg === "c" || seg === "f" || seg === "g";
    case 5:  return seg === "a" || seg === "c" || seg === "d" || seg === "f" || seg === "g";
    case 6:  return seg === "a" || seg === "c" || seg === "d" || seg === "e" || seg === "f" || seg === "g";
    case 7:  return seg === "a" || seg === "b" || seg === "c";
    case 8:  return true;
    case 9:  return seg !== "e";
    case 10: return seg !== "d"; // A (a,b,c,e,f,g)
    case 11: return seg !== "a" && seg !== "b"; // b (c,d,e,f,g)
    case 12: return seg === "a" || seg === "d" || seg === "e" || seg === "f"; // C (a,d,e,f)
    case 13: return seg !== "a" && seg !== "f"; // d (b,c,d,e,g)
    case 14: return seg !== "b" && seg !== "c"; // E (a,d,e,f,g)
    case 15: return seg === "a" || seg === "e" || seg === "f" || seg === "g"; // F (a,e,f,g)
    default: return false;
  }
};

interface SevenSegInteractiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  sevenSegModalTab: "logic" | "ic";
  setSevenSegModalTab: (tab: "logic" | "ic") => void;
  sevenSegSelectedSegment: "a" | "b" | "c" | "d" | "e" | "f" | "g" | null;
  setSevenSegSelectedSegment: (seg: "a" | "b" | "c" | "d" | "e" | "f" | "g" | null) => void;
  sevenSegAutoCount: boolean;
  setSevenSegAutoCount: (val: boolean) => void;
  binaryBits: boolean[];
  setBinaryBits: React.Dispatch<React.SetStateAction<boolean[]>> | ((bits: boolean[]) => void);
  // Keep shift register parameters in signature (as any/optional) to prevent breaking imports
  shiftRegisterBits?: boolean[];
  setShiftRegisterBits?: (bits: boolean[]) => void;
  shiftRegisterOutputBits?: boolean[];
  setShiftRegisterOutputBits?: (bits: boolean[]) => void;
  shiftRegisterSerPin?: boolean;
  setShiftRegisterSerPin?: (val: boolean) => void;
  shiftRegAnimStep?: number;
  setShiftRegAnimStep?: (val: number) => void;
  pushShiftClock?: (serVal: boolean) => void;
  pushLatchClock?: () => void;
  startAutoShift?: () => void;
}

export const SevenSegInteractiveModal: React.FC<SevenSegInteractiveModalProps> = ({
  isOpen,
  onClose,
  sevenSegAutoCount,
  setSevenSegAutoCount,
  binaryBits,
  setBinaryBits,
  sevenSegSelectedSegment,
  setSevenSegSelectedSegment
}) => {

  const decimalValue = binaryBits.reduce((acc, currentVal, bIdx) => acc + (currentVal ? Math.pow(2, 3 - bIdx) : 0), 0);
  const hexDigit = decimalValue.toString(16).toUpperCase();

  const renderSegmentCircuit = (seg: "a" | "b" | "c" | "d" | "e" | "f" | "g", bits: boolean[]) => {
    const terms = segmentLogicTerms[seg];
    const N = terms.length;
    
    // Calculate dynamic coordinates
    const width = 360;
    const itemHeight = 28;
    const paddingY = 10;
    const height = N * itemHeight + paddingY * 2;
    const yOr = height / 2;

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="select-none font-mono">
        {/* 4 Vertical Input Lines (I3, I2, I1, I0) */}
        {Array.from({ length: 4 }).map((_, j) => {
          const xRaw = 15 + j * 16;
          const bValue = bits[j];
          return (
            <g key={j}>
              {/* Draw the input bus line */}
              <line
                x1={xRaw}
                y1={2}
                x2={xRaw}
                y2={height - 2}
                stroke={bValue ? "#22d3ee" : "#1a253c"}
                strokeWidth={bValue ? "2.0" : "0.9"}
                className="transition-colors duration-200"
              />
            </g>
          );
        })}

        {/* Logic pathway gating */}
        {terms.map((term, k) => {
          const yVal = paddingY + k * itemHeight + 14;
          const isTermActive = term.wires.every((wire) => isWireActive(wire, bits));

          return (
            <g key={k}>
              {/* Connect active nodes from bus to AND inputs */}
              {term.wires.map((wire, wIdx) => {
                let xPin = 15;
                let isWireHigh = false;
                if (wire === "I3") { xPin = 15; isWireHigh = bits[0]; }
                else if (wire === "!I3") { xPin = 15; isWireHigh = !bits[0]; }
                else if (wire === "I2") { xPin = 31; isWireHigh = bits[1]; }
                else if (wire === "!I2") { xPin = 31; isWireHigh = !bits[1]; }
                else if (wire === "I1") { xPin = 47; isWireHigh = bits[2]; }
                else if (wire === "!I1") { xPin = 47; isWireHigh = !bits[2]; }
                else if (wire === "I0" || wire === "I5") { xPin = 63; isWireHigh = bits[3]; }
                else if (wire === "!I0" || wire === "!I5") { xPin = 63; isWireHigh = !bits[3]; }

                const isNegated = wire.startsWith("!");
                
                // Centered split offsets for neat parallelism
                const wCount = term.wires.length;
                const offset = wCount > 1 ? (wIdx - (wCount - 1) / 2) * 8 : 0;
                const yConnect = yVal + offset;
                const xEdge = isNegated ? 104 : 110;

                return (
                  <g key={wIdx}>
                    {/* Horizontal pathway trace */}
                    <line
                      x1={xPin}
                      y1={yConnect}
                      x2={xEdge}
                      y2={yConnect}
                      stroke={isWireHigh ? "#34d399" : "#1e293b"}
                      strokeWidth={isWireHigh ? "2.0" : "1.0"}
                      className="transition-all duration-200"
                    />
                    {isNegated && (
                      <circle
                        cx="107"
                        cy={yConnect}
                        r="3"
                        fill="#0c152a"
                        stroke={isWireHigh ? "#34d399" : "#475569"}
                        strokeWidth={isWireHigh ? "1.8" : "1.0"}
                      />
                    )}
                    {/* Connection Node */}
                    <circle
                      cx={xPin}
                      cy={yConnect}
                      r="2.5"
                      fill={isWireHigh ? "#34d399" : "#475569"}
                    />
                  </g>
                );
              })}

              {/* AND Gate Block */}
              <path
                d={`M 110,${yVal - 8} L 122,${yVal - 8} A 8,8 0 0,1 130,${yVal} A 8,8 0 0,1 122,${yVal + 8} L 110,${yVal + 8} Z`}
                fill={isTermActive ? "rgba(52, 211, 153, 0.16)" : "#0c152a"}
                stroke={isTermActive ? "#34d399" : "#334155"}
                strokeWidth="1.5"
                className="transition-all duration-200"
              />
              <text x="112" y={yVal + 2.5} className="text-[7.5px] font-sans fill-slate-350 font-black select-none">AND</text>

              {/* Path from AND Gate output to OR Gate input */}
              {(() => {
                const yOrInput = N === 1 ? yOr : yOr - 12 + (k * 24) / (N - 1);
                return (
                  <path
                    d={`M 130,${yVal} L 170,${yVal} L 170,${yOrInput} L 210,${yOrInput}`}
                    stroke={isTermActive ? "#34d399" : "#1e293b"}
                    strokeWidth={isTermActive ? "2.0" : "1.0"}
                    fill="none"
                    className="transition-all duration-200"
                  />
                );
              })()}
            </g>
          );
        })}

        {/* Summation OR Gate */}
        {(() => {
          const isSomeActive = getSegmentActiveFromBits(seg, bits);
          return (
            <g>
              <path
                d={`M 210,${yOr - 14} C 217,${yOr - 14} 226,${yOr - 7} 238,${yOr} C 226,${yOr + 7} 217,${yOr + 14} 210,${yOr + 14} C 215,${yOr + 7} 215,${yOr - 7} 210,${yOr - 14} Z`}
                fill={isSomeActive ? "rgba(34, 211, 238, 0.16)" : "#0c152a"}
                stroke={isSomeActive ? "#22d3ee" : "#334155"}
                strokeWidth="1.5"
                className="transition-all duration-200"
              />
              <text x="213" y={yOr + 2.5} className="text-[7.5px] font-sans fill-slate-350 font-black select-none">OR</text>

              {/* Output Segment line */}
              <line
                x1={238}
                y1={yOr}
                x2={286}
                y2={yOr}
                stroke={isSomeActive ? "#22d3ee" : "#1e293b"}
                strokeWidth={isSomeActive ? "2.2" : "1.0"}
                className="transition-all duration-200"
              />

              {/* Glowing Bulb */}
              <circle
                cx="298"
                cy={yOr}
                r="11"
                fill={isSomeActive ? "rgba(34, 211, 238, 0.22)" : "#0c152a"}
                stroke={isSomeActive ? "#22d3ee" : "#334155"}
                strokeWidth="1.8"
                className={`transition-all duration-200 ${isSomeActive ? "drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]" : ""}`}
              />
              <text x="298" y={yOr + 3.5} textAnchor="middle" className="text-[11px] font-mono font-black fill-white uppercase select-none transition-colors duration-200">
                {seg}
              </text>
            </g>
          );
        })()}
      </svg>
    );
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-sm overflow-hidden" id="seven-segment-interactive-modal">
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-6xl rounded-2xl border-2 border-slate-700 bg-[#070b1e] p-3 sm:p-5 md:p-6 shadow-2xl space-y-3 sm:space-y-5 text-left z-10 my-2 overflow-hidden max-h-[96vh] sm:max-h-[92vh] flex flex-col"
          >
            {/* Glowing Ambient Background Circles */}
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-indigo-505/5 blur-3xl pointer-events-none" />

            {/* Title Bar */}
            <div className="relative flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                    7-Segment Display Combinational Decoder Logic
                  </h3>
                  <p className="font-sans text-[11px] text-slate-400">
                    Real-time BCD lookup decoding circuit illustrating all active logic pathways in unison (A-G)
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 px-3 text-xs font-mono border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-400 transition-colors cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>

            {/* Split Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto">
              
              {/* LEFT COLUMN: SHARED INPUTS & DISPLAY */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                
                {/* 1. BINARY CHANGER FIELD */}
                <div className="bg-[#050816]/90 p-4 rounded-xl border border-slate-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase text-cyan-400 tracking-wider font-bold">
                      BINARY INPUT SELECTOR (4-bit)
                    </span>
                    <div className="text-[10px] font-mono font-bold bg-[#080d1f] px-2 py-0.5 rounded border border-slate-900 text-cyan-400">
                      Dec: {decimalValue} (0x{hexDigit})
                    </div>
                  </div>

                  {/* Clean Visual Bits Toggles */}
                  <div className="grid grid-cols-4 gap-2">
                    {binaryBits.map((bVal, bIdx) => {
                      const bitName = `I${3 - bIdx}`;
                      const weightStr = `x${Math.pow(2, 3 - bIdx)}`;
                      return (
                        <button
                          key={bIdx}
                          onClick={() => {
                            const updated = [...binaryBits];
                            updated[bIdx] = !updated[bIdx];
                            if (typeof setBinaryBits === "function") {
                              setBinaryBits(updated);
                            }
                          }}
                          className={`py-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer select-none ${
                            bVal
                              ? "bg-cyan-550/15 border-cyan-500 text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.2)]"
                              : "bg-slate-950/60 border-slate-900 text-slate-500 hover:border-slate-800"
                          }`}
                        >
                          <span className="font-mono text-[8px] opacity-75 font-bold">{bitName}</span>
                          <span className="font-mono text-base font-black my-0.5 leading-none">{bVal ? "1" : "0"}</span>
                          <span className="font-mono text-[7px] opacity-45">{weightStr}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Auto-Count loop control */}
                  <div className="pt-1">
                    <button
                      onClick={() => setSevenSegAutoCount(!sevenSegAutoCount)}
                      className={`w-full py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        sevenSegAutoCount
                          ? "bg-amber-500/15 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                          : "bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900"
                      }`}
                    >
                      {sevenSegAutoCount ? (
                        <>
                          <Pause className="w-3 h-3" />
                          Pause Auto-Count (0-F)
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 animate-pulse text-amber-400" />
                          Auto-Count Up (0-F)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. GLOWING 7-SEGMENT HARDWARE DISPLAY */}
                <div className="bg-[#050816]/90 p-4 rounded-xl border border-slate-900 flex-1 flex flex-col justify-center items-center">
                  <div className="text-center mb-3">
                    <span className="font-mono text-[9px] uppercase text-cyan-400 font-bold tracking-wider">
                      7-Segment Real-Time Display
                    </span>
                  </div>

                  <div className="p-7 bg-slate-950/80 rounded-xl border border-slate-900 relative shadow-inner inline-block">
                    {/* Visualizer SVG */}
                    <svg width="130" height="190" viewBox="0 0 34 54" className="inline-block relative overflow-visible">
                      {(() => {
                        const segments = {
                          a: { d: "M 6,4 L 28,4 L 25,7 L 9,7 Z", idx: 0 },
                          f: { d: "M 4,6 L 7,9 L 7,24 L 4,26 Z", idx: 5 },
                          b: { d: "M 30,6 L 30,26 L 27,24 L 27,9 Z", idx: 1 },
                          g: { d: "M 6,27 L 9,25 L 25,25 L 28,27 L 25,29 L 9,29 Z", idx: 6 },
                          e: { d: "M 4,28 L 7,30 L 7,45 L 4,48 Z", idx: 4 },
                          c: { d: "M 30,28 L 30,48 L 27,45 L 27,30 Z", idx: 2 },
                          d: { d: "M 6,50 L 9,47 L 25,47 L 28,50 Z", idx: 3 }
                        };

                        return (Object.keys(segments) as Array<keyof typeof segments>).map((seg) => {
                          const isActive = getSegmentActiveFromBits(seg, binaryBits);
                          const isSelected = sevenSegSelectedSegment === seg;

                          return (
                            <path
                              key={seg}
                              d={segments[seg].d}
                              onClick={() => setSevenSegSelectedSegment(seg)}
                              className={`transition-all duration-200 cursor-pointer ${
                                isActive
                                  ? "fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.95)] text-cyan-400"
                                  : "fill-[#131a31] hover:fill-slate-800"
                              } ${isSelected ? "stroke-cyan-300 stroke-[1.2]" : "stroke-[#090d1e] stroke-[0.5]"}`}
                            />
                          );
                        });
                      })()}
                    </svg>

                    {/* Centered decimal indicator inside 7seg board */}
                    <div className="absolute top-2 right-2 font-mono text-[11px] bg-[#0c122b] border border-slate-900 border-dashed rounded px-1.5 py-0.5 text-slate-400 font-extrabold select-none">
                      {hexDigit}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center mt-3 leading-snug">
                    Toggle inputs above or trigger Auto-Count to observe combinational gate evaluation to Segment LEDs in real-time.
                  </p>
                </div>
              </div>

              {/* RIGHT CONTENT DISPLAY: ALL 7 SEGMENT CIRCUIT BLUEPRINTS */}
              <div className="lg:col-span-8 flex flex-col min-h-0 bg-[#050816]/70 rounded-xl border border-slate-900 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center border-b border-[#0c122a] pb-2 text-xs">
                  <div>
                    <span className="font-mono text-cyan-45y text-cyan-400 font-extrabold uppercase text-[9.5px] tracking-wider">
                      DEC-TO-7SEG INTEGRATED DECODER DECK
                    </span>
                    <h4 className="font-sans font-black text-xs text-slate-200 tracking-tight mt-0.5">
                      BOOLEAN COMBINATIONAL HIGHWAY FOR ALL CHANNELS (A-G)
                    </h4>
                  </div>
                  <div className="font-mono text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-bold uppercase shrink-0">
                    7447 DECODER EMULATION
                  </div>
                </div>

                {/* Staked List of 7 Segment Decoder Circuits */}
                <div className="space-y-4 pr-1">
                  {(["a", "b", "c", "d", "e", "f", "g"] as const).map((seg) => {
                    const isActive = getSegmentActiveFromBits(seg, binaryBits);
                    const terms = segmentLogicTerms[seg];

                    return (
                      <div 
                        key={seg} 
                        className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col space-y-2.5 ${
                          isActive 
                            ? "bg-[#0b132e]/55 border-cyan-500/25 shadow-[0_0_15px_rgba(34,211,238,0.04)]" 
                            : "bg-[#030611] border-slate-905 border-slate-900/80"
                        }`}
                      >
                        {/* Row Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#131b38] pb-2 leading-none">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-md font-sans text-[11px] font-black border flex items-center justify-center select-none uppercase ${
                              isActive
                                ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse"
                                : "bg-slate-950 border-slate-850 border-slate-900 text-slate-500"
                            }`}>
                              {seg}
                            </span>
                            <div className="flex flex-wrap items-center gap-1 bg-slate-950/80 px-2 py-1 rounded border border-slate-900 text-[10px] font-mono leading-none shadow-inner">
                              <span className="text-slate-500 font-bold">Eq:</span>
                              {terms.map((term, tIdx) => {
                                const isTermActive = term.wires.every((wire) => isWireActive(wire, binaryBits));
                                return (
                                  <React.Fragment key={tIdx}>
                                    {tIdx > 0 && <span className="text-slate-650 text-slate-600 font-bold font-mono mx-0.5">+</span>}
                                    <span className={`px-1 rounded text-[9.5px] font-bold ${
                                      isTermActive 
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10" 
                                        : "text-slate-500"
                                    }`}>
                                      {term.label}
                                    </span>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>

                          {/* Output status indicator badge */}
                          <div className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase text-center border mr-1 self-start sm:self-center ${
                            isActive
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450 text-emerald-400 animate-pulse"
                              : "bg-slate-950 border-slate-900 text-slate-500"
                          }`}>
                            {isActive ? "1 HIGH (GLOW)" : "0 LOW (OFF)"}
                          </div>
                        </div>

                        {/* Interactive Circuit Drawing Row */}
                        <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-900/60 overflow-x-auto">
                          <div className="min-w-[340px]">
                            {renderSegmentCircuit(seg, binaryBits)}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* Modal footer */}
            <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1 select-none">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Simplified Mechatronic Logic Analyzer
              </span>
              <span>
                Micro-Logic Engine v1.3
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
