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
import { useCarpenters, useUsers } from "@/hooks/useUsers";
import { Typography } from "@mui/material";
import { useDeleteModal } from "@/context/DeleteModalContext";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";
import showToast from "../../../../api/lib/showToast";
import { BackendUser, deleteUser } from "@/api/services/base.service";
import { formatDateTime } from "@/utils/formatDateTime";
import Notfication from "@/components/Admin/users/sendNotify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/lib/apiClient";
import { sendNotifications } from "@/api/services/notify.service";
import NotficationModal from "@/components/Admin/users/sendNotify";
import NotificationModal from "@/components/Admin/users/sendNotify";

type TableUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: string;
  aadharDetails?: { aadharNumber: string; aadharImage: string };
  panDetails?: { panNumber: string; pamImage: string };
  isVerified: boolean;
  lifetime_earning: string;
  createdAt: string;
  profileImg?: string | null;
  fcm?: string | null
};

export default function UserTable() {
  const qc = useQueryClient()
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState({})
  const [isUpdate, setIsUpdate] = useState(false)
  const { data, isLoading, isError, error } = useUsers();
  const { data:carpenterData, isLoading:carpIsLoading, isError:carpIsError, error:carpError } = useCarpenters();
  const {item,isOpen,openModal,closeModal}=useDeleteModal()
  const [users,setUsers]=useState<BackendUser[]>()
  const [carps, setCarps] = useState<BackendUser[]>();
  const [selected,setSelected]=useState<'user'|'carpenter'>('user')
  const [formData, setFormData] = useState({
    body: "", title: "",
    imageUrl: ""
  })

  const onConfirmDelete = async () => {
    try {
      await deleteUser(item.id)
      setUsers((p) => {
        const val = p ? p?.filter((e) => e.id.toString() !== item.id) : []
        if (!val) return []
        else return val
      })
      showToast(true, `User ${item.name} deleted successfully`)
    } catch (err) {
      showToast(false, `Failed to delete user ${item.name}. \n        ${err}`);
    }
  }

  const handleDelete = (row: MRT_Row<TableUser>) => {
    console.log("Delete clicked for:", row.original);
    openModal(row.original as any)
  };

  const handleView = (row: MRT_Row<TableUser>) => {
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
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
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
            {/* Verified tick */}
            {row.original.isVerified && (
              <span
                title="Verified"
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                ✓
              </span>
            )}
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
                background: "#4F9DFF",
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
      const list = selected === "user" ? users : carps;
      if (!list) return [];
      return list.map((u) => ({
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
    }, [users,carps,selected]);

  useEffect(()=>{
    setUsers(data)
    setCarps(carpenterData)
  },[data,carpenterData])

  useEffect(() => {
    if (!Object.keys(rowSelection).length)
      return

    // const fcmList=UserTable.filter((x,index:number)=>{
    //   if(index===id[index]){
    //     return x
    //   }


    console.log(rowSelection, Object.keys(rowSelection).length)

  }, [rowSelection])

  const sendMessage = async () => {
    if (!Object.keys(rowSelection).length)
      throw new Error("please select user" + Object.keys(rowSelection));

    if ((!formData.body) && (!formData.title)) {
      throw new Error("please  enter information properly");
    }
    const token: string[] = []
    const id = (Object.keys(rowSelection)).map(x => parseInt(x))
    console.log(rowSelection)
    for (let r = 0; r < tableData.length; r++) {
      const dataIndex = id[r];
      const fcmToken = tableData[dataIndex]?.fcm;
      // console.log("DDDD", fcmToken)
      if (fcmToken) token.push(fcmToken);
    }

    const apiPayload = {
      ...formData,
      tokens: token,
    };
    console.log(apiPayload)

    notfiyMutation.mutate(apiPayload)
  }


  const notfiyMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      body: string;
      tokens: string[];
      imageUrl: string
    }) => sendNotifications(payload)
    ,
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ["notifcation"] });
      setIsUpdate(false)
      console.log(data)
      showToast(true, "notification sent successfully")
    },
    onError: (error) => {
      console.error('notifcation failed:', error)
      showToast(false, error.message)
    },
  });
  return (
    <DefaultLayout>
      {/* Page header with breadcrumb navigation */}
      <Breadcrumb pageName="User Table" />

      <div className="flex gap-2 mb-2 items-center">
        <button
          className={`px-4 py-2 rounded-lg cursor-pointer ${
            selected === "user"
              ? "bg-primary border border-primary text-white hover:border-hoverPrimary hover:bg-hoverPrimary"
              : "border border-primary text-primary hover:bg-primary/10 hover:text-white"
          }`}
          onClick={() => setSelected("user")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 rounded-lg cursor-pointer ${
            selected === "carpenter"
              ? "bg-primary border border-primary text-white hover:border-hoverPrimary hover:bg-hoverPrimary"
              : "border border-primary text-primary hover:bg-primary/10 hover:text-white"
          }`}
          onClick={() => setSelected("carpenter")}
        >
          Carpenters
        </button>
      </div>

      {(selected === "user" && isError) ||
      (selected === "carpenter" && carpIsError) ? (
        <Typography color="error" sx={{ p: 2 }}>
          Failed to load {selected === "user" ? "users" : "carpenters"}:{" "}
          {selected === "user" ? error?.message : carpError?.message}
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
            isLoading: selected === "user" ? isLoading : carpIsLoading,
            rowSelection,
          }}
          muiSkeletonProps={{
            animation: "wave",
          }}
          muiCircularProgressProps={{
            style: {
              color: "#4F033D",
            },
          }}
          enableMultiRowSelection={true}
          enableRowSelection={true}
          onRowSelectionChange={(updater) => {
            setRowSelection(updater);
          }}
          renderTopToolbarCustomActions={() => {
            return Object.keys(rowSelection).length ? (
              <button
                className="bg-blue-600 text-white rounded-lg p-3 hover:scale-95 transition-all duration-700 "
                onClick={() => {
                  //send notfication
                  setIsUpdate(true);
                }}
              >
                send notification
              </button>
            ) : null;
          }}
        />
      )}
      <DeleteModal
        isOpen={isOpen}
        onConfirm={onConfirmDelete}
        onCancel={closeModal}
        deletingQuery="user"
        deletingField={item?.name ?? ""}
      />
      {/* {isError ? (
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
            isLoading: isLoading,
            rowSelection,
          }}
          muiSkeletonProps={{
            animation: "wave",
          }}
          muiCircularProgressProps={{
            style: {
              color: "#4F033D",
            },
          }}
          enableMultiRowSelection={true}
          // selectAllMode="all
          enableRowSelection={true}
          onRowSelectionChange={(updater) => {
            setRowSelection(updater);
          }}
        />
      )} */}
      <NotificationModal
        formData={formData}
        setFormData={setFormData}
        isOpen={isUpdate}
        onCancel={() => {
          setIsUpdate(false);
          setRowSelection({});
          setFormData({
            body: "",
            title: "",
            imageUrl: "",
          });
        }}
        onConfirm={() => sendMessage()}
      />
      {/* <DeleteModal
        isOpen={isOpen}
        onConfirm={onConfirmDelete}
        onCancel={closeModal}
        deletingQuery="user"
        deletingField={item?.name ?? ""}
      /> */}
    </DefaultLayout>
  );
}
