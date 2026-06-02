import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import AIOutputRenderer from "./AIOutputRenderer";
import { Send, RefreshCw, Bot, User, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface AIChatTutorProps {
  onSendMessage: (prompt: string, history: ChatMessage[]) => Promise<string>;
  loading: boolean;
}

const LEVEL_PROMPTS = {
  beginner: [
    "How do I configure an ultrasonic sensor on an Arduino?",
    "What is the difference between digital and analog pins?",
    "How does a standard resistor protect a common LED?",
  ],
  advanced: [
    "How do PID control loops prevent motor overshoot?",
    "What is the difference between I2C and SPI wiring protocols?",
    "Explain how H-bridge components control DC motor direction.",
  ],
  expert: [
    "Explain 2D LiDAR SLAM spatial room mapping.",
    "How do Kalman Filters fuse IMU and encoder variables?",
    "Explain ROS2 subscriber/publisher node loop architectures.",
  ],
};

export default function AIChatTutor({ onSendMessage, loading }: AIChatTutorProps) {
  const [activeLevel, setActiveLevel] = useState<"beginner" | "advanced" | "expert">("beginner");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello, fellow robotics engineer! I am your AI Robotics Advisor. Ask me anything about microcontrollers, closed-loop servo physics, capacitive encoders, H-bridge drivers, or write-up custom control loops!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const replyText = await onSendMessage(text, messages);

      const modelMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "model",
        text: `Error connecting to advisor: ${err.message || "Please secure your key parameters and retry."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        text: "Welcome back! I am your AI Robotics Advisor. What cyber-physical systems shall we investigate today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="bg-[#050B18]/90 border-2 border-slate-700 p-5 rounded-2xl flex flex-col justify-between h-[480px] shadow-2xl relative transition-all">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3.5 z-10 gap-2">
        <span className="font-mono text-[9.5px] text-sky-400 uppercase tracking-wider font-extrabold flex items-center gap-1.5 select-none">
          <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" /> Interactive AI Robotics Tutor
        </span>
        <div className="flex items-center gap-2.5 font-mono text-[9px]">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-sky-300 hover:text-white bg-sky-950/20 hover:bg-sky-900 border-2 border-sky-500/40 px-2.5 py-1 rounded cursor-pointer transition-all flex items-center gap-1 font-bold shadow-md shadow-sky-950/50"
          >
            {showSuggestions ? (
              <>
                <ChevronUp className="w-3 h-3" /> Hide Prompts
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> Easy Prompts
              </>
            )}
          </button>
          <div className="w-[1.5px] h-3.5 bg-slate-800" />
          <button
            onClick={clearChat}
            className="text-slate-450 hover:text-red-400 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded bg-[#0a0f19] border border-slate-850 hover:border-red-500/30"
          >
            <RefreshCw className="w-2.5 h-2.5" /> Reset chat
          </button>
        </div>
      </div>

      {/* Messages Scrolling Hub */}
      <div className="flex-1 overflow-y-auto px-1 space-y-4 mb-3.5 h-full scrollbar-thin scrollbar-thumb-slate-800 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 text-xs ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            { m.role === "model" && (
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border-2 border-sky-500/40 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-sky-450" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed border ${
                m.role === "user"
                  ? "bg-sky-500 border-sky-400 text-slate-950 font-bold shadow-lg shadow-sky-500/10"
                  : "bg-slate-950/90 border-slate-700/80 text-slate-100"
              }`}
            >
              {m.role === "user" ? (
                <p className="font-sans text-[12px] font-bold leading-normal">{m.text}</p>
              ) : (
                <div className="font-sans text-[12px] font-medium leading-relaxed">
                  <AIOutputRenderer content={m.text} />
                </div>
              )}
            </div>

            {m.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border-2 border-slate-650 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-350" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border-2 border-sky-500/40 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-sky-450" />
            </div>
            <div className="bg-[#050B18]/95 border-2 border-slate-750 rounded-xl px-4 py-3 leading-relaxed flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
              <span className="font-mono text-[10.5px] text-slate-400 font-extrabold">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Prompt Chip links categorized by Level (Toggleable) */}
      {showSuggestions && (
        <div className="mb-3.5 space-y-2.5 border-t border-slate-800/80 pt-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono text-[9px] text-slate-350 block font-bold uppercase tracking-wider">
              SUGGESTED ENGINEERING LEVEL:
            </span>
            <div className="flex bg-[#0b0f19] p-1 rounded-xl border-2 border-slate-800 gap-1 select-none">
              {(["beginner", "advanced", "expert"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setActiveLevel(lvl)}
                  className={`px-2.5 py-0.5 rounded-lg font-mono text-[9px] tracking-wider uppercase font-extrabold transition-all cursor-pointer ${
                    activeLevel === lvl
                      ? "bg-sky-500 text-slate-950 font-black"
                      : "text-slate-400 hover:text-sky-300 border border-transparent"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 max-h-[110px] overflow-y-auto pr-0.5 scrollbar-thin">
            {LEVEL_PROMPTS[activeLevel].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="bg-slate-950 hover:bg-sky-950/20 text-[11px] text-slate-300 hover:text-sky-450 p-2.5 px-3.5 rounded-xl border-2 border-slate-850 hover:border-sky-500/40 font-semibold transition-all text-left cursor-pointer flex items-center gap-2 shadow-inner"
              >
                <span className="text-sky-450 animate-pulse font-black text-xs font-mono">•</span> 
                <span className="font-sans">{p}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="flex items-center gap-2 relative z-10"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a robotics question..."
          className="flex-1 bg-slate-950 text-xs text-white placeholder-slate-400 font-sans py-3 px-4 rounded-xl border-2 border-slate-700/80 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 focus:outline-none transition-all font-semibold"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || loading}
          className={`p-3 rounded-xl flex items-center justify-center transition-all border-2 ${
            inputValue.trim() && !loading
              ? "bg-sky-500 border-sky-400 text-slate-950 hover:bg-sky-400 cursor-pointer shadow-lg shadow-sky-500/15 font-black"
              : "bg-slate-950 text-slate-500 border-slate-800 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
