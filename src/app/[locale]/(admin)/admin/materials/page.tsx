import { setRequestLocale } from "next-intl/server";
import { getAllMaterials } from "@/lib/services/material-service";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen, FileText, Video, Link as LinkIcon,
  Presentation, ExternalLink, Download, BookOpen
} from "lucide-react";

export default async function AdminMaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const materials = getAllMaterials();
  const pdfCount = materials.filter((m) => m.type === "pdf").length;
  const videoCount = materials.filter((m) => m.type === "video").length;
  const linkCount = materials.filter((m) => m.type === "link").length;
  const presentationCount = materials.filter((m) => m.type === "presentation").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Resources & Materials"
        description="Oversee slide presentations, syllabus handouts, code repositories, and recorded video workshops across all departments."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Materials" },
        ]}
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-rose-600">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">PDF Guides</span>
          </div>
          <p className="text-2xl font-bold">{pdfCount}</p>
        </Card>
        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-blue-600">
            <Video className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Video Workshops</span>
          </div>
          <p className="text-2xl font-bold">{videoCount}</p>
        </Card>
        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-amber-600">
            <Presentation className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Slide Decks</span>
          </div>
          <p className="text-2xl font-bold">{presentationCount}</p>
        </Card>
        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-emerald-600">
            <LinkIcon className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Repositories</span>
          </div>
          <p className="text-2xl font-bold">{linkCount}</p>
        </Card>
      </div>

      {/* Materials Directory Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Institutional Material Catalog ({materials.length})
          </CardTitle>
          <CardDescription className="text-xs">
            Review published handouts, file sizes, and curriculum associations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase border-y">
                <tr>
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Program</th>
                  <th className="py-3 px-4 font-semibold">Instructor</th>
                  <th className="py-3 px-4 font-semibold">File Size</th>
                  <th className="py-3 px-4 font-semibold">Published</th>
                  <th className="py-3 px-4 font-semibold text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {materials.map((mat) => {
                  const course = courses.find((c) => c.id === mat.courseId);

                  return (
                    <tr key={mat.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {mat.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-muted">
                          {mat.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {course?.name || mat.courseId}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {mat.trainerName || "Faculty"}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                        {mat.fileSize || "Link"}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                        {new Date(mat.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <a
                          href={mat.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                            <ExternalLink className="h-3 w-3" /> Open
                          </Button>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
