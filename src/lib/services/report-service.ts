import * as XLSX from "xlsx";
import { students } from "@/lib/data/students";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { trainers } from "@/lib/data/trainers";
import { applications } from "@/lib/data/applications";
import { initialUnifiedResults } from "@/lib/data/results";
import { initialGrants, initialExpenses } from "@/lib/data/finance";

export interface ReportDefinition {
  id: string;
  category: "academic" | "admissions" | "operations" | "students" | "finance";
  title: string;
  description: string;
  defaultFilename: string;
}

export const availableReports: ReportDefinition[] = [
  // Academic
  {
    id: "student-performance",
    category: "academic",
    title: "Student Academic Performance & GPA Ledger",
    description: "Course evaluations, assignment submissions, quiz results, and GPA standing.",
    defaultFilename: "academic_performance_report",
  },
  {
    id: "attendance-summary",
    category: "academic",
    title: "Attendance Standing & Low-Attendance Audit",
    description: "Attendance rates across batches with low attendance flags (< 75%).",
    defaultFilename: "attendance_audit_report",
  },
  {
    id: "results-ledger",
    category: "academic",
    title: "Verified Examination & Assessment Results",
    description: "Consolidated assessment marks, obtained scores, letter grades, and trainer remarks.",
    defaultFilename: "examination_results_ledger",
  },
  // Admissions
  {
    id: "admissions-inflow",
    category: "admissions",
    title: "Admissions Applications & Demographic Summary",
    description: "Application volume, program preferences, qualification tiers, and approval status.",
    defaultFilename: "admissions_inflow_report",
  },
  // Operations
  {
    id: "trainer-workload",
    category: "operations",
    title: "Faculty Workload & Lab Allocation Matrix",
    description: "Assigned cohorts, teaching hours, classroom/lab rooms, and student counts per trainer.",
    defaultFilename: "faculty_workload_matrix",
  },
  {
    id: "batches-capacity",
    category: "operations",
    title: "Batch Enrollment & Capacity Utilization",
    description: "Cohort status, schedule slots, lab seat occupancy rates, and course linkages.",
    defaultFilename: "batches_capacity_report",
  },
  // Students
  {
    id: "student-directory",
    category: "students",
    title: "Official Student Roster & Registration Records",
    description: "Complete list of enrolled students, roll numbers, programs, and statuses.",
    defaultFilename: "official_student_directory",
  },
  {
    id: "graduates-roster",
    category: "students",
    title: "Certified Graduates & Alumni Archive",
    description: "Alumni directory with completed programs, distinction honors, and completion dates.",
    defaultFilename: "graduates_alumni_roster",
  },
  // Finance
  {
    id: "funding-grants",
    category: "finance",
    title: "Institutional Grants & Endowments Summary",
    description: "Funding sources, grant numbers, received amounts, allocation purposes, and status.",
    defaultFilename: "funding_grants_summary",
  },
  {
    id: "expenses-ledger",
    category: "finance",
    title: "Operating Expenses & Budget Disbursements",
    description: "Itemized expenditures across lab hardware, solar maintenance, utilities, and training.",
    defaultFilename: "operating_expenses_ledger",
  },
];

export interface ReportDataResult {
  report: ReportDefinition;
  columns: string[];
  rows: Record<string, any>[];
  totalRecords: number;
}

