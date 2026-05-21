/**
 * Indian Flag Component
 * Displays the tricolor flag with Ashoka Chakra
 */
export function IndianFlag({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col rounded-md overflow-hidden shadow-lg border-2 border-gray-300 dark:border-gray-600 ${className}`}>
      {/* Saffron stripe */}
      <div className="h-1/3 bg-[#FF9933]" />
      
      {/* White stripe with Ashoka Chakra */}
      <div className="h-1/3 bg-white dark:bg-white flex items-center justify-center relative">
        {/* Ashoka Chakra - 24 spokes wheel */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-4 h-4 absolute"
          fill="none"
          stroke="#000080"
          strokeWidth="1.5"
        >
          {/* Center circle */}
          <circle cx="12" cy="12" r="4" />
          
          {/* 24 spokes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 12 + 4 * Math.cos(rad);
            const y1 = 12 + 4 * Math.sin(rad);
            const x2 = 12 + 10 * Math.cos(rad);
            const y2 = 12 + 10 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth="0.5"
              />
            );
          })}
          
          {/* Outer circle */}
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      
      {/* Green stripe */}
      <div className="h-1/3 bg-[#138808]" />
    </div>
  );
}

export default IndianFlag;
