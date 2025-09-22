import ECommerce from "@/components/Admin/Dashboard/E-commerce";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import React from "react";

export default function Home() {
  return (
    <>
       <DefaultLayout> 
        <ECommerce />
      </DefaultLayout>
    </>
  );
}