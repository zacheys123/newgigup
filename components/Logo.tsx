import Image from "next/image";
import Link from "next/link";
import React from "react";

import logo2 from "../public/assets/gdata/png/logo-no-background.png";
const Logo = () => {
  return (
    <Link href="/" className={` flex  hover:cursor-pointer`}>
      <Image
        src={logo2}
        width={23}
        height={55}
        alt="logo"
        className="w-[38px] h-[55px]  md:w-[80px] md:h-[50px]  lg:w-[80px] lg:h-[50px] xl:w-[80px] xl:h-[65px]"
      />
    </Link>
  );
};

export default Logo;
