import type { NavItem, NavGroup } from "@/lib/types";

// --- Public Website Navigation ---
export const publicNavItems: NavItem[] = [
  { titleKey: "nav.home", href: "/" },
  { titleKey: "nav.about", href: "/about" },
  { titleKey: "nav.courses", href: "/courses" },
  { titleKey: "nav.trainers", href: "/trainers" },
  { titleKey: "nav.batches", href: "/batches" },
  { titleKey: "nav.admissions", href: "/admissions" },
  {
    titleKey: "nav.more",
    href: "#",
    children: [
      { titleKey: "nav.events", href: "/events" },
      { titleKey: "nav.gallery", href: "/gallery" },
      { titleKey: "nav.projects", href: "/projects" },
      { titleKey: "nav.successStories", href: "/success-stories" },
      { titleKey: "nav.announcements", href: "/announcements" },
      { titleKey: "nav.faq", href: "/faq" },
      { titleKey: "nav.verifyCertificate", href: "/verify-certificate" },
    ],
  },
  { titleKey: "nav.contact", href: "/contact" },
];

// --- Admin Navigation ---
export const adminNavGroups: NavGroup[] = [
  {
    titleKey: "admin.nav.main",
    items: [
      { titleKey: "admin.nav.dashboard", href: "/admin", icon: "LayoutDashboard" },
      { titleKey: "admin.nav.import", href: "/admin/import", icon: "Upload" },
      { titleKey: "admin.nav.imports", href: "/admin/imports", icon: "History" },
    ],
  },
  {
    titleKey: "admin.nav.academic",
    items: [
      { titleKey: "admin.nav.students", href: "/admin/students", icon: "GraduationCap" },
      { titleKey: "admin.nav.admissions", href: "/admin/admissions", icon: "ClipboardList" },
      { titleKey: "admin.nav.courses", href: "/admin/courses", icon: "BookOpen" },
      { titleKey: "admin.nav.batches", href: "/admin/batches", icon: "Layers" },
      { titleKey: "admin.nav.classes", href: "/admin/classes", icon: "Calendar" },
      { titleKey: "admin.nav.attendance", href: "/admin/attendance", icon: "CheckSquare" },
      { titleKey: "admin.nav.assignments", href: "/admin/assignments", icon: "FileText" },
      { titleKey: "admin.nav.quizzes", href: "/admin/quizzes", icon: "HelpCircle" },
      { titleKey: "admin.nav.results", href: "/admin/results", icon: "BarChart3" },
      { titleKey: "admin.nav.materials", href: "/admin/materials", icon: "FolderOpen" },
      { titleKey: "admin.nav.certificates", href: "/admin/certificates", icon: "Award" },
    ],
  },
  {
    titleKey: "admin.nav.people",
    items: [
      { titleKey: "admin.nav.trainers", href: "/admin/trainers", icon: "Users" },
      { titleKey: "admin.nav.staff", href: "/admin/staff", icon: "UserCog" },
    ],
  },
  {
    titleKey: "admin.nav.institute",
    items: [
      { titleKey: "admin.nav.rooms", href: "/admin/rooms", icon: "DoorOpen" },
      { titleKey: "admin.nav.events", href: "/admin/events", icon: "CalendarDays" },
      { titleKey: "admin.nav.gallery", href: "/admin/gallery", icon: "Image" },
      { titleKey: "admin.nav.announcements", href: "/admin/announcements", icon: "Megaphone" },
    ],
  },
  {
    titleKey: "admin.nav.analytics",
    items: [
      { titleKey: "admin.nav.reports", href: "/admin/reports", icon: "PieChart" },
    ],
  },
  {
    titleKey: "admin.nav.system",
    items: [
      { titleKey: "admin.nav.settings", href: "/admin/settings", icon: "Settings" },
    ],
  },
];

// --- Trainer Navigation ---
export const trainerNavItems: NavItem[] = [
  { titleKey: "trainer.nav.dashboard", href: "/trainer", icon: "LayoutDashboard" },
  { titleKey: "trainer.nav.courses", href: "/trainer/courses", icon: "BookOpen" },
  { titleKey: "trainer.nav.batches", href: "/trainer/batches", icon: "Layers" },
  { titleKey: "trainer.nav.students", href: "/trainer/students", icon: "GraduationCap" },
  { titleKey: "trainer.nav.classes", href: "/trainer/classes", icon: "Calendar" },
  { titleKey: "trainer.nav.attendance", href: "/trainer/attendance", icon: "CheckSquare" },
  { titleKey: "trainer.nav.assignments", href: "/trainer/assignments", icon: "FileText" },
  { titleKey: "trainer.nav.quizzes", href: "/trainer/quizzes", icon: "HelpCircle" },
  { titleKey: "trainer.nav.results", href: "/trainer/results", icon: "BarChart3" },
  { titleKey: "trainer.nav.materials", href: "/trainer/materials", icon: "FolderOpen" },
  { titleKey: "trainer.nav.announcements", href: "/trainer/announcements", icon: "Megaphone" },
  { titleKey: "trainer.nav.profile", href: "/trainer/profile", icon: "UserCircle" },
];

// --- Student Navigation ---
export const studentNavItems: NavItem[] = [
  { titleKey: "student.nav.dashboard", href: "/student", icon: "LayoutDashboard" },
  { titleKey: "student.nav.course", href: "/student/course", icon: "BookOpen" },
  { titleKey: "student.nav.schedule", href: "/student/schedule", icon: "Calendar" },
  { titleKey: "student.nav.attendance", href: "/student/attendance", icon: "CheckSquare" },
  { titleKey: "student.nav.assignments", href: "/student/assignments", icon: "FileText" },
  { titleKey: "student.nav.quizzes", href: "/student/quizzes", icon: "HelpCircle" },
  { titleKey: "student.nav.results", href: "/student/results", icon: "BarChart3" },
  { titleKey: "student.nav.materials", href: "/student/materials", icon: "FolderOpen" },
  { titleKey: "student.nav.projects", href: "/student/projects", icon: "Rocket" },
  { titleKey: "student.nav.certificates", href: "/student/certificates", icon: "Award" },
  { titleKey: "student.nav.announcements", href: "/student/announcements", icon: "Megaphone" },
  { titleKey: "student.nav.profile", href: "/student/profile", icon: "UserCircle" },
  { titleKey: "student.nav.settings", href: "/student/settings", icon: "Settings" },
];
