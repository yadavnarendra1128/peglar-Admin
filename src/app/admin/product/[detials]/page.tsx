import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import CourseInfo from "@/components/Admin/CourseInfo";

const Page = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Course" />

        <CourseInfo />
      </div>
    </DefaultLayout>
  );
};

export default Page;
