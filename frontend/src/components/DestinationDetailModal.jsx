import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Share2, MapPin } from "lucide-react";

export default function DestinationDetailModal({ place, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen && place?.name) {
      fetchImages();
    }
  }, [isOpen, place?.name]);

  const fetchImages = async () => {
    try {
      const res = await fetch(
        `https://nexa-5.onrender.com/api/v1/images?query=${encodeURIComponent(
          place.name + " landmark tourism 8k"
        )}&per_page=8`
      );
      const data = await res.json();
      setImages(data?.length > 0 ? data : [{ urls: { regular: place.image?.imageUrl } }]);
    } catch {
      setImages([{ urls: { regular: place.image?.imageUrl } }]);
    }
  };

  const next = () => setCurrentImageIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  if (!isOpen || !place) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Clean Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-3xl z-50"
            onClick={onClose}
          />

          {/* Full Screen Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 380 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-x-0 bottom-0 z-50 h-[96dvh] bg-white rounded-t-3xl overflow-hidden flex flex-col"
          >
            {/* HERO IMAGE - structured overlay for mobile & desktop */}
            <div className="relative h-[50vh] sm:h-[65vh]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]?.urls?.regular || place.image?.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Overlay content: navigation row + title/description block (large screens only) */}
              <div className="absolute inset-0 hidden lg:flex flex-col justify-between px-3 pt-3 pb-4 sm:px-6 sm:pt-6 sm:pb-8">
                {/* Top row: back + actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2.5 lg:p-3 bg-black/35 hover:bg-black/50 rounded-full border border-white/30 shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </button>

                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`p-1.5 sm:p-2.5 lg:p-3 rounded-full border shadow-lg transition-all ${
                        isSaved
                          ? "bg-red-500 text-white border-red-400"
                          : "bg-black/35 hover:bg-black/50 text-white border-white/30"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                    <button
                      className="p-1.5 sm:p-2.5 lg:p-3 bg-black/35 hover:bg-black/50 rounded-full border border-white/30 shadow-lg transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Bottom text block (hidden on very small screens) */}
                <div className="hidden sm:block text-white space-y-2 sm:space-y-4 max-w-xl">
                  <h1
                    className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug tracking-tight drop-shadow-2xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {place.name}
                  </h1>

                  <div className="flex items-center gap-1 text-[11px] sm:text-sm md:text-base font-medium opacity-90">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span>India</span>
                  </div>

                  {/* On mobile, move long description below hero to avoid crowding */}
                  <p className="hidden sm:block text-sm md:text-base leading-relaxed opacity-95 max-w-md">
                    {place.short_reason ||
                      "A historic landmark with royal connections, offering rich culture and stunning architecture for a truly memorable experience."}
                  </p>

                  {images.length > 1 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {images.map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full transition-all ${
                            i === currentImageIndex
                              ? "w-3 sm:w-5 md:w-7 h-1 bg-white"
                              : "w-1.5 h-1.5 bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Side navigation arrows - centered mid-height, away from text (large screens only) */}
              {images.length > 1 && (
                <div className="hidden lg:block">
                  <button
                    onClick={prev}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1 sm:p-2 md:p-2.5 bg-black/30 hover:bg-black/50 rounded-full border border-white/30 shadow-lg transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 sm:p-2 md:p-2.5 bg-black/30 hover:bg-black/50 rounded-full border border-white/30 shadow-lg transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white rotate-180" />
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 pt-5 sm:pt-8 pb-32 bg-white">
              <div className="space-y-8 sm:space-y-12">

                {/* Mobile / tablet header placed below hero for better readability */}
                <div className="lg:hidden space-y-2">
                  <h1
                    className="text-2xl font-bold tracking-tight text-neutral-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {place.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                    <MapPin className="w-3 h-3" />
                    <span>India</span>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {place.short_reason ||
                      "A historic landmark with royal connections, offering rich culture and stunning architecture for a truly memorable experience."}
                  </p>

                  {/* Mobile actions row (back + wishlist + share) */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full border border-neutral-200 bg-white shadow-sm text-neutral-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsSaved(!isSaved)}
                        className={`p-2 rounded-full border shadow-sm text-sm ${
                          isSaved
                            ? "bg-red-50 border-red-300 text-red-500"
                            : "bg-white border-neutral-200 text-neutral-600"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                      <button
                        className="p-2 rounded-full border border-neutral-200 bg-white shadow-sm text-neutral-600"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Your other sections will go here */}
                <div className="text-center py-16 sm:py-20">
                  <p className="text-lg sm:text-2xl font-bold text-orange-600">Scroll for Seasons, Budget & Tips →</p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-neutral-100 px-5 sm:px-6 py-4 sm:py-6 safe-area-inset-bottom">
              <button className="w-full py-3.5 sm:py-5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-base sm:text-xl rounded-2xl shadow-2xl">
                Plan My Trip to {place.name}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}