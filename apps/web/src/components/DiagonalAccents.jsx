const DiagonalAccents = () => (
  <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
    <style>
      {`
        .diagonal-line-1 {
          animation: driftOne 42s ease-in-out infinite;
        }
        .diagonal-line-2 {
          animation: driftTwo 45s ease-in-out infinite;
          animation-delay: 12s;
        }
        @keyframes driftOne {
          0%, 100% {
            transform: rotate(-28deg) translate(0, 0);
            opacity: 0.04;
          }
          50% {
            transform: rotate(-28deg) translate(30px, -18px);
            opacity: 0.08;
          }
        }
        @keyframes driftTwo {
          0%, 100% {
            transform: rotate(-28deg) translate(0, 0);
            opacity: 0.04;
          }
          50% {
            transform: rotate(-28deg) translate(-25px, 15px);
            opacity: 0.08;
          }
        }
      `}
    </style>

    {/* Line 1 - drifting up-right */}
    <div
      className="diagonal-line-1 absolute h-[1.5px] bg-sage/[0.05] dark:bg-sage/[0.08]"
      style={{
        width: '70vw',
        top: '40%',
        left: '10%',
        transform: 'rotate(-28deg)',
        willChange: 'transform, opacity',
      }}
    />

    {/* Line 2 - drifting down-left */}
    <div
      className="diagonal-line-2 absolute h-[1.5px] bg-sage/[0.05] dark:bg-sage/[0.08]"
      style={{
        width: '70vw',
        top: '60%',
        right: '10%',
        transform: 'rotate(-28deg)',
        willChange: 'transform, opacity',
      }}
    />
  </div>
)

export default DiagonalAccents
