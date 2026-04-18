"use client";

import { createContext } from "react";

interface LenisCtx {
  get: () => null;
  destroy: () => void;
  reinit: () => void;
}

export const LenisContext = createContext<LenisCtx>({
  get: () => null,
  destroy: () => {},
  reinit: () => {},
});

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Disabled smooth scroll for deployment compatibility
  return (
    <LenisContext.Provider value={{ get: () => null, destroy: () => {}, reinit: () => {} }}>
      {children}
    </LenisContext.Provider>
  );
}
