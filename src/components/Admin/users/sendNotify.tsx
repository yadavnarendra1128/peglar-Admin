"use client";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup"; // Fixed typo here
import React, { useEffect, useMemo, useState } from "react";
import { QrCode } from "@/types/qrCode";

type batch_nos = string[];
function MessageNotfiyModal({
  formData,
  setFormData,
}: {
  formData: {
    body:string
    title:string
    imageUrl?:string | ""
  };
  setFormData: any;
}) {
  // const [data, setData] = useState<batch_nos>([])
  // //products list
  // useEffect(() => {
  //   console.log(productOptions)
  //   const filtered = productOptions.map(x => x.batch_no)
  //   const filteredBatchNo = Array.from(new Set(filtered))
  //   setData(filteredBatchNo)
  // }, [productOptions])

  // const [Data, setData] = useState({
  //   batch_no: "", reward_amount: ""
  // }); // Dummy product data - ideally loaded from API or props

  // Handle form input changes generically

  const handleChange = (field: string, value: string | number) => {
    console.log(field, value);
    setFormData((prev: {}) => ({ ...prev, [field]: value }));
  }; // Form submission handler

  // // Optional: Commented out check for available QR codes; uncomment if desired // if (qrCountNum > selectedProduct.count) { // alert( //  `Cannot generate ${qrCountNum} QR codes. Only ${selectedProduct.count} available for this product.` // ); // return; // }
  return (
    <div className="mt-4 mb-5">
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9 col-span-2 md:col-span-1">
          <div className="rounded-[10px] shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="p-6.5">
              {/* Product Selection Dropdown */}
  <div className="mb-4.5">
                <InputGroup
                  label="Enter title"
                  type="text"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(value) => handleChange("title", value)}
                  customClasses="mb-4.5"
                  required // disabled={generateQRMutation.isLoading} // min={1}
                />
              </div>
              <div className="mb-4.5">
                <InputGroup
                  label="Enter body"
                  type="textarea"
                  placeholder="Enter body"
                  value={formData.body}
                  onChange={(value) => handleChange("body", value)}
                  customClasses="mb-4.5"
                  required // disabled={generateQRMutation.isLoading} // min={1}
                />
              </div>
              
            
               <div className="mb-4.5">
                <InputGroup
                  label="Enter Image"
                  type="url"
                  placeholder="Enter url"
                  value={formData?.imageUrl}
                  onChange={(value) => handleChange("imageUrl", value)}
                  customClasses="mb-4.5"
                  required // disabled={generateQRMutation.isLoading} // min={1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {/* <button

          type="submit"
          className="mt-3 flex flex-1 justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit disabled:opacity-50 disabled:cursor-not-allowed" // disabled={generateQRMutation.isLoading}
        >
          update
        </button> */}
      </div>
      {/* Success Message and Download Section
        {generatedQRData && (
          <div
            className="flex flex-col justify-center items-center bg-green-50 border border-green-200 rounded-lg p-6 dark:bg-green-900/20 dark:border-green-800"
            style={{ margin: "40px 0" }}
            >
            <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            QR Codes Generated Successfully! 🎉
            </h3>
            
              <p className="text-green-700 dark:text-green-300">
                {generatedQRData.message}
              </p>
  
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Total QR codes generated:
                <span className="font-medium">{generatedQRData.total}</span>
              </p>
            </div>
  
            <button
              onClick={handleDownload}
              className="mt-3 flex flex-1 justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Download Excel File
            </button>
          </div>
        )} */}
    </div>
  );
}
import { useRef } from "react";

type Props = {
  isOpen: boolean;
  formData: {
   body:string
    title:string
    imageUrl:string |  ""
  };
  onConfirm: () => void;
  onCancel: () => void;
  setFormData: any;
};

export default function Notfication({
  isOpen,
  formData,
  onConfirm,
  onCancel,
  setFormData,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-lg">
      <div
        ref={modalRef}
        className="bg-white p-4 md:p-6 rounded-xl w-[70%] md:w-[90%] max-w-[400px] shadow-xl border border-primary"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-rosario tracking-wide font-semibold">
           NOtifcation details
          </h2>
          <button
            className="rounded-full flex justify-center items-center text-white font-semibold w-8 h-8 p-2 bg-primary hover:bg-hoverPrimary"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>
        <MessageNotfiyModal
          formData={formData}
          setFormData={setFormData}
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-primary border-primary border-2 hover:bg-hoverSecondary bg-[#EEE6EC] rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 bg-primary text-white hover:bg-hoverPrimary rounded-md"
          >
            update
          </button>
        </div>
      </div>
    </div>
  );
}