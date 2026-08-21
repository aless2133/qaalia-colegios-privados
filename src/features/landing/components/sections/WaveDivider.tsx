interface WaveDividerProps {
  fill: string
  className?: string
}

export default function WaveDivider({ fill, className = '' }: WaveDividerProps) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 bottom-full overflow-hidden leading-none pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full h-12 md:h-20"
      >
       <path
          d="M0,20 L560,20 C583,20 583,50 607,50 C630,50 630,20 653,20 C687,20 687,65 720,65 C753,65 753,20 787,20 C810,20 810,50 833,50 C857,50 857,20 880,20 L1440,20 L1440,120 L0,120 Z"
          fill={fill}
        />
        <path
          d="M0,20 L560,20 C583,20 583,50 607,50 C630,50 630,20 653,20 C687,20 687,65 720,65 C753,65 753,20 787,20 C810,20 810,50 833,50 C857,50 857,20 880,20 L1440,20"
          fill="none"
          stroke="#000000ff"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}