import type {
  Event, Announcement, StudentProject, SuccessStory, Certificate,
  GalleryItem, FAQ, Notification, Assignment, Quiz, ClassSession
} from "@/lib/types";

// ============================================================
// EVENTS
// ============================================================
export const events: Event[] = [
  { id: "event-1", title: "Annual Tech Fest 2026", description: "A celebration of technology featuring student projects, workshops, and guest speakers from the industry.", date: "2026-12-15", endDate: "2026-12-16", time: "09:00 AM - 06:00 PM", location: "Main Campus Auditorium", category: "festival", image: "/images/events/tech-fest.jpg", isRegistrationOpen: true, maxAttendees: 500, registeredCount: 320, status: "upcoming" },
  { id: "event-2", title: "Web Development Workshop", description: "Hands-on workshop covering modern React patterns and best practices for building scalable web applications.", date: "2026-10-05", time: "10:00 AM - 04:00 PM", location: "Lab A, Main Campus", category: "workshop", image: "/images/events/web-workshop.jpg", isRegistrationOpen: true, maxAttendees: 50, registeredCount: 38, status: "upcoming" },
  { id: "event-3", title: "Career Fair 2026", description: "Connect with leading tech companies, explore job opportunities, and get your resume reviewed by industry professionals.", date: "2026-11-20", time: "10:00 AM - 05:00 PM", location: "Main Campus Hall", category: "career", image: "/images/events/career-fair.jpg", isRegistrationOpen: true, maxAttendees: 300, registeredCount: 180, status: "upcoming" },
  { id: "event-4", title: "AI & Future of Work Seminar", description: "Expert panel discussion on how artificial intelligence is transforming industries and creating new career opportunities.", date: "2026-09-28", time: "02:00 PM - 05:00 PM", location: "Seminar Hall", category: "seminar", image: "/images/events/ai-seminar.jpg", isRegistrationOpen: false, maxAttendees: 100, registeredCount: 100, status: "upcoming" },
  { id: "event-5", title: "Hackathon 2026", description: "24-hour coding competition where teams build innovative solutions to real-world problems.", date: "2026-10-25", endDate: "2026-10-26", time: "10:00 AM", location: "Main Campus", category: "competition", image: "/images/events/hackathon.jpg", isRegistrationOpen: true, maxAttendees: 150, registeredCount: 95, status: "upcoming" },
  { id: "event-6", title: "Graduation Ceremony Batch 2025", description: "Celebrating the achievements of our graduating students with certificate distribution and awards.", date: "2026-06-30", time: "04:00 PM - 08:00 PM", location: "Main Campus Auditorium", category: "graduation", image: "/images/events/graduation.jpg", isRegistrationOpen: false, registeredCount: 250, status: "completed" },
  { id: "event-7", title: "Open Day — Explore Our Programs", description: "Visit our campus, meet trainers, see our facilities, and learn about upcoming programs and admission process.", date: "2026-05-15", time: "10:00 AM - 03:00 PM", location: "Main Campus", category: "open-day", image: "/images/events/open-day.jpg", isRegistrationOpen: false, registeredCount: 180, status: "completed" },
  { id: "event-8", title: "Freelancing Success Stories Panel", description: "Hear from successful freelancers who started their journey at MHIT and are now earning globally.", date: "2026-08-10", time: "03:00 PM - 05:00 PM", location: "Room 101", category: "seminar", image: "/images/events/freelancing-panel.jpg", isRegistrationOpen: false, registeredCount: 80, status: "completed" },
];

