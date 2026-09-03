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
import { AnimatedCounter } from "@/components/public/animated-counter";
import { TestimonialCarousel } from "@/components/public/testimonial-carousel";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import {
  GraduationCap, Users, BookOpen, Layers, ArrowRight,
  CheckCircle2, Star, Award, Briefcase, Monitor, Code,
  Globe, Smartphone, Brain, TrendingUp, Palette, Video,
  Layout, Shield, Network, Cloud, Database, Sparkles, Zap,
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
      {/* ═══════════════════════════════════════════
          HERO SECTION — Premium Animated
          ═══════════════════════════════════════════ */}
      <section className="relative gradient-mesh text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Decorative animated shapes */}
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="hero-shape hero-shape-3" />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid" />

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay" />

        <div className="container-custom relative z-10 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl space-y-6">
            <AnimatedSection delay={0}>
              <Badge className="bg-white/10 text-white border-white/15 hover:bg-white/15 text-sm px-4 py-1.5 backdrop-blur-sm shadow-lg shadow-black/5">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
                {tCommon("tagline")}
              </Badge>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl text-balance leading-[1.1]">
                {t("hero.title")}
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.45}>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-6 shadow-depth hover:shadow-lifted transition-all duration-300 hover:-translate-y-0.5">
                    {t("hero.cta")} <ArrowRight className="ms-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admissions">
                  <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 font-semibold px-6 backdrop-blur-sm">
                    {t("hero.ctaSecondary")}
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          STATS SECTION — Floating Glass Cards
          ═══════════════════════════════════════════ */}
      <section className="relative z-20 -mt-16">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5" staggerDelay={0.12}>
            {[
              { value: siteConfig.stats.students, suffix: "+", label: t("stats.students"), icon: <GraduationCap className="h-5 w-5" />, color: "from-teal-500 to-emerald-500" },
              { value: siteConfig.stats.trainers, suffix: "", label: t("stats.trainers"), icon: <Users className="h-5 w-5" />, color: "from-blue-500 to-indigo-500" },
              { value: siteConfig.stats.programs, suffix: "", label: t("stats.programs"), icon: <BookOpen className="h-5 w-5" />, color: "from-violet-500 to-purple-500" },
              { value: siteConfig.stats.batches, suffix: "+", label: t("stats.batches"), icon: <Layers className="h-5 w-5" />, color: "from-amber-500 to-orange-500" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="text-center border-0 shadow-depth glass-card hover-lift">
                  <CardContent className="p-5 lg:p-6">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3 shadow-md`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold tracking-tight lg:text-3xl">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED COURSES — Premium Cards
          ═══════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 px-3 py-1">
              <Zap className="h-3 w-3 mr-1 text-brand" /> Popular Programs
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("featuredCourses.title")}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t("featuredCourses.subtitle")}</p>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
            {featured.map((course) => (
              <StaggerItem key={course.id}>
                <Link href={`/courses/${course.slug}`}>
                  <Card className="h-full group hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 overflow-hidden border-0 shadow-float">
                    {/* Gradient top bar with animated width on hover */}
                    <div className="h-1.5 gradient-brand transition-all duration-500 group-hover:h-2" />
                    <CardContent className="p-5 space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-brand group-hover:scale-110">
                        {categoryIcons[course.category] || <Code className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-brand transition-colors duration-200">{course.name}</h3>
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
                      {/* Hover arrow indicator */}
                      <div className="flex items-center text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                        Explore Program <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.4} className="text-center mt-10">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md">
                {tCommon("viewAll")} {tCourses("title")} <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY CHOOSE US — Interactive Cards
          ═══════════════════════════════════════════ */}
      <section className="section-padding gradient-mesh-light relative overflow-hidden">
        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("whyChoose.title")}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t("whyChoose.subtitle")}</p>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {[
              { key: "free", icon: <Award className="h-6 w-6" />, gradient: "from-amber-500 to-orange-500" },
              { key: "expert", icon: <Users className="h-6 w-6" />, gradient: "from-blue-500 to-indigo-500" },
              { key: "practical", icon: <Code className="h-6 w-6" />, gradient: "from-emerald-500 to-teal-500" },
              { key: "career", icon: <Briefcase className="h-6 w-6" />, gradient: "from-violet-500 to-purple-500" },
              { key: "modern", icon: <Monitor className="h-6 w-6" />, gradient: "from-rose-500 to-pink-500" },
              { key: "community", icon: <GraduationCap className="h-6 w-6" />, gradient: "from-cyan-500 to-sky-500" },
            ].map((item) => (
              <StaggerItem key={item.key}>
                <Card className="border-0 shadow-float hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 group">
                  <CardContent className="p-6 flex gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{t(`whyChoose.${item.key}.title`)}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t(`whyChoose.${item.key}.description`)}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Connected Timeline
          ═══════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("howItWorks.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("howItWorks.subtitle")}</p>
          </AnimatedSection>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-brand/20 via-brand/40 to-brand/20 z-0" />

            <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10" staggerDelay={0.15}>
              {[1, 2, 3, 4].map((step) => (
                <StaggerItem key={step}>
                  <div className="text-center space-y-4 group">
                    <div className="relative inline-flex">
                      <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full gradient-brand text-white text-xl font-bold shadow-brand transition-all duration-300 group-hover:scale-110 group-hover:shadow-lifted relative z-10">
                        {step}
                      </div>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full gradient-brand opacity-20 animate-ping-slow" style={{ animationDelay: `${step * 0.5}s` }} />
                    </div>
                    <h3 className="font-semibold text-lg">{t(`howItWorks.step${step}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`howItWorks.step${step}.description`)}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LEARNING CATEGORIES — Interactive Grid
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("categories.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("categories.subtitle")}</p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" staggerDelay={0.06}>
            {categories.map((cat) => {
              const course = courses.find((c) => c.category === cat);
              return (
                <StaggerItem key={cat}>
                  <Link href={`/courses?category=${cat}`}>
                    <Card className="text-center group hover:shadow-lifted hover:-translate-y-1 hover:border-brand/30 transition-all duration-300 cursor-pointer border-0 shadow-sm">
                      <CardContent className="p-5 space-y-2.5">
                        <div className="flex h-11 w-11 mx-auto items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-brand">
                          {categoryIcons[cat] || <Code className="h-5 w-5" />}
                        </div>
                        <p className="text-xs font-medium leading-tight group-hover:text-brand transition-colors">
                          {course?.name || cat.replace(/-/g, " ")}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          UPCOMING BATCHES — Enhanced Cards
          ═══════════════════════════════════════════ */}
      {enrolling.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("upcomingBatches.title")}</h2>
              <p className="text-muted-foreground mt-2">{t("upcomingBatches.subtitle")}</p>
            </AnimatedSection>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
              {enrolling.map((batch) => {
                const course = courses.find((c) => c.id === batch.courseId);
                const trainer = getTrainerById(batch.trainerId);
                return (
                  <StaggerItem key={batch.id}>
                    <Card className="hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 border-0 shadow-float group overflow-hidden">
                      {/* Colored accent bar */}
                      <div className="h-1 bg-gradient-to-r from-brand to-info" />
                      <CardContent className="p-5 space-y-3">
                        <Badge variant="secondary" className="text-xs bg-brand/10 text-brand border-brand/20">
                          <span className="relative flex h-1.5 w-1.5 mr-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand" />
                          </span>
                          {batch.status === "enrolling" ? "Enrolling Now" : "Upcoming"}
                        </Badge>
                        <h3 className="font-semibold group-hover:text-brand transition-colors">{course?.name}</h3>
                        <p className="text-sm text-muted-foreground">Batch: {batch.name}</p>
                        <div className="text-xs text-muted-foreground space-y-1.5">
                          <p className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            Starts: {new Date(batch.startDate).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            {batch.schedule.days.join(", ")}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            {batch.schedule.startTime} - {batch.schedule.endTime}
                          </p>
                          {trainer && (
                            <p className="flex items-center gap-1.5">
                              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                              Trainer: {trainer.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50">
                          {/* Progress bar for seats */}
                          <div className="flex-1 mr-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">{batch.enrolledSeats}/{batch.totalSeats} seats</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-brand to-info transition-all duration-1000"
                                style={{ width: `${(batch.enrolledSeats / batch.totalSeats) * 100}%` }}
                              />
                            </div>
                          </div>
                          <Link href="/admissions">
                            <Button size="sm" variant="glow" className="h-7 text-xs px-3">
                              {tCommon("applyNow")}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — Auto-scrolling Carousel
          ═══════════════════════════════════════════ */}
      <section className="section-padding gradient-mesh-light relative overflow-hidden">
        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("testimonials.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("testimonials.subtitle")}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <TestimonialCarousel testimonials={successStories.slice(0, 6)} />
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Premium Animated
          ═══════════════════════════════════════════ */}
      <section className="gradient-mesh text-white section-padding relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="hero-shape hero-shape-1" style={{ opacity: 0.1 }} />
        <div className="hero-shape hero-shape-2" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0 dot-grid" />

        <div className="container-custom text-center space-y-6 relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("cta.title")}</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <p className="text-white/75 max-w-2xl mx-auto text-lg">{t("cta.subtitle")}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <Link href="/admissions">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 shadow-depth hover:shadow-lifted transition-all duration-300 hover:-translate-y-0.5 text-base">
                {t("cta.button")} <ArrowRight className="ms-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
