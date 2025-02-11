"use client";
import React from "react";
import { authReducer } from "../../reducers/authReducers";
import { createContext, useContext, useMemo, useReducer } from "react";
import { SocketProvider } from "./SocketContext"; // Import the SocketProvider

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
  const [userState, setUserState] = useReducer(authReducer, initialState);
  const value = useMemo(() => {
    return { userState, setUserState };
  }, [userState]);

  return (
    <SocketProvider>
      <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
    </SocketProvider>
  );
};
export const useGlobalContext = () => useContext(GlobalContext);
