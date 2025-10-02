"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import SelectGroupOne from "@/components/Admin/FormElements/SelectGroup/SelectGroupOne";
import showToast from "@/api/lib/showToast";
import { createTicket } from "@/api/services/qr-ticket.service";

type TicketFormData = {
  userId: string;
  title: string;
  description: string;
  qrValue:string;
  ticketType: "qr-report";
  status: boolean;
};

export default function AddTicketPage() {
  const [formData, setFormData] = useState<TicketFormData>({
    userId: "",
    title: "",
    description: "",
    qrValue:"",
    ticketType: "qr-report",
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.userId.trim()) newErrors.userId = "User ID is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.qrValue.trim()) newErrors.qrValue='Qr Value is required'

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast(false, "Please fix the errors.");
      return;
    }

    try {
      setSubmitting(true);
      const ticket = await createTicket(formData);
      showToast(true, `Ticket created successfully! ID: ${ticket.id}`);
      setFormData({
        userId: "",
        title: "",
        description: "",
        ticketType: "qr-report",
        status: true,
        qrValue:""
      });
    } catch (err: any) {
      console.error(err);
      showToast(false, err.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Ticket" />
      <div className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>
        <form onSubmit={handleSubmit}>
          <InputGroup
            label="User ID"
            placeholder="Enter User ID"
            value={formData.userId}
            onChange={(val) => handleChange("userId", val)}
            error={errors.userId}
            required
            customClasses="mb-4"
            type='text'
          />
          <InputGroup
            label="Title"
            placeholder="Enter ticket title"
            value={formData.title}
            onChange={(val) => handleChange("title", val)}
            error={errors.title}
            required
            customClasses="mb-4"
            type='text'
          />
          <InputGroup
            label="Description"
            type="textarea"
            textAreaRows={4}
            placeholder="Enter description"
            value={formData.description}
            onChange={(val) => handleChange("description", val)}
            error={errors.description}
            required
            customClasses="mb-4"
          />
          <InputGroup
            label="Qr Value"
            placeholder="Enter qr value"
            value={formData.qrValue}
            onChange={(val) => handleChange("qrValue", val)}
            error={errors.qrValue}
            required
            customClasses="mb-4"
            type='text'
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white p-3 rounded disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Ticket"}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
}
