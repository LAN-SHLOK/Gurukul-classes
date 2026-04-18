"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBg() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles-bg"
      className="absolute inset-0 z-0 pointer-events-none"
      options={{
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
          number: { value: 40, density: { enable: true } },
          color: { value: "#2D31FA" },
          opacity: { value: 0.15 },
          size: { value: { min: 1, max: 3 } },
          links: {
            enable: true,
            color: "#2D31FA",
            opacity: 0.08,
            distance: 150,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            random: true,
            outModes: { default: "bounce" },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
