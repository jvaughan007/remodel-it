import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-lg border border-[#71797E]/30 bg-white px-3 py-1 text-sm text-[#0A1A2F] shadow-sm transition-colors outline-none placeholder:text-[#71797E]/60 focus-visible:border-[#2BB6C9] focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
