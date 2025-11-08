import logo from '../assets/logo.png';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative w-full bg-orange-50 border-t border-orange-200 pt-16 pb-8 md:pt-20 md:pb-10 overflow-hidden z-10">
      {/* Responsive giant watermark */}
      <div
        className={`
          absolute inset-x-0 pointer-events-none select-none flex items-end justify-center z-0
          opacity-10 md:opacity-15
          bottom-[4rem] md:bottom-0
        `}
        aria-hidden="true"
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontWeight: 900,
          fontSize: "clamp(60px, 9vw, 200px)",
          letterSpacing: "0.09em",
          whiteSpace: "nowrap",
          color: "rgb(249 115 22)",
        }}
      >
        NEXA
      </div>

      {/* Main content with only logo + CTA; responsive, never crowded */}
      <div className="
        relative z-10
        flex flex-col md:flex-row
        items-center
        justify-between
        w-full max-w-7xl
        mx-auto px-4
        gap-8 md:gap-0
      ">
        {/* Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
          <img
            src={logo}
            alt="NEXA logo"
            className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover shadow"
          />
          <span
            className="text-3xl md:text-5xl font-black tracking-widest"
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              letterSpacing: "0.18em",
              color: "rgb(249 115 22)",
              textShadow: "0 2px 18px rgba(249,115,22,0.16)"
            }}
          >
            NEXA
          </span>
        </div>

        {/* Single CTA Only */}
        <nav className="flex items-center justify-center w-full md:w-auto">
          <a
            href="/home"
            className="
              bg-orange-500 hover:bg-orange-600 transition
              text-white px-8 py-3 rounded-full font-bold
              text-base md:text-lg
              shadow-lg hover:shadow-xl
            "
            style={{
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.07em",
              boxShadow: "0 2px 24px 0 rgba(249,115,22,0.18)",
            }}
          >
            Try It
          </a>
        </nav>
      </div>

      {/* Copyright Centered, Responsive, Clean */}
      <div
        className="relative z-10 mt-6 flex items-center justify-center max-w-7xl mx-auto px-4"
      >
        <div
          className="text-xs md:text-sm text-orange-600"
          style={{
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          © {year} NEXA. All rights reserved · Delhi, India
        </div>
      </div>

      {/* Optional: Clean thin trust bar for desktop only, else keep footer ultra-minimal */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 w-full text-center py-1 text-xs text-orange-700 bg-orange-100 opacity-90 z-20">
        Powered by AI · Uptime: 99.99% · Trusted by millions
      </div>
    </footer>
  );
}
