"use client";
import { useAuth } from "@clerk/nextjs";
import useStore from "@/app/zustand/useStore";
import { searchFunc } from "@/utils";
import { UserProps } from "@/types/userinterfaces";
import MainUser from "./MainUser";
import { useAllUsers } from "@/hooks/useAllUsers";
import { motion } from "framer-motion";

const SearchComponent = () => {
  const { userId } = useAuth();
  const { searchQuery } = useStore();
  const { users } = useAllUsers();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full pt-40px h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="overflow-y-auto h-full w-full py-4 px-2 sm:px-6 pb-[106px]">
        <div className="pt-[40px]  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2">
          {users &&
            searchFunc(users?.users, searchQuery)
              .filter((user: UserProps) => user.clerkId !== userId)
              .map((user: UserProps, index: number) => (
                <motion.div
                  key={user?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <MainUser {...user} />
                </motion.div>
              ))}
        </div>

        {users && searchFunc(users?.users, searchQuery).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-gray-500"
          >
            <div className="text-2xl mb-2">No results found</div>
            <div className="text-sm">Try a different search term</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchComponent; // Fixed: Using default export
