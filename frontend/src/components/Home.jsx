
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  ChevronDown,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { setPreferences, clearPreferences } from "../slices/preferencesSlice.js";

// Animations per spec: use only initial/animate/exit, whileHover/whileTap, transition, and staggerChildren/delayChildren.

// ──────────────────────────────────────────────────────────────
//  DATA
// ──────────────────────────────────────────────────────────────
const dayOptions = ["One Day", "Two Days", "Three Days", "Week", "Many Weeks", "One Month"];
const peopleOptions = ["Solo", "Couple", "Small Group (3-5)", "Medium Group (6-10)", "Large Group (10+)"];
const priceOptions = [
  { label: "Budget ₹1k+", value: 1000 },
  { label: "Moderate ₹5k+", value: 5000 },
  { label: "Comfortable ₹10k+", value: 10000 },
  { label: "Premium ₹20k+", value: 20000 },
  { label: "Deluxe ₹50k+", value: 50000 },
  { label: "Elite ₹100k+", value: 100000 },
  { label: "Luxury 💎", value: "luxury" }
];

const popularDestinations = [
  "Goa",
  "Jaipur",
  "Leh-Ladakh",
  "Kerala Backwaters",
  "Rishikesh",
  "Manali",
  "Andaman & Nicobar",
  "Udaipur",
  "Varanasi",
  "Rann of Kutch",
  "Coorg",
  "Munnar"
];

