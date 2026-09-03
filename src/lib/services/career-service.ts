import type {
  StudentCareerProfile,
  PlacementRecord,
  EmploymentStatus,
  InternshipStatus,
} from "@/lib/types";
import { initialCareerProfiles, initialPlacements } from "@/lib/data/career";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

const profileStore: StudentCareerProfile[] = [...initialCareerProfiles];
const placementStore: PlacementRecord[] = [...initialPlacements];

const profileSearchFields: (keyof StudentCareerProfile)[] = [
  "studentName",
  "courseName",
  "batchName",
  "placedCompany",
  "placedRole",
];

const placementSearchFields: (keyof PlacementRecord)[] = [
  "studentName",
  "courseName",
  "companyName",
  "roleTitle",
];

export function getAllCareerProfiles(
  params: QueryParams & {
    employmentStatus?: EmploymentStatus | "all";
    internshipStatus?: InternshipStatus | "all";
  } = {}
): PaginatedResult<StudentCareerProfile> {
  let filtered = profileStore;

  if (params.employmentStatus && params.employmentStatus !== "all") {
    filtered = filtered.filter((p) => p.employmentStatus === params.employmentStatus);
  }

  if (params.internshipStatus && params.internshipStatus !== "all") {
    filtered = filtered.filter((p) => p.internshipStatus === params.internshipStatus);
  }

  return queryItems(filtered, { pageSize: 12, ...params }, profileSearchFields);
}

export function getStudentCareerProfile(studentId: string): StudentCareerProfile | undefined {
  return profileStore.find((p) => p.studentId === studentId);
}

export function updateStudentCareerProfile(
  studentId: string,
  updates: Partial<StudentCareerProfile>
): StudentCareerProfile {
  let profile = profileStore.find((p) => p.studentId === studentId);

  if (!profile) {
    profile = {
      studentId,
      studentName: "Muhammad Khan",
      courseName: "Web Development",
      batchName: "WD-01",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      portfolioReadinessScore: 85,
      internshipStatus: "interviewing",
      employmentStatus: "looking",
      targetRoles: ["Frontend Developer"],
      cvStatus: "draft",
      updatedAt: new Date().toISOString().split("T")[0],
    };
    profileStore.unshift(profile);
  }

  Object.assign(profile, updates, { updatedAt: new Date().toISOString().split("T")[0] });
  return profile;
}

export function getAllPlacements(params: QueryParams = {}): PaginatedResult<PlacementRecord> {
  return queryItems(placementStore, { pageSize: 15, ...params }, placementSearchFields);
}

export function recordPlacement(data: Omit<PlacementRecord, "id">): PlacementRecord {
  const newPlc: PlacementRecord = {
    ...data,
    id: `plc-${Date.now()}`,
  };

  placementStore.unshift(newPlc);

  // Sync with student career profile
  const profile = profileStore.find((p) => p.studentId === data.studentId);
  if (profile) {
    profile.placedCompany = data.companyName;
    profile.placedRole = data.roleTitle;
    profile.internshipStatus = "placed";
    profile.employmentStatus = data.placementType === "full-time" ? "employed" : "internship";
  }

  return newPlc;
}

export function getPlacementStats(): {
  totalPlaced: number;
  internshipsActive: number;
  fullTimeRoles: number;
  averageStipend: number;
  topCompanies: { name: string; hiresCount: number }[];
} {
  const total = placementStore.length;
  const internships = placementStore.filter((p) => p.placementType === "internship").length;
  const fullTime = placementStore.filter((p) => p.placementType === "full-time").length;
  const avgStipend =
    total > 0
      ? Math.round(
          placementStore.reduce((sum, p) => sum + (p.monthlyStipend || 45000), 0) / total
        )
      : 50000;

  const compMap: Record<string, number> = {};
  for (const p of placementStore) {
    compMap[p.companyName] = (compMap[p.companyName] || 0) + 1;
  }

  const topCompanies = Object.entries(compMap).map(([name, hiresCount]) => ({
    name,
    hiresCount,
  }));

  return {
    totalPlaced: total,
    internshipsActive: internships,
    fullTimeRoles: fullTime,
    averageStipend: avgStipend,
    topCompanies,
  };
}
