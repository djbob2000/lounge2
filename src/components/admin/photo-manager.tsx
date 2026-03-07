"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  GripHorizontal,
} from "lucide-react";
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
import {
  savePhotoToDb,
  deletePhotoDb,
  setAlbumCover,
  reorderPhotos,
} from "@/actions/photos";
import { getPresignedUploadUrl } from "@/actions/upload";

type Photo = {
  id: string;
  url: string;
  r2Key: string;
  position: number;
};

function SortablePhoto({
  photo,
  onDelete,
  onSetCover,
  isCover,
}: {
  photo: Photo;
  onDelete: (p: Photo) => void;
  onSetCover: (p: Photo) => void;
  isCover: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 border-2 ${
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

      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity touch-none cursor-move"
      >
        <GripHorizontal className="w-4 h-4" />
      </button>

      {/* Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
        <button
          onClick={() => onSetCover(photo)}
          className="flex-1 text-xs font-semibold py-1.5 bg-white/90 text-slate-900 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-1"
          title="Set as Album Cover"
        >
          <ImageIcon className="w-3 h-3" /> Cover
        </button>
        <button
          onClick={() => onDelete(photo)}
          className="p-1.5 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-colors"
          title="Delete Photo"
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
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        // 1. Get Presigned URL
        const res = await getPresignedUploadUrl(file.name, file.type);
        if (!res.success || !res.presignedUrl || !res.fileUrl || !res.key) {
          throw new Error("Failed to get presigned URL");
        }

        // 2. Upload to Cloudflare R2
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

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold">Manage Photos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
        <div className="mt-8 flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 text-slate-400">
          <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-sm font-medium">No photos in this album yet</p>
          <p className="text-xs mt-1">Upload memories to get started</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SortableContext
              items={photos.map((p) => p.id)}
              strategy={rectSortingStrategy}
            >
              {photos.map((photo) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  isCover={photo.r2Key === coverKey}
                  onDelete={handleDelete}
                  onSetCover={handleSetCover}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )}
    </>
  );
}
