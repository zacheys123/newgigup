"use client";
import React from "react";
import { authReducer } from "../../reducers/authReducers";
import { createContext, useContext, useMemo, useReducer } from "react";
import { useBannedRedirect } from "@/hooks/useBannedRefirect";
import { useInitialBanCheck } from "@/hooks/useInitialBanStatus";

export const initialState = {
  toggle: false,
  loading: false,
  showPosts: false,
  showComments: false,
  messages: [],
  loggedUser: {},
  chat: {},
};

const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  // Check ban status immediately on first render
  useInitialBanCheck();

  // Then set up ongoing ban status monitoring
  useBannedRedirect();

  const [userState, setUserState] = useReducer(authReducer, initialState);
  const value = useMemo(() => {
    return { userState, setUserState };
  }, [userState]);

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
