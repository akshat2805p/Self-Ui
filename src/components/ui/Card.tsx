import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "glass-card rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl",
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

export { Card };
