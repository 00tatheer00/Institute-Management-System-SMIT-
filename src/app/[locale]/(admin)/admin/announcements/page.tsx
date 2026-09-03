"use client";

import { useState, useMemo } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "@/lib/services/announcement-service";
import type { Announcement } from "@/lib/types";
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
  Megaphone, Plus, Search, Trash2, AlertCircle,
  Calendar, CheckCircle2
} from "lucide-react";

export default function AdminAnnouncementsPage() {
  const [annList, setAnnList] = useState<Announcement[]>(() =>
    getAnnouncements({ pageSize: 100 }).data
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"academic" | "admission" | "event" | "general">("academic");
  const [isImportant, setIsImportant] = useState(false);

  const filteredAnnouncements = useMemo(() => {
    return annList.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q);

      const matchesCat = selectedCategory === "all" || a.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [annList, searchQuery, selectedCategory]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const created = createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      category,
      isImportant,
      publishedBy: "Admissions Directorate",
    });

    setAnnList([created, ...annList]);
    setIsCreateOpen(false);
    setTitle("");
    setContent("");
  };

  const handleDelete = (id: string) => {
    deleteAnnouncement(id);
    setAnnList(annList.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Campus Announcements & Broadcasts"
          description="Publish official institutional notices, holiday schedules, examination alerts, and event dispatches."
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Announcements" },
          ]}
        />

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-medium self-start sm:self-auto">
                <Plus className="h-4 w-4" /> New Announcement
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Publish Campus Notice</DialogTitle>
              <DialogDescription className="text-xs">
                Broadcast official communications to student and faculty portals
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Title</label>
                <Input
                  placeholder="e.g. Mid-Term Examination Dates Announced"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <Select
                  value={category}
                  onValueChange={(val: string | null) => {
                    if (val) setCategory(val as "academic" | "admission" | "event" | "general");
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic &amp; Exams</SelectItem>
                    <SelectItem value="admission">Admissions</SelectItem>
                    <SelectItem value="event">Campus Event</SelectItem>
                    <SelectItem value="general">General Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Notice Content</label>
                <textarea
                  placeholder="Full text of the broadcast announcement..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[90px]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="important-check"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="h-4 w-4 rounded accent-rose-600 cursor-pointer"
                />
                <label htmlFor="important-check" className="text-xs font-medium cursor-pointer">
                  Mark as High-Priority Banner Notice
                </label>
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
                  className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Broadcast Notice
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-9 text-xs"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(val: string | null) => {
                if (val) setSelectedCategory(val);
              }}
            >
              <SelectTrigger className="w-full sm:w-52 h-9 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="admission">Admissions</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Broadcast Archive ({filteredAnnouncements.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Active and archived campus communications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Title &amp; Notice</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Published</th>
                  <th className="py-3 px-4 font-semibold">Issued By</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAnnouncements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 max-w-md">
                      <p className="font-semibold text-foreground text-sm">{ann.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                        {ann.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                      {ann.publishedAt}
                    </td>
                    <td className="py-3 px-4 text-xs text-foreground">
                      {ann.publishedBy}
                    </td>
                    <td className="py-3 px-4">
                      {ann.isImportant ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          <AlertCircle className="h-3 w-3" /> High Priority
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => handleDelete(ann.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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
