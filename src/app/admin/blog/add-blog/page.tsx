"use client";

import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import SelectGroupOne from "@/components/Admin/FormElements/SelectGroup/SelectGroupOne";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";

export default function page() {
  const [pitch, setPitch] = useState("");
  const [formData, setFormData] = useState({
    blogTitle: "",
    authorName: "",
    publishedBy: "",
    blogBanner: "",
    blogContent: "",
  });

  const handleChange = (field: string, value: string | number) => {
    console.log(value);

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setFormData({
      blogTitle: "",
      authorName: "",
      publishedBy: "",
      blogBanner: "",
      blogContent: "",
    });
  };

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Add Blog" />
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
            <div className="flex flex-col gap-9 col-span-1 md:col-span-1">
              {/* General Information */}
              <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                  <h3 className="font-semibold text-dark dark:text-white">
                    General Information
                  </h3>
                </div>
                <div className="p-6.5">
                  <InputGroup
                    label="Blog Title"
                    type="text"
                    placeholder="Enter Blog Title"
                    customClasses="mb-4.5"
                    value={formData.blogTitle}
                    onChange={(value) => handleChange("blogTitle", value)}
                    required
                  />

                  <InputGroup
                    label="Author Name"
                    type="text"
                    placeholder="Enter Author Name"
                    customClasses="mb-4.5"
                    value={formData.authorName}
                    onChange={(value) => handleChange("authorName", value)}
                    required
                  />

                  <InputGroup
                    label="Published By"
                    type="text"
                    placeholder="Enter Published By"
                    customClasses="mb-4.5"
                    value={formData.publishedBy}
                    onChange={(value) => handleChange("publishedBy", value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-9 col-span-1 md:col-span-1">
              {/* Content & Media */}
              <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                  <h3 className="font-semibold text-dark dark:text-white">
                    Content & Media
                  </h3>
                </div>
                <div className="p-6.5">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Upload Blog Banner
                    <span className="text-red">*</span>
                  </label>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary sm:py-7.5"
                  >
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      accept="image/png, image/jpg, image/jpeg"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      value={formData.blogBanner}
                      onChange={(e) =>
                        handleChange("blogBanner", e.target.value)
                      }
                    />
                    <div className="flex flex-col items-center justify-center">
                      <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                            fill="#ab185a"
                          />
                          <path
                            d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                            fill="#ab185a"
                          />
                        </svg>
                      </span>
                      <p className="mt-2.5 text-body-sm font-medium text-gray-7">
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1 text-body-xs text-gray-7">
                        PNG, JPG or JPEG (max, 800 X 800px)
                      </p>
                    </div>
                  </div>

                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Upload Blog Content
                    <span className="text-red">*</span>
                  </label>
                  <MDEditor
                    value={formData.blogContent}
                    // onChange={(value) => setPitch(value as string)}
                    onChange={(e) => handleChange("blogContent", e as string)}
                    id="pitch"
                    preview="edit"
                    height={300}
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "#fff",
                      color: "#000",
                    }}
                    textareaProps={{
                      placeholder: "Enter Blog Content",
                    }}
                    previewOptions={{
                      disallowedElements: ["style"],
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-3 flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit"
          >
            Add Blog
          </button>
        </form>
      </DefaultLayout>
    </>
  );
}
