"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SliderImage = {
  id: string;
  url: string;
  title: string | null;
};

export function HomeSlider({ images }: { images: SliderImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center bg-muted transition-colors duration-700">
        <p className="text-muted-foreground uppercase tracking-widest text-sm transition-colors duration-700">
          No featured images
        </p>
      </div>
    );
  }

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden group bg-background transition-colors duration-700">
      {images.map((img, index) => (
        <div
          key={img.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out",
              index === currentIndex ? "scale-105" : "scale-100",
            )}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url('${img.url}')`,
            }}
          />
          {index === currentIndex && (
            <div className="relative h-full flex flex-col items-center justify-center text-center px-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
              <span className="text-white/80 text-sm font-medium tracking-[0.3em] uppercase mb-4">
                Featured
              </span>
              <h2 className="text-white text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8 max-w-4xl drop-shadow-lg">
                {img.title || "Capturing Life's Essence"}
              </h2>
              <button
                type="button"
                className="bg-primary text-primary-foreground px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-all rounded-lg"
              >
                View Portfolio
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Slider Controls */}
      {images.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button
              type="button"
              onClick={prevSlide}
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button
              type="button"
              onClick={nextSlide}
              className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {images.map((img, index) => (
              <button
                type="button"
                key={img.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
