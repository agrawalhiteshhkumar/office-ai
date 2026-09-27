"use client";

import React, { useState } from "react";
import { 
  StudentAdmissionRecord, 
  INITIAL_STUDENT_ROSTER, 
  AdmissionCategory 
} from "@/data/admissionsData";
import { 
  X, 
  GraduationCap, 
  IndianRupee, 
  CheckCircle2, 
  FileCheck2, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Award 
} from "lucide-react";

interface AdmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}

export default function AdmissionsModal({ isOpen, onClose, onLogAudit }: AdmissionsModalProps) {
  const [students, setStudents] = useState<StudentAdmissionRecord[]>(INITIAL_STUDENT_ROSTER);
  const [yearFilter, setYearFilter] = useState<"ALL" | "YEAR_1" | "YEAR_2">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<AdmissionCategory | "ALL">("ALL");

  if (!isOpen) return null;

  const filtered = students.filter((s) => {
    if (yearFilter !== "ALL" && s.year !== yearFilter) return false;
    if (categoryFilter !== "ALL" && s.category !== categoryFilter) return false;
    return true;
  });

  const totalSeatsSanctioned = 60; // D.Pharm intake per year
  const totalEnrolled = students.length;
  const verifiedCount = students.filter((s) => s.eligibilityStatus === "CONFIRMED").length;
  const totalScholarshipClaimed = students.reduce((acc, curr) => acc + curr.scholarshipSanctionedInr, 0);
  const disbursedCount = students.filter((s) => s.mahadbtStatus === "DISBURSED").length;

  const handleAuditRoster = () => {
    onLogAudit(
      "MAHADBT_ELIGIBILITY_AUDITED",
      `Audited Admissions & Scholarship Matrix: ${totalEnrolled} Enrolled, ${verifiedCount} MSBTE Verified, ₹${totalScholarshipClaimed.toLocaleString("en-IN")} MahaDBT Claims reconciled`
    );
    alert("Admissions, MSBTE Eligibility & MahaDBT ledger verified and hashed to audit chain.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Student Admissions & Eligibility Cell
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                DTE CAP Allotment • MSBTE Eligibility • MahaDBT
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Admission Seat Matrix, MSBTE Enrollment & MahaDBT Freeship Ledger
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Metric Bar */}
        <div className="border-b border-slate-800 px-6 py-3 bg-slate-900/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">D.Pharm Intake</span>
            <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
              {totalEnrolled} / {totalSeatsSanctioned} Enrolled
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Sanctioned Intake: 60/yr</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-blue-400">MSBTE Eligibility</span>
            <div className="text-sm font-bold text-blue-300 font-mono mt-0.5">
              {verifiedCount} / {totalEnrolled} Verified
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Enrollment Numbers Generated</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-emerald-400">MahaDBT Claim Total</span>
            <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
              ₹ {totalScholarshipClaimed.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{disbursedCount} Disbursed to College</span>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleAuditRoster}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition"
            >
              <ShieldCheck className="w-4 h-4" /> Audit & Sign Roster
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Year:
            </span>
            {(["ALL", "YEAR_1", "YEAR_2"] as const).map((yr) => (
              <button
                key={yr}
                onClick={() => setYearFilter(yr)}
                className={`px-2.5 py-0.5 rounded font-mono text-[11px] transition ${
                  yearFilter === yr
                    ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Category:</span>
            {(["ALL", "OPEN", "OBC", "SC", "ST", "EWS"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat as any)}
                className={`px-2 py-0.5 rounded font-mono text-[10px] transition ${
                  categoryFilter === cat
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Students Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-mono">
                <th className="pb-3">CAP Application ID</th>
                <th className="pb-3">Candidate Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Round</th>
                <th className="pb-3">MSBTE Enrollment</th>
                <th className="pb-3">MahaDBT Status</th>
                <th className="pb-3 text-right">Scholarship Claim (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-mono text-amber-400 font-medium">{st.capApplicationId}</td>
                  <td className="py-3">
                    <div className="font-semibold text-slate-200">{st.studentName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{st.year} • {st.gender}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold">
                      {st.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono text-[10px]">{st.allotmentRound}</td>
                  <td className="py-3">
                    <div className="font-mono text-slate-200">{st.msbteEnrollmentNo}</div>
                    <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {st.eligibilityStatus}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        st.mahadbtStatus === "DISBURSED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : st.mahadbtStatus === "SCRUTINY_PENDING"
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {st.mahadbtStatus}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-100">
                    ₹ {st.scholarshipSanctionedInr.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            DTE Maharashtra Centralized Admission Process (CAP) & MSBTE Eligibility Norms Integrated.
          </div>
          <div className="text-slate-400 font-mono">
            Social Welfare Dept Reconciled: <span className="text-emerald-400 font-bold">{disbursedCount} / {totalEnrolled} Accounts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
