export interface FacultyCadreRecord {
  id: string;
  name: string;
  designation: "PRINCIPAL" | "PROFESSOR" | "ASSOCIATE_PROFESSOR" | "ASSISTANT_PROFESSOR" | "LECTURER";
  qualification: string;
  joiningDate: string;
  msbteApprovalNo: string;
  dteApprovalStatus: "APPROVED" | "PROVISIONAL" | "PENDING_VERIFICATION";
  pciRegNo: string;
  experienceYears: number;
}

export interface CadreAuditMetrics {
  sanctionedPosts: number;
  filledPosts: number;
  cadreRatioCompliant: boolean;
  deficiencyNote: string;
}

export const INITIAL_FACULTY_ROSTER: FacultyCadreRecord[] = [
  {
    id: "FAC-001",
    name: "Dr. S. K. Patil",
    designation: "PRINCIPAL",
    qualification: "M.Pharm, Ph.D",
    joiningDate: "2018-07-01",
    msbteApprovalNo: "MSBTE/EST/APPR/2018/114",
    dteApprovalStatus: "APPROVED",
    pciRegNo: "PCI-MAH-44120",
    experienceYears: 18,
  },
  {
    id: "FAC-002",
    name: "Mr. V. M. Kharde",
    designation: "LECTURER",
    qualification: "M.Pharm (Pharmaceutics)",
    joiningDate: "2020-08-15",
    msbteApprovalNo: "MSBTE/EST/APPR/2021/482",
    dteApprovalStatus: "APPROVED",
    pciRegNo: "PCI-MAH-78921",
    experienceYears: 8,
  },
  {
    id: "FAC-003",
    name: "Ms. P. R. Deshmukh",
    designation: "LECTURER",
    qualification: "M.Pharm (Pharmacology)",
    joiningDate: "2022-01-10",
    msbteApprovalNo: "MSBTE/EST/APPR/2022/801",
    dteApprovalStatus: "APPROVED",
    pciRegNo: "PCI-MAH-99214",
    experienceYears: 5,
  },
  {
    id: "FAC-004",
    name: "Mr. A. T. Sonawane",
    designation: "LECTURER",
    qualification: "B.Pharm, M.Pharm (QA)",
    joiningDate: "2023-09-01",
    msbteApprovalNo: "MSBTE/RO/PENDING/2023",
    dteApprovalStatus: "PROVISIONAL",
    pciRegNo: "PCI-MAH-108234",
    experienceYears: 3,
  },
];
