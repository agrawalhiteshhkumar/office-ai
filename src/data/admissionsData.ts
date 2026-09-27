export type AdmissionCategory = "OPEN" | "OBC" | "SC" | "ST" | "VJNT" | "EWS" | "TFWS";

export interface StudentAdmissionRecord {
  id: string;
  capApplicationId: string;
  studentName: string;
  year: "YEAR_1" | "YEAR_2";
  gender: "MALE" | "FEMALE";
  category: AdmissionCategory;
  allotmentRound: "CAP_ROUND_I" | "CAP_ROUND_II" | "CAP_ROUND_III" | "INSTITUTE_LEVEL";
  msbteEnrollmentNo: string;
  eligibilityStatus: "CONFIRMED" | "PENDING_VERIFICATION";
  mahadbtStatus: "DISBURSED" | "SCRUTINY_PENDING" | "NOT_APPLIED" | "NA";
  applicableTuitionFee: number;
  scholarshipSanctionedInr: number;
}

export const INITIAL_STUDENT_ROSTER: StudentAdmissionRecord[] = [
  {
    id: "ADM-2025-001",
    capApplicationId: "DEN25108421",
    studentName: "Patil Rohan Sanjay",
    year: "YEAR_1",
    gender: "MALE",
    category: "OBC",
    allotmentRound: "CAP_ROUND_I",
    msbteEnrollmentNo: "2562386001",
    eligibilityStatus: "CONFIRMED",
    mahadbtStatus: "SCRUTINY_PENDING",
    applicableTuitionFee: 65000,
    scholarshipSanctionedInr: 32500, // 50% OBC Freeship
  },
  {
    id: "ADM-2025-002",
    capApplicationId: "DEN25109934",
    studentName: "Shinde Sneha Ramesh",
    year: "YEAR_1",
    gender: "FEMALE",
    category: "SC",
    allotmentRound: "CAP_ROUND_I",
    msbteEnrollmentNo: "2562386002",
    eligibilityStatus: "CONFIRMED",
    mahadbtStatus: "DISBURSED",
    applicableTuitionFee: 65000,
    scholarshipSanctionedInr: 65000, // 100% SC Scholarship
  },
  {
    id: "ADM-2025-003",
    capApplicationId: "DEN25114205",
    studentName: "Ansari Zaid Mohammed",
    year: "YEAR_1",
    gender: "MALE",
    category: "OPEN",
    allotmentRound: "CAP_ROUND_II",
    msbteEnrollmentNo: "2562386003",
    eligibilityStatus: "CONFIRMED",
    mahadbtStatus: "NA",
    applicableTuitionFee: 65000,
    scholarshipSanctionedInr: 0,
  },
  {
    id: "ADM-2025-004",
    capApplicationId: "DEN25118762",
    studentName: "Gavit Dipak Suresh",
    year: "YEAR_1",
    gender: "MALE",
    category: "ST",
    allotmentRound: "CAP_ROUND_I",
    msbteEnrollmentNo: "2562386004",
    eligibilityStatus: "CONFIRMED",
    mahadbtStatus: "SCRUTINY_PENDING",
    applicableTuitionFee: 65000,
    scholarshipSanctionedInr: 65000,
  },
  {
    id: "ADM-2025-005",
    capApplicationId: "DEN25123019",
    studentName: "Kulkarni Tanvi Anand",
    year: "YEAR_1",
    gender: "FEMALE",
    category: "EWS",
    allotmentRound: "CAP_ROUND_II",
    msbteEnrollmentNo: "2562386005",
    eligibilityStatus: "CONFIRMED",
    mahadbtStatus: "SCRUTINY_PENDING",
    applicableTuitionFee: 65000,
    scholarshipSanctionedInr: 32500, // EWS 50%
  },
  {
    id: "ADM-2024-061",
    capApplicationId: "DEN24103112",
    studentName: "Chaudhari Nilesh Prakash",
    year: "YEAR_2",
    gender: "MALE",
    category: "OBC",
    allotmentRound: "CAP_ROUND_I",
    msbteEnrollmentNo: "2462386015",
    eligibilityStatus: "CONFIRMED",
    mahadbtStatus: "DISBURSED",
    applicableTuitionFee: 60000,
    scholarshipSanctionedInr: 30000,
  },
];