// ============================================================
// ANNOUNCEMENTS
// ============================================================
export const announcements: Announcement[] = [
  { id: "ann-1", title: "New Batch Enrollments Open for October 2026", content: "We are excited to announce that admissions are now open for October 2026 batches in Web Development, App Development, and UI/UX Design. Apply now to secure your seat.", category: "admission", isImportant: true, publishedAt: "2026-09-01", publishedBy: "Admin" },
  { id: "ann-2", title: "Eid Holidays — Campus Closed", content: "The campus will remain closed from September 15-18 on account of Eid holidays. Classes will resume on September 19.", category: "general", isImportant: true, publishedAt: "2026-09-10", publishedBy: "Admin" },
  { id: "ann-3", title: "Mid-Term Examinations Schedule", content: "Mid-term examinations for all in-progress batches will be held from October 10-15. Detailed schedule will be shared with individual batches.", category: "academic", isImportant: true, publishedAt: "2026-09-05", publishedBy: "Academic Office" },
  { id: "ann-4", title: "Workshop: Building Your First React App", content: "Free workshop for all students on building a complete React application. Open to students from all programs.", category: "event", isImportant: false, publishedAt: "2026-09-02", publishedBy: "Web Dev Department" },
  { id: "ann-5", title: "Library Resources Updated", content: "New online learning resources have been added to the student portal. Access video tutorials, e-books, and practice exercises.", category: "general", isImportant: false, publishedAt: "2026-08-28", publishedBy: "Admin" },
  { id: "ann-6", title: "Attendance Policy Reminder", content: "Students must maintain a minimum of 75% attendance to be eligible for certificate. Please ensure regular attendance.", category: "academic", isImportant: true, publishedAt: "2026-08-25", publishedBy: "Academic Office" },
  { id: "ann-7", title: "New Cyber Security Program Launching", content: "We are launching a new Cyber Security program starting November 2026. Early registration is now open.", category: "admission", isImportant: false, publishedAt: "2026-08-20", publishedBy: "Admin" },
  { id: "ann-8", title: "Student Project Showcase", content: "Submit your best projects for the annual showcase. Selected projects will be featured on our website and social media.", category: "event", isImportant: false, publishedAt: "2026-08-15", publishedBy: "Admin" },
];

// ============================================================
// STUDENT PROJECTS
// ============================================================
export const studentProjects: StudentProject[] = [
  { id: "proj-1", title: "E-Commerce Platform", description: "A full-stack e-commerce web application with product management, cart, checkout, and payment integration.", studentId: "student-1", studentName: "Muhammad Khan", courseId: "course-1", courseName: "Web Development", batchId: "batch-1", technologies: ["React", "Node.js", "MongoDB", "Stripe"], category: "Web Application", image: "/images/projects/ecommerce.jpg", githubUrl: "#", liveUrl: "#", completedAt: "2026-05-10" },
  { id: "proj-2", title: "Task Management App", description: "Cross-platform mobile app for managing tasks, teams, and projects with real-time collaboration.", studentId: "student-61", studentName: "Hamza Ali", courseId: "course-2", courseName: "App Development", batchId: "batch-6", technologies: ["Flutter", "Firebase", "Dart"], category: "Mobile App", image: "/images/projects/task-app.jpg", githubUrl: "#", completedAt: "2026-05-25" },
  { id: "proj-3", title: "Sentiment Analysis Dashboard", description: "AI-powered dashboard that analyzes social media sentiment in real-time using NLP techniques.", studentId: "student-88", studentName: "Ali Hussain", courseId: "course-3", courseName: "Artificial Intelligence", batchId: "batch-9", technologies: ["Python", "TensorFlow", "Flask", "React"], category: "AI/ML", image: "/images/projects/sentiment.jpg", githubUrl: "#", liveUrl: "#", completedAt: "2026-06-10" },
  { id: "proj-4", title: "Restaurant Website", description: "Modern responsive restaurant website with online menu, reservation system, and customer reviews.", studentId: "student-5", studentName: "Usman Malik", courseId: "course-1", courseName: "Web Development", batchId: "batch-1", technologies: ["HTML", "CSS", "JavaScript", "Node.js"], category: "Web Application", image: "/images/projects/restaurant.jpg", githubUrl: "#", liveUrl: "#", completedAt: "2026-05-12" },
  { id: "proj-5", title: "Fitness Tracker App", description: "Mobile fitness tracking app with workout plans, progress tracking, and social features.", studentId: "student-63", studentName: "Zain Raza", courseId: "course-2", courseName: "App Development", batchId: "batch-6", technologies: ["Flutter", "Firebase", "Google Fit API"], category: "Mobile App", image: "/images/projects/fitness.jpg", githubUrl: "#", completedAt: "2026-05-28" },
  { id: "proj-6", title: "Brand Identity — Tech Startup", description: "Complete brand identity design including logo, business cards, social media templates, and brand guidelines.", studentId: "student-50", studentName: "Nadia Ahmed", courseId: "course-5", courseName: "Graphic Design", batchId: "batch-15", technologies: ["Photoshop", "Illustrator", "InDesign"], category: "Design", image: "/images/projects/brand-identity.jpg", completedAt: "2026-06-20" },
  { id: "proj-7", title: "Weather Forecast App", description: "Beautiful weather app with 7-day forecast, hourly updates, and location-based weather alerts.", studentId: "student-70", studentName: "Saima Ali", courseId: "course-2", courseName: "App Development", batchId: "batch-6", technologies: ["Flutter", "OpenWeather API", "Dart"], category: "Mobile App", image: "/images/projects/weather.jpg", githubUrl: "#", liveUrl: "#", completedAt: "2026-05-30" },
  { id: "proj-8", title: "Portfolio Website", description: "Creative portfolio website with animations, project showcases, and contact form.", studentId: "student-10", studentName: "Faisal Iqbal", courseId: "course-1", courseName: "Web Development", batchId: "batch-1", technologies: ["React", "Framer Motion", "Tailwind CSS"], category: "Web Application", image: "/images/projects/portfolio.jpg", githubUrl: "#", liveUrl: "#", completedAt: "2026-05-15" },
  { id: "proj-9", title: "Image Classification Model", description: "Deep learning model that classifies images into 10 categories with 95% accuracy.", studentId: "student-90", studentName: "Ahmed Sheikh", courseId: "course-3", courseName: "Artificial Intelligence", batchId: "batch-9", technologies: ["Python", "PyTorch", "OpenCV"], category: "AI/ML", image: "/images/projects/image-classify.jpg", githubUrl: "#", completedAt: "2026-06-15" },
  { id: "proj-10", title: "Social Media Dashboard", description: "Analytics dashboard for tracking social media performance across multiple platforms.", studentId: "student-35", studentName: "Fatima Khan", courseId: "course-4", courseName: "Digital Marketing", batchId: "batch-12", technologies: ["Google Analytics", "Data Studio", "Google Ads"], category: "Marketing", image: "/images/projects/social-dashboard.jpg", completedAt: "2026-05-20" },
];