// ──────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
export default function Home() {
  const [pref, setPref] = useState({
    destination: "",
    days: "",
    people: "",
    price: ""
  });
  const [open, setOpen] = useState({
    days: false,
    people: false,
    price: false
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (!pref.destination.trim()) {
      return;
    }

    setLoading(true);
    dispatch(clearPreferences());

    const preferences = {
      location: pref.destination,
      days: pref.days || "One Day",
      numPeople: pref.people || "Solo",
      budget: pref.price || 5000
    };

    dispatch(setPreferences(preferences));
    navigate("/loader", {
      state: {
        prefKey: JSON.stringify(preferences),
        preferences
      }
    });
  };

  const isFormValid = pref.destination.trim().length > 0;

  return (
    <motion.div
      className="min-h-screen w-full bg-white overflow-x-hidden relative "
    >

      {/* Dashed Top Fade Grid */}
      <div
        className="absolute inset-0 z-0 w-full h-full"
        style={{
          backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 80% 70% at 50% -20%, #000 70%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 80% 70% at 50% -20%, #000 70%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />




      {/* MAIN CONTENT */}
      <main className="relative  w-full px-4 sm:px-6 lg:px-0 pt-20 md:pt-24 pb-16 min-h-[85vh] flex items-center justify-center">
        <motion.div
          className="max-w-5xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
        >

          
          <motion.div className="text-center mb-12 lg:mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 100 }}>
            <motion.h1 className="flex flex-col items-center gap-0 mb-6" style={{ lineHeight: '1' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 100 }}>
              <motion.span className="font-black tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-black" style={{ fontFamily: '"Bebas Neue", cursive', display: 'inline-block' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 100 }}>
                Where Dreams
              </motion.span>
              <motion.span className="bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl" style={{ fontFamily: '"Playfair Display", serif', display: 'inline-block' }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: "spring", stiffness: 100, delay: 0.05 }}>
                TAKE FLIGHT
              </motion.span>
            </motion.h1>
            <motion.p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium px-4" style={{ fontFamily: '"Montserrat", sans-serif', lineHeight: 1.7, letterSpacing: '0.01em', fontWeight: 500 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              Tell us your{' '}
              <motion.span className="text-orange-600 inline-block" style={{ fontFamily: '"Lobster", cursive', fontWeight: 700 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} whileHover={{ scale: 1.15 }}>
                destination & vibe
              </motion.span>
              {' '}— we'll craft the perfect journey
            </motion.p>
          </motion.div>

          {/* SEARCH FORM */}
          <motion.div className="w-full max-w-4xl mx-auto mb-12" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: "spring", stiffness: 90 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
                className={`
                  relative bg-white/90 backdrop-blur-2xl 
                  rounded-3xl p-6 sm:p-8 lg:p-10 overflow-visible
                  shadow-2xl transition-all duration-300
                  border-2
                  ${focused ? 'border-orange-400' : 'border-transparent'}
                `}
              >
                {/* DESTINATION */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <label
                      className="text-xs sm:text-sm font-bold tracking-wide text-gray-800 uppercase"
                      style={{ fontFamily: '"Unbounded", sans-serif' }}
                    >
                      Destination
                    </label>
                  </div>
                  <motion.input
                    type="text"
                    placeholder="Where to? (e.g., Paris, Bali, Tokyo...)"
                    className="w-full bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 
                               px-5 sm:px-6 py-4 text-base sm:text-lg rounded-2xl 
                               outline-none border-2 border-gray-200
                               focus:border-orange-400 focus:shadow-lg 
                               transition-all duration-300 font-medium"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                    value={pref.destination}
                    onChange={(e) => setPref({ ...pref, destination: e.target.value })}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 120 }}
                  />
                </div>

                {/* PREFERENCES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
                  <CustomDropdown
                    label="Duration"
                    icon={<Calendar className="w-5 h-5" />}
                    options={dayOptions}
                    value={pref.days}
                    placeholder="Select days"
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
                    options={priceOptions.map(o => o.label)}
                    value={pref.price ? (typeof pref.price === 'string' ? 'Luxury 💎' : priceOptions.find(o => o.value === pref.price)?.label) : ""}
                    placeholder="Your range"
                    open={open.price}
                    onToggle={() => setOpen({ days: false, people: false, price: !open.price })}
                    onSelect={(label) => {
                      const sel = priceOptions.find(o => o.label === label);
                      setPref({ ...pref, price: sel.value });
                      setOpen({ ...open, price: false });
                    }}
                  />
                </div>

                {/* CTA */}
                <motion.button
                  type="submit"
                  disabled={loading || !isFormValid}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 120 }}
                  whileHover={isFormValid ? { scale: 1.05, y: -2 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                  className={`
                    group w-full relative overflow-hidden
                    bg-black text-white 
                    font-bold px-8 py-4 sm:py-5 rounded-full
                    text-lg sm:text-xl shadow-xl
                    flex items-center justify-center gap-3
                    transition-all duration-300
                    ${!isFormValid || loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.01em' }}
                >
                  {loading ? (
                    <>
                      <motion.div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Start Planning</span>
                      <span className="sm:hidden">Plan Trip</span>
                      <motion.div>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                    </>
                  )}

                  <span className="absolute bottom-0 w-[88%] left-1/2 -translate-x-1/2 h-[4px] bg-gradient-to-r from-transparent via-amber-600 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                  <span className="absolute top-0 w-[88%] left-1/2 -translate-x-1/2 h-[4px] bg-gradient-to-r from-transparent via-amber-500 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* POPULAR DESTINATIONS */}
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3
                className="text-sm sm:text-base font-bold text-gray-700 uppercase tracking-wider"
                style={{ fontFamily: '"Unbounded", sans-serif' }}
              >
                Popular Destinations
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {popularDestinations.map((dest) => (
                <motion.button
                  key={dest}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPref({ ...pref, destination: dest })}
                  className="px-5 py-2.5 bg-white/80 backdrop-blur-md 
                             rounded-full text-sm font-semibold text-gray-700
                             hover:bg-orange-50 hover:text-orange-700
                             transition-all duration-300 shadow-sm hover:shadow-md"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {dest}
                </motion.button>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>


    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────
//  DROPDOWN COMPONENT
// ──────────────────────────────────────────────────────────────
function CustomDropdown({ label, icon, options, value, placeholder, open, onToggle, onSelect }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-orange-600">{icon}</span>
        <label
          className="text-xs font-bold tracking-wide text-gray-700 uppercase"
          style={{ fontFamily: '"Unbounded", sans-serif' }}
        >
          {label}
        </label>
      </div>

      <motion.button
        type="button"
        onClick={onToggle}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full bg-white/95 backdrop-blur-sm border-2 
          px-4 sm:px-5 py-3.5 rounded-xl
          flex items-center justify-between gap-2
          text-sm font-semibold transition-all duration-300
          ${open ? 'border-orange-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
          ${value ? 'text-gray-900' : 'text-gray-500'}
        `}
        style={{ fontFamily: '"Inter", sans-serif' }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <span className="truncate text-left">{value || placeholder}</span>
        <motion.div>
          <ChevronDown className="w-4 h-4 text-orange-600 shrink-0" />
        </motion.div>
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 
                     bg-white/98 backdrop-blur-xl
                     border-2 border-gray-200 rounded-xl 
                     shadow-2xl z-[999] 
                     max-h-60 overflow-y-auto
                     scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100"
        >
          {options.map((opt, idx) => (
            <motion.div
              key={opt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              onClick={() => onSelect(opt)}
              className="px-4 sm:px-5 py-3 hover:bg-orange-50 cursor-pointer 
                         text-gray-800 font-medium transition-colors
                         first:rounded-t-xl last:rounded-b-xl
                         border-b border-gray-100 last:border-0"
              style={{ fontFamily: '"Inter", sans-serif' }}
              whileHover={{ y: -6 }}
            >
              {opt}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
