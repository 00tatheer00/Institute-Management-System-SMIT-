import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTrainerById } from "@/lib/services/trainer-service";
import { courses } from "@/lib/data/courses";
import { getBatchesByTrainer } from "@/lib/data/batches";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Layers,
  Star,
} from "lucide-react";

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);

  const trainer = getTrainerById(id);
  if (!trainer) notFound();

  const assignedCourses = courses.filter((c) => trainer.courseIds.includes(c.id));
  const assignedBatches = getBatchesByTrainer(trainer.id);

  const initials = trainer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <PageHeader
        title={trainer.name}
        description={trainer.title}
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Trainers", href: "/admin/trainers" },
          { label: trainer.name },
        ]}
        actions={
          <Link href="/admin/trainers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 me-2" /> Back to Faculty
            </Button>
          </Link>
        }
      />

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold">{trainer.name}</h2>
                <StatusBadge status={trainer.isActive ? "active" : "inactive"} />
              </div>
              <p className="text-sm text-muted-foreground">{trainer.title}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {trainer.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {trainer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Joined {trainer.joinedAt}
                </span>
              </div>
            </div>
            <div className="flex gap-3 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xl font-bold flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {trainer.rating}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">Student Rating</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xl font-bold">{trainer.totalStudents}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Alumni Taught</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Background & Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Background & Teaching Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p className="text-muted-foreground text-xs">{trainer.bio}</p>
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Industry Experience</span>
              <p className="text-xs">{trainer.experience}</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Education</span>
              <p className="text-xs">{trainer.education}</p>
            </div>
          </CardContent>
        </Card>

        {/* Areas of Expertise */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specializations & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Technical Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {trainer.expertise.map((e) => (
                  <Badge key={e} variant="secondary">
                    {e}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Certifications</span>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {trainer.certifications.map((c) => (
                  <li key={c} className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-brand shrink-0" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Programs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brand" /> Courses Taught ({assignedCourses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignedCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg border text-xs">
                <span className="font-semibold">{c.name}</span>
                <span className="text-muted-foreground">{c.duration}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Batches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand" /> Active & Completed Batches ({assignedBatches.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignedBatches.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-2.5 rounded-lg border text-xs">
                <div>
                  <p className="font-semibold">{b.name}</p>
                  <p className="text-[11px] text-muted-foreground">Room {b.room}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
