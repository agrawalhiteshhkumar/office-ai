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
import AdmissionsModal from "@/components/AdmissionsModal";
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
  Boxes,
  UserCheck,
  Crown,
  Mail,
  Phone,
  ShieldAlert
} from "lucide-react";

export default function OfficeAIDashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<AdministrativeSection>(ADMINISTRATIVE_SECTIONS[0]);
  const [auditTrail, setAuditTrail] = useState<AuditRecord[]>([]);
  const [registers, setRegisters] = useState<InwardOutwardRecord[]>(INITIAL_REGISTERS);
  
  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isCadreModalOpen, setIsCadreModalOpen] = useState(false);
  const [isFRAModalOpen, setIsFRAModalOpen] = useState(false);
  const [isStoresModalOpen, setIsStoresModalOpen] = useState(false);
  const [isAdmissionsModalOpen, setIsAdmissionsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialLog: AuditRecord = {
      id: "LOG-INIT-01",
      timestamp: new Date().toLocaleTimeString(),
      sectionCode: ADMINISTRATIVE_SECTIONS[0].code,
      actor: "Dr. Hiteshkumar Agrawal",
      action: "DESK_SESSION_INITIALIZED",
      details: `Active desk initialized at ${ADMINISTRATIVE_SECTIONS[0].displayName} • DPKCOP Sinnar`,
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
      actor: "Dr. Hiteshkumar Agrawal",
      action: "DELEGATED_CAPACITY_SWITCH",
      details: `Switched operational desk to: ${section.displayName} (${section.deskTitle})`,
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
      actor: "Dr. Hiteshkumar Agrawal",
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
      actor: "Dr. Hiteshkumar Agrawal",
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
    } else if (activeSection.code === "STUDENT_ADMISSIONS" || lower.includes("admiss") || lower.includes("eligibility") || lower.includes("cap") || lower.includes("scholarship") || lower.includes("dbt")) {
      setIsAdmissionsModalOpen(true);
    } else {
      setIsRegisterOpen(true);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs">
        Initializing Bright Path Institutional OS...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Top Header - Matching Faculty AI Genie */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-6 py-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-sm shadow-xs">
              BP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">
                  OFFICE AI GENIE™
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 font-mono">
                  v2026.4
                </span>
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                A Product of <span className="font-bold text-blue-600">BrightPath</span>
              </div>
              <div className="text-[9px] font-black tracking-widest text-amber-600 uppercase">
                LEARN. SKILL. SUCCEED.
              </div>
            </div>
          </div>

          {/* Institutional Client Info Right */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-[10px] text-slate-400 font-medium">Provisioned Institutional Client</div>
              <div className="text-xs font-bold text-slate-800">
                D. P. Kharde Navjeevan College of Pharmacy, Sinnar
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                MSBTE: 62386 • DTE: 5539 • PCI: 9178 • AISHE: S-22693
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition">
                <Crown className="w-3.5 h-3.5 text-amber-600" /> SuperAdmin Access
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsAdmissionsModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Admissions & MahaDBT
          </button>
          <button
            onClick={() => setIsStoresModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <Boxes className="w-3.5 h-3.5 text-orange-600" /> Stores & Dead Stock
          </button>
          <button
            onClick={() => setIsFRAModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> FFC & FRA Fee Desk
          </button>
          <button
            onClick={() => setIsCadreModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" /> PCI Cadre Roster
          </button>
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <GraduationCap className="w-3.5 h-3.5 text-violet-600" /> MSBTE Exam Cell
          </button>
          <button
            onClick={() => setIsAIOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 border border-blue-200 transition"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" /> Statutory Circular AI
          </button>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Central Despatch
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 border-r border-slate-200 bg-white p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Administrative Desks
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
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
                  className={`text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isActive ? "text-white" : "text-slate-900"}`}>
                      {section.displayName}
                    </span>
                    {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-[11px] ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                    {section.deskTitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mapped Standards */}
          <div className="mt-auto pt-4 border-t border-slate-200 text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
              Mapped Statutory & Accreditation Standards
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">MSBTE</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">PCI</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">DTE</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Maha-FFC</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">MahaDBT</span>
            </div>
          </div>
        </aside>

        {/* Center Main Work Area */}
        <main className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Active Capacity Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Active Institutional Capacity
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeSection.displayName}</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">{activeSection.description}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs min-w-[240px]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Assigned Desk Role</div>
              <div className="font-bold text-slate-900 text-sm">{activeSection.deskTitle}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Delegated Authority Active
              </div>
            </div>
          </div>

          {/* Operational Mandates */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" /> Operational Mandates & Workflows
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {activeSection.primaryMandates.map((mandate, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-blue-400 p-4 rounded-xl transition shadow-xs flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">MANDATE 0{idx + 1}</span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1 group-hover:text-blue-600 transition">
                      {mandate}
                    </h4>
                  </div>
                  <button 
                    onClick={() => handleLaunchMandate(mandate)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 self-start"
                  >
                    Launch Register <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty AI Genie Official Executive Signature Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Blue Initials Avatar identical to Faculty AI Genie */}
              <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                HA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900">Dr. Hiteshkumar Agrawal</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Signatory Verified
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                  Founder & Chief Academic Architect, Faculty AI Genie™
                </div>
                <div className="text-[11px] text-slate-400">
                  Principal, D. P. Kharde Navjeevan College of Pharmacy, Sinnar
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-xs text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> hiteshhkumar.agrawal@gmail.com
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> +91 9637521852
              </div>
            </div>
          </div>

          {/* Tamper-Evident Governance Audit Ledger */}
          <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Tamper-Evident Governance Audit Ledger
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                Append-Only • Hash Chained
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-2.5">Log ID</th>
                    <th className="pb-2.5">Timestamp</th>
                    <th className="pb-2.5">Actor</th>
                    <th className="pb-2.5">Action</th>
                    <th className="pb-2.5">Details</th>
                    <th className="pb-2.5 font-mono text-right">Ledger Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditTrail.map((record) => (
                    <tr key={record.id} className="text-slate-600 hover:bg-slate-50/80 transition">
                      <td className="py-2.5 font-mono font-medium text-slate-500">{record.id}</td>
                      <td className="py-2.5 text-slate-500">{record.timestamp}</td>
                      <td className="py-2.5 font-bold text-slate-800">{record.actor}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
                          {record.action}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600 max-w-xs truncate">{record.details}</td>
                      <td className="py-2.5 font-mono text-[11px] text-emerald-600 font-semibold text-right">{record.hash}</td>
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

      {/* Student Admissions & MahaDBT Modal */}
      <AdmissionsModal
        isOpen={isAdmissionsModalOpen}
        onClose={() => setIsAdmissionsModalOpen(false)}
        onLogAudit={handleAuditLog}
      />
    </div>
  );
}
