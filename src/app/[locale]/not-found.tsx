import { Button } from "@/components/ui/button";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 rounded-2xl shadow-lg">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
          <GraduationCap className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Error 404</span>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The resource, student record, or page you requested could not be located in the institute registry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Portal Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
