"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const SUBJECTS = ["Physics", "Chemistry", "Maths", "Biology", "JEE", "NEET"];
// Measured pill widths based on text length
const PILL_H = 34;
const PILL_RADIUS = 17;

function getPillWidth(text: string): number {
  return text.length * 9 + 40;
}

export default function HeroPhysics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.offsetWidth || window.innerWidth;
    const H = canvas.offsetHeight || window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const { Engine, Render, Runner, Bodies, Body, World, Events } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0.04 } });

    const render = Render.create({
      canvas,
      engine,
      options: { width: W, height: H, wireframes: false, background: "transparent" },
    });

    // Invisible walls
    const walls = [
      Bodies.rectangle(W / 2, H + 25, W + 100, 50, { isStatic: true, render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 } }),
      Bodies.rectangle(-25, H / 2, 50, H + 100, { isStatic: true, render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 } }),
      Bodies.rectangle(W + 25, H / 2, 50, H + 100, { isStatic: true, render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 } }),
    ];

    const badges = SUBJECTS.map((label) => {
      const w = getPillWidth(label);
      const x = PILL_RADIUS + Math.random() * (W - 2 * PILL_RADIUS - w);
      const y = -(Math.random() * H * 0.6 + 50);
      const body = Bodies.rectangle(x + w / 2, y, w, PILL_H, {
        restitution: 0.5,
        friction: 0.05,
        frictionAir: 0.025,
        render: { fillStyle: "transparent", strokeStyle: "transparent", lineWidth: 0 },
        label,
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 1.5, y: Math.random() * 1.5 });
      return body;
    });

    World.add(engine.world, [...walls, ...badges]);

    // Custom draw pills on top of default render
    Events.on(render, "afterRender", () => {
      const ctx = render.context;
      ctx.save();

      badges.forEach((body) => {
        const { x, y } = body.position;
        const angle = body.angle;
        const label = body.label;
        const w = getPillWidth(label);
        const h = PILL_H;
        const r = h / 2;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Pill background
        ctx.beginPath();
        ctx.moveTo(-w / 2 + r, -h / 2);
        ctx.lineTo(w / 2 - r, -h / 2);
        ctx.arcTo(w / 2, -h / 2, w / 2, h / 2, r);
        ctx.lineTo(w / 2 - r, h / 2);
        ctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r);
        ctx.closePath();

        // Glass-style fill
        ctx.fillStyle = "rgba(45, 49, 250, 0.18)";
        ctx.fill();

        // Border
        ctx.strokeStyle = "rgba(45, 49, 250, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Text
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "600 12px -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = "0.5px";
        ctx.fillText(label, 0, 0.5);

        ctx.restore();
      });

      ctx.restore();
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      const nW = canvas.offsetWidth;
      const nH = canvas.offsetHeight;
      canvas.width  = nW;
      canvas.height = nH;
      render.options.width  = nW;
      render.options.height = nH;
      render.canvas.width   = nW;
      render.canvas.height  = nH;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[2] pointer-events-none hidden md:block"
    />
  );
}
