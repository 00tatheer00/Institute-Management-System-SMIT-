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
import { ThreeParticleMesh } from "@/components/public/three-particle-mesh";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import {
  Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle,
  GraduationCap, Users, Settings, Loader2,
} from "lucide-react";

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
      if (res.role === "super-admin" || res.role === "admin" || res.role === "staff") {
        router.push("/admin");
      } else if (res.role === "trainer") {
        router.push("/trainer");
      } else {
        router.push("/student");
      }
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

  const demoPersonas = [
    {
      role: "student" as const,
      label: "Student",
      description: "Coursework & grades",
      icon: <GraduationCap className="h-5 w-5" />,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      role: "trainer" as const,
      label: "Trainer",
      description: "Classes & grading",
      icon: <Users className="h-5 w-5" />,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      role: "admin" as const,
      label: "Admin",
      description: "Full management",
      icon: <Settings className="h-5 w-5" />,
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-[90vh] flex relative overflow-hidden">
      {/* ─── Left Side: Animated 3D Gradient Mesh ─── */}
      <div className="hidden lg:flex lg:w-[45%] gradient-mesh relative items-center justify-center p-12 overflow-hidden">
        {/* Three.js interactive wave grid */}
        <ThreeParticleMesh color="#38bdf8" className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

        {/* Decorative shapes */}
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="hero-shape hero-shape-3" />
        <div className="absolute inset-0 dot-grid" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 max-w-md text-white space-y-6"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 shadow-depth">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight leading-tight">
            Mohsin & Huma<br />IT Center
          </h2>
          <p className="text-white/65 leading-relaxed">
            Access your student coursework, trainer gradebook, or institutional management console — all in one unified platform.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["Free Education", "Expert Trainers", "Modern Curriculum", "Career Support"].map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-medium text-white/80"
              >
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                {feature}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Right Side: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30">
        {/* Subtle decorative gradient orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 w-56 h-56 rounded-full bg-info/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md space-y-6 relative z-10"
        >
          {/* Mobile-only header */}
          <div className="text-center space-y-2 lg:hidden">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl gradient-brand shadow-brand mb-2">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              MHIT × SMIT Portal
            </h1>
          </div>

          <Card className="border-0 shadow-depth glass-card">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand" />
                Portal Authentication
              </CardTitle>
              <CardDescription className="text-xs">
                Enter your registered institute credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="py-2 text-xs">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-brand" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@student.mhit.edu.pk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-10 text-sm transition-all focus:shadow-glow-sm focus:border-brand/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] text-brand hover:text-brand/80 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-brand" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 h-10 text-sm transition-all focus:shadow-glow-sm focus:border-brand/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 gradient-brand text-white font-semibold text-sm gap-2 shadow-brand hover:shadow-lifted transition-all duration-300 hover:brightness-110"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In to Portal
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Demo Access */}
              {!isSupabaseConnected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="pt-4 border-t space-y-3"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Instant Demo Access</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {demoPersonas.map((persona) => (
                      <button
                        key={persona.role}
                        onClick={() => handleDemoSignIn(persona.role)}
                        className="group relative flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background p-3 text-center transition-all duration-300 hover:border-brand/30 hover:shadow-glow-sm hover:-translate-y-0.5"
                      >
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${persona.gradient} text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                          {persona.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{persona.label}</p>
                          <p className="text-[10px] text-muted-foreground">{persona.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-xs text-muted-foreground"
          >
            Need student admission or credentials help?{" "}
            <Link href="/verify-certificate" className="text-brand hover:underline font-medium">
              Verify Certificate
            </Link>{" "}
            or contact MHIT Admissions.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
