import React from "react";
import { assets } from "../assets/frontend_assets";

function Hero() {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex justify-center items-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="text-sm md:text-base font-medium">Our BestSellers</p>
          </div>
          <h1 className="font-prata text-3xl lg:text-5xl sm:py-3 leading-relaxed">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">Shop Now</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
        </div>
      </div>
      <img className="w-full sm:w-1/2" src={assets.hero_img} alt="" />
    </div>
  );
}

export default Hero;
