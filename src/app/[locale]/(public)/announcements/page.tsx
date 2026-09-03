"use client";

import { useState } from "react";
import { getPublicAnnouncements } from "@/lib/services/announcement-service";
import type { Announcement } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, AlertCircle, Calendar, UserCheck } from "lucide-react";

export default function PublicAnnouncementsPage() {
  const [announcements] = useState<Announcement[]>(() => getPublicAnnouncements());
  const [selectedCat, setSelectedCat] = useState("all");

  const filtered = announcements.filter((a) => {
    if (selectedCat === "all") return true;
    return a.category === selectedCat;
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto space-y-10 px-4">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Megaphone className="h-3.5 w-3.5" /> Official Broadcasts
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Campus Announcements
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Stay updated with academic schedules, admission openings, holiday notices, and institutional circulars.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant={selectedCat === "all" ? "default" : "outline"}
            onClick={() => setSelectedCat("all")}
            className="text-xs h-8"
          >
            All Notices ({announcements.length})
          </Button>
          <Button
            size="sm"
            variant={selectedCat === "admission" ? "default" : "outline"}
            onClick={() => setSelectedCat("admission")}
            className="text-xs h-8"
          >
            Admissions
          </Button>
          <Button
            size="sm"
            variant={selectedCat === "academic" ? "default" : "outline"}
            onClick={() => setSelectedCat("academic")}
            className="text-xs h-8"
          >
            Academic &amp; Exams
          </Button>
          <Button
            size="sm"
            variant={selectedCat === "general" ? "default" : "outline"}
            onClick={() => setSelectedCat("general")}
            className="text-xs h-8"
          >
            Holidays &amp; General
          </Button>
        </div>

        {/* Notices Timeline */}
        <div className="space-y-4">
          {filtered.map((ann) => (
            <Card
              key={ann.id}
              className={`transition-all ${
                ann.isImportant
                  ? "border-rose-300 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10 shadow-xs"
                  : "hover:border-primary/40"
              }`}
            >
              <CardHeader className="p-5 pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-muted font-semibold">
                      {ann.category}
                    </span>
                    {ann.isImportant && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <AlertCircle className="h-3 w-3" /> Priority Notice
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {ann.publishedAt}
                  </span>
                </div>

                <CardTitle className="text-lg font-bold pt-2 text-foreground">
                  {ann.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-1 space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {ann.content}
                </p>

                <div className="pt-2 border-t text-[11px] text-muted-foreground flex justify-between">
                  <span>Issued By: <strong>{ann.publishedBy}</strong></span>
                  <span>Mohsin and Huma IT Center</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
