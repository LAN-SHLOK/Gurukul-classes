"use client";

export default function GrainTexture() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.05]">
      <div 
        className="w-full h-full"
        style={{ 
          backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
          filter: 'contrast(150%) brightness(1000%)',
          transform: 'scale(0.5)'
        }}
      />
    </div>
  );
}
