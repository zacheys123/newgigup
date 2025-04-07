import { motion } from "framer-motion";

export default function FloatingNotesLoader() {
  const notes = ["♪", "♫", "♩", "♬", "♭", "♮", "♯"];

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full">
      <div className="relative w-32 h-32">
        {notes.map((note, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl text-yellow-400"
            initial={{
              x: Math.random() * 60 - 30,
              y: Math.random() * 60 - 30,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 60 - 30,
              y: Math.random() * 60 - 30,
              opacity: [0, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.3,
            }}
            style={{
              left: "50%",
              top: "50%",
            }}
          >
            {note}
          </motion.span>
        ))}
      </div>
      <p className="mt-8 text-lg font-medium text-gray-300">
        Preparing your backstage...
      </p>
    </div>
  );
}
