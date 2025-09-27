"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import useWithdrawals from "@/hooks/useWithdrawal";
import { sendPayment } from "../../../../../api/services/withdrawal.service";
import showToast from "../../../../../api/lib/showToast";
import { useDeleteModal } from "@/context/DeleteModalContext";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";


type Withdrawal = {
  id: string;
  userId: string;
  amount: string;
  status: string;
  referenceNo: string;
  upiId: string;
  createdAt: string;
  updatedAt: string;
};

export default function WithdrawalTable() {
  const { item, isOpen, openModal, closeModal } = useDeleteModal();

  const onConfirmDelete = async () => {
    try {
      // await deleteUser(item.id)
      // setUsers((p)=>{const val = p ? p?.filter((e)=>e.id.toString()!==item.id) : []
      //   if(!val)return []
      //   else return val
      // })
      showToast(true, `User ${item.name} deleted successfully`);
    } catch (err) {
      showToast(false, `Failed to delete user ${item.name}. \n        ${err}`);
    }
  };
  const [mounted, setMounted] = useState(false);

   const { data, isLoading, error } = useWithdrawals();
   const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Prevent hydration issues
  useEffect(() => setMounted(true), []);

  const columns = useMemo<MRT_ColumnDef<Withdrawal>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 120,
        Cell: ({ cell }) => (
          <div className="font-mono text-xs text-gray-600">
            {cell.getValue<string>()?.slice(0, 8)}...
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 100,
        Cell: ({ cell }) => (
          <div className="font-semibold text-green-600">
            ₹{parseInt(cell.getValue<string>()).toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>().toLowerCase();
          const statusConfig = {
            pending: {
              bg: "bg-yellow-50",
              text: "text-yellow-800",
              border: "border-yellow-200",
              icon: "⏳",
            },
            approved: {
              bg: "bg-green-50",
              text: "text-green-800",
              border: "border-green-200",
              icon: "✅",
            },
            rejected: {
              bg: "bg-red-50",
              text: "text-red-800",
              border: "border-red-200",
              icon: "❌",
            },
          };

          const config = statusConfig[status as keyof typeof statusConfig] || {
            bg: "bg-gray-50",
            text: "text-gray-800",
            border: "border-gray-200",
            icon: "❓",
          };

          return (
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
            >
              <span>{config.icon}</span>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          );
        },
      },
      {
        accessorKey: "referenceNo",
        header: "Reference",
        size: 130,
        Cell: ({ cell }) => (
          <div className="font-mono text-sm text-gray-800">
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: "upiId",
        header: "UPI ID",
        size: 150,
        Cell: ({ cell }) => (
          <div className="text-sm text-blue-600">{cell.getValue<string>()}</div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        size: 150,
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return (
            <div className="text-xs">
              <div className="font-medium text-gray-800">
                {date.toLocaleDateString("en-IN")}
              </div>
              <div className="text-gray-500">
                {date.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="flex justify-center gap-x-3">
            <button
              title="payment"
              className="p-2 disabled:text-red-600 text-green-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              disabled={isPaymentLoading}
              onClick={() => {
                console.log(row.original);
                payment(row.original);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-banknote-arrow-down-icon lucide-banknote-arrow-down"
              >
                <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                <path d="m16 19 3 3 3-3" />
                <path d="M18 12h.01" />
                <path d="M19 16v6" />
                <path d="M6 12h.01" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </button>
            <button
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete"
              onClick={() => {

                console.log("Delete clicked for:", row.original.id)
                openModal(row.original as any)
              }

              }
            >
              <svg
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                width={20}
                height={20}
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill="#D9D9D9"
                    d="M292.7 840h438.6l24.2-512h-487z"
                  ></path>{" "}
                  <path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z"></path>{" "}
                </g>
              </svg>

            </button>

          </div>
        ),
      },
    ],
    []
  );

  // Normalize data structure
  const [tableData, setTableData] = useState<Withdrawal[]>([]);

  useEffect(() => {
    console.log("AALLLL", data);
    if (data?.length) {
      setTableData(data);
    }
  }, [data]);

  //payment api call

  const payment = async (payload: Withdrawal) => {
    setIsPaymentLoading(true);
    const { upiId, userId, amount } = payload;
    //api will call
    console.log("BBBBBBBBBBBBBBBBBBB", upiId, userId, amount);
    try {
      await sendPayment(userId, upiId, parseInt(amount));
      showToast(true, "Payment done successfully!!!");
    } catch (e: any) {
      showToast(false, e.message);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // Early return for mounting state
  if (!mounted) return <div />;


  // Error state
  if (error) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Withdrawals" />
        <div className="bg-white rounded-lg shadow-sm p-8 !font-poppins">
          <div className="text-center py-12">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load withdrawals
            </h3>
            <p className="text-gray-600 mb-4">
              Something went wrong while fetching the data
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <Breadcrumb pageName="Withdrawals" />

        {/* Responsive Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 !font-poppins">
          <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow-sm border p-2">
            <div className="text-xs sm:text-sm text-gray-600 mb-1 !font-poppins">
              Total Requests
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 !font-poppins">
              {tableData.length}
            </div>
          </div>
          <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow-sm border p-2">
            <div className="text-xs sm:text-sm text-gray-600 mb-1 !font-poppins">
              Pending
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 !font-poppins">
              {tableData.filter((item) => item.status === "pending").length}
            </div>
          </div>
          <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow-sm border p-2">
            <div className="text-xs sm:text-sm text-gray-600 mb-1 !font-poppins">
              Approved
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 !font-poppins">
              {tableData.filter((item) => item.status === "approved").length}
            </div>
          </div>
          <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow-sm border p-2">
            <div className="text-xs sm:text-sm text-gray-600 mb-1 !font-poppins">
              Rejected
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 !font-poppins">
              {tableData.filter((item) => item.status === "rejected").length}
            </div>
          </div>
          <div className="bg-white sm:p-4 lg:p-6 rounded-lg shadow-sm border col-span-2 sm:col-span-2 lg:col-span-1 p-2 mb-3">
            <div className="text-xs sm:text-sm text-gray-600 mb-1 !font-poppins">
              Total Amount
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 !font-poppins">
              ₹
              {tableData
                .reduce((sum, item) => sum + parseInt(item.amount), 0)
                .toLocaleString()}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden !font-poppins">
          <MaterialReactTable
            columns={columns}
            data={tableData}
            enableRowActions={false} // Disabled to prevent duplicate actions
            initialState={{
              pagination: {
                pageSize: 10,
                pageIndex: 0,
              },
              sorting: [
                {
                  id: "createdAt",
                  desc: true,
                },
              ],
            }}
            muiTableProps={{
              sx: {
                "& .MuiTableHead-root": {
                  backgroundColor: "#f8fafc",
                },
                "& .MuiTableCell-head": {
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e5e7eb",
                },
                "& .MuiTableCell-body": {
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #f3f4f6",
                },
                "& .MuiTableRow-root:hover": {
                  backgroundColor: "#f9fafb",
                },
              },
            }}
            muiPaginationProps={{
              shape: "rounded",
              variant: "outlined",
            }}
            enableColumnFilters
            enableGlobalFilter
            enableSorting
            enablePagination
            enableBottomToolbar
            enableTopToolbar
            muiSearchTextFieldProps={{
              placeholder: "Search withdrawals...",
              variant: "outlined",
              size: "small",
            }}
            state={{
              isLoading: isLoading,
            }}
            muiSkeletonProps={{
              animation: "wave",
            }}
            muiCircularProgressProps={{
              style: {
                color: "#4F033D",
              },
            }}
          />
        </div>
      </div>
      <DeleteModal
        isOpen={isOpen}
        onConfirm={onConfirmDelete}
        onCancel={closeModal}
        deletingQuery="withdrawals"
        deletingField={item?.upiId ?? ""}
      />
    </DefaultLayout>
  );
}
