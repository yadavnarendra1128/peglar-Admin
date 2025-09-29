import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import Signin from "@/components/Admin/Auth/Signin";

export const metadata: Metadata = {
  title: "Peglar Admin login",
  description: "This is Next.js Login Page NextAdmin Dashboard Kit",
};

const SignIn: React.FC = () => {
  return (
    <>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="w-full  flex justify-center rounded-[10px]  shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-col md:flex-row w-[90vw] max-w-[1124px] h-screen md:justify-between gap-4 items-center">
          <div className="p-4 lg:p-7.5 w-full md:w-[40%] lg:w-1/2">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl lg:px-7.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
              <Link className="mb-10 inline-block" href="/">
                Peglar
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Sign in to your account
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Welcome Back!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Please sign in to your account by completing the necessary
                fields below
              </p>

              <div className="hidden md:block">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-[60%] lg:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signin />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
