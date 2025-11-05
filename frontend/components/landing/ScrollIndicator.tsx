/**
 * Scroll Indicator - Animated scroll prompt
 */

'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
            <span className="text-sm text-gray-500 font-medium">Scroll to explore</span>
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-2"
            >
                <motion.div
                    className="w-1.5 h-1.5 bg-white rounded-full"
                    animate={{ y: [0, 12, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
