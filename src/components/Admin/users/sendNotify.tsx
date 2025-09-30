"use client";
import InputGroup from "@/components/Admin/FormElements/InputGroup"; // Fixed typo here
import React, { useEffect, useMemo, useState } from "react";

import { useRef } from "react";

type Props = {
  isOpen: boolean;
  formData: {
    body: string
    title: string
    imageUrl: string | ""
  };
  onConfirm: () => void;
  onCancel: () => void;
  setFormData: any;
};

export default function NotificationModal({
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



  const handleChange = (field: string, value: string | number) => {
    console.log(field, value);
    setFormData((prev: {}) => ({ ...prev, [field]: value }));
  }; // Form submission handler


  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-lg">
      <div
        ref={modalRef}
        className="bg-white p-4 md:p-6 rounded-xl w-[80%] md:w-[90%] max-w-[400px] shadow-xl border border-primary"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-rosario tracking-wide font-semibold">
            Notifcation details
          </h2>
          <button
            className="rounded-full flex justify-center items-center text-white font-semibold w-8 h-8 p-2 bg-primary hover:bg-hoverPrimary"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>
        <div className="mt-4 mb-5">
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
            <div className="flex flex-col gap-9 col-span-2 md:col-span-1">
              <div className="rounded-[10px] shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
                <div className="p-6.5">
                  {/* Product Selection Dropdown */}
                  <div className="mb-4.5">
                    <InputGroup
                      label="Title"
                      type="text"
                      placeholder="title for  notification"
                      value={formData.title}
                      onChange={(value) => handleChange("title", value)}
                      customClasses="mb-4.5"
                      required // disabled={generateQRMutation.isLoading} // min={1}
                    />
                  </div>
                  <div className="mb-4.5">
                    <InputGroup
                      label="Message"
                      type="textarea"
                      placeholder="Enter  message"
                      value={formData.body}
                      onChange={(value) => handleChange("body", value)}
                      customClasses="mb-4.5"
                      required // disabled={generateQRMutation.isLoading} // min={1}
                    />
                  </div>


                  <div className="mb-4.5">
                    <InputGroup
                      label="Image url"
                      type="url"
                      placeholder="Enter Image url"
                      value={formData?.imageUrl}
                      onChange={(value) => handleChange("imageUrl", value)}
                      customClasses="mb-4.5"
                      required={false} // disabled={generateQRMutation.isLoading} // min={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

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
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
