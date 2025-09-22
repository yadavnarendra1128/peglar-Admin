import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "api/services/base.service";
import Image from "next/image";
import React from "react";

interface GuruCardProps {
  item: {
    img: string;
    name: string;
    experience: string;
    experiencetime: string;
    about: string;
  };
}

const { data, isLoading } = useQuery({
  queryKey: ["categoriesData"],
  queryFn: fetchCategory,
  select: (res) => res.data,
});

const GuruCard: React.FC<GuruCardProps> = ({ item }) => {
  return (
    <div className="max-w-[393px] md:max-w-[220px] lg:max-w-[350px] xl:max-w-[400px] min-[1410px]:max-w-[474px] h-[257px] md:max-lg:h-[313px] max-[1410px]:mx-auto lg:h-[452px] xl:h-[522px] min-[1410px]:h-[622px] w-full bg-[url('/img/guru-cards-mobile-bg.png')] md:bg-[url('/img/guru-cards-tab-bg.png')] lg:bg-[url('/img/guru-cards-bg.png')] bg-contain xl:bg-cover bg-center xl:bg-[100%_100%] bg-no-repeat lg:p-8 flex flex-col items-start md:items-center justify-center px-7 py-0 sm:max-md:p-5 lg:py-5">
      <div className="flex md:flex-col max-md:h-[78px] items-center max-md:gap-[18px]">
        <div className="md:pt-3 min-[1410px]:pt-0"> {data.id}</div>
        <div className="flex flex-col md:items-center">
          <p className="md:mt-3 xl:mt-5 min-[1410px]:mt-[34px] text-[#AB185A] text-[16px] lg:text-[32px] leading-[130%] font-gilroyBold">
            {data.name}
          </p>
          <p className="md:mt-1 xl:mt-3 min-[1410px]:mt-[26px] text-[rgba(121,42,77,0.90)] text-[10px] lg:text-base leading-[130%] font-gilroyRegular uppercase tracking-[2.4px]">
            {data.updatedAt}
          </p>
          <p className="md:mt-1 min-[1410px]:mt-3 text-[rgba(121,42,77,0.90)] text-sm lg:text-[26px] leading-[130%] font-gilroyBold">
            {data.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuruCard;
