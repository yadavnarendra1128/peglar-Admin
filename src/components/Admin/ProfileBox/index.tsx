"use client";
import React, { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import { getUserById, updateUser } from "@/api/services/base.service";
import showToast from "@/api/lib/showToast";
import { useMutation } from "@tanstack/react-query";
import { basePath } from "../../../../api/lib/apiClient";
import { ShieldCheck,ShieldX } from 'lucide-react';
import { sendNotification } from "@/api/services/notify.service";

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
    mutationFn: async (id: string) => {
      const res = await updateUser(id, { isVerified: true });
      await sendNotification({
        userId: id,
        title: "Updates",
        message: "Profile Verified",
      });
      return res;
    },
    onSuccess: (data) => {
      setUser(data)
      showToast(true, "Profile verified and notification sent successfully");
    },
    onError: (error: any) => {
      showToast(
        false,
        "Error : " + error.message
      );
    },
  });

  return (
    <>
      <div className="overflow-hidden rounded-[10px] pb-20 mb-10 bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
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
                src={
                  user?.profileImg
                    ? `${basePath}${user.profileImg}`
                    : "/images/user/user-03.png"
                }
                className="overflow-hidden rounded-full"
                alt="profile"
              />
            </div>
          </div>
          {(user?.email || user?.name) && (
            <div className="mt-4">
              {user?.name && (
                <div className="flex items-center justify-center gap-2">
                  <h3 className="mb-1 text-heading-5 font-bold text-dark dark:text-white text-[24px] md:text-[28px]">
                    {user?.name}
                  </h3>
                  {user?.userType === "carpenter" && (
                    <div>
                      {user?.isVerified ? (
                        <ShieldCheck className="text-green-500" />
                      ) : (
                        <ShieldX />
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

          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 ">Wallet:</span>{" "}
            <span
              className="w-1/2 capitalize"
              style={{ width: "50%", textAlign: "right" }}
            >
              {user?.wallet_balance}
            </span>
          </p>

          {user?.userType == "carpenter" && (
            <p className="hidden text-[16px] md:text-[20px] md:flex justify-between gap-10">
              <span className="font-medium text-gray-700 ">Aadhar Number:</span>{" "}
              <span
                className="w-1/2 capitalize"
                style={{ width: "50%", textAlign: "right" }}
              >
                {user?.aadhar?.aadharNumber}
              </span>
            </p>
          )}

          {user?.userType == "carpenter" && (
            <p className="hidden text-[16px] md:text-[20px] md:flex justify-between gap-10">
              <span className="font-medium text-gray-700 ">Pan Number:</span>{" "}
              <span
                className="w-1/2 capitalize"
                style={{ width: "50%", textAlign: "right" }}
              >
                {user?.panDetail?.panNumber}
              </span>
            </p>
          )}
        </div>

        {user?.userType == "carpenter" && (
          <div className="w-full my-2 md:my-8 flex flex-col md:flex-row gap-4 md:gap-2">
            <p className="px-5 md:hidden text-[16px] md:text-[20px] flex justify-between gap-10">
              <span className="font-medium text-gray-700 ">Aadhar Number:</span>{" "}
              <span
                className="w-1/2 capitalize"
                style={{ width: "50%", textAlign: "right" }}
              >
                {user?.aadhar?.aadharNumber}
              </span>
            </p>
            <div className="relative flex flex-col items-center w-full md:w-[45%] h-auto md:h-100 mx-auto">
              <img
                src={
                  user?.aadhar?.aadharImage
                    ? `${basePath}${user.aadhar?.aadharImage}`
                    : "/images/user/user-03.png"
                }
                alt="aadhar"
                className="w-full h-full object-contain p-2 rounded"
              />
              <a
                href={
                  user?.aadhar?.aadharImage
                    ? `${basePath}${user.aadhar?.aadharImage}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="md:absolute md:-bottom-10 mt-1 rounded-lg text-md text-white bg-primary hover:bg-hoverPrimary px-4 py-2"
              >
                View Aadhar
              </a>
            </div>

            <p className="px-5 md:hidden text-[16px] md:text-[20px] flex justify-between gap-10">
              <span className="font-medium text-gray-700 ">Pan Number:</span>{" "}
              <span
                className="w-1/2 capitalize"
                style={{ width: "50%", textAlign: "right" }}
              >
                {user?.panDetail?.panNumber}
              </span>
            </p>
            <div className="relative flex flex-col items-center w-full h-auto md:h-100 md:w-[45%] mx-auto">
              <img
                src={
                  user?.panDetail?.panImage
                    ? `${basePath}${user?.panDetail?.panImage}`
                    : "/images/user/user-03.png"
                }
                alt="pan"
                className="w-full h-full object-contain p-2 rounded"
              />
              <a
                href={
                  user?.panDetail?.panImage
                    ? `${basePath}${user?.panDetail?.panImage}`
                    : "#"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 md:absolute md:-bottom-10 rounded-lg text-md text-white bg-primary hover:bg-hoverPrimary px-4 py-2"
              >
                View Pan
              </a>
            </div>
          </div>
        )}

        {user?.userType == "carpenter" && !user?.isVerified && (
          <div className="px-4 py-6 w-full">
            <button
              onClick={() => verificationMutation.mutate(id)}
              disabled={verificationMutation.isPending}
              className="disabled:bg-primary/70 mt-3 flex w-[50%] sm:w-full lg:w-[30%] xl:w-[30%] md:w-[30%] justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 h-fit"
            >
              {verificationMutation.isPending
                ? "Verifying......"
                : "Verify Profile"}
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
