import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mhit.edu.pk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/en/",
          "/ur/",
          "/en/about",
          "/ur/about",
          "/en/courses",
          "/ur/courses",
          "/en/courses/*",
          "/ur/courses/*",
          "/en/trainers",
          "/ur/trainers",
          "/en/batches",
          "/ur/batches",
          "/en/admissions",
          "/ur/admissions",
          "/en/events",
          "/ur/events",
          "/en/events/*",
          "/ur/events/*",
          "/en/gallery",
          "/ur/gallery",
          "/en/projects",
          "/ur/projects",
          "/en/projects/*",
          "/ur/projects/*",
          "/en/announcements",
          "/ur/announcements",
          "/en/faq",
          "/ur/faq",
          "/en/contact",
          "/ur/contact",
          "/en/verify-certificate",
          "/ur/verify-certificate",
        ],
        disallow: [
          "/*/admin/",
          "/*/admin/*",
          "/*/trainer/",
          "/*/trainer/*",
          "/*/student/",
          "/*/student/*",
          "/api/",
          "/api/*",
          "/auth/",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
