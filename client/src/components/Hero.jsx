import React, { useEffect, useState } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "./Hero.css";
import { Button } from "./ui/button";
import axios from "axios";

function Hero() {
  const [slides, setSlides] = useState([]);

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

  useEffect(() => {
    fetchSlides();
  }, []);

  return (
    <div className="hero-container">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-wrapper">
              <img
                src={slide.bannerImage}
                className="slide-image"
                alt={slide.bannerTitle || "Slides"}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="slide-overlay">
                <div className="slide-content">
                  <h2 className="slide-title">{slide.bannerTitle}</h2>
                  {/* <p className="slide-description">{slide.desc}</p> */}
                  {slide.bannerLink ? (
                    <Button
                      size="lg"
                      className="bg-red-500 hover:bg-red-600 cursor-pointer rounded-full p-6"
                    >
                      Explore More
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Hero;
