"use client";

import { useState, useMemo } from "react";
import { getMaterials } from "@/lib/services/material-service";
import type { LearningMaterial, MaterialType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FolderOpen, FileText, Video, Link as LinkIcon,
  Presentation, ExternalLink, Download, Search
} from "lucide-react";

const typeIconMap: Record<MaterialType, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-rose-600" />,
  video: <Video className="h-5 w-5 text-blue-600" />,
  link: <LinkIcon className="h-5 w-5 text-emerald-600" />,
  presentation: <Presentation className="h-5 w-5 text-amber-600" />,
  document: <FileText className="h-5 w-5 text-indigo-600" />,
};

export default function StudentMaterialsPage() {
  const [materials] = useState<LearningMaterial[]>(() =>
    getMaterials("course-1", "batch-1")
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);

      const matchesType = selectedType === "all" || m.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [materials, searchQuery, selectedType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <FolderOpen className="h-3.5 w-3.5" />
          Learning Library
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Handouts, Slides & Resources</h1>
        <p className="text-sm text-muted-foreground">
          Curriculum slide decks, code templates, and workshop recordings for Web Development
        </p>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <Button
                size="sm"
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                className="text-xs h-8"
              >
                All Resources
              </Button>
              <Button
                size="sm"
                variant={selectedType === "pdf" ? "default" : "outline"}
                onClick={() => setSelectedType("pdf")}
                className="text-xs h-8"
              >
                PDF Guides
              </Button>
              <Button
                size="sm"
                variant={selectedType === "video" ? "default" : "outline"}
                onClick={() => setSelectedType("video")}
                className="text-xs h-8"
              >
                Videos
              </Button>
              <Button
                size="sm"
                variant={selectedType === "link" ? "default" : "outline"}
                onClick={() => setSelectedType("link")}
                className="text-xs h-8"
              >
                Repositories
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mat) => (
          <Card key={mat.id} className="hover:border-primary/40 transition-colors flex flex-col justify-between">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-muted shrink-0">
                  {typeIconMap[mat.type] || <FileText className="h-5 w-5" />}
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded bg-muted">
                    {mat.type}
                  </span>
                  <CardTitle className="text-sm font-bold line-clamp-2 leading-snug">
                    {mat.title}
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-xs line-clamp-2 mt-2">
                {mat.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-2 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                <span>{mat.fileSize || "External Link"}</span>
                <span>By {mat.trainerName || "Faculty"}</span>
              </div>

              <a
                href={mat.url}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5 font-medium">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Access Resource
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
