"use client";

import React, { useState } from "react";
import { StudentSessionalScore, INITIAL_STUDENT_SCORES } from "@/data/examData";
import { X, CheckCircle2, AlertTriangle, FileSpreadsheet, Lock, RefreshCw } from "lucide-react";

interface ExamCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}

export default function ExamCellModal({ isOpen, onClose, onLogAudit }: ExamCellModalProps) {
  const [scores, setScores] = useState<StudentSessionalScore[]>(INITIAL_STUDENT_SCORES);
  const [selectedYear, setSelectedYear] = useState<"YEAR_I" | "YEAR_II">("YEAR_II");
  const [isFrozen, setIsFrozen] = useState(false);

  if (!isOpen) return null;

  const handleScoreChange = (index: number, field: "sessional1" | "sessional2", value: number) => {
    if (isFrozen) return;
    const clampedVal = Math.min(20, Math.max(0, isNaN(value) ? 0 : value));
    
    setScores((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: clampedVal };
      target.sessionalAvg = parseFloat(((target.sessional1 + target.sessional2) / 2).toFixed(1));
      updated[index] = target;
      return updated;
    });
  };

  const handleFreezeLedger = () => {
    setIsFrozen(true);
    setScores((prev) => prev.map((s) => ({ ...s, status: "FROZEN_FOR_PORTAL" })));
    onLogAudit(
      "EXAM_SESSIONAL_FROZEN",
      `Sessional marks frozen for MSBTE Winter 2026 Portal (${selectedYear})`
    );
  };

  const detainedCount = scores.filter((s) => s.isDetained).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                MSBTE Examination Operations Cell
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Inst Code: 62386
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Sessional Mark Register & Internal Detention Ledger
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="border-b border-slate-800 px-6 py-3 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedYear("YEAR_I")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedYear === "YEAR_I"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              D.Pharm Year I
            </button>
            <button
              onClick={() => setSelectedYear("YEAR_II")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedYear === "YEAR_II"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              D.Pharm Year II
            </button>
          </div>

          <div className="flex items-center gap-3">
            {detainedCount > 0 && (
              <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> {detainedCount} Detained (&lt;75% Attendance)
              </span>
            )}
            <button
              onClick={handleFreezeLedger}
              disabled={isFrozen}
              className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm ${
                isFrozen
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {isFrozen ? "Ledger Frozen for Portal" : "Freeze for MSBTE Portal"}
            </button>
          </div>
        </div>

        {/* Table Register */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-mono">
                <th className="pb-3">Enrolment No</th>
                <th className="pb-3">Candidate Name</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3 text-center">Sessional I (20)</th>
                <th className="pb-3 text-center">Sessional II (20)</th>
                <th className="pb-3 text-center font-bold text-amber-400">Average (20)</th>
                <th className="pb-3 text-center">Attendance</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scores.map((row, idx) => (
                <tr key={row.studentId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-mono text-slate-400">{row.enrolmentNo}</td>
                  <td className="py-3 font-medium text-slate-200">{row.studentName}</td>
                  <td className="py-3 text-slate-400">{row.subjectCode}</td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      disabled={isFrozen}
                      value={row.sessional1}
                      onChange={(e) => handleScoreChange(idx, "sessional1", parseInt(e.target.value))}
                      className="w-14 text-center bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-200 font-mono focus:border-amber-400 focus:outline-none disabled:opacity-50"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      disabled={isFrozen}
                      value={row.sessional2}
                      onChange={(e) => handleScoreChange(idx, "sessional2", parseInt(e.target.value))}
                      className="w-14 text-center bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-200 font-mono focus:border-amber-400 focus:outline-none disabled:opacity-50"
                    />
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-amber-300">
                    {row.sessionalAvg.toFixed(1)}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                        row.attendancePct < 75
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "text-slate-300"
                      }`}
                    >
                      {row.attendancePct}%
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {row.isDetained ? (
                      <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                        Detained
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Eligible
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500">
          <div>Standard Regulation 19(A) Compliant • Passing Threshold: 40% combined</div>
          <div className="text-slate-400 font-mono">Status: {isFrozen ? "FROZEN_FOR_PORTAL" : "EDITABLE_DRAFT"}</div>
        </div>
      </div>
    </div>
  );
}
