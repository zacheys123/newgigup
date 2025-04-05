"use client";
import React, { useCallback } from "react";
import { debounce } from "lodash";
import useStore from "@/app/zustand/useStore";
import { searchFunc } from "@/utils";
import { useAllUsers } from "@/hooks/useAllUsers";

const SearchInput = () => {
  const { searchQuery, setSearchQuery } = useStore();
  const { users } = useAllUsers();

  const handleInputChange = useCallback(
    debounce((value: string) => setSearchQuery(value), 100),
    []
  );

  return (
    <input
      autoComplete="off"
      onChange={(ev) => handleInputChange(ev.target.value)}
      value={searchQuery}
      className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none text-sm md:text-base font-medium tracking-wide"
      id="search"
      type="text"
      data-autofocus
      placeholder="Find anyone/username/instrument..."
      required
      onKeyDown={() => searchFunc(users?.users || [], searchQuery)}
    />
  );
};

export default SearchInput; // Fixed: Using default export
