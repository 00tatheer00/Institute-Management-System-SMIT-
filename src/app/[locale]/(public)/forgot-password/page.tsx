"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage(null);

    if (!isSupabaseConfigured()) {
      // Simulate successful request in offline/demo mode
      await new Promise((r) => setTimeout(r, 800));
      setIsLoading(false);
      setIsSent(true);
      return;
    }

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/student/settings`,
      });

      setIsLoading(false);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setIsSent(true);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600/10 text-blue-600 mb-2">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Reset Portal Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-bold">Password Recovery</CardTitle>
            <CardDescription className="text-xs">
              We will send an authorized password reset link to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSent ? (
              <div className="space-y-4 text-center py-2">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Reset Link Dispatched</h3>
                  <p className="text-xs text-muted-foreground">
                    If an account exists with <strong className="text-foreground">{email}</strong>, check your inbox for instructions.
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full text-xs h-9 gap-1.5 font-medium">
                    <ArrowLeft className="h-3.5 w-3.5" /> Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <Alert variant="destructive" className="py-2 text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Registered Email Address</Label>
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

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-2"
                  >
                    {isLoading ? "Sending Instructions..." : "Send Password Reset Link"}
                  </Button>

                  <div className="text-center pt-2">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back to Sign In
                    </Link>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
