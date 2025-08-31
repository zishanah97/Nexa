import { useState } from "react";
import { FaChevronDown, FaSearch, FaUsers, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPreferences, clearPreferences } from "../slices/preferencesSlice.js";
import TickerCarouselGSAP from "./TickerCarouselGSAP.jsx";

// Options arrays
const dayOptions = ["One Day", "Two Days", "Three Days", "Week", "Many Weeks", "One Month"];
const peopleOptions = [
  "Solo", "Couple", "Small Group (3-5)", "Medium Group (6-10)", "Large Group (10+)"
];
const priceOptions = [
  { label: "1k+", value: 1000 },
  { label: "5k+", value: 5000 },
  { label: "10k+", value: 10000 },
  { label: "20k+", value: 20000 },
  { label: "50k+", value: 50000 },
  { label: "100k+", value: 100000 },
  { label: "Luxury", value: "luxury" }
];

export default function Home() {
  const [pref, setPref] = useState({
    destination: "",
    days: "",
    people: "",
    price: ""
  });
  const [open, setOpen] = useState({ days: false, people: false, price: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = async () => {
    setLoading(true);

    dispatch(clearPreferences());

    const preferences = {
      location: pref.destination,
      days: pref.days,
      numPeople: pref.people,
      budget: pref.price
    };

    dispatch(setPreferences(preferences));

    const prefKey = JSON.stringify(preferences);
    navigate("/loader", { state: { prefKey, preferences } });
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col w-full px-4">
      <main className="flex-1 w-full flex flex-col items-center pt-8 pb-24 px-3 md:px-20">
         <TickerCarouselGSAP />
        <div className="w-full max-w-2xl mb-14 font-chillax mx-auto text-center mt-6">
          {/* Heading */}
          <h1
            className="text-5xl md:text-6xl font-bold mb-2 animate-fade-in-up"
            style={{
              fontFamily: "'Stardos Stencil', 'Inter', sans-serif",
              fontWeight: 700,
            }}
          >
            Plan your{" "}
            <span className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold">
              dream trip
            </span>
          </h1>
          <div className=" text-sm   md:text-lg text-gray-400 mb-8 animate-fade-in-up delay-200">
            Enter destination, days, people, and budget to get custom recommendations.
          </div>

          {/* Search Bar */}
          <div className="w-full mt-8 px-1">
            <form
              onSubmit={e => { e.preventDefault(); handleSearch(); }}
              className="w-full flex flex-col sm:flex-row items-stretch gap-2 bg-[#18181b] border border-[#23232a] rounded-2xl shadow-xl px-3 sm:py-3 mb-10 backdrop-blur-sm"
            >
              {/* Destination Input */}
              <input
                className="
                  bg-transparent text-white placeholder-gray-500 p-3 rounded-xl outline-none text-base flex-1 min-w-[150px] border border-transparent
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-600
                  hover:border-purple-500 transition cursor-text
                "
                placeholder="Destination (city, region, country...)"
                value={pref.destination}
                onChange={e => setPref(v => ({ ...v, destination: e.target.value }))}
              />

              {/* Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-2 flex-1 z-100">
                {/* Days Dropdown */}
                <Dropdown
                  label="Days"
                  icon={<FaCalendarAlt className="mr-2" />}
                  options={dayOptions}
                  value={pref.days}
                  open={open.days}
                  onToggle={() => setOpen(o => ({ ...o, days: !o.days }))}
                  onSelect={opt => { setPref(p => ({ ...p, days: opt })); setOpen(o => ({ ...o, days: false })); }}
                />
                {/* People Dropdown */}
                <Dropdown
                  label="People"
                  icon={<FaUsers className="mr-2" />}
                  options={peopleOptions}
                  value={pref.people}
                  open={open.people}
                  onToggle={() => setOpen(o => ({ ...o, people: !o.people }))}
                  onSelect={opt => { setPref(p => ({ ...p, people: opt })); setOpen(o => ({ ...o, people: false })); }}
                />
                {/* Price Dropdown */}
                <Dropdown
                  label="Budget"
                  icon={<FaMoneyBillWave className="mr-2" />}
                  options={priceOptions.map(opt => opt.label)}
                  value={pref.price ? (typeof pref.price === 'string' ? pref.price : `₹${pref.price / 1000}k+`) : ""}
                  open={open.price}
                  onToggle={() => setOpen(o => ({ ...o, price: !o.price }))}
                  onSelect={label => {
                    const selected = priceOptions.find(opt => opt.label === label);
                    setPref(p => ({ ...p, price: selected.value }));
                    setOpen(o => ({ ...o, price: false }));
                  }}
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
    flex items-center justify-center gap-2 w-full py-3 mt-2
    rounded-xl font-semibold text-lg
    bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500
    hover:shadow-[0_0_20px_rgba(147,51,234,0.7)]
    shadow-lg text-white transition
    cursor-pointer hover:scale-[1.02] active:scale-95
    ${loading ? 'pointer-events-none opacity-70' : ''}
  `}
              >
                <FaSearch className="text-xl" />
                <span>Search</span>
              </button>

            </form>

            {/* Ticker */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/60 via-pink-400/60 to-blue-400/60 rounded-full blur-sm" />
             
            </div>
          </div>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        @keyframes fadeInUp {
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

/* 🔹 Reusable Dropdown Component */
function Dropdown({ label, icon, options, value, open, onToggle, onSelect }) {
  return (
    <div className="relative flex-1">
      <button
        className="w-full bg-[#23232a] py-2 px-4 text-left rounded-xl text-gray-300 flex items-center justify-between border border-[#2d2d35] focus:border-purple-500 transition cursor-pointer hover:border-purple-400 active:scale-95"
        onClick={onToggle}
        type="button"
      >
        <span className="flex items-center">
          {icon}
          {value || label}
        </span>
        <FaChevronDown className="ml-2 text-xs" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-[#19191c] border border-[#23232a] rounded-xl shadow-lg z-20 animate-fade-in">
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => onSelect(opt)}
              className="px-4 py-2 hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-pink-500/40 cursor-pointer text-white transition"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
