"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-[#2BB6C9]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#2BB6C9] text-white hover:bg-[#239AA9] shadow-sm",
        destructive:
          "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20",
        outline:
          "border-[#71797E]/30 bg-white hover:bg-gray-50 text-[#0A1A2F]",
        secondary:
          "bg-[#0A1A2F]/5 text-[#0A1A2F] hover:bg-[#0A1A2F]/10",
        ghost:
          "hover:bg-[#0A1A2F]/5 text-[#0A1A2F]",
        link: "text-[#2BB6C9] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4 py-2",
        sm: "h-8 gap-1 rounded-md px-3 text-xs",
        lg: "h-10 gap-2 rounded-lg px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
