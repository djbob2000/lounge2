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
import { Edit, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import slugify from "slugify";

import {
  createCategory,
  deleteCategory,
  reorderCategories,
  updateCategory,
} from "@/actions/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Category = {
  id: string;
  name: string;
  slug: string;
  position: number;
  showInMenu: boolean;
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
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
        <div>
          <h4 className="text-sm font-bold text-foreground">{category.name}</h4>
          <p className="text-xs text-muted-foreground">/{category.slug}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          aria-label="Edit category"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(category)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
          aria-label="Delete category"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const [formData, setFormData] = useState({ name: "", slug: "", showInMenu: true });

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

      setCategories(newItems.map((item, index) => ({ ...item, position: index })));

      startTransition(async () => {
        await reorderCategories(updates);
      });
    }
  };

  const handleCreate = async () => {
    startTransition(async () => {
      const res = await createCategory(formData.name, formData.slug, formData.showInMenu);
      if (res.success && res.category) {
        setCategories((prev) => [...prev, res.category as Category]);
      }
      setIsCreateOpen(false);
      setFormData({ name: "", slug: "", showInMenu: true });
    });
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    startTransition(async () => {
      const res = await updateCategory(
        editTarget.id,
        formData.name,
        formData.slug,
        formData.showInMenu,
      );
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editTarget.id
              ? { ...c, name: formData.name, slug: formData.slug, showInMenu: formData.showInMenu }
              : c,
          ),
        );
      }
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
          <h3 className="text-2xl font-bold">Categories</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop to reorder categories. This affects the navigation menu on your site.
          </p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) setFormData({ name: "", slug: "", showInMenu: true });
          }}
        >
          <DialogTrigger
            render={
              <Button variant="outline" className="flex items-center gap-2 shadow-sm" />
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
                    slug: slugify(e.target.value, { lower: true, strict: true }),
                  })
                }
              />
              <Input
                placeholder="Slug (e.g., sketches)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="create-showInMenu"
                  checked={formData.showInMenu}
                  onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                  className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
                />
                <label
                  htmlFor="create-showInMenu"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show in Navigation Menu
                </label>
              </div>
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-showInMenu"
                checked={formData.showInMenu}
                onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-primary"
              />
              <label
                htmlFor="edit-showInMenu"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show in Navigation Menu
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} disabled={!formData.name || !formData.slug || isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                  setFormData({ name: c.name, slug: c.slug, showInMenu: c.showInMenu });
                  setIsEditOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {categories.length === 0 && (
        <div className="mt-8 flex items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-muted/20 text-muted-foreground text-sm">
          No categories found. Create one to get started.
        </div>
      )}
    </>
  );
}
