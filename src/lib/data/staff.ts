import type { Staff } from "@/lib/types";

export const staff: Staff[] = [
  { id: "staff-1", name: "Asif Ali", email: "asif.ali@mhit.edu.pk", phone: "+92-321-1234567", role: "coordinator", department: "Academic Affairs", designation: "Academic Coordinator", joinedAt: "2024-01-15", status: "active" },
  { id: "staff-2", name: "Sadia Rizwan", email: "sadia.rizwan@mhit.edu.pk", phone: "+92-322-2345678", role: "office-manager", department: "Administration", designation: "Office Manager", joinedAt: "2023-06-01", status: "active" },
  { id: "staff-3", name: "Kamran Shahid", email: "kamran.shahid@mhit.edu.pk", phone: "+92-323-3456789", role: "it-support", department: "IT Department", designation: "IT Support Specialist", joinedAt: "2024-03-10", status: "active" },
  { id: "staff-4", name: "Rabia Javed", email: "rabia.javed@mhit.edu.pk", phone: "+92-324-4567890", role: "receptionist", department: "Administration", designation: "Front Desk Receptionist", joinedAt: "2024-07-01", status: "active" },
  { id: "staff-5", name: "Waqas Ahmed", email: "waqas.ahmed@mhit.edu.pk", phone: "+92-325-5678901", role: "lab-assistant", department: "IT Department", designation: "Lab Assistant", joinedAt: "2024-02-15", status: "active" },
  { id: "staff-6", name: "Nazia Khan", email: "nazia.khan@mhit.edu.pk", phone: "+92-326-6789012", role: "lab-assistant", department: "IT Department", designation: "Lab Assistant", joinedAt: "2025-01-10", status: "active" },
  { id: "staff-7", name: "Irfan Baig", email: "irfan.baig@mhit.edu.pk", phone: "+92-327-7890123", role: "accountant", department: "Finance", designation: "Accountant", joinedAt: "2023-08-15", status: "active" },
  { id: "staff-8", name: "Zahid Hussain", email: "zahid.hussain@mhit.edu.pk", phone: "+92-328-8901234", role: "security", department: "Security", designation: "Head Security Guard", joinedAt: "2023-01-01", status: "active" },
  { id: "staff-9", name: "Farhat Malik", email: "farhat.malik@mhit.edu.pk", phone: "+92-329-9012345", role: "coordinator", department: "Student Affairs", designation: "Student Coordinator", joinedAt: "2024-09-01", status: "on-leave" },
  { id: "staff-10", name: "Tahir Qureshi", email: "tahir.qureshi@mhit.edu.pk", phone: "+92-330-0123456", role: "librarian", department: "Library", designation: "Librarian", joinedAt: "2024-05-20", status: "active" },
];

export function getStaffById(id: string): Staff | undefined {
  return staff.find((s) => s.id === id);
}

export function getActiveStaff(): Staff[] {
  return staff.filter((s) => s.status === "active");
}