// ============================================================
// SUCCESS STORIES
// ============================================================
export const successStories: SuccessStory[] = [
  { id: "story-1", studentName: "Muhammad Khan", avatar: "/images/students/student-1.jpg", courseId: "course-1", courseName: "Web Development", batchName: "WD-01", achievement: "Landed a junior developer role at a leading tech company within 2 months of graduation.", quote: "MHIT gave me the skills and confidence to start my career in tech. The hands-on projects made all the difference.", currentRole: "Junior Web Developer", company: "Tech Solutions Pvt Ltd" },
  { id: "story-2", studentName: "Sara Nawaz", avatar: "/images/students/student-8.jpg", courseId: "course-10", courseName: "Freelancing", batchName: "FR-01", achievement: "Earning $2000+/month on Upwork within 6 months of completing the freelancing course.", quote: "The freelancing course taught me not just skills, but how to market myself and manage clients professionally.", currentRole: "Freelance Web Developer", company: "Self-employed" },
  { id: "story-3", studentName: "Hamza Ali", avatar: "/images/students/student-3.jpg", courseId: "course-2", courseName: "App Development", batchName: "AD-01", achievement: "Published 3 apps on Google Play Store, with one reaching 10,000+ downloads.", quote: "From zero coding knowledge to publishing apps — MHIT's structured program and amazing trainers made it possible.", currentRole: "Flutter Developer", company: "AppCraft Studios" },
  { id: "story-4", studentName: "Fatima Zaidi", avatar: "/images/students/student-4.jpg", courseId: "course-3", courseName: "Artificial Intelligence", batchName: "AI-01", achievement: "Secured a data science internship at a multinational company.", quote: "The AI program opened my eyes to endless possibilities. Dr. Usman's teaching was exceptional.", currentRole: "Data Science Intern", company: "Global Tech Inc" },
  { id: "story-5", studentName: "Ahmed Raza", avatar: "/images/students/student-5.jpg", courseId: "course-7", courseName: "UI/UX Design", batchName: "UX-01", achievement: "Won a national UI design competition and started freelancing on international platforms.", quote: "MHIT didn't just teach me design tools — they taught me how to think like a designer.", currentRole: "UI/UX Designer", company: "Freelance" },
  { id: "story-6", studentName: "Nadia Sheikh", avatar: "/images/students/student-6.jpg", courseId: "course-5", courseName: "Graphic Design", batchName: "GD-01", achievement: "Started a small design studio with two other MHIT graduates.", quote: "The practical approach at MHIT prepared us for real client work from day one.", currentRole: "Co-founder & Designer", company: "Creative Studio" },
];

