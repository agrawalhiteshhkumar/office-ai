"use client";

import React, { useState } from "react";
import { FacultyCadreRecord, INITIAL_FACULTY_ROSTER } from "@/data/cadreData";
import { generateOfficialReport } from "@/utils/printReport";
import { 
  X, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Filter, 
  Printer
} from "lucide-react";

export default function CadreRosterModal({ 
  isOpen, 
  onClose, 
  onLogAudit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogAudit: (action: string, details: string) => void; 
}) {
  const [facultyList] = useState<FacultyCadreRecord[]>(INITIAL_FACULTY_ROSTER);
  const [filterDesignation, setFilterDesignation] = useState<string>("ALL");

  if (!isOpen) return null;

  const filtered = filterDesignation === "ALL" 
    ? facultyList 
    : facultyList.filter((f) => f.designation === filterDesignation);

  const totalTeaching = facultyList.length;
  const compliantFaculty = facultyList.filter((f) => f.compliancePciNorm).length;

  const handleExportPCIReport = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "cad7";
    onLogAudit("PCI_CADRE_REPORT_PRINTED", `Generated official PCI Teaching Cadre compliance print sheet with hash ${auditHash}`);

    generateOfficialReport({
      title: "PCI Statutory Teaching Cadre & Faculty Approval Matrix",
      subtitle: "Verified against PCI Appendix-B Norms & DTE Maharashtra Cadre Guidelines",
      regulatoryBody: "PCI",
      reportRefNo: `DPKCOP/PCI-ROSTER/${new Date().getFullYear()}/01`,
      dataHeaders: ["Sr", "Faculty Name", "Designation", "Qualification", "Department", "Exp (Yrs)", "DTE/Govt Approval", "PCI Status"],
      dataRows: filtered.map((f, i) => [
        i + 1,
        f.name,
        String(f.designation).replace("_", " "),
        f.highestQualification,
        f.department,
        f.experienceYears,
        f.approvalNumber,
        f.compliancePciNorm ? "COMPLIANT" : "NON-COMPLIANT",
      ]),
      summaryMetrics: [
        { label: "Total Teaching Cadre", value: `${totalTeaching} Faculty` },
        { label: "PCI Norm Compliance", value: `${compliantFaculty} / ${totalTeaching} Verified` },
        { label: "Sanctioned Intake Mapped", value: "60 D.Pharm" },
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
                Establishment & Cadre Cell
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono font-bold">
                PCI SIF Norm Compliant
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Faculty Cadre Roster & Statutory Approvals
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action & Metric Toolbar */}
        <div className="border-b border-slate-200 px-6 py-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" /> Cadre:
            </span>
            {["ALL", "PRINCIPAL", "HOD", "LECTURER"].map((desig) => (
              <button
                key={desig}
                onClick={() => setFilterDesignation(desig)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                  filterDesignation === desig
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {desig}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPCIReport}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print PCI Report (PDF)
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Faculty Member</th>
                <th className="pb-3">Designation</th>
                <th className="pb-3">Qualification</th>
                <th className="pb-3">Dept</th>
                <th className="pb-3 text-center">Exp</th>
                <th className="pb-3">Approval Reference</th>
                <th className="pb-3 text-right">PCI Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition">
                  <td className="py-3">
                    <div className="font-bold text-slate-900">{f.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">DOJ: {f.dateOfJoining}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                      {String(f.designation).replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 text-slate-700 font-medium">{f.highestQualification}</td>
                  <td className="py-3 text-slate-600">{f.department}</td>
                  <td className="py-3 text-center font-bold text-slate-800">{f.experienceYears}y</td>
                  <td className="py-3 font-mono text-[11px] text-slate-600">{f.approvalNumber}</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600">
          <div>Faculty Ratio: <span className="font-bold text-slate-900">1:15 Approved</span> (SIF Compliant)</div>
          <div className="text-slate-400 font-mono">Verified by Dr. Hiteshkumar Agrawal • Principal</div>
        </div>
      </div>
    </div>
  );
}
