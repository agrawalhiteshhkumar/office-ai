export interface StudentSessionalScore {
  studentId: string;
  enrolmentNo: string;
  studentName: string;
  year: "YEAR_I" | "YEAR_II";
  subjectCode: string; // e.g. PH-201 (Pharmaceutics)
  subjectName: string;
  sessional1: number; // Max 20
  sessional2: number; // Max 20
  sessionalAvg: number; // (S1 + S2)/2
  attendancePct: number; // Percentage
  isDetained: boolean; // Flag if < 75%
  status: "DRAFT" | "FROZEN_FOR_PORTAL";
}

export const INITIAL_STUDENT_SCORES: StudentSessionalScore[] = [
  {
    studentId: "DPK-DP-26-001",
    enrolmentNo: "24623860001",
    studentName: "Aher Sanket Dattatray",
    year: "YEAR_II",
    subjectCode: "PH-201",
    subjectName: "Pharmaceutics-II",
    sessional1: 18,
    sessional2: 17,
    sessionalAvg: 17.5,
    attendancePct: 88,
    isDetained: false,
    status: "DRAFT",
  },
  {
    studentId: "DPK-DP-26-002",
    enrolmentNo: "24623860002",
    studentName: "Bhandare Pranav Sanjay",
    year: "YEAR_II",
    subjectCode: "PH-201",
    subjectName: "Pharmaceutics-II",
    sessional1: 14,
    sessional2: 12,
    sessionalAvg: 13.0,
    attendancePct: 79,
    isDetained: false,
    status: "DRAFT",
  },
  {
    studentId: "DPK-DP-26-003",
    enrolmentNo: "24623860003",
    studentName: "Chavan Siddhi Ramesh",
    year: "YEAR_II",
    subjectCode: "PH-201",
    subjectName: "Pharmaceutics-II",
    sessional1: 11,
    sessional2: 9,
    sessionalAvg: 10.0,
    attendancePct: 68,
    isDetained: true,
    status: "DRAFT",
  },
  {
    studentId: "DPK-DP-26-004",
    enrolmentNo: "24623860004",
    studentName: "Deshmukh Omkar Vilas",
    year: "YEAR_II",
    subjectCode: "PH-201",
    subjectName: "Pharmaceutics-II",
    sessional1: 16,
    sessional2: 18,
    sessionalAvg: 17.0,
    attendancePct: 91,
    isDetained: false,
    status: "DRAFT",
  },
];
