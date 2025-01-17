"use client";
import React from "react";

import useStore from "@/app/zustand/useStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarProps {
  picture: string;
  posts: string;
  firstname: string;
}
const AvatarComponent = ({ picture, posts, firstname }: AvatarProps) => {
  const { setLogout } = useStore();

  return (
    <div className="" onClick={() => setLogout(true)}>
      <Avatar>
        <AvatarImage
          src={picture}
          className={posts}
          alt={firstname?.split("")[0]}
        />

        <AvatarFallback className={posts}>
          {firstname?.split("")[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarComponent;
