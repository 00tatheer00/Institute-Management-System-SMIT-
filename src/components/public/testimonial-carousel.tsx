"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  studentName: string;
  quote: string;
  courseName: string;
  batchName: string;
  avatar?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Auto-play
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((story) => (
            <div
              key={story.id}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <Card className="h-full border-0 shadow-float hover-lift glass-card">
                <CardContent className="p-6 space-y-4 relative">
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 text-brand/10">
                    <Quote className="h-10 w-10" />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-muted-foreground italic leading-relaxed relative z-10">
                    &ldquo;{story.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    {story.avatar ? (
                      <img
                        src={story.avatar}
                        alt={story.studentName}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-brand/30 shadow-brand shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold shadow-brand shrink-0">
                        {story.studentName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{story.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {story.courseName} — {story.batchName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 backdrop-blur-sm transition-all hover:bg-brand hover:text-white hover:border-brand hover:shadow-brand",
            !canScrollPrev && "opacity-40 cursor-not-allowed"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dots */}
        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                selectedIndex === i
                  ? "w-6 bg-brand shadow-glow-sm"
                  : "w-2 bg-muted-foreground/25 hover:bg-muted-foreground/40"
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 backdrop-blur-sm transition-all hover:bg-brand hover:text-white hover:border-brand hover:shadow-brand",
            !canScrollNext && "opacity-40 cursor-not-allowed"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
