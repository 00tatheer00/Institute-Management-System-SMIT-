import type { AcademicPolicies } from "@/lib/types";

/**
 * Centralized Academic Policies Configuration
 * Defines institutional thresholds, attendance requirements, and examination standards
 * across Mohsin and Huma IT Center × SMIT.
 */
export const defaultAcademicPolicies: AcademicPolicies = {
  minAttendancePercentage: 75,
  minAssignmentCompletionRate: 80,
  minQuizAverageScore: 60,
  passingGpaThreshold: 2.0,
  latePenaltyPerDayPercentage: 5,
  maxLateDaysAllowed: 3,
  maxQuizAttempts: 1,
  autoIssueCertificates: false,
};

let currentPolicies: AcademicPolicies = { ...defaultAcademicPolicies };

export function getAcademicPolicies(): AcademicPolicies {
  return currentPolicies;
}

export function updateAcademicPolicies(policies: Partial<AcademicPolicies>): AcademicPolicies {
  currentPolicies = { ...currentPolicies, ...policies };
  return currentPolicies;
}
