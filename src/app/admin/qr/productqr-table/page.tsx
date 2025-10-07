"use client";

import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { updateQrReward } from "@/api/services/qr.service";
import showToast from "@/api/lib/showToast";
import { useProductsQr } from "@/hooks/useProductsQr";
import UpdateRewardAmount from "@/components/Admin/qr/updateRewardAmount";
import { QrCode } from "@/types/qrCode";
import { useProducts } from "@/hooks/useProducts";

type productList = {
  id: string;
  name: string;
};
type QrCodeTable = {
  id: string;
  product_id: string;
  qr_value: string;
  batch_no: string;
  is_scanned: boolean;
  is_redeemed: boolean;
  scanned_by: string;
  scanned_at: string;
  redeemed_at: string;
  createdAt: string;
  updatedAt: string;
  reward_amount: string;
  product_name: string;
};
export default function CertificateTable() {
   const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data, isLoading, error } = useProductsQr(
    pagination.pageIndex + 1,
    pagination.pageSize
  );

  const productQrData: QrCode[] = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);

  const { data: product, isLoading: productLoading } = useProducts();
  const [productList, setProductList] = useState<productList[]>([]);

  useEffect(() => {
    if (!product?.length) {
      return;
    }
    console.log("AAAAAA", product);
    setProductList(product.map((x) => ({ id: x.id, name: x.name })));
  }, [product]);

  const [defaultValue, setDefaultValue] = useState({
    reward_amount: "",
    batch_no: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const mergeDataTable: QrCodeTable[] = useMemo(() => {
    if (!productQrData) return [];
    return productQrData.map((x) => ({
      ...x,
      product_name: productList.find((p) => x.product_id === p.id)?.name || "",
      scanned_by: x.scanned_by
      ? typeof x.scanned_by === "string"
        ? x.scanned_by
        : x.scanned_by.name || ""
      : "-",
    }));
  }, [productQrData, productList]);

  const columns = useMemo<MRT_ColumnDef<QrCodeTable>[]>(
    () => [
      { accessorKey: "qr_value", header: "QR Value", size: 150 },

      { accessorKey: "batch_no", header: "Batch No", size: 150 },
      {
        accessorKey: "reward_amount",
        header: "Reward",
        size: 100,
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        size: 100,
      },
      {
        accessorKey: "is_scanned",
        header: "Is Scanned",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
      },
      {
        accessorKey: "is_redeemed",
        header: "Is Redeemed",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
      },
      // { accessorKey: "scanned_by", header: "Scanned By", size: 150 },
      {
        accessorKey: "scanned_at",
        header: "Scanned At",
        size: 200,
        Cell: ({ cell }) =>
          new Date(cell.getValue() as string).toLocaleString(),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 200,
        Cell: ({ cell }) =>
          new Date(cell.getValue() as string).toLocaleString(),
      },
    ],
    [productQrData]
  );

  const handleResend = (row: MRT_Row<QrCode>) => {
    console.log("Resend clicked for:", row.original);
    // Add resend logic here
  };

  const handleView = (row: MRT_Row<QrCode>) => {
    console.log("View clicked for:", row.original);
    // Add view logic here
  };

  const handleDownload = (row: MRT_Row<QrCode>) => {
    console.log("Download clicked for:", row.original);
    // Add download logic here
  };

  useEffect(() => {
    const d = Object.keys(rowSelection);
    if (!d.length) {
      setIsUpdate(false);
    }
    if (d.length) {
      const id = parseInt(d[0]);
      const dvalue = productQrData[id];
      console.log("FFFFFFFFFFFFFFFFFFF", dvalue);
      setDefaultValue({
        reward_amount: dvalue.reward_amount,
        batch_no: dvalue.batch_no,
      });
    }
  }, [rowSelection]);
  console.log("SSSSSS", Object.keys(rowSelection));

  //update api call
  const updateReward = async () => {
    try {
      const selectedProduct = productQrData.find(
        (product) => product.batch_no === defaultValue.batch_no
      );
      // console.log(selectedProduct,productOptions,formData.productId)
      if (!selectedProduct) {
        alert("Please select a valid batch_no");
        return;
      }

      // Optional: Commented out check for available QR codes; uncomment if desired // if (qrCountNum > selectedProduct.count) { // alert( //  `Cannot generate ${qrCountNum} QR codes. Only ${selectedProduct.count} available for this product.` // ); // return; // }
      const apiPayload = {
        batch_no: defaultValue.batch_no,
        reward_amount: parseInt(defaultValue.reward_amount),
      };
      const res = await updateQrReward(apiPayload);
      console.log(res);
      if (res.data) {
        console.log(res);
        showToast(true, "reward updated successsdfullly");
      }
    } catch (e) {
      showToast(false, error?.message);
    }
  };

  return (
    <DefaultLayout>
      {
        <UpdateRewardAmount
          productOptions={productQrData}
          formData={defaultValue}
          setFormData={setDefaultValue}
          isOpen={isUpdate}
          onCancel={() => {
            setIsUpdate(false);
            setRowSelection({});
          }}
          onConfirm={() => updateReward()}
        />
      }
      <Breadcrumb pageName="QR Code Table" />
      <MaterialReactTable
        columns={columns}
        data={mergeDataTable}
        state={{
          isLoading: isLoading || productLoading,
          pagination,
          rowSelection,
        }} // Pass the loading state to the table
        manualPagination
        onPaginationChange={(newPagination) => setPagination(newPagination)}
        rowCount={data?.total || 0}
        muiSkeletonProps={{
          animation: "wave",
        }}
        muiCircularProgressProps={{
          style: {
            color: "#4F033D",
          },
        }}
        enableRowSelection={true}
        enableMultiRowSelection={false}
        onRowSelectionChange={(updater) => {
          setRowSelection(updater);
          // setIsUpdate(true);
        }}
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 }, // initial pagination
        }}
        renderTopToolbarCustomActions={() =>
          Object.keys(rowSelection).length ? (
            <button
              onClick={() => {
                setIsUpdate(true);
              }}
              title="update Reward Amount"
              style={{
                background: "#4F9DFF",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              update
            </button>
          ) : null
        }
      />
    </DefaultLayout>
  );
}
