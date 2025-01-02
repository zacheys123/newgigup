import React from "react";
import Image from "next/image";
import Link from "next/link"; // Ensure this is imported correctly
import { CircularProgress } from "@mui/material";
import { Button } from "./ui/button";

interface UsersButtonProps {
  myonClick: () => void;
  title: string;
  myclassName?: string;
  myimage?: string;
  myspan?: string;
  mylink?: string;
  myloading: boolean;
  mydisabled?: boolean;
  mygigip?: string; // If gigip is optional, add it as well
}

const UsersButton: React.FC<UsersButtonProps> = ({
  myonClick,
  title,
  myclassName,
  myimage,
  myspan,
  mylink,
  myloading,
  mydisabled,
}) => {
  return (
    <>
      {mylink ? (
        <div>
          <Link className={myclassName} href={mylink}>
            {title}
          </Link>
        </div>
      ) : (
        <>
          {myimage && myspan ? (
            <button onClick={myonClick} className={myclassName}>
              <Image
                src={myimage}
                className="object-fit md:h-15 md:w-18 w-10 h-10 md:ml-4"
                alt="google play"
              />
              <div className="flex flex-col mt-1 justify-center items-center px-1">
                <span className="text-slate-800 text-sm md:text-1xl ">
                  {myspan}
                </span>
                <span className="text-slate-800 text-sm md:font-bold md:text-1xl">
                  {title}
                </span>
              </div>
            </button>
          ) : (
            <Button
              variant="default"
              disabled={mydisabled}
              type="button"
              onClick={myonClick}
              className={myclassName}
            >
              {!myloading ? (
                title
              ) : (
                <CircularProgress size="30px" sx={{ color: "white" }} />
              )}
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default UsersButton;
