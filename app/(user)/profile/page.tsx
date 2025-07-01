"use client";

import Musicians from "@/components/pages/Musicians";
import RouteProfile from "@/components/userprofile/RouteProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, loading: isLoading } = useCurrentUser();
  const { gigs } = useAllGigs();
  const router = useRouter();
  console.log(gigs);
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64 rounded-lg bg-gray-700" />
            <Skeleton className="h-6 w-48 rounded-lg bg-gray-700" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg bg-gray-700" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.header
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
                Profile Dashboard
              </h1>
              <p className="text-lg text-gray-300 mt-2">
                Welcome back,{" "}
                <span className="font-medium text-white">
                  {user?.user?.firstname}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Icons.user className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">
                  Member since
                </p>
                <p className="text-xs text-amber-400">
                  {new Date(user?.user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Profile Navigation */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 p-1">
            <RouteProfile />
          </div>
        </motion.section>

        {!user?.user?.isClient && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <Musicians {...user?.user} />
            </div>
          </motion.section>
        )}

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Icons.activity className="h-6 w-6 text-amber-400" />
            Your Activity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Icons.gig className="h-5 w-5" />,
                title: "Total Gigs",
                value: user?.user?.isClient
                  ? gigs?.filter((g: GigProps) => g?.postedBy?._id).length
                  : gigs?.filter((g: GigProps) => g?.bookedBy?._id).length,
                change: "+12%",
              },
              {
                icon: <Icons.earnings className="h-5 w-5" />,
                title: "Earnings",
                value: user?.user?.earnings?.toFixed(1),
                change: "+8%",
              },
              {
                icon: <Icons.connections className="h-5 w-5" />,
                title: "Connections",
                value:
                  user?.user?.followers.length + user?.user?.followings.length,
                change: "+5",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-xl p-6 border border-gray-700/50 hover:border-amber-400/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                    {stat.icon}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-900/30 text-green-400">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-400 text-sm mt-4">{stat.title}</h3>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default ProfilePage;

import { SVGProps } from "react";
import { useAllGigs } from "@/hooks/useAllGigs";
import { GigProps } from "@/types/giginterface";

export const Icons = {
  // User profile icon
  user: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  // Users group icon
  users: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),

  // Activity/metrics icon
  activity: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),

  // Gigs/jobs icon
  gig: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),

  // Earnings/money icon
  earnings: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),

  // Connections/network icon
  connections: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  ),
};
