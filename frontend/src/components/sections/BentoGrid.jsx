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
    <section className="py-14 px-4 z-10 w-full bg-gradient-to-tr from-orange-50 via-white to-orange-100">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl group bg-gradient-to-b from-white/80 to-orange-50"
              style={{
                boxShadow:
                  "0 8px 36px 0 rgba(227,134,59,0.14), 0 1.5px 4px 0 rgba(0,0,0,0.03)"
              }}
            >
              <div className="relative w-full aspect-[4/5] bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all group-hover:scale-105 z-0"
                  style={{ objectPosition: "center", filter: "brightness(0.93)" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent z-10"></div>
                {item.badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-5 right-5 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg z-20"
                    style={{ fontFamily: '"Borel", cursive', letterSpacing: "0.05em" }}
                  >
                    {item.badge}
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute bottom-0 left-0 w-full px-6 pb-7 pt-5 z-20 flex flex-col"
                >
                  <motion.h3
                    whileHover={{ scale: 1.05 }}
                    className="text-xl lg:text-2xl font-extrabold text-white mb-1"
                    style={{
                      fontFamily: '"Unbounded", sans-serif',
                      letterSpacing: "0.02em",
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    whileHover={{ scale: 1.02 }}
                    className="text-sm lg:text-base font-medium text-white opacity-90"
                    style={{
                      fontFamily: '"Montserrat", sans-serif',
                      letterSpacing: "0.01em"
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

