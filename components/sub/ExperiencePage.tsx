"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSubscription } from "@/hooks/useSubscription";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Video } from "lucide-react";

const ExperienceGigupPage = () => {
  const { userId } = useAuth();
  const { subscription } = useSubscription(userId as string);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subscription !== undefined) {
      const timeout = setTimeout(() => setLoading(false), 800); // brief shimmer
      return () => clearTimeout(timeout);
    }
  }, [subscription]);

  const tier = subscription?.subscription?.tier || "free";
  const isPro = tier !== "free";

  const perks = isPro
    ? [
        "Unlimited gig bookings",
        "Priority support & booking",
        "Exclusive access to premium artists",
        "Advanced analytics & tracking",
        "Custom branding for your gigs",
      ]
    : [
        "Book 3 gigs per month",
        "Limited access to select artists",
        "Basic support",
        "Basic tracking tools",
      ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4 py-8 md:px-6 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-purple-400 to-yellow-400 text-center md:text-left">
          Welcome to GiGup Experience
        </h1>

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="w-full h-[250px] md:h-[450px] bg-white/10 rounded-lg"></div>
            <div className="h-6 bg-white/10 rounded w-1/2"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
        ) : (
          <>
            {/* Video Demo */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Video className="w-6 h-6" />
                How GiGup Works
              </h2>
              <div className="w-full rounded-xl overflow-hidden shadow-xl border border-white/10">
                <video
                  controls
                  className="w-full h-[250px] md:h-[450px] object-cover"
                  src={`https://res.cloudinary.com/dsziq73cb/video/upload/v1742941037/gigmeUpload/pu3aioizpuqnbawnirwh.mp4`}
                  poster="/images/demo-cover.jpg"
                />
              </div>
            </section>

            {/* Booking Info */}
            <section className="mb-12 space-y-4 text-sm md:text-base text-gray-300">
              <h2 className="text-2xl font-bold mb-2">Booking a Gig</h2>
              <p>
                Browse artist profiles, explore videos, and select the right
                performer for your event. Once ready, hit{" "}
                <strong>{`"Book Now"`}</strong> and fill in the details.
              </p>
              <p>
                {`Artists will confirm or decline, and you'll be notified in
                real-time.`}
              </p>
              <p>
                Everything is trackable in your dashboard — simple, elegant, and
                fast.
              </p>
            </section>

            {/* Plan Info & Perks */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">
                Your Current Plan:{" "}
                <span className="bg-gradient-to-r from-purple-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent uppercase">
                  {tier}
                </span>
              </h2>
              <div className="bg-white/5 p-6 rounded-lg border border-white/10 shadow-lg">
                <ul className="space-y-3">
                  {perks.map((perk, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-white/90"
                    >
                      <CheckCircle className="w-5 h-5 text-teal-300" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* CTA */}
            {!isPro && (
              <div className="text-center mt-10">
                <Link
                  href="/upgrade"
                  className="inline-block px-6 py-4 bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
                >
                  Upgrade to Pro & Unlock More
                </Link>
              </div>
            )}
          </>
        )}
      </motion.div>
    </main>
  );
};

export default ExperienceGigupPage;
