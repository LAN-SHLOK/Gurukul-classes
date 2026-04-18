"use client";

// @splinetool/react-spline is ESM-only and incompatible with Next.js 15 webpack.
// This is a styled placeholder that visually fills the same decorative space.

interface SplineSceneProps {
  sceneUrl?: string;
  className?: string;
}

export default function SplineScene({ className = "" }: SplineSceneProps) {
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {/* Decorative animated orbs — same visual weight as a Spline scene */}
      <div
        className="absolute inset-0 rounded-full opacity-30 animate-pulse"
        style={{
          background: "radial-gradient(circle at 40% 40%, #2D31FA 0%, transparent 70%)",
          animationDuration: "3s",
        }}
      />
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle at 70% 70%, #818cf8 0%, transparent 60%)",
          animation: "spin 12s linear infinite",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-[#2D31FA]/30 opacity-60"
        style={{ animation: "ping 2s cubic-bezier(0,0,.2,1) infinite" }}
      />
    </div>
  );
}
