import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Linkedin, Github, Mail, X, Cpu, Award, Zap, Compass, Info } from "lucide-react";

interface CreatorProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorProfileModal({ isOpen, onClose }: CreatorProfileProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with cyber blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020512]/95 backdrop-blur-md cursor-pointer"
          />

          {/* Futuristic Cyber Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-[#050c1e] border-2 border-sky-500/30 rounded-2xl p-6 md:p-8 max-w-2xl w-full relative overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.15)] z-10 font-sans"
          >
            {/* Cyber Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:16px_16px] opacity-10 pointer-events-none" />
            
            {/* Neon Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-sky-400" />

            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer z-20"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Identity Core */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center pb-6 border-b border-slate-800 relative z-10">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full" />
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-sky-400/40 flex items-center justify-center text-sky-400 shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-sky-500/5 group-hover:bg-sky-500/10 transition-colors" />
                  <Cpu className="w-10 h-10 animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 font-mono text-[8.5px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-400 uppercase select-none tracking-tight">
                  ACTIVE
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                    SYSTEM CREATOR
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    STEM Build v2.0
                  </span>
                </div>
                <h3 className="font-sans font-black text-2xl text-white tracking-tight uppercase">
                  Sean Audie I. Buscano II
                </h3>
                <p className="font-mono text-[11px] text-slate-400 font-semibold tracking-wide">
                  AI & Robotics Educator • Electronics Engineer
                </p>
              </div>
            </div>

            {/* Platform & Creator Description Block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b border-slate-800 relative z-10">
              <div className="md:col-span-12 space-y-4">
                <div>
                  <span className="font-mono text-[8px] text-slate-500 font-extrabold tracking-widest uppercase block mb-1">PLATFORM OVERVIEW</span>
                  <p className="font-sans text-[12px] md:text-xs text-slate-300 leading-relaxed font-medium">
                    Robotics Learning Hub is an open-access interactive STEM platform designed to teach robotics, electronics, programming, control systems, and AI through immersive simulations and visual learning.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[8px] text-slate-500 font-extrabold tracking-widest uppercase block mb-1">UAE DEV HUB</span>
                  <p className="font-sans text-[11px] text-slate-400 leading-relaxed font-medium">
                    Designed and programmed in Dubai, United Arab Emirates, this build integrates high-fidelity vector diagrams, interactive state flowcharts, and local AI coaching agents.
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Social Grid Connects */}
            <div className="pt-6 relative z-10">
              <span className="font-mono text-[8px] text-slate-500 font-extrabold tracking-widest uppercase block mb-3">SECURE TRANSMISSION PORTS</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* LinkedIn Port */}
                <a
                  href="https://linkedin.com/in/seanaudie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/30 hover:bg-sky-500/[0.03] transition-all group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-slate-950 text-slate-400 group-hover:text-sky-400 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[8px] text-slate-500 font-bold block uppercase tracking-wider">LinkedIn</span>
                    <span className="font-sans text-[10.5px] text-slate-300 font-bold group-hover:text-white transition-colors truncate block">
                      linkedin.com/in/seanaudie
                    </span>
                  </div>
                </a>

                {/* Github Port */}
                <a
                  href="https://github.com/seanaudie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition-all group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-slate-950 text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[8px] text-slate-500 font-bold block uppercase tracking-wider">GitHub Link</span>
                    <span className="font-sans text-[10.5px] text-slate-300 font-bold group-hover:text-white transition-colors truncate block">
                      github.com/seanaudie
                    </span>
                  </div>
                </a>

                {/* Email Port */}
                <a
                  href="mailto:buscanosean1@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-slate-950 text-slate-400 group-hover:text-amber-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[8px] text-slate-500 font-bold block uppercase tracking-wider">Email Port</span>
                    <span className="font-sans text-[10.5px] text-slate-300 font-bold group-hover:text-white transition-colors truncate block">
                      buscanosean1@gmail.com
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Bottom Tech Status footer */}
            <div className="mt-8 pt-3 border-t border-slate-900 select-none flex justify-between items-center text-[8px] font-mono text-slate-600">
              <span>REF_LINK_STABILITY: SECURE</span>
              <span>GEO_ACC: Dubai, UAE</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function CreatorProfileCard() {
  return (
    <div className="bg-[#050c1e]/90 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden group">
      {/* Laser Highlight Overlay */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40px] h-[40px] border-r border-t border-sky-400/20 rounded-tr-xl pointer-events-none group-hover:border-sky-500/40 transition-colors" />

      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1.5px,transparent_1.5px),linear-gradient(to_bottom,#0c1322_1.5px,transparent_1.5px)] bg-[size:20px_20px] opacity-[0.03] pointer-events-none" />

      <div className="flex flex-col gap-5 relative z-10">
        {/* Author Label */}
        <div className="flex items-start gap-4 pb-4 border-b border-slate-800/80">
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-sky-400 shrink-0 shadow-inner group-hover:border-sky-500/30 transition-all">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[8px] bg-sky-500/10 text-sky-405 text-sky-405 border border-sky-500/25 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                Developed By
              </span>
              <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">
                STEM Build v2.0
              </span>
            </div>
            <h3 className="font-sans font-black text-sm text-white tracking-tight leading-tight uppercase">
              Sean Audie I. Buscano II
            </h3>
            <p className="font-sans text-[11px] text-slate-400 font-bold leading-tight mt-0.5">
              AI & Robotics Educator • Electronics Engineer
            </p>
          </div>
        </div>

        {/* Short Statement */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="font-mono text-[8px] text-slate-500 font-extrabold tracking-widest uppercase block">
              Platform Description
            </span>
            <p className="font-sans text-[12px] text-slate-300 leading-relaxed font-normal">
              Robotics Learning Hub is an open-access interactive STEM platform designed to teach robotics, electronics, programming, control systems, and AI through immersive simulations and visual learning.
            </p>
          </div>

          {/* Secure Transmission Ports Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* LinkedIn Port */}
            <a
              href="https://linkedin.com/in/seanaudie"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-900/80 hover:border-sky-500/30 hover:bg-sky-500/[0.02] transition-all group/port cursor-pointer"
            >
              <Linkedin className="w-3.5 h-3.5 text-slate-500 group-hover/port:text-sky-400 transition-colors" />
              <div className="min-w-0">
                <span className="font-mono text-[7px] text-slate-600 block uppercase font-bold">LinkedIn</span>
                <span className="font-sans text-[9px] text-slate-400 group-hover/port:text-slate-100 transition-colors truncate block">
                  linkedin.com/in/seanaudie
                </span>
              </div>
            </a>

            {/* Github Port */}
            <a
              href="https://github.com/seanaudie"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-900/80 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all group/port cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 text-slate-500 group-hover/port:text-emerald-400 transition-colors" />
              <div className="min-w-0">
                <span className="font-mono text-[7px] text-slate-600 block uppercase font-bold">GitHub</span>
                <span className="font-sans text-[9px] text-slate-400 group-hover/port:text-slate-100 transition-colors truncate block">
                  github.com/seanaudie
                </span>
              </div>
            </a>

            {/* Email Port */}
            <a
              href="mailto:buscanosean1@gmail.com"
              className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-900/80 hover:border-amber-500/30 hover:bg-amber-500/[0.02] transition-all group/port cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500 group-hover/port:text-amber-400 transition-colors" />
              <div className="min-w-0">
                <span className="font-mono text-[7px] text-slate-600 block uppercase font-bold">Email Port</span>
                <span className="font-sans text-[9px] text-slate-400 group-hover/port:text-slate-100 transition-colors truncate block">
                  buscanosean1@gmail.com
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
