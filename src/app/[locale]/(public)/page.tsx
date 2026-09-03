import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config/site";
import { getFeaturedCourses, courses } from "@/lib/data/courses";
import { getEnrollingBatches } from "@/lib/data/batches";
import { getTrainerById } from "@/lib/data/trainers";
import { successStories } from "@/lib/data/misc";
import {
  GraduationCap, Users, BookOpen, Layers, ArrowRight,
  CheckCircle2, Star, Award, Briefcase, Monitor, Code,
  Globe, Smartphone, Brain, TrendingUp, Palette, Video,
  Layout, Shield, Network, Cloud, Database,
} from "lucide-react";

// Icon map for courses
const categoryIcons: Record<string, React.ReactNode> = {
  "web-development": <Globe className="h-6 w-6" />,
  "app-development": <Smartphone className="h-6 w-6" />,
  "artificial-intelligence": <Brain className="h-6 w-6" />,
  "digital-marketing": <TrendingUp className="h-6 w-6" />,
  "graphic-design": <Palette className="h-6 w-6" />,
  "video-editing": <Video className="h-6 w-6" />,
  "ui-ux": <Layout className="h-6 w-6" />,
  "cyber-security": <Shield className="h-6 w-6" />,
  "networking": <Network className="h-6 w-6" />,
  "freelancing": <Briefcase className="h-6 w-6" />,
  "data-science": <Database className="h-6 w-6" />,
  "cloud-computing": <Cloud className="h-6 w-6" />,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return {
    title: `${t("title")} | Mohsin and Huma IT Center × SMIT`,
    description: t("description"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tCourses = await getTranslations("courses");

  const featured = getFeaturedCourses();
  const enrolling = getEnrollingBatches().slice(0, 4);
  const categories = [...new Set(courses.map((c) => c.category))];

  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container-custom relative z-10 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl space-y-6">
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20 text-sm px-4 py-1.5">
              ✨ {tCommon("tagline")}
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/courses">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-6">
                  {t("hero.cta")} <ArrowRight className="ms-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admissions">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-6">
                  {t("hero.ctaSecondary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-20 -mt-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            {[
              { value: `${siteConfig.stats.students.toLocaleString()}+`, label: t("stats.students"), icon: <GraduationCap className="h-5 w-5" /> },
              { value: `${siteConfig.stats.trainers}`, label: t("stats.trainers"), icon: <Users className="h-5 w-5" /> },
              { value: `${siteConfig.stats.programs}`, label: t("stats.programs"), icon: <BookOpen className="h-5 w-5" /> },
              { value: `${siteConfig.stats.batches}+`, label: t("stats.batches"), icon: <Layers className="h-5 w-5" /> },
            ].map((stat) => (
              <Card key={stat.label} className="text-center shadow-lg border-0">
                <CardContent className="p-5">
                  <div className="flex justify-center mb-2 text-brand">{stat.icon}</div>
                  <p className="text-2xl font-bold tracking-tight lg:text-3xl">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{t("featuredCourses.title")}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t("featuredCourses.subtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <Card className="h-full group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="h-2 gradient-brand" />
                  <CardContent className="p-5 space-y-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      {categoryIcons[course.category] || <Code className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-brand transition-colors">{course.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.shortDescription}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{tCourses(course.level as "beginner" | "intermediate" | "advanced")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px] font-normal">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          +{course.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/courses">
              <Button variant="outline" size="lg">
                {tCommon("viewAll")} {tCourses("title")} <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{t("whyChoose.title")}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t("whyChoose.subtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "free", icon: <Award className="h-6 w-6" /> },
              { key: "expert", icon: <Users className="h-6 w-6" /> },
              { key: "practical", icon: <Code className="h-6 w-6" /> },
              { key: "career", icon: <Briefcase className="h-6 w-6" /> },
              { key: "modern", icon: <Monitor className="h-6 w-6" /> },
              { key: "community", icon: <GraduationCap className="h-6 w-6" /> },
            ].map((item) => (
              <Card key={item.key} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{t(`whyChoose.${item.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t(`whyChoose.${item.key}.description`)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{t("howItWorks.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("howItWorks.subtitle")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="text-center space-y-3">
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full gradient-brand text-white text-xl font-bold">
                  {step}
                </div>
                <h3 className="font-semibold">{t(`howItWorks.step${step}.title`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`howItWorks.step${step}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Categories */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{t("categories.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("categories.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((cat) => {
              const course = courses.find((c) => c.category === cat);
              return (
                <Link key={cat} href={`/courses?category=${cat}`}>
                  <Card className="text-center group hover:shadow-md hover:border-brand/30 transition-all cursor-pointer">
                    <CardContent className="p-5 space-y-2">
                      <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                        {categoryIcons[cat] || <Code className="h-5 w-5" />}
                      </div>
                      <p className="text-xs font-medium leading-tight">
                        {course?.name || cat.replace(/-/g, " ")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Batches */}
      {enrolling.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("upcomingBatches.title")}</h2>
              <p className="text-muted-foreground mt-2">{t("upcomingBatches.subtitle")}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {enrolling.map((batch) => {
                const course = courses.find((c) => c.id === batch.courseId);
                const trainer = getTrainerById(batch.trainerId);
                return (
                  <Card key={batch.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-3">
                      <Badge variant="secondary" className="text-xs">{batch.status === "enrolling" ? "Enrolling Now" : "Upcoming"}</Badge>
                      <h3 className="font-semibold">{course?.name}</h3>
                      <p className="text-sm text-muted-foreground">Batch: {batch.name}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Starts: {new Date(batch.startDate).toLocaleDateString()}</p>
                        <p>{batch.schedule.days.join(", ")}</p>
                        <p>{batch.schedule.startTime} - {batch.schedule.endTime}</p>
                        {trainer && <p>Trainer: {trainer.name}</p>}
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-muted-foreground">{batch.enrolledSeats}/{batch.totalSeats} seats</span>
                        <Link href="/admissions">
                          <Button size="sm" variant="outline" className="h-7 text-xs">{tCommon("applyNow")}</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{t("testimonials.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("testimonials.subtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {successStories.slice(0, 3).map((story) => (
              <Card key={story.id} className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-10 w-10 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold">
                      {story.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{story.studentName}</p>
                      <p className="text-xs text-muted-foreground">{story.courseName} — {story.batchName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero text-white section-padding">
        <div className="container-custom text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("cta.title")}</h2>
          <p className="text-white/80 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
          <Link href="/admissions">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
              {t("cta.button")} <ArrowRight className="ms-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
