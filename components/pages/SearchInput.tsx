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
    debounce((value: string) => setSearchQuery(value), 100), // 300ms debounce
    []
  );

  return (
    <input
      autoComplete="off"
      onChange={(ev) => handleInputChange(ev.target.value)}
      value={searchQuery}
      className="w-[70%] mx-1  bg-inherit text-neutral-300  font-bold focus-within:ring-0 z-50 outline-none placeholder-gray-400 p-3 -0 text-[13px] my-6"
      id="search"
      type="text"
      data-autofocus
      placeholder="Find anyone/username/instrument..."
      required
      onKeyDown={() => searchFunc(users?.users || [], searchQuery)}
    />
  );
};

export default SearchInput;
