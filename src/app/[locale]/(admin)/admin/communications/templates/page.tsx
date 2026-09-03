"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  getAllTemplates,
  updateTemplate,
} from "@/lib/services/template-service";
import type { NotificationTemplate } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Search, Plus, Edit2, Check, ArrowLeft,
  MessageSquare, Mail, Smartphone, Bell, Globe
} from "lucide-react";

export default function AdminNotificationTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(() => getAllTemplates());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [editLang, setEditLang] = useState<"en" | "ur">("en");

  const categories = ["all", "admission", "academic", "attendance", "certificate", "event", "support"];

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory !== "all" && tpl.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        tpl.name.toLowerCase().includes(q) ||
        tpl.code.toLowerCase().includes(q) ||
        tpl.titleEn.toLowerCase().includes(q) ||
        tpl.titleUr.includes(q)
      );
    }
    return true;
  });

  const handleSaveEdit = () => {
    if (!editingTemplate) return;
    const updated = updateTemplate(editingTemplate.id, editingTemplate);
    if (updated) {
      setTemplates(getAllTemplates());
      setEditingTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/communications" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Notification Templates
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Bilingual institutional templates for admission, academic alerts, attendance warnings, and certificates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/communications">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              Back to Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className="text-xs h-8 capitalize"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="ps-8 text-xs h-8"
          />
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((tpl) => (
          <Card key={tpl.id} className="relative flex flex-col justify-between hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-bold">{tpl.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {tpl.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {tpl.code}
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTemplate(tpl)}
                  className="h-7 w-7 p-0 shrink-0"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Supported Channels */}
              <div className="flex flex-wrap gap-1 mt-2">
                {tpl.channels.map((ch) => (
                  <span
                    key={ch}
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize"
                  >
                    {ch === "whatsapp" ? <MessageSquare className="h-2.5 w-2.5 text-emerald-600" /> :
                     ch === "email" ? <Mail className="h-2.5 w-2.5 text-blue-600" /> :
                     ch === "sms" ? <Smartphone className="h-2.5 w-2.5 text-amber-600" /> :
                     <Bell className="h-2.5 w-2.5" />}
                    {ch}
                  </span>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              {/* English Version */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <Globe className="h-3 w-3" /> English
                </span>
                <p className="font-semibold text-foreground text-xs">{tpl.titleEn}</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{tpl.bodyEn}</p>
              </div>

              {/* Urdu Version */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1 text-end" dir="rtl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1 justify-end">
                  اردو <Globe className="h-3 w-3" />
                </span>
                <p className="font-semibold text-foreground text-xs font-serif">{tpl.titleUr}</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-serif">{tpl.bodyUr}</p>
              </div>

              {/* Variables */}
              <div className="pt-1">
                <span className="text-[10px] text-muted-foreground font-semibold block mb-1">Placeholders:</span>
                <div className="flex flex-wrap gap-1">
                  {tpl.variables.map((v) => (
                    <code key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
                      {"{{" + v + "}}"}
                    </code>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal Dialog */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-xl shadow-2xl border-border animate-in fade-in zoom-in-95">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Edit Notification Template</CardTitle>
                  <CardDescription className="text-xs font-mono">{editingTemplate.code}</CardDescription>
                </div>
                <div className="flex items-center gap-1 border rounded-lg p-0.5">
                  <Button
                    type="button"
                    variant={editLang === "en" ? "default" : "ghost"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setEditLang("en")}
                  >
                    English
                  </Button>
                  <Button
                    type="button"
                    variant={editLang === "ur" ? "default" : "ghost"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setEditLang("ur")}
                  >
                    اردو
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Template Display Name</label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              {editLang === "en" ? (
                <>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Title (English)</label>
                    <Input
                      value={editingTemplate.titleEn}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, titleEn: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">Body Content (English)</label>
                    <Textarea
                      rows={4}
                      value={editingTemplate.bodyEn}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, bodyEn: e.target.value })}
                      className="text-xs font-sans"
                    />
                  </div>
                </>
              ) : (
                <div dir="rtl" className="space-y-3 text-end">
                  <div>
                    <label className="text-xs font-semibold mb-1 block">عنوان (اردو)</label>
                    <Input
                      value={editingTemplate.titleUr}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, titleUr: e.target.value })}
                      className="text-xs font-serif text-end"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block">پیغام کا متن (اردو)</label>
                    <Textarea
                      rows={4}
                      value={editingTemplate.bodyUr}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, bodyUr: e.target.value })}
                      className="text-xs font-serif text-end"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => setEditingTemplate(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} className="gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
