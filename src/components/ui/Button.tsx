"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "glass" | "glass-accent";
    size?: "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "md", ...props }, ref) => {
        const variants = {
            default: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
            outline: "border border-white/10 bg-transparent hover:bg-white/5 text-foreground",
            ghost: "hover:bg-white/5 text-foreground",
            glass: "glass hover:bg-white/10 text-foreground border-white/10",
            "glass-accent": "glass bg-primary/20 hover:bg-primary/30 text-white border-primary/20",
        };

        const sizes = {
            sm: "h-9 px-3 text-xs rounded-lg",
            md: "h-11 px-6 text-sm rounded-xl",
            lg: "h-14 px-8 text-base rounded-2xl",
            icon: "h-10 w-10 p-2 rounded-xl flex items-center justify-center",
        };

        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...(props as HTMLMotionProps<"button">)}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
