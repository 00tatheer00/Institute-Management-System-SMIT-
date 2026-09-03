import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEventById, getAllEvents } from "@/lib/services/event-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventRsvpButton } from "./event-rsvp-button";
import {
  CalendarDays, MapPin, Clock, Users,
  ArrowLeft, CheckCircle2, ShieldCheck, Share2
} from "lucide-react";

export function generateStaticParams() {
  const events = getAllEvents();
  const locales = ["en", "ur"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const e of events) {
      params.push({ locale, slug: e.id });
    }
  }

  return params;
}

export default async function PublicEventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const event = getEventById(slug) || getAllEvents()[0];

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto space-y-8 px-4">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to All Events
        </Link>

        {/* Event Header Card */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono uppercase font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {event.category}
            </span>
            <span>•</span>
            <span className="text-blue-200">
              {event.isRegistrationOpen ? "Free Admission • RSVP Open" : "Registration Closed"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {event.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-white">
              <CalendarDays className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Date</span>
                <strong>{event.date}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Time Slot</span>
                <strong>{event.time}</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-blue-200 block uppercase">Venue</span>
                <strong>{event.location}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Registration Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">About the Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>{event.description}</p>
                <p>
                  Workshops and hackathons at Mohsin and Huma IT Center are designed to bridge theoretical academic knowledge with industry production workflows. Participants work on live codebases, collaborate in pairs, and receive direct mentoring from faculty and guest architects.
                </p>

                <div className="p-4 rounded-xl bg-muted/40 border space-y-2 text-xs">
                  <h4 className="font-bold text-foreground">Who Should Attend?</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Currently enrolled students in Web, App, AI, and Design tracks</li>
                    <li>Alumni seeking advanced hands-on production code patterns</li>
                    <li>Aspiring technology learners interested in free professional courses</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Card */}
          <div>
            <Card className="border-blue-200 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">Event Registration</CardTitle>
                <CardDescription className="text-xs">
                  Reserve your seat. Free for all students.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrolled:</span>
                    <strong>{event.registeredCount} attendees</strong>
                  </div>
                  {event.maxAttendees && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <strong>{event.maxAttendees} seats</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <strong className="text-emerald-600 font-bold">100% Free</strong>
                  </div>
                </div>

                <EventRsvpButton
                  eventTitle={event.title}
                  isOpen={!!event.isRegistrationOpen}
                />

                <p className="text-[10px] text-muted-foreground text-center">
                  Confirmation SMS and gate pass will be issued at the main campus reception.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
