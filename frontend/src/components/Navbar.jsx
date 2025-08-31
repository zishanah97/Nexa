import React, { useState, useEffect } from "react";
import {
  FaRobot,
  FaGlobeAmericas,
  FaRegSun,
  FaSignInAlt,
  FaBars,
  FaWalking,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [navActive, setNavActive] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync navActive with current path for robust active tab handling
  useEffect(() => {
    switch (location.pathname) {
      case "/home":
        setNavActive(0);
        break;
      case "/home/top-choices":
        setNavActive(1);
        break;
      case "/home/itinerary":
        setNavActive(2);
        break;
      default:
        setNavActive(-1); // No tab active for other URLs
    }
  }, [location.pathname]);

  const handleThemeToggle = () => alert("Theme toggled!");
  const handleSignIn = () => alert("Open sign in/up…");

  return (
    <div
      className="w-full px-4 sm:px-10 lg:px-20 flex justify-between items-center h-20 
      bg-black backdrop-blur-xl border-b border-[#23232a] shadow-lg"
    >
      {/* Left Nav Section */}
      <nav
        className="flex items-center bg-[#18181b]/90 border border-[#23232a] 
        rounded-2xl shadow-md px-2 py-1"
      >
        <button
          onClick={() => {
            setNavActive(0);
            navigate("/home");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-semibold text-base
      ${
        navActive === 0
          ? "bg-[#23232a] text-white scale-105"
          : "text-gray-300 hover:text-white"
      }
    `}
        >
          <FaRobot className="text-lg sm:text-xl" />
          {navActive === 0 && <span className="ml-1 font-semibold">Search</span>}
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-[#333] mx-2" />

        <button
          onClick={() => {
            setNavActive(1);
            navigate("/home/top-choices");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-semibold text-base cursor-pointer
      ${
        navActive === 1
          ? "bg-[#23232a] text-white scale-105"
          : "text-gray-300 hover:text-white"
      }
    `}
        >
          <FaGlobeAmericas className="text-lg sm:text-xl" />
          {navActive === 1 && <span className="ml-1 font-semibold">Place</span>}
        </button>

        <button
          onClick={() => {
            setNavActive(2);
            navigate("/home/itinerary");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-semibold text-base cursor-pointer
      ${
        navActive === 2
          ? "bg-[#23232a] text-white scale-105"
          : "text-gray-300 hover:text-white"
      }
    `}
        >
          <FaWalking className="text-lg sm:text-xl" />{" "}
          {/* Changed to FaWalking for example */}
          {navActive === 2 && <span className="ml-1 font-semibold">Activity</span>}
        </button>
      </nav>

      {/* Right Menu Section */}
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-10 h-10 rounded-full flex items-center justify-center
            bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 shadow-xl ring-2 ring-[#222]
            transition-transform hover:scale-110"
          aria-label="Menu"
        >
          <FaBars className="text-white text-xl" />
        </button>

        {open && (
          <div
            className="absolute right-0 mt-3 bg-[#111]/95 backdrop-blur-md border border-[#23232a] 
              rounded-xl py-3 w-52 shadow-2xl animate-fade-in z-50"
          >
            <button
              onClick={() => {
                setOpen(false);
                handleThemeToggle();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#23232a] text-gray-200 transition"
            >
              <FaRegSun /> Light/Dark Mode
            </button>
            <button
              onClick={() => {
                setOpen(false);
                handleSignIn();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-[#23232a] text-gray-200 transition"
            >
              <FaSignInAlt /> Sign In / Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
