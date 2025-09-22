"use client";
import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectGroupOneProps {
  options: Option[]; // Array of options passed from the parent
  title: string;
  onSelectChange: (value: string) => void; // Optional callback to pass the selected option to the parent
  selectedOption:string;
  setSelectedOption:React.Dispatch<React.SetStateAction<string>>
  }

const SelectGroupOne: React.FC<SelectGroupOneProps> = ({
  options,
  title,
  onSelectChange,
  selectedOption,
  setSelectedOption
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    setIsOptionSelected(true);
    onSelectChange(value); // Pass the selected value to the parent
  };

  return (
    <div className="mb-4.5">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {title}
        <span className="text-red">*</span>
      </label>

      <div className="relative z-20 bg-transparent dark:bg-dark-2">
        <select
          value={selectedOption}
          onChange={(e) => handleSelectChange(e.target.value)}
          className={`!text-black relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        >
          <option value="" disabled className="text-dark-6">
            Select {title}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-dark-2"
            >
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.99922 12.8249C8.83047 12.8249 8.68984 12.7687 8.54922 12.6562L2.08047 6.2999C1.82734 6.04678 1.82734 5.65303 2.08047 5.3999C2.33359 5.14678 2.72734 5.14678 2.98047 5.3999L8.99922 11.278L15.018 5.34365C15.2711 5.09053 15.6648 5.09053 15.918 5.34365C16.1711 5.59678 16.1711 5.99053 15.918 6.24365L9.44922 12.5999C9.30859 12.7405 9.16797 12.8249 8.99922 12.8249Z"
              fill=""
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupOne;
