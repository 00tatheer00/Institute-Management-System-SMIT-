"use client";

import { useState } from "react";
import { getAllGalleryItems } from "@/lib/services/gallery-service";
import type { GalleryItem } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Sparkles, Camera } from "lucide-react";

export default function PublicGalleryPage() {
  const [items] = useState<GalleryItem[]>(() => getAllGalleryItems());
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container-custom max-w-6xl mx-auto space-y-10 px-4">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Camera className="h-3.5 w-3.5" /> Campus Life &amp; Media Archive
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Life at MHIT × SMIT
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Glimpses of daily laboratory coding sessions, annual hackathons, technology workshops, and graduation convocations.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="text-xs h-8"
          >
            All Photographs ({items.length})
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "workshops" ? "default" : "outline"}
            onClick={() => setSelectedCategory("workshops")}
            className="text-xs h-8"
          >
            Workshops &amp; Bootcamps
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "events" ? "default" : "outline"}
            onClick={() => setSelectedCategory("events")}
            className="text-xs h-8"
          >
            Hackathons &amp; Tech Fests
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "classes" ? "default" : "outline"}
            onClick={() => setSelectedCategory("classes")}
            className="text-xs h-8"
          >
            Lab Sessions
          </Button>
          <Button
            size="sm"
            variant={selectedCategory === "graduation" ? "default" : "outline"}
            onClick={() => setSelectedCategory("graduation")}
            className="text-xs h-8"
          >
            Graduation Ceremonies
          </Button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-900 transition-all group"
            >
              <div className="h-52 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 flex items-center justify-center text-white relative">
                <ImageIcon className="h-12 w-12 text-purple-400/40 group-hover:scale-110 transition-transform" />
                <div className="absolute top-3 end-3">
                  <Badge variant="outline" className="capitalize text-[10px] bg-background/90 font-semibold shadow-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Campus Album</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
