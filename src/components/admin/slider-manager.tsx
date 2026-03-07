"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";

import { reorderSliderPhotos, togglePhotoSlider } from "@/actions/photos";

type Photo = {
  id: string;
  url: string;
  r2Key: string;
  sliderPosition: number;
};

function SortableSliderItem({ photo, onRemove }: { photo: Photo; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 bg-card border ${
        isDragging
          ? "border-primary shadow-lg z-10 relative"
          : "border-border hover:border-primary/50"
      } rounded-xl transition-all`}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-move text-muted-foreground/50 hover:text-primary transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <Image src={photo.url} alt="Slider photo" fill className="object-cover" sizes="96px" />
        </div>
        <div className="hidden sm:block">
          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
            {photo.id.split("-")[0]}...
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onRemove(photo.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
          aria-label="Remove from slider"
          title="Remove from slider"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function SliderManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => p.id === active.id);
      const newIndex = photos.findIndex((p) => p.id === over.id);

      const newItems = arrayMove(photos, oldIndex, newIndex);
      const updates = newItems.map((item, index) => ({
        id: item.id,
        sliderPosition: index,
      }));

      // Update locally first
      setPhotos(newItems.map((item, index) => ({ ...item, sliderPosition: index })));

      // Save to DB
      startTransition(async () => {
        await reorderSliderPhotos(updates);
      });
    }
  };

  const handleRemove = (id: string) => {
    // Remove locally
    setPhotos((prev) => prev.filter((p) => p.id !== id));

    // Save to DB (set isSliderImage to false)
    startTransition(async () => {
      // we don't need albumId here, togglePhotoSlider makes it optional
      await togglePhotoSlider(id, false);
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold">Slider Images</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop to reorder images on the homepage slider. Click the X to hide an image
            from the slider (it will remain in its album).
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {photos.map((photo) => (
              <SortableSliderItem key={photo.id} photo={photo} onRemove={handleRemove} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {photos.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-xl bg-muted/20">
          <p className="text-muted-foreground text-sm font-medium mb-2">No slider images found</p>
          <p className="text-muted-foreground/60 text-xs text-center max-w-sm">
            Go to any album and click the "Slider" star icon on a photo to add it to the homepage
            slider.
          </p>
        </div>
      )}
    </>
  );
}
