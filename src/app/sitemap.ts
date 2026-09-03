import { MetadataRoute } from "next";
import { courses } from "@/lib/data/courses";
import { initialProjects } from "@/lib/data/projects";
import { events } from "@/lib/data/misc";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mhit.edu.pk";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "ur"];
  const staticRoutes = [
    "",
    "/about",
    "/courses",
    "/trainers",
    "/batches",
    "/admissions",
    "/events",
    "/gallery",
    "/projects",
    "/success-stories",
    "/announcements",
    "/faq",
    "/contact",
    "/verify-certificate",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes for each locale
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }

    // Dynamic Course details
    for (const course of courses) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/courses/${course.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    // Dynamic Project details
    for (const project of initialProjects) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    // Dynamic Event details
    for (const event of events) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/events/${event.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return sitemapEntries;
}
