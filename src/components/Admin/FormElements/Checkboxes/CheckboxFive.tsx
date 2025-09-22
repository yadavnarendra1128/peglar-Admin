"use client";

import { useState } from "react";

interface CheckboxFiveProps {
  name?: string;
}

const CheckboxFive = ({ name }: CheckboxFiveProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <label
        htmlFor={`${name}-checkbox`}
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white"
      >
        <div className="relative">
          <input
            type="radio"
            name={name} // Same 'name' for both, so only one can be selected
            id={`${name}-checkbox`}
            className="sr-only"
            onChange={handleChange}
            checked={isChecked}
          />
          <div
            className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary ${
              isChecked && "!border-4"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: isChecked
                  ? "radial-gradient(#ab185a, transparent)"
                  : "none",
              }}
            ></span>
          </div>
        </div>
        Checkbox Text
      </label>
    </div>
  );
};

export default CheckboxFive;
