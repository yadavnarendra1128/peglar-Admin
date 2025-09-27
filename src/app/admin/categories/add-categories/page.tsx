"use client";

import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import React, { useState } from "react";
import { createCategory } from "@/api/services/category.service";
import { useMutation } from "@tanstack/react-query";
import showToast from "@/api/lib/showToast";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [isError,setError]=useState(false)
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if(!formData.name){
      setError(true)
       setLoading(false);
      return
    }
    setError(false)
    await createMutation.mutateAsync(formData.name)
    setLoading(false);

  };
  const createMutation = useMutation({
    mutationFn: (name: string) =>
      createCategory(name),
    onSuccess: () => {
      setFormData({ name: "", });
      showToast(true, "category created successfully")
    },
    onError: (err) => {
      showToast(false, "failed to create category try again")
      console.error("Error creating category:", err);
    }
  })

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Guru" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9 col-span-2 md:col-span-1">
            {/* General Information */}
            <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                <h3 className="font-semibold text-dark dark:text-white">
                  General Information
                </h3>
              </div>
              <div className="p-6.5">
                <InputGroup
                  label="Category name"
                  type="text"
                  placeholder="Enter Category Name"
                  value={formData.name}
                  onChange={(value) => handleChange("name", value)}
                  customClasses="mb-4.5"
                  required
                />
                {isError && <div className="text-red-600">name field required</div>}
              </div>

            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-3 flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </DefaultLayout>
  );
}
