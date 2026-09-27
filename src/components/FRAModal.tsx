"use client";

import React, { useState } from "react";
import { 
  FeeAuthority, 
  AUTHORITY_CONFIGS, 
  INITIAL_DPHARM_FFC_EXPENSES, 
  FeeExpenseHead 
} from "@/data/fraData";
import { X, ShieldCheck, CheckCircle2, IndianRupee, Lock, Building, FileSpreadsheet } from "lucide-react";

interface FRAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}

export default function FRAModal({ isOpen, onClose, onLogAudit }: FRAModalProps) {
  const [selectedAuthority, setSelectedAuthority] = useState<FeeAuthority>("FFC");
  const [expenses, setExpenses] = useState<FeeExpenseHead[]>(INITIAL_DPHARM_FFC_EXPENSES);
  const [isLocked, setIsLocked] = useState(false);

  if (!isOpen) return null;

  const currentConfig = AUTHORITY_CONFIGS[selectedAuthority];

  const totalApprovedExpense = expenses.reduce((acc, curr) => acc + curr.approvedInr, 0);
  const costPerStudent = Math.round(totalApprovedExpense / currentConfig.sanctionedStrength);
  const proposedTuitionFee = Math.round(costPerStudent / 1000) * 1000;
  const developmentFee = Math.round(proposedTuitionFee * 0.10);
  const totalAnnualProposedFee = proposedTuitionFee + developmentFee;
  const processingFee = currentConfig.processingFeeCalc(totalAnnualProposedFee);

  const handleUpdateAmount = (index: number, newAmount: number) => {
    if (isLocked) return;
    const cleanAmount = isNaN(newAmount) ? 0 : Math.max(0, newAmount);
    setExpenses((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], amountInr: cleanAmount };
      target.approvedInr = Math.round((cleanAmount * target.admissibilityPct) / 100);
      updated[index] = target;
      return updated;
    });
  };

  const handleLockProposal = () => {
    setIsLocked(true);
    onLogAudit(
      `${selectedAuthority}_FEE_PROPOSAL_LOCKED`,
      `Locked ${selectedAuthority} Proposal: ₹${totalAnnualProposedFee.toLocaleString("en-IN")} (Tuition: ₹${proposedTuitionFee.toLocaleString("en-IN")}, Dev: ₹${developmentFee.toLocaleString("en-IN")}) for ${currentConfig.applicableCourses}`
    );
    alert(`${currentConfig.title} Proposal locked & cryptographically committed to audit ledger.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Accounts & Institutional Finance Cell
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {currentConfig.actReference}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Fee Proposal Builder: FFC (Diploma) & FRA (Degree)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dual Authority Switcher Tabs */}
        <div className="border-b border-slate-800 px-6 py-2.5 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedAuthority("FFC"); setIsLocked(false); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                selectedAuthority === "FFC"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Building className="w-3.5 h-3.5" /> FFC (D.Pharm Diploma)
            </button>
            <button
              onClick={() => { setSelectedAuthority("FRA"); setIsLocked(false); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                selectedAuthority === "FRA"
                  ? "bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> FRA (B.Pharm Degree)
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Active: <span className="text-amber-400 font-semibold">{currentConfig.applicableCourses}</span>
          </div>
        </div>

        {/* Statutory Summary Banner */}
        <div className="border-b border-slate-800 px-6 py-4 bg-slate-900/80 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Admissible Exp</span>
            <div className="text-base font-bold text-slate-100 font-mono mt-1">
              ₹ {totalApprovedExpense.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">{currentConfig.sanctionedStrength} Sanctioned Intake</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-blue-400">Proposed Tuition</span>
            <div className="text-base font-bold text-blue-300 font-mono mt-1">
              ₹ {proposedTuitionFee.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Per Student / Year</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-amber-400">Development Fee</span>
            <div className="text-base font-bold text-amber-300 font-mono mt-1">
              ₹ {developmentFee.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Max 10% statutory cap</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-purple-400">Processing Fee</span>
            <div className="text-base font-bold text-purple-300 font-mono mt-1">
              ₹ {processingFee.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {selectedAuthority === "FFC" ? "0.1% max ₹15,000" : "Statutory Slab"}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Total Proposed Fee</span>
              <div className="text-lg font-black text-emerald-300 font-mono">
                ₹ {totalAnnualProposedFee.toLocaleString("en-IN")}
              </div>
            </div>
            <button
              onClick={handleLockProposal}
              disabled={isLocked}
              className={`mt-2 py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition text-xs shadow ${
                isLocked 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {isLocked ? "Proposal Frozen" : `Lock ${selectedAuthority}`}
            </button>
          </div>
        </div>

        {/* Expense Breakdown Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-mono">
                <th className="pb-3">Expenditure Item</th>
                <th className="pb-3">Classification</th>
                <th className="pb-3 text-right">Actual Incurred (₹)</th>
                <th className="pb-3 text-center">Norm Admissibility</th>
                <th className="pb-3 text-right">Admitted by Authority (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expenses.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3">
                    <div className="font-semibold text-slate-200">{item.headName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.id}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono">
                    <input
                      type="number"
                      disabled={isLocked}
                      value={item.amountInr}
                      onChange={(e) => handleUpdateAmount(idx, parseInt(e.target.value))}
                      className="w-32 text-right bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono focus:border-amber-400 focus:outline-none disabled:opacity-60"
                    />
                  </td>
                  <td className="py-3 text-center font-mono text-slate-400">
                    {item.admissibilityPct}%
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-100">
                    ₹ {item.approvedInr.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Regulatory Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Accrual audit required. Difference (excess/short) must be reconciled with MahaDBT Social Welfare claims.
          </div>
          <div className="text-slate-400 font-mono">
            Mode: <span className="text-amber-400 font-bold">{selectedAuthority} Active</span> | Status: {isLocked ? "FROZEN_FOR_SUBMISSION" : "EDITABLE_DRAFT"}
          </div>
        </div>
      </div>
    </div>
  );
}
