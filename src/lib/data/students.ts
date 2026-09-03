import type { Student } from "@/lib/types";

// ============================================================
// STUDENTS — ~300 students across multiple batches
// ============================================================

const firstNames = [
  "Muhammad", "Ali", "Hassan", "Ahmed", "Usman", "Bilal", "Kashif", "Hamza", "Zain", "Tariq",
  "Imran", "Faisal", "Omar", "Sajid", "Waseem", "Rizwan", "Adeel", "Shoaib", "Nabeel", "Kamran",
  "Arif", "Zahid", "Naeem", "Shakil", "Javed", "Shahid", "Asad", "Waqar", "Danish", "Furqan",
  "Sana", "Fatima", "Ayesha", "Zainab", "Hira", "Maryam", "Amina", "Sara", "Nadia", "Rabia",
  "Khadija", "Mahnoor", "Iqra", "Mehwish", "Bushra", "Asma", "Saima", "Tahira", "Uzma", "Noor",
  "Alina", "Rimsha", "Sadia", "Tayyaba", "Dur-e-Noor", "Anaya", "Kinza", "Areeba", "Laiba", "Minahil",
];
const lastNames = [
  "Khan", "Ahmed", "Ali", "Hussain", "Malik", "Raza", "Sheikh", "Siddiqui", "Qureshi", "Iqbal",
  "Nawaz", "Javed", "Aslam", "Riaz", "Farooq", "Akram", "Shahid", "Nadeem", "Yousuf", "Baig",
  "Chaudhry", "Butt", "Gill", "Mirza", "Sethi", "Lodhi", "Hashmi", "Khattak", "Rajput", "Tanoli",
];
const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Hyderabad", "Quetta", "Sialkot", "Gujranwala", "Sargodha"];
const educations = ["Matric", "Intermediate", "Bachelor's", "DAE", "Diploma", "Master's"];

function generateStudent(index: number, courseId: string, batchId: string, status: Student["status"]): Student {
  const fn = firstNames[index % firstNames.length];
  const ln = lastNames[index % lastNames.length];
  const gender = index % firstNames.length < 30 ? "male" as const : "female" as const;
  const regYear = "2026";
  const regNum = String(index + 1).padStart(4, "0");
  const coursePrefix = courseId.replace("course-", "C");
  const phonePrefix = ["300", "301", "302", "303", "310", "311", "312", "320", "321", "322", "330", "331"][index % 12];

  return {
    id: `student-${index + 1}`,
    registrationId: `MH-${coursePrefix}-${regYear}-${regNum}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}${index}@student.mhit.edu.pk`,
    phone: `+92-${phonePrefix}-${String(1000000 + index * 13).slice(0, 7)}`,
    avatar: `/images/students/student-${(index % 10) + 1}.jpg`,
    gender,
    dateOfBirth: `${1998 + (index % 10)}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
    cnic: `${String(35000 + index).slice(0, 5)}-${String(1234567 + index * 7).slice(0, 7)}-${index % 2}`,
    address: `House ${index + 1}, Street ${(index % 50) + 1}, Block ${String.fromCharCode(65 + (index % 10))}`,
    city: cities[index % cities.length],
    education: educations[index % educations.length],
    courseId,
    batchId,
    status,
    enrolledAt: `2026-0${Math.min((index % 9) + 1, 9)}-${String((index % 28) + 1).padStart(2, "0")}`,
    attendancePercentage: Math.round(60 + Math.random() * 40),
    gpa: Math.round((2.0 + Math.random() * 2.0) * 10) / 10,
    completedAssignments: Math.floor(Math.random() * 18) + 2,
    totalAssignments: 20,
  };
}

// Generate ~300 students across batches (realistic for a growing institute)
export const students: Student[] = [
  // WD-03 (in-progress) - 32 students
  ...Array.from({ length: 32 }, (_, i) => generateStudent(i, "course-1", "batch-3", "active")),
  // WD-04 (in-progress) - 28 students
  ...Array.from({ length: 28 }, (_, i) => generateStudent(i + 32, "course-1", "batch-4", "active")),
  // AD-02 (in-progress) - 27 students
  ...Array.from({ length: 27 }, (_, i) => generateStudent(i + 60, "course-2", "batch-7", "active")),
  // AD-03 (in-progress) - 25 students
  ...Array.from({ length: 25 }, (_, i) => generateStudent(i + 87, "course-2", "batch-8", "active")),
  // AI-02 (in-progress) - 25 students
  ...Array.from({ length: 25 }, (_, i) => generateStudent(i + 112, "course-3", "batch-10", "active")),
  // DM-02 (in-progress) - 20 students
  ...Array.from({ length: 20 }, (_, i) => generateStudent(i + 137, "course-4", "batch-13", "active")),
  // GD-02 (in-progress) - 20 students
  ...Array.from({ length: 20 }, (_, i) => generateStudent(i + 157, "course-5", "batch-16", "active")),
  // VE-01 (in-progress) - 18 students
  ...Array.from({ length: 18 }, (_, i) => generateStudent(i + 177, "course-6", "batch-18", "active")),
  // UX-02 (in-progress) - 15 students
  ...Array.from({ length: 15 }, (_, i) => generateStudent(i + 195, "course-7", "batch-21", "active")),
  // CS-01 (in-progress) - 15 students
  ...Array.from({ length: 15 }, (_, i) => generateStudent(i + 210, "course-8", "batch-23", "active")),
  // NW-01 (in-progress) - 12 students
  ...Array.from({ length: 12 }, (_, i) => generateStudent(i + 225, "course-9", "batch-25", "active")),
  // FR-01 (in-progress) - 18 students
  ...Array.from({ length: 18 }, (_, i) => generateStudent(i + 237, "course-10", "batch-27", "active")),
  // Graduated (completed batches)
  ...Array.from({ length: 15 }, (_, i) => generateStudent(i + 255, "course-1", "batch-1", "graduated")),
  ...Array.from({ length: 12 }, (_, i) => generateStudent(i + 270, "course-1", "batch-2", "graduated")),
  ...Array.from({ length: 10 }, (_, i) => generateStudent(i + 282, "course-2", "batch-6", "graduated")),
  // Dropped / suspended
  ...Array.from({ length: 4 }, (_, i) => generateStudent(i + 292, "course-1", "batch-3", "dropped")),
  ...Array.from({ length: 2 }, (_, i) => generateStudent(i + 296, "course-3", "batch-10", "suspended")),
  ...Array.from({ length: 3 }, (_, i) => generateStudent(i + 298, "course-4", "batch-13", "inactive")),
];

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.id === id);
}

export function getStudentsByBatch(batchId: string): Student[] {
  return students.filter((s) => s.batchId === batchId);
}

export function getStudentsByCourse(courseId: string): Student[] {
  return students.filter((s) => s.courseId === courseId);
}

export function getActiveStudents(): Student[] {
  return students.filter((s) => s.status === "active");
}

export function getStudentsByStatus(status: Student["status"]): Student[] {
  return students.filter((s) => s.status === status);
}
