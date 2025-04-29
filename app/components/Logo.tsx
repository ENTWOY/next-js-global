import React from "react";
import { b_neue } from "../ui/fonts";
import { FaReact } from "react-icons/fa";

const Logo = () => {
  return (
    <div className={`${b_neue.className} flex flex-row items-center leading-none text-white`}>
      <FaReact className="h-20 w-20 rotate-[15deg]" />
      <p className="text-[30px] ml-3">AnjrotDev</p>
    </div>
  );
};

export default Logo;
