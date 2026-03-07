"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  reorderAlbums,
  toggleAlbumDraft,
} from "@/actions/albums";
import Link from "next/link";

type Album = {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  position: number;
  isDraft: boolean;
  coverImageUrl: string | null;
};

type Category = {
  id: string;
  name: string;
};

function SortableItem({
  album,
  onEdit,
  onDelete,
  onToggle,
}: {
  album: Album;
  onEdit: (a: Album) => void;
  onDelete: (a: Album) => void;
  onToggle: (a: Album) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: album.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-4 bg-white dark:bg-slate-800 border ${
        isDragging
          ? "border-primary shadow-lg z-10 relative"
          : "border-slate-200 dark:border-slate-700 hover:border-primary/50"
      } rounded-xl transition-all`}
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-move text-slate-300 dark:text-slate-600 hover:text-primary transition-colors touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
          {album.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={album.coverImageUrl}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold">{album.title}</h4>
            {album.isDraft && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Draft
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            /{album.slug}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/admin/albums/${album.id}`}
          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          title="Manage Photos"
        >
          <ImageIcon className="w-5 h-5" />
        </Link>
        <button
          onClick={() => onToggle(album)}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700/50 rounded-lg transition-all"
          title={album.isDraft ? "Publish" : "Move to Drafts"}
        >
          {album.isDraft ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => onEdit(album)}
          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          title="Edit Album"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(album)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Delete Album"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function AlbumManager({
  initialAlbums,
  categories,
}: {
  initialAlbums: Album[];
  categories: Category[];
}) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.id || "",
  );
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Album | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: selectedCategory,
  });

  const filteredAlbums = albums
    .filter((a) => a.categoryId === selectedCategory)
    .sort((a, b) => a.position - b.position);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filteredAlbums.findIndex((a) => a.id === active.id);
      const newIndex = filteredAlbums.findIndex((a) => a.id === over.id);

      const newItems = arrayMove(filteredAlbums, oldIndex, newIndex);
      const updates = newItems.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      setAlbums((prev) => {
        const other = prev.filter((p) => p.categoryId !== selectedCategory);
        const updated = newItems.map((item, index) => ({
          ...item,
          position: index,
        }));
        return [...other, ...updated];
      });

      startTransition(async () => {
        await reorderAlbums(updates);
      });
    }
  };

  const handleCreate = async () => {
    startTransition(async () => {
      await createAlbum(formData.categoryId, formData.title, formData.slug);
      setIsCreateOpen(false);
      setFormData({ title: "", slug: "", categoryId: selectedCategory });
    });
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    startTransition(async () => {
      await updateAlbum(
        editTarget.id,
        formData.categoryId,
        formData.title,
        formData.slug,
      );
      setIsEditOpen(false);
      setEditTarget(null);
    });
  };

  const handleToggleDraft = async (album: Album) => {
    startTransition(async () => {
      await toggleAlbumDraft(album.id, !album.isDraft);
      setAlbums((prev) =>
        prev.map((a) =>
          a.id === album.id ? { ...a, isDraft: !a.isDraft } : a,
        ),
      );
    });
  };

  const handleDelete = async (album: Album) => {
    if (
      confirm(
        `Are you sure you want to delete ${album.title}? This will also delete all photos inside it!`,
      )
    ) {
      startTransition(async () => {
        await deleteAlbum(album.id);
        setAlbums((prev) => prev.filter((a) => a.id !== album.id));
      });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                Category: {c.name}
              </option>
            ))}
          </select>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open)
              setFormData({
                title: "",
                slug: "",
                categoryId: selectedCategory,
              });
            else setFormData((p) => ({ ...p, categoryId: selectedCategory }));
          }}
        >
          <DialogTrigger
            render={
              <Button
                disabled={!selectedCategory}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm text-slate-900 dark:text-slate-100"
              />
            }
          >
            <Plus className="w-5 h-5" /> Add New Album
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Album</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Title (e.g., Summer Pre-Wed)"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-"),
                  })
                }
              />
              <Input
                placeholder="Slug (e.g., summer-pre-wed)"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={!formData.title || !formData.slug || isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Input
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleEdit}
              disabled={!formData.title || !formData.slug || isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="mt-8 flex items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 text-slate-400 text-sm">
            Create a Category first before creating albums.
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className="mt-8 flex items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 text-slate-400 text-sm">
            No albums in this category. Create one to get started.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredAlbums.map((a) => a.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredAlbums.map((album) => (
                <SortableItem
                  key={album.id}
                  album={album}
                  onEdit={(a) => {
                    setEditTarget(a);
                    setFormData({
                      title: a.title,
                      slug: a.slug,
                      categoryId: a.categoryId,
                    });
                    setIsEditOpen(true);
                  }}
                  onToggle={handleToggleDraft}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  );
}
