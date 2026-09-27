export type UserRole = 
  | "PLATFORM_OWNER"
  | "INSTITUTE_ADMIN"
  | "REGISTRAR_EST"
  | "EXAM_OIC"
  | "FINANCE_HEAD"
  | "STORES_INCHARGE"
  | "ADMISSIONS_OIC";

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  badge: string;
  allowedDesks: ("ESTABLISHMENT" | "EXAM_CELL" | "ACCOUNTS" | "PHARMACY_STORES" | "STUDENT_ADMISSIONS" | "CENTRAL_DESPATCH" | "ALL")[];
  canSignReports: boolean;
}

export const INSTITUTIONAL_USERS: UserPersona[] = [
  {
    id: "USR-001",
    name: "Dr. Hiteshkumar Agrawal",
    email: "hiteshhkumar.agrawal@gmail.com",
    role: "PLATFORM_OWNER",
    title: "Founder & Chief Academic Architect",
    badge: "Platform Owner",
    allowedDesks: ["ALL"],
    canSignReports: true,
  },
  {
    id: "USR-002",
    name: "Principal Desk (Executive Office)",
    email: "principal@dpkcop.org.in",
    role: "INSTITUTE_ADMIN",
    title: "Principal & Head of Institution",
    badge: "Institute Admin",
    allowedDesks: ["ALL"],
    canSignReports: true,
  },
  {
    id: "USR-003",
    name: "Prof. S. R. Deshmukh",
    email: "exam.cell@dpkcop.org.in",
    role: "EXAM_OIC",
    title: "MSBTE Exam Officer-in-Charge",
    badge: "Exam Cell Head",
    allowedDesks: ["EXAM_CELL"],
    canSignReports: false,
  },
  {
    id: "USR-004",
    name: "Mr. V. K. Patil",
    email: "establishment@dpkcop.org.in",
    role: "REGISTRAR_EST",
    title: "Registrar & Establishment Officer",
    badge: "Establishment Cell",
    allowedDesks: ["ESTABLISHMENT", "CENTRAL_DESPATCH"],
    canSignReports: false,
  },
  {
    id: "USR-005",
    name: "Mr. M. A. Pawar",
    email: "accounts@dpkcop.org.in",
    role: "FINANCE_HEAD",
    title: "Finance & Accounts Superintendent",
    badge: "Finance Desk",
    allowedDesks: ["ACCOUNTS"],
    canSignReports: false,
  },
  {
    id: "USR-006",
    name: "Mr. K. N. Shinde",
    email: "stores@dpkcop.org.in",
    role: "STORES_INCHARGE",
    title: "Store Superintendent & Safety Officer",
    badge: "Stores & Solvents",
    allowedDesks: ["PHARMACY_STORES"],
    canSignReports: false,
  },
  {
    id: "USR-007",
    name: "Mrs. P. B. Wagh",
    email: "admissions@dpkcop.org.in",
    role: "ADMISSIONS_OIC",
    title: "Student Admissions & MahaDBT Nodal",
    badge: "Admissions Desk",
    allowedDesks: ["STUDENT_ADMISSIONS"],
    canSignReports: false,
  },
];
