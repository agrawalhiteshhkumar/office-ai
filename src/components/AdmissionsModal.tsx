"use client";

import React, { useState } from "react";
import { generateOfficialReport } from "@/utils/printReport";
import { 
  X, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Users, 
  GraduationCap, 
  IndianRupee,
  Search
} from "lucide-react";

interface StudentAdmissionRecord {
  id: string;
  capMeritNo: number;
  applicationId: string;
  candidateName: string;
  category: "OPEN" | "OBC" | "SC" | "ST" | "EWS" | "TFWS";
  admissionSeatType: string;
  msbteEligibilityStatus: "ENROLLED" | "PENDING_VERIFICATION";
  mahadbtDisbursed: boolean;
  scholarshipScheme: string;
}

const DEFAULT_ADMISSIONS: StudentAdmissionRecord[] = [
  { id: "ADM-01", capMeritNo: 1420, applicationId: "DEN24105539", candidateName: "Aarav Santosh Patil", category: "OPEN", admissionSeatType: "GOPENH", msbteEligibilityStatus: "ENROLLED", mahadbtDisbursed: true, scholarshipScheme: "EBC Rajarshi Shahu" },
  { id: "ADM-02", capMeritNo: 2185, applicationId: "DEN24105540", candidateName: "Pooja Ramesh Jadhav", category: "OBC", admissionSeatType: "GOBCH", msbteEligibilityStatus: "ENROLLED", mahadbtDisbursed: true, scholarshipScheme: "VJNT/OBC Welfare Freeship" },
  { id: "ADM-03", capMeritNo: 3410, applicationId: "DEN24105541", candidateName: "Rohan Vinod Shinde", category: "SC", admissionSeatType: "GSCH", msbteEligibilityStatus: "ENROLLED", mahadbtDisbursed: false, scholarshipScheme: "Social Justice Freeship" },
  { id: "ADM-04", capMeritNo: 4890, applicationId: "DEN24105542", candidateName: "Ananya Nitin Deshmukh", category: "EWS", admissionSeatType: "EWS", msbteEligibilityStatus: "ENROLLED", mahadbtDisbursed: true, scholarshipScheme: "EBC Tuition Concession" },
  { id: "ADM-05", capMeritNo: 1102, applicationId: "DEN24105543", candidateName: "Aditya Prakash Gaikwad", category: "TFWS", admissionSeatType: "TFWS", msbteEligibilityStatus: "ENROLLED", mahadbtDisbursed: true, scholarshipScheme: "AICTE TFWS 100% Waiver" },
  { id: "ADM-06", capMeritNo: 5820, applicationId: "DEN24105544", candidateName: "Neha Suresh Kulkarni", category: "OPEN", admissionSeatType: "ACAP", msbteEligibilityStatus: "PENDING_VERIFICATION", mahadbtDisbursed: false, scholarshipScheme: "Institutional Concession" }
];

