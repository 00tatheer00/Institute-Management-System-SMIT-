"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { getEvents, createEvent } from "@/lib/services/event-service";
import type { Event } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarDays, Plus, Search, MapPin, Users,
  Clock, ExternalLink, CheckCircle2
} from "lucide-react";

export default function AdminEventsPage() {
  const [eventList, setEventList] = useState<Event[]>(() =>
    getEvents({ pageSize: 100 }).data
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("2026-10-15");
  const [time, setTime] = useState("10:00 AM - 02:00 PM");
  const [location, setLocation] = useState("Auditorium, Main Campus");
  const [category, setCategory] = useState("Workshop");
  const [maxAttendees, setMaxAttendees] = useState(150);

  const filteredEvents = useMemo(() => {
    return eventList.filter((e) => {
      const q = searchQuery.toLowerCase();
      return (
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      );
    });
  }, [eventList, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created = createEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location,
      category,
      maxAttendees,
    });

    setEventList([created, ...eventList]);
    setIsCreateOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Campus Events, Hackathons & Seminars"
          description="Schedule technical seminars, hackathons, guest speaker sessions, and career hiring fairs."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Events" },
          ]}
        />

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium self-start sm:self-auto">
                <Plus className="h-4 w-4" /> Create Event
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Schedule Campus Event</DialogTitle>
              <DialogDescription className="text-xs">
                Publish a new technical workshop, seminar, or competition
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Event Title</label>
                <Input
                  placeholder="e.g. Next.js 15 & AI Full-Stack Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  placeholder="Agenda, keynote speakers, prerequisites..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[75px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Event Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Time Slot</label>
                  <Input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Venue / Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Seat Capacity</label>
                  <Input
                    type="number"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(Number(e.target.value))}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save &amp; Publish Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Institutional Events Roster ({filteredEvents.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review registration levels and public attendance status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Event Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Date &amp; Time</th>
                  <th className="py-3 px-4 font-semibold">Venue</th>
                  <th className="py-3 px-4 font-semibold">Registrations</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">
                      {ev.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                        {ev.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">
                      <div>{ev.date}</div>
                      <div className="text-muted-foreground text-[11px]">{ev.time}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {ev.location}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="font-bold text-foreground">{ev.registeredCount}</span>
                      {ev.maxAttendees && (
                        <span className="text-muted-foreground"> / {ev.maxAttendees}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ev.status} />
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Link href={`/events/${ev.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                          <ExternalLink className="h-3 w-3" /> Public Page
                        </Button>
                      </Link>
                    </td>
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
