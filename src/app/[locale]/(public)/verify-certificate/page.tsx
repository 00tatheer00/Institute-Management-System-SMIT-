"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyCertificate, type PublicVerifiedCertificate } from "@/lib/services/certificate-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Award, Search, CheckCircle2, XCircle, ShieldCheck,
  Building, Calendar, GraduationCap, ExternalLink, Printer
} from "lucide-react";

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [certInput, setCertInput] = useState(initialId);
  const [result, setResult] = useState<PublicVerifiedCertificate | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialId) {
      const res = verifyCertificate(initialId);
      setResult(res);
      setSearched(true);
    }
  }, [initialId]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;

    const res = verifyCertificate(certInput.trim());
    setResult(res);
    setSearched(true);
  };

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background min-h-[80vh]">
      <div className="container-custom max-w-3xl mx-auto space-y-8 px-4">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Official Verification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Verify Digital Certificate
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Authenticate official academic certificates issued by Mohsin and Huma IT Center × SMIT. Enter the certificate credential code below.
          </p>
        </div>

        {/* Search Form Card */}
        <Card className="shadow-lg border-amber-200 dark:border-amber-900/50">
          <CardContent className="p-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Award className="absolute start-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="e.g. MH-WD-2026-00124"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    className="ps-10 h-11 text-sm font-mono uppercase"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold gap-2 text-sm"
                >
                  <Search className="h-4 w-4" /> Verify Credential
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Try sample code: <code className="font-bold text-foreground cursor-pointer" onClick={() => setCertInput("MH-WD-2026-00124")}>MH-WD-2026-00124</code></span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit Cryptographic Integrity
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result Section */}
        {searched && (
          result ? (
            result.status === "revoked" ? (
              <Card className="border-2 border-rose-500 shadow-xl overflow-hidden animate-in fade-in-50 duration-300">
                <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <XCircle className="h-5 w-5" /> Revoked / Cancelled Credential
                  </div>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                    STATUS: REVOKED
                  </span>
                </div>
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="text-center space-y-1.5 border-b pb-4">
                    <h2 className="text-xl font-black text-rose-600">
                      WARNING: This Certificate Has Been Revoked
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Certificate Serial: <code className="font-mono font-bold text-foreground">{result.certificateId}</code>
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-center max-w-lg mx-auto leading-relaxed">
                    Official Notice: This credential was previously issued to <strong>{result.studentName}</strong> for <strong>{result.courseName}</strong> (Cohort {result.batchName}) but has been formally cancelled or invalidated by the SMIT Academic Governing Council. It is no longer valid.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-emerald-500 shadow-xl overflow-hidden animate-in fade-in-50 duration-300">
                <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" /> Authentic Certified Credential
                  </div>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                    STATUS: VERIFIED
                  </span>
                </div>

                <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1.5 border-b pb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                    {result.institute}
                  </p>
                  <h2 className="text-2xl font-black text-foreground">
                    {result.studentName}
                  </h2>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {result.courseName} • Cohort {result.batchName}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-muted/30 border space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Certificate ID</span>
                    <strong className="font-mono text-foreground text-xs">{result.certificateId}</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Awarded Grade</span>
                    <strong className="text-emerald-600 font-bold text-sm">Grade {result.grade}</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Date of Issue</span>
                    <strong className="font-mono text-foreground">{result.issueDate}</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Certification</span>
                    <strong className="text-foreground">Official Diploma</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 text-xs text-muted-foreground space-y-1">
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    Data Privacy Guarantee:
                  </p>
                  <p>
                    In accordance with institute confidentiality standards, personal identity information (CNIC, contact numbers, email, and address) is permanently redacted from public verification interfaces.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 gap-1.5"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-3.5 w-3.5" /> Print Verification Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card className="border-rose-300 dark:border-rose-900/60 shadow-md">
              <CardContent className="p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
                  <XCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Certificate Record Not Found
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  No issued credential matching <strong>&quot;{certInput}&quot;</strong> was located in the institute registrar database. Please ensure the code is spelled correctly or contact the administration office.
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-muted-foreground">Loading verification portal...</div>}>
      <VerifyCertificateContent />
    </Suspense>
  );
}
