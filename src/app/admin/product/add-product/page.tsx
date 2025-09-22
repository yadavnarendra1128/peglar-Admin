"use client";

import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import SelectGroupOne from "@/components/Admin/FormElements/SelectGroup/SelectGroupOne";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import React, { useEffect, useState } from "react";

import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";;
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "../../../../../api/services/product.service";
import showToast from "../../../../../api/lib/showToast";
import { baseUrl as apiBaseUrl } from "../../../../../api/lib/apiClient";

export default function AddProductPage() {
  const param = useSearchParams();
  const router = useRouter();
  const productId = param.get("id");

    const {
      data: catData,
    } = useCategories();
    const {
      data: subData,
    } = useSubcategories();
    const [categoryOptions, setCategoryOptions] = useState([
      { value: "", label: "None" },
    ]);
    const [subcategoryOptions, setSubCategoryOptions] = useState([
      { value: "", label: "None" },
    ]);

  const [formData, setFormData] = useState({
    name: "",
    model_no: "",
    base_price:0,
    description:"",
    // offer_id: "",
    qr_count: 1,
    reward_amount: 1,
    categoryId: "",
    subcategoryId: "",
  });

  const [submitting,setSubmitting]=useState<boolean>(false)
  const [selectedCatId,setSelectedCatId]=useState<string>('')
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>("");

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setSubmitting(true)
    if (!apiBaseUrl) {
      throw new Error("API base URL is missing. Check your .env file.");
    }

    const res = await fetch(`${apiBaseUrl}product/createProduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorText = await res.text(); // Read raw error response
      console.error("Server error response:", errorText);
      throw new Error(
        `Failed to create product: ${errorText || res.statusText}`
      );
    }

    const data = await res.json();
    console.log("Product Created Successfully:", data);

    setFormData({
      name: "",
      model_no: "",
      base_price:0,
      description:"",
      // offer_id: "",
      qr_count: 1,
      reward_amount: 1,
      categoryId: "",
      subcategoryId: "",
    });

    showToast(true,"Product has been created successfully!");
    setSelectedCatId('')
    setSelectedSubCatId('')
  } catch (error:any) {
    console.error("Error creating product:", error);
    showToast(false,error);
  }finally{
    setSubmitting(false)
  }
};

  useEffect(() => {
    console.log(productId);

    const fetchs = async () => {
      try {
        const res = await getProduct(productId ?? '');
        console.log(res.Category)
        const selectedCat=res.Category.id
        const selectedSubCat = res.Subcategory.id;
        const datas = {
          name: res.name,
          model_no: res.model_no,
          base_price:res.base_price,
          description: res.description,
          // offer_id: "",
          qr_count: res.qr_count,
          reward_amount: res.reqard_count || 1,
          categoryId: res.Category.id,
          subcategoryId: res.Subcategory.id,
        };
        console.log(datas)
        setFormData(datas);
        setSelectedCatId(selectedCat)
        setSelectedSubCatId(selectedSubCat)
      } catch (error:any) {
        console.log(error,'err')
        showToast(true,'ede opo')
        // router.push("/admin");
      }
    };
    if (productId) fetchs();
  }, [productId]);

  // console.log(formData)
  useEffect(() => {
    if (!catData) {
      return;
    }
    const categoryData = catData.map((x) => {
      return { value: x["id"], label: x["name"] };
    });
    categoryData.unshift({ value: "", label: "None" });
    setCategoryOptions(categoryData);
  }, [catData]);

  useEffect(() => {
    if (!subData) {
      return;
    }
    const subCategoryData = subData.map((x) => {
      return { value: x["id"], label: x["name"] };
    });
    subCategoryData.unshift({ value: "", label: "None" });
    setSubCategoryOptions(subCategoryData);
  }, [subData]);


  return (
    <DefaultLayout>
      {/* Page header navigation */}
      <Breadcrumb pageName="Add Product" />

      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <div className="w-full gap-9">
          {/* Form Card */}
          <div className="col-span-2 md:col-span-1">
            <div className="rounded-[10px] border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                <h3 className="font-semibold text-dark dark:text-white">
                  Product Information
                </h3>
              </div>

              <div className="p-6.5">
                {/* Product Name */}
                <InputGroup
                  label="Product Name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(value) => handleChange("name", value)}
                  required
                  customClasses="mb-4.5"
                />

                {/* Base price */}
                <InputGroup
                  label="Base Price"
                  type="number"
                  placeholder="Enter base price"
                  value={formData.base_price}
                  onChange={(value) =>
                    handleChange("base_price", Number(value))
                  }
                  customClasses="mb-4.5"
                />

                {/* Model Number */}
                <InputGroup
                  label="Model Number"
                  type="text"
                  placeholder="Enter model number"
                  value={formData.model_no}
                  onChange={(value) => handleChange("model_no", value)}
                  required
                  customClasses="mb-4.5"
                />

                {/* Offer ID */}
                {/* <InputGroup
                  label="Offer ID"
                  type="text"
                  placeholder="Enter offer ID"
                  value={formData.offer_id}
                  onChange={(value) => handleChange("offer_id", value)}
                  required
                  customClasses="mb-4.5"
                /> */}

                {/* Product Description */}
                <InputGroup
                  label="Product Description"
                  type="textarea"
                  textAreaRows={6}
                  textAreaHeight="h-20 md:h-40"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(value) => handleChange("description", value)}
                  required
                  customClasses="mb-4.5"
                />

                {/* QR Count */}
                <InputGroup
                  label="QR Count"
                  type="number"
                  placeholder="Enter QR count"
                  value={formData.qr_count}
                  onChange={(value) => handleChange("qr_count", Number(value))}
                  customClasses="mb-4.5"
                />

                {/* Reward Amount */}
                <InputGroup
                  label="Reward Amount"
                  type="number"
                  placeholder="Enter reward amount"
                  value={formData.reward_amount}
                  onChange={(value) =>
                    handleChange("reward_amount", Number(value))
                  }
                  customClasses="mb-4.5"
                />

                {/* Category Dropdown */}
                <SelectGroupOne
                  options={categoryOptions}
                  title="Category"
                  onSelectChange={(value) => handleChange("categoryId", value)}
                  selectedOption={selectedCatId}
                  setSelectedOption={setSelectedCatId}
                />

                {/* Subcategory Dropdown */}
                <SelectGroupOne
                  options={subcategoryOptions}
                  title="Subcategory"
                  onSelectChange={(value) =>
                    handleChange("subcategoryId", value)
                  }
                  selectedOption={selectedSubCatId}
                  setSelectedOption={setSelectedSubCatId}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 transition hover:bg-hoverPrimary hover:cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          Add Product
        </button>
      </form>
    </DefaultLayout>
  );
}
