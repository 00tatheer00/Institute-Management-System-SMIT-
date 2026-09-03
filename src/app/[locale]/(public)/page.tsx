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
import { successStories, galleryItems } from "@/lib/data/misc";
import { AnimatedCounter } from "@/components/public/animated-counter";
import { TestimonialCarousel } from "@/components/public/testimonial-carousel";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/animated-section";
import {
  GraduationCap, Users, BookOpen, Layers, ArrowRight,
  CheckCircle2, Star, Award, Briefcase, Monitor, Code,
  Globe, Smartphone, Brain, TrendingUp, Palette, Video,
  Layout, Shield, Network, Cloud, Database, Sparkles, Zap,
  Check, Camera, Compass
} from "lucide-react";

// Icon map for courses
const categoryIcons: Record<string, React.ReactNode> = {
  "web-development": <Globe className="h-5 w-5" />,
  "app-development": <Smartphone className="h-5 w-5" />,
  "artificial-intelligence": <Brain className="h-5 w-5" />,
  "digital-marketing": <TrendingUp className="h-5 w-5" />,
  "graphic-design": <Palette className="h-5 w-5" />,
  "video-editing": <Video className="h-5 w-5" />,
  "ui-ux": <Layout className="h-5 w-5" />,
  "cyber-security": <Shield className="h-5 w-5" />,
  "networking": <Network className="h-5 w-5" />,
  "freelancing": <Briefcase className="h-5 w-5" />,
  "data-science": <Database className="h-5 w-5" />,
  "cloud-computing": <Cloud className="h-5 w-5" />,
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
  const campusShowcase = galleryItems.slice(0, 6);

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SECTION — Premium Two-Column Layout
          ═══════════════════════════════════════════ */}
      <section className="relative gradient-mesh text-white overflow-hidden min-h-[680px] flex items-center">
        {/* Decorative animated shapes */}
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="hero-shape hero-shape-3" />

        {/* Dot grid & noise overlays */}
        <div className="absolute inset-0 dot-grid opacity-35" />
        <div className="absolute inset-0 noise-overlay" />

        <div className="container-custom relative z-10 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatedSection delay={0}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-black/10">
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                  <span>{tCommon("tagline")}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-emerald-300 font-medium">100% Free Tuition</span>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.12}>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl text-balance leading-[1.08]">
                  {t("hero.title")}
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.24}>
                <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.36}>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/courses">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/95 font-bold px-7 shadow-depth hover:shadow-lifted transition-all duration-300 hover:-translate-y-0.5 text-sm h-11">
                      {t("hero.cta")} <ArrowRight className="ms-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/admissions">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/15 font-semibold px-7 backdrop-blur-md text-sm h-11">
                      {t("hero.ctaSecondary")}
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>

              {/* Trust Indicators */}
              <AnimatedSection delay={0.48}>
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/15 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Saylani Tech Partner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Verified Certifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Hands-on Live Labs</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Col: Interactive Visual Hero Card */}
            <div className="lg:col-span-5 relative">
              <AnimatedSection delay={0.2} direction="left">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Glow Halo */}
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-brand/40 to-teal-400/30 blur-2xl opacity-60 animate-pulse-glow" />

                  {/* Glass Card Container */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-depth">
                    {/* Main Image */}
                    <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                        alt="Students collaborating at MHIT Center"
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Live Badge */}
                      <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span>Lab Batch WD-01 Live</span>
                      </div>
                    </div>

                    {/* Card Content Footer */}
                    <div className="p-5 space-y-3 bg-card/90 dark:bg-card/95 text-foreground backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-brand uppercase tracking-wider">Campus Overview</p>
                          <h4 className="text-base font-bold">State-of-the-Art Labs &amp; Solar Grid</h4>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded-md">
                          <Star className="h-3.5 w-3.5 fill-amber-500" /> 4.9/5.0
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Equipped with high-performance computing hardware, uninterrupted solar energy backup, and certified faculty mentors.
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px] text-muted-foreground font-medium">
                        <span>5,000+ Alumni</span>
                        <span>12 Free Programs</span>
                        <span>Karachi, PK</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Stat Chip */}
                  <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/70 shadow-depth text-foreground animate-float-slow">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">100% Free</p>
                      <p className="text-[10px] text-muted-foreground">Certified Programs</p>
                    </div>
                  </div>

                  {/* Floating Trainee Chip */}
                  <div className="absolute -top-5 -right-5 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/70 shadow-depth text-foreground animate-float">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">12+ Trainers</p>
                      <p className="text-[10px] text-muted-foreground">Industry Experts</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          STATS SECTION — Floating Glass Cards
          ═══════════════════════════════════════════ */}
      <section className="relative z-20 -mt-14">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5" staggerDelay={0.1}>
            {[
              { value: siteConfig.stats.students, suffix: "+", label: t("stats.students"), icon: <GraduationCap className="h-5 w-5" />, color: "from-teal-500 to-emerald-500" },
              { value: siteConfig.stats.trainers, suffix: "", label: t("stats.trainers"), icon: <Users className="h-5 w-5" />, color: "from-blue-500 to-indigo-500" },
              { value: siteConfig.stats.programs, suffix: "", label: t("stats.programs"), icon: <BookOpen className="h-5 w-5" />, color: "from-violet-500 to-purple-500" },
              { value: siteConfig.stats.batches, suffix: "+", label: t("stats.batches"), icon: <Layers className="h-5 w-5" />, color: "from-amber-500 to-orange-500" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="text-center border-0 shadow-depth glass-card hover-lift">
                  <CardContent className="p-5 lg:p-6">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3 shadow-md`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-extrabold tracking-tight lg:text-3xl text-foreground">
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
          FEATURED COURSES — Image Cards
          ═══════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 px-3 py-1">
              <Zap className="h-3 w-3 mr-1 text-brand" /> Career Tracks
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{t("featuredCourses.title")}</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{t("featuredCourses.subtitle")}</p>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
            {featured.map((course) => (
              <StaggerItem key={course.id}>
                <Link href={`/courses/${course.slug}`}>
                  <Card className="h-full group hover:shadow-lifted hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border-0 shadow-float flex flex-col justify-between">
                    <div>
                      {/* High-Resolution Course Image */}
                      <div className="relative h-44 w-full overflow-hidden bg-muted">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black/60 text-white backdrop-blur-md border border-white/10 text-[10px] font-semibold">
                            {course.duration}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 backdrop-blur-md text-white border border-white/10">
                            {categoryIcons[course.category] || <Code className="h-4 w-4" />}
                          </div>
                        </div>

                        {/* Bottom Tagline on Image */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-[11px] font-medium bg-brand/90 px-2 py-0.5 rounded text-white shadow-xs">
                            {tCourses(course.level as "beginner" | "intermediate" | "advanced")}
                          </span>
                          <span className="text-[11px] text-white/80">
                            {course.totalClasses} Classes
                          </span>
                        </div>
                      </div>

                      {/* Course Card Body */}
                      <CardContent className="p-5 space-y-3">
                        <h3 className="font-bold text-base group-hover:text-brand transition-colors duration-200">
                          {course.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>
                        
                        <div className="flex flex-wrap gap-1.5 pt-1">
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
                    </div>

                    <div className="px-5 pb-5 pt-0">
                      <div className="flex items-center justify-between text-xs font-semibold text-brand pt-3 border-t border-border/50">
                        <span>Enroll Free</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.3} className="text-center mt-10">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md h-11 px-6 font-semibold">
                {tCommon("viewAll")} {tCourses("title")} <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CAMPUS LIFE & FACILITIES — Visual Showcase
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-muted/30 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 px-3 py-1">
              <Camera className="h-3 w-3 mr-1 text-brand" /> Campus Highlights
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">State-of-the-Art Learning Environment</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Explore our laboratories, campus facilities, hackathon competitions, and convocation ceremonies.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {campusShowcase.map((item) => (
              <StaggerItem key={item.id}>
                <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-float hover:shadow-lifted hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="capitalize text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                      <p className="text-xs text-white/70 font-mono">{item.date}</p>
                      <h4 className="text-sm font-bold leading-tight">{item.title}</h4>
                      <p className="text-[11px] text-white/80 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.3} className="text-center mt-10">
            <Link href="/gallery">
              <Button variant="outline" size="sm" className="h-9 px-5 text-xs font-semibold">
                Explore Full Media Gallery <ArrowRight className="ms-2 h-3.5 w-3.5" />
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
