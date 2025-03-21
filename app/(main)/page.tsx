"use client";
import Image from "next/image";
import postimage from "../../public/assets/post.jpg";
import reactimage from "../../public/assets/svg/logo-no-background.svg";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import "./main.css";
import { useRouter } from "next/navigation";
// import UsersButton from "../../components/UsersButton";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Home() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const {
    user: { firstname },
  } = useCurrentUser(userId || null);

  if (!isLoaded && !userId) {
    localStorage.removeItem("user");
    return (
      <div className="h-screen w-full">
        <div className="flex justify-center items-center h-screen flex-col">
          <CircularProgress size="30px" />
          <span className="mt-2 text-1xl font-bold">
            Please wait a moment :)..
          </span>
        </div>
      </div>
    );
  }

  const sentence = `Welcome to gigUp, ${firstname}!`;
  const words = sentence.split(" ");
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <div className="bg-gray-900 min-h-screen text-white font-sans">
        {/* Hero Section with Video Background */}
        <section className="relative flex flex-col items-center justify-center min-h-[520px] text-center overflow-hidden clip-polygon">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-50"
          >
            <source
              src="https://res.cloudinary.com/dsziq73cb/video/upload/v1741989883/gigmeUpload/yokrhywny8wq1wfcwssi.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 z-1"></div>
          {/* Content */}
          <div className="relative z-10 ml-6">
            {firstname && (
              <motion.div
                className="mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ display: "flex", gap: "6px" }}
              >
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={wordVariants}
                    className="text-[16px] bg-gradient-to-l from-yellow-600 via-gray-400 to-red-600 inline-block text-transparent bg-clip-text font-bold"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <h1 className="text-5xl font-bold mb-4">Jam, Discover, Create</h1>
              <p className="text-lg mb-8">
                Share your jam sessions, create and book gigs, connect with
                musicians around the world.
              </p>
              <Link
                href="#features"
                className="bg-white text-black py-2 px-6 rounded-full font-semibold hover:bg-gray-200"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Polygon Styled Section */}
        <motion.section
          className="py-16 px-8 bg-gray-800 clip-polygon"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold text-center mb-12">
            What You Can Do
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 p-6 rounded-lg shadow-lg"
            >
              <Image
                src={postimage}
                alt="Post"
                className="mx-auto mb-6 h-20 w-20 object-fit"
                width={20}
                height={20}
              />
              <h3 className="text-2xl font-bold mb-4">Post Your Jam</h3>
              <p className="text-gray-400">
                Upload your music jam sessions and share your passion with
                others.
              </p>
            </motion.div>
            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 p-6 rounded-lg shadow-lg"
            >
              <Image
                src={postimag}
                alt="Post"
                className="mx-auto mb-6 h-20 w-20 object-fit"
                width={20}
                height={20}
              />
              <h3 className="text-2xl font-bold mb-4">Discover New Artists</h3>
              <p className="text-gray-400">
                Find incredible jams posted by other musicians from all over the
                globe.
              </p>
            </motion.div> */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 p-6 rounded-lg shadow-lg"
            >
              <Image
                src={reactimage}
                alt="Post"
                className="mx-auto mb-6 h-20 w-20 object-fit"
                width={20}
                height={20}
              />
              <h3 className="text-2xl font-bold mb-4">React & Interact</h3>
              <p className="text-gray-400">
                {`Like, comment, and share your thoughts on other people's videos.`}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Tutorial Section */}
        <section className="py-16 px-8 bg-gray-900">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex justify-center">
            <video controls className="w-full max-w-4xl rounded-lg shadow-lg">
              <source
                src="https://res.cloudinary.com/dsziq73cb/video/upload/v1741577722/gigmeUpload/gww2kwzvdtkx4qxln6qu.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-yellow-500 py-16 px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Ready to Jam?
            </h2>
            <Link
              href={`/gigme/gigs/${userId}`}
              className="px-8 py-4 bg-black text-yellow-500 rounded-lg font-bold hover:bg-gray-800 transition-all"
            >
              Join Now
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 py-8 text-center text-gray-500">
          <p>© 2024 gigUp. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