// ============================================================
// CERTIFICATES (for verification demo)
// ============================================================
export const certificates: Certificate[] = [
  { id: "cert-1", certificateId: "MH-WD-2026-00124", studentId: "student-113", studentName: "Ali Khan", courseId: "course-1", courseName: "Web Development", batchId: "batch-1", batchName: "WD-01", issueDate: "2026-05-20", grade: "A", status: "issued" },
  { id: "cert-2", certificateId: "MH-WD-2026-00125", studentId: "student-114", studentName: "Hassan Ahmed", courseId: "course-1", courseName: "Web Development", batchId: "batch-1", batchName: "WD-01", issueDate: "2026-05-20", grade: "A+", status: "issued" },
  { id: "cert-3", certificateId: "MH-AD-2026-00089", studentId: "student-123", studentName: "Usman Ali", courseId: "course-2", courseName: "App Development", batchId: "batch-6", batchName: "AD-01", issueDate: "2026-06-05", grade: "B+", status: "issued" },
  { id: "cert-4", certificateId: "MH-WD-2026-00126", studentId: "student-115", studentName: "Fatima Malik", courseId: "course-1", courseName: "Web Development", batchId: "batch-1", batchName: "WD-01", issueDate: "2026-05-20", grade: "A", status: "issued" },
  { id: "cert-5", certificateId: "MH-AD-2026-00090", studentId: "student-124", studentName: "Zainab Raza", courseId: "course-2", courseName: "App Development", batchId: "batch-6", batchName: "AD-01", issueDate: "2026-06-05", grade: "A", status: "issued" },
];

export function verifyCertificate(certId: string): Certificate | undefined {
  return certificates.find((c) => c.certificateId === certId);
}

// ============================================================
// GALLERY
// ============================================================
export const galleryItems: GalleryItem[] = [
  { id: "gal-1", title: "Web Development Workshop", description: "Students working on their React projects during the workshop.", image: "/images/gallery/workshop-1.jpg", category: "workshops", date: "2026-07-15" },
  { id: "gal-2", title: "Graduation Ceremony 2026", description: "Certificate distribution ceremony for the graduating batch.", image: "/images/gallery/graduation-1.jpg", category: "graduation", date: "2026-06-30" },
  { id: "gal-3", title: "AI Lab Session", description: "Students training machine learning models in the AI lab.", image: "/images/gallery/class-1.jpg", category: "classes", date: "2026-08-10" },
  { id: "gal-4", title: "Hackathon 2026", description: "Teams competing in the 24-hour coding hackathon.", image: "/images/gallery/event-1.jpg", category: "events", date: "2026-05-25" },
  { id: "gal-5", title: "Student Project Fair", description: "Students showcasing their final projects to visitors and industry experts.", image: "/images/gallery/project-1.jpg", category: "projects", date: "2026-06-15" },
  { id: "gal-6", title: "Main Campus", description: "Our modern campus equipped with the latest technology and facilities.", image: "/images/gallery/campus-1.jpg", category: "campus", date: "2026-01-01" },
  { id: "gal-7", title: "Mobile App Development Class", description: "Flutter development session in progress.", image: "/images/gallery/class-2.jpg", category: "classes", date: "2026-08-05" },
  { id: "gal-8", title: "Design Workshop", description: "Graphic design students creating brand identities.", image: "/images/gallery/workshop-2.jpg", category: "workshops", date: "2026-07-20" },
  { id: "gal-9", title: "Networking Lab", description: "Students configuring network equipment in the Cisco lab.", image: "/images/gallery/class-3.jpg", category: "classes", date: "2026-08-12" },
  { id: "gal-10", title: "Career Fair", description: "Students interacting with recruiters at the annual career fair.", image: "/images/gallery/event-2.jpg", category: "events", date: "2026-04-20" },
  { id: "gal-11", title: "Computer Labs", description: "State-of-the-art computer labs for practical learning.", image: "/images/gallery/campus-2.jpg", category: "campus", date: "2026-01-01" },
  { id: "gal-12", title: "Open Day Visitors", description: "Prospective students visiting the campus during open day.", image: "/images/gallery/event-3.jpg", category: "events", date: "2026-05-15" },
];

