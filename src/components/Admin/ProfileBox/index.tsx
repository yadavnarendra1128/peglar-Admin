"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import { getUserById } from "../../../../api/services/base.service";
import showToast from "../../../../api/lib/showToast";
import { useMutation } from "@tanstack/react-query";
import { profileVerification } from "@/api/services/base.service";
import { basePath } from "../../../../api/lib/apiClient";
const ProfileBox = () => {
  const params = useParams()
  const id = params.id as string;
  const [user,setUser]=useState<User | null>(null)
  const [tags, setTags] = useState<string[]>([]);
  const pages = [
    "User",
    "Course",
    "Blog",
    "Offer",
    "Guru's",
    "Certificate",
    "Testimonials",
  ];

  const handleCheckboxChange = (tag: string, isChecked: boolean) => {
    setTags(
      (prevTags) =>
        isChecked
          ? [...prevTags, tag] // Add tag
          : prevTags.filter((t) => t !== tag) // Remove tag
    );
  };

  const removeTag = (tag: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    console.log("Selected Pages:", tags);
  };

  useEffect(()=>{
    const fetchUser=async()=>{
      try{
        const res = await getUserById(id)
        console.log(res)
        setUser(res)
      }catch(err){
        showToast(false,`Failed to view user. \n ${err}`)
      }
    }
    if(id){
      fetchUser()
    }
  },[id])
 const verificationMutation = useMutation({
   mutationFn: (id: string) => profileVerification(id),
   onSuccess: (data) => {
     showToast(true, "Profile verified successfully");
   },
   onError: (error) => {
     showToast(false, "Error in verification:" + error);
   },
 });
  return (
    <>
      <div className="overflow-hidden rounded-[10px] pb-8 bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={"/images/cover/cover-01.png"}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <img
                src={user?.profileImg || "/images/user/user-03.png"}
                className="overflow-hidden rounded-full"
                alt="profile"
              />
            </div>
          </div>
          {(user?.email || user?.name) && (
            <div className="mt-4">
              {user?.name && (
                <div className="flex items-center justify-center gap-1">
                  <h3 className="mb-1 text-heading-5 font-bold text-dark dark:text-white text-[24px] md:text-[28px]">
                    {user?.name}
                  </h3>
                  {user?.userType === "carpenter" && (
  <div>
    {user?.isVerified ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2bb13a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="red"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="M9 10l6 6" />
        <path d="M15 10l-6 6" />
      </svg>
    )}
  </div>
)}
                </div>
              )}
              {user?.email && (
                <p className="font-medium text-[16px] md:text-[20px]">
                  {user?.email}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mb-5" style={{ margin: "0 20px" }}>
          {user?.phone && (
            <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
              <span className="font-medium text-gray-700 ">Mobile:</span>{" "}
              {user?.phone}
            </p>
          )}

          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 ">User Type:</span>{" "}
            <span
              className="w-1/2 capitalize"
              style={{ width: "50%", textAlign: "right" }}
            >
              {user?.userType}
            </span>
          </p>

          {/* {user?.userType == "carpenter" && (
            <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
              <span className="font-medium text-gray-700 ">isVerified:</span>{" "}
              <span
                // className="w-1/2 capitalize"
                style={{ width: "50%", textAlign: "right" }}
              >
                {String(user?.isVerified)}
              </span>
            </p>
          )} */}
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 ">Wallet:</span>{" "}
            <span
              className="w-1/2 capitalize"
              style={{ width: "50%", textAlign: "right" }}
            >
              {user?.wallet_balance}
            </span>
          </p>
        </div>
<div className="w-full flex justify-center gap-2 items-center">
  {/* ✅ First Image */}
  <img
   src={
    user?.aadhar?.aadharImage
      ? `${basePath}${user.aadhar?.aadharImage}`
      : "/images/user/user-03.png"
  }
    alt="profile cover"
    className="w-[45%] h-auto object-contain"
  />

  {/* ✅ Second Image */}
    <img
       src={
    user?.panDetail?.panImage
      ? `${basePath}${user?.panDetail?.panImage}`
      : "/images/user/user-03.png"
  }
      className="w-[45%] h-auto object-contain"
      alt="profile"
    />
</div>


        {/* Checkbox Section */}
        {/* <div className="px-4 py-6">
          <h4 className="text-xl font-bold mb-4">Select Pages:</h4>
          <div className="flex flex-wrap gap-2">
            {pages.map((tag) => (
              <CheckboxTwo
                key={tag}
                label={tag}
                isChecked={tags.includes(tag)}
                onChange={(isChecked) => handleCheckboxChange(tag, isChecked)}
              />
            ))}
          </div>
        </div> */}

        {/* Tag Display Section */}
        {/*
        <div className="px-4 py-6">
          <div className="w-full min-h-[100px] border rounded-lg p-4 bg-gray-100 dark:bg-gray-700 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-stroke text-primary px-3 py-1 rounded-full flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  className="text-red-500 font-bold ml-2"
                  onClick={() => removeTag(tag)}
                >
                  &times;
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <p className="text-gray-500 ">
                No pages selected.
              </p>
            )}
          </div>
        </div>
      */}

        {!user?.isVerified && (
          <div className="px-4 py-6 w-full">
            <button
              onClick={() => verificationMutation.mutate(id)}
              disabled={verificationMutation.isPending}
              className="disabled:bg-primary/70 mt-3 flex w-[50%] sm:w-full lg:w-[30%] xl:w-[30%] md:w-[30%] justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit"
            >
              {verificationMutation.isPending
                ? "Verifying......"
                : "Profile verify"}
            </button>
          </div>
        )}
        {/* Submit Button */}
        {/* <div className="px-4 py-6">
          <button
            onClick={handleSubmit}
            className="mt-3 flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit"
          >
            Give Permission
          </button>
        </div> */}
      </div>
    </>
  );
};

export default ProfileBox;
