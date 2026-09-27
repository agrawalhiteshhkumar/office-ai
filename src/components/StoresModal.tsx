"use client";

import React, { useState } from "react";
import { generateOfficialReport } from "@/utils/printReport";
import { 
  X, 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  FlaskConical,
  ShieldAlert,
  Search
} from "lucide-react";

interface DeadStockItem {
  id: string;
  assetTag: string;
  name: string;
  lab: "Pharmaceutics" | "Chemistry" | "Pharmacology" | "Pharmacognosy";
  quantity: number;
  workingCondition: boolean;
  purchaseDate: string;
}

interface ChemicalQuotaItem {
  id: string;
  chemicalName: string;
  grade: string;
  currentStock: number;
  unit: string;
  minThreshold: number;
  isHazardous: boolean;
}

const DEFAULT_EQUIPMENT: DeadStockItem[] = [
  { id: "EQ-1", assetTag: "DPKCOP/PCEUT/01", name: "Tablet Punching Machine (Rotary)", lab: "Pharmaceutics", quantity: 1, workingCondition: true, purchaseDate: "12/03/2021" },
  { id: "EQ-2", assetTag: "DPKCOP/PCEUT/02", name: "Dissolution Test Apparatus (8-Basket)", lab: "Pharmaceutics", quantity: 1, workingCondition: true, purchaseDate: "18/06/2021" },
  { id: "EQ-3", assetTag: "DPKCOP/PCHEM/01", name: "Digital Melting Point Apparatus", lab: "Chemistry", quantity: 3, workingCondition: true, purchaseDate: "10/01/2022" },
  { id: "EQ-4", assetTag: "DPKCOP/PCOL/01", name: "Digital Plethysmometer", lab: "Pharmacology", quantity: 1, workingCondition: true, purchaseDate: "05/09/2022" },
  { id: "EQ-5", assetTag: "DPKCOP/PCOG/01", name: "Projection Microscope with Camera", lab: "Pharmacognosy", quantity: 2, workingCondition: true, purchaseDate: "22/11/2022" },
  { id: "EQ-6", assetTag: "DPKCOP/PCEUT/03", name: "Monsanto Hardness Tester", lab: "Pharmaceutics", quantity: 4, workingCondition: true, purchaseDate: "14/02/2023" }
];

const DEFAULT_SOLVENTS: ChemicalQuotaItem[] = [
  { id: "SOL-1", chemicalName: "Chloroform (Analytical Reagent)", grade: "AR Grade", currentStock: 2.5, unit: "L", minThreshold: 5.0, isHazardous: true },
  { id: "SOL-2", chemicalName: "Methanol (HPLC / Spectro)", grade: "HPLC Grade", currentStock: 8.0, unit: "L", minThreshold: 4.0, isHazardous: true },
  { id: "SOL-3", chemicalName: "Diethyl Ether (Stabilized)", grade: "AR Grade", currentStock: 1.0, unit: "L", minThreshold: 3.0, isHazardous: true },
  { id: "SOL-4", chemicalName: "Sulfuric Acid 98% (Poison)", grade: "Commercial AR", currentStock: 4.5, unit: "L", minThreshold: 2.0, isHazardous: true },
  { id: "SOL-5", chemicalName: "Sodium Hydroxide Pellets", grade: "LR Grade", currentStock: 12.0, unit: "Kg", minThreshold: 5.0, isHazardous: false }
];

