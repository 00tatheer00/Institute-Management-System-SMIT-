import type { StudentProject, ProjectStatus } from "@/lib/types";
import { initialProjects } from "@/lib/data/projects";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const projectStore: StudentProject[] = [...initialProjects];

const projSearchFields: (keyof StudentProject)[] = [
  "title",
  "description",
  "studentName",
  "courseName",
  "category",
];

export function getAllProjects(params: QueryParams = {}): PaginatedResult<StudentProject> {
  return queryItems(projectStore, { pageSize: 12, ...params }, projSearchFields);
}

export function getPublishedProjects(params: QueryParams = {}): PaginatedResult<StudentProject> {
  const published = projectStore.filter((p) => p.isPublished);
  return queryItems(published, { pageSize: 9, ...params }, projSearchFields);
}

export function getFeaturedProjects(): StudentProject[] {
  return projectStore.filter((p) => p.isPublished && p.isFeatured);
}

export function getStudentProjects(studentId: string): StudentProject[] {
  return projectStore.filter((p) => p.studentId === studentId);
}

export function getProjectBySlug(slug: string): StudentProject | undefined {
  return projectStore.find((p) => p.slug === slug || p.id === slug);
}

export function createProject(data: {
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  batchId: string;
  technologies: string[];
  category: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  moduleName?: string;
  status?: ProjectStatus;
}): StudentProject {
  const slug = data.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const newProject: StudentProject = {
    id: `proj-${Date.now()}`,
    slug,
    title: data.title,
    description: data.description,
    studentId: data.studentId,
    studentName: data.studentName,
    courseId: data.courseId,
    courseName: data.courseName,
    batchId: data.batchId,
    technologies: data.technologies,
    category: data.category,
    image: data.image || "/images/courses/web-development.jpg",
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    moduleName: data.moduleName,
    status: data.status || "in-progress",
    isPublished: false,
    isFeatured: false,
    completedAt: new Date().toISOString().split("T")[0],
  };

  projectStore.unshift(newProject);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("student_projects")
      .insert({
        id: newProject.id,
        student_id: newProject.studentId,
        title: newProject.title,
        slug: newProject.slug,
        description: newProject.description,
        category: newProject.category,
        tech_stack: newProject.technologies,
        github_url: newProject.githubUrl || "https://github.com",
        live_url: newProject.liveUrl || "https://vercel.app",
        status: newProject.status as any,
        is_published: false,
        is_featured: false,
      } as any)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase project insert error:", error);
      });
  }

  return newProject;
}

export function toggleProjectPublish(id: string, isPublished: boolean): boolean {
  const proj = projectStore.find((p) => p.id === id);
  if (!proj) return false;
  proj.isPublished = isPublished;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("student_projects")
      .update({ is_published: isPublished } as any)
      .eq("id", id)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase project publish toggle error:", error);
      });
  }

  return true;
}

export function toggleProjectFeatured(id: string, isFeatured: boolean): boolean {
  const proj = projectStore.find((p) => p.id === id);
  if (!proj) return false;
  proj.isFeatured = isFeatured;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("student_projects")
      .update({ is_featured: isFeatured } as any)
      .eq("id", id)
      .then(({ error }: { error: any }) => {
        if (error) console.error("Supabase project featured toggle error:", error);
      });
  }

  return true;
}
