import { count } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { user } from "@/db/schema";
import { SetupForm } from "./setup-form";

export default async function SetupPage() {
  try {
    // Check if any user already exists
    const [result] = await db.select({ value: count() }).from(user);

    // If a user exists, don't allow setup
    if (result.value > 0) {
      redirect("/login");
    }
  } catch (error: any) {
    // If we catch an error, it's likely the "user" table doesn't exist yet
    // because migrations or "drizzle-kit push" haven't been run.
    console.error("Database check failed:", error);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-display p-6">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border-2 border-destructive/20 p-8 text-center">
          <div className="text-destructive mb-6 text-4xl">⚠️</div>
          <h1 className="text-2xl font-black mb-4">Database Not Initialized</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            We couldn&apos;t find the user tables in your database. This usually means you need to
            run the initial sync command.
          </p>
          <div className="bg-muted p-4 rounded-xl border border-border text-left mb-6">
            <p className="text-xs font-mono text-muted-foreground/60 mb-2 uppercase tracking-widest">
              Run this in your terminal:
            </p>
            <code className="text-sm font-mono text-primary font-bold">npx drizzle-kit push</code>
          </div>
          <p className="text-xs text-muted-foreground/50">
            After running the command, refresh this page to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground font-display p-6">
      <div className="w-full max-w-sm flex flex-col items-center mb-10 text-center">
        <h1 className="text-2xl font-black tracking-tight mb-2">Initialize Admin</h1>
        <p className="text-sm text-muted-foreground">
          Create the first administrator account to start managing your portfolio.
        </p>
      </div>

      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-8">
        <SetupForm />
      </div>
    </div>
  );
}
