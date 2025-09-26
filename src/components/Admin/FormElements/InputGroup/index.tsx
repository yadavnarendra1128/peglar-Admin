import React from "react";

interface InputGroupProps {
  customClasses?: string;
  label: string;
  type: string;
  textAreaRows?: number;
  textAreaHeight?: string;
  placeholder: string;
  required?: boolean;
  value?: string | number;
  onChange: (value: string | number) => void;
  min?: string;
  max?: string;
  step?: string;
  error?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  customClasses,
  label,
  type,
  textAreaRows = 0,
  textAreaHeight = "h-20 md:h-40",
  placeholder,
  required = false,
  value,
  onChange,
  min,
  max,
  step,
  error = "",
}) => {
  return (
    <div className={customClasses}>
      <label className="mb-3 block text-body-sm font-medium text-dark-2">
        {label}
        {required && <span className="text-red">*</span>}
      </label>

      {type === "textarea" ? (
        <>
          <textarea
            placeholder={placeholder}
            rows={textAreaRows}
            className={`w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary ${textAreaHeight}`}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
          {error && (
            <p className="text-red-400  my-1text-sm font-medium">{error}</p>
          )}
        </>
      ) : (
        <>
          <input
            min={min}
            max={max}
            step={step}
            type={type}
            placeholder={placeholder}
            className="w-full no-spinner rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            value={value}
            onChange={(e) =>
              onChange(
                type === "number" ? parseFloat(e.target.value) : e.target.value
              )
            }
            onWheel={(e) => (e.currentTarget as HTMLElement).blur()}
          />
          {error && (
            <p className="text-red-400  my-1 text-sm font-medium">{error}</p>
          )}
        </>
      )}
    </div>
  );
};

export default InputGroup;
