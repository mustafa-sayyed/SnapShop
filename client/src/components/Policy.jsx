import React from "react";
import { assets } from "../assets/frontend_assets";
import {Title} from "./";

function Policy() {
  return (
    <div>
      <div className="py-8 text-center text-3xl">
        <Title children1={"Our"} children2={"Policy"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt dolorum ipsa
          inventore!
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-around items-center py-20 gap-12 sm:gap-2 text-sm sm:text-base' md:text-lg  text-center">
        <div>
          <img src={assets.exchange_icon} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold">Easy Exchange Policy</p>
          <p>We Offer hassle free Exchange</p>
        </div>
        <div>
          <img src={assets.quality_icon} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold">7 Days Return Policy</p>
          <p>We provide 7 deys free return Policy</p>
        </div>
        <div>
          <img src={assets.support_img} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold">Best Customer Support</p>
          <p>We provide 24/7 customer support</p>
        </div>
      </div>
    </div>
  );
}

export default Policy;
