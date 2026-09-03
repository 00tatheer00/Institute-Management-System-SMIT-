import { initialMaterials } from "@/lib/data/materials";
import type { LearningMaterial, MaterialVisibility } from "@/lib/types";
import type { MutationResult } from "./types";

const materialStore: LearningMaterial[] = [...initialMaterials];

export function getMaterials(
  courseId?: string,
  batchId?: string,
  visibility: MaterialVisibility = "published"
): LearningMaterial[] {
  return materialStore.filter((m) => {
    if (visibility && m.visibility !== visibility && visibility !== "draft") {
      return false;
    }
    if (courseId && m.courseId !== courseId) {
      return false;
    }
    if (batchId && m.batchId && m.batchId !== batchId) {
      return false;
    }
    return true;
  });
}

export function getAllMaterials(): LearningMaterial[] {
  return materialStore;
}

export function getMaterialById(id: string): LearningMaterial | undefined {
  return materialStore.find((m) => m.id === id);
}

export function createMaterial(
  data: Omit<LearningMaterial, "id" | "publishedAt">
): MutationResult<LearningMaterial> {
  const newMaterial: LearningMaterial = {
    ...data,
    id: `mat-${Date.now()}`,
    publishedAt: new Date().toISOString(),
  };

  materialStore.unshift(newMaterial);
  return { success: true, data: newMaterial };
}

export function updateMaterial(
  id: string,
  data: Partial<LearningMaterial>
): MutationResult<LearningMaterial> {
  const index = materialStore.findIndex((m) => m.id === id);
  if (index === -1) return { success: false, error: "Material not found" };

  const updated: LearningMaterial = {
    ...materialStore[index],
    ...data,
  };

  materialStore[index] = updated;
  return { success: true, data: updated };
}

export function deleteMaterial(id: string): MutationResult<null> {
  const index = materialStore.findIndex((m) => m.id === id);
  if (index === -1) return { success: false, error: "Material not found" };

  materialStore.splice(index, 1);
  return { success: true };
}
