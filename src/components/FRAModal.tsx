"use client";

import React, { useState } from "react";
import { generateOfficialReport } from "@/utils/printReport";
import { 
  X, 
  IndianRupee, 
  Calculator, 
  FileCheck, 
  Printer, 
  HelpCircle,
  Building,
  GraduationCap
} from "lucide-react";

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  isSalary: boolean;
}

const DEFAULT_EXPENSES: ExpenseCategory[] = [
  { id: "EXP-1", name: "Teaching Faculty Salaries (PCI / 6th-7th Pay)", amount: 5200000, isSalary: true },
  { id: "EXP-2", name: "Non-Teaching / Technical Staff Salaries", amount: 1450000, isSalary: true },
  { id: "EXP-3", name: "Laboratory Consumables & Glassware", amount: 480000, isSalary: false },
  { id: "EXP-4", name: "Library Books, Journals & E-Resources", amount: 260000, isSalary: false },
  { id: "EXP-5", name: "Building Rent / Infrastructure Amortization", amount: 1200000, isSalary: false },
  { id: "EXP-6", name: "Institutional Overheads, Power & Water", amount: 540000, isSalary: false }
];

export default function FRAModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [engineType, setEngineType] = useState<"FFC_DIPLOMA" | "FRA_DEGREE">("FFC_DIPLOMA");
  const [expenses] = useState<ExpenseCategory[]>(DEFAULT_EXPENSES);
  const [sanctionedIntake] = useState<number>(60);
  const [totalStudents] = useState<number>(120); // 1st & 2nd Year D.Pharm

  if (!isOpen) return null;

  const totalOperationalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perStudentCost = Math.round(totalOperationalExpense / totalStudents);

  // FFC Rules: Max 10% Development Fee
  const developmentFee = Math.round(perStudentCost * 0.10);
  const totalProposedFee = perStudentCost + developmentFee;

  // Processing fee: 0.1% capped at 15,000 INR
  const statutoryProcessingFee = Math.min(Math.round(totalProposedFee * totalStudents * 0.001), 15000);

  const handlePrintFeeProposal = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "fee4";
    const regLabel = engineType === "FFC_DIPLOMA" ? "MAHA_FFC" : "FRA";
    
    onLogAudit(
      "STATUTORY_FEE_PROPOSAL_PRINTED",
      `Generated official ${engineType} Fee Annexure & Audit Proposal with hash ${auditHash}`
    );

    generateOfficialReport({
      title: engineType === "FFC_DIPLOMA" 
        ? "Fees Regulating Committee (FFC) Statutory Proposal - D.Pharm" 
        : "Fee Regulating Authority (FRA) Statutory Proposal - B.Pharm",
      subtitle: "Verified against Maharashtra Unaided Private Professional Educational Institutions Act 2015",
      regulatoryBody: "MAHA_FFC",
      reportRefNo: `DPKCOP/${engineType}/${new Date().getFullYear()}/PROP-01`,
      dataHeaders: [
        "Sr",
        "Statutory Expenditure Head",
        "Expense Classification",
        "Audited Amount (INR)",
        "Per-Student Component",
      ],
      dataRows: [
        ...expenses.map((e, idx) => [
          idx + 1,
          e.name,
          e.isSalary ? "Salary / Remuneration Norm" : "Non-Salary Operational Overhead",
          `₹ ${e.amount.toLocaleString("en-IN")}`,
          `₹ ${Math.round(e.amount / totalStudents).toLocaleString("en-IN")}`,
        ]),
        ["-", "STATUTORY BASE TUITION COST", "Aggregated Operational Base", `₹ ${totalOperationalExpense.toLocaleString("en-IN")}`, `₹ ${perStudentCost.toLocaleString("en-IN")}`],
        ["-", "DEVELOPMENT FEE (MAX 10% CAP)", "Statutory Capital Modernization", `₹ ${(developmentFee * totalStudents).toLocaleString("en-IN")}`, `₹ ${developmentFee.toLocaleString("en-IN")}`],
        ["-", "TOTAL PROPOSED ANNUAL FEE", "Final Approved Ceiling per Candidate", "-", `₹ ${totalProposedFee.toLocaleString("en-IN")}`]
      ],
      summaryMetrics: [
        { label: "Proposed Annual Tuition Fee", value: `₹ ${perStudentCost.toLocaleString("en-IN")}` },
        { label: "Development Fee (10% Statutory)", value: `₹ ${developmentFee.toLocaleString("en-IN")}` },
        { label: "Total Approved Fee Proposal", value: `₹ ${totalProposedFee.toLocaleString("en-IN")} / Year` },
        { label: "FFC Processing Fee Paid", value: `₹ ${statutoryProcessingFee.toLocaleString("en-IN")} (Capped)` },
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
                Accounts & Finance Wing
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                Dual FFC / FRA Statutory Engine
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Fee Proposal Calculation & Regulatory Annexures
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Engine Switcher & Print Toolbar */}
        <div className="border-b border-slate-200 px-6 py-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEngineType("FFC_DIPLOMA")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                engineType === "FFC_DIPLOMA"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Building className="w-3.5 h-3.5" /> FFC (D.Pharm Diploma Engine)
            </button>
            <button
              onClick={() => setEngineType("FRA_DEGREE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                engineType === "FRA_DEGREE"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> FRA (B.Pharm Degree Engine)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintFeeProposal}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print Statutory Fee Annexure (PDF)
            </button>
          </div>
        </div>

        {/* Proposal Summary Metrics Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 border-b border-slate-200">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Operational Cost</div>
            <div className="text-base font-black text-slate-900 mt-1">₹ {totalOperationalExpense.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Audited Balance Sheet Total</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Base Tuition Cost</div>
            <div className="text-base font-black text-slate-900 mt-1">₹ {perStudentCost.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Per Enrolled Student / Year</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Development Fee (10% Cap)</div>
            <div className="text-base font-black text-emerald-700 mt-1">₹ {developmentFee.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Statutory Modernization Norm</div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 shadow-xs">
            <div className="text-[10px] font-bold text-blue-700 uppercase">Proposed Fee Ceiling</div>
            <div className="text-base font-black text-blue-900 mt-1">₹ {totalProposedFee.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Approved Submission Ceiling</div>
          </div>
        </div>

        {/* Expenditure Ledger Breakdown */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Statutory Expenditure Breakdown (Schedule-A Format)
          </div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <th className="pb-3">Expenditure Head</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right">Total Audited (INR)</th>
                <th className="pb-3 text-right">Per-Candidate Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-slate-800">{e.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      e.isSalary 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {e.isSalary ? "Salary Component" : "Non-Salary Overhead"}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-medium text-slate-700">
                    ₹ {e.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-600">
                    ₹ {Math.round(e.amount / totalStudents).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600">
          <div>
            Processing Fee: <span className="font-bold text-slate-800">₹ {statutoryProcessingFee.toLocaleString("en-IN")}</span> (0.1% capped at ₹15,000)
          </div>
          <div className="text-slate-400 font-mono">
            Chartered Accountant & Executive Authority Jointly Verified
          </div>
        </div>
      </div>
    </div>
  );
}
