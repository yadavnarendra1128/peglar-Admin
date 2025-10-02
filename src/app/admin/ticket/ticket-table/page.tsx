'use client'
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import { useDeleteModal } from "@/context/DeleteModalContext";
import { useTickets } from "@/hooks/useTickets";
import { Typography } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useCallback, useMemo, useState } from "react";

type QrTicketType = {
  id: string;
  userId: string;
  title: string;
  description: string;
  qrValue: string;
  status: boolean;
  ticketType: "qr-report";
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function Page(){
    const [selectedTicket,setSelectedTicket]=useState<QrTicketType | null>(null)
    const {isError,data,isLoading,error}=useTickets()
    const {item,isOpen,openModal,closeModal}=useDeleteModal()

    const handleTicket = (row:MRT_Row<QrTicketType>)=>{
      const ticket = row.original
      setSelectedTicket(ticket)
    }

    const handleDelete = useCallback((row: MRT_Row<QrTicketType>) => {
        console.log("Locally deleting product:", row.original.id);
        openModal(row.original as any);
      }, []);

    const onConfirmDelete = async () => {
    //   try {
    //     await deleteProduct(item.id);
    //     setData((p) => p.filter((e) => e.id.toString() !== item.id));
    //     showToast(true, `Product ${item.name} deleted successfully`);
    //   } catch (err) {
    //     showToast(
    //       false,
    //       `Failed to delete product ${item.name}. \n        ${err}`
    //     );
    //   }
    };

    const columns = useMemo<MRT_ColumnDef<QrTicketType>[]>(
      () => [
        {
          header: "Sr. No.",
          size: 70,
          Cell: ({ row }) => row.index + 1,
        },
        { accessorKey: "title", header: "Title", size: 240 },
        { accessorKey: "description", header: "Description", size: 300 },
        {
          accessorKey: "status",
          header: "Status",size:100,
          Cell: ({ cell }) => (cell.getValue() ? "Active" : "Inactive"),
        },
        // {
        //   accessorKey: "ticketType",
        //   header: "Type",
        // },
        {
          accessorKey: "createdAt",
          header: "Created At",
          size: 180,
          Cell: ({ cell }) =>
            cell.getValue<string>()
              ? new Date(cell.getValue<string>()).toLocaleString()
              : "-",
        },
        {
          id: "actions",
          header: "Actions",
          size: 200,
          Cell: ({ row }) => (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              {/* View Action */}
              <button
                onClick={() => handleTicket(row)}
                style={{
                  background: "#28a745",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View
              </button>
              
              <button
                onClick={() => handleDelete(row)}
                style={{
                  background: "#ff4d4d",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ),
        },
      ],
      [data]
    );

     const renderContent = () => {
        if (isError) {
          return (
            <Typography color="error" sx={{ p: 2 }}>
              Failed to load tickets: {error?.message}
            </Typography>
          );
        }
        if ((!productsData.length) && (!isLoading)) {
          return (
            <Typography sx={{ p: 2, textAlign: "center" }}>
              No tickets found.
            </Typography>
          );
        }
        return (
          <MaterialReactTable
            columns={columns}
            data={productsData}
            initialState={{ pagination: { pageSize: 100, pageIndex: 0 } }}
            enableColumnResizing
            muiTableProps={{ sx: { border: "1px solid #ccc" } }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                borderBottom: "2px solid #ccc",
              },
            }}
            muiTableBodyCellProps={{ sx: { borderBottom: "1px solid #e0e0e0" } }}
            muiTableBodyRowProps={({ row }) => ({
              sx: {
                backgroundColor: row.index % 2 === 0 ? "#fafafa" : "white",
                "&:hover": { backgroundColor: "#f0f0f0" },
              },
            })}
            state={{
              isLoading:isLoading
            }}
            muiSkeletonProps={{
              animation: "wave",
    
            }}
            muiCircularProgressProps={{
              style: {
                color: "#4F033D"
              }
            }}
          />
        );
      };

    const productsData: QrTicketType[] = useMemo(() => {
        if (!data || data.length==0) return [];
        return data.map((product: QrTicketType) => ({
          ...product
        }))
      }, [data])
    
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Ticket Table" />
        {renderContent()}
        <DeleteModal
          isOpen={isOpen}
          onConfirm={onConfirmDelete}
          onCancel={closeModal}
          deletingQuery="ticket"
          deletingField={item?.name ?? ""}
        />
      </DefaultLayout>
    );
}