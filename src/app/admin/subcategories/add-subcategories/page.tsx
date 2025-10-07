"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import { useCreateSubcategory } from "@/hooks/useUsers"; // aapka mutation hook
import type { CreateSubcategoryDto } from "@/api/services/base.service";
import {
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useCategories } from "@/hooks/useCategories";
import showToast from "@/api/lib/showToast";

export default function Page() {
  const [formData, setFormData] = useState<CreateSubcategoryDto>({
    name: "",
    categoryId: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { mutateAsync, isPending } = useCreateSubcategory();
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError,
  } = useCategories();

  const handleChange = (field: keyof CreateSubcategoryDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.name?.trim() || !formData.categoryId?.trim()) {
      setErrorMsg("Name and Category are required");
      return;
    }

    try {
     const res = await mutateAsync({
        name: formData.name.trim(),
        categoryId: formData.categoryId.trim(), // selected category id
      });
      if(res.status=="error"){
        setErrorMsg(res.message);
        showToast(false, "Failed to create subcategory");
      }else{
      setSuccessMsg("Subcategory created successfully");
      showToast(true, "Subcategory created successfully");
      setFormData({ name: "", categoryId: "" });
    }}catch (err: any) {
      console.log(err)
      setErrorMsg("Failed to create subcategory");
      showToast(false, "Failed to create subcategory");
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Subcategory" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9 col-span-2 md:col-span-1">
            <div className="rounded-[10px] border border-stroke bg-white shadow-1">
              <div className="border-b px-6.5 py-4">
                <h3 className="font-semibold text-dark">Subcategory Details</h3>
              </div>
              <div className="p-6.5">
                {/* Subcategory Name */}
                <InputGroup
                  label="Subcategory Name"
                  type="text"
                  placeholder="e.g., Quantum Physics"
                  value={formData.name}
                  onChange={(value: any) => {
                    if (errorMsg) {
                      setErrorMsg("");
                    }
                    return handleChange("name", value);
                  }}
                  customClasses="mb-4.5"
                  required
                />

                {/* Category Dropdown */}
                {categoriesLoading ? (
                  <div className="mb-4.5 flex items-center gap-2">
                    <CircularProgress size={20} />
                    <span>Loading categories...</span>
                  </div>
                ) : isError ? (
                  <p className="text-red mb-4.5">Failed to load categories</p>
                ) : (
                  <FormControl fullWidth className="mb-4.5">
                    <Select
                      value={formData.categoryId}
                      onChange={(e) => {
                        if (errorMsg) setErrorMsg("");
                        handleChange("categoryId", e.target.value);
                      }}
                      displayEmpty
                      required
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <span className="text-gray-400">
                              Select Category
                            </span>
                          );
                        }
                        const selectedCat = categories ? categories.find(
                          (c) => c.id === selected
                        ) : undefined;
                        return selectedCat?.name || "";
                      }}
                    >
                      {categories?.map((cat: any) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {errorMsg && (
                  <p className="text-red text-sm mt-2" role="alert">
                    {errorMsg}
                  </p>
                )}
                {successMsg && (
                  <p className="text-green-600 text-sm mt-2" role="status">
                    {successMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-3 flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Add Subcategory"}
        </button>
      </form>
    </DefaultLayout>
  );
}
