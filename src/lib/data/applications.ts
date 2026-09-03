import type { Application } from "@/lib/types";

const motivations = [
  "I want to learn modern web development to start a freelancing career.",
  "I am passionate about technology and want to build mobile applications.",
  "I want to learn AI to solve real-world problems in healthcare.",
  "I want to transition from traditional marketing to digital marketing.",
  "I want to pursue graphic design as a creative career path.",
  "I am interested in video editing for YouTube content creation.",
  "I want to learn UI/UX design to create better user experiences.",
  "I want to learn cyber security to protect organizations from threats.",
  "I want to build a career in networking and infrastructure management.",
  "I want to start freelancing and earn independently.",
];

const firstNames = ["Adnan", "Bilal", "Danish", "Ehsan", "Fahad", "Ghulam", "Haris", "Irfan", "Junaid", "Kashif", "Liaqat", "Moeen", "Naeem", "Owais", "Pervaiz", "Qasim", "Rafiq", "Sajjad", "Tanveer", "Umar", "Amna", "Bushra", "Dur-e-Noor", "Erum", "Farwa", "Gulshan", "Huma", "Iram", "Javeria", "Kinza"];
const lastNames = ["Akhtar", "Butt", "Chaudhry", "Dar", "Elahi", "Farooqi", "Gill", "Hashmi", "Iqbal", "Jutt", "Khattak", "Lodhi", "Mirza", "Niazi", "Paracha", "Qadir", "Rajput", "Sethi", "Tanoli", "Usmani"];

function generateApplication(index: number): Application {
  const fn = firstNames[index % firstNames.length];
  const ln = lastNames[index % lastNames.length];
  const gender = index < 20 ? ("male" as const) : ("female" as const);
  const courseId = `course-${(index % 12) + 1}`;
  const statuses: Application["status"][] = ["pending", "pending", "pending", "under-review", "under-review", "approved", "approved", "rejected", "waitlisted", "pending"];
  const status = statuses[index % statuses.length];
  const month = String(Math.min((index % 9) + 1, 9)).padStart(2, "0");
  const day = String((index % 28) + 1).padStart(2, "0");

  return {
    id: `app-${index + 1}`,
    applicationId: `MH-APP-2026-${String(index + 1).padStart(5, "0")}`,
    studentName: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}${index}@email.com`,
    phone: `+92-3${String(20 + (index % 10))[0]}${String(index).padStart(1, "0")}-${String(1000000 + index * 7).slice(0, 7)}`,
    gender,
    dateOfBirth: `${2000 + (index % 8)}-${month}-${day}`,
    cnic: `${String(35000 + index).slice(0, 5)}-${String(1234567 + index * 3).slice(0, 7)}-${index % 2}`,
    address: `House ${index + 1}, Street ${(index % 30) + 1}, Sector ${String.fromCharCode(65 + (index % 8))}`,
    city: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Hyderabad", "Quetta", "Sialkot"][index % 10],
    education: ["Matric", "Intermediate", "Bachelor's", "DAE", "Master's"][index % 5],
    courseId,
    preferredBatchId: index % 3 === 0 ? undefined : `batch-${(index % 30) + 1}`,
    motivation: motivations[index % motivations.length],
    status,
    submittedAt: `2026-${month}-${day}T${String(8 + (index % 10)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}:00Z`,
    reviewedAt: status !== "pending" ? `2026-${month}-${String(Math.min(parseInt(day) + 2, 28)).padStart(2, "0")}` : undefined,
    reviewedBy: status !== "pending" ? "Admin User" : undefined,
    notes: status === "rejected" ? "Does not meet minimum education requirements." : status === "waitlisted" ? "Batch is currently full. Added to waitlist." : undefined,
  };
}

export const applications: Application[] = Array.from({ length: 45 }, (_, i) => generateApplication(i));

export function getApplicationById(id: string): Application | undefined {
  return applications.find((a) => a.id === id);
}

export function getApplicationsByStatus(status: Application["status"]): Application[] {
  return applications.filter((a) => a.status === status);
}

export function getPendingApplications(): Application[] {
  return applications.filter((a) => a.status === "pending" || a.status === "under-review");
}
