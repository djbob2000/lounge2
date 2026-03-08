import { eq } from "drizzle-orm";
import { AdminSidebar } from "@/components/admin-sidebar";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, "site_config"),
  });

  const siteName = settings?.siteName || "Elena Marinych";

  return (
    <div className="flex min-h-screen bg-background font-display text-foreground selection:bg-primary/20">
      <AdminSidebar siteName={siteName} />
      <main className="ml-64 flex-1">{children}</main>
    </div>
  );
}
