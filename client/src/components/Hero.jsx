import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function Hero() {
  const [slides, setSlides] = useState([]);
  const [api, setApi] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  async function fetchSlides() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/featured-banners/active`
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
  }, [api]);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    onSelect();
  }, [api, onSelect]);

  return (
    <div className="w-full relative group">
      <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide._id}>
              <div className="relative overflow-hidden">
                <img
                  src={slide.bannerImage}
                  className="h-[50vh] md:h-[75vh] xl:h-[90vh] w-full object-cover"
                  alt={slide.bannerTitle}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 sm:px-12 md:px-20 lg:px-28 max-w-3xl">
                    <span className="inline-block px-4 py-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full mb-4">
                      New Collection
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                      {slide.bannerTitle || "Discover Your Style"}
                    </h1>
                    <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 max-w-lg drop-shadow">
                      {slide.bannerDescription || "Explore our latest collection of premium fashion items curated just for you."}
                    </p>
                    <Link
                      to="/collection"
                      className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                    >
                      Shop Now
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-4 md:left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 size-10 md:size-12 bg-white/90 hover:bg-white border-0 shadow-lg" />
        <CarouselNext className="right-4 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 size-10 md:size-12 bg-white/90 hover:bg-white border-0 shadow-lg" />
        
        <div className="absolute w-full flex items-center justify-center gap-2 bottom-6 md:bottom-8">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                selectedIndex === index 
                  ? "w-8  bg-white" 
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}

export default Hero;
