"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading1, Heading2, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:outline-none",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor || !mounted) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-input shadow-sm opacity-50">
        <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/50 p-1 min-h-[44px]" />
        <div className="p-0">
          <div className="min-h-[150px] w-full px-3 py-2 text-base md:text-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-input focus-within:ring-1 focus-within:ring-ring shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/50 p-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded-sm hover:bg-muted transition-colors",
            editor.isActive("bold") ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded-sm hover:bg-muted transition-colors",
            editor.isActive("italic") ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            "p-2 rounded-sm hover:bg-muted transition-colors",
            editor.isActive("strike") ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "p-2 rounded-sm hover:bg-muted transition-colors",
            editor.isActive("heading", { level: 1 })
              ? "bg-muted text-foreground"
              : "text-muted-foreground",
          )}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "p-2 rounded-sm hover:bg-muted transition-colors",
            editor.isActive("heading", { level: 2 })
              ? "bg-muted text-foreground"
              : "text-muted-foreground",
          )}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded-sm hover:bg-muted transition-colors",
            editor.isActive("bulletList") ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded-sm hover:bg-muted transition-colors",
            editor.isActive("orderedList") ? "bg-muted text-foreground" : "text-muted-foreground",
          )}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
      <div className="p-0">
        <EditorContent
          editor={editor}
          className={cn(
            // Removed borders here because it's wrapped in a border on the outside div
            "[&>.tiptap]:min-h-[150px] [&>.tiptap]:w-full [&>.tiptap]:bg-transparent [&>.tiptap]:px-3 [&>.tiptap]:py-2 [&>.tiptap]:text-base [&>.tiptap]:outline-none [&>.tiptap]:ring-0 [&>.tiptap]:border-none md:[&>.tiptap]:text-sm",
          )}
        />
      </div>
    </div>
  );
}
