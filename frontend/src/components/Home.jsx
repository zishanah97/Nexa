import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  ChevronDown,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { setPreferences, clearPreferences } from "../slices/preferencesSlice.js";

// Options for the dropdowns and popular destinations
const dayOptions = ["One Day", "Two Days", "Three Days", "Week", "Many Weeks", "One Month"];
const peopleOptions = ["Solo", "Couple", "Small Group (3-5)", "Medium Group (6-10)", "Large Group (10+)"];
const priceOptions = [
  { label: "Budget ₹1k+", value: 1000 },
  { label: "Moderate ₹5k+", value: 5000 },
  { label: "Comfortable ₹10k+", value: 10000 },
  { label: "Premium ₹20k+", value: 20000 },
  { label: "Deluxe ₹50k+", value: 50000 },
  { label: "Elite ₹100k+", value: 100000 },
  { label: "Luxury", value: "luxury" }
];
const popularDestinations = ["London", "New York", "Paris", "Tokyo", "Dubai", "Sydney"];

// Animation settings for page and components
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};
const titleLine = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
const subtitle = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
const section = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};
const chipContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};
const chip = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
const formCard = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};
const formItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};
const dropdownContainer = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.03,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};
const dropdownItem = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  // Preferences state to track user input selections
  const [pref, setPref] = useState({ destination: "", days: "", people: "", price: "" });
  // Dropdown open state for each dropdown menu
  const [open, setOpen] = useState({ days: false, people: false, price: false });
  // Loading state to show spinner on submit button
  const [loading, setLoading] = useState(false);
  // Track if destination input is focused (optional UI effects)
  const [focused, setFocused] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Triggered when user clicks "Start Planning" button
  const handleSearch = () => {
    if (!pref.destination.trim()) return;

    setLoading(true);
    dispatch(clearPreferences());

    const preferences = {
      location: pref.destination,
      days: pref.days || "One Day",
      numPeople: pref.people || "Solo",
      budget: pref.price || 5000
    };

    dispatch(setPreferences(preferences));
    navigate("/loader", { state: { prefKey: JSON.stringify(preferences), preferences } });
  };

  // Simple form validation: destination is required
  const isFormValid = pref.destination.trim().length > 0;

  return (
    <motion.div
      className="min-h-screen w-full relative bg-white overflow-x-hidden"
      // Prevent horizontal scroll caused by dropdown expanding
      style={{ overflowX: "hidden" }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          maskImage: `repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                      repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)`,
          WebkitMaskImage: `repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)`,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in"
        }}
      />

      <main className="relative w-full px-4 sm:px-6 lg:px-0 pt-4 md:pt-10 pb-16 min-h-[85vh] flex items-center justify-center">
        <motion.div
          className="max-w-5xl mx-auto w-full"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero text introducing the page */}
          <motion.div className="text-center mb-6 sm:mb-8" variants={section}>
            <motion.h1 className="flex flex-col items-center gap-0 mb-4 sm:mb-5" style={{ lineHeight: "1" }}>
              <motion.span
                variants={titleLine}
                className="font-black tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-black"
                style={{ fontFamily: '"Bebas Neue", cursive', display: "inline-block" }}
              >
                Where Dreams
              </motion.span>
              <motion.span
                variants={titleLine}
                className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
                style={{ fontFamily: '"Playfair Display", serif', display: "inline-block" }}
              >
                TAKE FLIGHT
              </motion.span>
            </motion.h1>
            <motion.p
              variants={subtitle}
              className="text-xs sm:text-sm md:text-base text-gray-700 max-w-xl mx-auto font-medium px-4"
              style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1.7, letterSpacing: "0.01em" }}
            >
              Tell us your
              <motion.span className="text-orange-600 inline-block ml-1" style={{ fontFamily: '"Lobster", cursive', fontWeight: 700 }}>
                destination & vibe
              </motion.span>
              — we'll craft the perfect journey.
            </motion.p>
          </motion.div>

          {/* Popular destinations to pick quickly */}
          <motion.div className="text-center mb-5 sm:mb-7" variants={section}>
            <div className="flex items-center justify-center gap-1.5 mb-4 sm:mb-6">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
              <h4
                className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wider"
                style={{ fontFamily: '"Unbounded", sans-serif"' }}
              >
                Popular Destinations
              </h4>
            </div>
            <motion.div
              className="flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-2xl mx-auto"
              variants={chipContainer}
            >
              {popularDestinations.map((dest) => (
                <motion.button
                  key={dest}
                  variants={chip}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPref({ ...pref, destination: dest })}
                  className="group px-4 py-2 sm:px-5 sm:py-2.5 bg-white/80 backdrop-blur-md relative rounded-full text-xs sm:text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {dest}
                  <span className="pointer-events-none absolute bottom-0 w-[88%] left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="pointer-events-none absolute top-0 w-[88%] left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Search form for custom trip preferences */}
          <motion.div
            className="border border-neutral-200 w-full z-20 mt-6 sm:mt-8 max-w-4xl mx-auto mb-10 sm:mb-12 rounded-3xl p-[3px] relative"
            variants={formCard}
          >
            <form
              className="backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 overflow-visible shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div>
                {/* Destination input */}
                <motion.div variants={formItem} className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <label
                      className="text-xs sm:text-sm font-bold tracking-wide text-gray-800 uppercase"
                      style={{ fontFamily: '"Unbounded", sans-serif"' }}
                    >
                      Destination
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Where to? (e.g., Goa, Manali, Varanasi...)"
                    className="w-full bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 px-5 sm:px-6 py-4 text-base sm:text-lg rounded-2xl outline-none border-2 border-gray-200 focus:border-orange-400 focus:shadow-lg transition-all duration-300 font-medium"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                    value={pref.destination}
                    onChange={(e) => setPref({ ...pref, destination: e.target.value })}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                  />
                </motion.div>

                {/* Dropdown selectors for days, people, and budget */}
                <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10" variants={formItem}>
                  <CustomDropdown
                    label="Duration"
                    icon={<Calendar className="w-5 h-5" />}
                    options={dayOptions}
                    value={pref.days}
                    placeholder="How many days?"
                    open={open.days}
                    onToggle={() => setOpen({ days: !open.days, people: false, price: false })}
                    onSelect={(v) => {
                      setPref({ ...pref, days: v });
                      setOpen({ ...open, days: false });
                    }}
                  />
                  <CustomDropdown
                    label="Travelers"
                    icon={<Users className="w-5 h-5" />}
                    options={peopleOptions}
                    value={pref.people}
                    placeholder="How many?"
                    open={open.people}
                    onToggle={() => setOpen({ days: false, people: !open.people, price: false })}
                    onSelect={(v) => {
                      setPref({ ...pref, people: v });
                      setOpen({ ...open, people: false });
                    }}
                  />
                  <CustomDropdown
                    label="Budget"
                    icon={<Wallet className="w-5 h-5" />}
                    options={priceOptions.map((o) => o.label)}
                    value={
                      pref.price
                        ? typeof pref.price === "string"
                          ? "Luxury"
                          : priceOptions.find((o) => o.value === pref.price)?.label
                        : ""
                    }
                    placeholder="Your range"
                    open={open.price}
                    onToggle={() => setOpen({ days: false, people: false, price: !open.price })}
                    onSelect={(label) => {
                      const sel = priceOptions.find((o) => o.label === label);
                      setPref({ ...pref, price: sel.value });
                      setOpen({ ...open, price: false });
                    }}
                  />
                </motion.div>

                {/* Button to submit the form and start planning */}
                <motion.button
                  type="submit"
                  disabled={loading || !isFormValid}
                  variants={formItem}
                  whileHover={isFormValid && !loading ? { scale: 1.02, y: -2 } : {}}
                  whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                  className={`group w-full relative overflow-hidden bg-black text-white font-bold px-8 py-4 rounded-full text-lg sm:text-xl shadow-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                    !isFormValid || loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{ fontFamily: '"Inter", sans-serif', letterSpacing: "0.01em" }}
                >
                  {loading ? (
                    <div className="relative size-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-purple-600/30 to-cyan-500/20 rounded-full blur-2xl animate-pulse" />
                      <div className="absolute inset-0 rounded-full animate-spin [animation-duration:8s] [background:conic-gradient(from_0deg,transparent_75%,#FF6B00_100%)]" />
                      <div className="absolute inset-2 rounded-full animate-spin [animation-duration:6s] [animation-direction:reverse] [background:conic-gradient(from_90deg,transparent_70%,#FBBF24_100%)]" />
                      <div className="absolute inset-4 rounded-full animate-spin [animation-duration:4s] [background:conic-gradient(from_180deg,transparent_75%,#0EA5E9_100%)]" />
                      <div className="absolute inset-6 rounded-full animate-spin [animation-duration:3s] [background:conic-gradient(from_270deg,transparent_70%,#8B5CF6_100%)]" />
                      <div className="absolute inset-8 size-8 bg-white rounded-full shadow-2xl blur-sm" />
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Start Planning</span>
                      <span className="sm:hidden">Plan Trip</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}

// The dropdown component lets user select an option from a list with smooth animations
function CustomDropdown({ label, icon, options, value, placeholder, open, onToggle, onSelect }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-orange-600">{icon}</span>
        <label
          className="text-xs font-bold tracking-wide text-gray-700 uppercase"
          style={{ fontFamily: '"Unbounded", sans-serif"' }}
        >
          {label}
        </label>
      </div>

      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full bg-white/95 backdrop-blur-sm border-2 px-4 sm:px-5 py-3.5 rounded-xl flex items-center justify-between gap-2 text-sm font-semibold transition-all duration-300 ${
          open ? "border-orange-400 shadow-lg" : "border-gray-200 hover:border-gray-300"
        } ${value ? "text-gray-900" : "text-gray-500"}`}
        style={{ fontFamily: '"Inter", sans-serif' }}
      >
        <span className="truncate text-left">{value || placeholder}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown className="w-4 h-4 text-orange-600 shrink-0" />
        </motion.div>
      </motion.button>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key={`dropdown-${label}`}
            variants={dropdownContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border-2 border-gray-200 rounded-xl shadow-2xl z-[999] overflow-y-auto max-h-72"
            // prevent horizontal scroll caused by dropdown content
            style={{ overflowX: "hidden" }}
          >
            {options.map((opt) => (
              <motion.div
                key={opt}
                variants={dropdownItem}
                onClick={() => onSelect(opt)}
                className="px-4 sm:px-5 py-3 hover:bg-orange-50 cursor-pointer text-gray-800 font-medium transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-0"
                style={{ fontFamily: '"Inter", sans-serif' }}
                whileHover={{ x: 4 }}
              >
                {opt}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
