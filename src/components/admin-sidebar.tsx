"use client";

import {
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  MonitorPlay,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function AdminSidebar({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Albums", href: "/admin/albums", icon: ImageIcon },
    { name: "Slider", href: "/admin/slider", icon: MonitorPlay },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col fixed h-full z-30">
      <Link
        href="/"
        className="p-8 flex flex-col items-center gap-2 group cursor-pointer outline-none border-b border-border/50 mb-4"
      >
        <div className="text-primary transform transition-transform group-hover:scale-110 duration-500 ease-out">
          <Logo className="w-8 h-8" />
        </div>
        <h1 className="text-xs font-black tracking-[0.2em] group-hover:text-primary transition-colors duration-300 text-center">
          {siteName}
        </h1>
        <div className="h-[1px] w-8 bg-primary/40 mt-1 transition-all duration-500 group-hover:w-16 group-hover:bg-primary"></div>
      </Link>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border">
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
              pathname === "/admin/settings"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium",
            )}
          >
            <Settings className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-border mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-medium text-muted-foreground">Theme</span>
          <ModeToggle />
        </div>
        <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground overflow-hidden shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
              {session?.user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0 outline-none"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
