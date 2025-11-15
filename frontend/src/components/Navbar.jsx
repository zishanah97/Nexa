// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Search, MapPin, Route, Menu, X } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [mobileOpen]);

  const tabs = [
    { Icon: Search, label: "Search", to: "/home" },
    { Icon: MapPin, label: "Places", to: "/home/top-choices" },
    { Icon: Route, label: "Itinerary", to: "/home/itinerary" },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full px-4 pt-3 pb-2 md:pb-3 lg:w-[60%] mx-auto flex items-center justify-between gap-3 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg md:px-6 md:py-3.5 shadow-xl/30 inset-shadow-xs mt-2 mb-6"
      >
          {/* === LOGO / WORDMARK === */}
          <NavLink
            to="/"
            className="flex shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
            aria-label="NEXA Home"
          >
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-neutral-200 text-[11px] font-semibold tracking-[0.12em] text-neutral-800 bg-gradient-to-br from-neutral-50 to-neutral-100"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              NX
            </motion.span>
            <span
              className="text-base md:text-lg font-semibold tracking-tight text-neutral-900"
              style={{ fontFamily: '"Inter", sans-serif', letterSpacing: "-0.02em" }}
            >
              NEXA
            </span>
          </NavLink>

          {/* === DESKTOP TABS (≥1024px) === */}
          {!isLanding && (
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
              {tabs.map(({ Icon, label, to }) => {
                const active = pathname === to;
                return (
                  <NavLink key={to} to={to} className="relative">
                    {() => (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 320, damping: 26 }}
                          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer text-neutral-700 font-medium hover:bg-neutral-100 ${
                            active ? "text-neutral-900 font-semibold" : ""
                          }`}
                          style={{ fontFamily: '"Inter", sans-serif' }}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.2} />
                          <span>{label}</span>
                        </motion.button>
                        {active && (
                          <motion.div
                            layoutId="desktopActiveTab"
                            className="absolute left-1/2 -bottom-1 h-[3px] w-6 -translate-x-1/2 rounded-full bg-[#171717]"
                            transition={{ type: "spring", stiffness: 400, damping: 28 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* === RIGHT SIDE: HAMBURGER (MOBILE) === */}
          <div className="flex shrink-0 items-center gap-2">
            {!isLanding && (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMobileOpen((prev) => !prev)}
                className="lg:hidden rounded-full p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <motion.div
                  animate={{ rotate: mobileOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {mobileOpen ? (
                    <X className="h-6 w-6" strokeWidth={2.5} />
                  ) : (
                    <Menu className="h-6 w-6" strokeWidth={2.5} />
                  )}
                </motion.div>
              </motion.button>
            )}
          </div>
      </motion.div>

      {/* ====================== MOBILE DRAWER ====================== */}
      <AnimatePresence mode="wait">
        {mobileOpen && !isLanding && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 35,
                mass: 0.8,
              }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[min(85vw,320px)] 
                         bg-white shadow-2xl lg:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-[11px] font-semibold tracking-[0.12em] text-neutral-800 bg-white/80"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    NX
                  </span>
                  <span
                    className="text-base font-semibold tracking-tight text-neutral-900"
                    style={{ fontFamily: '"Inter", sans-serif', letterSpacing: "-0.02em" }}
                  >
                    NEXA
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 hover:bg-neutral-100 transition-colors
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-gray-600" strokeWidth={2.5} />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="space-y-1.5 p-5" aria-label="Mobile navigation">
                {tabs.map(({ Icon, label, to }, idx) => {
                  const active = pathname === to;
                  return (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: idx * 0.08,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <NavLink
                        to={to}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                          active
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                        style={{ fontFamily: '"Inter", sans-serif' }}
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2.5} />
                        <span className="flex-1">{label}</span>
                        {active && (
                          <motion.div
                            layoutId="mobileIndicator"
                            className="h-2 w-2 rounded-full bg-white shadow-sm"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}