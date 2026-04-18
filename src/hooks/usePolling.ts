"use client";

import { useEffect, useRef } from "react";

/**
 * Polls a callback every `intervalMs` milliseconds.
 * Stops when the component unmounts.
 */
export function usePolling(callback: () => void, intervalMs = 15000) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
