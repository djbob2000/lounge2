"use client";

import { useState, useTransition } from "react";
import { UploadCloud, Trash2, GripHorizontal, Type } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  addSliderPhoto,
  removeSliderPhoto,
  updateSliderTitle,
  reorderSliderPhotos,
} from "@/actions/home-slider";
import { getPresignedUploadUrl } from "@/actions/upload";

type SliderImage = {
  id: string;
  url: string;
  r2Key: string;
  title: string | null;
  position: number;
};

function SortableSliderImage({
  image,
  onDelete,
  onEditTitle,
}: {
  image: SliderImage;
  onDelete: (i: SliderImage) => void;
  onEditTitle: (i: SliderImage) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-video overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border-2 ${
        isDragging
          ? "border-primary shadow-xl z-10 scale-105"
          : "border-transparent"
      } transition-all`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image.url}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0 opacity-60 transition-opacity duration-300" />

      {/* Title preview */}
      <div className="absolute bottom-2 left-4 right-4 text-white text-sm font-bold truncate drop-shadow-md">
        {image.title || "No text overlay"}
      </div>

      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity touch-none cursor-move"
      >
        <GripHorizontal className="w-4 h-4" />
      </button>

      {/* Actions */}
      <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEditTitle(image)}
          className="p-1.5 bg-white/90 text-slate-900 rounded-lg hover:bg-white transition-colors"
          title="Edit Title Overlay"
        >
          <Type className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(image)}
          className="p-1.5 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-colors"
          title="Remove from Slider"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function SliderManager({
  initialImages,
}: {
  initialImages: SliderImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [editTarget, setEditTarget] = useState<SliderImage | null>(null);
  const [titleInput, setTitleInput] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);

      const newItems = arrayMove(images, oldIndex, newIndex);
      const updates = newItems.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      setImages(newItems.map((item, index) => ({ ...item, position: index })));

      startTransition(async () => {
        await reorderSliderPhotos(updates);
      });
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    let completed = 0;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      try {
        const res = await getPresignedUploadUrl(file.name, file.type);
        if (!res.success || !res.presignedUrl || !res.fileUrl || !res.key)
          throw new Error("URL Gen failed");

        await fetch(res.presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        await addSliderPhoto(res.fileUrl, res.key);

        completed++;
        setUploadProgress(Math.round((completed / totalFiles) * 100));
      } catch (err) {
        console.error("Upload failed for file:", file.name, err);
      }
    }

    window.location.reload();
  };

  const handleDelete = async (image: SliderImage) => {
    if (confirm("Remove this image from the home slider?")) {
      startTransition(async () => {
        await removeSliderPhoto(image.id, image.r2Key);
        setImages((prev) => prev.filter((i) => i.id !== image.id));
      });
    }
  };

  const handleSaveTitle = async () => {
    if (!editTarget) return;
    startTransition(async () => {
      await updateSliderTitle(editTarget.id, titleInput);
      setImages((prev) =>
        prev.map((i) =>
          i.id === editTarget.id ? { ...i, title: titleInput } : i,
        ),
      );
      setEditTarget(null);
    });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold">Home Page Slider</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            These images will appear full screen on the home page. Ideal ratio
            is 16:9 or similar cinematic crops.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            id="slider-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            disabled={isUploading}
            className="cursor-pointer relative overflow-hidden"
            onClick={() => document.getElementById("slider-upload")?.click()}
          >
            <div className="flex items-center gap-2">
              {isUploading ? (
                <span>Uploading... {uploadProgress}%</span>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" /> Add Images
                </>
              )}
              {isUploading && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              )}
            </div>
          </Button>
        </div>
      </div>

      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image Title</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500 mb-2">
              This text will be overlayed on the image. Leave blank for no text.
            </p>
            <Input
              placeholder="e.g. Capturing Life's Essence"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTitle} disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {images.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 text-slate-400">
          <p className="text-sm font-medium">No slider images yet</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              {images.map((image) => (
                <SortableSliderImage
                  key={image.id}
                  image={image}
                  onDelete={handleDelete}
                  onEditTitle={(i) => {
                    setEditTarget(i);
                    setTitleInput(i.title || "");
                  }}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )}
    </>
  );
}
