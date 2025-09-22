"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import Select from "@mui/material/Select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@mui/material";

type Payment = {
  key?: string;
  userId: string;
  txnid: string;
  amount: string;
  productinfo: string;

  hash?: string;
};

const Paymentdata = [
  {
    key: "key_12345",
    userId: "user_001",
    txnid: "txn_abc123",
    amount: "1000",
    productinfo: "Online Course Subscription",
  },
  {
    key: "key_67890",
    userId: "user_002",
    txnid: "txn_def456",
    amount: "2000",
    productinfo: "E-book Purchase",
  },
  {
    key: "key_11223",
    userId: "user_003",
    txnid: "txn_ghi789",
    amount: "1500",
    productinfo: "Workshop Ticket",
  },
  {
    key: "key_44556",
    userId: "user_004",
    txnid: "txn_jkl012",
    amount: "500",
    productinfo: "Monthly Membership",
  },
  {
    key: "key_77889",
    userId: "user_005",
    txnid: "txn_mno345",
    amount: "2500",
    productinfo: "Annual Membership",
  },
];

export default function Transition() {
  const router = useRouter();
  const [data, setData] = useState(Paymentdata);

  const columns = useMemo<MRT_ColumnDef<Payment>[]>(() => {
    return [
      {
        accessorKey: "key",
        id: "key",
        header: "Key",
        size: 250,
        enableSorting: false,
        enableColumnActions: false,
      },
      { accessorKey: "userId", header: "User ID", size: 250 },
      { accessorKey: "txnid", header: "Transaction ID", size: 250 },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 250,
        Cell: ({ cell }) => `₹${cell.getValue()}`,
      },
      { accessorKey: "productinfo", header: "Product Info", size: 300 },
    ] as MRT_ColumnDef<Payment>[];
  }, [data]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Transition Table" />
      <MaterialReactTable
        columns={[...columns]}
        data={data}
        initialState={{
          pagination: { pageSize: 5, pageIndex: 0 },
        }}
        enableColumnResizing
      />
    </DefaultLayout>
  );
}
