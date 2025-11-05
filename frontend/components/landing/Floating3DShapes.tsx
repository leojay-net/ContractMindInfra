/**
 * Floating 3D Shapes - Decorative animated geometric shapes
 * Using CSS transforms for guaranteed visibility
 */

'use client';

import { motion } from 'framer-motion';

export default function Floating3DShapes() {
    return (
        <>
            {/* Top Left - Cube */}
            <motion.div
                className="absolute top-20 left-10 w-20 h-20 md:w-32 md:h-32 pointer-events-none z-0"
                initial={{ opacity: 0, x: -100, rotate: 0 }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    x: 0,
                    rotate: 360,
                    y: [0, -20, 0]
                }}
                transition={{
                    opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    x: { duration: 0.8, delay: 0.2 }
                }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#999999" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    {/* Isometric cube */}
                    <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="url(#cubeGradient)" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
                    <path d="M50 10 L90 30 L50 50 L10 30 Z" fill="#FFFFFF" opacity="0.3" />
                    <path d="M50 50 L90 70 L90 30 Z" fill="#CCCCCC" opacity="0.4" />
                    <path d="M50 50 L10 70 L10 30 Z" fill="#999999" opacity="0.5" />
                </svg>
            </motion.div>

            {/* Top Right - Torus/Ring */}
            <motion.div
                className="absolute top-40 right-10 w-24 h-24 md:w-40 md:h-40 pointer-events-none z-0"
                initial={{ opacity: 0, x: 100, scale: 0.5 }}
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                    x: 0,
                    scale: 1,
                    rotateY: [0, 360]
                }}
                transition={{
                    opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
                    x: { duration: 0.8, delay: 0.4 },
                    scale: { duration: 0.8, delay: 0.4 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <radialGradient id="torusGradient">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#666666" stopOpacity="0.2" />
                        </radialGradient>
                    </defs>
                    <ellipse cx="50" cy="50" rx="40" ry="40" fill="none" stroke="url(#torusGradient)" strokeWidth="8" opacity="0.7" />
                    <ellipse cx="50" cy="50" rx="25" ry="25" fill="none" stroke="#FFFFFF" strokeWidth="4" opacity="0.4" />
                </svg>
            </motion.div>

            {/* Bottom Left - Pyramid */}
            <motion.div
                className="absolute bottom-40 left-20 w-28 h-28 md:w-44 md:h-44 pointer-events-none z-0"
                initial={{ opacity: 0, y: 100, rotate: -45 }}
                animate={{
                    opacity: [0.3, 0.7, 0.3],
                    y: 0,
                    rotate: 0,
                    x: [0, 10, 0]
                }}
                transition={{
                    opacity: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 0.8, delay: 0.6 },
                    y: { duration: 0.8, delay: 0.6 },
                    x: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="pyramidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#888888" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    {/* 3D Pyramid */}
                    <path d="M50 10 L90 90 L10 90 Z" fill="url(#pyramidGradient)" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
                    <path d="M50 10 L90 90 L70 75 Z" fill="#DDDDDD" opacity="0.4" />
                    <path d="M50 10 L10 90 L30 75 Z" fill="#AAAAAA" opacity="0.5" />
                </svg>
            </motion.div>

            {/* Bottom Right - Octahedron */}
            <motion.div
                className="absolute bottom-20 right-20 w-32 h-32 md:w-48 md:h-48 pointer-events-none z-0"
                initial={{ opacity: 0, y: 100, x: 100 }}
                animate={{
                    opacity: [0.2, 0.6, 0.2],
                    y: 0,
                    x: 0,
                    rotate: [0, 180, 360]
                }}
                transition={{
                    opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    y: { duration: 0.8, delay: 0.8 },
                    x: { duration: 0.8, delay: 0.8 }
                }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="octaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#777777" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    {/* Diamond/Octahedron shape */}
                    <path d="M50 5 L85 50 L50 95 L15 50 Z" fill="url(#octaGradient)" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />
                    <path d="M50 5 L85 50 L50 50 Z" fill="#FFFFFF" opacity="0.3" />
                    <path d="M50 5 L15 50 L50 50 Z" fill="#CCCCCC" opacity="0.4" />
                    <path d="M50 95 L85 50 L50 50 Z" fill="#999999" opacity="0.5" />
                    <path d="M50 95 L15 50 L50 50 Z" fill="#666666" opacity="0.6" />
                </svg>
            </motion.div>

            {/* Center floating - Small sphere */}
            <motion.div
                className="absolute top-1/2 left-1/4 w-16 h-16 md:w-24 md:h-24 pointer-events-none z-0"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                    y: [0, -30, 0]
                }}
                transition={{
                    opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <radialGradient id="sphereGradient">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                            <stop offset="70%" stopColor="#CCCCCC" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#666666" stopOpacity="0.1" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="url(#sphereGradient)" opacity="0.7" />
                    <ellipse cx="50" cy="45" rx="30" ry="15" fill="#FFFFFF" opacity="0.3" />
                </svg>
            </motion.div>

            {/* Right center - Helix/Spring */}
            <motion.div
                className="absolute top-1/3 right-1/4 w-20 h-32 md:w-28 md:h-44 pointer-events-none z-0"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <svg viewBox="0 0 60 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="helixGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#AAAAAA" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#888888" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    {/* Helix/Spring shape */}
                    <ellipse cx="30" cy="15" rx="20" ry="8" fill="none" stroke="url(#helixGradient)" strokeWidth="3" />
                    <ellipse cx="30" cy="35" rx="20" ry="8" fill="none" stroke="url(#helixGradient)" strokeWidth="3" />
                    <ellipse cx="30" cy="55" rx="20" ry="8" fill="none" stroke="url(#helixGradient)" strokeWidth="3" />
                    <ellipse cx="30" cy="75" rx="20" ry="8" fill="none" stroke="url(#helixGradient)" strokeWidth="3" />
                </svg>
            </motion.div>
        </>
    );
}
