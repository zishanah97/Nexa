import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Itinerary Generation",
    description: "Personalized plans in 60 seconds. AI learns your style.",
    image: "https://i.pinimg.com/originals/cd/2c/de/cd2cde0acd7fe399e5f3b0f66e431125.jpg",
  },
  {
    title: "Budget Management",
    description: "$89 per person (7-day avg). Real-time tracking.",
    image: "https://i.pinimg.com/originals/5a/de/88/5ade886a38a5b6cc20ec441a8484fc61.jpg",
  },
  {
    title: "Top Destinations",
    description: "Curated spots. Insider tips. Hidden gems.",
    image: "https://i.pinimg.com/474x/6f/a5/0e/6fa50e9f1fd1c9c2a2e61786ada1a0d7.jpg",
  },
  {
    title: "Collaborative Planning",
    description: "Plan with friends. Coming Soon.",
    image: "https://i.pinimg.com/originals/58/23/2d/58232d0b62bc25ccf319ad7c697f7db4.jpg",
    badge: "COMING SOON",
  },
];

export default function BentoGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 z-10 w-full bg-gradient-to-tr from-orange-50 via-white to-orange-100">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          className="text-5xl md:text-6xl font-black text-center mb-12 text-gray-900"
          style={{
            fontFamily: '"Playfair Display", serif',
            letterSpacing: "0.01em",
            fontWeight: 700,
          }}
        >
          Why{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            className="text-orange-600 inline-block"
            style={{
              fontFamily: '"Borel", cursive',
              fontWeight: 700,
              fontSize: "1.2em",
            }}
          >
            NEXA
          </motion.span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative cursor-pointer group aspect-[5/6] rounded-[20px] overflow-hidden bg-slate-900/90 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.08)] transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              role="button"
              tabIndex={0}
            >
              <div className="relative w-full h-full bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105 z-0"
                  style={{
                    objectPosition: "center",
                    filter: "saturate(0.9) brightness(0.95) contrast(1.05)",
                  }}
                  loading="lazy"
                />
                {/* Scrim for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                {item.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-4 right-4 z-20 inline-flex items-center rounded-md bg-black/75 border-l-2 border-orange-500 px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-white"
                    style={{ fontFamily: '"Unbounded", sans-serif' }}
                  >
                    {item.badge}
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute inset-x-0 bottom-0 z-20 flex flex-col px-6 md:px-8 pb-7 pt-6"
                >
                  <motion.h3
                    whileHover={{ scale: 1.02 }}
                    className="text-white mb-3"
                    style={{
                      fontFamily: '"Unbounded", sans-serif',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                      fontSize: "clamp(1.25rem,2.4vw,1.5rem)",
                      textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    whileHover={{ scale: 1.01 }}
                    className="text-sm md:text-base text-white/90"
                    style={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontWeight: 400,
                      lineHeight: 1.5,
                      letterSpacing: "0",
                      maxWidth: "32ch",
                      textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    {item.description}
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

