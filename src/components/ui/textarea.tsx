import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-[#71797E]/30 bg-white px-3 py-2 text-sm text-[#0A1A2F] shadow-sm transition-colors outline-none placeholder:text-[#71797E]/60 focus-visible:border-[#2BB6C9] focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
