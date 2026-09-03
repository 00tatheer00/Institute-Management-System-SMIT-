import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { announcements } from "@/lib/data/misc";
import { Megaphone, AlertCircle } from "lucide-react";

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Announcements & Broadcasts"
        description="Public notifications, campus schedule changes, holiday alerts, and exam notices."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Announcements" },
        ]}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-brand" /> Broadcast History ({announcements.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Title & Message</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((ann) => (
                <TableRow key={ann.id}>
                  <TableCell className="max-w-md">
                    <p className="font-semibold text-sm">{ann.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{ann.content}</p>
                  </TableCell>
                  <TableCell className="capitalize text-xs font-mono">{ann.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{ann.publishedAt}</TableCell>
                  <TableCell className="text-xs">{ann.publishedBy}</TableCell>
                  <TableCell>
                    {ann.isImportant ? (
                      <Badge variant="destructive" className="text-[10px] flex items-center gap-1 w-fit">
                        <AlertCircle className="h-3 w-3" /> High
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Standard
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