// ============================================================
// FAQs
// ============================================================
export const faqs: FAQ[] = [
  { id: "faq-1", question: "Is the education really free?", answer: "Yes, all courses at Mohsin and Huma IT Center × SMIT are completely free. There are no hidden fees or charges.", category: "general", order: 1 },
  { id: "faq-2", question: "What are the admission requirements?", answer: "Basic computer literacy and a minimum of Matric/O-Level education. Some advanced courses may require additional prerequisites.", category: "admissions", order: 1 },
  { id: "faq-3", question: "How do I apply for admission?", answer: "You can apply online through our admissions page or visit our campus during office hours. The process involves filling an application form and appearing for a brief interview.", category: "admissions", order: 2 },
  { id: "faq-4", question: "What documents are required for admission?", answer: "CNIC/B-Form copy, educational certificates, 2 passport-size photographs, and any relevant experience certificates.", category: "admissions", order: 3 },
  { id: "faq-5", question: "What is the class schedule?", answer: "Classes are typically held 3 days a week, each session lasting 2-3 hours. Morning and afternoon slots are available. Specific schedules depend on the course and batch.", category: "classes", order: 1 },
  { id: "faq-6", question: "What is the attendance requirement?", answer: "Students must maintain a minimum of 75% attendance to be eligible for course completion certificate.", category: "attendance", order: 1 },
  { id: "faq-7", question: "Will I receive a certificate?", answer: "Yes, upon successful completion of the course with required attendance and passing grades, you will receive an official certificate from Mohsin and Huma IT Center × SMIT.", category: "certificates", order: 1 },
  { id: "faq-8", question: "How can I verify my certificate?", answer: "Certificates can be verified online through our certificate verification page using the unique certificate ID printed on your certificate.", category: "certificates", order: 2 },
  { id: "faq-9", question: "Do you provide job placement assistance?", answer: "While we don't guarantee job placement, we provide career guidance, portfolio building support, and connect students with industry professionals through our career fairs and partnerships.", category: "general", order: 2 },
  { id: "faq-10", question: "Can I take multiple courses?", answer: "Yes, you can enroll in multiple courses, either simultaneously or sequentially, subject to availability.", category: "courses", order: 1 },
  { id: "faq-11", question: "What equipment do I need?", answer: "A personal laptop is recommended but not mandatory. Our labs are equipped with computers for use during class hours. Specific software requirements vary by course.", category: "courses", order: 2 },
  { id: "faq-12", question: "Is online learning available?", answer: "Currently, all courses are conducted on-campus. However, learning materials and resources are accessible online through the student portal.", category: "classes", order: 2 },
];

