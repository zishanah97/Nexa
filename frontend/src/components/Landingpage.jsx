import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import Navbar from './Navbar.jsx';
import BentoGrid from './sections/BentoGrid.jsx';
import HowItWorks from './sections/Working.jsx';
import Footer from './layout/Footer.jsx';

// ──────────────────────────────────────────────────────────────
//   VARIANTS 
// ──────────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.16,
      ease: 'easeInOut'
    }
  }
};


const titleBoth = {
  hidden: { opacity: 0, y: 110 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      type: "spring",
      stiffness: 110,
      damping: 20,
      bounce: 0.15
    }
  }
};

const subtitle = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      type: "spring",
      stiffness: 120,
      damping: 22
    }
  }
};

const text = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};



const cta = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.1,
      type: "spring",
      stiffness: 100,
      damping: 20,
      bounce: 0.2
    }
  }
};

function Landingpage() {
  return (
    <div className="flex flex-col bg-white overflow-x-hidden">

      {/* DOTTED BACKGROUND */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <Navbar />

      {/* HERO */}
      <main className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-8 xl:px-0 text-center py-20 lg:py-32 min-h-[80vh]">

        <motion.div
          className="w-full max-w-5xl mx-auto flex flex-col gap-8 items-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >

          {/* HERO HEADLINE — BOTH PARTS APPEAR TOGETHER */}
          <motion.h1 className="w-full flex flex-col lg:flex-row items-center lg:items-baseline justify-center text-center gap-y-0 gap-x-4 mb-0">
            <motion.span
              variants={titleBoth}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-black"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: "0.01em",
                lineHeight: 1.05
              }}
            >
              Your Perfect
            </motion.span>

            <motion.span
              variants={titleBoth}   // ← SAME VARIANT = SAME TIME
              className="bg-gradient-to-b from-orange-700 via-orange-500 to-yellow-400 bg-clip-text text-transparent font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl block lg:inline"
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                letterSpacing: "0.03em",
                lineHeight: 1.08
              }}
            >
              TRIP
            </motion.span>
          </motion.h1>

          {/* SUBHEADING */}
          <motion.h2
            variants={subtitle}
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-transparent"
            style={{
              fontFamily: 'var(--font-ui)',
              marginTop: "-0.6em",
              marginBottom: "0.2em",
            }}
          >
            Built in <span className="text-orange-600 bg-gradient-to-b from-orange-700 via-orange-500 to-yellow-400 bg-clip-text text-transparent">60</span> Seconds
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            variants={text}
            className="mt-2 text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-ui)',
              lineHeight: 1.7,
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Tell us where you're going and what you love —
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600 }} className="text-orange-600">
              we'll plan everything
            </span>.
          </motion.p>

          {/* CTA */}
          <motion.div variants={cta} className="flex justify-center pt-10 md:pt-12">
            <NavLink to="/home">
              <motion.button
                whileHover={{ scale: 1.06, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-black text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl font-semibold shadow-xl hover:bg-gray-800 hover:shadow-2xl transition-all transform focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 relative overflow-hidden cursor-pointer"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: "0.01em",
                }}
              >
                Start Planning <ArrowRight className="w-6 h-6" />
                <span className="absolute -bottom-1 inset-x-0 h-[7px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></span>
              </motion.button>
            </NavLink>
          </motion.div>

        </motion.div>
      </main>

      <div className="relative z-10">
        <BentoGrid />
      </div>

      <HowItWorks />
      <Footer />
    </div>
  );
}

export default Landingpage;