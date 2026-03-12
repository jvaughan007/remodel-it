import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-[#2BB6C9]/20 bg-[#2BB6C9]/10 text-[#2BB6C9]",
        secondary: "border-[#71797E]/20 bg-[#71797E]/10 text-[#71797E]",
        destructive: "border-red-500/20 bg-red-500/10 text-red-600",
        outline: "border-[#71797E]/30 bg-transparent text-[#0A1A2F]",
        success: "border-green-500/20 bg-green-500/10 text-green-600",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-600",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-600",
        purple: "border-purple-500/20 bg-purple-500/10 text-purple-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
