export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "super-admin" | "admin" | "trainer" | "student" | "staff";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: "super-admin" | "admin" | "trainer" | "student" | "staff";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: "super-admin" | "admin" | "trainer" | "student" | "staff";
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          profile_id: string | null;
          registration_id: string;
          name: string;
          email: string;
          phone: string;
          cnic: string;
          city: string;
          course_id: string;
          batch_id: string;
          status: "active" | "inactive" | "graduated" | "dropped" | "suspended";
          attendance_percentage: number;
          gpa: number;
          enrolled_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          registration_id: string;
          name: string;
          email: string;
          phone: string;
          cnic: string;
          city: string;
          course_id: string;
          batch_id: string;
          status?: "active" | "inactive" | "graduated" | "dropped" | "suspended";
          attendance_percentage?: number;
          gpa?: number;
          enrolled_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          registration_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          cnic?: string;
          city?: string;
          course_id?: string;
          batch_id?: string;
          status?: "active" | "inactive" | "graduated" | "dropped" | "suspended";
          attendance_percentage?: number;
          gpa?: number;
        };
      };
      courses: {
        Row: {
          id: string;
          code: string;
          name: string;
          slug: string;
          category: string;
          level: "beginner" | "intermediate" | "advanced";
          duration_weeks: number;
          description: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          slug: string;
          category: string;
          level?: "beginner" | "intermediate" | "advanced";
          duration_weeks: number;
          description: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          slug?: string;
          category?: string;
          level?: "beginner" | "intermediate" | "advanced";
          duration_weeks?: number;
          description?: string;
          is_published?: boolean;
        };
      };
      batches: {
        Row: {
          id: string;
          name: string;
          course_id: string;
          trainer_id: string;
          room: string;
          campus: string;
          total_seats: number;
          enrolled_seats: number;
          status: "upcoming" | "enrolling" | "in-progress" | "completed" | "cancelled";
          start_date: string;
          end_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          course_id: string;
          trainer_id: string;
          room: string;
          campus?: string;
          total_seats?: number;
          enrolled_seats?: number;
          status?: "upcoming" | "enrolling" | "in-progress" | "completed" | "cancelled";
          start_date: string;
          end_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          course_id?: string;
          trainer_id?: string;
          room?: string;
          campus?: string;
          total_seats?: number;
          enrolled_seats?: number;
          status?: "upcoming" | "enrolling" | "in-progress" | "completed" | "cancelled";
          start_date?: string;
          end_date?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          class_session_id: string;
          batch_id: string;
          student_id: string;
          date: string;
          status: "present" | "absent" | "late" | "excused";
          marked_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_session_id: string;
          batch_id: string;
          student_id: string;
          date: string;
          status: "present" | "absent" | "late" | "excused";
          marked_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          status?: "present" | "absent" | "late" | "excused";
          marked_by?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          batch_id: string;
          course_id: string;
          title: string;
          description: string;
          due_date: string;
          total_marks: number;
          status: "draft" | "published" | "closed" | "archived";
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          batch_id: string;
          course_id: string;
          title: string;
          description: string;
          due_date: string;
          total_marks?: number;
          status?: "draft" | "published" | "closed" | "archived";
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          due_date?: string;
          total_marks?: number;
          status?: "draft" | "published" | "closed" | "archived";
        };
      };
      assignment_submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          deployed_url: string;
          github_url: string | null;
          notes: string | null;
          status: "not-submitted" | "submitted" | "late" | "graded" | "returned";
          marks: number | null;
          feedback: string | null;
          graded_by: string | null;
          graded_at: string | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          deployed_url: string;
          github_url?: string | null;
          notes?: string | null;
          status?: "not-submitted" | "submitted" | "late" | "graded" | "returned";
          marks?: number | null;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          deployed_url?: string;
          github_url?: string | null;
          notes?: string | null;
          status?: "not-submitted" | "submitted" | "late" | "graded" | "returned";
          marks?: number | null;
          feedback?: string | null;
          graded_by?: string | null;
          graded_at?: string | null;
        };
      };
      certificates: {
        Row: {
          id: string;
          certificate_number: string;
          student_id: string;
          student_name: string;
          course_id: string;
          course_name: string;
          batch_id: string;
          issue_date: string;
          verification_hash: string;
          status: "issued" | "revoked" | "pending";
          grade: string;
          qr_code_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          certificate_number: string;
          student_id: string;
          student_name: string;
          course_id: string;
          course_name: string;
          batch_id: string;
          issue_date: string;
          verification_hash: string;
          status?: "issued" | "revoked" | "pending";
          grade: string;
          qr_code_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          status?: "issued" | "revoked" | "pending";
          verification_hash?: string;
        };
      };
      student_documents: {
        Row: {
          id: string;
          student_id: string;
          document_type: "cnic-front" | "cnic-back" | "matric-marksheet" | "inter-marksheet" | "photo" | "admission-slip";
          file_name: string;
          file_url: string;
          file_size: number;
          status: "verified" | "pending" | "rejected";
          rejection_reason: string | null;
          uploaded_at: string;
          verified_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          document_type: "cnic-front" | "cnic-back" | "matric-marksheet" | "inter-marksheet" | "photo" | "admission-slip";
          file_name: string;
          file_url: string;
          file_size?: number;
          status?: "verified" | "pending" | "rejected";
          rejection_reason?: string | null;
          uploaded_at?: string;
          verified_at?: string | null;
        };
        Update: {
          id?: string;
          status?: "verified" | "pending" | "rejected";
          rejection_reason?: string | null;
          verified_at?: string | null;
        };
      };
      student_projects: {
        Row: {
          id: string;
          student_id: string;
          title: string;
          slug: string;
          description: string;
          category: string;
          tech_stack: string[];
          github_url: string;
          live_url: string;
          status: "idea" | "in-progress" | "completed" | "published";
          is_published: boolean;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          title: string;
          slug: string;
          description: string;
          category?: string;
          tech_stack?: string[];
          github_url: string;
          live_url: string;
          status?: "idea" | "in-progress" | "completed" | "published";
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          tech_stack?: string[];
          github_url?: string;
          live_url?: string;
          status?: "idea" | "in-progress" | "completed" | "published";
          is_published?: boolean;
          is_featured?: boolean;
        };
      };
      support_tickets: {
        Row: {
          id: string;
          ticket_number: string;
          student_id: string;
          student_name: string;
          category: "academic" | "fees" | "portal-bug" | "attendance" | "certificate" | "general";
          priority: "low" | "medium" | "high" | "urgent";
          status: "open" | "in-progress" | "resolved" | "closed";
          subject: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ticket_number: string;
          student_id: string;
          student_name: string;
          category?: "academic" | "fees" | "portal-bug" | "attendance" | "certificate" | "general";
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in-progress" | "resolved" | "closed";
          subject: string;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: "academic" | "fees" | "portal-bug" | "attendance" | "certificate" | "general";
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "open" | "in-progress" | "resolved" | "closed";
          subject?: string;
          description?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string;
          actor_name: string;
          actor_role: string;
          action: string;
          resource: string;
          resource_id: string | null;
          details: string;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          actor_name: string;
          actor_role: string;
          action: string;
          resource: string;
          resource_id?: string | null;
          details: string;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          details?: string;
        };
      };
      import_jobs: {
        Row: {
          id: string;
          file_name: string;
          file_size: number;
          data_type: string;
          total_rows: number;
          imported_rows: number;
          failed_rows: number;
          status: "pending" | "validating" | "validated" | "importing" | "completed" | "failed";
          imported_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_size?: number;
          data_type: string;
          total_rows?: number;
          imported_rows?: number;
          failed_rows?: number;
          status?: "pending" | "validating" | "validated" | "importing" | "completed" | "failed";
          imported_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          total_rows?: number;
          imported_rows?: number;
          failed_rows?: number;
          status?: "pending" | "validating" | "validated" | "importing" | "completed" | "failed";
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
