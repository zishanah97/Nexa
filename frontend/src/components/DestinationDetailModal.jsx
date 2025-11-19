import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Heart,
    Share2,
    MapPin,
    DollarSign,
    Calendar,
    Globe,
    Clock,
    Plane,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Star,
    Utensils,
    Landmark,
    Info,
    Sparkles
} from "lucide-react";

/**
 * DESIGN PHILOSOPHY:
 * Brand Personality: Premium • Adventurous • Inspiring | NOT: Generic
 * Emotion Goal: Wonder, Wanderlust, Excitement, Trust, Aspiration
 * References: Airbnb, Apple Travel, Linear, Stripe, Arc Browser
 * 
 * COLOR SYSTEM (Custom, never default):
 * - Primary: #FF6B00 (vibrant orange - energy & adventure)
 * - Accent: #FBBF24 (warm amber - invitation)
 * - Neutrals: 8-step custom scale (#FAFAFA → #0A0A0A)
 * - Glass: rgba(255,255,255,0.85) + backdrop-blur-2xl
 * 
 * TYPOGRAPHY SCALE (1.25 major third):
 * - Display: Playfair Display (elegant serif)
 * - Body: Inter (geometric sans)
 * - Accent: Unbounded (modern geometric)
 * 
 * SPACING: Strict 8-based (8, 16, 24, 32, 48, 64)
 * BORDER RADIUS: 24px cards, 16px buttons, 12px inputs
 * MOTION: 500ms entrance, 200ms hovers, spring physics
 */



// Currency conversion rate (can be dynamic with API)
const USD_TO_INR = 83;

// Animation variants - every motion is intentional
const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 40,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1], // Ease-out-expo for premium feel
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
};

const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

