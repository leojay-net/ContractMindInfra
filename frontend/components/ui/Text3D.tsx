/**
 * 3D Text Component - Adds depth and shadow effects to text
 */

'use client';

import { ReactNode } from 'react';

interface Text3DProps {
    children: ReactNode;
    className?: string;
    intensity?: 'light' | 'medium' | 'strong';
    color?: 'white' | 'gray';
}

export default function Text3D({
    children,
    className = '',
    intensity = 'medium',
    color = 'white'
}: Text3DProps) {

    const getShadow = () => {
        const shadows = {
            white: {
                light: `
          1px 1px 0px rgba(255,255,255,0.1),
          2px 2px 0px rgba(255,255,255,0.08),
          3px 3px 10px rgba(0,0,0,0.3)
        `,
                medium: `
          2px 2px 0px rgba(255,255,255,0.1),
          4px 4px 0px rgba(255,255,255,0.08),
          6px 6px 0px rgba(255,255,255,0.06),
          8px 8px 0px rgba(255,255,255,0.04),
          10px 10px 20px rgba(0,0,0,0.5)
        `,
                strong: `
          2px 2px 0px rgba(255,255,255,0.15),
          4px 4px 0px rgba(255,255,255,0.12),
          6px 6px 0px rgba(255,255,255,0.09),
          8px 8px 0px rgba(255,255,255,0.06),
          10px 10px 0px rgba(255,255,255,0.03),
          12px 12px 30px rgba(0,0,0,0.6)
        `
            },
            gray: {
                light: `
          1px 1px 0px rgba(156,163,175,0.2),
          2px 2px 5px rgba(0,0,0,0.3)
        `,
                medium: `
          1px 1px 0px rgba(156,163,175,0.3),
          2px 2px 0px rgba(156,163,175,0.2),
          3px 3px 0px rgba(156,163,175,0.1),
          4px 4px 10px rgba(0,0,0,0.5)
        `,
                strong: `
          2px 2px 0px rgba(156,163,175,0.3),
          4px 4px 0px rgba(156,163,175,0.2),
          6px 6px 0px rgba(156,163,175,0.1),
          8px 8px 20px rgba(0,0,0,0.6)
        `
            }
        };

        return shadows[color][intensity];
    };

    return (
        <span
            className={className}
            style={{
                textShadow: getShadow(),
                transform: 'translateZ(40px)',
                display: 'inline-block',
                letterSpacing: '-0.02em'
            }}
        >
            {children}
        </span>
    );
}
