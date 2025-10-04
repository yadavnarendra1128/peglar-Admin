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
import { useCarpenters, useCustomers, useDealers } from "@/hooks/useUsers";
import { Typography } from "@mui/material";
import { useDeleteModal } from "@/context/DeleteModalContext";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";
import showToast from "../../../../api/lib/showToast";
import { BackendUser, deleteUser } from "@/api/services/base.service";
import { formatDateTime } from "@/utils/formatDateTime";
import Notfication from "@/components/Admin/users/sendNotify";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/lib/apiClient";
import { ShieldCheck, ShieldX } from "lucide-react";

type TableUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: string;
  aadhar?: { aadharNumber: string; aadharImage: string };
  panDetails?: { panNumber: string; pamImage: string };
  isVerified: boolean;
  lifetime_earning: string;
  createdAt: string;
  profileImg?: string | null;
  fcm?: string | null;
};

export default function UserTable() {
  const router = useRouter();
  const qc = useQueryClient();
  const [rowSelection, setRowSelection] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const { data, isLoading, isError, error } = useCustomers();
  const {
    data: dealerData,
    isLoading: dealerIsLoading,
    isError: dealerIsError,
    error: dealerError,
  } = useDealers();
  const { data:carpenterData, isLoading:carpIsLoading, isError:carpIsError, error:carpError } = useCarpenters();
  const [selected,setSelected]=useState<'user' | 'carpenter' | 'dealer'>('carpenter')
 const [users, setUsers] = useState<BackendUser[]>();
  const [carps, setCarps] = useState<BackendUser[]>();
  const [dealers, setDealers] = useState<BackendUser[]>();

 const { item, isOpen, openModal, closeModal } = useDeleteModal();
 const [formData, setFormData] = useState({
   body: "",
   title: "",
   imageUrl: "",
 });
  const onConfirmDelete=async()=>{
    try{
      await deleteUser(item.id)
      if (selected == "user") {
        setUsers((p) => {
          const val = p ? p?.filter((e) => e.id.toString() !== item.id) : [];
          if (!val) return [];
          else return val;
        });
        showToast(true, `Customer ${item.name} deleted successfully`);
      } else if (selected == "carpenter") {
        setCarps((p) => {
          const val = p ? p?.filter((e) => e.id.toString() !== item.id) : [];
          if (!val) return [];
          else return val;
        });
        showToast(true, `Carpenter ${item.name} deleted successfully`);
      } else if (selected == "dealer") {
        setDealers((p) => {
          const val = p ? p?.filter((e) => e.id.toString() !== item.id) : [];
          if (!val) return [];
          else return val;
        });
        showToast(true, `Dealer ${item.name} deleted successfully`);
      }
    }catch(err){
      showToast(false, `Failed to delete ${item.name}. \n        ${err}`);
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
      { accessorKey: "name", header: "Name", size: 150 },
      {
  accessorKey: "email",
  header: "Email Address",
  size: 220,
  Cell: ({ cell }) => {
    const value = cell.getValue<string>() || "-";
    return (
      <div
        className="truncate max-w-[220px]" 
        title={value} 
      >
        {value}
      </div>
    );
  },
},
      {
        accessorKey: "phone",
        header: "Mobile No",
        size: 140,
        Cell: ({ cell }) => cell.getValue<string>() || "-",
      },
      {
        accessorKey: "wallet_balance",
        header: "Wallet",
        size: 100,
        enableSorting: true,
        Cell: ({ cell }) => cell.getValue<string>() || "0",
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        size: 160,
        Cell: ({ cell }) => formatDateTime(cell.getValue<string>()),
      },
    ...(selected === "carpenter"
    ? [
        {
          accessorKey: "isVerified",
          header: "Verified",
          enableSorting: true,
          size: 100,
          Cell: ({ row }) => (
            row.original.isVerified ? (
              <span
                title="Verified"
                style={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                <ShieldCheck/>
              </span>
            ) : (
              <span
                title="Not Verified"
                style={{
                  color: "red",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                <ShieldX className="text-red-500"/>
              </span>
            )
          ),
        },
      ]
    : []),
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
    [selected]
  );

  const tableData: TableUser[] = useMemo(() => {
    let list;
    if(selected == 'user'){
      list = users
    }else if(selected=='carpenter'){
      list = carps;
    }else if(selected=='dealer'){
      list = dealers
    }
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
    }, [users,carps,dealers,selected]);

  useEffect(()=>{
    setUsers(data)
    setCarps(carpenterData)
    setDealers(dealerData)
  },[data,carpenterData,dealerData])

  useEffect(() => {
    if (!Object.keys(rowSelection).length) return;

    // const fcmList=UserTable.filter((x,index:number)=>{
    //   if(index===id[index]){
    //     return x
    //   }

    console.log(rowSelection, Object.keys(rowSelection).length);
  }, [rowSelection]);

  const sendMessage = async () => {
    // if (!Object.keys(rowSelection).length)
    //   throw new Error("please select user"+Object.keys(rowSelection));

    if (!formData.body && !formData.title) {
      throw new Error("please  enter information properly");
    }
    const token: string[] = [];
    const id = Object.keys(rowSelection).map((x) => parseInt(x));
    console.log(rowSelection);
    console.log(id)
    for (let r = 0; r < tableData.length; r++) {
      const dataIndex = id[r];
      const fcmToken = tableData[dataIndex]?.fcm;
      console.log("DDDD", fcmToken);
      if (fcmToken) token.push(fcmToken);
    }

    console.log(token,'token')
    const apiPayload = {
      ...formData,
      tokens: token,
    };
    console.log(apiPayload);

    // const token =rowSelection

    const res = await apiClient.post("pushNotification/sendMany", apiPayload);
    showToast(true, "notification sent successfully");
    console.log(res.data);
  };

  return (
    <DefaultLayout>
      {/* Page header with breadcrumb navigation */}
      <Breadcrumb pageName="User Table" />

      <div className="flex gap-2 mb-2 items-center">
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
        <button
          className={`px-4 py-2 rounded-lg cursor-pointer ${
            selected === "user"
              ? "bg-primary border border-primary text-white hover:border-hoverPrimary hover:bg-hoverPrimary"
              : "border border-primary text-primary hover:bg-primary/10 hover:text-white"
          }`}
          onClick={() => setSelected("user")}
        >
          Customers
        </button>
        <button
          className={`px-4 py-2 rounded-lg cursor-pointer ${
            selected === "dealer"
              ? "bg-primary border border-primary text-white hover:border-hoverPrimary hover:bg-hoverPrimary"
              : "border border-primary text-primary hover:bg-primary/10 hover:text-white"
          }`}
          onClick={() => setSelected("dealer")}
        >
          Dealers
        </button>
      </div>

      {(selected === "user" && isError) ||
      (selected === "carpenter" && carpIsError) ||
      (selected === "dealer" && dealerIsError) ? (
        <Typography color="error" sx={{ p: 2 }}>
          Failed to load{" "}
          {selected === "user"
            ? "users"
            : selected === "carpenter"
            ? "carpenters"
            : "dealers"}
          :{" "}
          {selected === "user"
            ? error?.message
            : selected === "carpenter"
            ? carpError?.message
            : dealerError?.message}
        </Typography>
      ) : (
        // Data table
        <MaterialReactTable
          columns={columns}
          data={tableData}
          initialState={{
            pagination: { pageSize: 100, pageIndex: 0 },
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
            isLoading: selected === "user" ?  isLoading : selected == 'carpenter' ? carpIsLoading : dealerIsLoading,
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
          selectAllMode="all"
        />
      )}
      <Notfication
        formData={formData}
        setFormData={setFormData}
        isOpen={isUpdate}
        onCancel={() => {
          setIsUpdate(false);
          setRowSelection({});
        }}
        onConfirm={() => sendMessage()}
      />
      <DeleteModal
        isOpen={isOpen}
        onConfirm={onConfirmDelete}
        onCancel={closeModal}
        deletingQuery="user"
        deletingField={item?.name ?? ""}
      />
    </DefaultLayout>
  );
}
