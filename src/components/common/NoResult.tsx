import React from "react";
import { similerCoursesData } from "./Helper";
// import CourseCard from "../course-details/CourseCard";
// import SearchButton from "../SearchButton";

export default function NoResult() {
  return (
    <>
      <div className="pt-36 w-full px-4 md:px-[250px]">
        <h1 className="text-[#AB185A] text-[1.5rem] md:text-[2.5rem] font-salernomi md:text-center">
          “No results found”
        </h1>
        <p className="text-[#BA6C8FE5] text-[1rem] font-gilroyMedium mt-4 md:text-center">
          It looks like we don't have any courses available for this search.
          <br className="hidden md:block" />
          Please try a different keyword or explore other categories.
        </p>

        <div className="flex flex-row items-center justify-between w-full mt-20 md:mt-32">
          <p className="text-[#AB185A] text-[2.5rem] font-salernomi text-center">
            Featured Courses
          </p>
          <span className="hidden md:block">
            {/* <SearchButton title="Explore Courses" /> */}
          </span>
        </div>
        <div className="w-full grid grid-cols-2 md:grid-cols-4 mt-[19px] gap-2">
          {/* {similerCoursesData.slice(0, 8).map((item, index) => (
            // <CourseCard key={index} item={item} />
          ))} */}
        </div>
        <span className="block md:hidden mt-4 mx-auto">
          {/* <SearchButton title="Explore Courses" /> */}
        </span>
      </div>
    </>
  );
}
