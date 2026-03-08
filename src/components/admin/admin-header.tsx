import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface AdminHeaderProps {
  title?: string | ReactNode;
  backHref?: string;
  children?: ReactNode; // Custom content for the left side (useful for the dashboard logo)
  rightContent?: ReactNode; // Custom content for the right side (actions, etc.)
}

export function AdminHeader({ title, backHref, children, rightContent }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-border">
      <div className="flex items-center gap-4 md:gap-6">
        {backHref && (
          <Link
            href={backHref}
            className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Go back</span>
          </Link>
        )}
        {children}
        {title &&
          (typeof title === "string" ? (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          ) : (
            title
          ))}
      </div>
      {rightContent && <div className="flex items-center gap-4">{rightContent}</div>}
    </header>
  );
}
