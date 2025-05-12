"use client";
import { useAuth } from "@clerk/nextjs";
import useStore from "@/app/zustand/useStore";
import { searchFunc } from "@/utils";
import { UserProps } from "@/types/userinterfaces";
import MainUser from "./MainUser";
import { useAllUsers } from "@/hooks/useAllUsers";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { FiSearch, FiUsers } from "react-icons/fi";

const SearchComponent = () => {
  const { userId } = useAuth();
  const { searchQuery } = useStore();
  const { users } = useAllUsers();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when search changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchQuery]);

  const filteredUsers = users
    ? searchFunc(users.users, searchQuery)?.filter(
        (user: UserProps) => user.clerkId !== userId
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      <div
        ref={containerRef}
        className="overflow-y-auto h-full w-full py-6 px-4 sm:px-8 pb-24 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {/* Search Summary */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6 px-2"
        >
          <div className="flex items-center gap-2">
            <FiUsers className="text-gray-400 text-xl" />
            <h2 className="text-xl font-semibold text-white">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "Result" : "Results"}
            </h2>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2 text-gray-400">
              <FiSearch />
              <span className="text-sm">{"`${searchQuery}`"}</span>
            </div>
          )}
        </motion.div>

        {/* User Grid */}
        <AnimatePresence>
          {filteredUsers.length > 0 && searchQuery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredUsers.map((user: UserProps, index: number) => (
                <motion.div
                  key={user._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.03,
                  }}
                >
                  <MainUser {...user} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-[50vh] text-gray-400"
            >
              <div className="relative mb-6">
                <FiSearch className="text-6xl opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-500 animate-spin-slow"></div>
                </div>
              </div>
              <h3 className="text-2xl font-medium mb-2 text-center">
                {searchQuery ? "No matches found" : "Search for users"}
              </h3>
              <p className="text-sm text-center max-w-md">
                {searchQuery
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Start typing in the search bar to find musicians or clients"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {!users && !searchQuery && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 rounded-2xl p-5 h-64 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 h-8 bg-gray-700 rounded-lg"></div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="h-16 bg-gray-700 rounded-lg"></div>
                  <div className="h-16 bg-gray-700 rounded-lg"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchComponent;
