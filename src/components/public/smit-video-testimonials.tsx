"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { VideoModal } from "@/components/public/video-modal";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const videoStories = [
  {
    id: "story-1",
    name: "Muhammad Saad",
    role: "Full Stack Engineer at 10Pearls",
    course: "Web & Mobile App Dev",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quote: "SMIT gave me practical hands-on skills that changed my life and earned me an international remote salary.",
  },
  {
    id: "story-2",
    name: "Muhammad Anas",
    role: "Senior React Developer at Folio3",
    course: "Full Stack Web Development",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quote: "From having no laptop to becoming a team lead, Saylani & MHIT faculty supported me every step of the way.",
  },
  {
    id: "story-3",
    name: "Ayesha Tariq",
    role: "AI Data Analyst at Careem",
    course: "Artificial Intelligence & Python",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quote: "100% free quality education with top-notch labs. Proud to be an SMIT certified woman in tech!",
  },
  {
    id: "story-4",
    name: "Bilal Sheikh",
    role: "Mobile App Lead at VentureDive",
    course: "Flutter & Dart Mobile",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    quote: "The practical projects we built in class were directly added to my portfolio, which landed me my dream job.",
  },
];

export function SmitVideoTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videoStories.length - 2 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= videoStories.length - 2 ? 0 : prev + 1));
  };

  return (
    <>
      <section className="section-padding bg-slate-50/70 dark:bg-slate-900/30 overflow-hidden">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading & Controls */}
            <div className="lg:col-span-5 space-y-5">
              <Badge className="bg-[#0284c7]/15 text-[#0284c7] border-[#0284c7]/30 text-xs px-3.5 py-1 font-bold uppercase tracking-wider">
                STUDENT VOICES
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                What Our Students<br />
                <span className="text-[#0284c7]">Say About Us</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                Hear directly from our alumni whose careers were transformed through free institutional tech education at SMIT and MHIT.
              </p>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrev}
                  className="h-11 w-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                  aria-label="Previous story"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="h-11 w-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                  aria-label="Next story"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right Column: Video Story Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {videoStories.slice(currentIndex, currentIndex + 2).map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={() =>
                      setSelectedVideo({
                        url: story.videoUrl,
                        title: `${story.name} — Student Story`,
                      })
                    }
                    className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-900 shadow-float hover:shadow-lifted hover:-translate-y-1.5 transition-all duration-300 border border-slate-800"
                  >
                    {/* Background Image */}
                    <div className="relative h-80 w-full overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30" />

                      {/* Top Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="text-[10px] font-bold bg-[#0284c7] text-white px-2.5 py-1 rounded-full shadow-xs">
                          {story.course}
                        </span>
                      </div>

                      {/* Center Play Button with Glowing Pulse */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute h-14 w-14 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="h-14 w-14 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl group-hover:bg-[#0284c7] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            <Play className="h-6 w-6 fill-current translate-x-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Details */}
                      <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                        <h4 className="text-base font-bold text-white leading-tight">
                          {story.name}
                        </h4>
                        <p className="text-xs text-emerald-400 font-medium">
                          {story.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          videoUrl={selectedVideo.url}
        />
      )}
    </>
  );
}
