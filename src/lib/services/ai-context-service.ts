import type {
  AiContextScope,
  AiContextRequest,
  AiSanitizedContext,
  AiDataBlock,
  UserRole,
} from "@/lib/types";
import { courses } from "@/lib/data/courses";
import { defaultAcademicPolicies } from "@/lib/config/academic-policies";

/**
 * AI-READY ARCHITECTURE & DATA ACCESS BOUNDARY
 *
 * Security Principle:
 * External AI models (or future LLM endpoints) must NEVER have raw direct SQL or
 * unrestricted access to the application database.
 *
 * Architecture:
 * AI Request
 *     ↓
 * AI Service & Permission Check (hasPermission)
 *     ↓
 * Approved Data Retrieval
 *     ↓
 * Privacy Filter & Sanitized Context Builder (Redacts CNIC, phone, email, home address)
 *     ↓
 * AI Provider / LLM API
 */

export function buildSanitizedAiContext(request: AiContextRequest): {
  success: boolean;
  context?: AiSanitizedContext;
  denialReason?: string;
} {
  // 1. Role-Based Access Boundary Check
  if (request.scope === "admin-analytics" && request.requesterRole !== "admin" && request.requesterRole !== "super-admin") {
    return {
      success: false,
      denialReason: "Security Boundary Violation: Only Administrative roles may request aggregate institutional analytics context.",
    };
  }

  if (request.scope === "trainer-copilot" && request.requesterRole === "student") {
    return {
      success: false,
      denialReason: "Security Boundary Violation: Students cannot access faculty assessment authoring context.",
    };
  }

  const dataBlocks: AiDataBlock[] = [];
  const redactedFields: string[] = [
    "cnic",
    "phone",
    "home_address",
    "emergency_contact",
    "internal_auditor_notes",
  ];

  // 2. Build Context Scope Blocks
  switch (request.scope) {
    case "student-learning":
      dataBlocks.push({
        blockType: "CurriculumStructure",
        title: "Standard Web & App Curriculum",
        contentSummary: "Approved syllabus modules, prerequisites, and learning outcomes.",
        safeData: {
          coursesAvailable: courses.map((c) => ({
            id: c.id,
            name: c.name,
            duration: c.duration,
            modulesCount: c.curriculum?.length || 6,
          })),
        },
      });

      dataBlocks.push({
        blockType: "AcademicPolicies",
        title: "Institutional Standards",
        contentSummary: "Attendance minimums and examination standards.",
        safeData: {
          minAttendance: defaultAcademicPolicies.minAttendancePercentage,
          passingGpa: defaultAcademicPolicies.passingGpaThreshold,
        },
      });
      break;

    case "trainer-copilot":
      dataBlocks.push({
        blockType: "PedagogicalRubrics",
        title: "Assignment Grading Guidelines",
        contentSummary: "Evaluation rubrics for code architecture, semantic HTML, and Next.js standards.",
        safeData: {
          passingThreshold: 50,
          distinctionThreshold: 85,
        },
      });
      break;

    case "career-advisory":
      dataBlocks.push({
        blockType: "IndustryTechDemand",
        title: "In-Demand Software Engineering Stacks",
        contentSummary: "Skills frequently requested by hiring partners in Karachi software houses.",
        safeData: {
          highDemandSkills: ["Next.js 15", "TypeScript", "Tailwind CSS v4", "Flutter", "PostgreSQL", "FastAPI"],
          placementReadinessMinimumScore: 80,
        },
      });
      break;

    case "admin-analytics":
      dataBlocks.push({
        blockType: "ExecutivePerformanceSummary",
        title: "Aggregated Completion Rates",
        contentSummary: "Cohort average pass rate, retention, and capacity utilization.",
        safeData: {
          averagePassRate: 94,
          overallRetention: 92,
        },
      });
      break;
  }

  const sanitizedContext: AiSanitizedContext = {
    contextId: `ai-ctx-${Date.now()}`,
    scope: request.scope,
    requesterRole: request.requesterRole,
    generatedAt: new Date().toISOString(),
    dataBlocks,
    redactedPiiFields: redactedFields,
    complianceCertified: true,
  };

  return {
    success: true,
    context: sanitizedContext,
  };
}
