import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated 404 Text */}
          <div className="relative inline-block">
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2
              }}
              className="text-[150px] md:text-[200px] font-black bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent leading-none select-none"
            >
              404
            </motion.h1>

            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-10 -right-10 text-purple-400 opacity-50"
            >
              <Ghost size={80} />
            </motion.div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mt-8 mb-4">
            Lost in Space?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
            The page you're looking for has vanished into the digital void. Don't worry, even the best explorers get lost sometimes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl transition-all duration-300 backdrop-blur-xl group cursor-pointer"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              <Home size={20} />
              Return Home
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
};

export default NotFound;

