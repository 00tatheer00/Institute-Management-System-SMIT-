import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { events } from "@/lib/data/misc";
import { CalendarDays, MapPin } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Campus Events Management"
        description="Hackathons, tech seminars, career fairs, and graduation ceremonies."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Events" },
        ]}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand" /> Institute Events Schedule ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Event Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell>
                    <p className="font-semibold text-sm">{ev.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-xs">{ev.description}</p>
                  </TableCell>
                  <TableCell className="capitalize text-xs font-mono">{ev.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{ev.date}</p>
                    <p className="text-[11px]">{ev.time}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {ev.location}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {ev.registeredCount} {ev.maxAttendees ? `/ ${ev.maxAttendees}` : ""}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ev.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
