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
  const { setLogout, setName } = useStore();
  const showName = () => {
    setName(true);
  };
  const RemoveName = () => {
    setName(false);
  };
  return (
    <div
      className=""
      onClick={() => setLogout(true)}
      onMouseOver={showName}
      onMouseLeave={RemoveName}
    >
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
