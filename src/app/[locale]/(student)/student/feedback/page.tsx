"use client";

import { useState } from "react";
import { submitFeedback, getStudentFeedback } from "@/lib/services/feedback-service";
import type { StudentFeedback, FeedbackCategory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star, MessageSquare, CheckCircle2, Shield,
  Send, UserCheck, HeartHandshake, EyeOff
} from "lucide-react";

export default function StudentFeedbackPage() {
  const [history, setHistory] = useState<StudentFeedback[]>(() =>
    getStudentFeedback("student-1")
  );

  const [category, setCategory] = useState<FeedbackCategory>("trainer");
  const [targetName, setTargetName] = useState("Sir Ahmed Hassan");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newFb = submitFeedback({
      studentId: "student-1",
      studentName: "Muhammad Khan",
      isAnonymous,
      category,
      targetId: "target-1",
      targetName,
      rating,
      comment: comment.trim(),
    });

    setHistory([newFb, ...history]);
    setComment("");
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <HeartHandshake className="h-3.5 w-3.5" />
          Voice of the Student
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Course & Trainer Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Help the academic committee enhance pedagogical quality, lab facilities, and mentoring standards
        </p>
      </div>

      {submittedSuccess && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Thank you! Your feedback has been recorded and submitted to the Quality Assurance Directorate.
        </div>
      )}

      {/* Submission Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Share Your Evaluation</CardTitle>
          <CardDescription className="text-xs">
            Evaluations are reviewed by the Academic Directorate. You may submit anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Evaluation Subject
                </label>
                <Select
                  value={category}
                  onValueChange={(val: string | null) => {
                    if (val) {
                      setCategory(val as FeedbackCategory);
                      if (val === "trainer") setTargetName("Sir Ahmed Hassan");
                      else if (val === "course") setTargetName("Web Development");
                      else setTargetName("Main Campus Facilities");
                    }
                  }}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trainer">Faculty Trainer</SelectItem>
                    <SelectItem value="course">Curriculum & Course</SelectItem>
                    <SelectItem value="facilities">Lab Facilities & Hardware</SelectItem>
                    <SelectItem value="management">Administration & Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Target Name / Reference
                </label>
                <Input
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 rounded-md hover:bg-muted transition-colors focus:outline-hidden"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted stroke-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-muted-foreground ms-2">
                  {rating === 5
                    ? "Outstanding (5/5)"
                    : rating === 4
                    ? "Very Good (4/5)"
                    : rating === 3
                    ? "Satisfactory (3/5)"
                    : rating === 2
                    ? "Needs Improvement (2/5)"
                    : "Unsatisfactory (1/5)"}
                </span>
              </div>
            </div>

            {/* Qualitative Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Your Constructive Review & Suggestions
              </label>
              <textarea
                placeholder="What did you appreciate most? What could be improved regarding pacing, practical exercises, or clarity?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-xs min-h-[90px]"
                required
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-2.5">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-semibold">Submit Anonymously</p>
                  <p className="text-[11px] text-muted-foreground">
                    Your name and roll number will be concealed from the instructor
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="gap-1.5 text-xs h-8">
                <Send className="h-3 w-3" /> Submit Feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Past Feedback History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">My Submitted Feedback</CardTitle>
          <CardDescription className="text-xs">
            Review your previously submitted evaluations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="p-3.5 rounded-lg border bg-card space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{item.targetName}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-muted">
                    {item.category}
                  </span>
                  {item.isAnonymous && (
                    <span className="text-[10px] text-muted-foreground italic">(Submitted Anonymously)</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span className="text-xs font-bold">{item.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic leading-relaxed">
                &quot;{item.comment}&quot;
              </p>

              <div className="text-[10px] text-muted-foreground text-end font-mono">
                {item.createdAt}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
