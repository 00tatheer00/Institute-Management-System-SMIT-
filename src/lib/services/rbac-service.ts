import type {
  UserRole,
  PermissionAction,
  PermissionResource,
} from "@/lib/types";

export interface ResourcePermissionMatrix {
  resource: PermissionResource;
  resourceLabel: string;
  category: "Academics" | "Institute" | "Operations" | "System";
  actions: Record<UserRole, PermissionAction[]>;
}

export const initialPermissionMatrix: ResourcePermissionMatrix[] = [
  {
    resource: "students",
    resourceLabel: "Students Management",
    category: "Academics",
    actions: {
      "super-admin": ["view", "create", "edit", "delete", "import", "export", "manage"],
      admin: ["view", "create", "edit", "import", "export", "manage"],
      trainer: ["view"],
      staff: ["view"],
      student: [],
    },
  },
  {
    resource: "courses",
    resourceLabel: "Courses & Curricula",
    category: "Academics",
    actions: {
      "super-admin": ["view", "create", "edit", "delete", "publish", "manage"],
      admin: ["view", "create", "edit", "publish", "manage"],
      trainer: ["view"],
      staff: ["view"],
      student: ["view"],
    },
  },
  {
    resource: "batches",
    resourceLabel: "Cohorts & Batches",
    category: "Academics",
    actions: {
      "super-admin": ["view", "create", "edit", "delete", "manage"],
      admin: ["view", "create", "edit", "manage"],
      trainer: ["view"],
      staff: ["view"],
      student: [],
    },
  },
  {
    resource: "attendance",
    resourceLabel: "Attendance Records",
    category: "Academics",
    actions: {
      "super-admin": ["view", "edit", "export", "manage"],
      admin: ["view", "edit", "export", "manage"],
      trainer: ["view", "edit", "manage"],
      staff: ["view"],
      student: ["view"],
    },
  },
  {
    resource: "assignments",
    resourceLabel: "Assignments & Submissions",
    category: "Academics",
    actions: {
      "super-admin": ["view", "create", "edit", "delete", "manage"],
      admin: ["view", "create", "edit", "manage"],
      trainer: ["view", "create", "edit", "manage"],
      staff: ["view"],
      student: ["view"],
    },
  },
  {
    resource: "quizzes",
    resourceLabel: "Quizzes & Examinations",
    category: "Academics",
    actions: {
      "super-admin": ["view", "create", "edit", "delete", "manage"],
      admin: ["view", "create", "edit", "manage"],
      trainer: ["view", "create", "edit", "manage"],
      staff: [],
      student: ["view"],
    },
  },
  {
    resource: "results",
    resourceLabel: "Grading & Results Ledger",
    category: "Academics",
    actions: {
      "super-admin": ["view", "edit", "export", "publish", "manage"],
      admin: ["view", "edit", "export", "publish", "manage"],
      trainer: ["view", "edit"],
      staff: ["view"],
      student: ["view"],
    },
  },
  {
    resource: "certificates",
    resourceLabel: "Credentials & Certificates",
    category: "Academics",
    actions: {
      "super-admin": ["view", "create", "approve", "publish", "manage"],
      admin: ["view", "create", "approve", "publish", "manage"],
      trainer: ["view"],
      staff: ["view"],
      student: ["view"],
    },
  },
  {
    resource: "admissions",
    resourceLabel: "Admissions Inflow",
    category: "Operations",
    actions: {
      "super-admin": ["view", "edit", "approve", "manage"],
      admin: ["view", "edit", "approve", "manage"],
      trainer: [],
      staff: ["view", "edit"],
      student: [],
    },
  },
  {
    resource: "reports",
    resourceLabel: "Reporting & Data Export",
    category: "Operations",
    actions: {
      "super-admin": ["view", "export", "manage"],
      admin: ["view", "export", "manage"],
      trainer: ["view"],
      staff: ["view"],
      student: [],
    },
  },
  {
    resource: "settings",
    resourceLabel: "System Settings & Policies",
    category: "System",
    actions: {
      "super-admin": ["view", "edit", "manage"],
      admin: ["view", "edit"],
      trainer: [],
      staff: [],
      student: [],
    },
  },
];

let matrixStore: ResourcePermissionMatrix[] = [...initialPermissionMatrix];

export function getPermissionMatrix(): ResourcePermissionMatrix[] {
  return matrixStore;
}

export function togglePermission(
  resource: PermissionResource,
  role: UserRole,
  action: PermissionAction
): boolean {
  const item = matrixStore.find((m) => m.resource === resource);
  if (!item) return false;

  const currentActions = item.actions[role] || [];
  if (currentActions.includes(action)) {
    item.actions[role] = currentActions.filter((a) => a !== action);
  } else {
    item.actions[role] = [...currentActions, action];
  }
  return true;
}
