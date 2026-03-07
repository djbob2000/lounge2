"use client";

import { useState, useTransition } from "react";
import { Plus, GripVertical, Edit, Trash2 } from "lucide-react";
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
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "@/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  position: number;
};

function SortableItem({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

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
        <div>
          <h4 className="text-sm font-bold">{category.name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            /{category.slug}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(category)}
          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(category)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const [formData, setFormData] = useState({ name: "", slug: "" });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newItems = arrayMove(categories, oldIndex, newIndex);
      const updates = newItems.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      setCategories(
        newItems.map((item, index) => ({ ...item, position: index })),
      );

      startTransition(async () => {
        await reorderCategories(updates);
      });
    }
  };

  const handleCreate = async () => {
    startTransition(async () => {
      await createCategory(formData.name, formData.slug);
      setIsCreateOpen(false);
      setFormData({ name: "", slug: "" });
      // We rely on router.refresh/revalidatePath to sync server data later,
      // but ideally we'd optimisticly push to state. For now real data flows down.
    });
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    startTransition(async () => {
      await updateCategory(editTarget.id, formData.name, formData.slug);
      setIsEditOpen(false);
      setEditTarget(null);
    });
  };

  const handleDelete = async (category: Category) => {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      startTransition(async () => {
        await deleteCategory(category.id);
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
      });
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold">Portfolio Categories</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag and drop to reorder categories. This affects the navigation
            menu on your site.
          </p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) setFormData({ name: "", slug: "" });
          }}
        >
          <DialogTrigger
            render={
              <Button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm text-slate-900 dark:text-slate-100" />
            }
          >
            <Plus className="w-5 h-5" /> Add New Category
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Name (e.g., Sketches)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-"),
                  })
                }
              />
              <Input
                placeholder="Slug (e.g., sketches)"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || !formData.slug || isPending}
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
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
              disabled={!formData.name || !formData.slug || isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
              <SortableItem
                key={category.id}
                category={category}
                onEdit={(c) => {
                  setEditTarget(c);
                  setFormData({ name: c.name, slug: c.slug });
                  setIsEditOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {categories.length === 0 && (
        <div className="mt-8 flex items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20 text-slate-400 text-sm">
          No categories found. Create one to get started.
        </div>
      )}
    </>
  );
}
