// src/app/admin/users/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { Typography } from "@mui/material";
import { useDeleteModal } from "@/context/DeleteModalContext";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";
import showToast from "../../../../api/lib/showToast";
import { BackendUser, deleteUser } from "@/api/services/base.service";

type TableUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: string;
  isVerified: boolean;
  lifetime_earning: string;
  createdAt: string;
  profileImg?: string | null;
};

export default function UserTable() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useUsers();
  const {item,isOpen,openModal,closeModal}=useDeleteModal()
  const [users,setUsers]=useState<BackendUser[]>()

  const onConfirmDelete=async()=>{
    try{
      await deleteUser(item.id)
      setUsers((p)=>{const val = p ? p?.filter((e)=>e.id.toString()!==item.id) : []
        if(!val)return []
        else return val
      })
      showToast(true,`User ${item.name} deleted successfully`)
    }catch(err){
      showToast(false, `Failed to delete user ${item.name}. \n        ${err}`);
    }
  }

  const handleDelete = (row: MRT_Row<TableUser>) => {
    console.log("Delete clicked for:", row.original);
    openModal(row.original as any)
  };

  const handleView = (row: MRT_Row<TableUser>)=>{
    console.log("View clicked for:", row.original);
    router.push(`/admin/user/${row.original.id}`)
  }

  const columns = useMemo<MRT_ColumnDef<TableUser>[]>(
    () => [
      {
        id: "srno",
        header: "Sr. No.",
        size: 60,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row }) => row.index + 1, // simply shows row number
      },
      { accessorKey: "name", header: "Name", size: 220 },
      {
        accessorKey: "email",
        header: "Email Address",
        size: 260,
        Cell: ({ cell }) => cell.getValue<string>() || "-", // display dash if empty
      },
      {
        accessorKey: "phone",
        header: "Mobile No",
        size: 180,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 200,
        Cell: ({ cell }) => {
          const v = cell.getValue<string>();
          const dt = v ? new Date(v) : null;
          return dt ? dt.toLocaleString() : "-";
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 160,
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
              onClick={() => handleView(row)}
              title="View User"
              style={{
                background: "#4F9DFF",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              View
            </button>
            {/* Delete Action */}
            <button
              onClick={() => handleDelete(row)}
              title="Delete User"
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
    []
  );

  const tableData: TableUser[] = useMemo(() => {
      // console.log(users)
      if (!users) return [];
      return users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email ?? "",
        phone: u.phone ?? "",
        userType: u.userType,
        isVerified: u.isVerified,
        lifetime_earning: u.lifetime_earning ?? "0.00",
        createdAt: u.createdAt,
        profileImg: u.profileImg ?? null,
      }));
    }, [users]);

  useEffect(()=>{
    setUsers(data)
  },[data])

  return (
    <DefaultLayout>
      {/* Page header with breadcrumb navigation */}
      <Breadcrumb pageName="User Table" />

      {
        isError ? (
          // Error state
          <Typography color="error" sx={{ p: 2 }}>
            Failed to load users: {error?.message}
          </Typography>
        ) : (
          // Data table
          <MaterialReactTable
            columns={columns}
            data={tableData}
            initialState={{
              pagination: { pageSize: 5, pageIndex: 0 },
            }}
            enableColumnResizing
            muiTableProps={{
              sx: {
                border: "1px solid #ccc",
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                borderBottom: "2px solid #ccc",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                borderBottom: "1px solid #e0e0e0",
              },
            }}
            muiTableBodyRowProps={({ row }) => ({
              sx: {
                backgroundColor: row.index % 2 === 0 ? "#fafafa" : "white",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              },
            })}
            state={{
              isLoading: isLoading
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
        )}
        <DeleteModal isOpen={isOpen} onConfirm={onConfirmDelete} onCancel={closeModal} deletingQuery='user' deletingField={item?.name ?? ''}/>
    </DefaultLayout>
  );
}
