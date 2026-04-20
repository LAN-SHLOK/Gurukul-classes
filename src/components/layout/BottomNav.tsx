"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Users, Calendar, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const BOTTOM_LINKS = [
  { name: "Home",    href: "/",        icon: Home     },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Faculty", href: "/faculty", icon: Users    },
  { name: "Events",  href: "/events",  icon: Calendar },
  { name: "Contact", href: "/contact", icon: Phone    },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden flex justify-center"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      {/* Glassmorphic floating pill */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="flex items-center gap-1 px-3 py-2 rounded-[28px] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.8)] mx-4 bg-black/90 backdrop-blur-2xl border border-white/20"
        style={{ maxWidth: 360, width: "calc(100% - 2rem)" }}
      >
        {BOTTOM_LINKS.map((link, i) => {
          const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className="relative flex-1 flex flex-col items-center gap-[3px] py-1.5 transition-all active:scale-90 press"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Active background blob */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="nav-active-blob"
                    className="absolute inset-0 rounded-[18px] bg-[#2D31FA] active-blob"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                <motion.div
                  animate={active ? { scale: [1, 1.2, 1], rotate: [0, -8, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <link.icon
                    className={cn("w-4 h-4 transition-colors duration-200", active ? "text-white" : "text-white/40")}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </motion.div>
              </div>

              {/* Label */}
              <span
                className={cn(
                  "relative z-10 text-[7px] font-black uppercase tracking-wider leading-none transition-colors duration-200",
                  active ? "text-white" : "text-white/25"
                )}
              >
                {link.name}
              </span>

              {/* Microinteraction ripple dot on active */}
              {active && (
                <motion.div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: [0, 1, 0], y: [4, -6, -12] }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}
