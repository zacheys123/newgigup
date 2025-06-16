import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const Logo = () => {
  const waveRef = useRef<HTMLDivElement>(null);

  // Hover animation
  useEffect(() => {
    if (!waveRef.current) return;

    const wave = waveRef.current.querySelector(".wave-path");

    const hoverAnim = gsap.to(wave, {
      x: -10,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      paused: true,
    });

    waveRef.current.addEventListener("mouseenter", () => hoverAnim.play());
    waveRef.current.addEventListener("mouseleave", () => hoverAnim.reverse());

    return () => {
      waveRef.current?.removeEventListener("mouseenter", () =>
        hoverAnim.play()
      );
      waveRef.current?.removeEventListener("mouseleave", () =>
        hoverAnim.reverse()
      );
    };
  }, []);

  return (
    <Link href="/" className="group" aria-label="GigUp Home">
      <div
        ref={waveRef}
        className="relative w-32 h-16 flex items-center justify-center"
      >
        {/* Gradient Wave Shape (Hidden on small screens) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 80"
          className="hidden md:block absolute"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            className="wave-path"
            d="M10,40 Q35,10 60,40 T110,40 T160,40 T200,40"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6E45E2" />
              <stop offset="100%" stopColor="#88D3CE" />
            </linearGradient>
          </defs>
        </svg>

        {/* Text Logo (Responsive) */}
        <div className="relative z-10 text-center">
          <span className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-400">
            GigUp
          </span>
          <p className="text-xs md:text-sm font-light text-gray-500 mt-1">
            Elevate Your Gig
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
