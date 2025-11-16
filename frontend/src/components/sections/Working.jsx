import { Target, Bot, Zap } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Enter Your Travel Preferences",
    description: "Set your budget, people count, dates and destinations.",
    icon: <Target size={40} className="text-orange-500 drop-shadow-lg" strokeWidth={2.5} />,
    note: `"Goa, ₹80,000, 5 people, Nov 10-17"`,
  },
  {
    title: "AI Plans Your Perfect Trip",
    description: "Instant personalized itineraries, maps, and smart tips.",
    icon: <Bot size={40} className="text-orange-500 drop-shadow-lg" strokeWidth={2.5} />,
    bullets: [
      "Day-wise, hour-wise schedule",
      "Top 10 destination activities",
      "Smart budgeting",
    ],
  },
  {
    title: "Review, Share",
    description: "Collaborate, customize, and get one-click share/export.",
    icon: <Zap size={40} className="text-orange-500 drop-shadow-lg" strokeWidth={2.5} />,
    bullets: [
      <span className="text-blue-600" style={{ fontFamily: '"Lobster", cursive' }}>Live collaboration</span>,
      <span className="text-green-600" style={{ fontFamily: '"Lobster", cursive' }}>Instant edits</span>,
      <span className="text-orange-600" style={{ fontFamily: '"Lobster", cursive' }}>Export/share</span>
    ],
  }
];

export default function HowItWorks() {
  return (
    <section className="w-full py-20 px-4 lg:px-6 z-10">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-gray-900"
          style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.025em' }}
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="mt-3 text-xl md:text-2xl text-gray-700 font-medium"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          From <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.1 }}
            className="font-bold text-orange-600 inline-block"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >your travel idea</motion.span> to a <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
            className="font-bold text-orange-600 inline-block"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >dream itinerary</motion.span> — automated
        </motion.p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="relative cursor-pointer bg-white/95 backdrop-blur-2xl rounded-3xl border border-orange-100 shadow-xl lg:shadow-2xl flex flex-col items-center px-5 md:px-8 py-10 group"
            style={{
              boxShadow:
                '0 8px 32px 0 rgba(245,122,36,0.09), 0 1.5px 4px 0 rgba(249,115,22,0.09)',
              fontFamily: '"Inter", sans-serif'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center"
            >
              <div className="rounded-full bg-gradient-to-br from-orange-100 via-orange-50 to-white p-6 shadow-xl">
                {step.icon}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              className="absolute top-6 left-6"
            >
              <span
                className="bg-orange-500 text-white font-bold rounded-lg px-4 py-1 text-xs shadow-md"
                style={{
                  fontFamily: '"Unbounded", sans-serif',
                  letterSpacing: '0.04em',
                  boxShadow: "0 2px 12px 0 rgba(245,122,36,0.13)"
                }}
              >
                Step {i + 1}
              </span>
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="mt-16 text-xl md:text-2xl font-extrabold mb-3 leading-tight text-gray-900"
              style={{ fontFamily: '"Playfair Display", serif', letterSpacing: '0.01em' }}
            >
              {step.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="text-base md:text-lg text-gray-700 mb-3"
              style={{ fontFamily: '"Montserrat", sans-serif' }}
            >
              {step.description}
            </motion.p>
            {step.note && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 border border-orange-100 drop-shadow px-4 py-2 rounded-2xl text-gray-700 text-sm mb-2"
                style={{ fontFamily: '"Borel", cursive', fontWeight: 500 }}
              >
                {step.note}
              </motion.div>
            )}
            {step.bullets && (
              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="bg-orange-50/90 border border-orange-100 shadow-sm rounded-2xl px-6 py-4 mt-2 space-y-2 w-full max-w-xs mx-auto text-gray-900 text-sm text-left"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {step.bullets.map((b, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + j * 0.1 }}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                    {b}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        ))}
      </div>
      <div className="absolute left-[3%] bottom-[-16px] w-[120px] h-[100px] bg-gradient-to-br from-orange-200 to-orange-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
      <div className="absolute right-[2%] top-8 w-[80px] h-[60px] bg-gradient-to-br from-orange-100 to-white rounded-full blur-lg opacity-40 pointer-events-none"></div>
    </section>
  );
}