// ============================================================
// NOTIFICATIONS (demo data for portal)
// ============================================================
export const notifications: Notification[] = [
  { id: "notif-1", title: "New Assignment Published", message: "Assignment 'Build a Portfolio Website' has been published for WD-03.", type: "info", isRead: false, createdAt: "2026-09-03T09:00:00Z", link: "/student/assignments" },
  { id: "notif-2", title: "Attendance Alert", message: "Your attendance is below 80%. Please ensure regular attendance.", type: "warning", isRead: false, createdAt: "2026-09-02T14:30:00Z", link: "/student/attendance" },
  { id: "notif-3", title: "Quiz Results Available", message: "Results for 'JavaScript Basics Quiz' are now available.", type: "success", isRead: true, createdAt: "2026-09-01T16:00:00Z", link: "/student/results" },
  { id: "notif-4", title: "New Batch Created", message: "New batch WD-05 has been created for Web Development.", type: "info", isRead: true, createdAt: "2026-08-30T10:00:00Z", link: "/admin/batches" },
  { id: "notif-5", title: "Application Received", message: "New admission application #MH-2026-00421 requires review.", type: "alert", isRead: false, createdAt: "2026-09-03T08:15:00Z", link: "/admin/admissions" },
  { id: "notif-6", title: "Class Rescheduled", message: "Tomorrow's AI-02 class has been rescheduled to 2:00 PM.", type: "warning", isRead: false, createdAt: "2026-09-02T17:00:00Z", link: "/student/schedule" },
];

// ============================================================
// ASSIGNMENTS
// ============================================================
export const assignments: Assignment[] = [
  { id: "asgn-1", title: "Build a Portfolio Website", description: "Create a personal portfolio website using HTML and CSS only.", courseId: "course-1", batchId: "batch-3", trainerId: "trainer-1", moduleId: "wd-m2", dueDate: "2026-09-15", totalMarks: 100, publishedAt: "2026-09-01", isPublished: true },
  { id: "asgn-2", title: "JavaScript Todo App", description: "Build a todo application with add, delete, and filter functionality using vanilla JavaScript.", courseId: "course-1", batchId: "batch-3", trainerId: "trainer-1", moduleId: "wd-m3", dueDate: "2026-09-25", totalMarks: 100, publishedAt: "2026-09-05", isPublished: true },
  { id: "asgn-3", title: "React Dashboard", description: "Create a data dashboard using React with charts and filters.", courseId: "course-1", batchId: "batch-3", trainerId: "trainer-1", moduleId: "wd-m5", dueDate: "2026-10-10", totalMarks: 150, publishedAt: "2026-09-20", isPublished: true },
  { id: "asgn-4", title: "Flutter UI Clone", description: "Recreate a popular app's UI using Flutter widgets and layouts.", courseId: "course-2", batchId: "batch-7", trainerId: "trainer-2", moduleId: "ad-m3", dueDate: "2026-09-20", totalMarks: 100, publishedAt: "2026-09-03", isPublished: true },
  { id: "asgn-5", title: "Linear Regression Model", description: "Implement a linear regression model to predict house prices.", courseId: "course-3", batchId: "batch-10", trainerId: "trainer-3", moduleId: "ai-m3", dueDate: "2026-09-18", totalMarks: 100, publishedAt: "2026-09-02", isPublished: true },
  { id: "asgn-6", title: "RESTful API Design", description: "Design and implement a RESTful API for a blog application.", courseId: "course-1", batchId: "batch-4", trainerId: "trainer-1", moduleId: "wd-m6", dueDate: "2026-09-30", totalMarks: 100, publishedAt: "2026-09-10", isPublished: true },
  { id: "asgn-7", title: "Social Media Campaign", description: "Create a complete social media marketing campaign for a fictional product.", courseId: "course-4", batchId: "batch-13", trainerId: "trainer-4", moduleId: "", dueDate: "2026-09-22", totalMarks: 80, publishedAt: "2026-09-05", isPublished: true },
  { id: "asgn-8", title: "Logo Design Project", description: "Design three logo concepts for a tech startup.", courseId: "course-5", batchId: "batch-16", trainerId: "trainer-5", moduleId: "", dueDate: "2026-09-25", totalMarks: 100, publishedAt: "2026-09-08", isPublished: true },
];

