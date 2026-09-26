export interface InstitutionProfile {
  code: string;
  legalName: string;
  shortName: string;
  type: string;
  state: string;
  board: string;
  statutoryCodes: {
    msbte: string;
    dte: string;
    pci: string;
    aishe: string;
  };
}

export interface AdministrativeSection {
  id: string;
  code: string;
  displayName: string;
  deskTitle: string;
  description: string;
  primaryMandates: string[];
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  sectionCode: string;
  actor: string;
  action: string;
  details: string;
  hash: string;
}

export const DPKCOP_PROFILE: InstitutionProfile = {
  code: "DPKCOP_62386",
  legalName: "D. P. Kharde Navjeevan College of Pharmacy",
  shortName: "DPKCOP, Sinnar",
  type: "Diploma in Pharmacy (D.Pharm)",
  state: "Maharashtra",
  board: "MSBTE, Mumbai",
  statutoryCodes: {
    msbte: "62386",
    dte: "5539",
    pci: "9178",
    aishe: "S-22693",
  },
};

export const ADMINISTRATIVE_SECTIONS: AdministrativeSection[] = [
  {
    id: "sec-principal",
    code: "PRINCIPAL_DESK",
    displayName: "Principal Desk",
    deskTitle: "Head of Institution / Executive Authority",
    description: "Executive oversight, statutory sanctions, MSBTE/PCI compliance approvals, and institutional policy.",
    primaryMandates: ["Statutory Submissions", "Staff Approval Ledgers", "Executive Approvals", "Inspection Readiness"],
  },
  {
    id: "sec-establishment",
    code: "ESTABLISHMENT",
    displayName: "Establishment & Service Cell",
    deskTitle: "Superintendent / Establishment In-Charge",
    description: "Faculty service registers, roster verifications, CAS/probation tracking, and DTE/MSBTE teacher approvals.",
    primaryMandates: ["Teacher Profile & Approvals", "Service Book Indexing", "Staff Leave Audits", "Cadre Rosters"],
  },
  {
    id: "sec-student",
    code: "STUDENT_SECTION",
    displayName: "Student Admissions & Eligibility",
    deskTitle: "Student Registrar / Section Officer",
    description: "CAP admissions, MSBTE eligibility lists, scholarship disbursements (MahaDBT), and LC/TC generation.",
    primaryMandates: ["MSBTE Enrolment Tracking", "MahaDBT Scheme Audits", "Bonafide & LC Registers", "Quota Allotments"],
  },
  {
    id: "sec-accounts",
    code: "ACCOUNTS",
    displayName: "Accounts & Finance Wing",
    deskTitle: "Accountant / Finance Officer",
    description: "Fee Regulating Authority (FRA) computations, budget allocations, salary registers, and cash ledgers.",
    primaryMandates: ["FRA Fee Proposal Builder", "Tuition Fee Reconciliation", "Voucher Vetting", "Audit Ledgers"],
  },
  {
    id: "sec-stores",
    code: "STORES",
    displayName: "Pharmacy Stores & Procurement",
    deskTitle: "Store Officer / Lab Superintendent",
    description: "Dead stock registers, consumable chemical procurement, PCI laboratory apparatus norms, and asset tagging.",
    primaryMandates: ["PCI Lab Equipment Checklists", "Dead Stock Verification", "Chemical Reagent Inventory", "Vendor POs"],
  },
  {
    id: "sec-exam",
    code: "EXAM_CELL",
    displayName: "MSBTE Examination Cell",
    deskTitle: "Exam Officer-in-Charge (OIC)",
    description: "MSBTE winter/summer exam operations, sessional exam marks consolidation, hall tickets, and squad logs.",
    primaryMandates: ["Sessional Mark Registers", "MSBTE Exam Fee Rosters", "Detention Audits", "Stationery Balances"],
  },
];
