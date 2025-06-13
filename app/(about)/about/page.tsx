"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiStar,
  FiCalendar,
} from "react-icons/fi";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function AboutPage() {
  const user = useCurrentUser();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-800 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            The Premium Booking Platform <br />
            for{" "}
            <span className="text-yellow-300">World-Class Entertainment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl max-w-3xl mx-auto mb-10"
          >
            Trusted by luxury venues and Fortune 500 companies to source
            exceptional talent with zero hassle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {user ? (
              <Link
                href={
                  user?.user?.firstLogin &&
                  !user?.user?.onboardingComplete &&
                  !user?.user?.isAdmin
                    ? "/onboarding"
                    : "/dashboard"
                }
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 inline-block"
              >
                Access Your Dashboard →
              </Link>
            ) : (
              <Link
                href="/signup"
                className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 inline-block"
              >
                Get Started Today
              </Link>
            )}
          </motion.div>
        </div>

        {/* Animated decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen"></div>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white py-8 shadow-sm"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-900 mb-2">500+</div>
            <div className="text-gray-600">Premium Venues</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900 mb-2">2,000+</div>
            <div className="text-gray-600">Top Performers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900 mb-2">98%</div>
            <div className="text-gray-600">Booking Success</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-900 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </motion.section>

      {/* Value Proposition */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Why Leading Businesses Choose Us
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We solve the biggest challenges in entertainment booking for
            high-volume venues
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-12"
        >
          {[
            {
              icon: <FiCheckCircle className="w-8 h-8" />,
              title: "Vetted Talent Pool",
              desc: "Every performer undergoes rigorous screening. 85% acceptance rate ensures quality.",
            },
            {
              icon: <FiClock className="w-8 h-8" />,
              title: "60-Second Booking",
              desc: "Our matching algorithm finds perfect acts faster than human recruiters.",
            },
            {
              icon: <FiDollarSign className="w-8 h-8" />,
              title: "Cost Control",
              desc: "Set budget parameters and receive only qualified proposals.",
            },
            {
              icon: <FiStar className="w-8 h-8" />,
              title: "Exclusive Talent",
              desc: "Access performers who don't work with traditional agencies.",
            },
            {
              icon: <FiCalendar className="w-8 h-8" />,
              title: "Last-Minute Rescue",
              desc: "Emergency booking network for cancellations (avg. 2.5hr response).",
            },
            {
              icon: <FiCheckCircle className="w-8 h-8" />,
              title: "Legal Protection",
              desc: "Contracts, insurance verification, and dispute resolution included.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500"
            >
              <div className="text-blue-600 mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              {`Don't take our word for it - hear from venues that transformed
              their booking process`}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-xl font-bold mr-4">
                  M
                </div>
                <div>
                  <div className="font-bold">Michael R.</div>
                  <div className="text-blue-200">
                    Entertainment Director, Luxe Nightclub
                  </div>
                </div>
              </div>
              <p className="text-lg italic">
                {`"We reduced our booking admin time by 70% while getting higher
                quality DJs. The automated contracts alone save us 15 staff
                hours weekly."`}
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 fill-current" />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-xl font-bold mr-4">
                  S
                </div>
                <div>
                  <div className="font-bold">Sarah K.</div>
                  <div className="text-blue-200">
                    Corporate Events Manager, Fortune 500
                  </div>
                </div>
              </div>
              <p className="text-lg italic">
                {`"Found a Grammy-nominated jazz ensemble for our executive
                retreat with 48 hours notice. Our leadership team was blown
                away."`}
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 fill-current" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6">
            Ready to Elevate Your Events?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the platform that delivers exceptional entertainment with
            unprecedented efficiency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link
                href={
                  user?.user?.firstLogin &&
                  !user?.user?.onboardingComplete &&
                  !user?.user?.isAdmin
                    ? "/onboarding"
                    : "/dashboard"
                }
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/demo"
                  className="bg-transparent hover:bg-white hover:bg-opacity-10 border-2 border-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
                >
                  Request Demo
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-blue-100">
            No credit card required • Cancel anytime
          </p>
        </motion.div>
      </section>
    </div>
  );
}
