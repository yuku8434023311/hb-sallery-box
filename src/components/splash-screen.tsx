'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';

interface SplashScreenProps {
  onComplete: (isAuthenticated: boolean) => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated, verifySession } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      const isValidSession = isAuthenticated && verifySession();
      onComplete(isValidSession);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, onComplete, verifySession]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        className="flex flex-col items-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/30 bg-white mb-8"
        >
          <img
            src="/logo.jpg"
            alt="HB Sallery Box Logo"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 mb-3 tracking-tight"
        >
          HB Sallery Box
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gray-600 text-base"
        >
          Secure Staff Management
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-16"
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-600"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
