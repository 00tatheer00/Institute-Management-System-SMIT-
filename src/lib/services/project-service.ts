import type { StudentProject, ProjectStatus } from "@/lib/types";
import { initialProjects } from "@/lib/data/projects";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

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

/**
 * Public Project Showcase Query
 * Returns ONLY projects where isPublished === true.
 * Protects student privacy: only name, program, technologies, and public links are shown.
 */
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
  return newProject;
}

export function toggleProjectPublish(id: string, isPublished: boolean): boolean {
  const proj = projectStore.find((p) => p.id === id);
  if (!proj) return false;

  proj.isPublished = isPublished;
  if (isPublished && proj.status !== "published") {
    proj.status = "published";
  }
  return true;
}

export function toggleProjectFeatured(id: string, isFeatured: boolean): boolean {
  const proj = projectStore.find((p) => p.id === id);
  if (!proj) return false;

  proj.isFeatured = isFeatured;
  return true;
}
