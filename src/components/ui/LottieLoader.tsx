"use client";

import Lottie from "lottie-react";

// Minimal inline spinner animation — no external file needed
const spinnerAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Spinner",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [70, 70] },
          nm: "Ellipse",
        },
        {
          ty: "st",
          c: { a: 0, k: [0.176, 0.192, 0.98, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 6 },
          lc: 2,
          lj: 2,
          nm: "Stroke",
          d: [{ n: "d", nm: "dash", v: { a: 0, k: 120 } }, { n: "g", nm: "gap", v: { a: 0, k: 100 } }],
        },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
};

interface LottieLoaderProps {
  size?: number;
  className?: string;
}

export default function LottieLoader({ size = 80, className = "" }: LottieLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie
        animationData={spinnerAnimation}
        loop
        style={{ width: size, height: size }}
      />
    </div>
  );
}
