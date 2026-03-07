import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { db } from "@/db";
import { categories } from "@/db/schema";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const allCategories = await db.query.categories.findMany({
    where: eq(categories.showInMenu, true),
    orderBy: [asc(categories.position)],
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-display selection:bg-primary/20">
      <header className="flex flex-col items-center pt-12 pb-8 px-6 backdrop-blur-sm sticky top-0 z-40 bg-background/80 transition-colors">
        <Link
          href="/"
          className="flex flex-col items-center gap-2 mb-10 group cursor-pointer outline-none"
        >
          <div className="text-primary transform transition-transform group-hover:scale-110 duration-500 ease-out">
            <Logo className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-widest mt-2 group-hover:text-primary transition-colors duration-300">
            Elena Marinych
          </h1>
          <div className="h-px w-12 bg-primary/40 mt-1 transition-all duration-500 group-hover:w-24 group-hover:bg-primary"></div>
        </Link>

        {/* Navigation Menu */}
        <nav className="flex flex-wrap justify-center gap-8 md:gap-12 border-t border-b border-border py-6 w-full max-w-4xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="relative text-sm font-medium tracking-widest uppercase hover:text-primary transition-all duration-300 group overflow-hidden"
            >
              {cat.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <Link
            href="/about"
            className="relative text-sm font-medium tracking-widest uppercase hover:text-primary transition-all duration-300 group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
      </header>

      <main className="flex-1 w-full relative">{children}</main>

      {/* Footer Section */}
      <footer className="bg-background border-t border-border py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex gap-8 mb-10">
            <a
              className="text-slate-400 hover:text-primary transform hover:-translate-y-1 transition-all duration-300"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" role="img">
                <title>Instagram</title>
                <path d="M12 2.163..."></path>
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
          </div>
          <p className="text-muted-foreground text-xs tracking-widest uppercase opacity-80">
            © {new Date().getFullYear()} Elena Marinych. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
