"use client";

import { useState } from "react";
import {
  getPermissionMatrix,
  togglePermission,
  type ResourcePermissionMatrix,
} from "@/lib/services/rbac-service";
import type { UserRole, PermissionAction, PermissionResource } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Check, X, Shield, Lock, AlertCircle } from "lucide-react";

export default function AdminRolesPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [matrix, setMatrix] = useState(() => getPermissionMatrix());

  const actions: PermissionAction[] = [
    "view",
    "create",
    "edit",
    "delete",
    "import",
    "export",
    "approve",
    "manage",
  ];

  const handleToggle = (resource: PermissionResource, action: PermissionAction) => {
    if (selectedRole === "super-admin") return; // Super-admin retains immutable full authority
    togglePermission(resource, selectedRole, action);
    setMatrix([...getPermissionMatrix()]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role-Based Access Control (RBAC) &amp; Permissions"
        description="Configure institutional security privileges across Super Admin, Admin, Faculty Trainers, Support Staff, and Students."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Roles & Permissions" },
        ]}
      />

      {/* Role Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        {[
          { id: "super-admin", label: "Super Admin", badge: "Full Access" },
          { id: "admin", label: "Operations Admin", badge: "Standard Admin" },
          { id: "trainer", label: "Faculty Trainer", badge: "Academic" },
          { id: "staff", label: "Support Staff", badge: "Limited Ops" },
          { id: "student", label: "Enrolled Student", badge: "Self-Service" },
        ].map((r) => (
          <Button
            key={r.id}
            size="sm"
            variant={selectedRole === r.id ? "default" : "outline"}
            onClick={() => setSelectedRole(r.id as UserRole)}
            className="text-xs h-8 gap-2 font-medium"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{r.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted/40 font-mono">
              {r.badge}
            </span>
          </Button>
        ))}
      </div>

      {selectedRole === "super-admin" && (
        <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
          <Lock className="h-4 w-4 shrink-0 text-blue-600" />
          <span>
            <strong>Super Administrator Role:</strong> Has universal bypass permissions (`hasPermission = true`) across all resources. Privileges are permanent and cannot be revoked.
          </span>
        </div>
      )}

      {/* Grouped Permission Matrix Table */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-semibold">
            Permission Matrix for <span className="capitalize text-blue-600 font-bold">{selectedRole.replace("-", " ")}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Click on any permission pill to toggle privileges. Changes apply across all authenticated users with this role.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-b">
                <tr>
                  <th className="py-3 px-4 font-semibold">Functional Module</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  {actions.map((act) => (
                    <th key={act} className="py-3 px-3 text-center font-semibold capitalize">
                      {act}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {matrix.map((row) => (
                  <tr key={row.resource} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {row.resourceLabel}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-semibold">
                        {row.category}
                      </span>
                    </td>
                    {actions.map((act) => {
                      const isGranted =
                        selectedRole === "super-admin" ||
                        (row.actions[selectedRole] && row.actions[selectedRole].includes(act));

                      return (
                        <td key={act} className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            disabled={selectedRole === "super-admin"}
                            onClick={() => handleToggle(row.resource, act)}
                            className={`h-7 w-7 rounded-md inline-flex items-center justify-center transition-all ${
                              isGranted
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold shadow-xs hover:bg-emerald-200"
                                : "bg-muted/40 text-muted-foreground hover:bg-muted"
                            } ${selectedRole === "super-admin" ? "cursor-default opacity-80" : "cursor-pointer"}`}
                            title={`${act} permission for ${row.resourceLabel}`}
                          >
                            {isGranted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
