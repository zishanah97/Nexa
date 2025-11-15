import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import BentoGrid from './sections/BentoGrid.jsx';
import HowItWorks from './sections/Working.jsx';
import Footer from './layout/Footer.jsx';


function Landingpage() {
  return (
    <div className=" flex flex-col bg-white overflow-x-hidden">
      {/* DOTTED BACKGROUND - Fixed z-index to be behind content */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />
      

      {/* NAVBAR - Higher z-index to be above background */}
      <Navbar />

     

      {/* Hero Content (on top) */}
      <main className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-8 xl:px-0 text-center py-20 lg:py-32 min-h-[80vh]">
  <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
    {/* Responsive Hero Headline */}
    <h1 className="w-full flex flex-col lg:flex-row items-center lg:items-end justify-center text-center gap-y-0 gap-x-4 mb-0">
      <span
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight"
        style={{
          fontFamily: '"Bebas Neue", cursive',
          letterSpacing: "0.01em",
          lineHeight: 1.05
        }}
      >
        Your Perfect
      </span>
      <span
        className="
          bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400
          bg-clip-text text-transparent
          font-bold
          text-5xl sm:text-7xl md:text-8xl lg:text-9xl
          block lg:inline lg:align-baseline
          pb-1
        "
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          letterSpacing: "0.03em",
          lineHeight: 1.08
        }}
      >
        TRIP
      </span>
    </h1>

    {/* Subheading */}
    <h2
      className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
      style={{
        fontFamily: '"Unbounded", sans-serif',
        marginTop: "-0.6em",
        marginBottom: "0.2em",
      }}
    >
      Built in <span className="text-orange-600">60</span> Seconds
    </h2>

    {/* Description */}
    <p
      className="mt-2 text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
      style={{
        fontFamily: '"Montserrat", sans-serif',
        lineHeight: 1.7,
        fontWeight: 500,
        letterSpacing: "0.01em",
      }}
    >
      Tell us where you're going and what you love — 
      <span
        style={{ fontFamily: '"Lobster", cursive', fontWeight: 700 }}
        className="text-orange-600"
      >
        we'll plan everything
      </span>.
    </p>

    {/* CTA Button */}
    <div className="flex justify-center pt-10 md:pt-12">
      <NavLink to="/home">
        <button
          className="inline-flex items-center gap-3 bg-black text-white px-8 md:px-12 py-4 md:py-5 rounded-full text-lg md:text-xl font-semibold shadow-xl hover:bg-gray-800 hover:shadow-2xl transition-all transform active:scale-98 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          style={{
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.01em",
          }}
        >
          Start Planning <ArrowRight className="w-6 h-6" />
        </button>
      </NavLink>
    </div>
  </div>
</main>

   


      {/* BENTO GRID - Proper z-index and spacing */}
      <div className="relative z-10">
        <BentoGrid />
      </div>

      <HowItWorks/>
      <Footer/>
     
    </div>
  );
}

const Navbar = () => {
  return (
    <nav 
      className="relative z-20 flex items-center justify-between rounded-full max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 shadow-xl/20 bg-white mt-2"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <img 
          src={logo} 
          alt="NEXA Logo" 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" 
          loading="eager"
        />
        <span
          className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent"
          style={{ fontFamily: 'Stardos Stencil, cursive' }}
        >
          NEXA
        </span>
      </div>

      <NavLink to="/home">
        <button
          className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-bold text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          style={{ fontFamily: 'Borel, cursive' }}
          aria-label="Try NEXA trip planner"
        >
          Try It
        </button>
      </NavLink>

    </nav>
  );
};

export default Landingpage;