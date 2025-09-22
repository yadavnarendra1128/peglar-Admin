import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Admin/Tables/TableOne";
import TableThree from "@/components/Admin/Tables/TableThree";
import TableTwo from "@/components/Admin/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
