/**
 * KursRadar Brand Header
 *
 * Zwei Elemente aus BRAND.md §Header:
 *  1. 4px-Gradient-Streifen (Petrol → Türkis → Coral) — starker Marken-Anker.
 *  2. Logo-Wortmarke „KursRadar" als klickbarer Link zur Live-Site.
 *
 * Wird in App.tsx über allen Routes gerendert.
 */

export const BrandHeader = () => {
  return (
    <>
      {/* 4px Gradient-Akzent (BRAND.md §Farben §Gradient) */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, #0f3331, #14b8a6, #ff5546)" }}
        aria-hidden="true"
      />
      <header className="border-b border-border bg-background">
        <div className="container flex h-14 items-center justify-between">
          <a
            href="https://www.kurs-radar.com"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
            style={{ color: "#0a5351" }}
          >
            {/* SVG-Radar-Icon (BRAND.md §Logo, konzentrische Kreise) */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="#34aea4" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="6" stroke="#0a5351" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="#14b8a6" />
              <path d="M12 12 L18 6" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-bold">
              Kurs<span style={{ color: "#14b8a6" }}>Radar</span>
            </span>
            <span className="hidden sm:inline text-xs font-normal text-muted-foreground border-l border-border pl-2 ml-1">
              Rechner
            </span>
          </a>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="https://www.kurs-radar.com/results"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Kurse
            </a>
            <a
              href="https://www.kurs-radar.com/auth?tab=signup"
              className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              Anmelden
            </a>
          </nav>
        </div>
      </header>
    </>
  );
};
