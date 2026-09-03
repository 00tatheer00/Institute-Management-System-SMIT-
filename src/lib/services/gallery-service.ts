import type { GalleryItem } from "@/lib/types";
import { galleryItems as initialGallery } from "@/lib/data/misc";
import { queryItems, type PaginatedResult, type QueryParams } from "./types";

const galleryStore: GalleryItem[] = [...initialGallery];

const gallerySearchFields: (keyof GalleryItem)[] = ["title", "description", "category"];

export function getGalleryItems(params: QueryParams = {}): PaginatedResult<GalleryItem> {
  return queryItems(galleryStore, { pageSize: 12, ...params }, gallerySearchFields);
}

export function getAllGalleryItems(): GalleryItem[] {
  return galleryStore;
}

export function createGalleryItem(data: {
  title: string;
  description: string;
  image: string;
  category: "workshops" | "classes" | "events" | "graduation" | "projects" | "campus";
}): GalleryItem {
  const newItem: GalleryItem = {
    id: `gallery-${Date.now()}`,
    title: data.title,
    description: data.description,
    image: data.image,
    category: data.category,
    date: new Date().toISOString().split("T")[0],
  };

  galleryStore.unshift(newItem);
  return newItem;
}
