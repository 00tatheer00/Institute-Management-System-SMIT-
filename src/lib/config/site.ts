export const siteConfig = {
  name: "Mohsin and Huma IT Center × SMIT",
  shortName: "MHIT × SMIT",
  description:
    "Free technology education and training institute offering courses in Web Development, App Development, AI, Digital Marketing, Graphic Design, and more.",
  url: "https://mhit.edu.pk",
  ogImage: "/og-image.png",
  locale: "en",
  defaultLocale: "en" as const,
  locales: ["en", "ur"] as const,
  rtlLocales: ["ur"] as const,

  contact: {
    email: "info@mhit.edu.pk",
    phone: "+92-XXX-XXXXXXX",
    address: "Institute Address, City, Pakistan",
    workingHours: "Monday - Saturday, 9:00 AM - 5:00 PM",
  },

  social: {
    facebook: "https://facebook.com/mhit",
    twitter: "https://twitter.com/mhit",
    instagram: "https://instagram.com/mhit",
    linkedin: "https://linkedin.com/company/mhit",
    youtube: "https://youtube.com/@mhit",
    github: "https://github.com/mhit",
  },

  stats: {
    students: 1200,
    trainers: 18,
    programs: 12,
    batches: 30,
    successRate: 95,
    placements: 450,
  },
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export function isRtlLocale(locale: string): boolean {
  return (siteConfig.rtlLocales as readonly string[]).includes(locale);
}

export function getDirection(locale: string): "ltr" | "rtl" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}