export function generateReportData(
  reportId: string,
  filters: { courseId?: string; batchId?: string; status?: string } = {}
): ReportDataResult {
  const report = availableReports.find((r) => r.id === reportId) || availableReports[0];

  let columns: string[] = [];
  let rows: Record<string, any>[] = [];

  switch (report.id) {
    case "student-performance":
      columns = ["Registration ID", "Student Name", "Course", "Cohort", "Attendance %", "GPA", "Assignments Done", "Status"];
      rows = students
        .filter((s) => (!filters.courseId || filters.courseId === "all" || s.courseId === filters.courseId))
        .map((s) => {
          const c = courses.find((crs) => crs.id === s.courseId);
          const b = batches.find((btc) => btc.id === s.batchId);
          return {
            "Registration ID": s.registrationId,
            "Student Name": s.name,
            Course: c?.name || "Program",
            Cohort: b?.name || "Batch",
            "Attendance %": `${s.attendancePercentage}%`,
            GPA: s.gpa.toFixed(2),
            "Assignments Done": `${s.completedAssignments}/${s.totalAssignments}`,
            Status: s.status,
          };
        });
      break;

    case "attendance-summary":
      columns = ["Registration ID", "Student Name", "Course", "Cohort", "Attendance %", "Compliance Standing"];
      rows = students
        .filter((s) => (!filters.courseId || filters.courseId === "all" || s.courseId === filters.courseId))
        .map((s) => {
          const c = courses.find((crs) => crs.id === s.courseId);
          const b = batches.find((btc) => btc.id === s.batchId);
          return {
            "Registration ID": s.registrationId,
            "Student Name": s.name,
            Course: c?.name || "Program",
            Cohort: b?.name || "Batch",
            "Attendance %": `${s.attendancePercentage}%`,
            "Compliance Standing": s.attendancePercentage >= 75 ? "Satisfactory" : "At Risk (<75%)",
          };
        });
      break;

    case "results-ledger":
      columns = ["Roll No", "Student Name", "Assessment Title", "Type", "Marks Obtained", "Total", "%", "Grade"];
      rows = initialUnifiedResults.map((r) => ({
        "Roll No": r.studentId,
        "Student Name": r.studentName,
        "Assessment Title": r.assessmentTitle,
        Type: r.assessmentType,
        "Marks Obtained": r.obtainedMarks,
        Total: r.totalMarks,
        "%": `${r.percentage}%`,
        Grade: r.grade,
      }));
      break;

    case "admissions-inflow":
      columns = ["App ID", "Applicant Name", "Course Choice", "Education", "City", "Applied Date", "Status"];
      rows = applications.map((a) => {
        const c = courses.find((crs) => crs.id === a.courseId);
        return {
          "App ID": a.applicationId,
          "Applicant Name": a.studentName,
          "Course Choice": c?.name || "Program",
          Education: a.education,
          City: a.city,
          "Applied Date": a.submittedAt,
          Status: a.status,
        };
      });
      break;

    case "trainer-workload":
      columns = ["Trainer Name", "Title", "Assigned Batches", "Total Students", "Email"];
      rows = trainers.map((t) => {
        const assigned = batches.filter((b) => b.trainerId === t.id);
        const count = assigned.reduce((sum, b) => sum + b.enrolledSeats, 0);
        return {
          "Trainer Name": t.name,
          Title: t.title,
          "Assigned Batches": assigned.length,
          "Total Students": count,
          Email: t.email,
        };
      });
      break;

    case "batches-capacity":
      columns = ["Batch Code", "Program", "Instructor", "Room", "Enrolled", "Capacity", "Occupancy %", "Status"];
      rows = batches.map((b) => {
        const c = courses.find((crs) => crs.id === b.courseId);
        const t = trainers.find((trn) => trn.id === b.trainerId);
        const occupancy = b.totalSeats > 0 ? Math.round((b.enrolledSeats / b.totalSeats) * 100) : 0;
        return {
          "Batch Code": b.name,
          Program: c?.name || "Program",
          Instructor: t?.name || "Faculty",
          Room: b.room,
          Enrolled: b.enrolledSeats,
          Capacity: b.totalSeats,
          "Occupancy %": `${occupancy}%`,
          Status: b.status,
        };
      });
      break;

    case "student-directory":
      columns = ["Registration ID", "Student Name", "Course", "Batch", "Admission Date", "Status"];
      rows = students.map((s) => {
        const c = courses.find((crs) => crs.id === s.courseId);
        const b = batches.find((btc) => btc.id === s.batchId);
        return {
          "Registration ID": s.registrationId,
          "Student Name": s.name,
          Course: c?.name || "Program",
          Batch: b?.name || "Batch",
          "Admission Date": s.enrolledAt,
          Status: s.status,
        };
      });
      break;

    case "graduates-roster":
      columns = ["Registration ID", "Graduate Name", "Program", "Batch", "GPA", "Honor"];
      rows = students
        .filter((s) => s.status === "graduated" || s.gpa >= 3.5)
        .slice(0, 20)
        .map((s) => {
          const c = courses.find((crs) => crs.id === s.courseId);
          const b = batches.find((btc) => btc.id === s.batchId);
          return {
            "Registration ID": s.registrationId,
            "Graduate Name": s.name,
            Program: c?.name || "Program",
            Batch: b?.name || "Batch",
            GPA: s.gpa.toFixed(2),
            Honor: s.gpa >= 3.7 ? "High Distinction" : "Merit Pass",
          };
        });
      break;

    case "funding-grants":
      columns = ["Grant Number", "Funding Source", "Amount (PKR)", "Received Date", "Purpose", "Status"];
      rows = initialGrants.map((g) => ({
        "Grant Number": g.grantNumber,
        "Funding Source": g.sourceName,
        "Amount (PKR)": g.amount.toLocaleString(),
        "Received Date": g.receivedDate,
        Purpose: g.purpose,
        Status: g.status,
      }));
      break;

    case "expenses-ledger":
      columns = ["Date", "Expense Title", "Category", "Amount (PKR)", "Funding Source", "Reference", "Status"];
      rows = initialExpenses.map((e) => ({
        Date: e.date,
        "Expense Title": e.title,
        Category: e.category,
        "Amount (PKR)": e.amount.toLocaleString(),
        "Funding Source": e.fundingSourceName,
        Reference: e.reference,
        Status: e.status,
      }));
      break;

    default:
      columns = ["ID", "Record"];
      rows = [{ ID: "1", Record: "No data available" }];
  }

  return {
    report,
    columns,
    rows,
    totalRecords: rows.length,
  };
}

export function exportReportToExcel(reportId: string, filters: any = {}): void {
  const data = generateReportData(reportId, filters);
  const worksheet = XLSX.utils.json_to_sheet(data.rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  const fileName = `${data.report.defaultFilename}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function exportReportToCsv(reportId: string, filters: any = {}): void {
  const data = generateReportData(reportId, filters);
  const worksheet = XLSX.utils.json_to_sheet(data.rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${data.report.defaultFilename}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
