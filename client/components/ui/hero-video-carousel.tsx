import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./animated-background";

interface VideoSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  video?: string;
  cta: {
    primary: { text: string; href: string };
    secondary: { text: string; href: string };
  };
}

const videoCarousel: VideoSlide[] = [
  {
    id: 1,
    title: "Royal Wedding Collection",
    subtitle: "Premium Ethnic Wear",
    description:
      "Discover our exclusive range of handcrafted sherwanis and lehengas, perfect for your special day",
    thumbnail:
      "bg-gradient-to-br from-red-600/30 via-orange-500/20 to-yellow-500/30",
    video: "/static/hero_video.mp4",
    cta: {
      primary: { text: "Shop Collection", href: "/collections" },
      secondary: { text: "View Lookbook", href: "/collections" },
    },
  },
  {
    id: 2,
    title: "Festive Kurta Collection",
    subtitle: "Comfort Meets Elegance",
    description:
      "Traditional kurtas reimagined with contemporary cuts and premium fabrics for every celebration",
    thumbnail:
      "bg-gradient-to-br from-blue-600/30 via-purple-500/20 to-pink-500/30",
    cta: {
      primary: { text: "Explore Kurtas", href: "/kurtas" },
      secondary: { text: "Size Guide", href: "/size-guide" },
    },
  },
  {
    id: 3,
    title: "Designer Suit Collection",
    subtitle: "Sophisticated & Timeless",
    description:
      "Expertly tailored suits that blend traditional craftsmanship with modern aesthetics",
    thumbnail:
      "bg-gradient-to-br from-green-600/30 via-teal-500/20 to-blue-500/30",
    cta: {
      primary: { text: "Shop Suits", href: "/suits" },
      secondary: { text: "Custom Tailoring", href: "/contact" },
    },
  },
];

export function HeroVideoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isAutoPlaying) {
      // Pause video if on first slide
      if (currentSlide === 0 && videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }
    // Play video if on first slide
    if (currentSlide === 0 && videoRef.current) {
      videoRef.current.play();
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % videoCarousel.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videoCarousel.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + videoCarousel.length) % videoCarousel.length,
    );
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Animation */}
      <AnimatedBackground variant="hero" />

      {/* Slides */}
      <div className="relative w-full h-full">
        {videoCarousel.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full",
            )}
          >
            {/* Slide Background or Video */}
            {slide.video && index === 0 ? (
              <div className="absolute inset-0 w-full h-full z-0">
                <video
                  ref={videoRef}
                  src={slide.video}
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : (
              <div className={cn("w-full h-full", slide.thumbnail)}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            )}

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-8 max-w-5xl px-4">
                {/* Badge */}
                <div className="flex justify-center">
                  <Badge
                    variant="secondary"
                    className="text-sm bg-gold/20 text-gold border-gold/30 backdrop-blur-sm"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {slide.subtitle}
                  </Badge>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-gold/90 to-white bg-clip-text text-transparent">
                    {slide.title}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to={slide.cta.primary.href}>
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-gold hover:bg-gold/90 border border-gold/50 shadow-2xl hover:shadow-gold/20 transition-all duration-300 hover:scale-105"
                    >
                      {slide.cta.primary.text}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to={slide.cta.secondary.href}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 py-6 text-white border-white/70 bg-white/10 hover:bg-white hover:text-black backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      {slide.cta.secondary.text}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 bg-black/30 backdrop-blur-md rounded-full px-6 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 transition-all duration-300"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex space-x-3">
          {videoCarousel.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-500",
                index === currentSlide
                  ? "bg-gold scale-125 shadow-lg shadow-gold/50"
                  : "bg-white/50 hover:bg-white/70",
              )}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 transition-all duration-300"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div className="w-px h-6 bg-white/30 mx-2" />

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 transition-all duration-300"
          onClick={() => {
            setIsAutoPlaying((prev) => {
              // Pause or play video as well
              if (currentSlide === 0 && videoRef.current) {
                if (prev) {
                  videoRef.current.pause();
                } else {
                  videoRef.current.play();
                }
              }
              return !prev;
            });
          }}
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Side Navigation Hints */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 opacity-0 md:opacity-100"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 opacity-0 md:opacity-100"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
    </section>
  );
}
