import React, { useRef, useEffect } from "react";
import gsap from "gsap";

// Trending locations
const locationsRow1 = [
  "SHILLONG", "LEH-LADAKH", "RISHIKESH", "JAIPUR", "GOA", "VARANASI", "UDAIPUR", "HAMPI",
  "KERALA", "AGRA", "ANDAMAN ISLANDS", "RAJASTHAN", "DARJEELING", "SHIMLA", "DELHI", "MUMBAI"
];
const locationsRow2 = [
  "TOKYO", "OSAKA", "PARIS", "LANGKAWI", "BAKU", "PALMA DE MALLORCA", "TROMSØ", "TASHKENT",
  "AL-ULA", "COLOMBO", "RIYADH", "KRABI", "SINGAPORE", "SEOUL", "SHANGHAI", "REYKJAVIK"
];

const TickerRow = ({ locations, duration, reverse, size = "text-2xl", gradient = "default" }) => {
  const rowRef = useRef();

  useEffect(() => {
    const distance = rowRef.current.scrollWidth / 2; // width of one copy
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        { x: reverse ? -distance : 0 },
        {
          x: reverse ? 0 : -distance,
          ease: "none",
          duration,
          repeat: -1,
        }
      );
    });
    return () => ctx.revert();
  }, [duration, reverse]);

  const gradientStyle =
    gradient === "light"
      ? "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(200,200,200,0.6))"
      : "linear-gradient(90deg, #a18cd1, #fbc2eb, #84fab0, #8fd3f4)";

  const textShadow =
    gradient === "light"
      ? "0px 0px 6px rgba(255,255,255,0.15)"
      : "0px 0px 12px rgba(255,255,255,0.3)";

  return (
    <div className="overflow-hidden w-full relative">
      {/* Fade mask on sides */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent z-10" />

      <div ref={rowRef} className="flex gap-8 py-1" style={{ width: "max-content" }}>
        {[...locations, ...locations].map((loc, idx) => (
          <span
            key={loc + idx}
            className={`uppercase select-none tracking-widest mx-2 font-bold ${size}`}
            style={{
              backgroundImage: gradientStyle,
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 6s linear infinite",
              textShadow,
              minWidth: 140,
              textAlign: "center",
            }}
          >
            {loc}
          </span>
        ))}
      </div>
    </div>
  );
};

const TickerCarouselGSAP = () => (
  <div className="w-full mx-auto flex flex-col gap-1  ">
    <TickerRow
      locations={locationsRow1}
      duration={30}
      reverse={false}
      size="text-3xl"
      gradient="default"
    />
    <TickerRow
      locations={locationsRow2}
      duration={38}
      reverse={true}
      size="text-xl"
      gradient="light"
    />
  </div>
);

export default TickerCarouselGSAP;
