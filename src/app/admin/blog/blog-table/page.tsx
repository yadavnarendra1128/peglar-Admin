"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";

type User = {
  id: number;
  title: string;
  author: string;
  publishedBy: string;
  banner: string;
};

export default function page() {
  const data = [
    {
      id: 1,
      title: "Understanding Your Zodiac Sign",
      author: "John Doe",
      publishedBy: "Astro World",
      banner: "http://dummyimage.com/174x100.png/cc0000/ffffff",
    },
    {
      id: 2,
      title: "How to Read Your Horoscope Effectively",
      author: "Jane Smith",
      publishedBy: "Cosmic Insights",
      banner: "http://dummyimage.com/174x100.png/0000cc/ffffff",
    },
    {
      id: 3,
      title: "The Influence of Moon Phases on Your Life",
      author: "Ali Khan",
      publishedBy: "Lunar Wisdom",
      banner: "http://dummyimage.com/174x100.png/00cc00/ffffff",
    },
    {
      id: 4,
      title: "Understanding Astrology Houses",
      author: "Emily Davis",
      publishedBy: "Astro Universe",
      banner: "http://dummyimage.com/174x100.png/ff6600/ffffff",
    },
    {
      id: 5,
      title: "Mercury Retrograde: What You Need to Know",
      author: "Michael Lee",
      publishedBy: "Planetary Cycles",
      banner: "http://dummyimage.com/174x100.png/6600cc/ffffff",
    },
    {
      id: 6,
      title: "How Sun Signs Influence Your Personality",
      author: "Sophia Brown",
      publishedBy: "The Zodiac Circle",
      banner: "http://dummyimage.com/174x100.png/cc9900/ffffff",
    },
    {
      id: 7,
      title: "Exploring Compatibility in Astrology",
      author: "Chris Walker",
      publishedBy: "Astro Match",
      banner: "http://dummyimage.com/174x100.png/ff0000/ffffff",
    },
    {
      id: 8,
      title: "Astrological Predictions for the Coming Year",
      author: "Emma Wilson",
      publishedBy: "Cosmic Prophecies",
      banner: "http://dummyimage.com/174x100.png/00ffff/ffffff",
    },
    {
      id: 9,
      title: "How Retrograde Planets Affect Your Relationships",
      author: "Daniel Carter",
      publishedBy: "Astro Relationships",
      banner: "http://dummyimage.com/174x100.png/ff66cc/ffffff",
    },
    {
      id: 10,
      title: "The Role of the Ascendant in Astrology",
      author: "Olivia Taylor",
      publishedBy: "The Ascendant Truth",
      banner: "http://dummyimage.com/174x100.png/999999/ffffff",
    },
  ];

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "banner", // access image
        header: "Blog Banner",
        size: 70,
        Cell: ({ cell }) => (
          <img
            src={cell.getValue<string>()}
            alt={cell.row.original.title}
            style={{ width: "70px", height: "auto" }}
          />
        ),
      },
      { accessorKey: "title", header: "blog Title", size: 150 },
      { accessorKey: "author", header: "Author", size: 20 },
      { accessorKey: "publishedBy", header: "Published By", size: 150 },
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="fill-current cursor-pointer"
              width="20"
              height="20"
              fill="none"
              onClick={() => handleUpdate(row)}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#6b7280"
                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="fill-current cursor-pointer"
              width="20"
              height="20"
              fill="none"
              onClick={() => handleDelete(row)}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#6b7280"
                d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
              />
            </svg>
          </div>
        ),
      },
    ],
    []
  );

  const handleUpdate = (row: MRT_Row<User>) => {
    console.log("Update clicked for:", row.original);
    // Add your update logic here
  };

  const handleDelete = (row: MRT_Row<User>) => {
    console.log("Delete clicked for:", row.original);
    // Add your delete logic here
  };
  

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Course Table" />
        <MaterialReactTable
          columns={[...columns]}
          data={data}
          initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
        />
      </DefaultLayout>
    </>
  );
}
