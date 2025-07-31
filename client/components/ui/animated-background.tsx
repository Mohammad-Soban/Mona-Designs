import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
}

function FloatingElement({ size, x, y, delay, duration, opacity }: FloatingElementProps) {
  return (
    <div
      className="absolute rounded-full bg-gradient-to-br from-gold/20 to-amber-500/10 blur-sm"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        animation: `float ${duration}s ease-in-out infinite ${delay}s`,
      }}
    />
  );
}

interface AnimatedBackgroundProps {
  variant?: "default" | "hero" | "subtle";
  className?: string;
}

export function AnimatedBackground({ variant = "default", className }: AnimatedBackgroundProps) {
  const [elements, setElements] = useState<FloatingElementProps[]>([]);

  useEffect(() => {
    const generateElements = () => {
      const count = variant === "hero" ? 15 : variant === "subtle" ? 8 : 12;
      const newElements: FloatingElementProps[] = [];

      for (let i = 0; i < count; i++) {
        newElements.push({
          size: Math.random() * 100 + 50,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 15,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }

      setElements(newElements);
    };

    generateElements();
  }, [variant]);

  const getBackgroundGradient = () => {
    switch (variant) {
      case "hero":
        return "bg-gradient-to-br from-background via-gold/5 to-amber-100/10 dark:from-background dark:via-gold/10 dark:to-amber-900/20";
      case "subtle":
        return "bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-muted/20";
      default:
        return "bg-gradient-to-br from-background via-muted/20 to-gold/5 dark:from-background dark:via-muted/10 dark:to-gold/10";
    }
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden", getBackgroundGradient(), className)}>
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="geometric" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="currentColor" />
              <path d="M5,5 L15,5 L15,15 L5,15 Z" fill="none" stroke="currentColor" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geometric)" />
        </svg>
      </div>

      {/* Floating Elements */}
      {elements.map((element, index) => (
        <FloatingElement key={index} {...element} />
      ))}

      {/* Radial Gradient Overlays */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-gold/10 via-transparent to-transparent rounded-full blur-3xl opacity-30 dark:opacity-20" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-amber-300/10 via-transparent to-transparent rounded-full blur-3xl opacity-25 dark:opacity-15" />
      
      {variant === "hero" && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-gold/5 via-transparent to-transparent rounded-full blur-3xl opacity-40 dark:opacity-25" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-radial from-amber-400/10 via-transparent to-transparent rounded-full blur-2xl opacity-30 dark:opacity-20" />
        </>
      )}
    </div>
  );
}

// CSS for animations - add this to global.css
export const backgroundAnimations = `
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}
`;
