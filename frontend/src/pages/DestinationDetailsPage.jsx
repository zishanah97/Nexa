import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import {
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
    Sparkles,
    ArrowLeft,
    Sun,
    Droplets,
    Wind,
} from "lucide-react";

const USD_TO_INR = 83;

// --- Marcus Chen's Design System Components ---

const SpotlightCard = ({ children, className = "" }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 100, 0, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            {children}
        </div>
    );
};

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-16 relative group">
        <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-orange-500/5 rounded-xl border border-orange-500/10 group-hover:border-orange-500/20 transition-colors">
                <Icon className="w-6 h-6 text-orange-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
                {title}
            </h2>
        </div>
        {subtitle && (
            <p className="text-neutral-500 text-lg md:text-xl max-w-[60ch] ml-[4.5rem] leading-relaxed font-light tracking-wide">
                {subtitle}
            </p>
        )}
        <div className="absolute -left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-500/50 to-transparent opacity-0 md:opacity-100 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
    </div>
);

export default function DestinationDetailsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const place = location.state?.place;
    const containerRef = useRef(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState([]);
    const [foodImages, setFoodImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    // Parallax & Scroll Effects
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

    // Mouse spotlight for global background
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        if (!place) navigate("/");
    }, [place, navigate]);

    useEffect(() => {
        if (place?.name) {
            fetchDestinationImages();
            fetchFoodImages();
        }
        // eslint-disable-next-line
    }, [place?.name]);

    const fetchDestinationImages = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://nexa-5.onrender.com/api/v1/images?query=${encodeURIComponent(
                    place.name
                )}&per_page=8`
            );
            const data = await response.json();
            setImages(data || []);
        } catch {
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
                )}&per_page=6`
            );
            const data = await response.json();
            setFoodImages(data || []);
        } catch { }
    };

    const handlePrevImage = () =>
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    const handleNextImage = () =>
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );

    if (!place) return null;

    // Dynamic data
    const quickFacts = {
        bestTime: place.best_months?.join(", ") || "Year-round",
        temperature: "15-28°C",
        currency: place.quick_facts?.currency || "INR (₹)",
        languages: place.quick_facts?.languages || "Hindi, English",
        timezone: place.quick_facts?.timezone || "IST (UTC+5:30)",
        visa: place.quick_facts?.visa || "On Arrival",
    };

    const budgetTiers = [
        {
            name: "Budget Explorer",
            dailyUSD: [30, 50],
            dailyINR: [2500, 4000],
            icon: "🎒",
            badge: "Best Value",
            benefits: ["Hostels", "Street Food", "Public Transport"],
        },
        {
            name: "Comfort Traveler",
            dailyUSD: [80, 120],
            dailyINR: [6500, 10000],
            icon: "✨",
            badge: "Most Popular",
            benefits: ["3-Star Hotels", "Restaurants", "Taxis"],
        },
        {
            name: "Luxury Elite",
            dailyUSD: [200, 300],
            dailyINR: [16500, 25000],
            icon: "👑",
            badge: "Premium",
            benefits: ["Resorts", "Fine Dining", "Private Chauffeur"],
        },
    ];

    const budgetBreakdown = place.budget_breakdown
        ? [
            {
                category: "Accommodation",
                percentage: place.budget_breakdown.accommodation || 40,
                icon: "🏨",
            },
            {
                category: "Food",
                percentage: place.budget_breakdown.food || 30,
                icon: "🍽️",
            },
            {
                category: "Activities",
                percentage: place.budget_breakdown.activities || 20,
                icon: "🎡",
            },
            {
                category: "Transport",
                percentage: place.budget_breakdown.transport || 10,
                icon: "🚕",
            },
        ]
        : [
            { category: "Accommodation", percentage: 40, icon: "🏨" },
            { category: "Food", percentage: 30, icon: "🍽️" },
            { category: "Activities", percentage: 20, icon: "🎡" },
            { category: "Transport", percentage: 10, icon: "🚕" },
        ];

    const localFoods = place.local_foods || [
        { name: "Signature Dish", desc: "Authentic local flavors", price: 450, mustTry: true },
        { name: "Street Snack", desc: "Popular among locals", price: 180, mustTry: true },
        { name: "Traditional Dessert", desc: "Sweet ending perfection", price: 220, mustTry: false },
    ];

    const insiderTips = place.insider_tips || [
        "Visit popular attractions early to avoid crowds.",
        "Download offline maps beforehand.",
        "Learn basic local phrases.",
        "Eat where locals eat.",
    ];

    return (
        <div className="relative min-h-screen bg-neutral-50 overflow-x-hidden selection:bg-orange-500/30 font-sans text-neutral-900">
            {/* --- 1. Global Atmosphere (Marcus Chen's Secret Sauce) --- */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '64px 64px'
                }}
            />
            {/* Dynamic Spotlight */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-0 opacity-30"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            800px circle at ${mouseX}px ${mouseY}px,
                            rgba(255, 165, 0, 0.08),
                            transparent 80%
                        )
                    `
                }}
            />

            {/* --- 2. Hero Section (The "Wow" Entry) --- */}
            <header className="relative h-[90vh] md:h-screen w-full overflow-hidden">
                {/* Parallax Image Background */}
                <motion.div
                    style={{ y: heroY }}
                    className="absolute inset-0 w-full h-full"
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={images[currentImageIndex]?.urls?.regular || place.image?.imageUrl}
                            alt={place.name}
                            className="w-full h-full object-cover scale-105"
                            initial={{ opacity: 0, scale: 1.15 }}
                            animate={{ opacity: 1, scale: 1.05 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                </motion.div>

                {/* Navigation Overlay */}
                <nav className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
                    <button onClick={() => navigate(-1)} className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/15 transition-all duration-300 group">
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex gap-4">
                        <button onClick={() => setIsSaved(!isSaved)} className={`p-4 backdrop-blur-xl border border-white/10 rounded-full transition-all duration-300 ${isSaved ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-white hover:bg-white/15'}`}>
                            <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/15 transition-all duration-300">
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24 pb-32 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex flex-wrap gap-4 mb-8">
                            <span className="px-5 py-2 bg-orange-500 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-2xl shadow-orange-500/30">
                                Top Choice
                            </span>
                            <span className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-[0.1em] uppercase rounded-full flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> India
                            </span>
                            <span className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-[0.1em] uppercase rounded-full flex items-center gap-2">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.8
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-[0.9] tracking-tighter"
                            style={{ fontFamily: '"Playfair Display", serif' }}>
                            {place.name}
                        </h1>

                        <div className="flex flex-col md:flex-row gap-12 items-start md:items-end justify-between border-t border-white/20 pt-8">
                            <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-light leading-relaxed tracking-wide">
                                {place.short_reason || "Discover a destination where ancient traditions meet modern luxury in perfect harmony."}
                            </p>

                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <div className="flex gap-4">
                                    <button onClick={handlePrevImage} className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/15 transition-all hover:scale-105 active:scale-95">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button onClick={handleNextImage} className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/15 transition-all hover:scale-105 active:scale-95">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* --- 3. Sticky Stat Bar (Glassmorphism Refined) --- */}
            <motion.div
                className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 text-neutral-900 py-5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center overflow-x-auto no-scrollbar gap-12">
                    <div className="flex gap-12 md:gap-20 min-w-max">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold mb-1">Best Time</span>
                            <span className="font-serif text-lg font-medium text-neutral-900">{quickFacts.bestTime}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold mb-1">Ideal Stay</span>
                            <span className="font-serif text-lg font-medium text-neutral-900">4-5 Days</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold mb-1">Budget</span>
                            <span className="font-serif text-lg font-medium text-neutral-900">₹{budgetTiers[0].dailyINR[0]}+ /day</span>
                        </div>
                    </div>
                    <button className="hidden md:flex px-8 py-3 bg-neutral-900 text-white font-bold rounded-full hover:bg-orange-600 transition-colors text-xs uppercase tracking-[0.15em] shadow-lg shadow-orange-500/20">
                        Book Now
                    </button>
                </div>
            </motion.div>

            {/* --- 4. Main Content Container --- */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 space-y-40">

                {/* Weather Section */}
                <section>
                    <SectionHeading icon={Sun} title="Weather & Seasons" subtitle="Experience the perfect climate for your adventures, from sunny days to misty mornings." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {['Summer', 'Monsoon', 'Winter'].map((season, idx) => (
                            <SpotlightCard
                                key={season}
                                className="group p-10 bg-white rounded-[2rem] border border-neutral-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: idx * 0.15, duration: 0.8 }}
                                >
                                    <div className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-colors duration-500 ${season === 'Summer' ? 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' :
                                        season === 'Monsoon' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' :
                                            'bg-cyan-50 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white'
                                        }`}>
                                        {season === 'Summer' ? <Sun className="w-8 h-8" strokeWidth={1.5} /> : season === 'Monsoon' ? <Droplets className="w-8 h-8" strokeWidth={1.5} /> : <Wind className="w-8 h-8" strokeWidth={1.5} />}
                                    </div>
                                    <h3 className="text-2xl font-bold text-neutral-900 mb-4 font-serif tracking-tight">{season}</h3>
                                    <p className="text-neutral-500 text-base leading-relaxed font-light">
                                        {season === 'Summer' ? 'Perfect for outdoor activities and sightseeing.' :
                                            season === 'Monsoon' ? 'Lush greenery and refreshing rains.' :
                                                'Cool breeze and pleasant evenings.'}
                                    </p>
                                </motion.div>
                            </SpotlightCard>
                        ))}
                    </div>
                </section>

                {/* Essential Info Grid */}
                <section>
                    <SectionHeading icon={Info} title="Essential Information" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: Globe, label: "Languages", value: quickFacts.languages },
                            { icon: DollarSign, label: "Currency", value: quickFacts.currency },
                            { icon: Clock, label: "Timezone", value: quickFacts.timezone },
                            { icon: Plane, label: "Visa Policy", value: quickFacts.visa },
                        ].map((item, idx) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.01, x: 10 }}
                                className="flex items-center gap-8 p-8 bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="p-5 bg-neutral-50 rounded-full text-neutral-400 group-hover:text-orange-500 transition-colors">
                                    <item.icon className="w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                                    <p className="text-xl font-medium text-neutral-900 font-serif">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Smart Budget */}
                <section>
                    <SectionHeading icon={DollarSign} title="Smart Budget Planner" subtitle="Choose your travel style and see what it costs." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {budgetTiers.map((tier, idx) => (
                            <SpotlightCard
                                key={tier.name}
                                className="group relative p-10 bg-white rounded-[2.5rem] border border-neutral-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2, duration: 0.8 }}
                                >
                                    <div className="text-5xl mb-8 opacity-80 group-hover:scale-110 transition-transform duration-500 origin-left">{tier.icon}</div>
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] mb-6 ${idx === 1 ? 'bg-orange-100 text-orange-600' : 'bg-neutral-100 text-neutral-500'
                                        }`}>
                                        {tier.badge}
                                    </span>
                                    <h3 className="text-3xl font-bold text-neutral-900 mb-2 font-serif tracking-tight">{tier.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-8">
                                        <span className="text-4xl font-bold text-orange-600 tracking-tighter">${tier.dailyUSD[0]}</span>
                                        <span className="text-neutral-400 font-medium">/day</span>
                                    </div>
                                    <ul className="space-y-4">
                                        {tier.benefits.map(benefit => (
                                            <li key={benefit} className="flex items-center gap-4 text-sm text-neutral-600 font-medium">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </SpotlightCard>
                        ))}
                    </div>
                </section>

                {/* Must Try Foods */}
                <section>
                    <SectionHeading icon={Utensils} title="Culinary Delights" subtitle="A journey of flavors that you cannot miss." />
                    <div className="flex overflow-x-auto pb-12 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-8 no-scrollbar snap-x">
                        {localFoods.map((food, idx) => (
                            <motion.div
                                key={food.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="min-w-[320px] md:min-w-0 snap-center group relative h-[480px] rounded-[2rem] overflow-hidden cursor-pointer"
                            >
                                <img
                                    src={foodImages[idx]?.urls?.regular || place.image?.imageUrl}
                                    alt={food.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {food.mustTry && (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4 border border-white/20">
                                            <Sparkles className="w-3 h-3" /> Must Try
                                        </span>
                                    )}
                                    <h3 className="text-3xl font-bold text-white mb-3 font-serif tracking-tight">{food.name}</h3>
                                    <p className="text-white/80 text-sm line-clamp-2 mb-6 font-light leading-relaxed">{food.desc}</p>
                                    <div className="flex justify-between items-center border-t border-white/20 pt-6">
                                        <span className="text-orange-400 font-bold text-lg">₹{food.price}</span>
                                        <span className="text-white/50 text-xs uppercase tracking-widest">Approx. price</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Insider Tips */}
                <section className="pb-32">
                    <SectionHeading icon={Sparkles} title="Insider Secrets" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {insiderTips.map((tip, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 12, backgroundColor: "rgba(255,255,255,1)" }}
                                className="flex gap-8 p-8 bg-white/60 backdrop-blur-sm rounded-3xl border-l-4 border-orange-500 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <span className="text-6xl font-bold text-neutral-100 font-serif -mt-2">0{idx + 1}</span>
                                <p className="text-neutral-700 text-lg font-medium leading-relaxed pt-2">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </main>


        </div>
    );
}
