import { LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Dashboard Overview
          </h2>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold">Welcome back</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here is a quick overview of your portfolio. Use the sidebar to
              manage content.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total Categories
              </span>
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">Manage</span>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Total Albums
              </span>
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">Manage</span>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Home Slider
              </span>
              <LayoutDashboard className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">Manage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
