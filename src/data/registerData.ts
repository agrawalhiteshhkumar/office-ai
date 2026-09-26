export interface InwardOutwardRecord {
  id: string;
  type: "INWARD" | "OUTWARD";
  referenceNumber: string; // Statutory or Office Ref No
  letterDate: string;
  receivedOrSentDate: string;
  senderOrRecipient: string; // e.g. "Secretary, MSBTE Mumbai" or "Director, DTE Mumbai"
  subject: string;
  category: "STATUTORY_MSBTE" | "STATUTORY_PCI" | "DTE_CIRCULAR" | "SCHOLARSHIP_MAHADBT" | "UNIVERSITY_AFFILIATION" | "GENERAL_ADMIN";
  assignedSection: string; // Section ID
  status: "RECEIVED" | "UNDER_NOTING" | "SANCTIONED" | "DISPATCHED" | "FILED";
  fileNumber: string; // Institutional filing shelf index
}

export const INITIAL_REGISTERS: InwardOutwardRecord[] = [
  {
    id: "INW-2026-001",
    type: "INWARD",
    referenceNumber: "MSBTE/D-50/Exam/2026/142",
    letterDate: "2026-09-15",
    receivedOrSentDate: "2026-09-18",
    senderOrRecipient: "Secretary, MSBTE Regional Office, Pune",
    subject: "Submission of Sessional Marks & Practical Exam Scheduling for Winter 2026",
    category: "STATUTORY_MSBTE",
    assignedSection: "EXAM_CELL",
    status: "UNDER_NOTING",
    fileNumber: "DPKCOP/EXAM/W26/VOL-I",
  },
  {
    id: "OUT-2026-089",
    type: "OUTWARD",
    referenceNumber: "DPKCOP/PCI/SIF-E/2026-27/412",
    letterDate: "2026-09-22",
    receivedOrSentDate: "2026-09-22",
    senderOrRecipient: "The Member Secretary, Pharmacy Council of India, New Delhi",
    subject: "Compliance report regarding PCI SIF-E Physical Verification and Faculty Cadre Ratio",
    category: "STATUTORY_PCI",
    assignedSection: "PRINCIPAL_DESK",
    status: "DISPATCHED",
    fileNumber: "DPKCOP/GOV/PCI/2026",
  },
  {
    id: "INW-2026-002",
    type: "INWARD",
    referenceNumber: "DTE/Desk-3/Cadre-Roster/2026/889",
    letterDate: "2026-09-20",
    receivedOrSentDate: "2026-09-24",
    senderOrRecipient: "Joint Director, Technical Education Regional Office, Nashik",
    subject: "Final verification of Teaching & Non-Teaching 100-Point Roster validation",
    category: "DTE_CIRCULAR",
    assignedSection: "ESTABLISHMENT",
    status: "UNDER_NOTING",
    fileNumber: "DPKCOP/EST/ROSTER/2026",
  },
];
