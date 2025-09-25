"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { CircularProgress, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import { useDeleteModal } from "@/context/DeleteModalContext";
import showToast from "../../../../../api/lib/showToast";
import { deleteProduct } from "@/api/services/product.service";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";

// Corrected type definition to match the API response
type Product = {
  id: string;
  name: string;
  model_no: string;
  offer_id: string;
  qr_count: number;
  reward_amount: number;
  categoryId: string;
  subcategoryId: string;
  createdAt: string;
  updatedAt: string;
};

// Mock data for local testing
const mockProducts: Product[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Smartphone X",
    model_no: "SM-X-2023",
    offer_id: "OFR-2023-001",
    qr_count: 500,
    reward_amount: 150.0,
    categoryId: "CAT-SMARTPHONES",
    subcategoryId: "SUB-ANDROID",
    createdAt: "2023-10-27T10:00:00Z",
    updatedAt: "2023-10-27T10:00:00Z",
  },
  {
    id: "6e8d1976-905e-40d3-a3d2-3c87e81a3d3c",
    name: "Wireless Earbuds Pro",
    model_no: "WBE-PRO-V2",
    offer_id: "OFR-2023-002",
    qr_count: 1200,
    reward_amount: 50.0,
    categoryId: "CAT-AUDIO",
    subcategoryId: "SUB-EARBUDS",
    createdAt: "2023-10-26T14:30:00Z",
    updatedAt: "2023-10-27T11:00:00Z",
  },
  {
    id: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
    name: "Smart Watch Elite",
    model_no: "SW-ELITE-01",
    offer_id: "OFR-2023-003",
    qr_count: 800,
    reward_amount: 250.0,
    categoryId: "CAT-WEARABLES",
    subcategoryId: "SUB-SMARTWATCH",
    createdAt: "2023-10-25T09:15:00Z",
    updatedAt: "2023-10-25T09:15:00Z",
  },
];

export default function ProductTable() {
  const router=useRouter()
  const {item,isOpen,openModal,closeModal}=useDeleteModal()
  const [data, setData] = useState<Product[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);
  // const [error, setError] = useState<Error | null>(null);
  const { data:products, isLoading, isError, error } = useProducts();

  const productsData: Product[] = useMemo(() => {
    if (!data) return [];
    return data.map((product: Product) => ({
      id: product.id,
      name: product.name,
      model_no: product.model_no,
      offer_id: product.offer_id,
      qr_count: product.qr_count,
      reward_amount: product.reward_amount,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
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

  const handleDelete = useCallback((row: MRT_Row<Product>) => {
    console.log("Locally deleting product:", row.original.id);
    openModal(row.original as any);
  }, []);

   const handleView = (row: MRT_Row<Product>)=>{
      console.log("View clicked for:", row.original);
      router.push(`/admin/add-product?id=${row.original.id}`)
    }

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        header: "Sr. No.",
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "id",
        header: "Product ID",
        size: 140,
        Cell: ({ cell }) => {
          const fullId = cell.getValue<string>();
          const shortId = fullId ? `${fullId.slice(0, 5)}...` : "-";
          const handleCopy = () => {
            if (fullId) {
              navigator.clipboard
                .writeText(fullId)
                .then(() => alert(`Copied Product ID: ${fullId}`))
                .catch((err) => console.error("Failed to copy text: ", err));
            }
          };
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{shortId}</span>
              <IconButton size="small" onClick={handleCopy} disabled={!fullId}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </div>
          );
        },
      },
      { accessorKey: "name", header: "Product Name", size: 220 },
      { accessorKey: "model_no", header: "Model No.", size: 140 },
      { accessorKey: "offer_id", header: "Offer ID", size: 140 },
      { accessorKey: "qr_count", header: "QR Count", size: 100 },
      {
        accessorKey: "reward_amount",
        header: "Reward (₹)",
        size: 120,
        Cell: ({ cell }) => `₹${cell.getValue<number>() || 0}`,
      },
      { accessorKey: "categoryId", header: "Category", size: 180 },
      { accessorKey: "subcategoryId", header: "Subcategory", size: 180 },
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
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 180,
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleString()
            : "-",
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
              title="View Product"
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
    [handleDelete]
  );

  const renderContent = () => {
    // if (isLoading) {
    //   return (
    //     <div
    //       style={{
    //         padding: 24,
    //         display: "flex",
    //         alignItems: "center",
    //         gap: 12,
    //       }}
    //     >
    //       <CircularProgress size={24} />
    //       <Typography>Loading products…</Typography>
    //     </div>
    //   );
    // }
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
