const BackgroundLines = () => (
  <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
    {/* Horizontal lines */}
    <div className="absolute inset-0 hidden lg:block">
      {[...Array(6)].map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-[1.5px] bg-sage/5 dark:bg-sage/8"
          style={{
            top: `${15 + i * 15}%`,
            animation: `driftHorizontal ${25 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
    
    {/* Mobile horizontal lines (fewer) */}
    <div className="absolute inset-0 lg:hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={`h-mobile-${i}`}
          className="absolute left-0 right-0 h-[1.5px] bg-sage/5 dark:bg-sage/8"
          style={{
            top: `${20 + i * 20}%`,
            animation: `driftHorizontal ${25 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>

    {/* Vertical lines */}
    <div className="absolute inset-0 hidden lg:block">
      {[...Array(6)].map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-[1.5px] bg-sage/4 dark:bg-sage/7"
          style={{
            left: `${15 + i * 15}%`,
            animation: `driftVertical ${30 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}
    </div>

    {/* Mobile vertical lines (fewer) */}
    <div className="absolute inset-0 lg:hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={`v-mobile-${i}`}
          className="absolute top-0 bottom-0 w-[1.5px] bg-sage/4 dark:bg-sage/7"
          style={{
            left: `${20 + i * 20}%`,
            animation: `driftVertical ${30 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>

    {/* Intersection glow points (subtle) */}
    <div className="absolute inset-0 hidden lg:block">
      {[...Array(4)].map((_, i) => (
        <div
          key={`glow-${i}`}
          className="absolute h-16 w-16 rounded-full bg-sage/3 dark:bg-sage/5 blur-xl"
          style={{
            top: `${20 + (i % 2) * 40}%`,
            left: `${20 + Math.floor(i / 2) * 40}%`,
            animation: `pulseGlow ${20 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>

    {/* Animation keyframes */}
    <style>{`
      @keyframes driftHorizontal {
        0%, 100% {
          transform: translateY(0);
          opacity: 0.03;
        }
        50% {
          transform: translateY(12px);
          opacity: 0.07;
        }
      }
      
      @keyframes driftVertical {
        0%, 100% {
          transform: translateX(0);
          opacity: 0.04;
        }
        50% {
          transform: translateX(-10px);
          opacity: 0.08;
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% {
          opacity: 0.02;
          transform: scale(1);
        }
        50% {
          opacity: 0.06;
          transform: scale(1.1);
        }
      }
    `}</style>
  </div>
)

export default BackgroundLines
