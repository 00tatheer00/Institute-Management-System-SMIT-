"use client";

import { useState } from "react";
import { getAuditEvents } from "@/lib/services/audit-service";
import type { AuditEvent, AuditAction, PermissionResource } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { History, Search, Filter, ShieldCheck, Eye, Clock } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [resourceFilter, setResourceFilter] = useState<PermissionResource | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  const result = getAuditEvents({
    search,
    action: actionFilter,
    resource: resourceFilter,
  });

  const getActionBadge = (action: AuditAction) => {
    switch (action) {
      case "created":
        return "bg-emerald-100 text-emerald-800";
      case "updated":
        return "bg-blue-100 text-blue-800";
      case "deleted":
        return "bg-rose-100 text-rose-800";
      case "imported":
        return "bg-purple-100 text-purple-800";
      case "status_changed":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Audit Trail &amp; Event Logs"
        description="Immutable record of administrative actions, grade changes, admissions decisions, and document verifications."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Audit Logs" },
        ]}
      />

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-lg bg-muted/20 border">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by resource, user name, or action..."
            className="pl-9 h-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={actionFilter} onValueChange={(val) => setActionFilter(val as any)}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="status_changed">Status Changed</SelectItem>
              <SelectItem value="imported">Imported</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={resourceFilter} onValueChange={(val) => setResourceFilter(val as any)}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="admissions">Admissions</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="assignments">Assignments</SelectItem>
              <SelectItem value="results">Results</SelectItem>
              <SelectItem value="certificates">Certificates</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                  <th className="py-3 px-4 font-semibold">Resource</th>
                  <th className="py-3 px-4 font-semibold">Item Name</th>
                  <th className="py-3 px-4 font-semibold">Authorized Actor</th>
                  <th className="py-3 px-4 font-semibold text-end">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs font-mono">
                {result.data.map((event: AuditEvent) => (
                  <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {event.performedAt}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getActionBadge(event.action)}`}>
                        {event.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 uppercase font-bold text-foreground">
                      {event.resource}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-foreground max-w-xs truncate">
                      {event.resourceName}
                    </td>
                    <td className="py-3 px-4 font-sans text-muted-foreground">
                      {event.performedByName}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedEvent(event)}
                        className="text-xs h-7 gap-1 font-sans"
                      >
                        <Eye className="h-3 w-3" /> View Payload
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedEvent && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-600" />
                  Audit Event Payload ({selectedEvent.id})
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Recorded at {selectedEvent.performedAt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4 text-xs">
                <div className="p-3 bg-muted/40 rounded-lg space-y-1 font-mono">
                  <p><strong>Actor:</strong> {selectedEvent.performedByName} ({selectedEvent.performedBy})</p>
                  <p><strong>Resource:</strong> {selectedEvent.resource} / {selectedEvent.resourceId}</p>
                  <p><strong>Entity Name:</strong> {selectedEvent.resourceName}</p>
                  <p><strong>Action Type:</strong> {selectedEvent.action}</p>
                  {selectedEvent.previousValue && (
                    <p className="text-rose-600"><strong>Previous:</strong> {selectedEvent.previousValue}</p>
                  )}
                  {selectedEvent.newValue && (
                    <p className="text-emerald-600"><strong>New Value:</strong> {selectedEvent.newValue}</p>
                  )}
                </div>

                {selectedEvent.details && (
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">Metadata Payload:</p>
                    <pre className="p-3 rounded-lg bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48">
                      {JSON.stringify(selectedEvent.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
