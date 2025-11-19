import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FaRegHeart, FaHeart, FaShareAlt } from "react-icons/fa";
import { Calendar } from "lucide-react";
import DestinationDetailModal from "./DestinationDetailModal";

function Card({ place }) {
  if (!place) return null;

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Dynamic border color based on vibe/category (optional)
  // You can extend this or set per card type in data
  const borderColor =
    place.primary_vibes?.includes("tech")
      ? "border-cyan-900"
      : place.primary_vibes?.includes("culture")
        ? "border-amber-900"
        : "border-neutral-800";

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-8, 8]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const [liked, setLiked] = React.useState(false);

  return (
    <>
      <motion.article
        className={`
          w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden flex flex-col
          bg-white
          shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]
          transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] relative group
          hover:shadow-[0_4px_12px_rgba(15,23,42,0.06),0_16px_48px_rgba(15,23,42,0.1)]
          cursor-pointer
        `}
        style={{ minHeight: "400px", transformPerspective: 1000, rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ translateY: -8 }}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Image */}
        <figure className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
          <motion.img
            src={place.image?.imageUrl}
            alt={place.name}
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.04 }}
            loading="lazy"
            style={{ minHeight: 180 }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.3) 100%)",
            }}
          />
          {place.best_months && (
            <div
              className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full text-[11px] font-medium text-neutral-800 shadow-sm border border-neutral-200 select-none flex items-center gap-1.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>{place.best_months?.slice(0, 2).join(", ")}</span>
            </div>
          )}
        </figure>

        {/* Card Body: */}
        <div className="flex flex-col flex-1 px-6 pt-6 pb-5">
          <div className="flex flex-col gap-3">
            {/* Place Name */}
            <h2
              className="text-xl font-semibold text-neutral-900 leading-snug"
              style={{ fontFamily: "'Playfair Display', 'Inter', serif", letterSpacing: "-0.01em" }}
            >
              {place.name}
            </h2>
            {/* Description */}
            <p
              className="text-neutral-600 text-sm"
              style={{
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {place.short_reason}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-row flex-wrap gap-2 items-center">
            {(place.primary_vibes || []).slice(0, 3).map((vibe) => (
              <span
                key={vibe}
                className="inline-flex items-center rounded-md px-3 py-1.5 bg-black/5 text-neutral-700 text-[12px] font-medium transition-colors duration-150 hover:bg-black/10 cursor-default"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.02em",
                  textTransform: "lowercase",
                }}
              >
                {vibe}
              </span>
            ))}
          </div>

          {/* Price Bar */}
          <div className="mt-5 -mx-6 px-6 pt-4 pb-3 border-t border-neutral-200 bg-gray-50 flex items-center justify-between text-sm">
            <span className="font-semibold text-neutral-900" style={{ fontFamily: "'Inter', sans-serif" }}>
              ₹{place.est_daily_cost_per_person?.min}–{place.est_daily_cost_per_person?.max}
              <span className="ml-1 text-xs text-neutral-500 font-normal">/day</span>
            </span>
            <span className="flex items-center gap-3 text-neutral-400">
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked((prev) => !prev);
                }}
                whileTap={{ scale: 1.15 }}
                className="p-1 -m-1 rounded-full focus:outline-none cursor-pointer"
              >
                {liked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="transition-colors duration-200 group-hover:text-red-500" />
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={(e) => e.stopPropagation()}
                whileTap={{ scale: 1.05, rotate: -5 }}
                className="p-1 -m-1 rounded-full focus:outline-none cursor-pointer"
              >
                <FaShareAlt className="transition-colors duration-200 hover:text-neutral-900" />
              </motion.button>
            </span>
          </div>
        </div>
      </motion.article>

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        place={place}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Card;
