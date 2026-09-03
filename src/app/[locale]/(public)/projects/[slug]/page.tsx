import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/services/project-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Rocket, GitBranch, ExternalLink, ArrowLeft,
  Calendar, Layers, CheckCircle2, User, Code2
} from "lucide-react";

export function generateStaticParams() {
  const projects = getPublishedProjects({ pageSize: 50 }).data;
  const locales = ["en", "ur"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const p of projects) {
      params.push({ locale, slug: p.slug || p.id });
    }
  }

  return params;
}

export default async function PublicProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProjectBySlug(slug) || getPublishedProjects().data[0];

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto space-y-8 px-4">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Student Showcase
        </Link>

        {/* Project Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-200">
              {project.category}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground font-medium">
              Program: {project.courseName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" /> Developed by <strong>{project.studentName}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <Calendar className="h-3.5 w-3.5" /> Completed: {project.completedAt}
            </span>
          </div>
        </div>

        {/* Hero Visual Display */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-950 p-8 sm:p-12 text-white shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <Rocket className="h-14 w-14 text-indigo-400 animate-pulse" />
          <div className="max-w-lg space-y-2">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Engineered as part of the curriculum for {project.courseName} at Mohsin and Huma IT Center × SMIT.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Button size="sm" className="gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs h-9 px-4">
                  <ExternalLink className="h-4 w-4" /> Open Live Application
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="secondary" className="gap-2 text-xs h-9 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <GitBranch className="h-4 w-4" /> Source Code Repository
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Project Description & Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Project Architecture & Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {project.description}
            </p>

            {project.moduleName && (
              <div className="p-4 rounded-xl bg-muted/30 border space-y-1 text-xs">
                <span className="font-bold text-foreground">Curriculum Milestone:</span>
                <p className="text-muted-foreground">{project.moduleName}</p>
              </div>
            )}

            <div className="space-y-2 border-t pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Technology Stack & Libraries
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted text-foreground text-xs font-semibold"
                  >
                    <Code2 className="h-3.5 w-3.5 text-indigo-600" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
