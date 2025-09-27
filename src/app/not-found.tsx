"use client";
import React from "react";

export default function NotFoundPage() {
  return (
    <>
      <section className="bg-[url('/img/paperboard-yellow-texture.png')] min-h-screen bg-top bg-cover bg-no-repeat mx:px-[23px]">
        <div className="h-[100vh] flex flex-col justify-center">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-[40px] md:text-[64px] font-salernomi text-primary">
              Oops!
            </h1>
            <h3 className="text-[20px] md:text-[32px] font-gilroyMedium text-primary/70">
              This Page is Out of Orbit.
            </h3>
            <p className="text-[16px] text-center md:text-[20px] font-gilroyMedium font-semibold text-[#BA6C8FE5]">
              Looks like you’ve wandered off the path. Don’t worry—we’ll help
              you find your way!
            </p>
          </div>
          <div className="p-0.5 max-w-[185px] h-[45px] sm:max-w-[185px] lg:max-w-[224px] mx-auto mt-7 sm:mt-10 sm:h-[50px] lg:h-[60px] w-full relative group duration-300">
            <button
              className="z-10 h-full w-full bg-[url('/img/paperboard-yellow-texture.png')] relative text-[#AB185A] text-[20px] lg:text-2xl font-gilroyMedium font-semibold leading-[31.20px] duration-300 flex flex-row items-center justify-center gap-3"
              onClick={() => (window.location.href = "/")}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.82843 7.00088H16V9.00088H3.82843L9.1924 14.3648L7.7782 15.779L0 8.00088L7.7782 0.222656L9.1924 1.63687L3.82843 7.00088Z"
                  fill="#AB185A"
                />
              </svg>
              <p>Go to home</p>
            </button>
            <div className="p-[1px]  h-full w-full group-hover:w-10 group-hover:h-7 left-0 top-0 absolute -translate-y-0 mix-blend-color-burn bg-[#AB185A] duration-300"></div>
            <div className="p-[1px] right-0 bottom-0 w-10  h-7 group-hover:opacity-100 opacity-0 absolute mix-blend-color-burn bg-[#AB185A] duration-500"></div>
          </div>
        </div>
      </section>
    </>
  );
}
