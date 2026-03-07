import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background font-display text-foreground selection:bg-primary/20">
      <AdminSidebar />
      <main className="ml-64 flex-1">{children}</main>
    </div>
  );
}
