import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      data-slot="select"
      className={cn(
        "flex h-9 w-full rounded-lg border border-[#71797E]/30 bg-white px-3 py-1 text-sm text-[#0A1A2F] shadow-sm transition-colors outline-none focus-visible:border-[#2BB6C9] focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Select.displayName = "Select";

export { Select };
