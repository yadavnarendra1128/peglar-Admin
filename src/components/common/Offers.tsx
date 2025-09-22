"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function Offers() {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    infinite: true,
    speed: 4000,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //       infinite: true,
    //     },
    //   },
    //   {
    //     breakpoint: 800,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 2,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 1,
    //       infinite: true,
    //     },
    //   },
    // ],
  };

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const offers = [
    {
      img: "/img/offer/offer1.png",
      text: (
        <>
          <p>Unlock the Secrets of the Stars with Astrovistaar</p>
          <p>✨Special Offer: Buy any 3 for Rs. 999/-✨</p>
        </>
      ),
    },
    {
      img: "/img/offer/offer2.png",
      text: (
        <>
          <p>Discover Your True Potential with Astrovistaar</p>
          <p>✨Exclusive Deal: Get Analysis for Just Rs. 299/-✨</p>
        </>
      ),
    },
    {
      img: "/img/offer/offer3.png",
      text: (
        <>
          <p>Navigate Life’s Mysteries with Astrovistaar</p>
          <p>✨Limited Time: 50% Off on All Premium Reports✨</p>
        </>
      ),
    },
  ];

  return (
    <>
      <section className="relative md:px-14 lg:px-64">
        <p className="text-[#AB185A] text-[32px] lg:text-[40px] text-center md:text-left font-salernomi md:my-6 lg:my-12">
          Top Offers
        </p>
        <div className="slider-container-2">
          <Slider ref={sliderRef} {...settings}>
            {offers.map((i, index) => (
              <div key={index} className="w-[100vw] relative">
                <img src={i.img} alt={`Slide ${index}`} className="offer-img" />
                <div className="text-[#FFF5FA] text-[16px] md:text-[24px] lg:text-[40px] font-salernomi absolute z-10 bottom-[50px] md:bottom-[40px] lg:bottom-[100px] w-full flex flex-col items-center">
                  {i.text}
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="w-full text-center hidden md:flex flex-row justify-center md:gap-[42rem] lg:gap-[76rem] xl:gap-[90rem] absolute md:bottom-[70px] lg:bottom-[145px] left-0">
          <button
            className="button border-2 border-[#BA6C8F] rounded-full"
            onClick={previous}
          >
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.4003 15.5147L22 22.1144L20.1144 24L11.6291 15.5147L20.1144 7.0295L22 8.9151L15.4003 15.5147Z"
                fill="#BA6C8F"
                fillOpacity="0.9"
              />
            </svg>
          </button>
          <button
            className="button border-2 border-[#BA6C8F] rounded-full"
            onClick={next}
          >
            <svg
              width="33"
              height="32"
              viewBox="0 0 33 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5997 16.4853L11 9.88561L12.8856 8L21.3709 16.4853L12.8856 24.9705L11 23.0849L17.5997 16.4853Z"
                fill="#BA6C8F"
                fillOpacity="0.9"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
