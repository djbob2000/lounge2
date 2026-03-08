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
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Image as ImageIcon, Star, Trash2, UploadCloud } from "lucide-react";
import { useState, useTransition } from "react";
import {
  deletePhotoDb,
  reorderPhotos,
  savePhotoToDb,
  setAlbumCover,
  togglePhotoSlider,
} from "@/actions/photos";
import { getPresignedUploadUrl } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import imageCompression from "browser-image-compression";

type Photo = {
  id: string;
  url: string;
  r2Key: string;
  position: number;
  isSliderImage: boolean;
};

function SortablePhoto({
  photo,
  onDelete,
  onSetCover,
  onToggleSlider,
  isCover,
}: {
  photo: Photo;
  onDelete: (p: Photo) => void;
  onSetCover: (p: Photo) => void;
  onToggleSlider: (p: Photo) => void;
  isCover: boolean;
}) {
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
      className={`group relative aspect-square overflow-hidden rounded-xl bg-muted border-2 ${
        isCover
          ? "border-primary"
          : isDragging
            ? "border-primary shadow-xl z-10 scale-105"
            : "border-transparent"
      } transition-all`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${photo.url}')` }}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

      {isCover && (
        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded">
          Cover
        </div>
      )}
      {photo.isSliderImage && (
        <div className="absolute top-2 left-16 bg-amber-400 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded flex items-center gap-1">
          <Star className="w-3 h-3" fill="currentColor" /> Slider
        </div>
      )}

      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity touch-none cursor-move"
        aria-label="Drag to reorder"
      >
        <GripHorizontal className="w-4 h-4" />
      </button>

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
        <button
          type="button"
          onClick={() => onSetCover(photo)}
          className="flex-1 text-xs font-semibold py-1.5 bg-background/90 text-foreground rounded-lg hover:bg-background transition-colors flex items-center justify-center gap-1"
        >
          <ImageIcon className="w-3 h-3" /> Cover
        </button>
        <button
          type="button"
          onClick={() => onToggleSlider(photo)}
          className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
            photo.isSliderImage
              ? "bg-amber-400/90 text-white hover:bg-amber-400"
              : "bg-background/90 text-foreground hover:bg-background"
          }`}
        >
          <Star className="w-3 h-3" fill={photo.isSliderImage ? "currentColor" : "none"} /> Slider
        </button>
        <button
          type="button"
          onClick={() => onDelete(photo)}
          className="p-1.5 bg-destructive/90 text-destructive-foreground rounded-lg hover:bg-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function PhotoManager({
  albumId,
  currentCoverKey,
  initialPhotos,
}: {
  albumId: string;
  currentCoverKey: string | null;
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [coverKey, setCoverKey] = useState(currentCoverKey);
  const [, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [, setDragCounter] = useState(0);

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
        position: index,
      }));

      setPhotos(newItems.map((item, index) => ({ ...item, position: index })));

      startTransition(async () => {
        await reorderPhotos(updates, albumId);
      });
    }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    let completed = 0;

    const compressionOptions = {
      maxWidthOrHeight: 2560,
      useWebWorker: true,
      initialQuality: 0.6,
    };

    for (let i = 0; i < totalFiles; i++) {
      let file = files[i];
      try {
        // Compress image before upload
        file = await imageCompression(files[i], compressionOptions);

        // 1. Get Presigned URL
        const res = await getPresignedUploadUrl(files[i].name, file.type);
        if (!res.success || !res.presignedUrl || !res.fileUrl || !res.key) {
          throw new Error("Failed to get presigned URL");
        }

        // 2. Upload to Cloudflare R2 / Backblaze B2
        await fetch(res.presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        // 3. Save to DB
        await savePhotoToDb(albumId, res.fileUrl, res.key);

        // Optimistic local update isn't strictly necessary if we refresh,
        // but it helps. For now we will just re-fetch by doing router.refresh after all uploads.

        completed++;
        setUploadProgress(Math.round((completed / totalFiles) * 100));
      } catch (err) {
        console.error("Upload failed for file:", file.name, err);
      }
    }

    // A full refresh is better to catch the new DB records
    window.location.reload();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount === 0) setIsDragOver(false);
      return newCount;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = async (photo: Photo) => {
    if (confirm("Are you sure you want to delete this photo forever?")) {
      startTransition(async () => {
        await deletePhotoDb(photo.id, photo.r2Key, albumId);
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        if (coverKey === photo.r2Key) setCoverKey(null);
      });
    }
  };

  const handleSetCover = async (photo: Photo) => {
    startTransition(async () => {
      await setAlbumCover(albumId, photo.url, photo.r2Key);
      setCoverKey(photo.r2Key);
    });
  };

  const handleToggleSlider = async (photo: Photo) => {
    startTransition(async () => {
      await togglePhotoSlider(photo.id, !photo.isSliderImage, albumId);
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, isSliderImage: !p.isSliderImage } : p)),
      );
    });
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: this is a drag and drop zone
    <div
      className="relative min-h-[60vh] rounded-xl transition-colors"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute -inset-4 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm border-2 border-primary border-dashed rounded-xl">
          <div className="flex flex-col items-center pointer-events-none">
            <UploadCloud className="w-16 h-16 mb-4 text-primary animate-bounce" />
            <p className="text-2xl font-bold text-primary">Drop photos to upload</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold">Manage Photos</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder photos. High quality uploads recommended.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            id="photos-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            disabled={isUploading}
            className="cursor-pointer relative overflow-hidden"
            onClick={() => document.getElementById("photos-upload")?.click()}
          >
            <div className="flex items-center gap-2">
              {isUploading ? (
                <span>Uploading... {uploadProgress}%</span>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" /> Upload Photos
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

      {photos.length === 0 ? (
        <label
          htmlFor="photos-upload"
          className={`mt-8 flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
          }`}
        >
          <ImageIcon
            className={`w-12 h-12 mb-4 transition-opacity ${isDragOver ? "opacity-100 text-primary" : "opacity-50"}`}
          />
          <p className="text-sm font-medium">
            {isDragOver ? "Drop photos here" : "No photos in this album yet"}
          </p>
          <p className="text-xs mt-1">
            {isDragOver
              ? "Release to start uploading"
              : "Upload or drag & drop memories to get started"}
          </p>
        </label>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
              {photos.map((photo) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  isCover={photo.r2Key === coverKey}
                  onDelete={handleDelete}
                  onSetCover={handleSetCover}
                  onToggleSlider={handleToggleSlider}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )}
    </div>
  );
}
