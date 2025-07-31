import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./animated-background";

interface SectionWrapperProps {
  children: ReactNode;
  variant?: "default" | "hero" | "featured" | "testimonial" | "newsletter";
  className?: string;
  background?: "animated" | "gradient" | "pattern" | "solid";
  padding?: "sm" | "md" | "lg" | "xl";
}

export function SectionWrapper({
  children,
  variant = "default",
  className,
  background = "animated",
  padding = "lg"
}: SectionWrapperProps) {
  const getPaddingClass = () => {
    switch (padding) {
      case "sm": return "py-8";
      case "md": return "py-12";
      case "lg": return "py-16";
      case "xl": return "py-20";
      default: return "py-16";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "hero":
        return "relative overflow-hidden";
      case "featured":
        return "relative bg-gradient-to-b from-background via-muted/10 to-background dark:from-background dark:via-muted/5 dark:to-background";
      case "testimonial":
        return "relative bg-gradient-to-r from-gold/5 via-amber-50/50 to-gold/5 dark:from-gold/10 dark:via-background dark:to-gold/10";
      case "newsletter":
        return "relative bg-gradient-to-br from-gold/20 via-amber-100/30 to-gold/20 dark:from-gold/10 dark:via-amber-900/20 dark:to-gold/10 overflow-hidden";
      default:
        return "relative";
    }
  };

  const getBackgroundElement = () => {
    if (background === "animated") {
      return <AnimatedBackground variant={variant === "hero" ? "hero" : variant === "newsletter" ? "subtle" : "default"} />;
    }
    if (background === "pattern") {
      return (
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[length:20px_20px]" />
        </div>
      );
    }
    if (background === "gradient") {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent dark:from-transparent dark:via-gold/10 dark:to-transparent" />
      );
    }
    return null;
  };

  return (
    <section className={cn(getVariantStyles(), getPaddingClass(), className)}>
      {getBackgroundElement()}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
