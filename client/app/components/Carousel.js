"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const banners = [
  "/banners/grand-opening.png",
  "/banners/order-now.png",
  "/banners/burger-discount.png",
  "/banners/pizza-discount.png",
];

const Carousel = () => {
  return (
    <div className="bg-gray mt-20 h-40 sm:h-[calc(100vh-80px)]">
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation={true}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-full">

        {banners.map((src, i) => (

          <SwiperSlide key={i} 
          className="w-full h-full">
            <Image
              src={src}
              alt={`banner-${i}`}
              fill
              className="object-contain"/>
          </SwiperSlide>
          
        ))}

      </Swiper>
    </div>
  );
};

export default Carousel;
