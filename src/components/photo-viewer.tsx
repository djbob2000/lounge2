"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Photo = {
  id: string;
  url: string;
};

export function PhotoViewer({ photos }: { photos: Photo[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeViewer = () => setIsOpen(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextSlide, prevSlide]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => openViewer(index)}
            className="group relative aspect-square overflow-hidden cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${photo.url}')` }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/95 backdrop-blur-md">
          <button
            onClick={closeViewer}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-6 p-4 text-white/50 hover:text-white bg-black/10 hover:bg-black/30 rounded-full transition-all z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 p-4 text-white/50 hover:text-white bg-black/10 hover:bg-black/30 rounded-full transition-all z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 z-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[currentIndex].url}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain shadow-2xl animate-in fade-in duration-300"
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-sm tracking-widest font-mono z-50">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
