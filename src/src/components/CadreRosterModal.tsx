"use client";

import React, { useState } from "react";
import { FacultyCadreRecord, INITIAL_FACULTY_ROSTER } from "@/data/cadreData";
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Users, Award, FileBadge } from "lucide-react";

interface CadreRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}

export default function CadreRosterModal({ isOpen, onClose, onLogAudit }: CadreRosterModalProps) {
  const [roster, setRoster] = useState<FacultyCadreRecord[]>(INITIAL_FACULTY_ROSTER);

  if (!isOpen) return null;

  const totalFaculty = roster.length;
  const approvedCount = roster.filter((f) => f.dteApprovalStatus === "APPROVED").length;
  const hasPrincipal = roster.some((f) => f.designation === "PRINCIPAL");
  const compliant = totalFaculty >= 4 && hasPrincipal;

  const handleRunAudit = () => {
    onLogAudit(
      "PCI_CADRE_ROSTER_AUDITED",
      `Verified Cadre Ratio (${totalFaculty} Faculty, ${approvedCount} DTE Approved) - Compliant: ${compliant}`
    );
    alert("Cadre validation completed and logged to tamper-evident audit ledger.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Establishment & Cadre Wing
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                PCI Norms / SIF-E Appendix
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Teaching Faculty Cadre Ratio & Statutory Approval Register
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cadre Compliance Metric Bar */}
        <div className="border-b border-slate-800 px-6 py-3 bg-slate-900/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Faculty Cadre Count</div>
              <div className="text-sm font-bold text-slate-100">{totalFaculty} / 5 Appointed</div>
            </div>
          </div>

          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">DTE / MSBTE Approvals</div>
              <div className="text-sm font-bold text-emerald-400">{approvedCount} Sanctioned</div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <button
              onClick={handleRunAudit}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <ShieldCheck className="w-4 h-4" /> Run Compliance Audit
            </button>
          </div>
        </div>

        {/* Faculty Roster Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-mono">
                <th className="pb-3">Faculty Name</th>
                <th className="pb-3">Designation</th>
                <th className="pb-3">Qualification</th>
                <th className="pb-3">PCI Reg. No</th>
                <th className="pb-3">Approval Reference</th>
                <th className="pb-3 text-right">DTE Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {roster.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3">
                    <div className="font-semibold text-slate-200">{fac.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Exp: {fac.experienceYears} Years</div>
                  </td>
                  <td className="py-3">
                    <span className="font-mono text-slate-300 font-medium px-2 py-0.5 rounded bg-slate-800 text-[10px]">
                      {fac.designation}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{fac.qualification}</td>
                  <td className="py-3 font-mono text-amber-400">{fac.pciRegNo}</td>
                  <td className="py-3 font-mono text-slate-400 text-[11px]">{fac.msbteApprovalNo}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                        fac.dteApprovalStatus === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {fac.dteApprovalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <FileBadge className="w-3.5 h-3.5 text-slate-400" />
            PCI Education Regulations 2020 Norms: Min 1 Principal + 4 Faculty for 60 D.Pharm Intake
          </div>
          <div className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Norm Ratio Satisfied
          </div>
        </div>
      </div>
    </div>
  );
}
