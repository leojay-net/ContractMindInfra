/**
 * ContractMind Logo Component
 * Professional, modern logo with brain/neural network theme
 */

interface LogoProps {
    className?: string;
    size?: number;
}

export function Logo({ className = '', size = 24 }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Brain/Neural Network Icon */}
            <path
                d="M12 2C10.5 2 9.2 2.8 8.5 4C7.5 4 6.7 4.8 6.7 5.8C5.8 6.2 5 7 5 8C5 8.5 5.2 9 5.5 9.4C4.6 10.1 4 11.2 4 12.5C4 13.3 4.3 14 4.7 14.6C4.3 15.2 4 16 4 16.8C4 18.6 5.4 20 7.2 20C7.6 20 8 19.9 8.4 19.8C9 20.5 9.9 21 11 21C11.7 21 12.3 20.8 12.8 20.4C13.3 20.8 14 21 14.7 21C15.8 21 16.7 20.5 17.3 19.8C17.7 19.9 18.1 20 18.5 20C20.3 20 21.7 18.6 21.7 16.8C21.7 16 21.4 15.2 21 14.6C21.4 14 21.7 13.3 21.7 12.5C21.7 11.2 21.1 10.1 20.2 9.4C20.5 9 20.7 8.5 20.7 8C20.7 7 19.9 6.2 19 6.2C18.3 4.8 17 4 15.5 4C14.8 2.8 13.5 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Neural connections */}
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="8" cy="9" r="1.5" fill="currentColor" opacity="0.7" />
            <circle cx="16" cy="9" r="1.5" fill="currentColor" opacity="0.7" />
            <circle cx="9" cy="15" r="1.5" fill="currentColor" opacity="0.7" />
            <circle cx="15" cy="15" r="1.5" fill="currentColor" opacity="0.7" />
            <line x1="12" y1="12" x2="8" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="12" y1="12" x2="16" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="12" y1="12" x2="9" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            <line x1="12" y1="12" x2="15" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        </svg>
    );
}

export function LogoMark({ className = '', size = 32 }: LogoProps) {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-90" />
            <div className="absolute inset-[2px] bg-black rounded-lg flex items-center justify-center">
                <Logo className="text-white" size={size * 0.6} />
            </div>
        </div>
    );
}