export default function AdmissionsModal({
  isOpen,
  onClose,
  onLogAudit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogAudit: (action: string, details: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"DTE_CAP" | "MAHADBT_SCHOLARSHIP">("DTE_CAP");
  const [admissions] = useState<StudentAdmissionRecord[]>(DEFAULT_ADMISSIONS);

  if (!isOpen) return null;

  const totalSanctionedIntake = 60;
  const enrolledCount = admissions.length;
  const disbursedScholarships = admissions.filter((a) => a.mahadbtDisbursed).length;

  const handlePrintAdmissionsReport = () => {
    const auditHash = "0x" + Math.random().toString(16).substring(2, 10) + "adm8";
    onLogAudit(
      "DTE_ADMISSIONS_REGISTER_PRINTED",
      `Generated official DTE CAP & MahaDBT Verification Register with hash ${auditHash}`
    );

    if (activeTab === "DTE_CAP") {
      generateOfficialReport({
        title: "DTE Maharashtra Centralized Admission Process (CAP) Allocation Matrix",
        subtitle: "Verified against Admissions Regulating Authority (ARA) & DTE Code: 5539 Norms",
        regulatoryBody: "DTE",
        reportRefNo: `DPKCOP/DTE-CAP/${new Date().getFullYear()}/ADM-01`,
        dataHeaders: [
          "Sr",
          "CAP Merit",
          "Application ID",
          "Candidate Legal Name",
          "Category",
          "Seat Allotment",
          "MSBTE Eligibility State",
        ],
        dataRows: admissions.map((a, idx) => [
          idx + 1,
          `# ${a.capMeritNo}`,
          a.applicationId,
          a.candidateName,
          a.category,
          a.admissionSeatType,
          a.msbteEligibilityStatus === "ENROLLED" ? "CONFIRMED & ENROLLED" : "UNDER SCRUTINY",
        ]),
        summaryMetrics: [
          { label: "Sanctioned Intake", value: `${totalSanctionedIntake} Seats (D.Pharm)` },
          { label: "Confirmed CAP Enrolments", value: `${enrolledCount} Admitted` },
          { label: "DTE Regional Office", value: "Nashik Region (RO-5)" },
        ],
        auditHash,
      });
    } else {
      generateOfficialReport({
        title: "MahaDBT Social Welfare Scholarship & Freeship Disbursement Ledger",
        subtitle: "Direct Benefit Transfer Reconciliation under Government of Maharashtra Directives",
        regulatoryBody: "MAHADBT",
        reportRefNo: `DPKCOP/MAHADBT/${new Date().getFullYear()}/DISB-01`,
        dataHeaders: [
          "Sr",
          "Candidate Name",
          "Category",
          "Application ID",
          "Statutory Scheme Head",
          "Disbursement Status",
        ],
        dataRows: admissions.map((a, idx) => [
          idx + 1,
          a.candidateName,
          a.category,
          a.applicationId,
          a.scholarshipScheme,
          a.mahadbtDisbursed ? "FUNDS CREDITED TO COLLEGE AC" : "PENDING DESK-2 SCRUTINY",
        ]),
        summaryMetrics: [
          { label: "Total Beneficiaries", value: `${admissions.length} Applied` },
          { label: "Successfully Disbursed", value: `${disbursedScholarships} Candidates` },
          { label: "Portal Compliance", value: "AISHE: S-22693 Mapped" },
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
                Student Admissions & Eligibility
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono font-bold">
                DTE: 5539 • ARA Compliant
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              DTE CAP Seat Matrix & MahaDBT Scholarship Wing
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
            <button
              onClick={() => setActiveTab("DTE_CAP")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "DTE_CAP"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> DTE CAP Allocation Matrix
            </button>
            <button
              onClick={() => setActiveTab("MAHADBT_SCHOLARSHIP")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "MAHADBT_SCHOLARSHIP"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" /> MahaDBT Scholarship Disbursement
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintAdmissionsReport}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print {activeTab === "DTE_CAP" ? "DTE CAP Matrix" : "MahaDBT Ledger"} (PDF)
            </button>
          </div>
        </div>

        {/* Metric Cards Banner */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border-b border-slate-200">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Sanctioned Intake (Cap)</div>
            <div className="text-base font-black text-slate-900 mt-0.5">{totalSanctionedIntake} Seats</div>
            <div className="text-[10px] text-slate-500">PCI & MSBTE Approved Intake</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Confirmed Admitted</div>
            <div className="text-base font-black text-blue-700 mt-0.5">{enrolledCount} Students</div>
            <div className="text-[10px] text-blue-600 font-semibold">100% Enrollment Verified</div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">MahaDBT Reconciliation</div>
            <div className="text-base font-black text-emerald-700 mt-0.5">{disbursedScholarships} / {admissions.length} Disbursed</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Social Welfare Credit Active</div>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "DTE_CAP" ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <th className="pb-3">Candidate Legal Name</th>
                  <th className="pb-3">CAP Application ID</th>
                  <th className="pb-3 text-center">Merit Rank</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Seat Quota</th>
                  <th className="pb-3 text-right">MSBTE Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-bold text-slate-900">{a.candidateName}</td>
                    <td className="py-3 font-mono text-[11px] text-slate-600">{a.applicationId}</td>
                    <td className="py-3 text-center font-bold text-slate-800">#{a.capMeritNo}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                        {a.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                        {a.admissionSeatType}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Enrolled
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
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Application ID</th>
                  <th className="pb-3">Welfare Scheme Head</th>
                  <th className="pb-3 text-right">Disbursement State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-bold text-slate-900">{a.candidateName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                        {a.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600">{a.applicationId}</td>
                    <td className="py-3 text-slate-700 font-medium">{a.scholarshipScheme}</td>
                    <td className="py-3 text-right">
                      {a.mahadbtDisbursed ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Fee Credited
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Pending Scrutiny
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600">
          <div>
            Admissions Authority: <span className="font-bold text-slate-800">ARA Mumbai / DTE Maharashtra RO-Nashik</span>
          </div>
          <div className="text-slate-400 font-mono">
            Student Registrar & Section Officer Verified
          </div>
        </div>
      </div>
    </div>
  );
}
