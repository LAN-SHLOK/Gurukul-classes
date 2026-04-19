"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border-2 px-4 py-2 text-base text-white bg-white/[0.04] transition-all duration-200 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
            "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "hover:border-gray-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 ml-1 text-sm font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
