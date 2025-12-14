import React from "react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import Slide1 from "../assets/images/AlfanzinaLighthouse.jpg";
import Slide2 from "../assets/images/BodieCalifornia.jpg";
import Slide3 from "../assets/images/CentralParkAutumn.jpg";
import Slide4 from "../assets/images/HalfDomeYosemite.jpg";
import Slide5 from "../assets/images/MontBlancMassif.jpg";
import Slide6 from "../assets/images/ParalympicsParis.jpg";
import Slide7 from "../assets/images/QuebecDuck.jpg";
import Slide8 from "../assets/images/ShiShiBeach.jpg";
import Slide9 from "../assets/images/TajMahalReflection.jpg";
import "./Hero.css";
import { Button } from "./ui/button";

function Hero() {
  const slides = [
    { img: Slide1, title: "Alfanzina Lighthouse", desc: "Explore breathtaking coastal views" },
    { img: Slide2, title: "Bodie California", desc: "Discover historic ghost towns" },
    { img: Slide3, title: "Central Park Autumn", desc: "Experience seasonal beauty" },
    { img: Slide4, title: "Half Dome Yosemite", desc: "Adventure awaits in nature" },
    { img: Slide5, title: "Mont Blanc Massif", desc: "Reach new heights" },
    { img: Slide6, title: "Paralympics Paris", desc: "Celebrate human achievement" },
    { img: Slide7, title: "Quebec Duck", desc: "Wildlife in natural habitat" },
    { img: Slide8, title: "Shi Shi Beach", desc: "Coastal paradise awaits" },
    { img: Slide9, title: "Taj Mahal Reflection", desc: "Timeless architectural wonder" },
  ];

  return (
    <div className="hero-container">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{clickable: true }}
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
                src={slide.img} 
                className="slide-image" 
                alt={slide.title}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="slide-overlay">
                <div className="slide-content">
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-description">{slide.desc}</p>
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 cursor-pointer rounded-full p-6">Explore More</Button>
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
