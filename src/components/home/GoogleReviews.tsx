"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
}

function ReviewerAvatar({ name, photoUrl }: { name: string; photoUrl: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (photoUrl && !photoUrl.includes("lh3.googleusercontent.com/a-/ALV-EM")) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="w-full h-full rounded-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  // Initials fallback
  return (
    <div className="w-full h-full rounded-full bg-[#2D31FA] flex items-center justify-center">
      <span className="text-white font-black text-sm">{initials}</span>
    </div>
  );
}

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const nextReview = () => setActiveIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  if (loading) {
    return (
      <section className="py-32 px-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#2D31FA]" />
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 md:py-32 px-4 md:px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-center">

          {/* Left — heading + controls */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Badge variant="primary">Testimonials</Badge>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-6xl lg:text-8xl font-black text-black tracking-tighter leading-[0.8]"
              >
                WHAT THEY <br />
                <span className="text-[#2D31FA]">SAY.</span>
              </motion.h2>
            </div>

            <p className="text-2xl font-bold text-gray-400 leading-tight">
              Hear from the parents and students who have lived the Gurukul experience.
            </p>

            <div className="flex gap-4">
              <button
                onClick={prevReview}
                className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={nextReview}
                className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <ChevronRight />
              </button>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center gap-6">
              {/* Real reviewer avatars */}
              <div className="flex -space-x-4">
                {reviews.slice(0, 4).map((r, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                    <ReviewerAvatar name={r.author_name} photoUrl={r.profile_photo_url} />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-black text-black">Google Reviews</p>
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
            </div>
          </div>

          {/* Right — review card */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -top-12 -left-12 w-32 h-32 text-gray-100 -z-10 rotate-12">
              <Quote className="w-full h-full fill-current" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="rounded-[32px] md:rounded-[60px] p-8 md:p-16 shadow-2xl bg-white border-none min-h-[350px] md:min-h-[450px] flex flex-col justify-between">
                  <p className="text-xl md:text-3xl lg:text-4xl font-black text-black tracking-tight leading-snug">
                    &quot;{reviews[activeIndex].text}&quot;
                  </p>

                  <div className="flex items-center justify-between pt-8 md:pt-12">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-[#2D31FA]/10 flex-shrink-0">
                        <ReviewerAvatar
                          name={reviews[activeIndex].author_name}
                          photoUrl={reviews[activeIndex].profile_photo_url}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xl text-black">{reviews[activeIndex].author_name}</h4>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">
                          {reviews[activeIndex].relative_time_description}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 bg-[#2D31FA] text-white px-4 py-2 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-black text-sm">{reviews[activeIndex].rating}.0</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-6">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-[#2D31FA] w-6" : "bg-black/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
