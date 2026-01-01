import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Dot } from "lucide-react";
import { Button } from "./ui/button";

function Hero() {
  const [slides, setSlides] = useState([]);
  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  async function fetchSlides() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/featured-banner/active`
      );
      if (res.data.success) {
        setSlides(res.data.banners);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    fetchSlides();
    if (!api) return;
    api.on("select", onSelect);
  }, []);
  
  return (
    <div className="w-full">
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide._id}>
              <div className="">
                <img
                  src={slide.bannerImage}
                  className="h-[40vh] md:h-[75vh] xl:h-[85vh] object-fill w-full"
                  alt={slide.bannerTitle}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16 cursor-pointer size-12" />
        <CarouselNext className="mr-16 cursor-pointer size-12" />
        <div className="absolute w-full flex items-center justify-center gap-1 bottom-5">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${
                selectedIndex == index ? "w-8" : ""
              } bg-white rounded-full h-3 w-3 cursor-pointer`}
              onClick={() => api.scrollTo(index)}
            ></button>
          ))}
        </div>
      </Carousel>
    </div>
  );
}

export default Hero;
