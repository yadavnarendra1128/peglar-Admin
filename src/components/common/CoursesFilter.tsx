// import { ReactNode, useEffect, useState } from "react";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@nextui-org/react";
// import { DropdownIcon, FilterIcon, LiveIcon, RecordedIcon } from "./Icons";

// type Option = {
//   label: string;
//   icon?: ReactNode;
//   onClick?: () => void;
// };

// type DropDownProps = {
//   handler: ReactNode;
//   options: Option[];
// };

// export default function CoursesFilter() {
//   const options = [
//     {
//       label: "Live",
//       icon: <LiveIcon />,
//       onClick: () => console.log("Live clicked"),
//     },
//     {
//       label: "Recorded",
//       icon: <RecordedIcon />,
//       onClick: () => console.log("Recorded clicked"),
//     },
//   ];

//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (isPopoverOpen) {
//         setIsPopoverOpen(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [isPopoverOpen]);

//   return (
//     <div className="text-right">
//       <Popover
//         isOpen={isPopoverOpen}
//         onOpenChange={(open) => setIsPopoverOpen(open)}
//       >
//         <PopoverTrigger>
//           <button className="sm:flex sm:items-center sm:justify-center sm:h-[46px] sm:border sm:rounded-[50px] sm:font-gilroyMedium sm:font-semibold sm:text-[20px] sm:leading-[100%] sm:hover:border-[rgba(171,24,90,0.50)] sm:hover:bg-[rgba(171,24,90,0.10)] sm:hover:text-[rgba(121,42,77,0.90)] sm:duration-500 sm:transition sm:ease-in-out sm:border-[rgba(78,78,78,0.50)] sm:bg-transparent group sm:text-[#4E4E4E] sm:px-8">
//             <span className="max-sm:hidden">Filter</span>
//             <DropdownIcon />
//             <FilterIcon />
//           </button>
//         </PopoverTrigger>
//         <PopoverContent
//           className="w-[135px] z-[999] origin-top-right rounded-xl border bg-[url('/img/dropdown-bg.png')] bg-center bg-cover mt-2 px-3 py-4 text-[#AB185A] transition duration-100 ease-out font-gilroyBold focus:outline-none"
//         >
//           {options.map((option, index) => (
//             <div key={index}>
//               <button
//                 onClick={option.onClick}
//                 className="flex items-center gap-2 group w-full text-left hover:text-[#560027] transition duration-500 ease-in-out"
//               >
//                 {option.icon && <span>{option.icon}</span>}
//                 {option.label}
//               </button>
//               {index < options.length - 1 && (
//                 <div className="w-full bg-[#AB185A]/30 mix-blend-color-burn h-[2px] my-2"></div>
//               )}
//             </div>
//           ))}
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }






import { ReactNode, useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { DropdownIcon, FilterIcon, LiveIcon, RecordedIcon } from "./Icons";

type Option = {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
};

type DropDownProps = {
  handler: ReactNode;
  options: Option[];
};

export default function CoursesFilter() {
  const options = [
    {
      label: "Live",
      icon: <LiveIcon />,
      onClick: () => console.log("Live clicked"),
    },
    {
      label: "Recorded",
      icon: <RecordedIcon />,
      onClick: () => console.log("Recorded clicked"),
    },
  ];

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isPopoverOpen) {
        setIsPopoverOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPopoverOpen]);

  return (
    <div className="text-right">
      <Popover
        isOpen={isPopoverOpen}
        onOpenChange={(open) => setIsPopoverOpen(open)}
        placement="bottom-start" // Ensure it opens beneath the trigger
      >
        <PopoverTrigger>
          <button 
          // className="sm:flex sm:items-center sm:justify-center sm:h-[46px] sm:border sm:rounded-[50px] sm:font-gilroyMedium sm:font-semibold sm:text-[20px] sm:leading-[100%] sm:hover:border-[rgba(171,24,90,0.50)] sm:hover:bg-[rgba(171,24,90,0.10)] sm:hover:text-[rgba(121,42,77,0.90)] sm:duration-500 sm:transition sm:ease-in-out sm:border-[rgba(78,78,78,0.50)] sm:bg-transparent group sm:text-[#4E4E4E] sm:px-8"
          className="flex justify-center items-center sm:border sm:border-customLightPink text-[#792A4DE5] rounded-3xl sm:bg-customLightPink bg-opacity-20 px-3 md:px-5 xl:px-6 py-0.5 md:py-1 xl:py-2 text-[0.75rem] md:text-[0.75rem] xl:text-[1.25rem] 
          sm:leading-[100%] sm:hover:border-[rgba(171,24,90,0.50)] sm:hover:bg-[rgba(171,24,90,0.10)] sm:hover:text-[rgba(121,42,77,0.90)] sm:duration-500 sm:transition sm:ease-in-out sm:border-[rgba(78,78,78,0.50)] sm:bg-transparent group sm:text-[#4E4E4E]"
          >
            <span className="max-sm:hidden">Filter</span>
            <DropdownIcon />
            <FilterIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[135px] z-[999] origin-top-right rounded-xl border bg-[url('/img/dropdown-bg.png')] bg-center bg-cover mt-2 px-3 py-4 text-[#AB185A] transition duration-100 ease-out font-gilroyBold focus:outline-none"
        >
          {options.map((option, index) => (
            <div key={index}>
              <button
                onClick={option.onClick}
                className="flex items-center gap-2 group w-full text-left hover:text-[#560027] transition duration-500 ease-in-out"
              >
                {option.icon && <span>{option.icon}</span>}
                {option.label}
              </button>
              {index < options.length - 1 && (
                <div className="w-full bg-[#AB185A]/30 mix-blend-color-burn h-[2px] my-2"></div>
              )}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
