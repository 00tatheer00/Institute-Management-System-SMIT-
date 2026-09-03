"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isSupabaseConnected, loginAsDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push("/student");
    } else {
      setErrorMessage(res.error || "Invalid credentials. Please verify your email and password.");
    }
  };

  const handleDemoSignIn = (role: "admin" | "trainer" | "student") => {
    loginAsDemo(role);
    if (role === "admin") router.push("/admin");
    else if (role === "trainer") router.push("/trainer");
    else router.push("/student");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600/10 text-blue-600 mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Mohsin &amp; Huma IT Center
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your student coursework, trainer gradebook, or institutional management console.
          </p>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold">Portal Authentication</CardTitle>
            <CardDescription className="text-xs">
              Enter your registered institute credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@student.mhit.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-2"
              >
                {isLoading ? "Authenticating..." : "Sign In to Portal"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>

            {/* Quick Demo Access Bar when in Development Preview Mode */}
            {!isSupabaseConnected && (
              <div className="pt-4 border-t space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>Instant Demo Personas</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoSignIn("student")}
                    className="text-[11px] h-8 font-medium"
                  >
                    Student
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoSignIn("trainer")}
                    className="text-[11px] h-8 font-medium"
                  >
                    Trainer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoSignIn("admin")}
                    className="text-[11px] h-8 font-medium"
                  >
                    Admin
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          Need student admission or credentials help?{" "}
          <Link href="/verify-certificate" className="text-blue-600 hover:underline font-medium">
            Verify Certificate
          </Link>{" "}
          or contact MHIT Admissions.
        </div>
      </div>
    </div>
  );
}
