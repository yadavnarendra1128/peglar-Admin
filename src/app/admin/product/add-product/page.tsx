"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/Admin/FormElements/InputGroup";
import SelectGroupOne from "@/components/Admin/FormElements/SelectGroup/SelectGroupOne";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import React, { useEffect, useRef, useState } from "react";

import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";;
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "../../../../../api/services/product.service";
import showToast from "../../../../../api/lib/showToast";
import { deleteFile, MediaType, ProductType, uploadFile } from "../../../../../api/services/base.service";

import { basePath } from "@/api/lib/apiClient";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";


type errorDataType = {
  name: string;
  model_no: string;
  base_price: string;
  description: string;
  finish: string;
  categoryId: string;
  subcategoryId: string;
  media: string;
};

export default function AddProductPage() {
  const param = useSearchParams();
  const router = useRouter();
  const productId = param.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<Slider | null>(null); 

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

  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProductType>({
    name: "",
    model_no: "",
    description:"",
    finish: "",
    base_price:0,
    categoryId: "",
    subcategoryId: "",
    media:[]
  });
  const [selectedMedia,setSelectedMedia]=useState<MediaType | null>(null)
  const [uploading, setUploading] = useState<boolean>(false);

  const [submitting,setSubmitting]=useState<boolean>(false)
  const [selectedCatId,setSelectedCatId]=useState<string>('')
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [errors, setErrors] = useState<errorDataType>({
  name: "",
  model_no: "",
  base_price: "",
  description: "",
  finish: "",
  categoryId: "",
  subcategoryId: "",
  media: "",
})
  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = () => {
    const newErrors: errorDataType =  {
      name: "",
      model_no: "",
      base_price: "",
      description: "",
      finish: "",
      categoryId: "",
      subcategoryId: "",
      media: "",
    };

  if (!formData.name?.trim()) {
    newErrors.name = "Name is required";
  }

  // Model number
  if (!formData.model_no?.trim()) {
    newErrors.model_no = "Model number is required";
  }

  // Base price
  if (!formData.base_price) {
    newErrors.base_price = "Base price is required";
  } else if (
    isNaN(Number(formData.base_price)) ||
    Number(formData.base_price) <= 0
  ) {
    newErrors.base_price = "Enter a valid price";
  }

  // Description
  if (!formData.description?.trim()) {
    newErrors.description = "Description is required";
  }

  // finish
  if (!formData.finish?.trim()) {
    newErrors.finish = "Finish is required";
  } 

  // Category
  if (!formData.categoryId?.trim()) {
    newErrors.categoryId = "Category is required";
  }

  // Subcategory
  if (!formData.subcategoryId?.trim()) {
    newErrors.subcategoryId = "Subcategory is required";
  }

  // Media
  if (!formData.media || formData.media.length === 0) {
    newErrors.media = "At least one media file is required";
  }

    setErrors(newErrors);
    return Object.values(newErrors).every((v) => v === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const valid = isValid();
    if(valid){
    try {
      setSubmitting(true)
      if (!basePath) {
        throw new Error("API base PATH is missing. Check your .env file.");
      }

      if(productId){
        const res = await fetch(`${basePath}/api/product/updateProduct/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
        const errorText = await res.text(); // Read raw error response
        console.error("Server error response:", errorText);
        throw new Error(
          `Failed to update product: ${errorText || res.statusText}`
        );
        }
        showToast(true, "Product has been updated successfully!");
        // setTimeout(() => router.push("/admin/product/product-table"), 1000);
      }else{
      const res = await fetch(`${basePath}/api/product/createProduct`, {
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
      showToast(true, "Product has been created successfully!");
      // setTimeout(()=>router.push("/admin/product/product-table"),1000)
      }

      setFormData({
        name: "",
        model_no: "",
        description:"",
        finish:"",
        base_price:0,
        media: [],
        categoryId: "",
        subcategoryId: "",
      });

      setSelectedCatId('')
      setSelectedSubCatId('')
      setSelectedMedia(null)
    } catch (error:any) {
      console.error("Error creating product:", error);
      showToast(false,error);
    }finally{
      setSubmitting(false)
    }}else{
       showToast(false, "Check errors above.");
    }
  };

  useEffect(() => {
    const fetchs = async () => {
      try {
        const res = await getProduct(productId ?? '');
        const selectedCat=res.Category.id
        const selectedSubCat = res.Subcategory.id;
        const datas = {
          name: res.name,
          model_no: res.model_no,
          base_price:res.base_price,
          description: res.description,
          finish: res.finish || 1,
          categoryId: res.Category.id,
          subcategoryId: res.Subcategory.id,
          media: res.media
        };
        console.log(datas)
        setFormData(datas);
        setSelectedMedia(res.media[0] ?? null)
        setSelectedCatId(selectedCat)
        setSelectedSubCatId(selectedSubCat)
      } catch (error:any) {
        console.log(error,'err')
        showToast(false,'Product not found.')
        // router.push("/admin");
      }
    };
    if (productId) fetchs();
  }, [productId]);

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

   const handleDeleteButton = () => {
     setIsDeleteModalOpen(true);
   };

    const handleSlideChange = (currentIndex: number) => {
       const mediaItem = formData.media?.[currentIndex] || null;
       setSelectedMedia(mediaItem);
    };
    
    const handleUpload = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        if (event.target.files && event.target.files.length > 0) {
          const selectedFile = event.target.files[0];
          setFile(selectedFile);
          try {
            setUploading(true);
            const res = await uploadFile(selectedFile, "product");
            setFormData((prev)=>({...prev,media:[...prev.media, res]}))
            setSelectedMedia(res)
            showToast(true, "Media uploaded successfully");
          } catch (error) {
            showToast(false, "Error while uploading media.", error);
            console.error(`Media Upload failed: ${error}`);
          } finally {
            setUploading(false);
            event.target.value = "";
            sliderRef.current && sliderRef.current.slickGoTo(0);
            if(errors.media){
              setErrors((p)=>({...p,media:""}))
            }
          }
        }
      };

      const settings = {
         infinite: true,
         speed: 1000,
         arrows: false,
         dots: false,
         afterChange: handleSlideChange,
         autoplay: false,
         fade: true,
         slidesToShow: 1,
         slidesToScroll: 1,
       };
       
         const next = () => {
           if (sliderRef.current) {
             sliderRef.current.slickNext();
           }
         };

         const previous = () => {
           if (sliderRef.current) {
             sliderRef.current.slickPrev();
           }
         };

         const handleDelete = async () => {
           if (!selectedMedia) {
             showToast(false, "Media not selected.");
             return;
           }
           const mediaName = selectedMedia.url;
           const data = { fileName: mediaName };
           try {
             await deleteFile(data);
             setFormData((prev) => {
               const filtered = prev.media.filter(
                 (m) =>
                   m.url.toLowerCase()?.trim() !==
                   mediaName.toLowerCase()?.trim()
               );
               return {
                 ...prev,
                 media: filtered,
               };
             });

             showToast(
               true,
               "Media deleted. Please submit to update the product."
             );
           } catch (err: any) {
             showToast(false, "Failed to delete media.", err);
           } finally {
             sliderRef.current && sliderRef.current.slickGoTo(0);
           }
         };

  return (
    <DefaultLayout>
      {/* Page header navigation */}
      <Breadcrumb pageName="Add Product" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="absolute inset-0 z-50 w-10 h-10 opacity-0 cursor-pointer"
        accept="image/*,video/*"
      />
      <div className="w-full mx-auto">
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
                  error={errors.name}
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
                  error={errors.model_no}
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
                  error={errors.description}
                />

                {/* QR Count */}
                <InputGroup
                  label="Finish"
                  type="text"
                  placeholder="Enter Finish"
                  value={formData.finish}
                  onChange={(value) => handleChange("finish", (value))}
                  customClasses="mb-4.5"
                  error={errors.finish}
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
                  error={errors.base_price}
                />

                {/* Category Dropdown */}
                <SelectGroupOne
                  options={categoryOptions}
                  title="Category"
                  onSelectChange={(value) => handleChange("categoryId", value)}
                  selectedOption={selectedCatId}
                  setSelectedOption={setSelectedCatId}
                  error={errors.categoryId}
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
                  error={errors.subcategoryId}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative my-4 p-4 rounded-[10px] border border-stroke bg-white shadow-md">
          <div className="text-lg">Product Media</div>
          {errors.media && (
            <p className="text-red-400  my-1 text-sm font-medium">{errors.media}</p>
          )}
          <div className="flex flex-row items-center justify-start mb-4 gap-6">
            {/* upload button */}
            <div className="flex">
              <button
                type="button"
                disabled={uploading}
                onClick={handleUpload}
                className="mt-3 bg-primary px-5 py-2 rounded-lg cursor-pointer text-white flex flex-row justify-center gap-3 disabled:cursor-none disabled:bg-primary/70"
              >
                {formData.media.length > 0 ? "Upload More" : "Upload"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="white"
                  width={20}
                  height={20}
                >
                  <path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                </svg>
              </button>
            </div>

            <div className=" text-right flex justify-end">
              <button
                type="button"
                className="mt-3 bg-primary cursor-pointer  px-5 py-2 rounded-lg text-white flex flex-row justify-center gap-3 items-center"
                onClick={handleDeleteButton}
              >
                Delete
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  fill="white"
                  width={20}
                  height={20}
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="w-full mx-auto">
            <Slider ref={sliderRef} {...settings}>
              {formData.media.length > 0 &&
                formData.media.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="w-[230px] h-80 xl:bg-primary/10 rounded-lg"
                    >
                      {item.mediaType === "video" ? (
                        <video
                          src={`${basePath}${item.url}`}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={`${basePath}${item.url}`}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  );
                })}
            </Slider>
          </div>

          {formData.media.length == 0 && (
            <div className="w-full h-80 flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#EEE6EC] hover:border-primary cursor-pointer">
              <div
                onClick={handleUpload}
                className="relative flex flex-col items-center justify-center gap-2 h-full w-full"
              >
                {/* Invisible file input covering the entire area */}

                {/* Upload Icon */}
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-stroke bg-white z-10">
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

                {/* Upload Text */}
                <p className="text-sm font-medium text-gray-600 z-10">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 z-10">
                  Upload JPG, PNG, or MP4
                </p>
              </div>
            </div>
          )}

          {formData.media.length > 1 && (
            <>
              <button
                type="button"
                className="button cursor-pointer hover:bg-primary/10  w-6 h-6 md:w-8 md:h-8 xl:w-10 xl:h-10 border-2 border-[#BA6C8F] rounded-full absolute left-2 flex items-center justify-center top-[45%] md:top-[40%] xl:top-[45%]"
                onClick={previous}
              >
                <svg
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full  -translate-x-[5%]"
                >
                  <path
                    d="M15.4003 15.5147L22 22.1144L20.1144 24L11.6291 15.5147L20.1144 7.0295L22 8.9151L15.4003 15.5147Z"
                    fill="#BA6C8F"
                    fillOpacity="0.9"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="button cursor-pointer hover:bg-primary/10 w-6 h-6 md:w-8 md:h-8 xl:w-10 xl:h-10 border-2 border-[#BA6C8F] flex items-center justify-center rounded-full absolute right-2 top-[45%] md:top-[40%] xl:top-[45%]"
                onClick={next}
              >
                <svg
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  className="w-full h-full  translate-x-[5%]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5997 16.4853L11 9.88561L12.8856 8L21.3709 16.4853L12.8856 24.9705L11 23.0849L17.5997 16.4853Z"
                    fill="#BA6C8F"
                    fillOpacity="0.9"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="mt-6 w-full rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 transition hover:bg-hoverPrimary hover:cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {productId ? "Edit Product" : "Add Product"}
        </button>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        deletingQuery="this media"
        onConfirm={() => selectedMedia && handleDelete()}
        onCancel={() => {
          setIsDeleteModalOpen(false);
        }}
      />
    </DefaultLayout>
  );
}
