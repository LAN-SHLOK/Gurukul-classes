"use client";

import { useContext } from "react";
import { LenisContext } from "@/components/layout/SmoothScrollProvider";

export function useLenis() {
  const ctx = useContext(LenisContext);
  return ctx.get();
}
