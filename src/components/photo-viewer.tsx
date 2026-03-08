"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Photo = {
  id: string;
  url: string;
};

export function PhotoViewer({ photos }: { photos: Photo[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const photoId = searchParams.get("photo");
    if (photoId) {
      const idx = photos.findIndex((p) => p.id === photoId);
      if (idx !== -1) {
        setCurrentIndex(idx);
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [searchParams, photos]);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("photo", photos[index].id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeViewer = () => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("photo");
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(newIndex);
    const params = new URLSearchParams(searchParams.toString());
    params.set("photo", photos[newIndex].id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(newIndex);
    const params = new URLSearchParams(searchParams.toString());
    params.set("photo", photos[newIndex].id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextSlide, prevSlide, closeViewer]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.id}
            onClick={() => openViewer(index)}
            className="group relative aspect-square overflow-hidden cursor-pointer p-0 border-none bg-transparent"
            aria-label={`View photo ${index + 1}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${photo.url}')` }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
          <button
            type="button"
            onClick={closeViewer}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all z-50"
            aria-label="Close viewer"
          >
            <X className="w-8 h-8" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-6 p-4 text-white/50 hover:text-white bg-black/10 hover:bg-black/30 rounded-full transition-all z-50"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-6 p-4 text-white/50 hover:text-white bg-black/10 hover:bg-black/30 rounded-full transition-all z-50"
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 z-40">
            <div className="relative w-full h-full">
              <Image
                src={photos[currentIndex].url}
                alt="Expanded view"
                fill
                priority
                sizes="100vw"
                className="object-contain drop-shadow-2xl animate-in fade-in duration-300"
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-sm tracking-widest font-mono z-50">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
