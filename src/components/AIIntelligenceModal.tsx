"use client";

import React, { useState } from "react";
import { analyzeCircularWithGemini, RegulatoryAnalysisResult } from "@/services/geminiService";
import { Sparkles, X, AlertTriangle, Clock, CheckSquare, Layers, Key } from "lucide-react";

interface AIIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}

export default function AIIntelligenceModal({
  isOpen,
  onClose,
  onLogAudit,
}: AIIntelligenceModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [circularInput, setCircularInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<RegulatoryAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!apiKey) {
      alert("Please provide your Google AI Studio API key.");
      return;
    }
    if (!circularInput.trim()) {
      alert("Please paste the regulatory circular text.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeCircularWithGemini(circularInput, apiKey);
      setAnalysis(result);
      onLogAudit(
        "AI_STATUTORY_CIRCULAR_AUDIT",
        `Parsed circular for ${result.issuingAuthority} - Risk: ${result.statutoryRiskLevel}`
      );
    } catch (e) {
      alert("Failed to analyze circular.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Statutory Circular & Compliance AI Engine
              </h3>
              <p className="text-xs text-slate-400">
                Automated parsing of MSBTE, PCI, DTE, and FRA government circulars
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs">
          {/* API Key Config */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              <label className="text-[11px] text-slate-400 font-semibold block mb-0.5">
                Google AI Studio API Key
              </label>
              <input
                type="password"
                placeholder="Paste your GEMINI_API_KEY..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-amber-400 focus:outline-none font-mono text-xs"
              />
            </div>
          </div>

          {/* Circular Text Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 font-medium">
              Paste Official Circular / Notification Text
            </label>
            <textarea
              rows={5}
              placeholder="Paste raw notice text (e.g. from MSBTE Exam notification, PCI Cadre ratio circular, or DTE admission guideline)..."
              value={circularInput}
              onChange={(e) => setCircularInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Running Statutory Intelligence Engine..." : "Analyze Compliance Mandates"}
          </button>

          {/* Analysis Results Display */}
          {analysis && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Subject</span>
                  <div className="font-semibold text-slate-200 text-sm mt-0.5">{analysis.circularSubject}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Risk Assessment</span>
                  <div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                        analysis.statutoryRiskLevel === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {analysis.statutoryRiskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deadlines & Affected Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col gap-1.5">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Statutory Deadlines
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {analysis.deadlines.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col gap-1.5">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" /> Affected Institutional Sections
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {analysis.affectedSections.map((sec, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mandated Actions */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col gap-1.5">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Mandated Action Steps
                </span>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  {analysis.mandatedActions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
