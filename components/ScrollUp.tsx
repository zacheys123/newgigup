import { useState, useEffect } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 bg-yellow-500 text-black rounded-full shadow-lg 
        transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }
        hover:bg-yellow-400 focus:outline-none`}
      aria-label="Back to top"
    >
      <ChevronUpIcon className="h-6 w-6" />
    </button>
  );
}
