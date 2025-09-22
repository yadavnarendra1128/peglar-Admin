"use client";
import React, { useState } from "react";
import Image from "next/image";
import CheckboxTwo from "../FormElements/Checkboxes/CheckboxTwo";
import Link from "next/link";

const CourseInfo = () => {
  return (
    <>
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src="/images/cover/cover-01.png"
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5 flex justify-between mt-5">
          <div className="relative z-30 h-30 w-full  rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              <Image
                src="/img/course-hero-image.png"
                alt="course-image"
                width={744}
                height={650}
                className="rounded"
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-5 font-bold text-dark dark:text-white text-[24px] md:text-[28px] text-right">
              Love Manifestation Ritual Workshop
            </h3>
            <p className="font-medium text-[16px] md:text-[20px] text-right">
              ₹999
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10 mb-5" style={{ margin: "0 20px" }}>
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Videos:
            </span>{" "}
            <span className="flex justify-end gap-10">
              {[
                { title: "Title1", link: "https://drive.google.com/drive/" },
                { title: "Title2", link: "https://drive.google.com/drive/" },
                { title: "Title3", link: "https://drive.google.com/drive/" },
              ].map((course, idx) => {
                return (
                  <Link
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "darkblue", textDecoration: "underline" }}
                  >
                    {course.title}
                  </Link>
                );
              })}
            </span>
          </p>
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Option:
            </span>{" "}
            Numerology
          </p>

          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Tag:
            </span>{" "}
            Best Seller
          </p>
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Type:
            </span>{" "}
            Recorded
          </p>
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Duration:
            </span>{" "}
            10 hours
          </p>
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Time Slot:
            </span>{" "}
            Monday - Friday
          </p>
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Resourses:
            </span>{" "}
            <span className="flex justify-end gap-10">
              {[
                { title: "Resourse1", link: "https://drive.google.com/drive/" },
                { title: "Resourse2", link: "https://drive.google.com/drive/" },
                { title: "Resourse3", link: "https://drive.google.com/drive/" },
              ].map((course, idx) => {
                return (
                  <Link
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "darkblue", textDecoration: "underline" }}
                  >
                    {course.title}
                  </Link>
                );
              })}
            </span>
          </p>

          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Description:
            </span>{" "}
            <span
              className="w-1/2"
              style={{ width: "50%", textAlign: "right" }}
            >
              Discover the transformative power of love manifestation rituals at
              our workshop. Dive deep into techniques that can truly change your
              life and bring love into every aspect of your being.
            </span>
          </p>
          <p className="text-[16px] md:text-[20px] flex justify-between gap-10">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Guru:
            </span>{" "}
            Abhishek Ji
          </p>
        </div>
      </div>
    </>
  );
};

export default CourseInfo;