// ============================================================
// QUIZZES
// ============================================================
export const quizzes: Quiz[] = [
  { id: "quiz-1", title: "HTML & CSS Fundamentals", description: "Test your knowledge of HTML elements and CSS properties.", courseId: "course-1", batchId: "batch-3", trainerId: "trainer-1", moduleId: "wd-m2", totalMarks: 50, totalQuestions: 25, duration: 30, date: "2026-09-10", status: "completed" },
  { id: "quiz-2", title: "JavaScript Basics", description: "Variables, functions, loops, and DOM manipulation.", courseId: "course-1", batchId: "batch-3", trainerId: "trainer-1", moduleId: "wd-m3", totalMarks: 50, totalQuestions: 30, duration: 45, date: "2026-09-20", status: "completed" },
  { id: "quiz-3", title: "React Fundamentals", description: "Components, props, state, and hooks.", courseId: "course-1", batchId: "batch-3", trainerId: "trainer-1", moduleId: "wd-m5", totalMarks: 50, totalQuestions: 25, duration: 30, date: "2026-10-05", status: "upcoming" },
  { id: "quiz-4", title: "Dart Language Quiz", description: "Dart programming concepts and OOP.", courseId: "course-2", batchId: "batch-7", trainerId: "trainer-2", moduleId: "ad-m2", totalMarks: 40, totalQuestions: 20, duration: 25, date: "2026-09-12", status: "completed" },
  { id: "quiz-5", title: "Machine Learning Concepts", description: "Supervised and unsupervised learning algorithms.", courseId: "course-3", batchId: "batch-10", trainerId: "trainer-3", moduleId: "ai-m3", totalMarks: 50, totalQuestions: 25, duration: 40, date: "2026-09-15", status: "completed" },
  { id: "quiz-6", title: "Flutter Widgets Quiz", description: "Flutter widget tree and layout concepts.", courseId: "course-2", batchId: "batch-7", trainerId: "trainer-2", moduleId: "ad-m3", totalMarks: 40, totalQuestions: 20, duration: 25, date: "2026-10-01", status: "upcoming" },
];

// ============================================================
// CLASS SESSIONS (sample)
// ============================================================
export const classSessions: ClassSession[] = [
  { id: "class-1", batchId: "batch-3", courseId: "course-1", trainerId: "trainer-1", title: "React Hooks Deep Dive", description: "Understanding useState, useEffect, useContext, and custom hooks.", date: "2026-09-03", startTime: "09:00", endTime: "11:00", room: "Lab B", moduleId: "wd-m5", topics: ["useState", "useEffect", "Custom Hooks"], isCompleted: false },
  { id: "class-2", batchId: "batch-4", courseId: "course-1", trainerId: "trainer-1", title: "Express.js Middleware", description: "Understanding middleware pattern in Express.js.", date: "2026-09-03", startTime: "14:00", endTime: "16:00", room: "Lab A", moduleId: "wd-m6", topics: ["Middleware", "Error Handling", "Authentication"], isCompleted: false },
  { id: "class-3", batchId: "batch-7", courseId: "course-2", trainerId: "trainer-2", title: "State Management with Riverpod", description: "Modern state management in Flutter.", date: "2026-09-03", startTime: "11:00", endTime: "13:00", room: "Lab C", moduleId: "ad-m4", topics: ["Riverpod", "State Notifier", "Async State"], isCompleted: false },
  { id: "class-4", batchId: "batch-10", courseId: "course-3", trainerId: "trainer-3", title: "Neural Networks Architecture", description: "Building and training neural networks.", date: "2026-09-04", startTime: "09:00", endTime: "12:00", room: "Lab D", moduleId: "ai-m4", topics: ["Perceptron", "Backpropagation", "Activation Functions"], isCompleted: false },
  { id: "class-5", batchId: "batch-13", courseId: "course-4", trainerId: "trainer-4", title: "Google Ads Campaign Setup", description: "Creating and optimizing Google Ads campaigns.", date: "2026-09-03", startTime: "14:00", endTime: "16:00", room: "Room 201", moduleId: "", topics: ["Campaign Types", "Keyword Research", "Ad Copy"], isCompleted: false },
  { id: "class-6", batchId: "batch-16", courseId: "course-5", trainerId: "trainer-5", title: "Typography in Design", description: "Understanding typefaces, hierarchy, and readability.", date: "2026-09-04", startTime: "11:00", endTime: "13:00", room: "Design Studio", moduleId: "", topics: ["Typefaces", "Hierarchy", "Pairing", "Readability"], isCompleted: false },
];

export function getTodaysClasses(): ClassSession[] {
  return classSessions.filter((c) => c.date === "2026-09-03");
}
