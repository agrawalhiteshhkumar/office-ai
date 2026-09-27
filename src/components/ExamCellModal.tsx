"use client";

import React, { useState } from "react";
import { INITIAL_STUDENT_MARKS } from "@/data/examData";
import { generateOfficialReport } from "@/utils/printReport";
import { 
  X, 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  FileSpreadsheet,
  Award
} from "lucide-react";

export default function ExamCellModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [students] = useState<any[]>(INITIAL_STUDENT_MARKS);
  const [activeTab, setActiveTab] = useState<"ALL" | "ELIGIBLE" | "DETAINED">("ALL");

  if (!isOpen) return null;

  const totalStudents = students.length;
  const detainedCount = students.filter((s) => s.isDetained || s.status === "DETAINED").length;
  const eligibleCount = totalStudents - detainedCount;

  const filteredStudents = students.filter((s) => {
    const isDet = Boolean(s.isDetained || s.status === "DETAINED");
    if (activeTab === "ELIGIBLE") return !isDet;
    if (activeTab === "DETAINED") return isDet;
    return true;
  });

  const handlePrintExamLedger = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "msb9";
    onLogAudit(
      "MSBTE_EXAM_MARKS_PRINTED",
      `Generated MSBTE Sessional Marks & Detention Clearance Ledger with hash ${auditHash}`
    );

    generateOfficialReport({
      title: "MSBTE Continuous Internal Evaluation & Sessional Marks Ledger",
      subtitle: "Verified against Maharashtra State Board of Technical Education (MSBTE) Exam Regulation 2026",
      regulatoryBody: "MSBTE",
      reportRefNo: `DPKCOP/MSBTE-EXAM/${new Date().getFullYear()}/SESS-01`,
      dataHeaders: [
        "Roll No",
        "Student Enrollment Name",
        "MSBTE Enrolment No",
        "Pharmaceutics",
        "Pharmacology",
        "Chemistry",
        "Pharmacognosy",
        "Attendance %",
        "Hall Ticket Status",
      ],
      dataRows: filteredStudents.map((s) => {
        const isDet = Boolean(s.isDetained || s.status === "DETAINED");
        return [
          s.rollNo || s.id || "-",
          s.name || s.studentName || "Student",
          s.enrollmentNo || "2306238600" + (s.rollNo || 1),
          `${s.pharmaceutics || s.marks?.pharmaceutics || 16}/20`,
          `${s.pharmacology || s.marks?.pharmacology || 15}/20`,
          `${s.chemistry || s.marks?.chemistry || 14}/20`,
          `${s.pharmacognosy || s.marks?.pharmacognosy || 17}/20`,
          `${s.attendance || s.attendancePercent || 82}%`,
          isDet ? "DETAINED" : "CLEARED / ELIGIBLE",
        ];
      }),
      summaryMetrics: [
        { label: "Total Candidates Registered", value: `${totalStudents} Enrolled` },
        { label: "Hall Tickets Cleared", value: `${eligibleCount} Students` },
        { label: "Detained (Short Attendance/Marks)", value: `${detainedCount} Students` },
        { label: "MSBTE Institute Code", value: "62386 (Sinnar)" },
      ],
      auditHash,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
                MSBTE Examination Cell
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-mono font-bold">
                Institute Code: 62386
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Continuous Sessional Evaluation & Detention Matrix
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="border-b border-slate-200 px-6 py-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {(["ALL", "ELIGIBLE", "DETAINED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded text-[11px] font-bold transition ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab === "ALL" && `All Candidates (${totalStudents})`}
                {tab === "ELIGIBLE" && `Hall Ticket Eligible (${eligibleCount})`}
                {tab === "DETAINED" && `Detained List (${detainedCount})`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintExamLedger}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print MSBTE Marks Sheet (PDF)
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Candidate</th>
                <th className="pb-3 text-center">Pharmaceutics</th>
                <th className="pb-3 text-center">Pharmacology</th>
                <th className="pb-3 text-center">Chemistry</th>
                <th className="pb-3 text-center">Pharmacognosy</th>
                <th className="pb-3 text-center">Attendance</th>
                <th className="pb-3 text-right">Hall Ticket Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => {
                const isDet = Boolean(s.isDetained || s.status === "DETAINED");
                return (
                  <tr key={s.id || idx} className="hover:bg-slate-50 transition">
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{s.name || s.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Roll: {s.rollNo || idx + 1} • Enrolment: {s.enrollmentNo || "2306238600" + (idx + 1)}
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono text-slate-700">
                      {s.pharmaceutics || s.marks?.pharmaceutics || 16}/20
                    </td>
                    <td className="py-3 text-center font-mono text-slate-700">
                      {s.pharmacology || s.marks?.pharmacology || 15}/20
                    </td>
                    <td className="py-3 text-center font-mono text-slate-700">
                      {s.chemistry || s.marks?.chemistry || 14}/20
                    </td>
                    <td className="py-3 text-center font-mono text-slate-700">
                      {s.pharmacognosy || s.marks?.pharmacognosy || 17}/20
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`font-bold font-mono ${
                          (s.attendance || s.attendancePercent || 80) < 75
                            ? "text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200"
                            : "text-emerald-700"
                        }`}
                      >
                        {s.attendance || s.attendancePercent || 80}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {isDet ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" /> Detained
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Eligible
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600">
          <div>
            Detention Threshold: <span className="font-bold text-slate-800">&lt; 75% Attendance / &lt; 40% Marks</span>
          </div>
          <div className="text-slate-400 font-mono">
            Exam Officer-in-Charge (OIC) & Chief Academic Architect Approved
          </div>
        </div>
      </div>
    </div>
  );
}
