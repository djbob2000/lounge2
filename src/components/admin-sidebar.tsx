"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Camera,
  LayoutDashboard,
  Layers,
  Image as ImageIcon,
  MonitorPlay,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function AdminSidebar() {
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
    { name: "Home Slider", href: "/admin/slider", icon: MonitorPlay },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col fixed h-full z-30">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight uppercase tracking-wider">
            LensAdmin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Management Console
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-primary"
                    : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                )}
              />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
              pathname === "/admin/settings"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium",
            )}
          >
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 overflow-hidden shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-[10px] text-slate-500 truncate uppercase mt-0.5">
              {session?.user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0 outline-none"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
