"use client";

import { basePath } from "@/api/lib/apiClient";
import showToast from "@/api/lib/showToast";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import SelectGroupOne from "@/components/Admin/FormElements/SelectGroup/SelectGroupOne";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import axios from "axios";
import React, { useState } from "react";

const userTypeOptions = [
  { value: "customer", label: "Customer" },
  { value: "dealer", label: "Dealer" },
  { value: "carpenter", label: "Carpenter" },
  { value: "admin", label: "Admin" },
];

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
    aadharNumber: "",
    panNumber: "",
    aadharImage: null,
    panImage: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
    aadharNumber: "",
    panNumber: "",
    aadharImage: "",
    panImage: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors: any = {};

    // Name validation (no numbers allowed)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = "Name cannot contain numbers or symbols";
      valid = false;
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    // Password check
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // User type check
    if (!formData.userType) {
      newErrors.userType = "User type is required";
      valid = false;
    }

    // Phone check (if you enable it later)
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Valid phone number is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const [selectedUserTypeId, setSelectedUserTypeId] = useState<string>("");
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!validateForm()) {
       console.log("Validation failed");
       showToast(false,'Check errors above.')
       return;
     }

    const payload = new FormData();

    // Append simple fields
    payload.append("name", formData.name);
    payload.append("phone", formData.phone);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("userType", formData.userType);

    // Append Aadhar & PAN JSON as string
    payload.append(
      "aadhar",
      JSON.stringify({ aadharNumber: formData.aadharNumber })
    );
    payload.append(
      "panDetail",
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
      // const res = await axios.post(`${basePath}/api/users/register`, payload, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      console.log(res.data);
      setFormData({
    name: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
    aadharNumber: "",
    panNumber: "",
    aadharImage: null,
    panImage: null,
  })
      showToast(true,'Success')

      // console.log("Server Response:", data);
    } catch (err) {
      console.error(err);
      showToast(false,'Failed: ')
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
          error={errors.name}
        />

        <InputGroup
          label="Phone"
          type="text"
          placeholder="Enter Phone"
          value={formData.phone}
          onChange={(val) => handleChange("phone", val)}
          required
        />

        <InputGroup
          label="Email"
          type="text"
          placeholder="Enter Email"
          value={formData.email}
          onChange={(val) => handleChange("email", val)}
          required
          error={errors.email}
        />

        <InputGroup
          label="Password"
          type="text"
          placeholder="Enter Password"
          value={formData.password}
          onChange={(val) => handleChange("password", val)}
          required
          error={errors.password}
        />

        <SelectGroupOne
          options={userTypeOptions}
          title="User Type"
          onSelectChange={(value) => handleChange("userType", value)}
          selectedOption={selectedUserTypeId}
          setSelectedOption={setSelectedUserTypeId}
          error={errors.userType}
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
          className="mt-3 w-full cursor-pointer hover:bg-hoverPrimary rounded bg-primary p-3 text-white hover:bg-opacity-90"
        >
          Register User
        </button>
      </form>
    </DefaultLayout>
  );
}
