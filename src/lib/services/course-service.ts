import { courses } from "@/lib/data/courses";
import type { Course, CurriculumModule } from "@/lib/types";
import type { PaginatedResult, QueryParams, MutationResult } from "./types";
import { queryItems } from "./types";

const searchFields: (keyof Course)[] = ["name", "slug", "description", "shortDescription", "category"];

export function getCourses(params: QueryParams = {}): PaginatedResult<Course> {
  return queryItems(courses, { pageSize: 12, ...params }, searchFields);
}

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id || c.slug === id);
}

export function createCourse(data: Omit<Course, "id" | "studentCount" | "batchCount">): MutationResult<Course> {
  const id = `course-${courses.length + 1}`;
  const newCourse: Course = {
    ...data,
    id,
    studentCount: 0,
    batchCount: 0,
  };
  courses.push(newCourse);
  return { success: true, data: newCourse };
}

export function updateCourse(id: string, data: Partial<Course>): MutationResult<Course> {
  const index = courses.findIndex((c) => c.id === id);
  if (index === -1) return { success: false, error: "Course not found" };
  courses[index] = { ...courses[index], ...data };
  return { success: true, data: courses[index] };
}

export function archiveCourse(id: string): MutationResult<Course> {
  return updateCourse(id, { isActive: false });
}

// Curriculum Management
export function addCurriculumModule(courseId: string, module: Omit<CurriculumModule, "id">): MutationResult<CurriculumModule> {
  const course = getCourseById(courseId);
  if (!course) return { success: false, error: "Course not found" };
  const id = `${course.slug}-m${course.curriculum.length + 1}`;
  const newModule: CurriculumModule = { ...module, id, order: course.curriculum.length + 1 };
  course.curriculum.push(newModule);
  return { success: true, data: newModule };
}

export function updateCurriculumModule(
  courseId: string,
  moduleId: string,
  data: Partial<CurriculumModule>
): MutationResult<CurriculumModule> {
  const course = getCourseById(courseId);
  if (!course) return { success: false, error: "Course not found" };
  const modIndex = course.curriculum.findIndex((m) => m.id === moduleId);
  if (modIndex === -1) return { success: false, error: "Module not found" };
  course.curriculum[modIndex] = { ...course.curriculum[modIndex], ...data };
  return { success: true, data: course.curriculum[modIndex] };
}

export function deleteCurriculumModule(courseId: string, moduleId: string): MutationResult<null> {
  const course = getCourseById(courseId);
  if (!course) return { success: false, error: "Course not found" };
  const modIndex = course.curriculum.findIndex((m) => m.id === moduleId);
  if (modIndex === -1) return { success: false, error: "Module not found" };
  course.curriculum.splice(modIndex, 1);
  // Re-index orders
  course.curriculum.forEach((m, idx) => {
    m.order = idx + 1;
  });
  return { success: true };
}

export function reorderCurriculumModules(courseId: string, moduleIds: string[]): MutationResult<CurriculumModule[]> {
  const course = getCourseById(courseId);
  if (!course) return { success: false, error: "Course not found" };
  const reordered: CurriculumModule[] = [];
  moduleIds.forEach((id, idx) => {
    const mod = course.curriculum.find((m) => m.id === id);
    if (mod) {
      mod.order = idx + 1;
      reordered.push(mod);
    }
  });
  course.curriculum = reordered;
  return { success: true, data: course.curriculum };
}
