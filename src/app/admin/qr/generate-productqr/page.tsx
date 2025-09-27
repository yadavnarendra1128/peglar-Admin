"use client";

import React, { useMemo, useState } from "react";

import {
   downloadQRExcel,
  generateBulkQRCodes,
  GenerateBulkQRRequest,
} from "@/api/services/qr.service";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";;
import InputGroup from "@/components/Admin/FormElements/InputGroup"; // Fixed typo here

import { useMutation } from "@tanstack/react-query";

import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/api/services/product.service";

interface GeneratedQRData {
  message: string;

  total: number;

  downloadUrl: string;
}

export default function Page() {
  // State to hold generated QR code data after successful API call
const { data } = useProducts();
  const [generatedQRData, setGeneratedQRData] =
    useState<GeneratedQRData | null>(null); // Form state with default values

  const [formData, setFormData] = useState({
    productId: "",
    qrCount: "",
    reward_amount: "",
  }); // Dummy product data - ideally loaded from API or props

 const productOptions = useMemo(() => {
   if (!data) return [];
   return data.map((product: Product) => {
     return { id: product.id, name: product.name };
   });
 }, [data]);

  const generateQRMutation = useMutation<
    GeneratedQRData,
    Error,
    GenerateBulkQRRequest
  >({
    mutationFn: (payload: GenerateBulkQRRequest) =>
      generateBulkQRCodes(payload),

    onSuccess: (data) => {
      console.log("QR codes generated successfully:", data);

      setGeneratedQRData(data);
    },

    onError: (error) => {
      console.error("Error generating QR codes:", error.message); // You might want to show a toast notification or UI feedback here
    },
  }); // Handle form input changes generically

  const handleChange = (field: string, value: string | number) => {
    console.log(field, value)
    setFormData((prev) => ({ ...prev, [field]: value }));
  }; // Form submission handler

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProduct = productOptions.find(
      (product) => product.id === formData.productId
    );
    // console.log(selectedProduct,productOptions,formData.productId)
    if (!selectedProduct) {

      alert("Please select a valid product");

      return;
    }

    const qrCountNum = parseInt(formData.qrCount);

    if (isNaN(qrCountNum) || qrCountNum <= 0) {
      alert("Please enter a valid QR code count greater than zero");

      return;
    } // Optional: Commented out check for available QR codes; uncomment if desired // if (qrCountNum > selectedProduct.count) { // alert( //  `Cannot generate ${qrCountNum} QR codes. Only ${selectedProduct.count} available for this product.` // ); // return; // }

    const apiPayload: GenerateBulkQRRequest = {
      product_id: formData.productId,
    reward_amount: parseInt(formData.reward_amount),
      count: qrCountNum,
    };

    generateQRMutation.mutate(apiPayload);
  }; // Download generated QR codes Excel file

  const handleDownload = async () => {
    if (generatedQRData?.downloadUrl) {
      try {
        await downloadQRExcel(generatedQRData.downloadUrl);
      } catch (error) {
        console.error("Error downloading file:", error); // Inform user of download failure, e.g., toast notification
      }
    }
  }; // Reset form and clear generated data

  const handleReset = () => {
    setFormData({
      productId: "",
      qrCount: "",
         reward_amount: ""
    });

    setGeneratedQRData(null);

    generateQRMutation.reset();
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Generate QR Codes" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9 col-span-2 md:col-span-1">
            <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                <h3 className="font-semibold text-dark dark:text-white">
                  QR Code Generation Information
                </h3>
              </div>

              <div className="p-6.5">
                {/* Product Selection Dropdown */}

                <div className="mb-4.5">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Select Product
                    <span className="text-red">*</span>
                  </label>

                  <select
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                    value={formData.productId}
                    onChange={(e) => handleChange("productId", e.target.value)}
                    required // disabled={generateQRMutation.isLoading}
                  >
                    <option value="" disabled>
                      Select a product
                    </option>

                    {productOptions.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                        {/* You can show availability if needed */}
                        {/* (Available: {product.count}) */}
                      </option>
                    ))}
                  </select>
                </div>

                <InputGroup
                  label="QR Code Count"
                  type="number"
                  placeholder="Enter number of QR codes to generate"
                  value={formData.qrCount}
                  onChange={(value) => handleChange("qrCount", value)}
                  customClasses="mb-4.5"
                  required 
                  
                />
                <InputGroup
                  label="Reward Amount"
                  type="number"
                  placeholder="Enter reward amount"
                  value={formData.reward_amount}
                  onChange={(value) => handleChange("reward_amount", value)}
                  customClasses="mb-4.5"
                  required // disabled={generateQRMutation.isLoading} // min={1}
                />

                <InputGroup
                  label="Reward Amount"
                  type="number"
                  placeholder="Enter reward amount"
                  value={formData.reward_amount}
                  onChange={(value) => handleChange("reward_amount", value)}
                  customClasses="mb-4.5"
                  required // disabled={generateQRMutation.isLoading} // min={1}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
           
            type="submit"
            className="mt-3 flex flex-1 justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit disabled:opacity-50 disabled:cursor-not-allowed" // disabled={generateQRMutation.isLoading}
          >
            {generateQRMutation.isPending
              ? "Generating QR Codes..."
              : "Generate QR Codes"}
          </button>

          {generatedQRData ? (
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 flex flex-1 justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Form
            </button>
          ) : (
            ""
          )}
        </div>
      </form>
      {/* Success Message and Download Section */}
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
      )}
      {/* Error Message */}
      {generateQRMutation.isError && (
        <div
          className="flex flex-col justify-center items-center bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800"
          style={{ margin: "40px 0" }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Generating QR Codes ❌
            </h3>

            <p className="text-red-700 dark:text-red-300">
              {generateQRMutation.error?.message ||
                "An error occurred while generating QR codes. Please try again."}
            </p>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
