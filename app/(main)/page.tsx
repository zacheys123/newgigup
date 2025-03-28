"use client";
import Image from "next/image";
import postimage from "../../public/assets/post.jpg";
import reactimage from "../../public/assets/svg/logo-no-background.svg";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import "./main.css";
import { useState, useEffect } from "react";
import thumbnailImage from "../../public/assets/discover4.webp";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PlayIcon } from "@heroicons/react/24/solid";
import ScrollToTopButton from "@/components/ScrollUp";
import { colors, fonts } from "@/utils";

import { SaveAll } from "lucide-react";

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const {
    user: { firstname, isClient, isMusician } = {
      firstname: "",
      isClient: false,
      isMusician: false,
    },
  } = useCurrentUser(userId || null);

  const [showVideo, setShowVideo] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
    if (!isLoaded && !userId) {
      localStorage.removeItem("user");
    }
  }, [isLoaded, userId]);

  if (!isLoaded && !userId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <CircularProgress size="30px" />
        <span className="mt-2 text-lg font-medium text-gray-300">
          Loading...
        </span>
      </div>
    );
  }

  const getDynamicHref = () => {
    if (!firstname || (!isClient && !isMusician)) return `/roles/${userId}`;
    return isClient
      ? `/create/${userId}`
      : isMusician
      ? `/gigs/${userId}`
      : `/roles/${userId}`;
  };

  return (
    <div className="bg-gray-950 text-white font-sans h-screen overflow-y-scroll snap-mandatory snap-y scroll-smooth">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center snap-start">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source
            src="https://res.cloudinary.com/dsziq73cb/video/upload/v1741577722/gigmeUpload/gww2kwzvdtkx4qxln6qu.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-gray-950"></div>

        {isClientSide && (
          <motion.div
            className="relative z-10 px-8 py-16 bg-white/10 backdrop-blur-md rounded-lg shadow-lg max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1
              className="text-5xl font-extrabold tracking-wide leading-tight text-transparent 
  bg-gradient-to-r from-green-500 via-red-400  bg-clip-text from green-400 to-yellow-400"
            >
              Discover. Create. Perform.
            </h1>
            <p className="text-lg text-gray-300 my-6">
              Join a global community of musicians and music lovers.
            </p>
            {/* {firstname && (
              <Link
                href={getDynamicHref()}
                className="mt-6 px-6 py-3 bg-amber-500 text-gray-900 text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-400 transition clip-link-polygon"
              >
                Get Started
              </Link>
            )} */}
          </motion.div>
        )}
      </section>
      {/* Features Section */}
      <section className="h-screen flex flex-col justify-center items-center snap-start bg-gray-900">
        <div className="text-center">
          <h2
            className="text-4xl font-bold mb-12 text-transparent 
  bg-gradient-to-r from-yellow-600/80   to-pink-400 bg-clip-text"
          >
            Our Features
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                image: postimage,
                title: "Share Your Music",
                description: "Upload and showcase your jam sessions.",
              },
              {
                image: reactimage,
                title: "Engage & React",
                description: "Like, comment, and interact with artists.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 p-8 rounded-xl shadow-md"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  className="mx-auto mb-6"
                  width={100}
                  height={100}
                  priority
                />
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Video Section */}
      <section className="h-screen flex flex-col justify-center items-center snap-start bg-gray-950">
        <div className="text-center">
          <h2
            className="text-4xl font-bold mb-12 text-transparent 
  bg-gradient-to-r from-yellow-500 to-pink-800 bg-clip-text"
          >
            How It Works
          </h2>
          <div className="flex justify-center">
            {!showVideo ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="cursor-pointer relative"
                onClick={() => setShowVideo(true)}
              >
                <Image
                  src={thumbnailImage}
                  alt="Video Thumbnail"
                  className="w-full max-w-3xl rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayIcon className="h-16 w-16 text-gray-200 opacity-75 hover:opacity-100 transition" />
                </div>
              </motion.div>
            ) : (
              <video
                controls
                autoPlay
                className="w-full max-w-3xl rounded-lg shadow-lg"
                onEnded={() => setShowVideo(false)}
              >
                <source
                  src="https://res.cloudinary.com/dsziq73cb/video/upload/v1742520206/ike81qltg0etsoblov4c.mp4"
                  type="video/mp4"
                />
              </video>
            )}
          </div>
        </div>{" "}
        
          <Link
            className="absolute bottom-5 mt-6 px-6 py-1  text-gray-100 text-sm font-semibold rounded-xl  rounded-bl-xl roundedt-l-xl shadow-lg hover:bg-yellow-400 transition animate-bounce flex items-center"
            style={{ fontFamily: fonts[24], backgroundColor: colors[15] }}
            role="button"
            href={getDynamicHref()}
          >
            <SaveAll
              className="h-6 w-6 text-[15px] text-gray-200 hover:text-yellow-400 transition gap-2"
              size="20"
              style={{
                animation: "pulse 2s infinite",

                animationDirection: "normal",
                animationDuration: "2s",
                animationFillMode: "forwards",
                animationIterationCount: "infinite",
              }}
            />{" "}
            Open gigup
          </Link>
      
      </section>{" "}
      <ScrollToTopButton />
      {/* Footer */}
      {!firstname && (
        <footer className="h-screen flex flex-col justify-center items-center bg-gray-900 snap-start">
          <h2 className="text-4xl font-bold mb-4">Ready to Gig?</h2>
          {/* <Link
            href={getDynamicHref()}
            className="px-6 py-2 bg-yellow-500 text-gray-900 text-lg font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition  animate-pulse"
          >
            Join Now
          </Link> */}
          <p className="text-gray-400 mt-6 absolute bottom-10">
            © {new Date().getFullYear()} gigUp. All rights reserved.
          </p>
        </footer>
      )}
    </div>
  );
}
