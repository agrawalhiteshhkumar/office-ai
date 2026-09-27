"use client";

import React, { useState } from "react";
import { 
  PharmacyLab, 
  DeadStockItem, 
  ScheduledChemicalItem, 
  INITIAL_DEAD_STOCK, 
  INITIAL_CHEMICALS 
} from "@/data/storesData";
import { 
  X, 
  Boxes, 
  FlaskConical, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ClipboardCheck, 
  Plus 
} from "lucide-react";

interface StoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}

export default function StoresModal({ isOpen, onClose, onLogAudit }: StoresModalProps) {
  const [activeTab, setActiveTab] = useState<"EQUIPMENT" | "CHEMICALS">("EQUIPMENT");
  const [selectedLab, setSelectedLab] = useState<PharmacyLab | "ALL">("ALL");
  const [equipmentList, setEquipmentList] = useState<DeadStockItem[]>(INITIAL_DEAD_STOCK);
  const [chemicals, setChemicals] = useState<ScheduledChemicalItem[]>(INITIAL_CHEMICALS);

  if (!isOpen) return null;

  const filteredEquipment = selectedLab === "ALL" 
    ? equipmentList 
    : equipmentList.filter((e) => e.lab === selectedLab);

  const totalDeadStockValuation = equipmentList.reduce((acc, curr) => acc + (curr.costInr * curr.quantity), 0);
  const criticalChemicalAlerts = chemicals.filter((c) => c.currentStockGrams <= c.minimumThresholdGrams);

  const handleAuditVerification = () => {
    onLogAudit(
      "STORES_DEADSTOCK_VERIFIED",
      `Physical Stock Verification logged: ${equipmentList.length} Capital Equipment Items (Valuation: ₹${totalDeadStockValuation.toLocaleString("en-IN")}) & ${chemicals.length} Scheduled Chemicals verified`
    );
    alert("Physical Stock verification completed & cryptographically hashed into ledger.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Pharmacy Stores & Lab Procurement Cell
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                PCI SIF-E Appendix • Statutory Dead Stock
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Capital Equipment Dead Stock & Scheduled Poison Register
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Control Bar */}
        <div className="border-b border-slate-800 px-6 py-3 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("EQUIPMENT")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === "EQUIPMENT"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" /> Lab Equipment Dead Stock
            </button>
            <button
              onClick={() => setActiveTab("CHEMICALS")}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === "CHEMICALS"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" /> Scheduled Poison / Solvent Log
            </button>
          </div>

          <div className="flex items-center gap-3">
            {criticalChemicalAlerts.length > 0 && (
              <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" /> {criticalChemicalAlerts.length} Chemicals Under Reorder Level
              </span>
            )}
            <button
              onClick={handleAuditVerification}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 text-xs shadow-sm transition"
            >
              <ClipboardCheck className="w-3.5 h-3.5" /> Audit & Sign Stock
            </button>
          </div>
        </div>

        {/* Equipment Tab Content */}
        {activeTab === "EQUIPMENT" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Lab Filter */}
            <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 text-xs overflow-x-auto">
              <span className="text-slate-400 font-medium">Filter Lab:</span>
              {(["ALL", "PHARMACEUTICS", "PHARM_CHEMISTRY", "PHARMACOLOGY", "PHARMACOGNOSY"] as const).map((lab) => (
                <button
                  key={lab}
                  onClick={() => setSelectedLab(lab)}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] transition ${
                    selectedLab === lab
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {lab}
                </button>
              ))}
            </div>

            {/* Equipment Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-mono">
                    <th className="pb-3">Dead Stock No</th>
                    <th className="pb-3">Equipment / Apparatus</th>
                    <th className="pb-3">Laboratory</th>
                    <th className="pb-3">Make & Model</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Cost (₹)</th>
                    <th className="pb-3 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 font-mono text-amber-400 font-semibold">{eq.itemCode}</td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-200">{eq.equipmentName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">PO: {eq.poNumber} • {eq.purchaseDate}</div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {eq.lab}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{eq.makeModel}</td>
                      <td className="py-3 text-center font-mono font-bold text-slate-200">{eq.quantity}</td>
                      <td className="py-3 text-right font-mono font-semibold text-slate-100">
                        ₹ {eq.costInr.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {eq.workingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Chemicals Tab Content */}
        {activeTab === "CHEMICALS" && (
          <div className="flex-1 overflow-y-auto p-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-mono">
                  <th className="pb-3">Chemical Reagent</th>
                  <th className="pb-3">CAS Number</th>
                  <th className="pb-3">Grade</th>
                  <th className="pb-3">Storage Safe</th>
                  <th className="pb-3 text-center">Current Stock</th>
                  <th className="pb-3 text-center">Reorder Threshold</th>
                  <th className="pb-3 text-right">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {chemicals.map((ch) => {
                  const isDepleted = ch.currentStockGrams <= ch.minimumThresholdGrams;
                  return (
                    <tr key={ch.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          {ch.isDangerousDrug && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                          {ch.chemicalName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{ch.id}</div>
                      </td>
                      <td className="py-3 font-mono text-slate-400">{ch.casNumber}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {ch.grade}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">
                        {ch.storageCondition}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-slate-200">
                        {ch.currentStockGrams} g/mL
                      </td>
                      <td className="py-3 text-center font-mono text-slate-400">
                        {ch.minimumThresholdGrams} g/mL
                      </td>
                      <td className="py-3 text-right">
                        {isDepleted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            REORDER REQUIRED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            IN QUOTA
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-3 bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Total Capital Dead Stock Valuation: <span className="font-mono text-slate-200 font-bold ml-1">₹ {totalDeadStockValuation.toLocaleString("en-IN")}</span>
          </div>
          <div className="text-slate-400 font-mono">
            PCI SIF-E Norm 12 Compliant • Store Superintendent Signed
          </div>
        </div>
      </div>
    </div>
  );
}
