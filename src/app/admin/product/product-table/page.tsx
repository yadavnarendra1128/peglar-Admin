"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import { useDeleteModal } from "@/context/DeleteModalContext";
import showToast from "../../../../../api/lib/showToast";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";
import { deleteProduct, Product } from "../../../../../api/services/product.service";

// type Product = {
//   id: string;
//   name: string;
//   model_no: string;
//   offer_id: string;
//   qr_count: number;
//   reward_amount: number;


//   categoryId: string;
//   subcategoryId: string;
//   createdAt: string;
//   updatedAt: string;
// };

type ProductType = {
      id: string,
      name: string,
      model_no: string,
      qr_count: number,
      reward_amount: number,
      Category: {
        id:string;
        name: {
      en:string;
      hi:string;
      kn:string
        }
      },
      Subcategory:{
        id: string;
        name: string;
      },
}

export default function ProductTable() {
  const router=useRouter()
  const {item,isOpen,openModal,closeModal}=useDeleteModal()
  const [data, setData] = useState<Product[]>([]);
  const { data:products, isLoading, isError, error } = useProducts();

  const productsData: ProductType[] = useMemo(() => {
    if (data.length==0) return [];
    return data.map((product: Product) => ({
      id: product.id,
      name: product.name,
      model_no: product.model_no,
      qr_count: product.qr_count,
      reward_amount: product.reward_amount,
      Category: product.Category,
      Subcategory: product.Subcategory,
    }))
  }, [data])

  useEffect(()=>{
    if(products)setData(products)
  },[products])

  const onConfirmDelete=async()=>{
      try{
        await deleteProduct(item.id)
        setData((p)=>p.filter((e)=>e.id.toString()!==item.id))
        showToast(true,`Product ${item.name} deleted successfully`)
      }catch(err){
        showToast(false, `Failed to delete product ${item.name}. \n        ${err}`);
      }
    }

  const handleDelete = useCallback((row: MRT_Row<ProductType>) => {
    console.log("Locally deleting product:", row.original.id);
    openModal(row.original as any);
  }, []);

   const handleEdit = (row: MRT_Row<ProductType>)=>{
      console.log("View clicked for:", row.original);
      router.push(`/admin/product/add-product?id=${row.original.id}`)
    }

    const handleVariant = (row: MRT_Row<ProductType>) => {
      console.log("View clicked for:", row.original);
      router.push(`/admin/variant?id=${row.original.id}`);
    };

  const columns = useMemo<MRT_ColumnDef<ProductType>[]>(
    () => [
      {
        header: "Sr. No.",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      { accessorKey: "name", header: "Product Name", size: 220 },
      { accessorKey: "model_no", header: "Model No.", size: 140 },
      // { accessorKey: "offer_id", header: "Offer ID", size: 140 },
      { accessorKey: "qr_count", header: "QR Count", size: 150 },
      {
        accessorKey: "reward_amount",
        header: "Reward (₹)",
        size: 150,
        Cell: ({ cell }) => `₹${cell.getValue<number>() || 0}`,
      },
      {
        accessorFn: (row) => row.Category?.name?.en || "-",
        header: "Category",
        size: 180,
      },
      {
        accessorFn: (row) => row.Subcategory?.name || "-",
        header: "Subcategory",
        size: 180,
      },
      // {
      //   accessorKey: "createdAt",
      //   header: "Created At",
      //   size: 180,
      //   Cell: ({ cell }) =>
      //     cell.getValue<string>()
      //       ? new Date(cell.getValue<string>()).toLocaleString()
      //       : "-",
      // },
      // {
      //   accessorKey: "updatedAt",
      //   header: "Updated At",
      //   size: 180,
      //   Cell: ({ cell }) =>
      //     cell.getValue<string>()
      //       ? new Date(cell.getValue<string>()).toLocaleString()
      //       : "-",
      // },
      {
        id: "actions",
        header: "Actions",
        size: 250,
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
              onClick={() => handleVariant(row)}
              style={{
                background: "#28a745",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Variants
            </button>
            <button
              onClick={() => handleEdit(row)}
              title="Edit Product"
              style={{
                background: "#4F9DFF",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit
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
          Failed to load products: {error?.message}
        </Typography>
      );
    }
    if ((!productsData.length) && (!isLoading)) {
      return (
        <Typography sx={{ p: 2, textAlign: "center" }}>
          No products found.
        </Typography>
      );
    }
    return (
      <MaterialReactTable
        columns={columns}
        data={productsData}
        initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product Table" />
      {renderContent()}
      <DeleteModal isOpen={isOpen} onConfirm={onConfirmDelete} onCancel={closeModal} deletingQuery='product' deletingField={item?.name ?? ''}/>
    </DefaultLayout>
  );
}
