"use client";

import React, { useState, useEffect } from "react";
import { 
  DPKCOP_PROFILE, 
  ADMINISTRATIVE_SECTIONS, 
  AdministrativeSection,
  AuditRecord 
} from "@/data/officeData";
import { INITIAL_REGISTERS, InwardOutwardRecord } from "@/data/registerData";
import RegisterModal from "@/components/RegisterModal";
import AIIntelligenceModal from "@/components/AIIntelligenceModal";
import ExamCellModal from "@/components/ExamCellModal";
import CadreRosterModal from "@/components/CadreRosterModal";
import FRAModal from "@/components/FRAModal";
import StoresModal from "@/components/StoresModal";
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Layers, 
  History, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ExternalLink, 
  BookOpen, 
  Cpu,
  GraduationCap,
  Users,
  IndianRupee,
  Boxes
} from "lucide-react";

export default function OfficeAIDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<AdministrativeSection>(ADMINISTRATIVE_SECTIONS[0]);
  const [auditTrail, setAuditTrail] = useState<AuditRecord[]>([]);
  const [operatorName] = useState("Administrative Officer");
  const [registers, setRegisters] = useState<InwardOutwardRecord[]>(INITIAL_REGISTERS);
  
  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isCadreModalOpen, setIsCadreModalOpen] = useState(false);
  const [isFRAModalOpen, setIsFRAModalOpen] = useState(false);
  const [isStoresModalOpen, setIsStoresModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialLog: AuditRecord = {
      id: "LOG-INIT-01",
      timestamp: new Date().toLocaleTimeString(),
      sectionCode: ADMINISTRATIVE_SECTIONS[0].code,
      actor: "Administrative Officer",
      action: "DESK_SESSION_INITIALIZED",
      details: `Active desk switched to ${ADMINISTRATIVE_SECTIONS[0].displayName} under ${DPKCOP_PROFILE.shortName}`,
      hash: "0x8f2a49b9c9e",
    };
    setAuditTrail([initialLog]);
  }, []);

  const switchDesk = (section: AdministrativeSection) => {
    setActiveSection(section);
    const newEntry: AuditRecord = {
      id: "LOG-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      sectionCode: section.code,
      actor: operatorName,
      action: "DELEGATED_CAPACITY_SWITCH",
      details: `Transferred operational hat to: ${section.displayName} (${section.deskTitle})`,
      hash: "0x" + Math.random().toString(16).substring(2, 10),
    };
    setAuditTrail((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  const handleAddRecord = (record: InwardOutwardRecord) => {
    setRegisters((prev) => [record, ...prev]);
    const auditRecord: AuditRecord = {
      id: "LOG-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      sectionCode: activeSection.code,
      actor: operatorName,
      action: record.type === "INWARD" ? "REGULATORY_INWARD_ENTRY" : "REGULATORY_OUTWARD_DISPATCH",
      details: `Logged ${record.referenceNumber} (${record.subject.substring(0, 35)}...)`,
      hash: "0x" + Math.random().toString(16).substring(2, 10) + "f41",
    };
    setAuditTrail((prev) => [auditRecord, ...prev.slice(0, 9)]);
  };

  const handleAuditLog = (action: string, details: string) => {
    const auditRecord: AuditRecord = {
      id: "LOG-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      sectionCode: activeSection.code,
      actor: operatorName,
      action: action,
      details: details,
      hash: "0x" + Math.random().toString(16).substring(2, 10) + "ae3",
    };
    setAuditTrail((prev) => [auditRecord, ...prev.slice(0, 9)]);
  };

  const handleLaunchMandate = (mandateText: string) => {
    const lower = mandateText.toLowerCase();
    if (activeSection.code === "EXAM_CELL" || lower.includes("sessional") || lower.includes("exam")) {
      setIsExamModalOpen(true);
    } else if (activeSection.code === "ESTABLISHMENT" || lower.includes("teacher") || lower.includes("roster") || lower.includes("staff")) {
      setIsCadreModalOpen(true);
    } else if (activeSection.code === "ACCOUNTS" || lower.includes("fee") || lower.includes("fra") || lower.includes("ffc") || lower.includes("audit")) {
      setIsFRAModalOpen(true);
    } else if (activeSection.code === "PHARMACY_STORES" || lower.includes("stock") || lower.includes("chemical") || lower.includes("procure") || lower.includes("dead stock")) {
      setIsStoresModalOpen(true);
    } else {
      setIsRegisterOpen(true);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">
        Initializing Office AI™ Secure Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">OFFICE AI™</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Institutional OS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {DPKCOP_PROFILE.legalName} • <span className="text-slate-300 font-medium">MSBTE: {DPKCOP_PROFILE.statutoryCodes.msbte}</span> | DTE: {DPKCOP_PROFILE.statutoryCodes.dte} | PCI: {DPKCOP_PROFILE.statutoryCodes.pci}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsStoresModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Boxes className="w-3.5 h-3.5" /> Stores & Dead Stock
          </button>
          <button
            onClick={() => setIsFRAModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <IndianRupee className="w-3.5 h-3.5" /> FFC & FRA Fee Desk
          </button>
          <button
            onClick={() => setIsCadreModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Users className="w-3.5 h-3.5" /> PCI Cadre Roster
          </button>
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <GraduationCap className="w-3.5 h-3.5" /> MSBTE Exam Cell
          </button>
          <button
            onClick={() => setIsAIOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5" /> Statutory Circular AI
          </button>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Central Despatch
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
            AO
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Administrative Desks
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              6 Sections
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {ADMINISTRATIVE_SECTIONS.map((section) => {
              const isActive = section.id === activeSection.id;
              return (
                <button
                  key={section.id}
                  onClick={() => switchDesk(section)}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                    isActive
                      ? "bg-amber-500/10 border-amber-500/40 shadow-sm shadow-amber-500/10"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isActive ? "text-amber-300" : "text-slate-300"}`}>
                      {section.displayName}
                    </span>
                    {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{section.deskTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col gap-2">
            <div className="text-[11px] font-semibold text-slate-300">Regulatory Frameworks</div>
            <div className="flex flex-wrap gap-1.5">
              {["MSBTE Norms", "PCI SIF-E", "FFC Proposal", "FRA Proposal", "MahaDBT"].map((badge) => (
                <span key={badge} className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Active Desk Operations */}
        <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Desk Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Active Institutional Capacity
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{activeSection.displayName}</h2>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">{activeSection.description}</p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 min-w-[210px]">
                <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Assigned Desk Role</div>
                <div className="font-semibold text-amber-300">{activeSection.deskTitle}</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Delegated Authority Active
                </div>
              </div>
            </div>
          </div>

          {/* Mandates */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> Operational Mandates & Workflows
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {activeSection.primaryMandates.map((mandate, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">MANDATE 0{idx + 1}</span>
                    <h4 className="text-sm font-semibold text-slate-200 mt-1">{mandate}</h4>
                  </div>
                  <button 
                    onClick={() => handleLaunchMandate(mandate)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 self-start"
                  >
                    Launch Register <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Ledger */}
          <div className="border border-slate-800 rounded-2xl bg-slate-900/40 p-5 mt-2">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  Tamper-Evident Governance Audit Ledger
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Append-Only • Hash Chained
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">Log ID</th>
                    <th className="pb-2 font-medium">Timestamp</th>
                    <th className="pb-2 font-medium">Actor</th>
                    <th className="pb-2 font-medium">Action</th>
                    <th className="pb-2 font-medium">Details</th>
                    <th className="pb-2 font-medium font-mono text-right">Ledger Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditTrail.map((record) => (
                    <tr key={record.id} className="text-slate-300">
                      <td className="py-2.5 font-mono text-slate-400">{record.id}</td>
                      <td className="py-2.5 text-slate-400">{record.timestamp}</td>
                      <td className="py-2.5 font-medium text-slate-200">{record.actor}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-300">
                          {record.action}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400 max-w-xs truncate">{record.details}</td>
                      <td className="py-2.5 font-mono text-[11px] text-emerald-400 text-right">{record.hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Registers Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        sectionCode={activeSection.code}
        sectionName={activeSection.displayName}
        records={registers}
        onAddRecord={handleAddRecord}
      />

      {/* AI Intelligence Modal */}
      <AIIntelligenceModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onLogAudit={handleAuditLog}
      />

      {/* MSBTE Exam Cell Modal */}
      <ExamCellModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onLogAudit={handleAuditLog}
      />

      {/* PCI Cadre Roster Modal */}
      <CadreRosterModal
        isOpen={isCadreModalOpen}
        onClose={() => setIsCadreModalOpen(false)}
        onLogAudit={handleAuditLog}
      />

      {/* Dual FFC & FRA Fee Proposal Modal */}
      <FRAModal
        isOpen={isFRAModalOpen}
        onClose={() => setIsFRAModalOpen(false)}
        onLogAudit={handleAuditLog}
      />

      {/* Pharmacy Stores & Dead Stock Modal */}
      <StoresModal
        isOpen={isStoresModalOpen}
        onClose={() => setIsStoresModalOpen(false)}
        onLogAudit={handleAuditLog}
      />
    </div>
  );
}
