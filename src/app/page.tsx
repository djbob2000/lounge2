import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";
import { ModeToggle } from "@/components/mode-toggle";

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
            <svg
              viewBox="0 0 67 70"
              className="w-16 h-16 fill-current"
              aria-label="LoungePhoto Logo"
            >
              <path d="M10.5719,18.5732 L7.7469,17.0762 C13.1589,6.8592 23.6979,0.5122 35.2519,0.5122 C43.8379,0.5122 52.1239,4.1122 57.9839,10.3892 L55.6469,12.5722 C50.3119,6.8572 43.0689,3.7092 35.2519,3.7092 C24.8849,3.7092 15.4279,9.4052 10.5719,18.5732" />
              <path d="M47.0828,18.8735 C48.2328,18.8735 49.1608,19.8015 49.1608,20.9515 C49.1608,22.1115 48.2328,23.0395 47.0828,23.0395 C45.9228,23.0395 44.9948,22.1115 44.9948,20.9515 C44.9948,19.8015 45.9228,18.8735 47.0828,18.8735" />
              <path d="M21.1736,36.0512 L21.1736,36.0512 C24.5806,37.4612 28.1656,38.1112 31.6816,37.7002 C30.0316,36.3932 27.7916,35.6392 25.2346,35.5692 C23.8366,35.5302 22.4586,35.7022 21.1736,36.0512 M15.8286,39.1602 L15.8286,39.1602 C19.5326,47.3862 26.9596,51.9002 36.8456,51.9002 C38.9866,51.9002 40.9566,51.5652 42.7466,50.9582 C42.9896,49.7042 43.1136,48.4092 43.1136,47.0842 C43.1136,39.3832 38.4706,31.1792 30.9956,25.6752 C23.2016,19.9362 13.6666,18.0092 4.5736,20.2752 C7.2636,25.7502 11.9206,30.8432 17.3556,34.1162 C19.7096,32.9332 22.4916,32.2992 25.3216,32.3732 C30.0056,32.5002 33.9316,34.5002 36.0916,37.8582 L37.2646,39.6812 L35.1766,40.2632 C29.5726,41.8232 23.3496,40.9452 17.3796,37.7982 C16.8016,38.2052 16.2796,38.6612 15.8286,39.1602 M23.1416,69.8362 C21.8336,69.8362 20.5146,69.7322 19.1946,69.5202 L17.8486,69.3052 L17.8486,67.9422 C17.8486,63.2942 20.1856,59.4162 24.1006,57.5702 L25.4646,60.4622 C23.0496,61.6012 21.5196,63.7772 21.1396,66.5462 C26.7386,67.0672 32.2236,65.3902 36.3776,61.8492 C38.7416,59.8332 40.5276,57.3612 41.6656,54.5882 C40.1536,54.9202 38.5456,55.0982 36.8456,55.0982 C25.2346,55.0982 16.5876,49.5612 12.4996,39.5062 L12.1656,38.6862 L12.6846,37.9682 C13.1856,37.2762 13.7776,36.6352 14.4446,36.0532 C8.4186,32.0542 3.4796,26.1582 0.8736,19.8462 L0.2066,18.2292 L1.8766,17.7102 C12.4646,14.4192 23.7696,16.3842 32.8916,23.1012 C41.1686,29.1962 46.3116,38.3862 46.3116,47.0842 C46.3116,47.8392 46.2766,48.5862 46.2076,49.3242 C52.0666,45.6882 55.2896,38.7202 55.5616,31.8122 C55.6106,30.6112 55.4906,29.2442 55.3636,27.7982 C55.1386,25.2352 54.8886,22.3912 55.5096,19.6132 C54.0746,19.1402 52.9636,18.3432 51.8796,17.5652 C50.1246,16.3062 48.4666,15.1162 45.1256,15.1162 C42.1656,15.1162 39.4746,16.7472 38.1006,19.3732 L35.2676,17.8902 C37.1946,14.2072 40.9726,11.9192 45.1256,11.9192 C49.4956,11.9192 51.8506,13.6092 53.7436,14.9672 C55.0696,15.9192 56.1176,16.6712 57.6826,16.8192 L59.7696,17.0152 L59.0266,18.9762 C58.0296,21.6112 58.2926,24.6132 58.5486,27.5182 C58.6846,29.0702 58.8136,30.5362 58.7556,31.9402 C58.4096,40.7672 53.8146,49.6792 45.4686,53.3512 C44.2886,57.5852 41.8956,61.3462 38.4516,64.2822 C34.2116,67.8972 28.7866,69.8352 23.1416,69.8362" />
              <path d="M46.899,56.9682 C56.774,52.4242 63.155,42.4712 63.155,31.6122 C63.155,28.4472 62.629,25.3442 61.591,22.3882 L64.608,21.3302 C65.765,24.6272 66.352,28.0862 66.352,31.6122 C66.352,43.7152 59.241,54.8082 48.235,59.8732 L46.899,56.9682 L46.899,56.9682 Z" />
              <path d="M35.2521,62.7026 C18.0971,62.7026 4.1421,48.7556 4.1421,31.6126 C4.1421,29.6156 4.3411,27.5746 4.7361,25.5486 L7.8741,26.1586 C7.5191,27.9846 7.3391,29.8196 7.3391,31.6126 C7.3391,46.9926 19.8611,59.5046 35.2521,59.5046 C36.5121,59.5046 37.7851,59.4216 39.0371,59.2566 L39.4541,62.4266 C38.0651,62.6096 36.6511,62.7026 35.2521,62.7026" />
            </svg>
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
