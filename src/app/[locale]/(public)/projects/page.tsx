"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { getPublishedProjects } from "@/lib/services/project-service";
import type { StudentProject } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Rocket, GitBranch, ExternalLink, Sparkles,
  Search, Code2, Layers, ArrowRight
} from "lucide-react";

export default function PublicProjectsPage() {
  const [projects] = useState<StudentProject[]>(() =>
    getPublishedProjects({ pageSize: 50 }).data
  );

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    return projects.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [projects, selectedCategory]);

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom max-w-6xl mx-auto space-y-10 px-4">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Student Innovations Showcase
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Built by Our Students
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore production-quality web apps, mobile systems, AI algorithms, and UI/UX prototypes engineered during free training programs.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="text-xs h-8"
          >
            All Innovations ({projects.length})
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "web" ? "default" : "outline"}
            onClick={() => setSelectedCategory("web")}
            className="text-xs h-8"
          >
            Web Applications
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "mobile" ? "default" : "outline"}
            onClick={() => setSelectedCategory("mobile")}
            className="text-xs h-8"
          >
            Mobile Apps
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "ai" ? "default" : "outline"}
            onClick={() => setSelectedCategory("ai")}
            className="text-xs h-8"
          >
            AI &amp; Data Science
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "design" ? "default" : "outline"}
            onClick={() => setSelectedCategory("design")}
            className="text-xs h-8"
          >
            UI/UX &amp; Design
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col justify-between overflow-hidden hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 group"
            >
              <div className="h-44 bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-950 flex items-center justify-center p-6 text-white relative">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                    {p.courseName}
                  </span>
                  <h3 className="font-bold text-base line-clamp-2 px-2">
                    {p.title}
                  </h3>
                </div>

                {p.isFeatured && (
                  <div className="absolute top-3 end-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full shadow-xs">
                      ★ Featured
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">By {p.studentName}</span>
                    <span className="font-mono text-[11px]">{p.category}</span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="flex flex-wrap gap-1">
                    {p.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] bg-muted px-2 py-0.5 rounded font-medium text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link href={`/projects/${p.slug || p.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5 font-medium">
                        View Project <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" className="text-xs h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white gap-1">
                          <ExternalLink className="h-3 w-3" /> Live Demo
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
