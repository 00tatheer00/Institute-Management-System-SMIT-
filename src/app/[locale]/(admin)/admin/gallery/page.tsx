"use client";

import { useState } from "react";
import { getGalleryItems, createGalleryItem } from "@/lib/services/gallery-service";
import type { GalleryItem } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image as ImageIcon, Plus, Trash2, CheckCircle2,
  ExternalLink, Calendar
} from "lucide-react";

export default function AdminGalleryPage() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() =>
    getGalleryItems({ pageSize: 50 }).data
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "workshops" | "classes" | "events" | "graduation" | "projects" | "campus"
  >("workshops");
  const [image, setImage] = useState("/images/events/web-workshop.jpg");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created = createGalleryItem({
      title: title.trim(),
      description: description.trim(),
      category,
      image,
    });

    setGalleryList([created, ...galleryList]);
    setIsAddOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Media & Photo Archive Manager"
          description="Campus photograph archives, workshop picture albums, hackathon galleries, and graduation ceremonies."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Gallery" },
          ]}
        />

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-purple-600 hover:bg-purple-700 text-white font-medium self-start sm:self-auto">
                <Plus className="h-4 w-4" /> Add Album Media
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Add Gallery Photograph</DialogTitle>
              <DialogDescription className="text-xs">
                Upload image reference prepared for Supabase Storage bucket <code>gallery</code>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Title</label>
                <Input
                  placeholder="e.g. Annual Tech Fest 2026 Keynote"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category Album</label>
                <Select
                  value={category}
                  onValueChange={(val: string | null) => {
                    if (val) setCategory(val as any);
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshops">Workshops</SelectItem>
                    <SelectItem value="classes">Classrooms &amp; Labs</SelectItem>
                    <SelectItem value="events">Tech Festivals &amp; Hackathons</SelectItem>
                    <SelectItem value="graduation">Graduation &amp; Convocation</SelectItem>
                    <SelectItem value="projects">Student Projects</SelectItem>
                    <SelectItem value="campus">Campus Facilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Caption / Description</label>
                <textarea
                  placeholder="Details of the occasion and batch cohort..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[70px]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Photo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {galleryList.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:border-purple-300 dark:hover:border-purple-900 transition-colors">
            <div className="h-44 bg-muted/60 flex items-center justify-center text-muted-foreground border-b relative">
              <ImageIcon className="h-12 w-12 opacity-40" />
              <div className="absolute top-2 end-2">
                <Badge variant="outline" className="capitalize text-[10px] bg-background/90 shadow-xs">
                  {item.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>Campus Album</span>
                <span>{item.date}</span>
              </div>
              <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
