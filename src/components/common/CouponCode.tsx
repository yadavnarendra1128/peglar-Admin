import React, { useEffect, useState } from "react";
import { coupons } from "./Helper";
import { CloseIcon } from "./Icons";

type Coupon = {
  code: string;
  description: string;
  condition: string;
  expires: string;
  discount: number;
};

type CouponCodeProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (discount: number, code: string) => void;
};

const CouponCode: React.FC<CouponCodeProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isVisible, setVisible] = useState(false);

  const handleApply = () => {
    if (selectedCoupon) {
      onApply(selectedCoupon.discount, selectedCoupon.code);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 1000);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-[999] overflow-y-hidden duration-700 ease-in-out
      ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`bg-white w-[24rem] md:w-[30rem] lg:w-[40rem] h-[30rem] lg:h-[40rem] rounded-lg shadow-lg transform transition-all duration-300
        ${isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Apply Coupon</h2>
          <button
            className="hover:rotate-[360deg] transition duration-500 ease-in-out"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-4 overflow-y-scroll h-[20rem] lg:h-[30rem]">
          {coupons.map((coupon, index) => (
            <div
              key={index}
              className={`flex items-center p-3 mb-2 border rounded-lg cursor-pointer ${
                selectedCoupon?.code === coupon.code
                  ? "border-[#AB185A]"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedCoupon(coupon)}
            >
              <input
                type="radio"
                className="mr-3 accent-[#AB185A]"
                checked={selectedCoupon?.code === coupon.code}
                readOnly
              />
              <div>
                <p className="font-bold text-[#AB185A]">{coupon.code}</p>
                <p>{coupon.description}</p>
                <a
                  href="/"
                  className="text-blue-600 flex flex-row items-center gap-2 cursor-pointer"
                >
                  View all courses
                  <svg
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.23438 9.76562L5.46967 5.53033L1.23438 1.29504"
                      stroke="#2563eb"
                      strokeWidth="1.72588"
                    />
                  </svg>
                </a>
                <p className="text-sm text-gray-500">{coupon.condition}</p>
                <p className="text-sm text-gray-500">
                  Expires on: {coupon.expires}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm">
            Maximum savings: ₹{selectedCoupon?.discount || 0}
          </p>
          <button
            className={`m-0 h-[56px] curlBtn curlBtnPaper paper-curl-right bg-[#AB185A] text-[16px] md:text-[18px] text-[#fff5fa] font-semibold font-gilroyRegular px-4 rounded ${
              !selectedCoupon
                ? "cursor-not-allowed disabled:opacity-50"
                : "cursor-pointer opacity-1"
            }`}
            onClick={handleApply}
            disabled={!selectedCoupon}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponCode;
