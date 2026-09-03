"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courses } from "@/lib/data/courses";
import { batches } from "@/lib/data/batches";
import { createStudent } from "@/lib/services/student-service";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

const studentSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters"),
  fatherName: z.string().min(3, "Father's name must be at least 3 characters"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC format must be XXXXX-XXXXXXX-X (e.g. 42101-1234567-1)"),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  emergencyContact: z.string().optional(),
  education: z.string().min(1, "Please select education level"),
  courseId: z.string().min(1, "Please select a course"),
  batchId: z.string().min(1, "Please select a batch"),
  enrolledAt: z.string().min(1, "Enrollment date is required"),
  status: z.enum(["active", "inactive", "graduated", "dropped", "suspended"]),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export default function NewStudentPage() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      status: "active",
      enrolledAt: new Date().toISOString().split("T")[0],
      city: "Karachi",
      gender: "male",
      education: "Intermediate",
    },
  });

  const availableBatches = batches.filter(
    (b) => !selectedCourse || b.courseId === selectedCourse
  );

  const onSubmit = async (values: StudentFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = createStudent({
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: `/images/students/student-${Math.floor(Math.random() * 10) + 1}.jpg`,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        cnic: values.cnic,
        address: values.address,
        city: values.city,
        education: values.education,
        courseId: values.courseId,
        batchId: values.batchId,
        status: values.status,
        enrolledAt: values.enrolledAt,
        attendancePercentage: 100,
        gpa: 4.0,
        completedAssignments: 0,
        totalAssignments: 20,
      });

      if (res.success && res.data) {
        setSubmitSuccess(res.data.registrationId);
        setTimeout(() => {
          router.push(`/admin/students/${res.data!.id}`);
        }, 1500);
      } else {
        setSubmitError(res.error || "Failed to create student record.");
      }
    } catch {
      setSubmitError("An unexpected error occurred while creating student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Add New Student"
        description="Enroll a new student and generate official registration record."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Students", href: "/admin/students" },
          { label: "New Student" },
        ]}
        actions={
          <Link href="/admin/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 me-2" /> Back to Students
            </Button>
          </Link>
        }
      />

      {submitSuccess && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Student Enrolled Successfully!</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Assigned Registration ID: <strong>{submitSuccess}</strong>. Redirecting to student profile...
            </p>
          </div>
        </div>
      )}

      {submitError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Error Submitting Form</p>
            <p className="text-xs text-red-700 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-brand" /> Personal Information
            </CardTitle>
            <CardDescription>
              Basic identity credentials and demographic details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Muhammad Ali Khan"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherName">
                Father's Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fatherName"
                placeholder="Tariq Mahmood Khan"
                {...register("fatherName")}
              />
              {errors.fatherName && (
                <p className="text-xs text-destructive">{errors.fatherName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val: string | null) => {
                  if (val) setValue("gender", val as "male" | "female" | "other");
                }}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cnic">
                CNIC / B-Form Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cnic"
                placeholder="42101-1234567-1"
                {...register("cnic")}
              />
              <p className="text-[11px] text-muted-foreground">Format: 5 digits - 7 digits - 1 digit (with hyphens)</p>
              {errors.cnic && (
                <p className="text-xs text-destructive">{errors.cnic.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand" /> Contact & Residence
            </CardTitle>
            <CardDescription>
              Address and emergency contact details for student notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="+92-300-1234567"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                placeholder="Karachi"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
              <Input
                id="emergencyContact"
                placeholder="+92-321-9876543 (Guardian)"
                {...register("emergencyContact")}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">
                Residential Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                placeholder="House #, Street, Area, Sector..."
                rows={2}
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Academic & Enrollment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brand" /> Academic & Program Enrollment
            </CardTitle>
            <CardDescription>
              Assign student to an active course and designated cohort batch
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="education">
                Last Education Qualification <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue="Intermediate"
                onValueChange={(val: string | null) => {
                  if (val) setValue("education", val);
                }}
              >
                <SelectTrigger id="education">
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Matric">Matric / O-Level</SelectItem>
                  <SelectItem value="Intermediate">Intermediate / A-Level</SelectItem>
                  <SelectItem value="DAE">DAE (Diploma)</SelectItem>
                  <SelectItem value="Bachelor's">Bachelor's Degree</SelectItem>
                  <SelectItem value="Master's">Master's Degree</SelectItem>
                </SelectContent>
              </Select>
              {errors.education && (
                <p className="text-xs text-destructive">{errors.education.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrolledAt">
                Enrollment Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="enrolledAt"
                type="date"
                {...register("enrolledAt")}
              />
              {errors.enrolledAt && (
                <p className="text-xs text-destructive">{errors.enrolledAt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">
                Select Course <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val: string | null) => {
                  if (val) {
                    setSelectedCourse(val);
                    setValue("courseId", val);
                    setValue("batchId", "");
                  }
                }}
              >
                <SelectTrigger id="courseId">
                  <SelectValue placeholder="Choose technology course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.courseId && (
                <p className="text-xs text-destructive">{errors.courseId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="batchId">
                Select Cohort Batch <span className="text-destructive">*</span>
              </Label>
              <Select
                disabled={!selectedCourse}
                onValueChange={(val: string | null) => {
                  if (val) setValue("batchId", val);
                }}
              >
                <SelectTrigger id="batchId">
                  <SelectValue placeholder={selectedCourse ? "Select batch" : "Choose course first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} — Room {b.room} ({b.enrolledSeats}/{b.totalSeats} seats)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.batchId && (
                <p className="text-xs text-destructive">{errors.batchId.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="status">Student Enrollment Status</Label>
              <Select
                defaultValue="active"
                onValueChange={(val: string | null) => {
                  if (val) setValue("status", val as "active" | "inactive" | "graduated" | "dropped" | "suspended");
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Currently Studying)</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="graduated">Graduated (Completed Program)</SelectItem>
                  <SelectItem value="dropped">Dropped Out</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Document Uploads Architecture (Ready for Supabase Storage) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand" /> Document Attachments
            </CardTitle>
            <CardDescription>
              Architected for future Supabase Storage buckets: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">student-documents/</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Passport-size Photograph", desc: "JPG/PNG up to 2MB" },
              { label: "CNIC / B-Form Copy", desc: "Front & Back Scan PDF/JPG" },
              { label: "Educational Certificate", desc: "Matric/Inter Certificate PDF" },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed rounded-lg p-5 text-center flex flex-col items-center justify-center hover:border-brand/50 transition-colors bg-muted/20 cursor-pointer"
              >
                <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-2">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold">{doc.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{doc.desc}</p>
                <span className="mt-3 text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-medium">
                  Storage Ready
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/students">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? "Creating Student..." : "Create Student Record"}
          </Button>
        </div>
      </form>
    </div>
  );
}
