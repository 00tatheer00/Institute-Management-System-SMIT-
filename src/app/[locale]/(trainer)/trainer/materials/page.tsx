"use client";

import { useState } from "react";
import { getMaterials, createMaterial } from "@/lib/services/material-service";
import { batches } from "@/lib/data/batches";
import type { LearningMaterial, MaterialType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FolderOpen, Plus, FileText, Video, Link as LinkIcon,
  Presentation, ExternalLink, Download, Clock
} from "lucide-react";

const typeIconMap: Record<MaterialType, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-rose-600" />,
  video: <Video className="h-5 w-5 text-blue-600" />,
  link: <LinkIcon className="h-5 w-5 text-emerald-600" />,
  presentation: <Presentation className="h-5 w-5 text-amber-600" />,
  document: <FileText className="h-5 w-5 text-indigo-600" />,
};

export default function TrainerMaterialsPage() {
  const [materials, setMaterials] = useState<LearningMaterial[]>(() =>
    getMaterials("course-1")
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState<MaterialType>("pdf");
  const [newUrl, setNewUrl] = useState("");
  const [newBatchId, setNewBatchId] = useState("batch-1");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const res = createMaterial({
      title: newTitle,
      description: newDescription,
      courseId: "course-1",
      batchId: newBatchId,
      trainerId: "trainer-1",
      trainerName: "Ahmed Hassan",
      type: newType,
      url: newUrl,
      fileName: newType === "pdf" ? `${newTitle.toLowerCase().replace(/\s+/g, "-")}.pdf` : undefined,
      fileSize: "4.5 MB",
      visibility: "published",
    });

    if (res.success && res.data) {
      setMaterials([res.data, ...materials]);
      setIsAddOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewUrl("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
            <FolderOpen className="h-3.5 w-3.5" />
            Curriculum Resources
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Course Materials & Handouts</h1>
          <p className="text-sm text-muted-foreground">
            Share slide decks, code starter templates, and video workshops with your students
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2 font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4" />
          Share New Resource
        </Button>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((mat) => (
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
                <span>{mat.fileSize || "External Resource"}</span>
                <span>{new Date(mat.publishedAt).toLocaleDateString()}</span>
              </div>

              <a
                href={mat.url}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5 font-medium">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open / Download File
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Resource Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Course Resource</DialogTitle>
            <DialogDescription>
              Upload or link slides, documentation, or starter templates for your batch.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Title *</label>
              <Input
                required
                placeholder="e.g. Next.js 15 App Router Cheatsheet"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Resource Type *</label>
                <Select
                  value={newType}
                  onValueChange={(val: string | null) => {
                    if (val) setNewType(val as MaterialType);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="presentation">Slide Deck (PPTX)</SelectItem>
                    <SelectItem value="video">Recorded Video</SelectItem>
                    <SelectItem value="link">GitHub / Web Link</SelectItem>
                    <SelectItem value="document">Doc / Notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Batch Visibility</label>
                <Select
                  value={newBatchId}
                  onValueChange={(val: string | null) => {
                    if (val) setNewBatchId(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">URL / Storage Link *</label>
              <Input
                required
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Short Summary</label>
              <Textarea
                rows={2}
                placeholder="Brief description of what this material covers..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                Publish Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
