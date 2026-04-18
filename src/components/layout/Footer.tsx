"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-12 md:pt-20 pb-20 md:pb-12 px-4 md:px-6 border-t border-white/5">
      <div className="container mx-auto max-w-7xl">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Gurukul Classes" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-base tracking-tighter">Gurukul<span className="text-[#2D31FA]">.</span></span>
            </div>
            <p className="text-xs text-white/30 font-medium leading-relaxed">
              Premium offline coaching in Ahmedabad since 2011.
            </p>
            <div className="flex gap-2.5">
              <Link href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#2D31FA] transition-all">
                <Instagram className="w-3.5 h-3.5 text-white" />
              </Link>
              <Link href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#2D31FA] transition-all">
                <Facebook className="w-3.5 h-3.5 text-white" />
              </Link>
              <Link href={`mailto:${SITE_CONFIG.email}`}
                className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-[#2D31FA] transition-all">
                <Mail className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>
          </div>

          {/* Learn */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D31FA]">Learn</p>
            <ul className="space-y-2.5">
              {[
                { name: "Courses",    href: "/courses"    },
                { name: "Faculty",    href: "/faculty"    },
                { name: "Events",     href: "/events"     },
                { name: "Admissions", href: "/admissions" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D31FA]">Company</p>
            <ul className="space-y-2.5">
              {[
                { name: "About",   href: "/about"   },
                { name: "Contact", href: "/contact" },
                { name: "Terms",   href: "/terms"   },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white transition-colors font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D31FA]">Contact</p>
            <div className="space-y-2">
              <p className="text-xs text-white/40 font-medium">{SITE_CONFIG.email}</p>
              <p className="text-xs text-white/40 font-medium">{SITE_CONFIG.phone}</p>
              <p className="text-xs text-white/40 font-medium">{SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/20 font-medium">
            © {currentYear} Gurukul Classes · Est. 2011
          </p>
          <Link href="/admissions"
            className="text-[11px] font-black uppercase tracking-widest text-[#2D31FA] hover:text-white transition-colors">
            Join Now →
          </Link>
        </div>
      </div>
    </footer>
  );
}