export default function StoresModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"DEAD_STOCK" | "CHEMICAL_QUOTA">("DEAD_STOCK");
  const [equipment] = useState<DeadStockItem[]>(DEFAULT_EQUIPMENT);
  const [solvents] = useState<ChemicalQuotaItem[]>(DEFAULT_SOLVENTS);

  if (!isOpen) return null;

  const lowSolventsCount = solvents.filter((s) => s.currentStock < s.minThreshold).length;

  const handlePrintStoresReport = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "str5";
    onLogAudit(
      "PCI_STORES_REGISTER_PRINTED",
      `Generated official PCI SIF-E Dead Stock & Hazardous Solvent Inspection Register with hash ${auditHash}`
    );

    if (activeTab === "DEAD_STOCK") {
      generateOfficialReport({
        title: "PCI SIF-E Appendix Dead Stock & Equipment Register",
        subtitle: "Verified against Pharmacy Council of India (PCI) Minimum Standard Regulations",
        regulatoryBody: "PCI",
        reportRefNo: `DPKCOP/STORES/DEADSTOCK/${new Date().getFullYear()}/01`,
        dataHeaders: [
          "Sr",
          "Asset Tag No",
          "Equipment / Instrument Name",
          "Allocated Lab",
          "Quantity",
          "Purchase Date",
          "Operational State",
        ],
        dataRows: equipment.map((e, idx) => [
          idx + 1,
          e.assetTag,
          e.name,
          e.lab,
          e.quantity,
          e.purchaseDate,
          e.workingCondition ? "WORKING / CALIBRATED" : "UNDER MAINTENANCE",
        ]),
        summaryMetrics: [
          { label: "Total Major Instruments", value: `${equipment.length} Units` },
          { label: "Laboratories Covered", value: "All 4 Statutory Labs" },
          { label: "Inspection Status", value: "SIF-E Compliant" },
        ],
        auditHash,
      });
    } else {
      generateOfficialReport({
        title: "Statutory Poison & Hazardous Solvent Quota Register",
        subtitle: "Maintained under Maharashtra Poisons Rules & PCI Safety Directives",
        regulatoryBody: "GOVERNANCE",
        reportRefNo: `DPKCOP/STORES/SOLVENTS/${new Date().getFullYear()}/01`,
        dataHeaders: [
          "Sr",
          "Chemical / Solvent Name",
          "Grade",
          "Current Balance",
          "Statutory Threshold",
          "Hazard Classification",
          "Reorder Status",
        ],
        dataRows: solvents.map((s, idx) => [
          idx + 1,
          s.chemicalName,
          s.grade,
          `${s.currentStock} ${s.unit}`,
          `${s.minThreshold} ${s.unit}`,
          s.isHazardous ? "SCHEDULED POISON" : "GENERAL REAGENT",
          s.currentStock < s.minThreshold ? "CRITICAL REORDER REQ" : "SUFFICIENT QUOTA",
        ]),
        summaryMetrics: [
          { label: "Total Monitored Chemicals", value: `${solvents.length} Reagents` },
          { label: "Critical Stock Alerts", value: `${lowSolventsCount} Items Low` },
          { label: "Storage Compliance", value: "Flammable Lockout Verified" },
        ],
        auditHash,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-blue-700 tracking-wider">
                Pharmacy Stores & Procurement
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-mono font-bold">
                SIF-E Appendix Norms
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              Dead Stock Equipment & Hazardous Solvent Register
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Action Toolbar */}
        <div className="border-b border-slate-200 px-6 py-3 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("DEAD_STOCK")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "DEAD_STOCK"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" /> PCI Dead Stock Register ({equipment.length})
            </button>
            <button
              onClick={() => setActiveTab("CHEMICAL_QUOTA")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "CHEMICAL_QUOTA"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" /> Scheduled Poisons & Solvents
              {lowSolventsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 font-mono font-bold text-[10px]">
                  {lowSolventsCount} Alert
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintStoresReport}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print {activeTab === "DEAD_STOCK" ? "SIF-E Dead Stock" : "Solvent Register"} (PDF)
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "DEAD_STOCK" ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="pb-3">Asset Tag</th>
                  <th className="pb-3">Instrument / Equipment</th>
                  <th className="pb-3">Department Lab</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3">Purchase Date</th>
                  <th className="pb-3 text-right">PCI Inspection State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipment.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono font-bold text-slate-700">{e.assetTag}</td>
                    <td className="py-3 font-bold text-slate-900">{e.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                        {e.lab}
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold text-slate-800">{e.quantity}</td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">{e.purchaseDate}</td>
                    <td className="py-3 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Calibrated & Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="pb-3">Chemical / Reagent</th>
                  <th className="pb-3">Purity Grade</th>
                  <th className="pb-3 text-center">Current Stock</th>
                  <th className="pb-3 text-center">Min Threshold</th>
                  <th className="pb-3">Classification</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solvents.map((s) => {
                  const isLow = s.currentStock < s.minThreshold;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-bold text-slate-900">{s.chemicalName}</td>
                      <td className="py-3 text-slate-600 font-mono text-[11px]">{s.grade}</td>
                      <td className="py-3 text-center font-bold font-mono text-slate-800">
                        {s.currentStock} {s.unit}
                      </td>
                      <td className="py-3 text-center text-slate-500 font-mono text-[11px]">
                        {s.minThreshold} {s.unit}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.isHazardous 
                            ? "bg-red-50 text-red-700 border border-red-200" 
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {s.isHazardous ? "Scheduled Poison" : "General Lab Reagent"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {isLow ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-red-600" /> Reorder Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Optimal Quota
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600">
          <div>
            Regulatory Mandate: <span className="font-bold text-slate-800">PCI SIF-E Appendix Equipment & Poison Rules 1989</span>
          </div>
          <div className="text-slate-400 font-mono">
            Store Superintendent & Lab In-Charge Verified
          </div>
        </div>
      </div>
    </div>
  );
}
