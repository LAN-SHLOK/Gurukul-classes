"use client";

import { useEffect, useState } from "react";

type Particle = { id: number; x: number; y: number; size: number; opacity: number; delay: number };

export default function ParticlesBg() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const particleArray: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: (i * 17 + 13) % 100,
      y: (i * 23 + 7) % 100,
      size: (i % 4) + 1,
      opacity: ((i % 4) + 1) * 0.08,
      delay: (i % 5)
    }));
    setParticles(particleArray);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-[#2D31FA] animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: '3s',
            boxShadow: `0 0 ${particle.size * 2}px rgba(45, 49, 250, 0.3)`
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D31FA]/5 via-transparent to-[#2D31FA]/5" />
    </div>
  );
}