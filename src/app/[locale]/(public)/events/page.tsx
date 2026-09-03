"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getAllEvents } from "@/lib/services/event-service";
import type { Event } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays, MapPin, Clock, Users,
  ArrowRight, Sparkles, CheckCircle2
} from "lucide-react";

export default function PublicEventsPage() {
  const [events] = useState<Event[]>(() => getAllEvents());
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const filteredEvents = events.filter((e) => {
    if (filter === "all") return true;
    return e.status === filter;
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom max-w-6xl mx-auto space-y-10 px-4">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <CalendarDays className="h-3.5 w-3.5" /> Campus Life &amp; Technical Events
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Workshops, Hackathons &amp; Seminars
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Join hands-on coding bootcamps, tech speaker sessions, and annual innovation competitions open to all students.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="text-xs h-8"
          >
            All Events ({events.length})
          </Button>
          <Button
            size="sm"
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
            className="text-xs h-8"
          >
            Upcoming Events
          </Button>
          <Button
            size="sm"
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            className="text-xs h-8"
          >
            Past Sessions
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <Card
              key={ev.id}
              className="flex flex-col justify-between overflow-hidden hover:shadow-md hover:border-blue-300 dark:hover:border-blue-900 transition-all"
            >
              <div className="p-6 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-blue-300 uppercase font-semibold">
                    {ev.category}
                  </span>
                  {ev.isRegistrationOpen ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Open for Registration
                    </span>
                  ) : (
                    <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded-full text-[10px]">
                      {ev.status === "completed" ? "Concluded" : "Closed"}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold line-clamp-2 pt-1">{ev.title}</h3>
              </div>

              <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
                      {ev.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      {ev.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                      {ev.location}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-3 border-t flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span><strong>{ev.registeredCount}</strong> Registered</span>
                  </div>

                  <Link href={`/events/${ev.id}`}>
                    <Button size="sm" variant="outline" className="text-xs h-8 gap-1 font-medium">
                      Details &amp; RSVP <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
