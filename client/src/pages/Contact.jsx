import React from "react";
import { NewsLetterBox, Title } from "../components";
import { assets } from "../assets/frontend_assets";

function Contact() {
  return (
    <div>

      <div className="text-center text-3xl pt-10 border-t">
        <Title children1={"Contact"} children2={"Us"} />
      </div>

      <div className="flex flex-col justify-center gap-10 my-10 mb-28 md:flex-row">
        <img src={assets.contact_img} alt="contactImage" className="w-full max-w-[480px]" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">413000 Begum peth <br /> 300, Solapur, India</p>
          <p className="text-gray-500">Tel (+91) 0123456789 <br /> Email: mustafasayyed086@gmail.com</p>
          <p className="font-semibold text-xl text-gray-600">Careers at SnapShot</p>
          <p className="text-gray-500">Learn more about our teams and job openings</p>
          <button className="px-8 py-3 border  rounded-sm hover:bg-black hover:text-white cursor-pointer transition-all duration-500 active:bg-gray-800">Explore Jobs</button>
        </div>
      </div>

      <NewsLetterBox />

    </div>
  );
}

export default Contact;
