"use client";

import { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { getAllProductQr } from "@/api/services/qr.service";
import showToast from "@/api/lib/showToast";
import { useProductsQr } from "@/hooks/useProductsQr";
import UpdateRewardAmount from "@/components/Admin/qr/updateRewardAmount";
import { QrCode } from "@/types/qrCode";
import { useProducts } from "@/hooks/useProducts";

// Define a new type for the API response data
// type QrCode = {
//   id: string;
//   product_id: string;
//   qr_value: string;
//   batch_no: string;
//   is_scanned: boolean;
//   is_redeemed: boolean;
//   scanned_by: string;
//   scanned_at: string;
//   redeemed_at: string;
//   createdAt: string;
//   updatedAt: string;
// };
type productList = {
  id: string,
  name: string
}
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
  reward_amount: string,
  product_name: string 

}
export default function CertificateTable() {
  // const [data, setData] = useState<QrCode[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const { data, isLoading, error } = useProductsQr();
  const productQrData: QrCode[] = useMemo(() => {
    if (!data) return []
    return data
  }, [data])
  const { data: product, isLoading: productLoading } = useProducts();
  const [productList, setProductList] = useState<productList[]>([])

  useEffect(() => {
    if (!product?.length) {
      return
    }
    console.log("AAAAAA", product)
    setProductList(product.map(x => ({ id: x.id, name: x.name })))
  }, [product])
  const [defaultValue, setDefaultValue] = useState({
    reward_amount: "",
    batch_no: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [rowSelection, setRowSelection] = useState({});


  const mergeDataTable: QrCodeTable[] = useMemo(() => {
    if (!productQrData) return []
    return productQrData.map(x => ({
      ...x,
      product_name: productList.find((p) => x.product_id === p.id)?.name || ""
    }))
  }, [productQrData, productList])
  const columns = useMemo< MRT_ColumnDef<QrCodeTable>[]>(
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
      //  { accessorKey: "scanned_by", header: "Scanned By", size: 150 },
      //  {
      //    accessorKey: "scanned_at",
      //    header: "Scanned At",
      //    size: 200,
      //    Cell: ({ cell }) => new Date(cell.getValue() as string).toLocaleString(),
      //  },
      //  {
      //    accessorKey: "redeemed_at",
      //    header: "Redeemed At",
      //    size: 200,
      //    Cell: ({ cell }) => new Date(cell.getValue() as string).toLocaleString(),
      //  },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 200,
        Cell: ({ cell }) => new Date(cell.getValue() as string).toLocaleString(),
      },
      // {
      //   id: "actions",
      //   header: "Actions",
      //   Cell: ({ row }) => (
      //     <div style={{ display: "flex", gap: "1.5rem" }}>
      //       {/* The action icons remain the same but will now work with the new data type */}
      //       {/* <svg
      //         xmlns="http://www.w3.org/2000/svg"
      //         viewBox="0 0 512 512"
      //         className="fill-current cursor-pointer"
      //         width="20"
      //         height="20"
      //         fill="none"
      //         onClick={() => handleResend(row)}
      //       >
      //         <path
      //           fillRule="evenodd"
      //           clipRule="evenodd"
      //           fill="#6b7280"
      //           d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"
      //         />
      //       </svg>
      //       <svg
      //         xmlns="http://www.w3.org/2000/svg"
      //         viewBox="0 0 512 512"
      //         className="fill-current cursor-pointer"
      //         width="20"
      //         height="20"
      //         fill="none"
      //         onClick={() => handleView(row)}
      //       >
      //         <path
      //           fillRule="evenodd"
      //           clipRule="evenodd"
      //           fill="#6b7280"
      //           d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"
      //         />
      //       </svg>
      //       <svg
      //         xmlns="http://www.w3.org/2000/svg"
      //         viewBox="0 0 512 512"
      //         className="fill-current cursor-pointer"
      //         width="20"
      //         height="20"
      //         fill="none"
      //         onClick={() => handleDownload(row)}
      //       >
      //         <path
      //           fillRule="evenodd"
      //           clipRule="evenodd"
      //           fill="#6b7280"
      //           d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
      //         />
      //       </svg> */}
      //       {/* <button
      //         onClick={() => {
      //            setIsUpdate(true);
      //         }}
      //         title="update Reward Amount"
      //         style={{
      //           background: "#4F9DFF",
      //           color: "white",
      //           padding: "4px 8px",
      //           borderRadius: "4px",
      //           border: "none",
      //           cursor: "pointer",
      //         }}
      //       >
      //         update
      //       </button> */}
      //     </div>
      //   ),
      // },
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
      showToast(true, "reward updated successsdfullly");
    } catch (e) {
      showToast(false, error?.message);
    }
    // console.log("AAAAAAAAAAAAAAAAAAA",defaultValue)
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
        columns={[...columns]}
        data={mergeDataTable}
        state={{ isLoading: (isLoading || productLoading), rowSelection }} // Pass the loading state to the table
        initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
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
        renderTopToolbarCustomActions={() => (
          Object.keys(rowSelection).length ? <button
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
          </button> : null
        )}

      />

    </DefaultLayout>

  );
}
