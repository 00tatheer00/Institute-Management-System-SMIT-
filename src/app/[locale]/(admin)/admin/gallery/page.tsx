import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { galleryItems } from "@/lib/data/misc";
import { Image as ImageIcon } from "lucide-react";

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Media & Gallery Manager"
        description="Campus photo archives, workshop pictures, and graduation album management."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Gallery" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-36 bg-muted/60 flex items-center justify-center text-muted-foreground border-b">
              <ImageIcon className="h-10 w-10 opacity-40" />
            </div>
            <CardContent className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize text-[10px]">
                  {item.category}
                </Badge>
                <span className="text-[11px] text-muted-foreground">{item.date}</span>
              </div>
              <h4 className="font-semibold text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
