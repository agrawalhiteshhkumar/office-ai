export type FeeAuthority = "FFC" | "FRA";

export interface FeeExpenseHead {
  id: string;
  headName: string;
  category: "SALARY_TEACHING" | "SALARY_NON_TEACHING" | "LAB_CONSUMABLES" | "INFRASTRUCTURE_LIBRARY" | "OPERATING_ADMIN";
  amountInr: number;
  admissibilityPct: number;
  approvedInr: number;
}

export interface AuthorityConfig {
  code: FeeAuthority;
  title: string;
  fullName: string;
  applicableCourses: string;
  sanctionedStrength: number;
  processingFeeCalc: (fee: number) => number;
  actReference: string;
}

export const AUTHORITY_CONFIGS: Record<FeeAuthority, AuthorityConfig> = {
  FFC: {
    code: "FFC",
    title: "Fee Fixation Committee (FFC)",
    fullName: "Fee Fixation Committee for Diploma Professional Courses, MS",
    applicableCourses: "D.Pharm (2-Year Diploma in Pharmacy)",
    sanctionedStrength: 120, // 60 Year I + 60 Year II
    processingFeeCalc: (fee: number) => Math.min(15000, Math.round(fee * 0.001)),
    actReference: "Govt. Notification 12th April 2024 / Act XXVIII of 2015",
  },
  FRA: {
    code: "FRA",
    title: "Fees Regulating Authority (FRA)",
    fullName: "Fees Regulating Authority, Mumbai (Higher & Technical)",
    applicableCourses: "B.Pharm (4-Year Degree) / M.Pharm",
    sanctionedStrength: 240, // 60 intake x 4 years
    processingFeeCalc: () => 35000, // Standard fixed slab for FRA Degree
    actReference: "Maharashtra Act No. XXVIII of 2015 (Section 14)",
  },
};

export const INITIAL_DPHARM_FFC_EXPENSES: FeeExpenseHead[] = [
  {
    id: "EXP-01",
    headName: "Teaching Faculty Staff Salaries (6th/7th Pay Scale)",
    category: "SALARY_TEACHING",
    amountInr: 3450000,
    admissibilityPct: 100,
    approvedInr: 3450000,
  },
  {
    id: "EXP-02",
    headName: "Non-Teaching, Technical & Lab Staff Salaries",
    category: "SALARY_NON_TEACHING",
    amountInr: 1120000,
    admissibilityPct: 100,
    approvedInr: 1120000,
  },
  {
    id: "EXP-03",
    headName: "Pharmacy Lab Reagents, Chemicals & Consumables",
    category: "LAB_CONSUMABLES",
    amountInr: 480000,
    admissibilityPct: 100,
    approvedInr: 480000,
  },
  {
    id: "EXP-04",
    headName: "Library Books, PCI Norm Journals & Databases",
    category: "INFRASTRUCTURE_LIBRARY",
    amountInr: 210000,
    admissibilityPct: 100,
    approvedInr: 210000,
  },
  {
    id: "EXP-05",
    headName: "Electricity, Building Maintenance & Admin Overheads",
    category: "OPERATING_ADMIN",
    amountInr: 740000,
    admissibilityPct: 90,
    approvedInr: 666000,
  },
];
