"use client";

import { useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { useProductsQr } from "@/hooks/useProductsQr";

type QrCode = {
  id: string;
  qr_value: string;
};

export default function PaginationTestPage() {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch paginated data
  const { data, isLoading } = useProductsQr(
    pagination.pageIndex + 1,
    pagination.pageSize
  );

  const qrData: QrCode[] = data?.data || [];

  const columns: MRT_ColumnDef<QrCode>[] = [
    {
      accessorFn: (_row, index) =>
        pagination.pageIndex * pagination.pageSize + index + 1,
      header: "Sr. No.",
      size: 60,
    },
    {
      accessorKey: "qr_value",
      header: "QR Value",
      size: 120,
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Pagination Test" />
      <MaterialReactTable
        columns={columns}
        data={qrData}
        manualPagination // enables backend pagination mode
        onPaginationChange={setPagination} // updates pagination state
        state={{
          pagination,
          isLoading,
        }}
        rowCount={data?.total || 0} // total rows from backend
        enableBottomToolbar // shows bottom pagination
        enablePagination // ensures pagination UI is visible
        muiTablePaginationProps={{
          rowsPerPageOptions: [10, 20, 50, 100], // user can change page size
          showFirstButton: true,
          showLastButton: true,
        }}
      />
    </DefaultLayout>
  );
}