export default function DestinationDetailModal({ place, isOpen, onClose }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [foodImages, setFoodImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    // Fetch diverse images from Unsplash when modal opens
    useEffect(() => {
        if (isOpen && place?.name) {
            fetchDestinationImages();
            fetchFoodImages();
        }
    }, [isOpen, place?.name]);

    const fetchDestinationImages = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://nexa-5.onrender.com/api/v1/images?query=${encodeURIComponent(
                    place.name
                )}&per_page=12`
            );
            const data = await response.json();
            setImages(data || []);
        } catch (error) {
            console.error("Failed to fetch images:", error);
            setImages([{ urls: { regular: place.image?.imageUrl || "" } }]);
        } finally {
            setLoading(false);
        }
    };

    const fetchFoodImages = async () => {
        try {
            const response = await fetch(
                `https://nexa-5.onrender.com/api/v1/images?query=${encodeURIComponent(
                    place.name + " food cuisine"
                )}&per_page=8`
            );
            const data = await response.json();
            setFoodImages(data || []);
        } catch (error) {
            console.error("Failed to fetch food images:", error);
        }
    };

    // Handle keyboard navigation (ESC to close)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") handlePrevImage();
            if (e.key === "ArrowRight") handleNextImage();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent background scroll
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, currentImageIndex]);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Check out ${place.name}!`,
                text: `Amazing destination: ${place.name}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (!place) return null;

    // Dynamic data from API with fallbacks
    const quickFacts = {
        bestTime: place.best_months?.join(", ") || "Year-round",
        temperature: "15-28°C", // This would ideally come from API too
        currency: place.quick_facts?.currency || "INR (₹)",
        languages: place.quick_facts?.languages || "Hindi, English",
        timezone: place.quick_facts?.timezone || "IST (UTC+5:30)",
        visa: place.quick_facts?.visa || "Not required (domestic)",
    };

    const budgetTiers = [
        {
            name: "Budget Traveler",
            dailyUSD: [30, 50],
            dailyINR: [2500, 4000],
            icon: "💵",
            color: "from-emerald-500 to-teal-500",
        },
        {
            name: "Mid-Range",
            dailyUSD: [80, 120],
            dailyINR: [6500, 10000],
            icon: "💳",
            color: "from-orange-500 to-amber-500",
        },
        {
            name: "Luxury",
            dailyUSD: [200, 300],
            dailyINR: [16500, 25000],
            icon: "💎",
            color: "from-purple-500 to-pink-500",
        },
    ];

    // Transform API budget breakdown or use default
    const budgetBreakdown = place.budget_breakdown ? [
        { category: "Accommodation", percentage: place.budget_breakdown.accommodation || 40, icon: "🏨" },
        { category: "Food", percentage: place.budget_breakdown.food || 30, icon: "🍽️" },
        { category: "Activities", percentage: place.budget_breakdown.activities || 20, icon: "🎡" },
        { category: "Transport", percentage: place.budget_breakdown.transport || 10, icon: "🚕" },
    ] : [
        { category: "Accommodation", percentage: 40, icon: "🏨" },
        { category: "Food", percentage: 30, icon: "🍽️" },
        { category: "Activities", percentage: 20, icon: "🎡" },
        { category: "Transport", percentage: 10, icon: "🚕" },
    ];

    const localFoods = place.local_foods || [
        { name: "Local Delicacy", desc: "Traditional dish", price: 350, mustTry: true },
        { name: "Street Food", desc: "Popular snack", price: 150, mustTry: true },
    ];

    const insiderTips = place.insider_tips || [
        "Visit early morning to avoid crowds",
        "Try local street food",
        "Use public transport for better experience"
    ];



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with blur - intentional dark overlay for focus */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />

                    {/* Modal Container - perfect centering, max-width for readability */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* SECTION 1: Image Gallery Hero */}
                            <div className="relative h-[60vh] min-h-[400px] bg-neutral-900 overflow-hidden group">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]?.urls?.regular || place.image?.imageUrl}
                                        alt={`${place.name} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        variants={imageVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    />
                                </AnimatePresence>

                                {/* Gradient overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Close button - top right, always accessible */}
                                <motion.button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-full transition-all duration-200 group/close"
                                    whileHover={{ scale: 1.05, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover/close:text-orange-500 transition-colors" />
                                </motion.button>

                                {/* Image navigation - only show if multiple images */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-6 h-6 text-white" />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-xl hover:bg-white/30 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-6 h-6 text-white" />
                                        </button>

                                        {/* Image counter - subtle, elegant */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full text-white text-sm font-medium">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>
                                    </>
                                )}

                                {/* Thumbnail strip - desktop only */}
                                <div className="hidden lg:flex absolute bottom-4 left-4 gap-2 max-w-[60%] overflow-x-auto scrollbar-hide">
                                    {images.slice(0, 6).map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${idx === currentImageIndex
                                                ? "border-orange-500 scale-105"
                                                : "border-white/30 hover:border-white/60"
                                                }`}
                                        >
                                            <img
                                                src={img.urls.thumb}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Scrollable content area */}
                            <div className="max-h-[70vh] overflow-y-auto scrollbar-custom">
                                <div className="px-6 sm:px-10 py-8 space-y-10">

                                    {/* SECTION 2: Destination Header */}
                                    <motion.div variants={sectionVariants} className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h1
                                                    className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight mb-2"
                                                    style={{ fontFamily: '"Playfair Display", serif', letterSpacing: "-0.02em" }}
                                                >
                                                    {place.name}
                                                </h1>
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <MapPin className="w-5 h-5 text-orange-500" />
                                                    <span className="text-lg font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
                                                        India
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    onClick={() => setIsSaved(!isSaved)}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`p-3 rounded-full transition-all duration-200 ${isSaved
                                                        ? "bg-red-50 text-red-500"
                                                        : "bg-neutral-100 text-neutral-600 hover:bg-orange-50 hover:text-orange-500"
                                                        }`}
                                                    aria-label={isSaved ? "Unsave" : "Save to wishlist"}
                                                >
                                                    <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                                                </motion.button>
                                                <motion.button
                                                    onClick={handleShare}
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-3 bg-neutral-100 hover:bg-orange-50 text-neutral-600 hover:text-orange-500 rounded-full transition-all duration-200"
                                                    aria-label="Share"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Vibe tags - colorful, interactive */}
                                        <div className="flex flex-wrap gap-2">
                                            {(place.primary_vibes || ["Adventure", "Culture"]).map((vibe) => (
                                                <span
                                                    key={vibe}
                                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-full shadow-sm"
                                                    style={{ fontFamily: '"Inter", sans-serif' }}
                                                >
                                                    {vibe}
                                                </span>
                                            ))}
                                            <span className="px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                4.8
                                            </span>
                                        </div>

                                        {/* Short description */}
                                        <p
                                            className="text-lg text-neutral-700 leading-relaxed max-w-3xl"
                                            style={{ fontFamily: '"Inter", sans-serif', lineHeight: 1.7 }}
                                        >
                                            {place.short_reason || "An incredible destination waiting to be explored."}
                                        </p>
                                    </motion.div>

                                    {/* SECTION 3: Quick Facts Grid */}
                                    <motion.div variants={sectionVariants}>
                                        <h2
                                            className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"
                                            style={{ fontFamily: '"Playfair Display", serif' }}
                                        >
                                            <Info className="w-6 h-6 text-orange-500" />
                                            Quick Facts
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[
                                                { icon: Calendar, label: "Best Time", value: quickFacts.bestTime },
                                                { icon: Globe, label: "Temperature", value: quickFacts.temperature },
                                                { icon: DollarSign, label: "Currency", value: quickFacts.currency },
                                                { icon: Globe, label: "Languages", value: quickFacts.languages },
                                                { icon: Clock, label: "Timezone", value: quickFacts.timezone },
                                                { icon: Plane, label: "Visa", value: quickFacts.visa },
                                            ].map((fact) => (
                                                <div
                                                    key={fact.label}
                                                    className="p-4 bg-neutral-50 hover:bg-orange-50 border border-neutral-200 hover:border-orange-200 rounded-2xl transition-all duration-200 group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white rounded-lg group-hover:bg-orange-100 transition-colors">
                                                            <fact.icon className="w-5 h-5 text-orange-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                                {fact.label}
                                                            </p>
                                                            <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                                                                {fact.value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* SECTION 4: Budget Breakdown */}
                                    <motion.div variants={sectionVariants}>
                                        <h2
                                            className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"
                                            style={{ fontFamily: '"Playfair Display", serif' }}
                                        >
                                            <DollarSign className="w-6 h-6 text-orange-500" />
                                            Budget Guide
                                        </h2>

                                        {/* Budget tiers */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                            {budgetTiers.map((tier) => (
                                                <motion.div
                                                    key={tier.name}
                                                    whileHover={{ y: -4, scale: 1.02 }}
                                                    className="p-6 bg-white border-2 border-neutral-200 hover:border-orange-300 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
                                                >
                                                    <div className="text-3xl mb-3">{tier.icon}</div>
                                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{tier.name}</h3>
                                                    <div className="space-y-1">
                                                        <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                                            ${tier.dailyUSD[0]}-${tier.dailyUSD[1]}
                                                        </p>
                                                        <p className="text-sm text-neutral-600">
                                                            ₹{tier.dailyINR[0].toLocaleString()}-₹{tier.dailyINR[1].toLocaleString()}/day
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Budget breakdown */}
                                        <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200">
                                            <h3 className="text-lg font-bold text-neutral-900 mb-4">Typical Daily Breakdown</h3>
                                            <div className="space-y-3">
                                                {budgetBreakdown.map((item) => (
                                                    <div key={item.category} className="flex items-center gap-3">
                                                        <span className="text-2xl">{item.icon}</span>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-sm font-semibold text-neutral-900">{item.category}</span>
                                                                <span className="text-sm font-bold text-orange-600">{item.percentage}%</span>
                                                            </div>
                                                            <div className="h-2 bg-white rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                                                                    initial={{ width: 0 }}
                                                                    whileInView={{ width: `${item.percentage}%` }}
                                                                    viewport={{ once: true }}
                                                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* SECTION 5: Popular Local Foods */}
                                    <motion.div variants={sectionVariants}>
                                        <h2
                                            className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"
                                            style={{ fontFamily: '"Playfair Display", serif' }}
                                        >
                                            <Utensils className="w-6 h-6 text-orange-500" />
                                            Must-Try Local Foods
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {localFoods.map((food, idx) => (
                                                <motion.div
                                                    key={food.name}
                                                    whileHover={{ y: -6, scale: 1.02 }}
                                                    className="group relative bg-white border border-neutral-200 hover:border-orange-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                                >
                                                    {/* Food image from Unsplash */}
                                                    <div className="relative h-40 bg-neutral-200 overflow-hidden">
                                                        {foodImages[idx] && (
                                                            <img
                                                                src={foodImages[idx].urls.small}
                                                                alt={food.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        )}
                                                        {food.mustTry && (
                                                            <div className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                                                <Sparkles className="w-3 h-3" />
                                                                Must-Try
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-bold text-neutral-900 mb-1">{food.name}</h3>
                                                        <p className="text-sm text-neutral-600 mb-3">{food.desc}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg font-bold text-orange-600">₹{food.price}</span>
                                                            <span className="text-sm text-neutral-500">${(food.price / USD_TO_INR).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* SECTION 6: Top Attractions (using existing data) */}
                                    <motion.div variants={sectionVariants}>
                                        <h2
                                            className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"
                                            style={{ fontFamily: '"Playfair Display", serif' }}
                                        >
                                            <Landmark className="w-6 h-6 text-orange-500" />
                                            Top Attractions
                                        </h2>
                                        <div className="space-y-4">
                                            {/* Show existing place info in enhanced format */}
                                            <div className="p-6 bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-2xl hover:shadow-lg transition-all duration-300">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden">
                                                        <img
                                                            src={place.image?.imageUrl}
                                                            alt={place.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-neutral-900 mb-2">{place.name}</h3>
                                                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{place.short_reason}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            {place.est_daily_cost_per_person && (
                                                                <span className="text-orange-600 font-semibold">
                                                                    ₹{place.est_daily_cost_per_person.min}-{place.est_daily_cost_per_person.max}/day
                                                                </span>
                                                            )}
                                                            <a
                                                                href={`https://www.google.com/maps/search/${encodeURIComponent(place.name)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1 text-neutral-600 hover:text-orange-500 transition-colors"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                                View on Map
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* SECTION 7: Insider Tips */}
                                    <motion.div variants={sectionVariants} className="pb-8">
                                        <h2
                                            className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"
                                            style={{ fontFamily: '"Playfair Display", serif' }}
                                        >
                                            <Sparkles className="w-6 h-6 text-orange-500" />
                                            Insider Tips & Travel Hacks
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {insiderTips.map((tip, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="p-4 bg-amber-50/50 border border-amber-100/50 hover:border-amber-200 rounded-xl flex items-start gap-3 hover:bg-amber-50 transition-all duration-300 shadow-sm hover:shadow-md"
                                                >
                                                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-sm text-neutral-800 leading-relaxed font-medium">{tip}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                </div>
                            </div>

                            {/* Sticky Action Bar - Premium Glassmorphism */}
                            <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/80 backdrop-blur-2xl border-t border-white/20 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-20">
                                <div className="flex flex-col sm:flex-row items-center gap-3 max-w-4xl mx-auto">
                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:flex-1 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
                                        style={{ fontFamily: '"Inter", sans-serif' }}
                                    >
                                        <Plane className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
                                        Plan My Trip Here
                                    </motion.button>
                                    <div className="flex w-full sm:w-auto gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsSaved(!isSaved)}
                                            className={`flex-1 sm:flex-none px-6 py-4 font-semibold rounded-full border transition-all duration-300 flex justify-center items-center ${isSaved
                                                ? "bg-red-50 border-red-200 text-red-500 shadow-inner"
                                                : "bg-white/50 border-neutral-200 text-neutral-600 hover:border-orange-300 hover:text-orange-500 hover:bg-white hover:shadow-md"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleShare}
                                            className="flex-1 sm:flex-none px-6 py-4 bg-white/50 border border-neutral-200 hover:border-orange-300 text-neutral-600 hover:text-orange-500 hover:bg-white font-semibold rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex justify-center items-center"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
