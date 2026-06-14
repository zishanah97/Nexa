// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { Search, MapPin, Route, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";

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
      {/* ====================== MAIN NAVBAR ====================== */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 md:pb-3"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 0.75rem)",
        }}
      >
        <div
          className="mx-auto flex max-w-7xl items-center justify-between gap-3 
                     rounded-full bg-white/95 backdrop-blur-xl 
                     px-4 py-3 shadow-lg border border-white/40
                     md:px-6 md:py-3.5"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* === LOGO === */}
          <NavLink
            to="/"
            className="flex shrink-0 items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full"
            aria-label="NEXA Home"
          >
            <motion.img
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              src={logo}
              alt="NEXA Logo"
              className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
              loading="eager"
            />
          </NavLink>

          {/* === DESKTOP TABS (≥1024px) === */}
          {!isLanding && (
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
              {tabs.map(({ Icon, label, to }) => {
                const active = pathname === to;
                return (
                  <NavLink key={to} to={to} className="relative">
                    {({ isActive }) => (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100/80"
                        }`}
                        style={{ fontFamily: '"Inter", sans-serif' }}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2.5} />
                        <span>{label}</span>
                      </motion.button>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* === RIGHT SIDE: CTA + HAMBURGER === */}
          <div className="flex shrink-0 items-center gap-2">
            {/* CTA Button */}
            <NavLink to={isLanding ? "/home" : "/"}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 
                           rounded-full px-4 py-2 text-sm font-bold text-white shadow-md 
                           transition-shadow hover:shadow-lg
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
                           md:px-5 md:py-2.5"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                <span className="hidden sm:inline">
                  {isLanding ? "Get Started" : "Back"}
                </span>
                <span className="sm:hidden">{isLanding ? "Go" : "Back"}</span>
              </motion.button>
            </NavLink>

            {/* Hamburger (Mobile Only) */}
            {!isLanding && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen((prev) => !prev)}
                className="lg:hidden rounded-full p-2.5 text-gray-700 transition-colors hover:bg-gray-100
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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
            {/* Brand wordmark at the far right */}
            <motion.span
              className="hidden sm:inline bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-lg font-black text-transparent md:text-xl"
              style={{ fontFamily: "'Stardos Stencil', cursive" }}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
            >
              NEXA
            </motion.span>
          </div>
        </div>
      </motion.header>

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
                  <img
                    src={logo}
                    alt="NEXA"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span
                    className="bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-xl font-black text-transparent"
                    style={{ fontFamily: "'Stardos Stencil', cursive" }}
                  >
                    NEXA
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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
                        className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                          active
                            ? "bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100"
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

              {/* Footer */}
              <div className="sticky bottom-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm p-5">
                <NavLink to="/" className="block" onClick={() => setMobileOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    Back to Home
                  </motion.button>
                </NavLink>
                <p className="mt-3 text-center text-xs text-gray-500">
                  Made with love by NEXA
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}




