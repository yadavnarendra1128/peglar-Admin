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
    pageSize: 5,
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
  manualPagination
  onPaginationChange={setPagination}
  state={{
    pagination,
    isLoading,
  }}
  rowCount={data?.total || 0}
  enableBottomToolbar
  enablePagination={false} // hides default pagination
  renderBottomToolbarCustomActions={() => (
    <div className="flex gap-2 items-center">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() =>
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(prev.pageIndex - 1, 0),
          }))
        }
        disabled={pagination.pageIndex === 0}
      >
        Prev
      </button>
      <span>
        Page {pagination.pageIndex + 1} of{" "}
        {Math.ceil((data?.total || 0) / pagination.pageSize)}
      </span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() =>
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.min(
              prev.pageIndex + 1,
              Math.ceil((data?.total || 0) / prev.pageSize) - 1
            ),
          }))
        }
        disabled={
          pagination.pageIndex + 1 >=
          Math.ceil((data?.total || 0) / pagination.pageSize)
        }
      >
        Next
      </button>
    </div>
  )}
/>

    </DefaultLayout>
  );
}
