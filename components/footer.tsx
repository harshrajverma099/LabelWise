export function Footer() {
  return (
    <footer className="relative border-t border-primary/10 bg-background px-4 py-12 lg:px-8">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-primary/30 bg-primary/5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary neon-green">
                LABELWISE
              </span>
            </div>
            <p className="mt-3 text-[10px] uppercase leading-relaxed tracking-wider text-muted-foreground">
              {"// "}Tactical nutrition intelligence system. Scan. Analyze.
              Optimize. Deploy.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
              Modules
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { href: "#scanner", label: "Label Scanner" },
                { href: "#bmi", label: "BMI Analysis" },
                { href: "#diet", label: "Diet AI Engine" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="text-primary/30 transition-colors group-hover:text-primary">
                      {">"}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
              Intel
            </h4>
            <ul className="flex flex-col gap-2">
              {["Nutrition Database", "Health Protocols", "System FAQ"].map(
                (item) => (
                  <li key={item}>
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span className="text-primary/30">{">"}</span>
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">
              Comms
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                "ops@labelwise.sys",
                "Privacy Protocol",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="text-primary/30">{">"}</span>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              &copy; {new Date().getFullYear()} LABELWISE :: ALL_RIGHTS_RESERVED
            </p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse bg-primary" />
              <span className="text-[10px] uppercase tracking-wider text-primary/60">
                SYSTEM_ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
