"use client";

import { basePath } from "@/api/lib/apiClient";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import axios from "axios";
import React, { useState } from "react";

export default function page() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    aadharNumber: "",
    panNumber: "",
    aadharImage: null,
    panImage: null,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();

    // Append simple fields
    payload.append("name", formData.name);
    payload.append("phone", formData.phone);

    // Append Aadhar & PAN JSON as string
    payload.append(
      "aadharDetails",
      JSON.stringify({ aadharNumber: formData.aadharNumber })
    );
    payload.append(
      "panDetails",
      JSON.stringify({ panNumber: formData.panNumber })
    );

    // Append files
    if (formData.aadharImage) {
      payload.append("aadharImage", formData.aadharImage);
    }
    if (formData.panImage) {
      payload.append("panImage", formData.panImage);
    }

    // Example fetch request
    try {
      const res = await axios.post(`${basePath}/api/users/register`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data)
      // console.log("Server Response:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add User" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        {/* Basic Info */}
        <InputGroup
          label="Name"
          type="text"
          placeholder="Enter Name"
          value={formData.name}
          onChange={(val) => handleChange("name", val)}
          required
        />

        <InputGroup
          label="Phone"
          type="text"
          placeholder="Enter Phone"
          value={formData.phone}
          onChange={(val) => handleChange("phone", val)}
          required
        />

        {/* Aadhar */}
        <InputGroup
          label="Aadhar Number"
          type="text"
          placeholder="Enter Aadhar Number"
          value={formData.aadharNumber}
          onChange={(val) => handleChange("aadharNumber", val)}
          required
        />
        <div>
          <label className="block mb-2 font-medium">Upload Aadhar Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileChange(
                "aadharImage",
                e.target.files ? e.target.files[0] : null
              )
            }
            required
          />
        </div>

        {/* PAN */}
        <InputGroup
          label="PAN Number"
          type="text"
          placeholder="Enter PAN Number"
          value={formData.panNumber}
          onChange={(val) => handleChange("panNumber", val)}
          required
        />
        <div>
          <label className="block mb-2 font-medium">Upload PAN Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleFileChange(
                "panImage",
                e.target.files ? e.target.files[0] : null
              )
            }
            required
          />
        </div>

        <button
          type="submit"
          className="mt-3 w-full rounded bg-primary p-3 text-white hover:bg-opacity-90"
        >
          Register User
        </button>
      </form>
    </DefaultLayout>
  );
}
