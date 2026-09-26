"use client";

import React, { useState } from "react";
import { InwardOutwardRecord } from "@/data/registerData";
import { X, Send, Inbox, Plus, Check, ShieldAlert } from "lucide-react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionCode: string;
  sectionName: string;
  records: InwardOutwardRecord[];
  onAddRecord: (record: InwardOutwardRecord) => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  sectionCode,
  sectionName,
  records,
  onAddRecord,
}: RegisterModalProps) {
  const [activeTab, setActiveTab] = useState<"VIEW" | "ADD">("VIEW");
  const [filterType, setFilterType] = useState<"ALL" | "INWARD" | "OUTWARD">("ALL");

  // Form State
  const [recordType, setRecordType] = useState<"INWARD" | "OUTWARD">("INWARD");
  const [refNo, setRefNo] = useState("");
  const [senderRecipient, setSenderRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<InwardOutwardRecord["category"]>("STATUTORY_MSBTE");
  const [fileNumber, setFileNumber] = useState("");

  if (!isOpen) return null;

  const filtered = records.filter((r) => {
    if (filterType !== "ALL" && r.type !== filterType) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refNo || !subject || !senderRecipient) return;

    const newRecord: InwardOutwardRecord = {
      id: (recordType === "INWARD" ? "INW-" : "OUT-") + "2026-" + Math.floor(100 + Math.random() * 900),
      type: recordType,
      referenceNumber: refNo,
      letterDate: new Date().toISOString().split("T")[0],
      receivedOrSentDate: new Date().toISOString().split("T")[0],
      senderOrRecipient: senderRecipient,
      subject: subject,
      category: category,
      assignedSection: sectionCode,
      status: recordType === "INWARD" ? "RECEIVED" : "DISPATCHED",
      fileNumber: fileNumber || `DPKCOP/${sectionCode}/2026/VOL-I`,
    };

    onAddRecord(newRecord);
    setActiveTab("VIEW");
    setRefNo("");
    setSenderRecipient("");
    setSubject("");
    setFileNumber("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Institutional Central Dispatch Desk
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {sectionName}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Inward & Outward Regulatory Registers
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="border-b border-slate-800 px-6 py-2.5 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("VIEW")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "VIEW"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Registered Entries ({records.length})
            </button>
            <button
              onClick={() => setActiveTab("ADD")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "ADD"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> New Entry Entry / Dispatch
            </button>
          </div>

          {activeTab === "VIEW" && (
            <div className="flex items-center gap-1 text-xs">
              {(["ALL", "INWARD", "OUTWARD"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    filterType === t
                      ? "bg-slate-800 text-white font-bold"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "VIEW" ? (
            <div className="flex flex-col gap-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No register entries recorded under this criteria.
                </div>
              ) : (
                filtered.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          r.type === "INWARD"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {r.type === "INWARD" ? <Inbox className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-white">{r.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {r.referenceNumber}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                            {r.fileNumber}
                          </span>
                        </div>
                        <h4 className="text-xs font-medium text-slate-200 mt-1">{r.subject}</h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {r.type === "INWARD" ? "From: " : "To: "}
                          <span className="text-slate-300 font-medium">{r.senderOrRecipient}</span> • Date: {r.letterDate}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300">
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">Record Classification</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRecordType("INWARD")}
                    className={`py-2 rounded-lg border text-center font-semibold transition ${
                      recordType === "INWARD"
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                        : "border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Inward Entry (Received)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecordType("OUTWARD")}
                    className={`py-2 rounded-lg border text-center font-semibold transition ${
                      recordType === "OUTWARD"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Outward Dispatch (Sent)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">Regulatory Framework / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="STATUTORY_MSBTE">MSBTE (Board Circular / Exam / Affiliation)</option>
                  <option value="STATUTORY_PCI">PCI (Pharmacy Council of India / SIF)</option>
                  <option value="DTE_CIRCULAR">DTE Maharashtra / Joint Director</option>
                  <option value="SCHOLARSHIP_MAHADBT">MahaDBT / Samaj Kalyan Scholarship</option>
                  <option value="GENERAL_ADMIN">Institutional Internal Administrative Order</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">
                  {recordType === "INWARD" ? "External Reference / Letter Number" : "Office Dispatch Reference Number"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSBTE/RO/2026/782 or DPKCOP/PCI/2026/102"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">
                  {recordType === "INWARD" ? "Received From (Sender Authority)" : "Dispatched To (Recipient)"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Secretary MSBTE Mumbai or Director DTE"
                  value={senderRecipient}
                  onChange={(e) => setSenderRecipient(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-slate-400 font-medium">Subject / Matter of Correspondence</label>
                <input
                  type="text"
                  required
                  placeholder="Enter detailed subject of letter..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-slate-400 font-medium">Institutional File Shelf Number</label>
                <input
                  type="text"
                  placeholder={`e.g. DPKCOP/${sectionCode}/2026/VOL-I`}
                  value={fileNumber}
                  onChange={(e) => setFileNumber(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="md:col-span-2 pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("VIEW")}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Check className="w-3.5 h-3.5" /> Commit to Register
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
