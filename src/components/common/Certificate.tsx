import Image from "next/image";
import React from "react";

const Certificate: React.FC = () => {
  return (
    <div className="w-full max-w-[361px] max-sm:mx-auto sm:max-w-[281px] lg:max-w-[50.833vw] h-[255px] sm:h-[198px] lg:h-[35.556vw] 2xl:max-w-[732px] 2xl:h-[512px] bg-[url('/img/certificate-bg.png')] bg-center bg-contain bg-no-repeat flex flex-col justify-center items-center">
      <Image
        src="/img/certificate-logo.png"
        alt="logo"
        width={124}
        height={96}
        className="w-[53px] sm:w-[41px] lg:w-[8.611vw] 2xl:w-[124px]"
      />
      <h2 className="text-[rgba(121,42,77,0.90)] text-[15.162px] sm:text-[11.811px] lg:text-[1.667vw] 2xl:text-[24px] font-salernomi font-normal leading-[160%] lg:-mt-3">
        Certficate of Completion
      </h2>
      <p className="text-[rgba(186,108,143,0.90)] font-poppins text-[5.776px] sm:text-[4.499px] lg:text-[0.833vw] 2xl:text-xs font-normal leading-[160%]">
        This is to certify that
      </p>
      <h2 className="text-[#AB185A] text-[17.328px] !sm:text-[13.498px] lg:text-[1.944vw] 2xl:text-[28px] font-salernomi font-normal leading-[160%] lg:-mt-2">
        Sample Name
      </h2>
      <p className="text-[rgba(186,108,143,0.90)] font-poppins text-[5.776px] sm:text-[4.499px] lg:text-[0.833vw] 2xl:text-xs font-normal leading-[160%] max-w-[157px] sm:max-w-[122px] lg:max-w-[45%] w-full text-center">
        is hereby awarded this certificate by Astro Vistaar in July 2023 in
        recognition of completing the
      </p>
      <h2 className="text-[rgba(121,42,77,0.90)] text-[17.328px] sm:text-[13.498px] lg:text-[1.944vw] 2xl:text-[28px] font-salernomi font-normal leading-[160%] lg:-mt-1">
        “Complete Numerology Course”
      </h2>
      <div className="flex items-center mt-1 justify-between max-w-[85%] max-sm:-mt-1 sm:max-w-[70%] w-full">
        <div className="flex flex-col items-center w-full max-w-[90px] lg:max-w-[10.417vw] 2xl:max-w-[150px]">
          <Image
            src="/img/trainer-signature.png"
            alt="name"
            width={26}
            height={26}
          />
          <p className="text-[rgba(121,42,77,0.90)] text-[6.498px] sm:text-[5.062px] lg:text-[1.111vw] 2xl:text-base font-normal font-poppins leading-normal lg:-mt-1">
            Name
          </p>
          <p className="text-[rgba(186,108,143,0.90)] text-[4.332px] sm:text-[3.374px] lg:text-[0.833vw] 2xl:text-xs font-normal font-poppins leading-normal lg:-mt-1">
            Trainer
          </p>
        </div>
        <Image
          src="/img/iso-certification.png"
          alt="certification-image"
          width={100}
          height={134}
          className=" w-10 sm:w-[31px] lg:w-[6.944vw] 2xl:w-[100px]"
        />
        <div className="flex flex-col items-center w-full max-w-[90px] lg:max-w-[10.417vw] 2xl:max-w-[150px]">
          <Image
            src="/img/authirized-signatory.png"
            alt="name"
            width={26}
            height={26}
          />
          <p className="text-[rgba(121,42,77,0.90)] text-[6.498px] sm:text-[5.062px] lg:text-[1.111vw] 2xl:text-base font-normal font-poppins leading-normal lg:-mt-1">
            Yagya Sachdeva
          </p>
          <p className="text-[rgba(186,108,143,0.90)] text-[4.332px] sm:text-[3.374px] lg:text-[0.833vw] 2xl:text-xs font-normal font-poppins leading-normal lg:-mt-1">
            Authorized Signatory
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
