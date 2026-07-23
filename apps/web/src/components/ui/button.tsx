"""
Button Component
"""

import * as React from "react";
import * as ButtonPrimitive from "@radix-ui/react-button";

import { cn } from "@/lib/utils";

const Button = React.forwardRef<
  React.ElementRef<typeof ButtonPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ButtonPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ButtonPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "bg-primary text-primary-foreground hover:bg-primary/90",
      className
    )}
    {...props}
  />
));
Button.displayName = ButtonPrimitive.Root.displayName;

export { Button };

// Add other button variants as needed