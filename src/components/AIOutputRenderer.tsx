import React, { useState } from "react";
import { Copy, Check, Terminal, Sparkles } from "lucide-react";

interface AIOutputRendererProps {
  content: string;
}

export default function AIOutputRenderer({ content }: AIOutputRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  if (!content) return null;

  // Split content by markdown code block tags: ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        const isCodeBlock = part.startsWith("```");

        if (isCodeBlock) {
          // Extract language and code text
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] || "code" : "code";
          const codeText = match ? match[2].trim() : part.slice(3, -3).trim();

          return (
            <div key={index} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/95 group shadow-lg my-3.5">
              {/* Code Header Bar */}
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-amber-500" />
                  {lang === "cpp" || lang === "ino" ? "Arduino C++ Source" : `${lang} Script`}
                </div>
                <button
                  onClick={() => handleCopy(codeText, index)}
                  className="font-mono text-[10px] text-slate-500 hover:text-amber-400 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 hover:border-amber-500/20 transition-all cursor-pointer"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
              {/* Full code terminal pre view */}
              <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed text-emerald-400/95 font-mono font-medium max-h-[350px] scrollbar-thin scrollbar-thumb-slate-800">
                {codeText}
              </pre>
            </div>
          );
        }

        // Parse line-by-line markdown features (Headers, lists, bold notes, bullet points)
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-2 text-slate-330 leading-relaxed font-sans text-xs">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              if (!trimmed) return <div key={lineIdx} className="h-2" />;

              // Headers: #, ##, ###, ####
              if (trimmed.startsWith("#### ")) {
                return (
                  <h5 key={lineIdx} className="font-mono text-slate-300 font-bold text-[11.5px] mt-4 mb-2 tracking-wide uppercase border-l-2 border-slate-700 pl-2">
                    {parseInlineMarkups(trimmed.slice(5))}
                  </h5>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lineIdx} className="font-sans text-amber-400 font-bold text-xs sm:text-sm mt-5 mb-2.5 tracking-tight flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 inline flex-shrink-0" />
                    {parseInlineMarkups(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lineIdx} className="font-sans text-slate-150 font-bold text-sm border-b border-slate-800 pb-1 mt-6 mb-3">
                    {parseInlineMarkups(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={lineIdx} className="font-sans text-white font-bold text-base mt-7 mb-4">
                    {parseInlineMarkups(trimmed.slice(2))}
                  </h2>
                );
              }

              // Quotes / Notice logs
              if (trimmed.startsWith("> ")) {
                return (
                  <div key={lineIdx} className="border-l-3 border-amber-500/80 bg-amber-500/5 p-3 rounded-r-lg my-3 font-mono text-[11px] leading-relaxed text-slate-400">
                    {parseInlineMarkups(trimmed.slice(2))}
                  </div>
                );
              }

              // Bullet lists
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex gap-2 pl-2 my-1 font-sans text-xs text-slate-300 leading-relaxed">
                    <span className="text-amber-500 select-none flex-shrink-0">•</span>
                    <span className="flex-1">{parseInlineMarkups(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Number lists
              const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex gap-2 pl-2 my-1.5 font-sans text-xs text-slate-300 leading-relaxed">
                    <span className="text-amber-500/90 font-mono font-bold select-none text-[10px] bg-slate-800 border border-slate-750 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                      {numMatch[1]}
                    </span>
                    <span className="flex-1 self-center">{parseInlineMarkups(numMatch[2])}</span>
                  </div>
                );
              }

              // Ordinary narrative text lines
              return (
                <p key={lineIdx} className="text-slate-300 leading-relaxed my-1 font-sans font-medium text-[11.5px] sm:text-xs">
                  {parseInlineMarkups(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Inline formatting helper for bolding and code blocks
function parseInlineMarkups(text: string): React.ReactNode[] {
  // Regex parsing parts for **bold** or `inline code`
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const components = text.split(regex);

  return components.map((comp, idx) => {
    if (comp.startsWith("**") && comp.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-100 font-sans tracking-tight">
          {comp.slice(2, -2)}
        </strong>
      );
    }
    if (comp.startsWith("`") && comp.endsWith("`")) {
      return (
        <code key={idx} className="font-mono text-[10.5px] bg-slate-900 border border-slate-800 text-amber-500/90 px-1 py-0.5 rounded font-semibold whitespace-nowrap">
          {comp.slice(1, -1)}
        </code>
      );
    }
    return comp;
  });
}
