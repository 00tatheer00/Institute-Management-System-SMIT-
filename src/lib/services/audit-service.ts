import type { AuditEvent, AuditAction, PermissionResource } from "@/lib/types";
import { initialAuditLogs } from "@/lib/data/audit-logs";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const auditStore: AuditEvent[] = [...initialAuditLogs];

const auditSearchFields: (keyof AuditEvent)[] = [
  "resourceName",
  "performedByName",
  "action",
  "resource",
];

export function getAuditEvents(
  params: QueryParams & {
    action?: AuditAction | "all";
    resource?: PermissionResource | "all";
  } = {}
): PaginatedResult<AuditEvent> {
  let filtered = auditStore;

  if (params.action && params.action !== "all") {
    filtered = filtered.filter((e) => e.action === params.action);
  }

  if (params.resource && params.resource !== "all") {
    filtered = filtered.filter((e) => e.resource === params.resource);
  }

  return queryItems(filtered, { pageSize: 15, ...params }, auditSearchFields);
}

export function getAuditEventById(id: string): AuditEvent | undefined {
  return auditStore.find((e) => e.id === id);
}

export function logAuditEvent(event: Omit<AuditEvent, "id" | "performedAt">): AuditEvent {
  const newEvent: AuditEvent = {
    ...event,
    id: `audit-${Date.now()}`,
    performedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
  };

  auditStore.unshift(newEvent);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("audit_logs")
      .insert({
        id: newEvent.id,
        actor_id: newEvent.performedBy,
        actor_name: newEvent.performedByName,
        actor_role: "admin",
        action: newEvent.action,
        resource: newEvent.resource,
        resource_id: newEvent.resourceId,
        details: JSON.stringify(newEvent.details || {}),
        ip_address: "127.0.0.1",
        created_at: new Date().toISOString(),
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase audit log insert error:", error);
      });
  }

  return newEvent;
}
