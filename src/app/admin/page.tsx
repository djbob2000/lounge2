import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AdminDashboardPage() {
  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer outline-none">
            <div className="text-primary transform transition-transform group-hover:scale-110 duration-500 ease-out">
              <Logo className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs font-black tracking-[0.2em] group-hover:text-primary transition-colors duration-300 leading-none">
                Elena Marinych
              </h1>
              <div className="h-[1px] w-4 bg-primary/40 mt-1 transition-all duration-500 group-hover:w-full group-hover:bg-primary"></div>
            </div>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Dashboard Overview
          </h2>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold">Welcome back</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Here is a quick overview of your portfolio. Use the sidebar to manage content.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card text-card-foreground border border-border rounded-2xl flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Categories</span>
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">Manage</span>
          </div>

          <div className="p-6 bg-card text-card-foreground border border-border rounded-2xl flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Albums</span>
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">Manage</span>
          </div>

          <div className="p-6 bg-card text-card-foreground border border-border rounded-2xl flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Home Slider</span>
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">Manage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
