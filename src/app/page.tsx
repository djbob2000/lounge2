import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";

const MOCKED_SLIDER_IMAGES = [
  {
    id: "1",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAct9NzyqR8elUQoRQaqyorGY2VkoBNlvvWJF4x00C96QOgCORf5AuwGrhXjTni1JiLzYh55TlDUa89ilc085mS1IN9l8zXKhDF5hQZ4VbhKLg29i69woxZcFqMfkTbaQYsiKNvOTuI4ZWXtl_tuIaiOxKjQDDchD3f7jfHJ1FbLjWfN9NM8pA4Dyv9D3LBEDXr2PDqUzVRcVk_tae7UxWtIXEH5eJrtzsfazjV_pgW7Aug32g53hJG5vXKHVFi9dv3AgetR2_ZC8o",
    title: "Capturing Life's Essence",
  },
];

export default function Home() {
  return (
    <div className="bg-background text-foreground font-display min-h-screen transition-colors duration-700 ease-in-out">
      {/* Header Section: Logo and Navigation */}
      <header className="relative flex flex-col items-center pt-12 pb-8 px-6 bg-background transition-colors duration-700 ease-in-out">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        {/* Elegant Centered Logo */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="text-primary transition-colors duration-700">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="font-display text-4xl font-black tracking-widest text-foreground transition-colors duration-700">
            Elena Marinych
          </h1>
          <div className="h-px w-12 bg-primary mt-1 opacity-40 transition-colors duration-700"></div>
        </div>
        {/* Navigation Menu */}
        <nav className="flex flex-wrap justify-center gap-8 md:gap-12 border-t border-b border-border py-6 w-full max-w-4xl transition-colors duration-700 ease-in-out">
          <Link
            className="text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors duration-300"
            href="/"
          >
            Sketches
          </Link>
          <Link
            className="text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors duration-300"
            href="/"
          >
            Nature
          </Link>
          <Link
            className="text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors duration-300"
            href="/"
          >
            People
          </Link>
          <Link
            className="text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors duration-300"
            href="/"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors duration-300"
            href="/"
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero Slider Section */}
      <main className="w-full relative z-10">
        <HomeSlider images={MOCKED_SLIDER_IMAGES} />

        {/* Featured Collections Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col items-center mb-16">
            <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors duration-700 mb-2">
              Featured Works
            </h3>
            <p className="text-muted-foreground transition-colors duration-700 text-sm italic">
              Curated moments across landscapes and portraits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Nature */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCX8Ug6pI0axuhJHXSMUTgRHAJKkrG2ON0Dl-a13scpjpUAVcMhLD-lvLv5Df7oq08cJEQTSalY63O6a_Ot2zGaN0tcdg5zaX86_JzF7G1t96X5ZIkbj2i5as_Eg4jwbQX4QXUYkhMV--ibOkcE3XnNKrGSlfUGFoGvIdXiyD8VNmy5n68SCjJMQY88Y2DC4T9zyTjv0PQxvNHxj_rbQbumcITQKWIk_iBrz1pVsqh7Mz7E8XG1PvXeOsMmHfMXQb0Y6KuUcSofmCU')",
                  }}
                />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-1">Nature</h4>
              <p className="text-sm text-muted-foreground transition-colors duration-700">
                The great outdoors
              </p>
            </div>
            {/* Architecture */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArsSW2aOlXL6fwPbPqHmR5wtEdnHRMLU1WZ2AUpASmbqA2kM3sR73MJa8Y4OML1GBHs2HCdxetGUpFi_WgQ1-fT_TQQcvqIug_ehpqM6se1up0RRCbAsZ5Zmd40jatLQweXXQCP9B7hYL_RTrEM4fVDeMN5vIgjNKevoon7fRyFENGv0w65qzHWo3SIbqW1HnwD6iz-kzhxXU5iYu1h3mdqpM0AdmjYdTas8u79YajHA2eMdM5SoAtzG127AfgWy9Gtl4t_Xvmlq8')",
                  }}
                />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-1">Architecture</h4>
              <p className="text-sm text-muted-foreground transition-colors duration-700">
                Urban structures
              </p>
            </div>
            {/* People */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVcml5115wvzLYB8gph_ug0PAdmqaiENre1FdvFYdXT-vRvLX2BVRTQFM9W63XwAqy-cULkfNVBnwGDPDgX5zGl2ZJV-SZyYVpFD8v3lxNCHlDPsKQJcHiawsxXCf1Y4A9zCFZWbhCA0shaiHXyqfm0PlhzkbHS9A1rBC_9S7lwIjCOHPdeJnDSeEb_MhVU7QeMmDfBatuDoezrdG1nkSasjtdsvoDU_ETgSvp0corAC9AnTTZuJZ0qfC6cAS_8vrpGQQ34R6Ifxo')",
                  }}
                />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-1">People</h4>
              <p className="text-sm text-muted-foreground transition-colors duration-700">
                Human stories
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-background border-t border-border py-16 px-6 transition-colors duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex gap-8 mb-10">
            <Link
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" role="img">
                <title>Instagram</title>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
              </svg>
            </Link>
            <Link
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" role="img">
                <title>Twitter (X)</title>
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </Link>
            <Link
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" role="img">
                <title>LinkedIn</title>
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
              </svg>
            </Link>
          </div>
          {/* Copyright */}
          <p className="text-muted-foreground transition-colors duration-700 text-sm tracking-widest">
            © 2024 Elena Marinych. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
