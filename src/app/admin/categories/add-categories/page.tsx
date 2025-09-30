"use client";

import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import React, { useState } from "react";
import { createCategory } from "../../../../../api/services/base.service";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ Call API
      const res = await createCategory(formData);

      console.log("Category Created:", res.data);

      // Reset form after success
      setFormData({
        name: "",
      });

      alert("Category added successfully!");
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

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
