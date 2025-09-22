import React from "react";

interface InputGroupProps {
  customClasses?: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  value: string | number;
  onChange: (value: string | number) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  customClasses,
  label,
  type,
  placeholder,
  required,
  disabled,
  value,
  onChange,
}) => {
  return (
    <div className={customClasses}>
      <label className="mb-3 block text-body-sm font-medium text-dark-2">
        {label}
        {required && <span className="text-red">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-[7px] border-[1.5px] bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6  dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary ${
          disabled
            ? "disabled:cursor-not-allowed"
            : "cursor-text border-stroke focus:border-primary active:border-primary"
        }`}
        disabled={disabled}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? +e.target.value : e.target.value)
        }
      />
    </div>
  );
};

export default InputGroup;
